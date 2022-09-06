<script lang="ts">
  export let photoUrl: string;
  export let blur = false;

  const baseClass = 'Wallpaper__img';
  const blurClass = 'Wallpaper__blurred-img';

  $: imageClasses = blur ? [baseClass, blurClass] : [baseClass];
</script>

<div class="Wallpaper">
  <div style="background-image: url({photoUrl})" class={imageClasses.join(' ')}></div>
</div>

<style>
  .Wallpaper {
    width: 100%;
    height: 100%;
    margin: 0;
    z-index: -1;
    position: fixed;
    zoom: 1.1;
  }

  .Wallpaper__img {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    transition-duration: 375ms, 325ms;
    transition-property: transform, filter;
    transition-timing-function: cubic-bezier(0.35, 0.25, 0.21, 0.96);
    transform: scale(1.02);
    will-change: transform, filter;
  }

  .Wallpaper__blurred-img {
    filter: blur(8px) brightness(0.5);
  }
</style>