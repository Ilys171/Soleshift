# SoleShift Kids

Early foot screening for children — a foot-pressure platform, structured reports for orthopedic specialist assessment, and consent-based referral.

**Screening ≠ Diagnosis.** SoleShift Kids is not a medical diagnostic system and does not manufacture insoles. It records a child's foot contact and pressure distribution, produces a structured report for specialist assessment, and — only with separate parental consent — forwards that report to partner clinics or manufacturers, who decide on next steps independently.

## What's in this repo

This repo currently holds the project's marketing/informational website: a static, single-page site describing the concept, how the system works, the hardware, privacy/consent policy, and the roadmap.

```
index.html      main page
css/style.css   styling, palette, layout, animations
js/main.js      nav, scroll reveals, count-up stats, FAQ accordion, hero pressure-map animation
```

No build step or dependencies — it's plain HTML/CSS/JS.

## Running locally

Serve the folder with any static file server, e.g.:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Project scope

- **Hardware:** an enclosed platform with 8 force-sensing (FSR) pads in a foot-shaped layout, read by an ESP32. It measures contact pattern and load distribution — not 3D foot shape (no length, width or arch height).
- **Software:** measurement, quality control and a structured digital report for orthopedic specialist assessment.
- **Process:** measurement → quality control → specialist assessment → communication with families → where recommended, custom insoles produced through partners.

Honest boundaries that apply everywhere in this project: no diagnoses, no measurement without parental consent, anonymized data by default, real numbers only, honest naming of the analysis (rule-based/classifier, not "diagnostic AI"), and partners — not SoleShift Kids — provide treatment or manufacturing.

## Status

Results to date (from the project documentation reviewed by scientific supervisor Dr. Aydin Gahramanov, letter of 17 May 2025):

- 10 implementation sites: 8 rural schools and 2 orthopedic centers
- 602 unique participants (incl. 473 students from rural schools); 328 measurement sessions
- 276 participants' data reviewed by orthopedic specialists; custom insoles recommended for 216; 173 pairs produced and delivered through partners
- 1,570 students, parents and educators reached through foot-health education sessions
- 105 local coordinators and site staff trained; 4 partner organizations in manufacturing and logistics

These confirm documented project activity; they are not clinical validation, medical device certification or regulatory approval.

## Team

- Ilys Taghiyev — measurement software, data validation, digital reporting; device instructor
- Youssef El Haroun — electrical prototype, system integration, service process
- Vahid Musayev — mechanical design, platform stability and durability
- Jeyla Ahmadzada — screening methodology, coordination with orthopedic specialists
- Mikayil Ahmadbayli — sensor circuits, calibration, foot biomechanics analysis

Scientific supervisor: Dr. Aydin Gahramanov, Doctor of Medical Sciences.

## Contact

soleshift17@gmail.com
