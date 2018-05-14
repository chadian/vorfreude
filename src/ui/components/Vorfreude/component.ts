import Component, { tracked } from '@glimmer/component';

const SETTINGS_URL_HASH = "#settings";
export default class Vorfreude extends Component {
  constructor() {
    super(...arguments);
    this.handleRouting();
    window.onhashchange = () => this.handleRouting();
  }

  @tracked
  showSettings = false

  end = {
    day: 20,
    month: 5,
    year: 2018,
    hour: 20,
    minute: 20,
    second: 20,
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
