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
	var songMeta = {}

	var insts = [];
	var meters = [];
	var parts = [];

//==============================================================================
// Tone Transport Settings
//==============================================================================
	$visualizer.html('<p id="loadingMessage">Loading...</p>')

	var masterInstsLoadCheckerForPlayer = setInterval(function() {
		if(masterInstsHavePreloaded) {
			// Will immediately be replaced on browsers, on mobile, text will remain because Audio Context needs to be started by user.
			$visualizer.html('<p id="completedLoadingMessage">Start</p>')

			StartAudioContext(Tone.context, '#completedLoadingMessage').then(function() {
				loadSong('songs/hc.json');
				activatePlayerButtons();
			});

			clearInterval(masterInstsLoadCheckerForPlayer)

		}
	}, 1000)

//==============================================================================
// Song Decoding Functions
//==============================================================================
function loadSong(JSONOrFileName, fromJSONTextarea = false) {
	// Reset if new file is loaded
	songMeta = {}

	insts = [];
	meters = [];
	parts = [];

	// Will hold song JSON data
	var songJSON = {};

	if(fromJSONTextarea) {
		console.log('Loading from textarea');
		songJSON = JSON.parse(JSONOrFileName);
	} else {
		$.ajax({
			dataType: 'json',
			url: JSONOrFileName,
			async: false // Need to fix
		})
		.done(function(data) {
			songJSON = data;
		})
		.fail(function(error) {
			console.log(error)
		});
	}

	Tone.Transport.bpm.value = songJSON.bpm;
	// Tone.context.latencyHint = 'balanced'

	songMeta.duration = songJSON.duration;
	songMeta.optimizeOption = songJSON.optimizeOption;
	songMeta.oVars = {} // Stores JSON key names based on optimizeOption

	if(songMeta.optimizeOption == 'sO') {
		// If Super Optimized

		songMeta.oVars.instrumentFamily = 'iF';
		songMeta.oVars.trackNotes = 'ns';

		songMeta.oVars.noteName = 'n';
		songMeta.oVars.noteTime = 't';
		songMeta.oVars.noteDuration = 'd';
		songMeta.oVars.noteVelocity = 'v';
	} else {
		// If Normal or Optimized

		songMeta.oVars.instrumentFamily = 'instrumentFamily';
		songMeta.oVars.trackNotes = 'notes';

		songMeta.oVars.noteName = 'name';
		songMeta.oVars.noteTime = 'time';
		songMeta.oVars.noteDuration = 'duration';
		songMeta.oVars.noteVelocity = 'velocity';
	}

	songMeta.instrumentFamilies = [];
	songMeta.tracks = songJSON.tracks;

	console.log('Detected ' + songJSON.tracks.length + ' tracks')

	$.each(songMeta.tracks, function(trackId, track) {
		var instrumentFamily = track[songMeta.oVars.instrumentFamily];

		if(instrumentFamily == null) {
			// If no instrument family set, auto to Piano

			instrumentFamily = 'piano';
		} else if(instrumentFamily.includes('synth')) {
			// If instrument family contains the word synth, set to Synth

			instrumentFamily = 'synth';
		} else if(!masterInsts.hasOwnProperty(instrumentFamily)) {
			// If instrument family is unsupported, set to Piano

			instrumentFamily = 'piano'
		}

		var newInstAndMeter = createNewInstAndMeter(instrumentFamily)

		var newInst = newInstAndMeter.inst;
		var newMeter = newInstAndMeter.meter;

		insts.push(newInst);
		meters.push(newMeter);
		parts.push(assignNotesToInst(trackId, newInst, track[songMeta.oVars.trackNotes]));

		songMeta.instrumentFamilies.push(instrumentFamily)
	});

	drawVisualizer();
}

function createNewInstAndMeter(instrumentFamily) {
	var newMeter = new Tone.Meter();
	var newInst = masterInsts[instrumentFamily].preloaded;

	newInst.connect(newMeter).toMaster();

	return { inst : newInst, meter : newMeter }
}

function assignNotesToInst(trackId, inst, trackNotes) {

	$.each(trackNotes, function(noteId, note) {
		note.time = note[songMeta.oVars.noteTime];
	});

	var part = new Tone.Part(function(time, note) {
		var noteCSS = '#track' + trackId + 'note' + note[songMeta.oVars.noteName].replace('#', 's');

		inst.triggerAttackRelease(note[songMeta.oVars.noteName], note[songMeta.oVars.noteDuration], time, note[songMeta.oVars.noteVelocity]);

		Tone.Draw.schedule(function() {
			var level = Tone.dbToGain(meters[trackId].getLevel());
			var hslMeta = getHueAndTextColor(level);

			$(noteCSS).css('background-color', 'hsl(' + hslMeta.hue + ', 100%, 50%)');
			$(noteCSS).css('color', hslMeta.textColor);
			$(noteCSS).css('opacity', 1).animate({'opacity' : 0}, note[songMeta.oVars.noteDuration] * 1000);
		}, time);
	}, trackNotes);

	part.start(0);

	return part;
}

//==============================================================================
// Visualizer
//==============================================================================

	var visualizerNotes = ['A0', 'A#0', 'B0', 'C1', 'C#1', 'D1', 'D#1', 'E1', 'F1', 'F#1', 'G1', 'G#1', 'A1', 'A#1', 'B1', 'C2', 'C#2', 'D2', 'D#2', 'E2', 'F2', 'F#2', 'G2', 'G#2', 'A2', 'A#2', 'B2', 'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3', 'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4', 'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'B5', 'C6', 'C#6', 'D6', 'D#6', 'E6', 'F6', 'F#6', 'G6', 'G#6', 'A6', 'A#6', 'B6', 'C7', 'C#7', 'D7', 'D#7', 'E7', 'F7', 'F#7', 'G7', 'G#7', 'A7', 'A#7', 'B7', 'C8'];;

	function drawVisualizer() {
		$visualizer.html(''); // Clear visualizer

		$.each(insts, function(instId, inst) {
			var selectBoxHtml = '<select data-trackid="' + instId + '" class="instSelector">';

			selectBoxHtml += '<option value="none">None</option>'
			$.each(masterInsts, function(instrumentFamily, instrumentFamilyMeta) {
				selectBoxHtml += '<option value="' + instrumentFamily  + '"';

				if(songMeta.instrumentFamilies[instId] == instrumentFamily) {
					selectBoxHtml += ' selected="true"';
				}

				selectBoxHtml += '>'

				selectBoxHtml += instrumentFamilyMeta.name + '</option>';
			});
			selectBoxHtml += '</select>';

			$visualizer.append(selectBoxHtml);

			$.each(visualizerNotes, function(k, note) {
				var className = 'note'
				if(note.includes('#')) {
					className += ' noteSharp'
				}
				$visualizer.append('<div id="track' + instId + 'note' + note.replace('#', 's') + '" class="' + className + '">' + note + '</div>');
			});

		$visualizer.append('<hr>');

		});
	}

	function getHueAndTextColor(p) {
		var hslMeta = {};

		// Purple from 260 to 300

		if(p == 0) {
			hslMeta.hue = 0;
		} else {
			hslMeta.hue = 360 * p;
			// hslMeta.hue = 260 + 40 * p;
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
	var trackId = $(this).data('trackid');
	parts[trackId].removeAll();

	var newInstAndMeter = createNewInstAndMeter($(this).val());

	insts[trackId] = newInstAndMeter.inst;
	meters[trackId] = newInstAndMeter.meter;

	parts[trackId] = assignNotesToInst(trackId, insts[trackId], songMeta.tracks[trackId][songMeta.oVars.trackNotes]);
});

//==============================================================================
// Timeline Slider
//==============================================================================

	// # Srubber
	$timelineSlider.on('change', function() {
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
		$timelineText.val(Tone.Transport.seconds);
	}, 500);

//==============================================================================
// Activate Player Buttons
//==============================================================================
	function activatePlayerButtons() {

		// Rewind Button
		$rewindTimeline.on('click', function() {
			Tone.Transport.seconds = 0;
		});

		// Play Toggle Button
		$playToggle.on('click', function() {
			togglePlay()
		});

		// Spacebar
		$(document).on("keydown", function(e){
	    if(e.keyCode == 32){
				togglePlay()
	      return false;
	    }
		});
	}

//==============================================================================
// Player Functions
//==============================================================================

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
		loadSong('songs/' + newSong + '.json');
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
		loadSong($adjustedJson.val(), true);
	});
});
