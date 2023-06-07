<script>
  import CountdownTimer from '../components/CountdownTimer.svelte';
  import CountdownMessage from '../components/CountdownMessage.svelte';
  import SettingsButton from '../components/SettingsButton.svelte';
  import BlockButton from '../components/BlockButton.svelte';
  import PhotoSourceIcon from '../components/PhotoSourceIcon.svelte';
  import { getSettingsStore } from '../state/stores/settings';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { currentPhoto, blockPhoto } from '../state/stores/photo';

  $: settingsStore = null;
  $: photo = $currentPhoto.photo;

  onMount(async () => {
    settingsStore = await getSettingsStore();
  });

  function goToSettings() {
    goto('/settings');
  }
</script>

<div class="Index__BottomRightContainer">
  {#if photo}
    <a
      class="Index__PhotoSourceLink"
      href="https://www.flickr.com/photos/{photo.owner}/{photo.id}"
      target="_blank"
    >
      <PhotoSourceIcon />
    </a>

    <div class="Index__BlockButton">
      <BlockButton onClick={() => blockPhoto(photo)} />
    </div>
  {/if}
</div>

<div class="Index__SettingsButton">
  <SettingsButton onClick={goToSettings} />
</div>

{#if settingsStore}
  <CountdownMessage
    endDate={$settingsStore.date}
    countdownMessage={$settingsStore.countdownMessage}
    allDoneMessage={$settingsStore.allDoneMessage}
  />

  <CountdownTimer endDate={$settingsStore.date} />
{/if}

<style>
  .Index__SettingsButton {
    /* INITIAL OPACITY */
    opacity: 0.75;

    display: block;
    position: fixed;
    top: 1.2rem;
    right: 1.2rem;
    padding: 0;
  }

  .Index__BlockButton:hover,
  .Index__PhotoSourceLink:hover,
  .Index__SettingsButton:hover {
    /* HOVER OPACITY */
    opacity: 1;
  }

  .Index__BottomRightContainer {
    position: fixed;
    bottom: 1.2rem;
    right: 1.2rem;
    display: flex;
    align-items: center;
    display: flex;
  }

  .Index__BottomRightContainer * + * {
    margin-left: 1rem;
  }

  .Index__BlockButton,
  .Index__PhotoSourceLink {
    /* INITIAL OPACITY */
    opacity: 0.75;

    display: block;
  }
</style>
