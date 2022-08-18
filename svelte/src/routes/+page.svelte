<script>
  import CountdownTimer from '../components/CountdownTimer.svelte';
  import CountdownMessage from '../components/CountdownMessage.svelte';
  import SettingsButton from '../components/SettingsButton.svelte';
  import { getSettingsStore } from '../state/stores/settings';
  const settingsStore = getSettingsStore();

  function goToSettings() {
    document.location = '/settings';
  }
</script>

<div class="Index__SettingsButton">
  <SettingsButton onClick={goToSettings}/>
</div>

<CountdownMessage
  endDate={$settingsStore.date}
  countdownMessage={$settingsStore.countdownMessage}
  allDoneMessage={$settingsStore.allDoneMessage}
/>

<CountdownTimer endDate={$settingsStore.date}/>

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
