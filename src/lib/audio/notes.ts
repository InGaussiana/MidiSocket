function getNotesFrequencies() {
	const A4 = 440;
	const notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
	const freqStep = Math.pow(2, 1 / 12);
	const octaves = new Array(7).fill(0).map((_, i) => i + 1);

	const notesFreq = octaves
		.map((octave) =>
			notes.map((note, i) => {
				const name = note + (octave + +(i >= 3));
				const freq = A4 * Math.pow(freqStep, notes.length * (octave - 4) + i);
				return { name, freq };
			})
		)
		.flat()
		.reduce((notes: { [x: string]: number }, note) => {
			notes[note.name] = note.freq;
			return notes;
		}, {});

	return notesFreq;
}

function getMidiNotes(): { [x: number]: MusicalNote } {
	const notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
	const octaves = new Array(7).fill(0).map((_, i) => i + 1);

	let midiuid = 33;
	const midiNotes = octaves
		.map((octave) =>
			notes.map((note, i) => {
				const name = note + (octave + +(i >= 3));
				const uid = midiuid++;
				return { name, uid };
			})
		)
		.flat()
		.reduce((notes: { [x: number]: string }, note) => {
			notes[note.uid] = note.name;
			return notes;
		}, {});

	// @ts-ignore
	return midiNotes;
}

const noteFrequencies = getNotesFrequencies();
const midiNotes = getMidiNotes();

function noteToMidi(note: string) {
	return Object.keys(midiNotes).find((uid: any) => midiNotes[uid] === note);
}

export { noteFrequencies, midiNotes, noteToMidi };
