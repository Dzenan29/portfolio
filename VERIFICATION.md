# Verification checklist

Everything on the site was written from the project brief and the previous portfolio. Nothing was invented, but some
statements need **your** confirmation before the site goes live. Tick each box, then set `verification: "verified"` on
the entry in `src/content/`.

## Must check before publishing

### Personal & contact (`src/content/site.ts`)
- [ ] Email `dzenankusi00@gmail.com` is the address you want public (it was on the old site).
- [ ] LinkedIn URL is correct.
- [ ] CV: the old PDF was **removed** from the site (it predates this version and may conflict with dates). Add a current one to `public/` and set `contact.resume`.

### Experience (`src/content/experience.ts`)
- [x] Ruhr-Universität Bochum: start **Nov 2022** confirmed.
- [ ] Title "IT Administration / Research IT" and bullets match your actual scope (group-wide work is phrased as contribution).
- [x] Freelance web development & logistics, Dortmund 2020-2022 - keep.
- [ ] Dainese: title "IT System Administrator", 2019-2020 - confirm title and dates.
- [x] Hotel: employer stays unnamed ("Hotel & spa resort, Tuscany"). Period 2018-2019 still to confirm.
- [x] Banking internship, Siena 2018: employer and stack stay unnamed.
- [ ] FH Dortmund: "Computer Science (studies in progress)" - exact programme name?
- [ ] Languages (from old site): Italian & Bosnian native, English fluent, German C1.

### Projects (`src/content/projects.ts`)
- [ ] **Gauge reader (A1):** professional or independent project? Is MQTT used (currently *not* claimed)? OK to publish the UI screenshot (`public/gauge-reader-ui.webp`)? Note: the screenshot shows "Value: 9.0 bar" while the needle points near 200 - a calibrated screenshot would be more convincing to engineers.
- [ ] **Gas monitoring (A2):** which readings come from the ESP32 reader vs. existing instruments? Which notification channel?
- [ ] **Proxmox (B1):** which services run at work vs. in a personal homelab (Immich, Home Assistant …)? OK to name them?
- [ ] **Deployment (B5):** AD/GPO is described as *pilot scope* - correct?
- [ ] **Reliability (C4):** incidents described generically - keep it that way.
- [ ] **Glovebox (A3):** manufacturer intentionally not named. Which stages are implemented? (diagram marks ingestion + dashboards as planned)
- [ ] **Temperature monitoring (A4):** mark which components are done vs. planned.
- [ ] **GPU workstation (E2):** what is installed vs. planned?
- [ ] **CV editor (D7):** shown as *planned* per brief - your GitHub suggests active development. Change status if appropriate.
- [ ] **Hobby line on About page:** 3D design/printing (from old site).

### Not published yet (`publish: false`)
- [ ] A6 3D-printed enclosures - needs real photos/designs.
- [ ] B6 Windows MDT - confirm your implementation scope.
- [ ] D1 Balance Stream - confirm interfaces and scope.
- [ ] D3 Lab journal connector - confirm responsibilities.
- [ ] D4 Research group website - needs authorization.

## Privacy rules (keep following these)
- No internal hostnames, IPs, URLs, logs, screenshots of internal tools, or colleague names.
- No university logos or wording that suggests speaking for the university.
- Diagrams stay generalized (`pve-a`, `vm-apps`, `backup-nas` …).
- `npm test` fails if private IP ranges, `*.rub.de` / `ruhr-uni-bochum.de` hosts or excluded project names appear in the content.
