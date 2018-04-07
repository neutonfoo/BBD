$(document).ready(function() {
//==============================================================================
// Variables
//==============================================================================
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

//==============================================================================
// Tone Transport Settings
//==============================================================================
	StartAudioContext(Tone.context, playToggleSelector).then(function() {
		loadJson('songs/csOp.json');
	});

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
		async: false // Need to fix
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

function getInstrumentMetaFromInstrumentFamily(instFamily) {
	var newMeter = new Tone.Meter();
	var newInstr;

	if(samplesInsts.hasOwnProperty(instFamily)) {
		var samplesInst = samplesInsts[instFamily];

		newInstr = new Tone.Sampler({}, {
			'release' : 1,
			'volume' : samplesInst.volume
		});

		$.each(samplesInst.notes, function(sampleNote) {
			newInstr.add(sampleNote, samplesInst.buffer.get(sampleNote));
		});

		newInstr.connect(newMeter).toMaster();

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

			$.each(samplesInsts, function(instFamily) {
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

	pause();

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
