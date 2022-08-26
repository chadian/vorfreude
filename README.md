![Vorfreude](/marketing/logo.png?raw=true)

## Download

* [Chrome Extension 💾](https://chrome.google.com/webstore/detail/vorfreude/cfdbnmfofkfhbjlabopaepkfdbeajabd)
* [Firefox Add-on 💾](https://addons.mozilla.org/en-US/firefox/addon/vorfreude/?src=search)

## Prerequisites

You will need the following things installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (see package.json "engines" for required version)
* [Yarn](https://yarnpkg.com/en/)

## Installation

* `git clone <repository-url>` this repository
* `cd vorfreude`
* `yarn`

## Local Development

* `yarn dev`
* Visit the locally running app at the listed outputted in the terminal.

## Tests

* Unit and Component Tests (`yarn test:unit`) use [jest](https://jestjs.io/) and [Testing Library](https://testing-library.com/)
* Acceptance Tests (`yarn test:acceptance`) use [Playwright](https://playwright.dev/)
	* Playwright runs tests in the browser and these need to be installed first. This can be done by running `yarn playwright install`
* Both unit/component and acceptance tests can be ran with `yarn test`

### Building & Relasing

1. `yarn release` (create the release)
2. `yarn build` (create build)
3. `yarn package` (create zip package of build for stores)
4. Upload zip to chrome and firefox stores

## Further Reading / Useful Links

* This project is built using [Svelte](https://svelte.dev/) and [SvelteKit](https://kit.svelte.dev/)
