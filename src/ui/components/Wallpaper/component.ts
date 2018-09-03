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
    let animationClass = navigator.userAgent.includes('Firefox') ? 'no-animation' : 'animation';
    let blurredWallpaperClass = 'Wallpaper__blurred';

    requestAnimationFrame(() => {
      wallpaperElement.style.backgroundImage = `url(${photoUrl})`;

      if (shouldBlur === true) {
        wallpaperElement.classList.add(blurredWallpaperClass, animationClass);
      } else {
        wallpaperElement.classList.remove(blurredWallpaperClass, animationClass);
      }
    });
  }
}
