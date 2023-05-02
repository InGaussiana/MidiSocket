<script lang="ts">
	import { browser } from '$app/environment';
	import { getContext, setContext, onDestroy } from 'svelte';
	import { writable } from 'svelte/store';

	export let attackTime = 0;
	export let decayTime = 0;
	export let volume = 0.7;
	export let releaseTime = 0.3;
	export let audioParam: string | null = null;
	export let playing = true;

	const amp = writable<GainNode | null>(null);
	const stopTime = writable<number>(releaseTime);

	const audioCtx = getContext<SvelteStore<AudioContext>>('audioCtx');
	const destination = getContext<SvelteStore<AudioNode>>('destination');

	setContext('destination', amp);
	setContext('releaseTime', stopTime);

	$: browser && $audioCtx && $destination && start();
	$: playing ? start() : stop();

	const start = () => {
		if (!$audioCtx || !$destination) return;

		const now = $audioCtx.currentTime;
		$amp = $audioCtx.createGain();
		$amp.gain.setValueAtTime(0, 0);
		$amp.gain.linearRampToValueAtTime(volume, now + attackTime);
		$amp.gain.linearRampToValueAtTime(volume, now + attackTime + decayTime);
		if (audioParam) {
			// @ts-ignore
			$amp.connect($destination[audioParam] as AudioParam);
		} else {
			$amp.connect($destination);
		}
	};

	const stop = () => {
		if ($amp) {
			const now = $audioCtx.currentTime;
			$amp.gain.setValueAtTime(volume, now);
			$amp.gain.linearRampToValueAtTime(0, now + releaseTime);
		}
	};

	onDestroy(stop);
</script>

{#if playing}
	<slot />
{/if}
