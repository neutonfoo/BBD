// Not in $(document).ready(); to allow for early loading during page render.

//==============================================================================
// Variables
//==============================================================================
	var instsFolder = './insts/';

	var sampleInstsLoadChecker;
	var sampleInstsLoaded = false;

	var samplesInsts = {}

//==============================================================================
// Voice Sampling for lulz
//==============================================================================
	// samplesInsts.ken = { name: 'Ken', baseUrl: './customSamples/ken/', volume: 10 }
	// samplesInsts.ken.notes = {
	// 	'C3' : 'C3.mp3',
	// 	'C4' : 'C4.mp3',
	// 	'G2' : 'G2.mp3',
	// 	'G4' : 'G4.mp3'
	// }

//==============================================================================
// Synth
//==============================================================================
	samplesInsts.synth = { name: 'Synth', volume: -5 }

//==============================================================================
// Piano
//==============================================================================
	samplesInsts.piano = { name: 'Piano', baseUrl: instsFolder + 'piano/', volume: -10 }
	samplesInsts.piano.notes = {
		'E4' : 'E4.mp3',
		'F4' : 'F4.mp3',
		'G4' : 'G4.mp3',
		'A4' : 'A4.mp3',
		'B4' : 'B4.mp3',

		'C5' : 'C5.mp3',
		'D5' : 'D5.mp3',
		'E5' : 'E5.mp3',
		'F5' : 'F5.mp3',
		'G5' : 'G5.mp3',
		'A5' : 'A5.mp3'
	}

	// samplesInsts.piano = { name: 'Piano', baseUrl: 'piano/', volume: 0 }
	// samplesInsts.piano.notes = {
	// 	'A0' : 'A0.mp3',
	// 	'C1' : 'C1.mp3',
	// 	'D#1' : 'Ds1.mp3',
	// 	'F#1' : 'Fs1.mp3',
	// 	'A1' : 'A1.mp3',
	// 	'C2' : 'C2.mp3',
	// 	'D#2' : 'Ds2.mp3',
	// 	'F#2' : 'Fs2.mp3',
	// 	'A2' : 'A2.mp3',
	// 	'C3' : 'C3.mp3',
	// 	'D#3' : 'Ds3.mp3',
	// 	'F#3' : 'Fs3.mp3',
	// 	'A3' : 'A3.mp3',
	// 	'C4' : 'C4.mp3',
	// 	'D#4' : 'Ds4.mp3',
	// 	'F#4' : 'Fs4.mp3',
	// 	'A4' : 'A4.mp3',
	// 	'C5' : 'C5.mp3',
	// 	'D#5' : 'Ds5.mp3',
	// 	'F#5' : 'Fs5.mp3',
	// 	'A5' : 'A5.mp3',
	// 	'C6' : 'C6.mp3',
	// 	'D#6' : 'Ds6.mp3',
	// 	'F#6' : 'Fs6.mp3',
	// 	'A6' : 'A6.mp3',
	// 	'C7' : 'C7.mp3',
	// 	'D#7' : 'Ds7.mp3',
	// 	'F#7' : 'Fs7.mp3',
	// 	'A7' : 'A7.mp3',
	// 	'C8' : 'C8.mp3'
	// }

//==============================================================================
// Guitar
//==============================================================================
	samplesInsts.guitar = { name: 'Guitar', baseUrl: instsFolder + 'guitar/', volume: -15 }
	samplesInsts.guitar.notes = {
		'C3' : 'C3.mp3',
		'D3' : 'D3.mp3',
		'E3' : 'E3.mp3',
		'F3' : 'F3.mp3',
		'G3' : 'G3.mp3',
		'A3' : 'A3.mp3',
		'B3' : 'B3.mp3',

		'C4' : 'C4.mp3',
		'D4' : 'D4.mp3',
		'E4' : 'E4.mp3',
		'F4' : 'F4.mp3',
		'G4' : 'G4.mp3',
		'A4' : 'A4.mp3',
		'B4' : 'B4.mp3',

		'C5' : 'C5.mp3',
		'D5' : 'D5.mp3',
		'E5' : 'E5.mp3',
		'F5' : 'F5.mp3',
		'G5' : 'G5.mp3',
		'A5' : 'A5.mp3',
		'B5' : 'B5.mp3'
	}

//==============================================================================
// Strings
//==============================================================================
	samplesInsts.strings = { name: 'Violin', baseUrl: instsFolder + 'violin/', volume: -8 }
	samplesInsts.strings.notes = {
		'C5': 'C5.mp3',
		'F5': 'F5.mp3',
		'A5': 'A5.mp3'
	}

//==============================================================================
// Bass
//==============================================================================
	samplesInsts.bass = { name: 'Double Bass', baseUrl: instsFolder + 'doublebass/', volume: -8 }
	samplesInsts.bass.notes = {
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
// Drums
//==============================================================================
	samplesInsts.drums = { name: 'Drums', baseUrl: './drums/fixed/', volume: -15 }
	samplesInsts.drums.notes = {
		'G#2' : 'Gs2.mp3',
		'B1' : 'B1.mp3',
		'G2' : 'G2.mp3',
		'D2' : 'D2.mp3',
		'C#3' : 'Cs3.mp3',
		'D#3' : 'Ds3.mp3',
		'F2' : 'F2.mp3'
	}

//==============================================================================
// Brass
//==============================================================================
		samplesInsts.brass = { name: 'Trumpet', baseUrl: instsFolder + 'brass/', volume: -8 }
		samplesInsts.brass.notes = {
			'A4' : 'A4.mp3',
			'B4' : 'B4.mp3',
			'C5' : 'C5.mp3',
			'F4' : 'F4.mp3',
			'F5' : 'F5.mp3'
		}

//==============================================================================
// Load Buffers
//==============================================================================
	function loadBuffers() {

		$.each(samplesInsts, function(samplesInst, samplesInstMeta) {
			if(samplesInst != 'none') {
				samplesInstMeta.buffer = new Tone.Buffers(samplesInstMeta.notes, {
					'baseUrl': samplesInstMeta.baseUrl,
						'onload': function() {
							console.log('Loaded ' + samplesInstMeta.name + ' samples');
						}
				});
			}
		})

		sampleInstsLoadChecker = setTimeout(function() {
			instsLoadCheck();
		}, 2000);
	}

//==============================================================================
// Check Buffers
//==============================================================================
	function instsLoadCheck() {
		sampleInstsLoaded = true;

		$.each(samplesInsts, function(inst) {
			if(!samplesInsts[inst].buffer.loaded) {
				sampleInstsLoaded = false;
				return false;
			}
		});

		console.log('All sample instruments loaded');
		clearTimeout(sampleInstsLoadChecker);
	}

	loadBuffers();
