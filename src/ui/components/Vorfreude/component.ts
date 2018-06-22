import Component, { tracked } from '@glimmer/component';
import { addStoreUpdateHandler } from "../../../utils/lib/store";
import { actions, dispatch } from '../../../utils/lib/store';
import Manager from '../../../utils/lib/manager';


const { SET_WALLPAPER_PHOTO_URL } = actions;

const SETTINGS_URL_HASH = "#settings";
export default class Vorfreude extends Component {
  constructor() {
    super(...arguments);

    this.handleRouting();
    window.onhashchange = () => this.handleRouting();

    addStoreUpdateHandler(store => this.handleStore(store));
  }

  @tracked
  showSettings = false

  searchTerms = ""

  handleRouting() {
    const { hash } = document.location;
    if (hash === SETTINGS_URL_HASH) {
      this.showSettings = true;
    } else {
      this.showSettings = false;
    }
  }

  handleStore(store) {
    if (this.searchTerms !== store.settings.searchTerms) {
      this.searchTerms = store.settings.searchTerms;
      this.setFreshPhoto();
    }
  }

  async setFreshPhoto() {
    if (this.searchTerms) {
      let url = await new Manager(this.searchTerms).getPhoto();

      dispatch({
        action: SET_WALLPAPER_PHOTO_URL,
        photoUrl: url
      });
    }
  }

  refreshWallpaper() {
    this.setFreshPhoto();
  }
}
