<script>
  import '../global.css';
  import Wallpaper from '../components/Wallpaper.svelte';
  import { setup as setupPhotoStore, currentPhoto, performPhotoHouseKeeping } from '../state/stores/photo';
  import { onMount } from 'svelte';
  import { afterNavigate } from '$app/navigation';
  import { handleInitialHashRoute, handleRouteChange } from '../helpers/hash-routes';

  export const prerender = true

  onMount(async () => {
    const [teardownPhotoStore] = await Promise.all([
      setupPhotoStore(),
      handleInitialHashRoute()
    ]);

    await performPhotoHouseKeeping();

    return () => teardownPhotoStore();
  });

  afterNavigate(() => {
    handleRouteChange();
  });
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
