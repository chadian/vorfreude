import Component, { tracked } from "@glimmer/component";

export default class Wallpaper extends Component {
  didUpdate() {
    this.setWallpaper();
  }

  setWallpaper() {
    const {
      photoUrl,
      shouldBlur
    } = this.args;

    const wallpaperElement = this.bounds.firstNode as HTMLElement;
    let nextImage = `url(${ photoUrl })`;

    requestAnimationFrame(() => {
      let currentImage = wallpaperElement.style.backgroundImage.split(',').reverse().pop();

      // layer the current background image with the existing
      // to avoid nasty flashes.
      let backgroundImage = [nextImage, currentImage]
        .filter(Boolean).join(',');

      wallpaperElement.style.backgroundImage = backgroundImage;

      if (shouldBlur === true) {
        wallpaperElement.classList.add("Wallpaper__blurred");
      } else {
        wallpaperElement.classList.remove("Wallpaper__blurred");
      }
    });
  }
}
