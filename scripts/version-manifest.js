import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const CURRENT_DIR_PATH = fileURLToPath(new URL('.', import.meta.url));
const ROOT_PATH = resolve(CURRENT_DIR_PATH, '..');

function parseManifest() {
  const manifestBlueprint = JSON.parse(readFileSync(resolve(ROOT_PATH, 'chrome/manifest.json')).toString());
  return manifestBlueprint;
}

function parseRootPJson() {
  return JSON.parse(readFileSync(resolve(ROOT_PATH, 'package.json')).toString());
}

function writeManifest(manifestJson, { packageVersion }) {
  const updatedManifest = {
    ...manifestJson,
    version: packageVersion
  };

  writeFileSync(resolve(ROOT_PATH, './chrome/manifest.json'), JSON.stringify(updatedManifest, null, 2));
  console.log('🙌  Updated version in manifest.json');
}

const manifestJson = parseManifest();
const packageVersion = parseRootPJson().version;
writeManifest(manifestJson, { packageVersion });
