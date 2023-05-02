<script lang="ts">
	import { midiNotes } from '$lib/audio/notes';
	import MidiContext from '$lib/audio/MidiContext.svelte';
	import AudioContext from '$lib/audio/AudioContext.svelte';
	import Amp from '$lib/audio/Amp.svelte';
	import Note from '$lib/audio/misc/Note.svelte';
	import WSContext from '$lib/WSContext.svelte';
	import MidiSocketInstrument from './MidiSocketInstrument.svelte';

	const MIDIStatus: { [x: string]: string } = {
		NOTE_OFF: '8',
		NOTE_ON: '9'
	};

	let midiPressed: string[] = [];

	const handleKeyPressed = (e: CustomEvent<{ data: Uint8Array; timestamp: number }>) => {
		const statusByte = e.detail.data[0].toString(16);
		const chanel = parseInt(statusByte[1], 16) + 1;
		const event = statusByte[0];
		const note = e.detail.data[1];
		const velocity = e.detail.data[2];

		if (event === MIDIStatus.NOTE_ON) {
			midiPressed = [...midiPressed, midiNotes[note]];
		}

		if (event === MIDIStatus.NOTE_OFF) {
			midiPressed = midiPressed.filter((v) => v !== midiNotes[note]);
		}
	};

	const handleMessage = (data: any) => {
		try {
			handleKeyPressed(data);
		} catch (e) {}
	};
</script>

<WSContext on:message={handleMessage}>
	<AudioContext>
		<MidiContext on:midimessage={handleKeyPressed} />

		<Amp>
			{#each midiPressed as note (note)}
				<Note {note} playing attackTime={0} decayTime={0} />
			{/each}
		</Amp>

		<MidiSocketInstrument />
	</AudioContext>
</WSContext>
