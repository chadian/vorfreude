import Component, { tracked } from '@glimmer/component';

export default class Wallpaper extends Component {
  @tracked('args')
  get imageClasses() {
    const {
      shouldBlur
    } = this.args;

    let blurredWallpaperClass = 'Wallpaper__blurred-img';
    const classes = ['Wallpaper__img'];

    if (shouldBlur) {
      classes.push(blurredWallpaperClass);
    }

    return classes.join(' ');
  }
}
