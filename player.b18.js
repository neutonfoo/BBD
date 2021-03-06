$(document).ready(function() {
//==============================================================================
// Variables
//==============================================================================
	var startedPlaying = false;
	var isPlaying = false;
	var fireWorks = false;
	var delay;

	var $body = $('body');
	var $songName = $('#songName');
	var $songList = $('#songList');
	var $playToggle = $('#playToggle');
	var $clearPlayer = $('.clearPlayer');
	var $changeSongButtons = $('.changeSong');
	var $rewindTimeline = $('#rewindTimeline');
	var $mainContainer = $('#mainContainer');
	var $visualizer = $('#visualizer');
	var $timelineSlider = $('#timelineSlider');
	var $timelineText = $('#timelineText');

	var $fireworksContainer = $('#fireworksContainer');

//==============================================================================
// Instruments and Meters
//==============================================================================
	var songMeta = {}

	var insts = [];
	var meters = [];
	var parts = [];

	var instsHidden = [];

	var songQ = 0;

//==============================================================================
// Tone Transport Settings
//==============================================================================
	$visualizer.html('<p id="loadingMessage">Loading</p>')

	var masterInstsLoadCheckerForPlayer = setInterval(function() {
		if(masterInstsHavePreloaded) {
			$.each(masterInsts, function(instFamily, instFamilyMeta) {
				$.each(instFamilyMeta.insts, function(inst, instMeta) {
					delete instMeta.buffer;
					delete instMeta.notes;
					delete instMeta.volume;
				});
			});

			console.log(masterInsts)

			// Will immediately be replaced on browsers, on mobile, text will remain because Audio Context needs to be started by user.
			$visualizer.html('<p id="completedLoadingMessage">Tap to Start</p>')

			StartAudioContext(Tone.context, '#completedLoadingMessage').then(function() {
				loadSong('AT');
				activatePlayerButtons();
			});

			clearInterval(masterInstsLoadCheckerForPlayer)

		}
	}, 1000)

//==============================================================================
// Song Decoding Functions
//==============================================================================
function loadSong(JSONOrFileName, fromJSONTextarea = false) {
	pause();

	Tone.Draw.cancel(0);
	Tone.Transport.cancel(0);
	Tone.Transport.seconds = 0;

	startedPlaying = false;

	delete insts;
	delete meters;
	delete parts;
	delete instsHidden;

	// Reset if new file is loaded
	songMeta = {}

	insts = [];
	meters = [];
	parts = [];

	instsHidden = []

	// Will hold song JSON data
	var songJSON = {};

	if(fromJSONTextarea) {
		console.log('Loading from textarea');
		songJSON = JSON.parse(JSONOrFileName);
		songMeta.name = songJSON.name;
		songMeta.artist = '';

	} else {
		$.ajax({
			dataType: 'json',
			url: 'songs/' + JSONOrFileName + '.json',
			async: false // Need to fix
		})
		.done(function(data) {
			songJSON = data;

			var songMetaFromSongList = songList.filter(song => song.jsonFilename == JSONOrFileName)[0];
			songMeta.artist = songMetaFromSongList.artist;
			songMeta.name = songMetaFromSongList.name;
		})
		.fail(function(error) {
			console.log(error)
		});
	}

	if(songQ == 0) {
		$songName.html('Test Song');
	} else if(songQ == 1) {
		$songName.html('Your Favorite Meme Song');
	}

	Tone.Transport.bpm.value = songJSON.bpm;
	delay = Tone.context.lookAhead;

	songMeta.duration = songJSON.duration;
	songMeta.optimizeOption = songJSON.optimizeOption;
	songMeta.oVars = {} // Stores JSON key names based on optimizeOption

	if(songMeta.optimizeOption == 'o') {
		// If Optimized

		songMeta.oVars.instrumentFamily = 'iF';
		songMeta.oVars.trackNotes = 'ns';

		songMeta.oVars.noteName = 'n';
		songMeta.oVars.noteTime = 't';
		songMeta.oVars.noteDuration = 'd';
		songMeta.oVars.noteVelocity = 'v';
	} else {
		// If Normal or other

		songMeta.oVars.instrumentFamily = 'instrumentFamily';
		songMeta.oVars.trackNotes = 'notes';

		songMeta.oVars.noteName = 'name';
		songMeta.oVars.noteTime = 'time';
		songMeta.oVars.noteDuration = 'duration';
		songMeta.oVars.noteVelocity = 'velocity';
	}

	songMeta.instCodes = [];
	songMeta.tracks = songJSON.tracks;

	console.log('Detected ' + songJSON.tracks.length + ' tracks')

	$.each(songMeta.tracks, function(trackId, track) {
		var instrumentFamily = track[songMeta.oVars.instrumentFamily];
		console.log('Track ' + trackId + ': ' + instrumentFamily)

		if(instrumentFamily == null) {
			// If no instrument family set, auto to Piano
			instrumentFamily = 'piano';
		} else if(instrumentFamily.includes('ensemble')) {
			instrumentFamily = 'strings';
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
		var newInstCode = newInstAndMeter.instCode;

		instsHidden.push(true)
		insts.push(newInst);
		meters.push(newMeter);
		parts.push(assignNotesToInst(trackId, newInst, track[songMeta.oVars.trackNotes]));

		songMeta.instCodes.push(newInstCode)
	});

	drawVisualizer();
}

function createNewInstAndMeter(instrumentFamily, instCode = false) {
	var inst;

	if(instCode) {
		inst = masterInsts[instrumentFamily].insts.filter(inst => inst.instCode == instCode)[0];
	} else {
		inst = masterInsts[instrumentFamily].insts.filter(inst => inst.default == true)[0];
	}

	// var newInst = $.extend(true, { }, inst.preloaded);
	var newInst = $.extend({}, inst.preloaded);
	// var newInst = inst.preloaded;
	var newInstCode = inst.instCode;

	var newMeter = new Tone.Meter();

	newInst.connect(newMeter);
	newInst.toMaster();

	return { instCode: newInstCode, inst: newInst, meter: newMeter }
}

function assignNotesToInst(trackId, inst, trackNotes) {

	$.each(trackNotes, function(noteId, note) {
		note.time = note[songMeta.oVars.noteTime];
	});

	var part = new Tone.Part(function(time, note) {
		var noteCSS = '#track' + trackId + 'note' + note[songMeta.oVars.noteName].replace('#', 's');

		inst.triggerAttackRelease(note[songMeta.oVars.noteName], note[songMeta.oVars.noteDuration], time, note[songMeta.oVars.noteVelocity]);

		Tone.Draw.schedule(function() {
			if(instsHidden[trackId] == true) {
				instsHidden[trackId] = false;
				var $trackVisualizer = $('#track' + trackId + 'v');
				$trackVisualizer.css('display', 'block')
			}

			if(songQ == 0) {
				if(Tone.Transport.seconds < 9.10) {
					$songName.html('Test Song');
				} else if(Tone.Transport.seconds > 9.10 && Tone.Transport.seconds < 40.2) {
					$songName.html('Happy Birthday');
				} else if(Tone.Transport.seconds >= 54) {
					$songName.html('Mew&nbsp;<span id="songBy">&nbsp;:&nbsp;</span>&nbsp;Comforting Sounds');
				}

				if(!fireWorks && trackId == 5) {
					fireWorks = true;
					$songName.css('color', 'rgb(255, 255, 255)')
					$('hr').replaceWith('<br class="instrumentBreaks">');
					$body.css('backgroundColor', 'rgb(0, 0, 0)');
					$fireworksContainer.fireworks();

					$visualizer.prepend('<center><h1 style="color:#FF00FF">🍰 Happy Birthday Brenda! 🍰</h1></center>')
				}
			}

			var level = Tone.dbToGain(meters[trackId].getLevel());
			var hslMeta = getHueAndTextColor(level);
			$(noteCSS).css('background-color', 'hsl(' + hslMeta.hue + ', 100%, 50%)');
			$(noteCSS).css('opacity', 1).animate({'opacity' : 0}, note[songMeta.oVars.noteDuration] * 1000);

		}, delay + time);

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

		$.each(insts, function(trackId, track) {

			var trackVisualizer;

			if(trackId == 0) {
				trackVisualizer = '<div id="track' + trackId + 'v"></div>'
			} else {
				trackVisualizer = '<div id="track' + trackId + 'v" style="display:none;"></div>'
			}

			$visualizer.append(trackVisualizer);
			var $trackVisualizer = $('#track' + trackId + 'v')

			var selectBoxHTML = '<select data-trackid="' + trackId + '" class="instSelector">';

			selectBoxHTML += '<option data-instfamily="none">None</option>'

			$.each(masterInsts, function(instFamily, instFamilyMeta) {

				selectBoxHTML += '<optgroup label="' + instFamilyMeta.name + '">';

				$.each(instFamilyMeta.insts, function(instId, instMeta) {
					selectBoxHTML += '<option data-instfamily="' + instFamily  + '" data-instcode="' + instMeta.instCode  + '"';

					if(songMeta.instCodes[trackId] == instMeta.instCode) {
						selectBoxHTML += ' selected="true"';
					}

					selectBoxHTML += '>'

					selectBoxHTML += instMeta.name + '</option>';
				});

				selectBoxHTML += '</optgroup>';

			});

			selectBoxHTML += '</select><br>';

			$trackVisualizer.append(selectBoxHTML);

			$.each(visualizerNotes, function(k, note) {
				var className = 'note'
				if(note.includes('#')) {
					className += ' noteSharp'
				}
				$trackVisualizer.append('<div id="track' + trackId + 'note' + note.replace('#', 's') + '" class="' + className + '">' + note + '</div>');
			});

		$trackVisualizer.append('<hr>');

		});
	}

	function getHueAndTextColor(p) {
		var hslMeta = {};

		// Purple from 260 to 300

		hslMeta.hue = 360 * p;
		hslMeta.textColor = '#FFF'

	  return hslMeta;
	}

//==============================================================================
// Instrument Switcher
//==============================================================================
$visualizer.on('change', '.instSelector' , function() {
	var trackId = $(this).data('trackid');

	if(parts[trackId]) {
		parts[trackId].removeAll();
	}

	var selectedInst = $(this).find(':selected');
	var newInstFamily = selectedInst.data('instfamily');

	if(newInstFamily == 'none') {
		songMeta.instCodes[trackId] = 'none';
	} else {
		var newInstCode = selectedInst.data('instcode');

		var newInstAndMeter = createNewInstAndMeter(newInstFamily, newInstCode);

		insts[trackId] = newInstAndMeter.inst;
		meters[trackId] = newInstAndMeter.meter;
		songMeta.instCodes[trackId] = newInstAndMeter.instCode;

		parts[trackId] = assignNotesToInst(trackId, insts[trackId], songMeta.tracks[trackId][songMeta.oVars.trackNotes]);
	}
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
			if(songQ == 0) {
				songQ++;
				loadSong('ShootingStars');

				$visualizer.prepend('<center><h1 style="color:#FF00FF">🍰 Happy Birthday Brenda! 🍰</h1></center>')
				resume();
			} else if(songQ == 1) {
				percent = 100;
				$('br.instrumentBreaks').replaceWith('<hr>');

				Tone.Transport.seconds = 0;
				pause();
			}
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
// Visualizer Size Change
//==============================================================================
$('.visualizerSizeChange').on('click', function() {
	var sizeChange = $(this).data('sizechange');
	if(sizeChange == 'minus') {
		$('.note').css('font-size', '-=1')
	} else if(sizeChange == 'plus') {
		$('.note').css('font-size', '+=1')
	}
});

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
			Tone.Transport.start('+1', 0);
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
		var newSong = $(this).data('jsonfilename');
		loadSong(newSong);
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
