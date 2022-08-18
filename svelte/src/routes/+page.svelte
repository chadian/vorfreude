<script>
  import CountdownTimer from '../components/CountdownTimer.svelte';
  import CountdownMessage from '../components/CountdownMessage.svelte';
  import { getSettingsStore } from '../state/stores/settings';
  const settingsStore = getSettingsStore();
</script>

<CountdownMessage
  endDate={$settingsStore.date}
  countdownMessage={$settingsStore.countdownMessage}
  allDoneMessage={$settingsStore.allDoneMessage}
/>
<CountdownTimer endDate={$settingsStore.date}/>
