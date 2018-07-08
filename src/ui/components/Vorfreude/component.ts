import Component, { tracked } from '@glimmer/component';
import Manager from '../../../utils/lib/manager';
import { addStoreUpdateHandler } from '../../../utils/lib/store';
import { actions, dispatch } from '../../../utils/lib/store';

const { SET_WALLPAPER_PHOTO_URL } = actions;

const SETTINGS_URL_HASH = '#settings';
export default class Vorfreude extends Component {
  @tracked
  public showSettings = false;

  public searchTerms = '';

  constructor() {
    super(arguments[0]);

    this.handleRouting();
    window.onhashchange = () => this.handleRouting();

    addStoreUpdateHandler((store) => this.handleStore(store));
  }

  public handleRouting() {
    const { hash } = document.location;
    if (hash === SETTINGS_URL_HASH) {
      this.showSettings = true;
    } else {
      this.showSettings = false;
    }
  }

  public handleStore(store) {
    if (this.searchTerms !== store.settings.searchTerms) {
      this.searchTerms = store.settings.searchTerms;
      this.setFreshPhoto();
    }
  }

  public async setFreshPhoto() {
    if (this.searchTerms) {
      let url = await new Manager(this.searchTerms).getPhoto();

      dispatch({
        action: SET_WALLPAPER_PHOTO_URL,
        photoUrl: url
      });
    }
  }

  public refreshWallpaper() {
    this.setFreshPhoto();
  }
}
