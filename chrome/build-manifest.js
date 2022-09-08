const { readFileSync, writeFileSync } = require('fs');

function readManiestBluePrint() {
  const manifestBlueprint = readFileSync('manifest.blueprint.json').toString();
  return manifestBlueprint;
}

function readHtmlCspMeta() {
  const htmlContents = readFileSync('index.html').toString();
  const [, cspDirectives] = htmlContents.match(/<meta http-equiv="content-security-policy" content="(.+)">/);
  return cspDirectives;
}

function generateManifest(blueprint, { csp }) {
  const blueprintCspToken = '{{ContentSecurityPolicy}}';
  const processed = blueprint.replace(blueprintCspToken, csp);
  return processed;
}

function writeManifest(contents) {
  writeFileSync('manifest.json', contents);
}

const blueprint = readManiestBluePrint();
const csp = readHtmlCspMeta();
const manifest = generateManifest(blueprint, { csp });
writeManifest(manifest);

console.log('🙌  Generated manifest.json');
