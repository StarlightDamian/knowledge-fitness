# Lift Atlas

## [Use online → www.zengyuwei.cn/fitness/](https://www.zengyuwei.cn/fitness/)

Open the link above to use the website. No download or installation is needed.

Want to build muscle or lose fat? Find out what equipment does, how to organize training, and how to adjust it. Lift Atlas brings equipment, practical templates and research sources together in a fitness atlas.

**Understand your training. Then make it better.** Start with an option you can repeat; adapt it using your training records and recovery.

[中文](README.md) · [Equipment catalog](docs/EQUIPMENT_CATALOG.md) · [Adversarial review (Chinese)](docs/ADVERSARIAL_REVIEW.md)

## Find an answer

| Your question | Where to look |
|---|---|
| What does this machine do, and what should I check first? | Equipment atlas and its uses/cautions |
| What can I do with my equipment and time? | Plan matching, after completing the safety screen |
| How do free weights and machines compare? | Comparison table and exercise equipment options |
| How many sets, reps and rest periods? How do I progress? | Session tables and the template's progression notes |
| Should fat loss include resistance training? Must every set reach failure? | Knowledge cards and training methods |
| How do I record changes? | Optional local metrics, export and deletion |
| What is missing, and how strong is the evidence? | [Coverage audit](docs/COVERAGE.md), [review](docs/ADVERSARIAL_REVIEW.md) and source scopes |

## What ships

140 equipment records in 12 primary families; a complete comparison table and CSV export; up to six side-by-side selections; 12 educational training templates; 35 concise knowledge cards; 34 movement summaries; 14 training methods; 12 population pathways; 36 source documents with statement-specific scope notes. No invented equipment efficacy scores.

Professional content is complete in Simplified Chinese and English. Navigation/entry labels are available for 12 locales. Other professional text visibly falls back to English, or Simplified Chinese for Traditional Chinese. This is **not twelve fully translated clinical editions**.

The major commercial-gym and home-training families are broadly represented; public outdoor facilities still have gaps. The 95% everyday-equipment coverage figure is a **target, not a measured result**. There is no verified market denominator. Records include support, recovery and measurement tools, and some parent/child categories overlap. The record count is not a count of distinct market types or branded models.

## Use and publish

**Visit [www.zengyuwei.cn/fitness/](https://www.zengyuwei.cn/fitness/)**. No download, account or installation is needed. The hosted version also processes records in your browser and saves them locally only with explicit consent.

Open the prebuilt `index.html`, or run `python -m http.server 8000` and visit `http://localhost:8000`. All runtime resources are embedded: no CDN, account, tracking, API key or data upload. File-protocol storage depends on browser policy.

[Project repository](https://github.com/StarlightDamian/knowledge-fitness). Download the offline HTML or clone the repository:

```bash
git clone https://github.com/StarlightDamian/knowledge-fitness.git
cd knowledge-fitness
python -m http.server 8000
```

The official site runs on a privately managed server at `/fitness/`; see [deployment and rollback](docs/DEPLOYMENT.md). Pushes to `main` run validation, unit tests and browser checks; they do not automatically update that server. GitHub previews HTML as source code, so use the online link above or download it for offline use.

The optional GitHub Pages workflow remains manual and publishes a separate copy. It does not manage the official server URL.

Alternatively publish `main / (root)` from a branch using the committed `index.html`, rebuilding and committing it whenever content changes. Choose one publishing mode.

## Development

Node.js 22+; no npm dependencies are needed for the core app, validation, build or unit tests.

```bash
npm run check
node src/audit-coverage.mjs docs/coverage_observations.json
python -m pip install -r tests/requirements.txt
python -m playwright install chromium
npm run test:browser
python tests/browser_smoke.py --url https://www.zengyuwei.cn/fitness/
```

Code lives under `/src`, tests under `/tests`. New equipment records are discovered automatically; add one JSON file to `src/data/equipment/`, then validate and build. To make that equipment usable in a particular plan, separately review/update the relevant exercise's AND/OR `equipmentOptions`.

## Evidence and safety

Sources were desk-checked on 2026-09-29. Metadata validation and multiple citations are **not independent clinical review**. Reviews can share underlying trials, manufacturer catalogs do not establish clinical effectiveness, and absence of a statistically significant difference does not prove equivalence. The UI and audit files distinguish direct support, context and editorial implementation.

Templates apply only within a narrowly defined healthy-adult educational scope. Symptoms, unknown safety answers, relevant conditions, pregnancy/postpartum, minors and older-adult adaptation needs route away from automatic standard-template matching. The age boundary is a product scope limitation, **not a claim that older people should stop exercising**. No diagnosis, individual rehabilitation protocol, calorie-deficit prescription or medical clearance is produced.

Optional logs are stored only after explicit consent, in the current browser. They are not encrypted, synced or backed up by the app. Export and deletion controls are included. Do not post private health records publicly.

## Verification limits

See [the verification report](docs/TEST_REPORT.md) for the current commands, results and untested environments. Browser tests provide both a real local HTTP mode and a document mode; document-mode checks use a memory Storage adapter and cannot establish persistent storage or deployed-site behavior.

## License

Code: MIT. Original content/data organization/SVG: CC BY 4.0. Third-party papers, marks and linked materials retain their own rights. The SVGs are original programmatic schematics, not generated anatomical teaching images. The image-generation connector was unavailable during production.

Inspired by `eternity4719/HowToLiveBetter` and `cdyforever/how-to-live-better`; independently written, not a content mirror. Independent professional review, broader translations, sampled coverage and model-specific checks remain explicit release follow-ups, not silently completed claims.
