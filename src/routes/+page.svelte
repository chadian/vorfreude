<script>
  import CountdownTimer from '../components/CountdownTimer.svelte';
  import CountdownMessage from '../components/CountdownMessage.svelte';
  import SettingsButton from '../components/SettingsButton.svelte';
  import { getSettingsStore } from '../state/stores/settings';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let settingsStore;
  $: storeLoaded = false;

  onMount(async () => {
    settingsStore = await getSettingsStore();
    storeLoaded = true;
  });

  function goToSettings() {
    goto('/settings');
  }
</script>

<div class="Index__SettingsButton">
  <SettingsButton onClick={goToSettings}/>
</div>

{#if storeLoaded}
  <CountdownMessage
    endDate={$settingsStore.date}
    countdownMessage={$settingsStore.countdownMessage}
    allDoneMessage={$settingsStore.allDoneMessage}
  />

  <CountdownTimer endDate={$settingsStore.date}/>
{/if}

<style>
  .Index__SettingsButton {
    /* INITIAL OPACITY */
    opacity: 0.75;

    display: block;
    position: fixed;
    top: 1.2rem;
    right: 1.2rem;
  }

  .Index__SettingsButton:hover {
    /* HOVER OPACITY */
    opacity: 1;
  }
</style>
