import Component, { tracked } from "@glimmer/component";
import Manager from '../../../utils/lib/manager';

export default class Wallpaper extends Component {
  didUpdate() {
    this.setWallpaper();
  }

  setWallpaper() {
    const {
      photoUrl,
      shouldBlur
    } = this.args;

    const wallpaperElement = this.bounds.firstNode;

    requestAnimationFrame(() => {
      wallpaperElement.style.backgroundImage = `url(${photoUrl})`;

      if (shouldBlur === true) {
        wallpaperElement.classList.add("Wallpaper__blurred");
      } else {
        wallpaperElement.classList.remove("Wallpaper__blurred");
      }
    });
  }
}
