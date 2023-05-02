<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Note from './Note.svelte';

	export let attackTime = 0.3;
	export let decayTime = 0.3;
	export let volume = 0.7;
	export let releaseTime = 0.8;
	export let note = 'C4';
	export let waveType: 'sawtooth' | 'sine' | 'square' | 'triangle' = 'sine';
	export let playing = false;
	export let vertical = false;
	export let showNotation = false;

	$: blacknote = note.includes('#');
	const dispatch = createEventDispatcher();

	const play = () => {
		playing = true;
		dispatch('keyPressed', { note });
	};

	const stop = () => {
		if (playing) {
			playing = false;
			dispatch('keyReleased', { note });
		}
	};
</script>

<Note {attackTime} {decayTime} {volume} {releaseTime} {playing} {waveType} {note}>
	<slot />
</Note>

<button
	id={note}
	class="keynote"
	class:blacknote
	class:verticalkey={vertical}
	class:playing
	on:mousedown={play}
	on:mouseup={stop}
	on:mouseleave={stop}
>
	{#if showNotation}
		{note.slice(0, note.length - 1)}
		{#if !blacknote}
			<sub>{note[note.length - 1]}</sub>
		{/if}
	{/if}
</button>
