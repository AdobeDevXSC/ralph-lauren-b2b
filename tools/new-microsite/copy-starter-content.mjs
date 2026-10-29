#!/usr/bin/env node
/* eslint-disable no-console */
/* eslint-env node */

/**
 * Copies the Ralph Lauren B2B Boilerplate starter content from the boilerplate's
 * Document Authoring site into a new cobranded microsite's Document Authoring site:
 * nav, footer, homepage, the block library (index, sample pages, sample images) and
 * the "Blocks" entry of the Library panel config.
 *
 * Previews by default. Nothing is written unless --apply is passed.
 *
 * Usage:
 *   node tools/new-microsite/copy-starter-content.mjs --to <org>/<site>
 *     [--from <org>/<site>] [--apply]
 *
 * Auth: set DA_TOKEN (an Adobe IMS token with access to both sites). Never commit it;
 * .env files are git-ignored. In hosted agent environments the token may be injected
 * for you, in which case leave DA_TOKEN unset.
 */

const DA_ADMIN = process.env.DA_ADMIN_HOST || 'https://admin.da.live';
const DEFAULT_FROM = 'adobedevxsc/ralph-lauren-b2b';

/** Starter documents copied as-is (paths without extension). */
const STARTER_PAGES = ['nav', 'footer', 'index'];

function parseArgs(argv) {
  const args = { from: DEFAULT_FROM, to: null, apply: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--apply') {
      args.apply = true;
    } else if (arg === '--from' || arg === '--to') {
      args[arg.slice(2)] = argv[i + 1];
      i += 1;
    }
  }
  const valid = (v) => /^[\w.-]+\/[\w.-]+$/.test(v || '');
  if (!valid(args.to) || !valid(args.from)) {
    console.error('Usage: copy-starter-content.mjs --to <org>/<site> [--from <org>/<site>] [--apply]');
    process.exit(2);
  }
  if (args.to === args.from) {
    console.error('--to must differ from --from');
    process.exit(2);
  }
  return args;
}

function authHeaders() {
  const token = process.env.DA_TOKEN || process.env.DA_IMS_TOKEN;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function daGet(path) {
  const resp = await fetch(`${DA_ADMIN}${path}`, { headers: authHeaders() });
  if (!resp.ok) throw new Error(`GET ${path} -> ${resp.status}`);
  return resp;
}

async function daPostSource(site, path, body, type) {
  const form = new FormData();
  form.append('data', new Blob([body], { type }), path.split('/').pop());
  const resp = await fetch(`${DA_ADMIN}/source/${site}/${path}`, {
    method: 'POST', headers: authHeaders(), body: form,
  });
  if (!resp.ok) throw new Error(`POST /source/${site}/${path} -> ${resp.status} ${await resp.text()}`);
}

/** Points content.da.live references at the destination site. */
function retarget(text, from, to) {
  return text.split(`content.da.live/${from}/`).join(`content.da.live/${to}/`);
}

async function buildPlan(from) {
  const plan = STARTER_PAGES.map((p) => ({ path: `${p}.html`, type: 'text/html' }));
  const index = await (await daGet(`/source/${from}/library/blocks.json`)).json();
  plan.push({ path: 'library/blocks.json', type: 'application/json' });
  (index.data || []).forEach((row) => {
    const slug = new URL(row.path).pathname.split('/').pop();
    plan.push({ path: `library/blocks/${slug}.html`, type: 'text/html' });
  });
  plan.push({ path: 'library/blocks/images/rl-signature.svg', type: 'image/svg+xml', optional: true });
  return plan;
}

async function mergeLibraryConfig(to, apply) {
  const blocksUrl = `https://content.da.live/${to}/library/blocks.json`;
  let config;
  const resp = await fetch(`${DA_ADMIN}/config/${to}/`, { headers: authHeaders() });
  const emptySheet = () => ({
    total: 0, limit: 0, offset: 0, data: [],
  });
  if (resp.status === 404) {
    config = { ':names': ['library'], ':type': 'multi-sheet', library: emptySheet() };
  } else if (resp.ok) {
    config = await resp.json();
  } else {
    throw new Error(`GET /config/${to}/ -> ${resp.status}; not updating the Library config`);
  }
  config.library = config.library || emptySheet();
  const rows = config.library.data;
  const existing = rows.find((r) => r.title === 'Blocks');
  if (existing) existing.path = blocksUrl;
  else rows.push({ title: 'Blocks', path: blocksUrl });
  config.library.total = rows.length;
  config.library.limit = rows.length;
  config[':names'] = config[':names'] || [];
  if (!config[':names'].includes('library')) config[':names'].push('library');
  if (config[':type'] !== 'multi-sheet') config[':type'] = 'multi-sheet';

  console.log(`  config  Library "Blocks" -> ${blocksUrl} (other sheets and entries kept)`);
  if (!apply) return;
  const form = new FormData();
  form.append('config', JSON.stringify(config));
  const post = await fetch(`${DA_ADMIN}/config/${to}/`, { method: 'POST', headers: authHeaders(), body: form });
  if (!post.ok) throw new Error(`POST /config/${to}/ -> ${post.status} ${await post.text()}`);
}

async function copyItem(item, { from, to, apply }) {
  let resp;
  try {
    resp = await daGet(`/source/${from}/${item.path}`);
  } catch (e) {
    if (item.optional) {
      console.log(`  skip    ${item.path} (not found in source)`);
      return;
    }
    throw e;
  }
  // every starter file is text (HTML, JSON, SVG), so references can be retargeted
  const body = retarget(await resp.text(), from, to);
  console.log(`  copy    ${item.path}`);
  if (apply) await daPostSource(to, item.path, body, item.type);
}

async function main() {
  const { from, to, apply } = parseArgs(process.argv.slice(2));
  console.log(`${apply ? 'Copying' : 'Preview (no writes; add --apply to copy)'}: ${from} -> ${to}`);

  const plan = await buildPlan(from);
  // one file at a time, in order
  await plan.reduce(
    (prev, item) => prev.then(() => copyItem(item, { from, to, apply })),
    Promise.resolve(),
  );
  await mergeLibraryConfig(to, apply);

  console.log(apply
    ? `Done. Open https://da.live/#/${to} and preview the copied pages to publish them to Edge Delivery.`
    : 'Preview complete. Re-run with --apply to copy.');
}

main().catch((e) => {
  console.error(`Failed: ${e.message}`);
  process.exit(1);
});
