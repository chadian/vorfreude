<script>
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { goto } from '$app/navigation';
  import Settings from '../../components/Settings.svelte';
  import { getSettingsStore } from '../../state/stores/settings';

  let store;

  onMount(async () => {
    store = await getSettingsStore();
  });

  function closeSettings() {
    goto('/')
  }

  function handleSubmit(settings) {
    store.update((previousSettings) => {
      return {
        ...previousSettings,
        ...settings
      }
    })

    closeSettings();
  }
</script>

{#if store}
  <Settings
    settings={get(store)}
    onClose={closeSettings}
    onSubmit={handleSubmit}
  />
{/if}
