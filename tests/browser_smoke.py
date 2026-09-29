"""Browser integration checks. Install tests/requirements.txt first.

--mode http exercises a real local origin; --mode document renders the complete
HTML in memory when navigation is disallowed by the host's browser policy.
Document mode explicitly uses a memory Storage adapter for save-flow checks;
it does NOT establish real localStorage persistence, file://, or Pages deployment.
"""
from __future__ import annotations
import argparse
import json
import os
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from threading import Thread
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]

def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument('--mode', choices=['http', 'document'], default='http')
    parser.add_argument('--output', default='test-results/browser')
    args = parser.parse_args()
    output = ROOT / args.output
    output.mkdir(parents=True, exist_ok=True)
    html = (ROOT / 'index.html').read_text(encoding='utf-8')
    results = []
    server = None
    if args.mode == 'http':
        server = ThreadingHTTPServer(('127.0.0.1', 0), partial(SimpleHTTPRequestHandler, directory=str(ROOT)))
        Thread(target=server.serve_forever, daemon=True).start()
    def check(name: str, condition: bool) -> None:
        results.append({'name': name, 'passed': bool(condition)})
        assert condition, name
    try:
        with sync_playwright() as p:
            launch = {'headless': True, 'args': ['--no-sandbox']}
            if os.getenv('PLAYWRIGHT_CHROMIUM_PATH'):
                launch['executable_path'] = os.environ['PLAYWRIGHT_CHROMIUM_PATH']
            browser = p.chromium.launch(**launch)
            context = browser.new_context(viewport={'width': 1440, 'height': 1050}, device_scale_factor=1)
            page = context.new_page()
            errors, requests = [], []
            page.on('pageerror', lambda error: errors.append(str(error)))
            page.on('request', lambda req: requests.append(req.url))
            if server:
                page.goto(f'http://127.0.0.1:{server.server_port}/dist/index.html', wait_until='load')
            else:
                page.set_content(html, wait_until='load')
            page.wait_for_timeout(60)
            def go(route: str) -> None:
                page.evaluate('(route) => {location.hash=route;}', route)
                page.wait_for_timeout(70)
            def submit_plan() -> None:
                page.locator('#plan-form button[type=submit]').click()
                page.wait_for_timeout(30)
            count = page.evaluate('D.equipment.length')
            check('home contains current catalog count', str(count) in page.locator('.stats-grid').first.inner_text())
            check('initial JS has no uncaught errors', not errors)
            page.screenshot(path=str(output / 'desktop.png'), full_page=True)
            for route in ['equipment','compare','plans','knowledge','methods','populations','metrics','evidence']:
                go(route)
                check('route renders '+route, page.locator('#main h1').count() == 1)
            go('equipment')
            page.locator('#eq-search').fill('哑铃')
            check('Chinese equipment filter', '哑铃' in page.locator('#equipment-results').inner_text())
            page.locator('[data-compare=dumbbell]').click()
            page.locator('#eq-search').fill('杠铃')
            page.locator('[data-compare=barbell]').click()
            go('compare')
            check('compare contains all catalog rows', page.locator('.inventory-table tbody tr').count() == count)
            check('two selected equipment columns', page.locator('.comparison-table thead th').count() == 3)
            page.screenshot(path=str(output / 'compare.png'), full_page=False)
            page.locator('#table-sort').select_option('family')
            check('sorting retains complete table', page.locator('.inventory-table tbody tr').count() == count)
            with page.expect_download() as download_info:
                page.locator('#export-equipment').click()
            download = download_info.value
            download.save_as(str(output / 'equipment.csv'))
            check('full CSV exported', 'dumbbell' in (output/'equipment.csv').read_text(encoding='utf-8-sig'))
            go('equipment/dumbbell')
            check('equipment detail renders unique record', '哑铃' in page.locator('#main h1').inner_text())
            check('reference links use HTTPS', all(x.startswith('https://') for x in page.locator('.source-links a').evaluate_all('(els)=>els.map(x=>x.href)')))
            go('plans')
            page.locator('[name=age]').fill('30')
            submit_plan()
            check('unknown safety answers fail closed', not page.locator('#recommend-results .plan-card').count())
            page.locator('[name=urgent]').select_option('no')
            page.locator('[name=health]').select_option('healthy')
            page.locator('.equipment-picker summary').click()
            page.locator('[data-preset=db]').click()
            submit_plan()
            check('known dumbbell inventory returns feasible plan', page.locator('#recommend-results a[href="#plans/muscle-db-2"]').count() >= 1)
            page.locator('[name=minutes]').select_option('20')
            check('changing constraints invalidates old results', page.locator('#recommend-results .plan-card').count()==0)
            submit_plan()
            check('time budget not relaxed automatically', page.locator('#recommend-results .plan-card').count()==0)
            page.locator('[name=minutes]').select_option('60')
            page.locator('[name=query]').fill('胸痛 增肌')
            submit_plan()
            check('symptom query blocks recommendation', page.locator('#recommend-results [role=alert]').count()==1 and page.locator('#recommend-results .plan-card').count()==0)
            page.locator('[name=query]').fill('')
            page.locator('[name=health]').select_option('pregnancy')
            submit_plan()
            check('pregnancy routes to assessment', page.locator('#recommend-results .plan-card').count()==0)
            page.locator('[name=health]').select_option('healthy')
            page.locator('[name=age]').fill('70')
            submit_plan()
            check('older adult route is educational, not standard template', page.locator('#recommend-results .plan-card').count()==0)
            page.locator('[name=age]').fill('30')
            go('plans/muscle-db-2')
            check('plan includes sets, reps and RIR', 'RIR' in page.locator('#main').inner_text() and page.locator('#main table').count()>0)
            row = page.locator('tr').filter(has=page.locator('[data-exercise="db-row"]')).first
            check('unilateral 8-12 reps are translated per side', '8–12 / 侧' in row.inner_text())
            page.screenshot(path=str(output / 'plan.png'), full_page=True)
            page.locator('#language').select_option('en')
            row = page.locator('tr').filter(has=page.locator('[data-exercise="db-row"]')).first
            check('English unilateral reps retain per-side meaning', '8–12 / side' in row.inner_text())
            page.locator('#language').select_option('zh-CN')
            go('plans/fat-walk-cycle')
            progression = page.locator('.two-columns .panel').first.inner_text()
            check('cycling progression uses duration without rep-ceiling instructions', '分钟' in progression and '次数上限' not in progression)
            page.locator('#global-query').fill('<img src=x onerror=alert(1)>')
            page.locator('#global-form').evaluate('(f)=>f.requestSubmit()')
            page.wait_for_timeout(70)
            check('search query is escaped, not inserted as markup', page.locator('#main img').count()==0)
            page.locator('#global-query').fill('가슴 통증')
            page.locator('#global-form').evaluate('(f)=>f.requestSubmit()')
            page.wait_for_timeout(70)
            check('Korean symptom gate works in browser', page.locator('#main [role=alert]').count()==1)
            go('knowledge')
            page.locator('[data-knowledge]').first.click()
            check('knowledge detail opens accessible dialog', page.locator('dialog[open]').count()==1)
            page.keyboard.press('Escape')
            check('dialog closes on Escape', page.locator('dialog[open]').count()==0)
            for lang in ['en','zh-TW','es','fr','de','pt','ja','ko','ru','ar','hi','zh-CN']:
                page.locator('#language').select_option(lang)
                check('language '+lang+' has correct document language', page.locator('html').get_attribute('lang') == lang)
                if lang not in ['en','zh-CN']:
                    check('fallback disclosure '+lang, bool(page.locator('#language-notice').inner_text().strip()))
            page.locator('#language').select_option('ar')
            check('Arabic document RTL', page.locator('html').get_attribute('dir')=='rtl')
            page.locator('#language').select_option('zh-CN')
            page.locator('#theme').click()
            check('dark theme toggles', page.locator('html').get_attribute('data-theme')=='dark')
            page.locator('#theme').click()
            go('metrics')
            page.locator('[name=metricAge]').fill('30')
            page.locator('[name=eligible]').check()
            page.locator('[name=weight]').fill('70')
            page.locator('[name=height]').fill('175')
            page.locator('#calc-metrics').click()
            check('BMI computed with cm->m conversion', '22.9' in page.locator('#metric-calculation').inner_text())
            if args.mode == 'document':
                # Explicit adapter: this checks app save flows, not disk persistence.
                page.evaluate('''() => { const m=new Map(); storage={getItem:k=>m.has(k)?m.get(k):null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k)}; }''')
            page.locator('[name=consent]').check()
            page.locator('#metric-form button[type=submit]').click()
            check('explicitly consented record enters history', '70.0' in page.locator('#metric-history').inner_text())
            check('weight chart has accessible title', page.locator('.weight-chart > title').count()==1)
            check('no accidental zero values in missing optional fields', page.evaluate('getLogs()[0].waist === null && getLogs()[0].sleepHours === null'))
            if args.mode == 'http':
                page.reload(wait_until='load')
                check('HTTP-origin localStorage persists on reload', page.evaluate('getLogs().length')==1)
            page.once('dialog', lambda dialog: dialog.accept())
            page.locator('#clear-logs').click()
            check('explicit delete clears records', page.evaluate('getLogs().length')==0)
            page.evaluate("state.query=''")
            for width in [390,768,1440]:
                page.set_viewport_size({'width':width,'height':900})
                go('home')
                check(f'home no viewport overflow at {width}', page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'))
                if width==390:
                    page.screenshot(path=str(output/'mobile.png'),full_page=True)
                go('compare')
                check(f'comparison scroll contained at {width}', page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'))
            check('all tested routes free of uncaught JS errors', not errors)
            app_requests=[r for r in requests if not (server and r.startswith(f'http://127.0.0.1:{server.server_port}/')) and not r.startswith('blob:')]
            check('no external runtime network requests', not app_requests)
            browser.close()
    finally:
        if server:
            server.shutdown()
        report={'mode':args.mode,'passed':sum(r['passed'] for r in results),'checks':results,'limitations': 'Document mode: browser navigation blocked in authoring host. No file://, hosted HTTP, real localStorage persistence or live GitHub Pages acceptance. Save flow uses explicit memory adapter.' if args.mode=='document' else 'Local HTTP only; does not verify live GitHub Pages or file://.'}
        (output/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
    print(f"PASS: {len(results)} browser checks ({args.mode} mode). Report: {output/'report.json'}")

if __name__ == '__main__':
    main()
