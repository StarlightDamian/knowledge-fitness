"""Serve the shared static root with fitness-only cache and transformation policy."""
import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import unquote, urlsplit


class StaticHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        path = unquote(urlsplit(self.path).path)
        if path == '/fitness' or path.startswith('/fitness/'):
            # Cloudflare honors no-transform instead of injecting its analytics beacon.
            self.send_header('Cache-Control', 'public, no-cache, no-transform')
        super().end_headers()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('port', type=int, nargs='?', default=11003)
    parser.add_argument('--bind', default='127.0.0.1')
    parser.add_argument('--directory', required=True)
    args = parser.parse_args()
    handler = partial(StaticHandler, directory=args.directory)
    with ThreadingHTTPServer((args.bind, args.port), handler) as server:
        server.serve_forever()


if __name__ == '__main__':
    main()
