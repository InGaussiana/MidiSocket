<script lang="ts">
	import Oscillator from '$lib/audio/Oscillator.svelte';
	import { getContext } from 'svelte';

	export let enabled = true;
	export let frequency = 10;

	const destination = getContext<SvelteStore<AudioNode>>('destination');
</script>

{#if enabled && $destination}
	<Oscillator {frequency} playing={true} audioParam="gain" />
{/if}
