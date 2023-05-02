<script lang="ts">
	import { onMount } from 'svelte';
	import { noteFrequencies } from '../notes';
	import PianoKey from './PianoKey.svelte';

	export let waveType: WaveType = 'sine';
	// @ts-ignore
	export let notes: MusicalNotes[] = Object.keys(noteFrequencies);
	export let showNotation = false;
	export let vertical = false;
	export let volume = 0.7;

	let container: HTMLDivElement;

	onMount(() => {
		if (container) {
			container.scrollTo(container.scrollWidth / 10, 0);
		}
	});
</script>

<div class="piano" class:verticalpiano={vertical} bind:this={container}>
	{#each notes as note}
		<PianoKey {note} {waveType} {showNotation} {volume} {vertical} on:keyPressed on:keyReleased>
			<slot />
		</PianoKey>
	{/each}
</div>
