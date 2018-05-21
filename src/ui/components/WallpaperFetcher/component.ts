import Component, { tracked } from "@glimmer/component";
import rawFetch from "../../../utils/lib/rawFetch";

export default class WallpaperFetcher extends Component {
  didInsertElement() {
    this.setWallpaper();
  }

  didUpdate() {
    const { refreshPassback } = this.args;
    refreshPassback(() => this.setWallpaper());
    this.setWallpaper();
  }

  setWallpaper() {
    const {
      searchTerms,
      shouldBlur
    } = this.args;

    const wallpaperElement = this.bounds.firstNode;

    if (searchTerms) {
      rawFetch(this.args.searchTerms)
        .then(url => requestAnimationFrame(() =>
          wallpaperElement.style.backgroundImage = `url(${url})`
        ));
    }

    requestAnimationFrame(() => {
      if (shouldBlur === true) {
        wallpaperElement.classList.add("WallpaperFetcher__blurred");
      } else {
        wallpaperElement.classList.remove("WallpaperFetcher__blurred");
      }
    });
  }
}
