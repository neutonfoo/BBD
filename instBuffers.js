//==============================================================================
// Instrument Buffers
//==============================================================================

	var instsFolder = './insts/';

	var samplesNotes = {}
	var buffers = {}

//==============================================================================
// Piano Notes
//==============================================================================
	samplesNotes.piano = {
		'A0' : 'A0.mp3',
		'C1' : 'C1.mp3',
		'D#1' : 'Ds1.mp3',
		'F#1' : 'Fs1.mp3',
		'A1' : 'A1.mp3',
		'C2' : 'C2.mp3',
		'D#2' : 'Ds2.mp3',
		'F#2' : 'Fs2.mp3',
		'A2' : 'A2.mp3',
		'C3' : 'C3.mp3',
		'D#3' : 'Ds3.mp3',
		'F#3' : 'Fs3.mp3',
		'A3' : 'A3.mp3',
		'C4' : 'C4.mp3',
		'D#4' : 'Ds4.mp3',
		'F#4' : 'Fs4.mp3',
		'A4' : 'A4.mp3',
		'C5' : 'C5.mp3',
		'D#5' : 'Ds5.mp3',
		'F#5' : 'Fs5.mp3',
		'A5' : 'A5.mp3',
		'C6' : 'C6.mp3',
		'D#6' : 'Ds6.mp3',
		'F#6' : 'Fs6.mp3',
		'A6' : 'A6.mp3',
		'C7' : 'C7.mp3',
		'D#7' : 'Ds7.mp3',
		'F#7' : 'Fs7.mp3',
		'A7' : 'A7.mp3',
		'C8' : 'C8.mp3'
	}

//==============================================================================
// Bass Notes
//==============================================================================
samplesNotes.bass = {
	'A1' : 'A1.mp3',
	'C2' : 'C2.mp3',
	'A2' : 'A2.mp3',
	'A3' : 'A3.mp3',
	'C4' : 'C4.mp3',
	'A4' : 'A4.mp3',
	'C5' : 'C5.mp3',
	'F5' : 'F5.mp3',
	'A5' : 'A5.mp3'
}

//==============================================================================
// Guitar Notes
//==============================================================================
samplesNotes.guitar = {
	'C4' : 'C4.mp3',
	'D4' : 'D4.mp3'
}

//==============================================================================
// Drums Notes
//==============================================================================
samplesNotes.drums = {
	'G#2' : 'Gs2.mp3',
	'B1' : 'B1.mp3',
	'G2' : 'G2.mp3',
	'D2' : 'D2.mp3',
	'C#3' : 'Cs3.mp3',
	'D#3' : 'Ds3.mp3',
	'F2' : 'F2.mp3'
}

//==============================================================================
// Strings Notes
//==============================================================================
	samplesNotes.strings = {
		'C5': 'C5.mp3',
		'F5': 'F5.mp3',
		'A5': 'A5.mp3'
	}

	function loadBuffers() {
		buffers.piano = new Tone.Buffers(samplesNotes.piano, {
			'baseUrl': 'piano/',
			'onload': function() {
				console.log('Loaded Piano')
			}
		});

		buffers.bass = new Tone.Buffers(samplesNotes.bass, {
			'baseUrl': instsFolder + 'doublebass/',
			'onload': function() {
				console.log('Loaded Bass')
			}
		});

		buffers.guitar = new Tone.Buffers(samplesNotes.guitar, {
			'baseUrl': './guitar/',
			'onload': function() {
				console.log('Loaded Guitar')
			}
		});

		buffers.drums = new Tone.Buffers(samplesNotes.drums, {
			'baseUrl': './drums/fixed/',
			'onload': function() {
				console.log('Loaded Drums')
			}
		});

		buffers.strings = new Tone.Buffers(samplesNotes.strings, {
			'baseUrl': instsFolder + 'violin/',
			'onload': function() {
				console.log('Loaded Strings')
			}
		});
	}

loadBuffers();
