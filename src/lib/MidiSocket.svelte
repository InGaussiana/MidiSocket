<script lang="ts">
	import { midiNotes } from '$lib/audio/notes';
	import MidiContext from '$lib/audio/MidiContext.svelte';
	import AudioContext from '$lib/audio/AudioContext.svelte';
	import Tremolo from '$lib/audio/effects/Tremolo.svelte';
	import Vibrato from './audio/effects/Vibrato.svelte';
	import Amp from '$lib/audio/Amp.svelte';
	import Note from '$lib/audio/misc/Note.svelte';
	import WSContext from '$lib/WSContext.svelte';
	import MidiSocketInstrument from './MidiSocketInstrument.svelte';

	let vertical = false;
	let vibrato = false;
	let tremolo = false;
	let waveType: WaveType = 'sine';
	let volume: number = 0.5;
	let MIDIVolume: number = 0.7;
	let MIDIwaveType: WaveType = 'sine';
	let midiPressed: MusicalNote[] = [];

	const MIDIStatus: { [x: string]: string } = {
		NOTE_OFF: '8',
		NOTE_ON: '9'
	};

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

<div style="padding: 20px; display: flex; gap: 10px; justify-content: space-between">
	<div style="display: flex; gap: 10px;">
		<button on:click={() => (vertical = !vertical)}> Swap View </button>
		<button on:click={() => (vibrato = !vibrato)}>
			{vibrato ? 'Disable' : 'Enable'} Vibrato
		</button>
		<button on:click={() => (tremolo = !tremolo)}>
			{tremolo ? 'Disable' : 'Enable'} Tremolo
		</button>
	</div>

	<div style="display: flex; gap: 10px;">
		<div>
			<div>Piano volume</div>
			<input type="range" min={0} max={1} step={0.05} bind:value={volume} />
		</div>
		<div>
			<div>Piano wave type</div>
			<select name="waveType" id="waveType" bind:value={waveType}>
				<option value="sine">Sine</option>
				<option value="square">Square</option>
				<option value="sawtooth">sawtooth</option>
				<option value="triangle">triangle</option>
			</select>
		</div>

		<div>
			<div>Midi volume</div>
			<input type="range" min={0} max={1} step={0.05} bind:value={MIDIVolume} />
		</div>
		<div>
			<div>Midi wave type</div>
			<select name="MIDIwaveType" id="MIDIwaveType" bind:value={MIDIwaveType}>
				<option value="sine">Sine</option>
				<option value="square">Square</option>
				<option value="sawtooth">sawtooth</option>
				<option value="triangle">triangle</option>
			</select>
		</div>
	</div>
</div>

<WSContext on:message={handleMessage}>
	<AudioContext>
		<MidiContext on:midimessage={handleKeyPressed} />

		<Amp volume={MIDIVolume}>
			{#each midiPressed as note (note)}
				<Note
					{note}
					playing
					volume={MIDIVolume}
					attackTime={0}
					decayTime={0}
					releaseTime={0.1}
					waveType={MIDIwaveType}
				/>
			{/each}
		</Amp>

		<Amp {volume}>
			<Tremolo enabled={tremolo} />
			<MidiSocketInstrument {waveType} {vertical} {volume}>
				<Vibrato enabled={vibrato} frequency={10} />
			</MidiSocketInstrument>
		</Amp>
	</AudioContext>
</WSContext>
