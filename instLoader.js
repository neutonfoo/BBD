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
	var pianoGrandPiano = { instCode: 'pianoGrandPiano', name: 'Grand Piano', default: true, volume: 0 }
	pianoGrandPiano.notes = {
		'C1' : 'C1.mp3',
		'C#1' : 'Cs1.mp3',
		'D1' : 'D1.mp3',
		'D#1' : 'Ds1.mp3',
		'E1' : 'E1.mp3',
		'F1' : 'F1.mp3',
		'F#1' : 'Fs1.mp3',
		'G1' : 'G1.mp3',
		'G#1' : 'Gs1.mp3',
		'A1' : 'A1.mp3',
		'A#1' : 'As1.mp3',
		'B1' : 'B1.mp3',

		'C2' : 'C2.mp3',
		'C#2' : 'Cs2.mp3',
		'D2' : 'D2.mp3',
		'D#2' : 'Ds2.mp3',
		'E2' : 'E2.mp3',
		'F2' : 'F2.mp3',
		'F#2' : 'Fs2.mp3',
		'G2' : 'G2.mp3',
		'G#2' : 'Gs2.mp3',
		'A2' : 'A2.mp3',
		'A#2' : 'As2.mp3',
		'B2' : 'B2.mp3',

		'C3' : 'C3.mp3',
		'C#3' : 'Cs3.mp3',
		'D3' : 'D3.mp3',
		'D#3' : 'Ds3.mp3',
		'E3' : 'E3.mp3',
		'F3' : 'F3.mp3',
		'F#3' : 'Fs3.mp3',
		'G3' : 'G3.mp3',
		'G#3' : 'Gs3.mp3',
		'A3' : 'A3.mp3',
		'A#3' : 'As3.mp3',
		'B3' : 'B3.mp3',

		'C4' : 'C4.mp3',
		'C#4' : 'Cs4.mp3',
		'D4' : 'D4.mp3',
		'D#4' : 'Ds4.mp3',
		'E4' : 'E4.mp3',
		'F4' : 'F4.mp3',
		'F#4' : 'Fs4.mp3',
		'G4' : 'G4.mp3',
		'G#4' : 'Gs4.mp3',
		'A4' : 'A4.mp3',
		'A#4' : 'As4.mp3',
		'B4' : 'B4.mp3',

		'C5' : 'C5.mp3',
		'C#5' : 'Cs5.mp3',
		'D5' : 'D5.mp3',
		'D#5' : 'Ds5.mp3',
		'E5' : 'E5.mp3',
		'F5' : 'F5.mp3',
		'F#5' : 'Fs5.mp3',
		'G5' : 'G5.mp3',
		'G#5' : 'Gs5.mp3',
		'A5' : 'A5.mp3',
		'A#5' : 'As5.mp3',
		'B5' : 'B5.mp3',

		'C6' : 'C6.mp3',
		'C#6' : 'Cs6.mp3',
		'D6' : 'D6.mp3',
		'D#6' : 'Ds6.mp3',
		'E6' : 'E6.mp3',
		'F6' : 'F6.mp3',
		'F#6' : 'Fs6.mp3',
		'G6' : 'G6.mp3',
		'G#6' : 'Gs6.mp3',
		'A6' : 'A6.mp3',
		'A#6' : 'As6.mp3',
		'B6' : 'B6.mp3',

		'C7' : 'C7.mp3'
	}
	masterInsts.piano.insts.push(pianoGrandPiano)

//==============================================================================
// iF - Guitar
//==============================================================================
	masterInsts.guitar = { name: 'Guitar' }
	masterInsts.guitar.insts = []

	// Guitar / Acoustic Guitar
	var guitarAcousticGuitar = { instCode: 'guitarAcousticGuitar', name: 'Acoustic Guitar', default: true, volume: 0 }
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
	var guitarElectricGuitar = { instCode: 'guitarElectricGuitar', name: 'Electric Guitar', volume: 0 }
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

	// Bass / Fingerstyle Bass
	var bassDoubleBass = { instCode: 'bassFingerstyleBass', name: 'Fingerstyle Bass', default: true, volume: 0 }
	bassDoubleBass.notes = {
		'E1' : 'E1.mp3',
		'F1' : 'F1.mp3',
		'F#1' : 'Fs1.mp3',
		'G1' : 'G1.mp3',
		'G#1' : 'Gs1.mp3',
		'A1' : 'A1.mp3',
		'A#1' : 'As1.mp3',
		'B1' : 'B1.mp3',

		'C2' : 'C2.mp3',
		'C#2' : 'Cs2.mp3',
		'D2' : 'D2.mp3',
		'D#2' : 'Ds2.mp3',
		'E2' : 'E2.mp3',
		'F2' : 'F2.mp3',
		'F#2' : 'Fs2.mp3',
		'G2' : 'G2.mp3',
		'G#2' : 'Gs2.mp3',
		'A2' : 'A2.mp3',
		'A#2' : 'As2.mp3',
		'B2' : 'B2.mp3',

		'C3' : 'C3.mp3',
		'C#3' : 'Cs3.mp3',
		'D3' : 'D3.mp3',
		'D#3' : 'Ds3.mp3',
		'E3' : 'E3.mp3',
		'F3' : 'F3.mp3',
		'F#3' : 'Fs3.mp3',
		'G3' : 'G3.mp3',
		'G#3' : 'Gs3.mp3',
		'A3' : 'A3.mp3',
		'A#3' : 'As3.mp3',
		'B3' : 'B3.mp3',

		'C4' : 'C4.mp3',
		'C#4' : 'Cs4.mp3',
		'D4' : 'D4.mp3',
		'D#4' : 'Ds4.mp3',
		'E4' : 'E4.mp3',
		'F4' : 'F4.mp3',
		'F#4' : 'Fs4.mp3',
		'G4' : 'G4.mp3',
		'G#4' : 'Gs4.mp3',
		'A4' : 'A4.mp3',
		'A#4' : 'As4.mp3',
		'B4' : 'B4.mp3',

		'C5' : 'C5.mp3',
		'C#5' : 'Cs5.mp3',
		'D5' : 'D5.mp3',
		'D#5' : 'Ds5.mp3',
		'E5' : 'E5.mp3',
		'F5' : 'F5.mp3',
		'F#5' : 'Fs5.mp3',
		'G5' : 'G5.mp3',
		'G#5' : 'Gs5.mp3',
		'A5' : 'A5.mp3',
		'A#5' : 'As5.mp3',
		'B5' : 'B5.mp3'
	}
	masterInsts.bass.insts.push(bassDoubleBass)

	// Bass / Muted Bass
	var bassDoubleBass = { instCode: 'bassMutedBass', name: 'Muted Bass', volume: 0 }
	bassDoubleBass.notes = {
		'E1' : 'E1.mp3',
		'F1' : 'F1.mp3',
		'F#1' : 'Fs1.mp3',
		'G1' : 'G1.mp3',
		'G#1' : 'Gs1.mp3',
		'A1' : 'A1.mp3',
		'A#1' : 'As1.mp3',
		'B1' : 'B1.mp3',

		'C2' : 'C2.mp3',
		'C#2' : 'Cs2.mp3',
		'D2' : 'D2.mp3',
		'D#2' : 'Ds2.mp3',
		'E2' : 'E2.mp3',
		'F2' : 'F2.mp3',
		'F#2' : 'Fs2.mp3',
		'G2' : 'G2.mp3',
		'G#2' : 'Gs2.mp3',
		'A2' : 'A2.mp3',
		'A#2' : 'As2.mp3',
		'B2' : 'B2.mp3',

		'C3' : 'C3.mp3',
		'C#3' : 'Cs3.mp3',
		'D3' : 'D3.mp3',
		'D#3' : 'Ds3.mp3',
		'E3' : 'E3.mp3',
		'F3' : 'F3.mp3',
		'F#3' : 'Fs3.mp3',
		'G3' : 'G3.mp3',
		'G#3' : 'Gs3.mp3',
		'A3' : 'A3.mp3',
		'A#3' : 'As3.mp3',
		'B3' : 'B3.mp3',

		'C4' : 'C4.mp3',
		'C#4' : 'Cs4.mp3',
		'D4' : 'D4.mp3',
		'D#4' : 'Ds4.mp3',
		'E4' : 'E4.mp3',
		'F4' : 'F4.mp3',
		'F#4' : 'Fs4.mp3',
		'G4' : 'G4.mp3',
		'G#4' : 'Gs4.mp3',
		'A4' : 'A4.mp3',
		'A#4' : 'As4.mp3',
		'B4' : 'B4.mp3',

		'C5' : 'C5.mp3'
	}
	masterInsts.bass.insts.push(bassDoubleBass)

//==============================================================================
// iF - Strings
//==============================================================================

	masterInsts.strings = { name: 'Strings' }
	masterInsts.strings.insts = []

// Strings / Violin
	var stringsViolin = { instCode: 'stringsViolin', name: 'Violin', default: true, volume: -7 }
	stringsViolin.notes = {
		'C3' : 'C3.mp3',
		'C#3' : 'Cs3.mp3',
		'D3' : 'D3.mp3',
		'D#3' : 'Ds3.mp3',
		'E3' : 'E3.mp3',
		'F3' : 'F3.mp3',
		'F#3' : 'Fs3.mp3',
		'G3' : 'G3.mp3',
		'G#3' : 'Gs3.mp3',
		'A3' : 'A3.mp3',
		'A#3' : 'As3.mp3',
		'B3' : 'B3.mp3',

		'C4' : 'C4.mp3',
		'C#4' : 'Cs4.mp3',
		'D4' : 'D4.mp3',
		'D#4' : 'Ds4.mp3',
		'E4' : 'E4.mp3',
		'F4' : 'F4.mp3',
		'F#4' : 'Fs4.mp3',
		'G4' : 'G4.mp3',
		'G#4' : 'Gs4.mp3',
		'A4' : 'A4.mp3',
		'A#4' : 'As4.mp3',
		'B4' : 'B4.mp3',

		'C5' : 'C5.mp3',
		'C#5' : 'Cs5.mp3',
		'D5' : 'D5.mp3',
		'D#5' : 'Ds5.mp3',
		'E5' : 'E5.mp3',
		'F5' : 'F5.mp3',
		'F#5' : 'Fs5.mp3',
		'G5' : 'G5.mp3',
		'G#5' : 'Gs5.mp3',
		'A5' : 'A5.mp3',
		'A#5' : 'As5.mp3',
		'B5' : 'B5.mp3',

		'C6' : 'C6.mp3',
		'C#6' : 'Cs6.mp3',
		'D6' : 'D6.mp3',
		'D#6' : 'Ds6.mp3',
		'E6' : 'E6.mp3',
		'F6' : 'F6.mp3',
		'F#6' : 'Fs6.mp3',
		'G6' : 'G6.mp3',
		'G#6' : 'Gs6.mp3',
		'A6' : 'A6.mp3',
		'A#6' : 'As6.mp3',
		'B6' : 'B6.mp3',

		'C7' : 'C7.mp3'
	}
	masterInsts.strings.insts.push(stringsViolin);

//==============================================================================
// Reed
//==============================================================================
	masterInsts.reed = { name: 'Reed' }
	masterInsts.reed.insts = []

// Reed / Flute

	var reedFlute= { instCode: 'reedFlute',  name: 'Flute', default: true, volume: 0 }
	reedFlute.notes = {
		'C3' : 'C3.mp3',
		'C#3' : 'Cs3.mp3',
		'D3' : 'D3.mp3',
		'D#3' : 'Ds3.mp3',
		'E3' : 'E3.mp3',
		'F3' : 'F3.mp3',
		'F#3' : 'Fs3.mp3',
		'G3' : 'G3.mp3',
		'G#3' : 'Gs3.mp3',
		'A3' : 'A3.mp3',
		'A#3' : 'As3.mp3',
		'B3' : 'B3.mp3',

		'C4' : 'C4.mp3',
		'C#4' : 'Cs4.mp3',
		'D4' : 'D4.mp3',
		'D#4' : 'Ds4.mp3',
		'E4' : 'E4.mp3',
		'F4' : 'F4.mp3',
		'F#4' : 'Fs4.mp3',
		'G4' : 'G4.mp3',
		'G#4' : 'Gs4.mp3',
		'A4' : 'A4.mp3',
		'A#4' : 'As4.mp3',
		'B4' : 'B4.mp3',

		'C5' : 'C5.mp3',
		'C#5' : 'Cs5.mp3',
		'D5' : 'D5.mp3',
		'D#5' : 'Ds5.mp3',
		'E5' : 'E5.mp3',
		'F5' : 'F5.mp3',
		'F#5' : 'Fs5.mp3',
		'G5' : 'G5.mp3',
		'G#5' : 'Gs5.mp3',
		'A5' : 'A5.mp3',
		'A#5' : 'As5.mp3',
		'B5' : 'B5.mp3',

		'C6' : 'C6.mp3',
		'C#6' : 'Cs6.mp3',
		'D6' : 'D6.mp3',
		'D#6' : 'Ds6.mp3',
		'E6' : 'E6.mp3',
		'F6' : 'F6.mp3',
		'F#6' : 'Fs6.mp3',
		'G6' : 'G6.mp3',
		'G#6' : 'Gs6.mp3',
		'A6' : 'A6.mp3',
		'A#6' : 'As6.mp3',
		'B6' : 'B6.mp3',

		'C7' : 'C7.mp3'
	}
	masterInsts.reed.insts.push(reedFlute)

//==============================================================================
// Brass
//==============================================================================
	masterInsts.brass = { name: 'Brass' }
	masterInsts.brass.insts = []

// Brass / Trumpet

	var brassTrumpet= { instCode: 'brassTrumpet',  name: 'Trumpet', default: true, volume: 0 }
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

// Synth / Dream Dancer
	var synthDreamDancer = { instCode: 'synthDreamDancer', name: 'Dream Dancer', default: true, volume: 0 }
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
	var chineseInstsPipa = { instCode: 'chineseInstsPipa', name: 'Pipa (琵琶)', default: true, volume: 0 }
	chineseInstsPipa.notes = {
		'C3' : 'C2.mp3',
		'C4' : 'C3.mp3',
		'C5' : 'C4.mp3',
		'C6' : 'C5.mp3',
		'C7' : 'C6.mp3'
	}
	masterInsts.chineseInsts.insts.push(chineseInstsPipa)

	// Chinese Instruments / Erhu
	var chineseInstsErhu = { instCode: 'chineseInstsErhu',  name: 'Erhu (二胡)', volume: 0 }
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

	// Drums / SoCal
	var drumsSoCal = { instCode: 'drumsSoCal', name: 'SoCal Drum Kit', default: true, volume: 0 }
	drumsSoCal.notes = {
		'A1' : 'A1.mp3',
		'A#1' : 'As1.mp3',
		'B1' : 'B1.mp3',

		'C2' : 'C2.mp3',
		'C#2' : 'Cs2.mp3',
		'D2' : 'D2.mp3',
		'D#2' : 'Ds2.mp3',
		'E2' : 'E2.mp3',
		'F2' : 'F2.mp3',
		'F#2' : 'Fs2.mp3',
		'G2' : 'G2.mp3',
		'G#2' : 'Gs2.mp3',
		'A2' : 'A2.mp3',
		'A#2' : 'As2.mp3',
		'B2' : 'B2.mp3',

		'C3' : 'C3.mp3',
		'C#3' : 'Cs3.mp3',
		'D3' : 'D3.mp3',
		'D#3' : 'Ds3.mp3',
		'E3' : 'E3.mp3',
		'F3' : 'F3.mp3',
		'F#3' : 'Fs3.mp3',
		'G3' : 'G3.mp3',
		'G#3' : 'Gs3.mp3',
		'A3' : 'A3.mp3',
		'A#3' : 'As3.mp3',
		'B3' : 'B3.mp3'
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
