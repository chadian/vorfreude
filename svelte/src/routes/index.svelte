<script>
	import CountdownTimer from '../components/CountdownTimer.svelte';
	import Settings from '../components/Settings.svelte';
	import '../global.css';
</script>

<div class="shell">
	<Settings />
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

	.shell {
		width: 100%;
		height: 100%;
		margin: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		opacity: 0;
		animation-name: show;
		animation-delay: 300ms;
		animation-duration: 500ms;
		animation-fill-mode: forwards;
		animation-timing-function: cubic-bezier(0.175, 0, 4, 0.885);
	}
</style>
