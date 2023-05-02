<script lang="ts">
	import { getContext, setContext } from 'svelte';
	import { writable } from 'svelte/store';

	export let frequency = 440;
	export let waveType: 'sawtooth' | 'sine' | 'square' | 'triangle' = 'sine';
	export let playing = false;
	export let audioParam: string | null = null;

	const noteOscillator = writable<OscillatorNode | null>(null);

	const audioCtx = getContext<SvelteStore<AudioContext>>('audioCtx');
	const destination = getContext<SvelteStore<GainNode>>('destination');

	setContext('destination', noteOscillator);

	$: playing && play();

	const play = () => {
		if (!$audioCtx || !$destination) return;

		$noteOscillator = $audioCtx.createOscillator();
		$noteOscillator.type = waveType;
		$noteOscillator.frequency.setValueAtTime(frequency, $audioCtx.currentTime);

		if (audioParam) {
			// @ts-ignore
			$noteOscillator.connect($destination[audioParam] as AudioParam);
		} else {
			$noteOscillator.connect($destination);
		}
		$noteOscillator.start();
	};

	// const stop = () => {
	// 	if ($noteOscillator) {
	// 		$noteOscillator.stop();
	// 		$noteOscillator = null;
	// 	}
	// };
</script>

{#if playing}
	<slot />
{/if}
