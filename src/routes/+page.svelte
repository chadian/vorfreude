<script>
  import CountdownTimer from '../components/CountdownTimer.svelte';
  import CountdownMessage from '../components/CountdownMessage.svelte';
  import SettingsButton from '../components/SettingsButton.svelte';
  import BlockButton from '../components/BlockButton.svelte';
  import { getSettingsStore } from '../state/stores/settings';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { currentPhoto, blockPhoto } from '../state/stores/photo';

  $: settingsStore = null;

  onMount(async () => {
    settingsStore = await getSettingsStore();
  });

  function goToSettings() {
    goto('/settings');
  }
</script>

<div class="Index__SettingsButton">
  <SettingsButton onClick={goToSettings} />
</div>

{#if $currentPhoto.photo}
  <div class="Index__BlockButton">
    <BlockButton onClick={() => blockPhoto($currentPhoto.photo)} />
  </div>
{/if}

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

  .Index__SettingsButton:hover {
    /* HOVER OPACITY */
    opacity: 1;
  }

  .Index__BlockButton {
    /* INITIAL OPACITY */
    opacity: 0.75;

    display: block;
    position: fixed;
    bottom: 1.2rem;
    right: 1.2rem;
  }
</style>
