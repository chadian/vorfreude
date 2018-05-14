import Component, { tracked } from '@glimmer/component';
import { load } from '../../../utils/lib/settings';

const SETTINGS_URL_HASH = "#settings";
export default class Vorfreude extends Component {
  constructor() {
    super(...arguments);
    this.handleRouting();
    window.onhashchange = () => this.handleRouting();
  }

  @tracked
  showSettings = false

  @tracked
  settings = {}

  didInsertElement() {
    load()
      .then(settings => this.settings = settings);
  }

  handleRouting() {
    const { hash } = document.location;
    if (hash === SETTINGS_URL_HASH) {
      this.showSettings = true;
    } else {
      this.showSettings = false;
    }
  }
}
