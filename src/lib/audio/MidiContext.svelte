<script lang="ts">
	import { browser } from '$app/environment';
	import { createEventDispatcher, getContext, onMount, setContext } from 'svelte';

	let midiAccess: MidiAccess;

	const ws = getContext<{
		send: (data: any) => void;
	}>('ws');
	setContext('midi', { getMidi: () => midiAccess });

	const dispatch = createEventDispatcher();

	async function ConnectMidi() {
		try {
			// @ts-ignore
			midiAccess = await navigator.requestMIDIAccess();
			console.log('MIDI ready!');

			midiAccess.inputs.forEach((entry: { onmidimessage: (event: MidiEvent) => void }) => {
				entry.onmidimessage = (event: MidiEvent) => {
					if (ws) {
						ws.send({ data: event.data, timestamp: event.timeStamp });
					}
					dispatch('midimessage', { data: event.data, timestamp: event.timeStamp });
				};
			});
		} catch (error) {
			console.error(`Failed to get MIDI access - ${error}`);
		}
	}

	onMount(() => {
		if (browser) {
			ConnectMidi();
		}
	});
</script>

{#if browser}
	<slot />
{/if}
