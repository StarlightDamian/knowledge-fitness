import importlib.util
from functools import partial
from http.client import HTTPConnection
from http.server import ThreadingHTTPServer
from pathlib import Path
import tempfile
from threading import Thread
import unittest

spec = importlib.util.spec_from_file_location('server', Path(__file__).parents[1] / 'src/serve-static.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class StaticServerTest(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        root = Path(self.directory.name)
        for folder in ('home', 'fitness'):
            (root / folder).mkdir()
            (root / folder / 'index.html').write_text(folder)
        self.server = ThreadingHTTPServer(('127.0.0.1', 0), partial(module.StaticHandler, directory=str(root)))
        self.worker = Thread(target=self.server.serve_forever, daemon=True)
        self.worker.start()

    def tearDown(self):
        self.server.shutdown()
        self.server.server_close()
        self.worker.join()
        self.directory.cleanup()

    def request(self, path, headers=None):
        connection = HTTPConnection('127.0.0.1', self.server.server_port)
        connection.request('GET', path, headers=headers or {})
        response = connection.getresponse()
        result = response.status, dict(response.getheaders()), response.read()
        connection.close()
        return result

    def test_fitness_policy_covers_document_redirect_and_revalidation(self):
        status, headers, body = self.request('/fitness/')
        self.assertEqual((status, body), (200, b'fitness'))
        self.assertEqual(headers['Cache-Control'], 'public, no-cache, no-transform')
        for path in ('/fitness/index.html', '/fitness/?view=test'):
            self.assertEqual(self.request(path)[1]['Cache-Control'], headers['Cache-Control'])
        status, redirect, _ = self.request('/fitness')
        self.assertEqual(status, 301)
        self.assertEqual(redirect['Location'], '/fitness/')
        self.assertEqual(redirect['Cache-Control'], headers['Cache-Control'])
        status, cached, _ = self.request('/fitness/', {'If-Modified-Since': headers['Last-Modified']})
        self.assertEqual(status, 304)
        self.assertEqual(cached['Cache-Control'], headers['Cache-Control'])

    def test_other_paths_keep_standard_static_server_behavior(self):
        status, headers, body = self.request('/home/')
        self.assertEqual((status, body), (200, b'home'))
        self.assertNotIn('Cache-Control', headers)
        status, headers, _ = self.request('/fitness-other/')
        self.assertEqual(status, 404)
        self.assertNotIn('Cache-Control', headers)
        self.assertEqual(self.request('/fitness/unknown/')[0], 404)


if __name__ == '__main__':
    unittest.main()
