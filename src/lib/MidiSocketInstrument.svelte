<script lang="ts">
	import { getContext } from 'svelte';
	import { noteToMidi } from './audio/notes';
	import Piano from '$lib/audio/misc/Piano.svelte';

	export let waveType: WaveType = 'sine';
	export let chanel = 0;
	export let vertical = false;
	export let volume = 0.7;

	$: channel = chanel.toString(16);

	const ws = getContext<{
		send: (data: any) => void;
	}>('ws');

	const handleKeyPressed = (e: CustomEvent<{ note: string }>) => {
		ws.send({
			data: [parseInt(`9${channel}`, 16), noteToMidi(e.detail.note), 60],
			timestamp: Date.now()
		});
	};

	const handleKeyReleased = (e: CustomEvent<{ note: string }>) => {
		ws.send({
			data: [parseInt(`8${channel}`, 16), noteToMidi(e.detail.note), 60],
			timestamp: Date.now()
		});
	};
</script>

<Piano
	{volume}
	{vertical}
	{waveType}
	showNotation
	on:keyPressed={handleKeyPressed}
	on:keyReleased={handleKeyReleased}
>
	<slot />
</Piano>
