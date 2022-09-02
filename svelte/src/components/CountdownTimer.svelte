<script lang="ts">
  import plural from '../helpers/plural-rules';
  import { onMount, onDestroy } from 'svelte';
  import type { CountdownDateObject } from '../types';
  import { displayDuration } from '../helpers/display-duration';

  export let endDate: CountdownDateObject;

  $: duration = undefined;

  function updateDisplayDuration() {
    duration = displayDuration(endDate);
  }

  const UPDATE_INTERVAL_IN_MS = 500;
  const intervalId = setInterval(updateDisplayDuration, UPDATE_INTERVAL_IN_MS);

  onMount(() => updateDisplayDuration());
  onDestroy(() => clearInterval(intervalId));
</script>

<div class="CountdownTimer">
  {#if duration}
    {#if duration.days !== undefined}
      <div class="CountdownTimer__segment">
        {duration.days}
        {plural(duration.days, 'days')}
      </div>
    {/if}

    {#if duration.hours !== undefined}
      <div class="CountdownTimer__segment">
        {duration.hours}
        {plural(duration.hours, 'hours')}
      </div>
    {/if}

    {#if duration.minutes !== undefined}
      <div class="CountdownTimer__segment">
        {duration.minutes}
        {plural(duration.minutes, 'minutes')}
      </div>
    {/if}

    {#if duration.seconds !== undefined}
      <div class="CountdownTimer__segment">
        {duration.seconds}
        {plural(duration.seconds, 'seconds')}
      </div>
    {/if}
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

  @keyframes hide {
    from {
      opacity: 1;
    }

    to {
      opacity: 0;
    }
  }

  @keyframes small-slide-up {
    from {
      transform: translateY(2rem);
    }

    to {
      transform: translateY(0);
    }
  }

  .CountdownTimer {
    font-size: calc(var(--base-screen-proportional-font-size-desktop) * 0.8);
    user-select: none;
    -webkit-user-select: none;
    color: #fff;
    text-align: center;
    text-shadow: rgba(0, 0, 0, 0.5) 0px 3px 10px, rgba(0, 0, 0, 0.25) 0px 6px 20px;
    padding-left: 2vw;
    padding-right: 2vw;
    cursor: default;

    opacity: 0;
    animation-name: show, small-slide-up;
    animation-delay: 150ms;
    animation-duration: 500ms;
    animation-fill-mode: forwards;
    animation-timing-function: cubic-bezier(0.175, 0, 4, 0.885);
  }

  @media only screen and (max-width: 425px) {
    .CountdownTimer {
      font-size: calc(var(--base-screen-proportional-font-size-mobile) * 0.85);
    }
  }

  .CountdownTimer__segment {
    display: inline-block;
  }

  @media only screen and (max-width: 425px) {
    .CountdownTimer__segment {
      display: block;
    }
  }

  @media only screen and (max-width: 425px) {
    .CountdownTimer__segment {
      display: block;
    }
  }
</style>
