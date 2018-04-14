$(document).ready(function() {
//==============================================================================
// Variables
//==============================================================================
	var startedPlaying = false;
	var isPlaying = false;

	var $body = $('body');
	var $songList = $('#songList');
	var $playToggle = $('#playToggle');
	var $clearPlayer = $('.clearPlayer');
	var $changeSongButtons = $('.changeSong');
	var $rewindTimeline = $('#rewindTimeline');
	var $mainContainer = $('#mainContainer');
	var $visualizer = $('#visualizer');
	var $timelineSlider = $('#timelineSlider');
	var $timelineText = $('#timelineText');

//==============================================================================
// Instruments and Meters
//==============================================================================
	var insts = [];
	var meters = [];
	var parts = [];
	var songMeta = {}

//==============================================================================
// Tone Transport Settings
//==============================================================================
	$visualizer.html('<p id="loading">Loading...</p>')

	var sampleInstsLoadChecker2 = setInterval(function() {
		if(!sampleInstsLoaded) {
			return false;
		} else {

			// Will immediately be replaced on browsers, on mobile, text will remain
			// because Audio Context needs to be started by user.

			$visualizer.html('<p id="loading">Select a song</p>')

			StartAudioContext(Tone.context, '.changeSong').then(function() {
				loadJson('songs/csSuOp.json');
			});

			clearInterval(sampleInstsLoadChecker2)

		}
	}, 2000)

//==============================================================================
// Song Decoding Functions
//==============================================================================
function loadJson(fileName, fromFile = false) {
	// Reset if new file is loaded
	insts = [];
	meters = [];
	parts = [];
	songMeta = {}

	// Will hold JSON data
	var songJson = {};

	if(fromFile) {
		console.log('Loading from Textarea')
		songJson = JSON.parse(fileName);
	} else {
		$.ajax({
			dataType: 'json',
			url: fileName,
			async: false // Need to fix
		})
		.done(function(data) {
			songJson = data;
		})
		.fail(function(error) {
			console.log(error)
		});
	}

	Tone.Transport.bpm.value = songJson.bpm;

	// Tone.context.latencyHint = 'balanced'

	songMeta.duration = songJson.duration;
	songMeta.optimizeOption = songJson.optimizeOption;
	songMeta.oVars = {}

	if(songMeta.optimizeOption == 'sO') {
		songMeta.oVars.instrumentFamily = 'iF';
		songMeta.oVars.trackNotes = 'ns';

		songMeta.oVars.noteName = 'n';
		songMeta.oVars.noteTime = 't';
		songMeta.oVars.noteDuration = 'd';
		songMeta.oVars.noteVelocity = 'v';
	} else {
		songMeta.oVars.instrumentFamily = 'instrumentFamily';
		songMeta.oVars.trackNotes = 'notes';

		songMeta.oVars.noteName = 'name';
		songMeta.oVars.noteTime = 'time';
		songMeta.oVars.noteDuration = 'duration';
		songMeta.oVars.noteVelocity = 'velocity';
	}

	songMeta.instrumentFamilies = [];
	songMeta.tracks = songJson.tracks;

	console.log('Detected ' + songJson.tracks.length + ' tracks')

	$.each(songMeta.tracks, function(i, track) {
		var trackInstrumentFamily = track[songMeta.oVars.instrumentFamily];

		if(trackInstrumentFamily == null) {
			trackInstrumentFamily = 'piano';
		} else if(trackInstrumentFamily.includes('synth')) {
			trackInstrumentFamily = 'synth';
		} else if(!samplesInsts.hasOwnProperty(trackInstrumentFamily)) {
			trackInstrumentFamily = 'piano'
		}

		var instMeta = getInstrumentMetaFromInstrumentFamily(trackInstrumentFamily)

		var newMeter = instMeta.meter;
		var newInstr = instMeta.inst;

		parts.push(assignNotesToInst(i, newInstr, track[songMeta.oVars.trackNotes]));

		meters.push(newMeter);
		insts.push(newInstr);

		songMeta.instrumentFamilies.push(trackInstrumentFamily)
	});
	drawVisualizer();
}

function getInstrumentMetaFromInstrumentFamily(instFamily) {
	var newMeter = new Tone.Meter();
	var newInstr = samplesInsts[instFamily].preloaded;

	newInstr.connect(newMeter).toMaster();

	return { inst : newInstr, meter : newMeter }
}

function assignNotesToInst(trackId, inst, notes, isChangingInstrument = false) {

	$.each(notes, function(n, note) {
		note.time = note[songMeta.oVars.noteTime];
	});


	var tonePart = new Tone.Part(function(time, note) {
		var noteCSS = '#track' + trackId + 'note' + note[songMeta.oVars.noteName].replace('#', 's');

		inst.triggerAttackRelease(note[songMeta.oVars.noteName], note[songMeta.oVars.noteDuration], time, note[songMeta.oVars.noteVelocity]);

		Tone.Draw.schedule(function() {
			var level = Tone.dbToGain(meters[trackId].getLevel());
			var hslMeta = getHueAndTextColor(level);
			$(noteCSS).css('background-color', 'hsl(' + hslMeta.hue + ', 100%, 50%)');
			$(noteCSS).css('color', hslMeta.textColor);
			$(noteCSS).css('opacity', 1).animate({'opacity' : 0}, note[songMeta.oVars.noteDuration] * 1000);
		}, time);
	}, notes);

	tonePart.start(0);

	return tonePart;
}

//==============================================================================
// Visualizer
//==============================================================================

	var notes = ['A0', 'A#0', 'B0', 'C1', 'C#1', 'D1', 'D#1', 'E1', 'F1', 'F#1', 'G1', 'G#1', 'A1', 'A#1', 'B1', 'C2', 'C#2', 'D2', 'D#2', 'E2', 'F2', 'F#2', 'G2', 'G#2', 'A2', 'A#2', 'B2', 'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3', 'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4', 'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'B5', 'C6', 'C#6', 'D6', 'D#6', 'E6', 'F6', 'F#6', 'G6', 'G#6', 'A6', 'A#6', 'B6', 'C7', 'C#7', 'D7', 'D#7', 'E7', 'F7', 'F#7', 'G7', 'G#7', 'A7', 'A#7', 'B7', 'C8'];;

	function drawVisualizer() {
		$visualizer.html(''); // Clear visualizer

		$.each(insts, function(i, inst) {
			var selectBoxHtml = '<select id="track' + i + '" class="instSelector">';

			selectBoxHtml += '<option value="none">None</option>'

			$.each(samplesInsts, function(instFamily, instFamilyMeta) {
				selectBoxHtml += '<option value="' + instFamily  + '"';

				if(songMeta.instrumentFamilies[i] == instFamily) {
					selectBoxHtml += ' selected="true"';
				}

				selectBoxHtml += '>'

				selectBoxHtml += instFamilyMeta.name + '</option>';
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

	function getHueAndTextColor(p) {
		var hslMeta = {};

		if(p == 0) {
			hslMeta.hue = 0;
		} else {
			hslMeta.hue = 360 * p;
		}

		if(hslMeta.hue >= 0 && hslMeta.hue <= 27.5) {
			hslMeta.textColor = '#FFF'
		} else if(hslMeta.hue >= 225 && hslMeta.hue <= 360) {
			hslMeta.textColor = '#FFF'
		} else {
			hslMeta.textColor = '#000'
		}

	  return hslMeta;
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

	parts[trackId] = assignNotesToInst(trackId, newInst.inst, songMeta.tracks[trackId][songMeta.oVars.trackNotes], true);
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

	var ramped = false;

	// # Updater
	setInterval(function() {
		var percent = 100 * Tone.Transport.seconds / songMeta.duration;

		if(percent >= 100) {
			Tone.Transport.seconds = 0;
			// percent = 100;
			// startedPlaying = false;
			// pause();
		}

		if(Tone.Transport.seconds >= 540 && !ramped) {
			ramped = true;
			Tone.Transport.bpm.rampTo(130, 5);
		}

		$timelineSlider.val(percent);
		$timelineText.val(Tone.Transport.seconds);
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
		$playToggle.html('<img src="open-iconic/media-pause.svg">');

		if(!startedPlaying) {
			startedPlaying = true;
			Tone.Transport.start('+0.1', 0);
		} else {
			Tone.Transport.start();
		}
	}

	function pause() {
		isPlaying = false;
		$playToggle.html('<img src="open-iconic/media-play.svg">');
		Tone.Transport.pause();
	}

//==============================================================================
// Change Song
//==============================================================================
	$songList.on('click', '.changeSong' , function() {
		pause();
		Tone.Transport.cancel(0);
		Tone.Transport.seconds = 0;

		var newSong = $(this).data('jsonfilename');
		loadJson('songs/' + newSong + '.json');
	});

//==============================================================================
// Play from Textarea
//==============================================================================
	var $adjustedJson = $('#adjustedJson');
	var $loadAdjustedJson = $('#loadAdjustedJson')

	$loadAdjustedJson.on('click', function() {
		pause();
		Tone.Transport.cancel(0);
		Tone.Transport.seconds = 0;

		var newSong = $(this).val();
		loadJson($adjustedJson.val(), true);
	});
});
