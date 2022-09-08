<script>
  import '../global.css';
  import Wallpaper from '../components/Wallpaper.svelte';
  import { currentPhoto, performPhotoHouseKeeping } from '../state/stores/photo';

  // export const ssr = false;
  export const prerender = true

  performPhotoHouseKeeping();
</script>

<div class="shell">
  <slot />
  {#if $currentPhoto.url}
    <Wallpaper blur={$currentPhoto.blur} photoUrl={$currentPhoto.url} />
  {/if}
</div>

<style>
  @keyframes show {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  .shell {
    width: 100%;
    height: 100%;
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    opacity: 0;
    animation-name: show;
    animation-delay: 100ms;
    animation-duration: 350ms;
    animation-fill-mode: forwards;
    animation-timing-function: cubic-bezier(0.175, 0, 4, 0.885);
  }
</style>
