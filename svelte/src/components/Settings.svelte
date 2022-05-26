<script lang="ts">
  import { onMount } from 'svelte';
	import { DateTime } from 'luxon';
	import { settings as store } from '../state/stores/settings';
	import { get } from 'svelte/store';
	import type { CountdownDateObject } from './../types';

	$: countdownMessage = '';
	$: allDoneMessage = '';
	$: imageSearchTerms = '';
	$: date = {
		year: undefined,
		month: undefined,
		day: undefined,
		hour: undefined,
		minute: undefined,
	} as CountdownDateObject;
  $: isValidDate = !DateTime.fromObject(date).isValid

	function padInt(num, digits) {
		const numberString = Number(num).toString();
		const fillAmount = digits - numberString.length;
		const pad = fillAmount > 0 ? Array(fillAmount).fill('0').join('') : '';
		return pad + numberString;
	}

	function handleEscapeKeyDown(event) {
		// on escape go back to main route
		if (event.keyCode === 27) {
			// TODO: Routing Change: Close Settings
		}
	}

	function setInitialValues() {
		({ countdownMessage, allDoneMessage, searchTerms: imageSearchTerms, date } = get(store));
	}

	function saveSettings() {
    if (!isValidDate) {
      return;
    }

    store.update({
      ...get(store),

      allDoneMessage,
      countdownMessage,
      date,
      searchTerms: imageSearchTerms,
    })

    // TODO: Routing Change: Close Settings
  }

	onMount(() => {
		setInitialValues();
		document.addEventListener('keydown', handleEscapeKeyDown);
		return () => document.removeEventListener('keydown', handleEscapeKeyDown);
	});

	function updateDate(key, e) {
		const target = e.currentTarget;
		const minValue = target.getAttribute('min');
		const maxValue = target.getAttribute('max');

		let { value } = target;
		value = Number(value);
		value = Math.min(value, Number(maxValue));
		value = Math.max(value, Number(minValue));

		date[key] = Number(value);
	}
</script>

<a class="Settings__close" href="#">
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
</a>
<div class="Settings">
	{#if isValidDate}
		<div class="Settings__validiation">
			There's an issue with your date. You'll need to fix it before you can save.
		</div>
	{/if}
	<form class="Settings__form" on:submit|preventDefault={saveSettings}>
		<div class="Settings__row">
			<label class="Settings__input-wrapper">
				<input
					type="text"
					on:input={(e) => (countdownMessage = e.currentTarget.value)}
					value={countdownMessage}
				/>
				<div class="Settings__input-line" />
				<div class="Settings__input-under-label">Countdown Message</div>
			</label>
		</div>

		<div class="Settings__row">
			<label class="Settings__input-wrapper">
				<input
					type="text"
					on:input={(e) => (allDoneMessage = e.currentTarget.value)}
					value={allDoneMessage}
				/>
				<div class="Settings__input-line" />
				<div class="Settings__input-under-label">All Done! Message</div>
			</label>
		</div>

		<div class="Settings__row">
			<label class="Settings__input-wrapper">
				<input
					type="text"
					on:input={(e) => (imageSearchTerms = e.currentTarget.value)}
					value={imageSearchTerms}
				/>
				<div class="Settings__input-line" />
				<div class="Settings__input-under-label">Image search terms</div>
			</label>
		</div>

		<div class="Settings__row">
			<label class="Settings__input-wrapper Settings__input-wrapper--date">
				<input
					type="number"
					min="1"
					max="2100"
					on:input={(e) => updateDate('year', e)}
					value={padInt(date.year, 2)}
				/>
				<div class="Settings__input-line" />
				<div class="Settings__input-under-label">Year (YYYY)</div>
			</label>

			<label class="Settings__input-wrapper Settings__input-wrapper--date">
				<input
					type="number"
					min="1"
					max="12"
					on:input={(e) => updateDate('month', e)}
					value={padInt(date.month, 2)}
				/>
				<div class="Settings__input-line" />
				<div class="Settings__input-under-label">Month (MM)</div>
			</label>

			<label class="Settings__input-wrapper Settings__input-wrapper--date">
				<input
					type="number"
					min="1"
					max="31"
					on:input={(e) => updateDate('day', e)}
					value={padInt(date.day, 2)}
				/>
				<div class="Settings__input-line" />
				<div class="Settings__input-under-label">Day (DD)</div>
			</label>

			<label class="Settings__input-wrapper Settings__input-wrapper--date">
				<input
					type="number"
					min="0"
					max="23"
					on:input={(e) => updateDate('hour', e)}
					value={padInt(date.hour, 2)}
				/>
				<div class="Settings__input-line" />
				<div class="Settings__input-under-label">Hour (HH)</div>
			</label>

			<label class="Settings__input-wrapper Settings__input-wrapper--date">
				<input
					type="number"
					min="0"
					max="59"
					on:input={(e) => updateDate('minute', e)}
					value={padInt(date.minute, 2)}
				/>
				<div class="Settings__input-line" />
				<div class="Settings__input-under-label">Minute (MM)</div>
			</label>
		</div>

		<button class="Button" type="submit">Save</button>
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

	.Settings__close,
	.Vorfreude__show-settings {
		/* INITIAL OPACITY */
		opacity: 0.75;

		display: block;
		position: fixed;
		top: 1.2rem;
		right: 1.2rem;
		width: 30px;
		height: 30px;
	}

	@media only screen and (max-width: 425px) {
		.Settings__close,
		.Vorfreude__show-settings {
			width: 25px;
			height: 25px;
		}
	}

	.Settings__close:hover,
	.Vorfreude__show-settings:hover {
		/* HOVER OPACITY */
		opacity: 1;
	}

	.Settings__close-symbol,
	.Vorfreude__show-settings-symbol {
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

	#Settings__notification {
		position: fixed;
		display: flex;
		flex-direction: column;
		align-items: center;
		min-width: 150px;
		padding: 0.5em 0.75rem;
		text-align: center;
		border: 1px solid #fff;
		font-family: var(--neutral-font-family);
		font-size: 1.25rem;
		border-radius: 2rem;
		color: #fff;
		animation-name: notification-in, hide;
		animation-delay: 0ms, 3500ms;
		animation-duration: 350ms, 150ms;
		animation-fill-mode: forwards;
		animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.375);
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

	.Settings__label-text {
		padding-right: 3rem;
		width: 15rem;
		font-size: 1.25rem;
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
