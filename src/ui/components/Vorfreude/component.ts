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

  @tracked
  settings = {}

  _refreshWallpaper = null

  refreshWallpaperPassback = (refreshWallpaper) => {
    refreshWallpaper();
    this._refreshWallpaper = refreshWallpaper;
  }

  handleRouting() {
    const { hash } = document.location;
    if (hash === SETTINGS_URL_HASH) {
      this.showSettings = true;
    } else {
      this.showSettings = false;
    }
  }

  refreshWallpaper() {
    if (typeof this._refreshWallpaper === "function") {
      this._refreshWallpaper();
    }
  }
}
