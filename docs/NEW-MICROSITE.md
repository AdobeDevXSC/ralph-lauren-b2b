# Creating a cobranded microsite

Step-by-step checklist for turning the **Ralph Lauren B2B Boilerplate** into a new Ralph Lauren × partner microsite. Agents follow the same steps; see `AGENTS.md` § Creating a cobranded microsite for the Stardust details.

Placeholders: `<org>` is the GitHub organisation, `<site>` the new repository (and Document Authoring site) name, `<partner>` the partner slug.

## Prerequisites

- Access to the boilerplate repo `AdobeDevXSC/ralph-lauren-b2b` and its Document Authoring site `adobedevxsc/ralph-lauren-b2b`.
- A Document Authoring organisation where you can create the new site.
- The partner brand input: the partner's website URL **or** a brand kit (logo files and colour values).
- Agent tooling: the Stardust and impeccable add-ons enabled (`.agents/settings.json`), Node 22+.
- Approvals contact on the Ralph Lauren brand team and the partner brand team.

## 1. Create the repository

1. On GitHub, open `AdobeDevXSC/ralph-lauren-b2b` and choose **Use this template → Create a new repository** (`<org>/<site>`).
2. Clone it and add the boilerplate as `upstream`:
   ```bash
   git clone https://github.com/<org>/<site>.git && cd <site>
   git remote add upstream https://github.com/AdobeDevXSC/ralph-lauren-b2b.git
   git fetch upstream
   ```
3. Install the [AEM Code Sync GitHub app](https://github.com/apps/aem-code-sync) on the new repository.
4. `npm install`, then start the dev server: `npx -y @adobe/aem-cli up --no-open`.

## 2. Create and connect the Document Authoring site

1. Create the site in Document Authoring: `https://da.live/#/<org>/<site>`.
2. Point the code at it: create `fstab.yaml` in the repo root:
   ```yaml
   mountpoints:
     /: https://content.da.live/<org>/<site>/
   ```
   (or set the content source in the site configuration if your organisation uses the configuration service).
3. Copy the starter content from the boilerplate (nav, footer, homepage, block library and the Library panel entry). Preview first, then apply:
   ```bash
   node tools/new-microsite/copy-starter-content.mjs --to <org>/<site>
   node tools/new-microsite/copy-starter-content.mjs --to <org>/<site> --apply
   ```
   The script needs a `DA_TOKEN` with access to both sites (keep it in `.env`, which is git-ignored).
4. In Document Authoring, preview the copied pages so the microsite preview at `https://main--<site>--<org>.aem.page/` shows the Ralph Lauren starter site.

## 3. Record the partner

1. `cp brand/cobrand/partner.example.json brand/cobrand/partner.json` and fill in name, programme, audience and source.
2. Add the partner logo files to `brand/cobrand/logos/` (SVG preferred, plus an on-dark version).
3. Capture colours:
   - **Partner URL:** let the agent capture the partner's logo, palette and type (see `AGENTS.md` step 3).
   - **Brand kit:** enter the supplied values.
4. Choose the accent set (`accent`, `accentContrast`, `accentSoft`, `accentOnImage`) and record measured contrast ratios under `contrastChecks`; every pair must meet `brand/rl/COBRAND-RULES.md` § 2.2.
5. Copy the accents into `styles/cobrand.css`.

## 4. Add the partner lockup

1. Upload the partner logos to Document Authoring.
2. In the **nav** document, add the partner logo as a second paragraph in the logo section, after the Ralph Lauren wordmark (link it to the partner site if wanted).
3. In the **footer** document, add a section after the "Follow us on" section: a paragraph `In partnership with`, then a paragraph with the partner logo.
4. Update nav links and footer links for the microsite as needed. Ralph Lauren legal links stay.

## 5. Design the microsite with Stardust

1. **Review examples first.** The agent builds three homepage examples within the cobrand rules:
   - **A · Flagship:** faithful, with the partner present but quiet.
   - **B · Partner Spotlight:** the programme-led composition with one accent band.
   - **C · Cinematic:** A's structure with motion.

   Each example is checked against the guidelines at desktop and mobile widths. All three are shown side by side with screenshots, and you pick one, ask for a mix, or ask for changes. See `AGENTS.md` § Brand site requests: examples first.
2. **Build the chosen direction.** The rest of the Stardust workflow in `AGENTS.md` § Creating a cobranded microsite:
   - prototype the remaining pages;
   - deploy (`stardust:deploy` / `stardust:rollout`);
   - verify (`stardust:diff`, `stardust:qa`, `tools/cobrand-check`).

## 6. Review and publish

1. Work through the review checklist in `brand/rl/COBRAND-RULES.md` § 6.
2. Get sign-off from the Ralph Lauren and partner brand teams; record it under `approvals` in `partner.json`.
3. Open a pull request with the preview link, run `npm run lint`, check PageSpeed (target 100), merge.
4. Publish the pages from Document Authoring.

## 7. Keep up to date with the boilerplate

```bash
git fetch upstream
git merge upstream/main
```

- Conflicts in Ralph Lauren core files (see `AGENTS.md` § Protected files): take the upstream version.
- Conflicts in partner files (`styles/cobrand.css`, `brand/cobrand/`, `blocks/cb-*`, root `PRODUCT.md` / `DESIGN.md` / `DESIGN.json`, `stardust/`): keep the microsite version.
- Re-run `npm run lint` and check the preview after every merge.
