$(document).ready(function() {
//==============================================================================
// Global Variables
//==============================================================================
	var instsFolder = './insts/';

	var playToggleSelector = '#playToggle'; // Seperated for StartAudioContext()
	var startedPlaying = false;
	var isPlaying = false;

	var $clearPlayer = $('.clearPlayer');
	var $changeSongButtons = $('.changeSong');
	var $rewindTimeline = $('#rewindTimeline');
	var $mainContainer = $('#mainContainer');
	var $visualizer = $('#visualizer');
	var $timelineSlider = $('#timelineSlider');
	var $playToggle = $(playToggleSelector);

//==============================================================================
// Instruments and Meters
//==============================================================================
	var insts = [];
	var meters = [];
	var parts = [];
	var songMeta = {}

	var instFamilies = ['piano', 'guitar', 'strings', 'bass', 'drums'];

//==============================================================================
// Tone Transport Settings
//==============================================================================
	StartAudioContext(Tone.context, playToggleSelector).then(function() {
		loadBuffers()
		loadJson('songs/csHB.json');
	});

//==============================================================================
// Song Decoding Functions
//==============================================================================

var stringSamples;

	function loadBuffers() {
		stringSamples = new Tone.Buffers({
			'C5' : 'C5.mp3',
			'F5' : 'F5.mp3',
			'A5' : 'A5.mp3'
		}, {
			'baseUrl': instsFolder + 'violin/',
			'onload': function() {
				console.log('Loaded')
			}
		});

	}

//==============================================================================
// Song Decoding Functions
//==============================================================================
function loadJson(fileName) {

	// Reset if new file is loaded
	insts = [];
	meters = [];
	parts = [];
	songMeta = {}

	// Will hold JSON data
	var songJson = {};

	$.ajax({
		dataType: 'json',
		url: fileName,
		async: false
	})
	.done(function(data) {
		songJson = data;
	})
	.fail(function(error) {
		console.log(error)
	});

	Tone.Transport.bpm.value = songJson.bpm;
	songMeta.duration = songJson.duration;
	songMeta.instrumentFamilies = [];
	songMeta.tracks = songJson.tracks;

	console.log('Detected ' + songJson.tracks.length + ' tracks')

	$.each(songMeta.tracks, function(i, track) {
		var instMeta = getInstrumentMetaFromInstrumentFamily(track.instrumentFamily)

		var newMeter = instMeta.meter;
		var newInstr = instMeta.inst;

		parts.push(assignNotesToInst(i, newInstr, track.notes));

		meters.push(newMeter);
		insts.push(newInstr);

		songMeta.instrumentFamilies.push(track.instrumentFamily)
	});
	drawVisualizer();
}

function getInstrumentMetaFromInstrumentFamily(instrumentFamily) {
	var newMeter = new Tone.Meter();
	var newInstr;

	if(instrumentFamily == 'reed') {
		newInstr = new Tone.Sampler({
			'C4' : 'C4.mp3'
		}, {
			'release' : 2,
			'baseUrl' : './flute/',
			'volume' : -5
		}).connect(newMeter).toMaster();
	} else if(instrumentFamily == 'brass') {
		newInstr = new Tone.Sampler({
			'F4' : 'F4.mp3',
			'F5' : 'F5.mp3'
		}, {
			'release' : 2,
			'baseUrl' : instsFolder + 'brass/',
			'volume' : -10
		}).connect(newMeter).toMaster();
	} else if(instrumentFamily == 'bass') {
		newInstr = new Tone.Sampler({
			'A1' : 'A1.mp3',
			'C2' : 'C2.mp3',
			'A2' : 'A2.mp3',
			'A3' : 'A3.mp3',
			'C4' : 'C4.mp3',
			'A4' : 'A4.mp3',
			'C5' : 'C5.mp3',
			'F5' : 'F5.mp3',
			'A5' : 'A5.mp3'
		}, {
			'release' : 2,
			'baseUrl' : instsFolder + 'doublebass/',
			'volume' : -10
		}).connect(newMeter).toMaster();
	} else if(instrumentFamily == 'drums') {
		newInstr = new Tone.Sampler({
			'G#2' : 'Gs2.mp3',
			'B1' : 'B1.mp3',
			'G2' : 'G2.mp3',
			'D2' : 'D2.mp3',
			'C#3' : 'Cs3.mp3',
			'D#3' : 'Ds3.mp3',
			'F2' : 'F2.mp3'
		}, {
			'release' : 1,
			'baseUrl' : './drums/fixed/',
			'volume' : -15
		}).connect(newMeter).toMaster();
	} else if(instrumentFamily == 'strings') {
		console.log('created strings')
		// newInstr = new Tone.Sampler({
		// 	'C5' : 'C5.mp3',
		// 	'F5' : 'F5.mp3',
		// 	'A5' : 'A5.mp3'
		// }, {
		// 	'release' : 1,
		// 	'baseUrl' : instsFolder + 'violin/',
		// 	'volume' : -7
		// }).connect(newMeter).toMaster();

		newInstr = new Tone.Sampler();

		newInstr.add('C5', stringSamples.get('C5'));
		newInstr.add('F5', stringSamples.get('F5'));
		newInstr.add('A5', stringSamples.get('A5'));

		newInstr.release = 1;
		newInstr.volume = -7;

		newInstr.connect(newMeter).toMaster();

	} else if(instrumentFamily == 'guitar') {
		newInstr = new Tone.Sampler({
			'C4' : 'C4.mp3',
			'D4' : 'D4.mp3'
		}, {
			'release' : 1,
			'baseUrl' : './guitar/',
			'volume' : -8
		}).connect(newMeter).toMaster();
	} else if(instrumentFamily == 'piano') {
		newInstr = new Tone.Sampler({
			'A0' : 'A0.[mp3|ogg]',
			'C1' : 'C1.[mp3|ogg]',
			'D#1' : 'Ds1.[mp3|ogg]',
			'F#1' : 'Fs1.[mp3|ogg]',
			'A1' : 'A1.[mp3|ogg]',
			'C2' : 'C2.[mp3|ogg]',
			'D#2' : 'Ds2.[mp3|ogg]',
			'F#2' : 'Fs2.[mp3|ogg]',
			'A2' : 'A2.[mp3|ogg]',
			'C3' : 'C3.[mp3|ogg]',
			'D#3' : 'Ds3.[mp3|ogg]',
			'F#3' : 'Fs3.[mp3|ogg]',
			'A3' : 'A3.[mp3|ogg]',
			'C4' : 'C4.[mp3|ogg]',
			'D#4' : 'Ds4.[mp3|ogg]',
			'F#4' : 'Fs4.[mp3|ogg]',
			'A4' : 'A4.[mp3|ogg]',
			'C5' : 'C5.[mp3|ogg]',
			'D#5' : 'Ds5.[mp3|ogg]',
			'F#5' : 'Fs5.[mp3|ogg]',
			'A5' : 'A5.[mp3|ogg]',
			'C6' : 'C6.[mp3|ogg]',
			'D#6' : 'Ds6.[mp3|ogg]',
			'F#6' : 'Fs6.[mp3|ogg]',
			'A6' : 'A6.[mp3|ogg]',
			'C7' : 'C7.[mp3|ogg]',
			'D#7' : 'Ds7.[mp3|ogg]',
			'F#7' : 'Fs7.[mp3|ogg]',
			'A7' : 'A7.[mp3|ogg]',
			'C8' : 'C8.[mp3|ogg]'
		}, {
			'release' : 1,
			'baseUrl' : './piano/'
		}).connect(newMeter).toMaster();
	} else {
		newInstr = new Tone.PolySynth(4).connect(newMeter).toMaster();
	}

	return { inst : newInstr, meter : newMeter }
}

function assignNotesToInst(trackId, inst, notes) {
	var tonePart = new Tone.Part(function(time, note) {
		var noteCSS = '#track' + trackId + 'note' + note.name.replace('#', 's');

		inst.triggerAttackRelease(note.name, note.duration, time, note.velocity);
		Tone.Draw.schedule(function() {
			var level = Tone.dbToGain(meters[trackId].getLevel());
			var hue = getHue(level);
			$(noteCSS).css('background-color', 'hsl(' + hue + ', 100%, 50%)');
			$(noteCSS).css('color', '#000');
			$(noteCSS).css('opacity', 1).animate({'opacity' : 0}, note.duration * 1000);
		}, time);
	}, notes);

	tonePart.start(0);

	return tonePart;
}

//==============================================================================
// Visualizer
//==============================================================================

	var notes = ['A0', 'A#0', 'B0', 'C1', 'C#1', 'D1', 'D#1', 'E1', 'F1', 'F#1', 'G1', 'G#1', 'A1', 'A#1', 'B1', 'C2', 'C#2', 'D2', 'D#2', 'E2', 'F2', 'F#2', 'G2', 'G#2', 'A2', 'A#2', 'B2', 'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3', 'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4', 'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'B5', 'C6', 'C#6', 'D6', 'D#6', 'E6', 'F6', 'F#6', 'G6', 'G#6', 'A6', 'A#6', 'B6', 'C7', 'C#7', 'D7', 'D#7', 'E7', 'F7', 'F#7', 'G7', 'G#7', 'A7', 'A#7', 'B7', 'C8'];;
	// var notes = ['B1', 'C2', 'C#2', 'D2', 'D#2', 'E2', 'F2', 'F#2', 'G2', 'G#2', 'A2', 'A#2', 'B2', 'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3', 'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4', 'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'B5', 'C6', 'C#6', 'D6', 'D#6', 'E6', 'F6', 'F#6'];;

	function drawVisualizer() {
		$visualizer.html(''); // Clear visualizer

		$.each(insts, function(i, inst) {
			var selectBoxHtml = '<select id="track' + i + '" class="instSelector">';

			$.each(instFamilies, function(j, instFamily) {
				selectBoxHtml += '<option value="' + instFamily + '"';

				if(songMeta.instrumentFamilies[i] == instFamily) {
					selectBoxHtml += ' selected="true"';
				}

				selectBoxHtml += '>'

				selectBoxHtml += instFamily + '</option>';
			});
			selectBoxHtml += '</select>';

			$visualizer.append(selectBoxHtml);

			$.each(notes, function(k, note) {

				var className = 'note'

				if(note.includes('#')) {
					className += ' noteSharp'
				}
				$visualizer.append('<div id="track' + i + 'note' + note.replace('#', 's') + '" class="' + className + '">' + note + '</div>');
			});
		$visualizer.append('<hr>');
		});
	}

	function getHue(p) {
		if(p == 0) {
			return 0;
		}
	  return 360 * p;
	}


//==============================================================================
// Instrument Switcher
//==============================================================================
$visualizer.on('change', '.instSelector' , function() {

	var trackId = $(this).attr('id').replace('track', '');

	parts[trackId].removeAll();

	var newInst = getInstrumentMetaFromInstrumentFamily($(this).val());

	meters[trackId] = newInst.meter;
	insts[trackId] = newInst.inst;

	parts[trackId] = assignNotesToInst(trackId, newInst.inst, songMeta.tracks[trackId].notes);
});

//==============================================================================
// Timeline Slider
//==============================================================================

	// # Srubber
	$timelineSlider.on('input change', function() {
		startedPlaying = true; // Or it'll reset to 0
		var newProgress = songMeta.duration * $(this).val() / 100;
		Tone.Transport.seconds = newProgress;
	});

	// # Updater
	setInterval(function() {
		var percent = 100 * Tone.Transport.seconds / songMeta.duration;

		if(percent >= 100) {
			Tone.Transport.seconds = 0;
			// percent = 100;
			// startedPlaying = false;
			// pause();
		}

		$timelineSlider.val(percent);
	}, 500);

//==============================================================================
// Rewind Button
//==============================================================================
	$rewindTimeline.on('click', function() {
		Tone.Transport.seconds = 0;
	});

//==============================================================================
// Toggle Button
//==============================================================================
	$playToggle.on('click', function() {
		togglePlay()
	});

	$(document).on("keydown", function(e){
    if(e.keyCode == 32){
			togglePlay()
      return false;
    }
	});

	function togglePlay() {
		if(!isPlaying) {
			resume();
		} else {
			pause();
		}
	}

	function resume() {
		isPlaying = true;
		$playToggle.html('<img src="open-iconic/media-pause.svg" class="octicon">');

		if(!startedPlaying) {
			startedPlaying = true;
			Tone.Transport.start('+0.1', 0);

		} else {
			Tone.Transport.start();
		}
	}

	function pause() {
		isPlaying = false;
		$playToggle.html('<img src="open-iconic/media-play.svg" class="octicon">');
		Tone.Transport.pause();
	}

//==============================================================================
// Change Song
//==============================================================================
	$changeSongButtons.on('click', function() {
		pause();

		Tone.Transport.cancel(0);
		Tone.Transport.seconds = 0;

		var newSong = $(this).val();
		loadJson('songs/' + newSong + '.json');
	});


});
