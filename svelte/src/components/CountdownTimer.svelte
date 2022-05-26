<script lang="ts">
  import plural from '../helpers/plural-rules';
	import { DateTime, Interval } from 'luxon';
	import { onMount, onDestroy } from 'svelte';
	import { skimDeadTime } from '../helpers/skim-dead-time';
	import type { CountdownDuration, CountdownDateObject } from '../types';

	export let endDate: CountdownDateObject | undefined;

	$: duration = undefined;

	function updateTime() {
		if (endDate) {
			const end = DateTime.fromObject(endDate);
			const interval = Interval.fromDateTimes(DateTime.local(), end);
			const updatedDuration: CountdownDuration = interval.toDuration(['days', 'hours', 'minutes', 'seconds']).toObject();

      if (updatedDuration.seconds) {
        updatedDuration.seconds = Math.floor(updatedDuration.seconds);
      }

			duration = skimDeadTime(updatedDuration);
		}
	}

	const UPDATE_INTERVAL_IN_MS = 500;
	const intervalId = setInterval(updateTime, UPDATE_INTERVAL_IN_MS);

	onMount(() => updateTime());
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
	.CountdownTimer {
		font-size: calc(var(--base-screen-proportional-font-size-desktop) * 0.8);
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
