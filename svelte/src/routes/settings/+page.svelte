<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { get } from 'svelte/store';
  import { goto } from '$app/navigation';
  import Settings from '../../components/Settings.svelte';
  import { getSettingsStore } from '../../state/stores/settings';
  import { currentPhoto } from '../../state/stores/photo';

  let store;

  onMount(async () => {
    store = await getSettingsStore();
    changePhotoBlur(true);
  });

  onDestroy(() => {
    changePhotoBlur(false);
  });

  function changePhotoBlur(blur: boolean) {
    currentPhoto.update((cp) => {
      return {
        ...cp,
        blur,
      }
    });
  }

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
