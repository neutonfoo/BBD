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
// iF - Piano
//==============================================================================
	masterInsts.piano = { name: 'Piano'};
	masterInsts.piano.insts = []

	// Piano / Grand Piano
	var pianoGrandPiano = { instCode: 'pianoGrandPiano', name: 'Grand Piano', default: true, volume: -10 }
	pianoGrandPiano.notes = {
		'C3' : 'C2.mp3',
		'C4' : 'C3.mp3',
		'C5' : 'C4.mp3',
		'C6' : 'C5.mp3',
		'C7' : 'C6.mp3',
		'C8' : 'C7.mp3'
	}
	masterInsts.piano.insts.push(pianoGrandPiano)

//==============================================================================
// iF - Guitar
//==============================================================================
	masterInsts.guitar = { name: 'Guitar' }
	masterInsts.guitar.insts = []

	// Guitar / Acoustic Guitar
	var guitarAcousticGuitar = { instCode: 'guitarAcousticGuitar', name: 'Acoustic Guitar', default: true, volume: -5 }
	guitarAcousticGuitar.notes = {
		'C1' : 'C0.mp3',
		'C2' : 'C1.mp3',
		'C3' : 'C2.mp3',
		'C4' : 'C3.mp3',
		'C5' : 'C4.mp3',
		'C6' : 'C5.mp3',
		'C7' : 'C6.mp3'
	}
	masterInsts.guitar.insts.push(guitarAcousticGuitar)

	// Guitar / Electric Guitar
	var guitarElectricGuitar = { instCode: 'guitarElectricGuitar', name: 'Electric Guitar', volume: -15 }
	guitarElectricGuitar.notes = {
		'C3' : 'C2.mp3',
		'C4' : 'C3.mp3',
		'C5' : 'C4.mp3',
		'C6' : 'C5.mp3'
	}
	masterInsts.guitar.insts.push(guitarElectricGuitar)

//==============================================================================
// iF - Bass
//==============================================================================
	masterInsts.bass = { name: 'Bass' }
	masterInsts.bass.insts = []

	// Bass / Double Bass
	var bassDoubleBass = { instCode: 'bassDoubleBass', name: 'Double Bass', default: true, volume: -5 }
	bassDoubleBass.notes = {
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
	masterInsts.bass.insts.push(bassDoubleBass)

//==============================================================================
// iF - Strings
//==============================================================================
	masterInsts.strings = { name: 'Strings' }
	masterInsts.strings.insts = []

	var stringsViolin = { instCode: 'stringsViolin', name: 'Violin', default: true, volume: -4 }
	stringsViolin.notes = {
		'C3' : 'C2.mp3',
		'C4' : 'C3.mp3',
		'C5' : 'C4.mp3',
		'C6' : 'C5.mp3',
		'C7' : 'C6.mp3',
		'C8' : 'C7.mp3'
	}
	masterInsts.strings.insts.push(stringsViolin);

//==============================================================================
// Brass
//==============================================================================
	masterInsts.brass = { name: 'Brass' }
	masterInsts.brass.insts = []

	var brassTrumpet= { instCode: 'brassTrumpet',  name: 'Trumpet', default: true, volume: -7 }
	brassTrumpet.notes = {
		'C3' : 'C2.mp3',
		'C4' : 'C3.mp3',
		'C5' : 'C4.mp3',
		'C6' : 'C5.mp3',
		'C7' : 'C6.mp3'
	}
	masterInsts.brass.insts.push(brassTrumpet)

//==============================================================================
// iF - Synth
//==============================================================================
	masterInsts.synth = { name: 'Synth'};
	masterInsts.synth.insts = []

	// Piano / Grand Piano
	var synthDreamDancer = { instCode: 'synthDreamDancer', name: 'Dream Dancer', default: true, volume: -10 }
	synthDreamDancer.notes = {
		'C3' : 'C2.mp3',
		'C4' : 'C3.mp3',
		'C5' : 'C4.mp3',
		'C6' : 'C5.mp3',
		'C7' : 'C6.mp3',
		'C8' : 'C7.mp3'
	}
	masterInsts.synth.insts.push(synthDreamDancer)

//==============================================================================
// iF - Chinese Instruments
//==============================================================================
	masterInsts.chineseInsts = { name: 'Chinese Instruments' }
	masterInsts.chineseInsts.insts = []

	// Chinese Instruments / Pipa
	var chineseInstsPipa = { instCode: 'chineseInstsPipa', name: 'Pipa (琵琶)', default: true, volume: -10 }
	chineseInstsPipa.notes = {
		'C3' : 'C2.mp3',
		'C4' : 'C3.mp3',
		'C5' : 'C4.mp3',
		'C6' : 'C5.mp3',
		'C7' : 'C6.mp3'
	}
	masterInsts.chineseInsts.insts.push(chineseInstsPipa)

	// Chinese Instruments / Erhu
	var chineseInstsErhu = { instCode: 'chineseInstsErhu',  name: 'Erhu (二胡)', volume: -15 }
	chineseInstsErhu.notes = {
		'C3' : 'C2.mp3',
		'C4' : 'C3.mp3',
		'C5' : 'C4.mp3',
		'C6' : 'C5.mp3',
		'C7' : 'C6.mp3'
	}
	masterInsts.chineseInsts.insts.push(chineseInstsErhu)


//==============================================================================
// iF - Drums
//==============================================================================
	masterInsts.drums = { name: 'Drums' }
	masterInsts.drums.insts = []

	// Drums / Bluebird
	var drumsBluebird = { instCode: 'drumsBluebird', name: 'Bluebird Drum Kit', volume: -7 }
	drumsBluebird.notes = {
		'B1' : 'B0.mp3',
		'D2' : 'D1.mp3',
		'F2' : 'F1.mp3',
		'G2' : 'G1.mp3',
		'G#2' : 'Gs1.mp3',
		'C#3' : 'Cs2.mp3',
		'D#3' : 'Ds2.mp3'
	}
	masterInsts.drums.insts.push(drumsBluebird)

	// Drums / SoCal
	var drumsSoCal = { instCode: 'drumsSoCal', name: 'SoCal Drum Kit', default: true, volume: -5 }
	drumsSoCal.notes = {
		'B1' : 'B0.mp3',
		'D2' : 'D1.mp3',
		'F2' : 'F1.mp3',
		'G2' : 'G1.mp3',
		'G#2' : 'Gs1.mp3',
		'C#3' : 'Cs2.mp3',
		'D#3' : 'Ds2.mp3'
	}
	masterInsts.drums.insts.push(drumsSoCal)

//==============================================================================
// Preload Samples / Buffers on page load
//==============================================================================
	function loadBuffers() {

		$.each(masterInsts, function(instFamily, instFamilyMeta) {
			$.each(instFamilyMeta.insts, function(inst, instMeta) {
				instMeta.buffer = new Tone.Buffers(instMeta.notes, {
					'baseUrl': instsFolder + instMeta.instCode + '/',
					'onload': function() {
						console.log('Loading ' + instMeta.name + ' samples');
					}
				});

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
			$.each(instFamilyMeta.insts, function(inst, instMeta) {
					var newInstr = new Tone.Sampler({ }, {
						'release' : 1,
						'volume' : instMeta.volume
					});

					$.each(instMeta.notes, function(sampleNote) {
						newInstr.add(sampleNote, instMeta.buffer.get(sampleNote));
					});

					instMeta.preloaded = newInstr;
			});
		});
	}

//==============================================================================
// Check Buffers
//==============================================================================
	function instsLoadCheck() {
		masterInstsHavePreloaded = true;

		$.each(masterInsts, function(instFamily, instFamilyMeta) {
			$.each(instFamilyMeta.insts, function(inst, instMeta) {
				if(!instMeta.buffer.loaded) {
					masterInstsHavePreloaded = false;
					return false;
				}
			});
		});

		if(masterInstsHavePreloaded) {
			preLoadAllInstruments();
			console.log('All sample instruments preloaded');
			clearInterval(masterInstsLoadChecker);
		}
	}

	loadBuffers();
