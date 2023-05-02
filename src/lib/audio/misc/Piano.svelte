<script lang="ts">
	import { onMount } from 'svelte';
	import { noteFrequencies } from '../notes';
	import PianoKey from './PianoKey.svelte';

	export let waveType: 'sawtooth' | 'sine' | 'square' | 'triangle' = 'sine';
	export let notes = Object.keys(noteFrequencies);
	export let showNotation = false;
	export let vertical = false;

	let container: HTMLDivElement;

	onMount(() => {
		if (container) {
			container.scrollTo(container.scrollWidth / 10, 0);
		}
	});
</script>

<div class="piano" class:verticalpiano={vertical} bind:this={container}>
	{#each notes as note}
		<PianoKey {note} {waveType} {showNotation} {vertical} on:keyPressed on:keyReleased>
			<slot />
		</PianoKey>
	{/each}
</div>
