<script>
	import plural from '../helpers/plural-rules';
	export let time;
</script>

<div class="CountdownTimer">
	{#if time}
		{#if time.days}
			<div class="CountdownTimer__segment">
				{time.days}
				{plural(time.days, 'days')}
			</div>
		{/if}

		{#if time.hours}
			<div class="CountdownTimer__segment">
				{time.hours}
				{plural(time.hours, 'hours')}
			</div>
		{/if}

		{#if time.minutes}
			<div class="CountdownTimer__segment">
				{time.minutes}
				{plural(time.minutes, 'minutes')}
			</div>
		{/if}

		{#if time.seconds}
			<div class="CountdownTimer__segment">
				{time.seconds}
				{plural(time.seconds, 'seconds')}
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
