<script lang="ts">
	import Amp from '$lib/audio/Amp.svelte';
	import Oscillator from '$lib/audio/Oscillator.svelte';
	import { getContext } from 'svelte';

	export let enabled = true;
	export let gain = 1.5;
	export let frequency = 10;

	const destination = getContext<SvelteStore<AudioNode>>('destination');
</script>

{#if enabled && $destination}
	<Amp volume={gain} audioParam="frequency">
		<Oscillator {frequency} playing={true} />
	</Amp>
{/if}
