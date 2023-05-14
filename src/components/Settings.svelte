<script lang="ts">
  import { DateTime } from 'luxon';
  import Button from './Button.svelte';
  import { padInt } from '../helpers/pad-int';
  import type { CountdownDateObject } from './../types';

  export let onClose: () => void;
  export let onSubmit: (s: typeof settings) => void;
  export let settings = {
    countdownMessage: undefined,
    allDoneMessage: undefined,
    searchTerms: undefined,
    date: {
      year: undefined,
      month: undefined,
      day: undefined,
      hour: undefined,
      minute: undefined
    } as CountdownDateObject
  };

  $: isValidDate = DateTime.fromObject(settings.date).isValid;

  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      onClose();
    }
  }

  function flushInputs() {
    // since the fields are updated on blur this forces
    // the form to blur and set any values that need to be set
    const inputs = Array.from(document.querySelectorAll('input'));
    inputs.forEach((form) => form.blur());
  }

  function handleSubmit() {
    if (isValidDate) {
      onSubmit(settings);
    }
  }

  function updateDate(key, e) {
    const target = e.currentTarget;
    const minValue = target.getAttribute('min');
    const maxValue = target.getAttribute('max');

    let { value } = target;
    value = Number(value);
    value = Math.min(value, Number(maxValue));
    value = Math.max(value, Number(minValue));

    settings.date[key] = Number(value);

    // required for forcing reactivity changes
    settings = settings;
  }
</script>

<svelte:window on:keydown={handleKeyDown} />

<button aria-label="Close" class="Settings__close" on:click={() => onClose()}>
  <span class="Settings__close-symbol">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 50 50"
      version="1.1"
      width="100%"
      height="100%"
    >
      <g id="surface1">
        <path
          fill="#ffffff"
          d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z "
        />
      </g>
    </svg>
  </span>
</button>
<div class="Settings">
  {#if !isValidDate}
    <div class="Settings__validiation">
      There's an issue with your date. You'll need to fix it before you can save.
    </div>
  {/if}

  <form class="Settings__form" on:submit|preventDefault={() => (flushInputs(), handleSubmit())}>
    <div class="Settings__row">
      <label class="Settings__input-wrapper">
        <input
          type="text"
          on:blur={(e) => (settings.countdownMessage = e.currentTarget.value)}
          value={settings.countdownMessage}
        />
        <div class="Settings__input-line" />
        <div class="Settings__input-under-label">Countdown Message</div>
      </label>
    </div>

    <div class="Settings__row">
      <label class="Settings__input-wrapper">
        <input
          type="text"
          on:blur={(e) => (settings.allDoneMessage = e.currentTarget.value)}
          value={settings.allDoneMessage}
        />
        <div class="Settings__input-line" />
        <div class="Settings__input-under-label">All Done! Message</div>
      </label>
    </div>

    <div class="Settings__row">
      <label class="Settings__input-wrapper">
        <input
          type="text"
          on:blur={(e) => (settings.searchTerms = e.currentTarget.value)}
          value={settings.searchTerms}
        />
        <div class="Settings__input-line" />
        <div class="Settings__input-under-label">Image Search Terms</div>
      </label>
    </div>

    <div class="Settings__row">
      <label class="Settings__input-wrapper Settings__input-wrapper--date">
        <input
          type="number"
          min={new Date().getFullYear()}
          max="2100"
          on:blur={(e) => updateDate('year', e)}
          value={padInt(settings.date.year, 2)}
        />
        <div class="Settings__input-line" />
        <div class="Settings__input-under-label">Year (YYYY)</div>
      </label>

      <label class="Settings__input-wrapper Settings__input-wrapper--date">
        <input
          type="number"
          min="1"
          max="12"
          on:blur={(e) => updateDate('month', e)}
          value={padInt(settings.date.month, 2)}
        />
        <div class="Settings__input-line" />
        <div class="Settings__input-under-label">Month (MM)</div>
      </label>

      <label class="Settings__input-wrapper Settings__input-wrapper--date">
        <input
          type="number"
          min="1"
          max="31"
          on:blur={(e) => updateDate('day', e)}
          value={padInt(settings.date.day, 2)}
        />
        <div class="Settings__input-line" />
        <div class="Settings__input-under-label">Day (DD)</div>
      </label>

      <label class="Settings__input-wrapper Settings__input-wrapper--date">
        <input
          type="number"
          min="0"
          max="23"
          on:blur={(e) => updateDate('hour', e)}
          value={padInt(settings.date.hour, 2)}
        />
        <div class="Settings__input-line" />
        <div class="Settings__input-under-label">Hour (HH)</div>
      </label>

      <label class="Settings__input-wrapper Settings__input-wrapper--date">
        <input
          type="number"
          min="0"
          max="59"
          on:blur={(e) => updateDate('minute', e)}
          value={padInt(settings.date.minute, 2)}
        />
        <div class="Settings__input-line" />
        <div class="Settings__input-under-label">Minute (MM)</div>
      </label>
    </div>

    <Button type="submit">Save</Button>
  </form>
</div>

<div class="Love">
  ❤️ <a href="https://www.sticksnglue.com/">sticksnglue</a>
</div>

<style>
  .Settings,
  .Settings input {
    font-family: var(--neutral-font-family);
    letter-spacing: 0.085rem;
  }

  .Settings {
    user-select: none;
    -webkit-user-select: none;
    overflow: hidden;
    color: #fff;
    margin-left: auto;
    margin-right: auto;
    width: 75vw;
    padding: 2rem;
    display: flex;
    flex-direction: column;
  }

  .Settings__close {
    /* INITIAL OPACITY */
    opacity: 0.75;

    display: block;
    background: none;
    border: none;
    cursor: pointer;
    position: fixed;
    top: 1.2rem;
    right: 1.2rem;
    width: 40px;
    height: 40px;
  }

  @media only screen and (max-width: 425px) {
    .Settings__close {
      width: 25px;
      height: 25px;
    }
  }

  .Settings__close:hover {
    /* HOVER OPACITY */
    opacity: 1;
  }

  .Settings__close-symbol {
    position: relative;
    bottom: -2px;
  }

  .Settings__form > *:not(:first-child) {
    margin-top: 2rem;
  }

  @media only screen and (max-width: 425px) {
    .Settings__form > *:not(:first-child) {
      margin-top: 1rem;
    }
  }

  .Settings__validiation {
    align-self: flex-start;
    text-align: left;
    padding: 0.75rem 1rem;
    font-size: 1em;
    color: #da0000;
    background-color: white;
    border-radius: 2rem;
    margin-bottom: 3rem;
    align-self: center;
  }

  .Settings__row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }

  .Settings__input-wrapper {
    margin-right: 1rem;
    width: 100%;
  }

  @media only screen and (max-width: 425px) {
    .Settings__input-wrapper {
      margin-right: 2rem;
    }
  }

  .Settings__input-wrapper--date {
    width: 8rem;
    margin-bottom: 2rem;
  }

  @media only screen and (max-width: 425px) {
    .Settings__input-wrapper--date {
      margin-bottom: 1rem;
    }
  }

  .Settings__input-wrapper input {
    background-color: transparent;
    color: #fff;
    border: none;
    width: calc(100% - 1.5rem);
    font-size: 1.5rem;
    padding-bottom: 15px;
    padding-left: 0.85rem;
    padding-right: 0.75rem;
  }

  @media only screen and (max-width: 425px) {
    .Settings__input-wrapper input {
      font-size: 1rem;
      width: calc(100% - 0.5rem);
      padding-bottom: 10px;
      padding-left: 0.2rem;
      padding-right: 0.2rem;
    }
  }

  .Settings__input-line {
    height: 1px;
    margin-top: -10px;
    background-color: #fff;
  }

  .Settings__input-under-label {
    padding-top: 0.5rem;
    text-transform: uppercase;
    font-size: 0.85rem;
    padding-left: 0.75rem;
    font-weight: bold;
  }

  @media only screen and (max-width: 425px) {
    .Settings__input-under-label {
      font-size: 0.65rem;
      padding-top: 0.2rem;
      padding-left: 0.2rem;
    }
  }

  .Love {
    position: fixed;
    bottom: 1.5rem;
  }

  @media only screen and (max-width: 425px) {
    .Love {
      right: 1.5rem;
    }
  }

  .Love a,
  .Love a:visited {
    color: #fff;
    font-size: 1.2rem;
    text-underline-offset: 2px;
  }
</style>
