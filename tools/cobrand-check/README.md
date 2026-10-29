# Cobrand guideline check

`cobrand-check.js` checks a rendered page against `brand/rl/COBRAND-RULES.md`. Run it on every example direction before showing it to anyone, and on every page before publishing.

It defines `window.cobrandCheck(options)` inside the page and returns:

```json
{ "passed": true, "url": "…", "viewport": "1440x900", "families": ["libre caslon text", "hanken grotesk", "dm mono"], "counts": {}, "findings": [] }
```

## Rules checked

| Rule id | What fails |
|---|---|
| `typeface` | Text set in anything other than the three Ralph Lauren families |
| `navy-text` | Body text or headings on a light ground that are not RL Navy |
| `heading-weight` | h1–h5 heavier than 400 |
| `primary-button` | A primary button on a light ground that is not navy with white text |
| `link-blue` | Ledger Blue used anywhere except inline links in running text |
| `square-corners` | Rounded corners (small round controls such as carousel arrows excepted) |
| `no-shadow` | Any box shadow |
| `no-gradient` | Gradient backgrounds (one-colour drawn lines excepted) |
| `contrast` | Text below WCAG AA on a flat ground (4.5:1, or 3:1 for large text) |
| `lockup-order`, `lockup-size` | Partner logo before or wider than the Ralph Lauren wordmark |
| `accent-bands` | More than one `cobrand-accent` section on a page |

Text over photography (hero, teaser overlays, carousel slides) is skipped by the contrast and navy checks; review it visually.

## Running it

With the Playwright MCP tools (`browser_run_code`), on the Edge Delivery preview or a Stardust prototype file. Pages must be scrolled first so lazy blocks load:

```js
async (page) => {
  await page.addInitScript({ path: '<repo>/tools/cobrand-check/cobrand-check.js' });
  const results = {};
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('<page or prototype URL>');
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 700) {
        window.scrollTo(0, y);
        await new Promise((r) => { setTimeout(r, 100); });
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(800);
    results[width] = await page.evaluate(() => window.cobrandCheck());
  }
  return results;
}
```

`addInitScript` is used rather than a script tag because Edge Delivery pages ship a strict Content Security Policy.

Options: `cobrandCheck({ scope: 'main', allowedFamilies: ['…'] })`. `scope` narrows the elements checked (default `header, main, footer`), and `allowedFamilies` overrides the font list (default: the families in the brand tokens).

A page is ready to show only when `passed` is `true` at both 1440px and 390px. List any accepted exception by name when presenting it.
