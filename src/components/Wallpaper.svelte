<script lang="ts">
  import type { Photo, WithOptionalBlob } from "src/state/stores/photo";

  export let photo: Photo & WithOptionalBlob;
  export let blur = false;

  const baseClass = 'Wallpaper__img';
  const blurClass = 'Wallpaper__blurred-img';

  $: loaded = false;
  $: imageClasses = blur ? [baseClass, blurClass] : [baseClass];

  let photoUrl = photo.blob ? URL.createObjectURL(photo.blob) : null;

  $: {
    if (photoUrl) {
      const img = document.createElement('img');

      img.onload = () => {
        loaded = true;
      };

      img.src = photoUrl;
    }
  }
</script>

{#if loaded}
  <div class="Wallpaper">
    <img src={photoUrl} class={imageClasses.join(' ')} alt="Vorfreude wallpaper background" />
  </div>
{/if}

<style>
  .Wallpaper {
    width: 100vw;
    height: 100vh;
    margin: 0;
    z-index: -1;
    position: fixed;
    top: 0;
    left: 0;
  }

  .Wallpaper__img {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    object-fit: cover;
    object-position: center center;
    transition-duration: 375ms, 325ms;
    transition-property: transform, filter;
    transition-timing-function: cubic-bezier(0.35, 0.25, 0.21, 0.96);
    will-change: transform, filter;
  }

  .Wallpaper__blurred-img {
    filter: blur(8px) brightness(0.5);
  }
</style>
