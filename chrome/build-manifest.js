const { readFileSync, writeFileSync } = require('fs');
const rootPJson = require('../package.json');

function readManiestBluePrint() {
  const manifestBlueprint = readFileSync('manifest.blueprint.json').toString();
  return manifestBlueprint;
}

function readHtmlCspMeta() {
  const htmlContents = readFileSync('index.html').toString();
  const [, cspDirectives] = htmlContents.match(/<meta http-equiv="content-security-policy" content="(.+)">/);
  return cspDirectives;
}

function generateManifest(blueprint, { csp, packageVersion }) {
  const blueprintCspToken = '{{ContentSecurityPolicy}}';
  let processed = blueprint.replace(blueprintCspToken, csp);

  const versionToken = '{{packageVersion}}';
  processed = blueprint.replace(versionToken, packageVersion);

  return processed;
}

function writeManifest(contents) {
  writeFileSync('manifest.json', contents);
}
const blueprint = readManiestBluePrint();

const packageVersion = rootPJson.version;
const csp = readHtmlCspMeta();
const manifest = generateManifest(blueprint, { csp, packageVersion });
writeManifest(manifest);

console.log('🙌  Generated manifest.json');
