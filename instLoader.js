// Not in $(document).ready(); to allow for early loading during page render.

//==============================================================================
// Variables
//==============================================================================
	var instsFolder = './insts/';

	var sampleInstsLoadChecker;
	var sampleInstsLoaded = false;

	var samplesInsts = {}
	var instsPreloaded = [];

//==============================================================================
// Voice Sampling for lulz
//==============================================================================
	// samplesInsts.ken = { name: 'Ken', baseUrl: './customSamples/ken/', volume: 10 }
	// samplesInsts.ken.notes = {
	// 	'C3' : 'C3.mp3',
	// 	'C4' : 'C4.mp3',
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
		'C3' : 'C2.mp3',
		'C4' : 'C3.mp3',
		'C5' : 'C4.mp3',
		'C6' : 'C5.mp3',
		'C7' : 'C6.mp3',
		'C8' : 'C7.mp3'
	}

//==============================================================================
// Guitar
//==============================================================================
	samplesInsts.guitar = { name: 'Electric Guitar', baseUrl: instsFolder + 'electricGuitar/', volume: -15 }
	samplesInsts.guitar.notes = {
		'C3' : 'C2.mp3',
		'C4' : 'C3.mp3',
		'C5' : 'C4.mp3',
		'C6' : 'C5.mp3'
	}


//==============================================================================
// Strings
//==============================================================================
	samplesInsts.strings = { name: 'Violin', baseUrl: instsFolder + 'violin/', volume: -3 }
	samplesInsts.strings.notes = {
		'C3' : 'C2.mp3',
		'C4' : 'C3.mp3',
		'C5' : 'C4.mp3',
		'C6' : 'C5.mp3',
		'C7' : 'C6.mp3',
		'C8' : 'C7.mp3'
	}

//==============================================================================
// Bass
//==============================================================================
	samplesInsts.bass = { name: 'Double Bass', baseUrl: instsFolder + 'doubleBass/', volume: -3 }
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
	samplesInsts.drums = { name: 'Drums', baseUrl: instsFolder + 'drums/', volume: -15 }
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
	samplesInsts.brass = { name: 'Trumpet', baseUrl: instsFolder + 'trumpet/', volume: -4 }
	samplesInsts.brass.notes = {
		'C3' : 'C2.mp3',
		'C4' : 'C3.mp3',
		'C5' : 'C4.mp3',
		'C6' : 'C5.mp3',
		'C7' : 'C6.mp3'
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

		sampleInstsLoadChecker = setInterval(function() {
			instsLoadCheck();
		}, 3000);
	}

//==============================================================================
// Preload Instruments to Array (removes need for re-sampling)
//==============================================================================
	function preLoadAllInstruments() {
		$.each(samplesInsts, function(instFamily, instFamilyMeta) {
			var newInstr = new Tone.Sampler({}, {
				'release' : 1,
				'volume' : instFamilyMeta.volume
			});

			$.each(instFamilyMeta.notes, function(sampleNote) {
				newInstr.add(sampleNote, instFamilyMeta.buffer.get(sampleNote));
			});
			instFamilyMeta.preloaded = newInstr;
		});
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

		preLoadAllInstruments();

		console.log('All sample instruments preloaded');

		clearInterval(sampleInstsLoadChecker);
	}

	loadBuffers();
