<script>
	import CountdownTimer from '../components/CountdownTimer.svelte';
	import { getSettingsStore } from '../state/stores/settings';
	const settingsStore = getSettingsStore();
</script>

<CountdownTimer endDate={$settingsStore.date}/>
