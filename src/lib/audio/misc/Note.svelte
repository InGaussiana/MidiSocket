<script lang="ts">
	import Oscillator from '../Oscillator.svelte';
	import Amp from '../Amp.svelte';
	import { noteFrequencies } from '../notes';

	export let attackTime = 0.3;
	export let decayTime = 0.3;
	export let volume = 0.7;
	export let releaseTime = 0.8;
	export let note: MusicalNote = 'C4';
	export let waveType: WaveType = 'sine';
	export let playing = false;

	$: frequency = noteFrequencies[note];
</script>

<Amp {attackTime} {decayTime} {volume} {releaseTime} {playing}>
	<Oscillator {frequency} {waveType} {playing}>
		<slot />
	</Oscillator>
</Amp>
