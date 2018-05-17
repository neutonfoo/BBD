// http://tonejs.github.io/MidiConvert/

$(document).ready(function() {
//==============================================================================
// Global Variables
//==============================================================================
	var startedPlaying = false;
	var isPlaying = false;

	$mainContainer = $('#mainContainer')

//==============================================================================
// Meter
//==============================================================================
	var leadingInstMeter = new Tone.Meter();
	var backingInstMeter = new Tone.Meter();
	var vocalInstMeter = new Tone.Meter();
	var percussionInstMeter = new Tone.Meter();

//==============================================================================
// Instruments - Leading
//==============================================================================
	var leadingInst = new Tone.Sampler({
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
	}).connect(leadingInstMeter).toMaster();

//==============================================================================
// Instruments - Backing
//==============================================================================
	var backingInst = new Tone.Sampler({
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
	}).connect(backingInstMeter).toMaster();

//==============================================================================
// Instruments - Vocal
//==============================================================================
	var vocalInst = new Tone.Synth().connect(vocalInstMeter).toMaster();

//==============================================================================
// Instruments - Percussion
//==============================================================================
	var percussionInst = new Tone.Synth().connect(percussionInstMeter).toMaster();
	// NoiseSynth
	// Has no note, need to fix

//==============================================================================
// Load Tracks into Instruments
//==============================================================================
	loadJsonIntoInst(leadingInst, 'songs/bitsLead.json', '8n', 0.3);
	loadJsonIntoInst(backingInst, 'songs/bitsBack.json', '8n', 0.2);
	loadJsonIntoInst(vocalInst, 'songs/bitsVocal.json', '8n', 0.5);
	loadJsonIntoInst(percussionInst, 'songs/bitsPercussion.json', '8n', 0.5);

	// loadJsonIntoInst(vocalInst, 'songs/thescientistvocal.json', '8n', 0.5);
	// loadJsonIntoInst(backingInst, 'songs/marioBack.json', '8n');
	// loadJsonIntoInst(leadingInst, 'songs/comfortingSounds1.json', '8n');
	// loadJsonIntoInst(backingInst, 'songs/comfortingSounds2.json', '8n');
	// loadJsonIntoInst(leadingInst, 'songs/happyBirthday.json', '8n');

//==============================================================================
// Tone Transport Settings
//==============================================================================
	Tone.Transport.bpm.value = 120;

//==============================================================================
// Song Decoding Functions
//==============================================================================
function loadJsonIntoInst(inst, fileName, delay, velocity) {
	var musicArray = []
	var tracksJson = {}

	$.ajax({
		dataType: 'json',
		url: fileName,
		async: false
	})
	.done(function(data) {
		tracksJson = data
	})
	.fail(function(error) {
		console.log(error)
	});

	$.each(tracksJson.notes, function(i, note) {
		var noteTime = delay;

		// If reading off time
		noteTime = note.time;

		// if(i != 0) {
		// 	noteTime = musicArray[i - 1].time + '+' + musicArray[i - 1].duration;
		// }

		musicArray.push({
			'note': note.name,
			'duration': note.duration,
			'time': noteTime,
			'velocity': note.velocity
		});
	});

	tonePart = new Tone.Part(function(time, note) {
		inst.triggerAttackRelease(note.note, note.duration, time, note.velocity);
	}, musicArray);

	tonePart.start(0)
}

//==============================================================================
// Visualization
//==============================================================================
	setInterval(function() {
		var leadingInstMeterLevel = Tone.dbToGain(leadingInstMeter.getLevel());
		var backingInstMeterLevel = Tone.dbToGain(backingInstMeter.getLevel());
		var vocalInstMeterLevel = Tone.dbToGain(vocalInstMeter.getLevel());
		var percussionInstMeterLevel = Tone.dbToGain(percussionInstMeter.getLevel());

		var a = ''
		for(var i = 0; i < Math.floor(leadingInstMeterLevel * 100); i++) {
			a += '-'
		}

		var b = '<br>'
		for(var i = 0; i < Math.floor(backingInstMeterLevel * 100); i++) {
			b += '-'
		}

		var c = '<br>'
		for(var i = 0; i < Math.floor(vocalInstMeterLevel * 100); i++) {
			c += '-'
		}

		var d = '<br>'
		for(var i = 0; i < Math.floor(percussionInstMeterLevel * 100); i++) {
			d += '-'
		}

		$mainContainer.html(a + b + c + d);
	}, 1)

//==============================================================================
// Toggle Button
//==============================================================================
	$('#playToggle').on('click', function() {
		if(!isPlaying) {
			isPlaying = true;
			$(this).html('<img src="octicons/primitive-square.svg" class="octicon">');
			resume();
		} else {
			isPlaying = false;
			$(this).html('<img src="octicons/unmute.svg" class="octicon">');
			pause();
		}
	})

	function resume() {
		if(!startedPlaying) {
			startedPlaying = true;
			Tone.Transport.start('+0.1', 0);
		} else {
			Tone.Transport.start();
		}
	}

	function pause() {
		Tone.Transport.pause();
	}

});
