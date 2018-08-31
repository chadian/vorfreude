import Component, { tracked } from '@glimmer/component';

export default class Wallpaper extends Component {
  public didUpdate() {
    this.setWallpaper();
  }

  public setWallpaper() {
    const {
      photoUrl,
      shouldBlur
    } = this.args;

    const wallpaperElement = this.bounds.firstNode as HTMLElement;

    requestAnimationFrame(() => {
      wallpaperElement.style.backgroundImage = `url(${photoUrl})`;

      if (shouldBlur === true) {
        wallpaperElement.classList.add('Wallpaper__blurred');
      } else {
        wallpaperElement.classList.remove('Wallpaper__blurred');
      }
    });
  }
}
