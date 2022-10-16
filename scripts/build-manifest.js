import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const CURRENT_DIR_PATH = fileURLToPath(new URL('.', import.meta.url));
const ROOT_PATH = resolve(CURRENT_DIR_PATH, '..');

function readManiestBluePrint() {
  const manifestBlueprint = readFileSync(resolve(CURRENT_DIR_PATH, 'manifest.blueprint.json')).toString();
  return manifestBlueprint;
}

function readHtmlCspMeta() {
  const htmlContents = readFileSync(resolve(ROOT_PATH, 'chrome/index.html')).toString();
  const [, cspDirectives] = htmlContents.match(/<meta http-equiv="content-security-policy" content="(.+)">/);
  return cspDirectives;
}

function parseRootPJson() {
  return JSON.parse(readFileSync(resolve(ROOT_PATH, 'package.json')).toString());
}

function generateManifest(blueprint, { csp, packageVersion }) {
  const blueprintCspToken = '{{ContentSecurityPolicy}}';
  let processed = blueprint.replace(blueprintCspToken, csp);

  const versionToken = '{{packageVersion}}';
  processed = processed.replace(versionToken, packageVersion);

  return processed;
}

function writeManifest(contents) {
  writeFileSync(resolve(ROOT_PATH, './chrome/manifest.json'), contents);
}

const blueprint = readManiestBluePrint();
const packageVersion = parseRootPJson().version;
const csp = readHtmlCspMeta();
const manifest = generateManifest(blueprint, { csp, packageVersion });
writeManifest(manifest);

console.log('🙌  Generated manifest.json');
