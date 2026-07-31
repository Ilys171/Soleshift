# SoleShift Kids

Early digital foot screening for children — 3D scanning, automated analysis, and consent-based referral to specialists.

**Screening ≠ Diagnosis.** SoleShift Kids is not a medical diagnostic system and does not manufacture insoles. It scans a child's foot, produces a clear automated report for parents, and — only with separate parental consent — forwards that report to partner clinics or manufacturers, who decide on next steps independently.

## What's in this repo

This repo currently holds the project's marketing/informational website: a static, single-page site describing the concept, how the system works, the hardware, privacy/consent policy, and the roadmap.

```
index.html      main page
css/style.css   styling, palette, layout, animations
js/main.js      nav, scroll reveals, count-up stats, FAQ accordion, hero point-cloud animation
```

No build step or dependencies — it's plain HTML/CSS/JS.

## Running locally

Serve the folder with any static file server, e.g.:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Project scope

- **Hardware:** a 3D foot scanner (multi-camera photogrammetry / depth camera / laser + camera).
- **Software:** a pipeline from scan → point cloud → measurements (length, width, arch height, shape) → plain-language report.
- **Pilot:** a single school screening day, with parental consent, real metrics, and no fabricated numbers.
- **Partnerships:** schools first, then orthopedic clinics/manufacturers, then (optionally) ministry-level outreach — only after there's a working prototype and pilot to show.

Honest boundaries that apply everywhere in this project: no diagnoses, no scanning without parental consent, anonymized data by default, real numbers only, honest naming of the analysis (rule-based/classifier, not "diagnostic AI"), and partners — not SoleShift Kids — provide treatment or manufacturing.

## Status

Idea → prototype stage. Hardware, scanning pipeline, and pilot are in progress. The website's Pilot Results section is intentionally left out until there are real numbers to publish.

## Team

- Founder & Project Lead
- Hardware Lead
- Software & AI Lead
- Web & Design Lead

(Roles to be filled in with names as the team is finalized.)

## Contact

hello@soleshiftkids.org
