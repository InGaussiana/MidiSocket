<script lang="ts">
	import { getContext } from 'svelte';
	import { noteToMidi } from './audio/notes';
	import Amp from '$lib/audio/Amp.svelte';
	import Piano from '$lib/audio/misc/Piano.svelte';

	export let chanel = 0;

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

<Amp>
	<Piano showNotation on:keyPressed={handleKeyPressed} on:keyReleased={handleKeyReleased} />
</Amp>
