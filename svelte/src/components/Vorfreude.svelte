<script>
  import CountdownTimer from "./CountdownTimer.svelte";
  $: showSettings = false;
</script>

{#if showSettings}
  Settings Here...
{:else}
  Countdown here...
{/if}
