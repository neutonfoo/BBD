//==============================================================================
// Variables
//==============================================================================
	var instsFolder = 'insts/';

	// Contains all master insts metadata and preloaded master insts
	var masterInsts = {}

	// masterInstsLoadChecker will be assigned to a setInterval which will check if all master insts have been loaded
	var masterInstsLoadChecker;

	// masterInstsHavePreloaded is a global boolean used by player.js to check if master insts have been preloaded
	var masterInstsHavePreloaded = false;

//==============================================================================
// Synth
//==============================================================================
	masterInsts.synth = { name: 'Synth', volume: -5 }

//==============================================================================
// Piano
//==============================================================================
	masterInsts.piano = { name: 'Piano', baseUrl: instsFolder + 'piano/', volume: -10 }
	masterInsts.piano.notes = {
		'C3' : 'C2.mp3',
		'C4' : 'C3.mp3',
		'C5' : 'C4.mp3',
		'C6' : 'C5.mp3',
		'C7' : 'C6.mp3',
		'C8' : 'C7.mp3'
	}

//==============================================================================
// Pipa
//==============================================================================
	masterInsts.pipa = { name: 'Pipa (琵琶)', baseUrl: instsFolder + 'pipa/', volume: -10 }
	masterInsts.pipa.notes = {
		'C3' : 'C2.mp3',
		'C4' : 'C3.mp3',
		'C5' : 'C4.mp3',
		'C6' : 'C5.mp3',
		'C7' : 'C6.mp3'
	}

//==============================================================================
// Erhu
//==============================================================================
	masterInsts.erhu = { name: 'Erhu (二胡)', baseUrl: instsFolder + 'erhu/', volume: -10 }
	masterInsts.erhu.notes = {
		'C3' : 'C2.mp3',
		'C4' : 'C3.mp3',
		'C5' : 'C4.mp3',
		'C6' : 'C5.mp3',
		'C7' : 'C6.mp3'
	}

//==============================================================================
// Acoustic Guitar
//==============================================================================
	masterInsts.guitar = { name: 'Acoustic Guitar', baseUrl: instsFolder + 'acousticGuitar/', volume: -5 }
	masterInsts.guitar.notes = {
		'C1' : 'C0.mp3',
		'C2' : 'C1.mp3',
		'C3' : 'C2.mp3',
		'C4' : 'C3.mp3',
		'C5' : 'C4.mp3',
		'C6' : 'C5.mp3',
		'C7' : 'C6.mp3'
	}

//==============================================================================
// Electric Guitar
//==============================================================================
	masterInsts.electricGuitar = { name: 'Electric Guitar', baseUrl: instsFolder + 'electricGuitar/', volume: -15 }
	masterInsts.electricGuitar.notes = {
		'C3' : 'C2.mp3',
		'C4' : 'C3.mp3',
		'C5' : 'C4.mp3',
		'C6' : 'C5.mp3'
	}


//==============================================================================
// Strings
//==============================================================================
	masterInsts.strings = { name: 'Violin', baseUrl: instsFolder + 'violin/', volume: -3 }
	masterInsts.strings.notes = {
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
	masterInsts.bass = { name: 'Double Bass', baseUrl: instsFolder + 'bass/', volume: -3 }
	masterInsts.bass.notes = {
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
	masterInsts.drums = { name: 'Drums', baseUrl: instsFolder + 'drums/', volume: -10 }
	masterInsts.drums.notes = {
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
	masterInsts.brass = { name: 'Trumpet', baseUrl: instsFolder + 'trumpet/', volume: -4 }
	masterInsts.brass.notes = {
		'C3' : 'C2.mp3',
		'C4' : 'C3.mp3',
		'C5' : 'C4.mp3',
		'C6' : 'C5.mp3',
		'C7' : 'C6.mp3'
	}

//==============================================================================
// Preload Samples / Buffers on page load
//==============================================================================
	function loadBuffers() {

		$.each(masterInsts, function(masterInst, masterInstMeta) {
			masterInstMeta.buffer = new Tone.Buffers(masterInstMeta.notes, {
				'baseUrl': masterInstMeta.baseUrl,
				'onload': function() {
					console.log('Loading ' + masterInstMeta.name + ' samples');
				}
			});
		});

		// Assign setInterval() on masterInstsLoadChecker to check status and update masterInstsHavePreloaded
		masterInstsLoadChecker = setInterval(function() {
			instsLoadCheck();
		}, 3000);
	}

//==============================================================================
// Preload Instruments to Array (removes need for re-sampling on instrument change)
//==============================================================================
	function preLoadAllInstruments() {
		$.each(masterInsts, function(instFamily, instFamilyMeta) {
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
		masterInstsHavePreloaded = true;

		$.each(masterInsts, function(inst) {
			if(!masterInsts[inst].buffer.loaded) {
				masterInstsHavePreloaded = false;
				return false;
			}
		});

		if(masterInstsHavePreloaded) {
			preLoadAllInstruments();
			console.log('All sample instruments preloaded');
			clearInterval(masterInstsLoadChecker);
		}
	}

	loadBuffers();
