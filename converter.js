$(document).ready(function() {
//==============================================================================
// Global Variables
//==============================================================================
	var $midiDropZone = $('#midiDropZone');
	var $optimizeRadio = $('.optimizeRadio:checked');
	var $adjustedJson = $('#adjustedJson');

	$midiDropZone.on('dragover', function(e) {
		e.preventDefault();
		e.stopPropagation();

		$(this).addClass('midiDropZoneDragging');

		return false;
	})
	.on('dragleave', function(e) {
		e.preventDefault();
		e.stopPropagation();

		$(this).removeClass('midiDropZoneDragging');

		return false;
	})
	.on('drop', function (e) {
		e.preventDefault();
		e.stopPropagation();

		if(e.originalEvent.dataTransfer){
			if(e.originalEvent.dataTransfer.files.length == 1) {
				e.preventDefault();
				e.stopPropagation();

				var uploadedFile = e.originalEvent.dataTransfer.files[0];
				if(uploadedFile.type == 'audio/midi') {
					convertMidi(uploadedFile);
				}
			}
		}
		$(this).removeClass('midiDropZoneDragging');

    return false;
	});

//==============================================================================
// Convert from MIDI to Original JSON
//==============================================================================
	function convertMidi(uploadedFile) {
		var reader = new FileReader();
			reader.onload = function(e) {
				var songJson = MidiConvert.parse(e.target.result);

				var song = {};
				var optimizeOption = $optimizeRadio.val();

				song.bpm = songJson.header.bpm.toFixed(0);
				song.duration = songJson.duration;
				song.tracks = [];

				if(optimizeOption == 'original') {
					// .o for Optimize Option
					song.optimizeOption = 'o'; // O for Original

					$.each(songJson.tracks, function(i, track) {
						if(track.notes != 0) {

							var trackMeta = {}

							trackMeta.instrumentFamily = track.instrumentFamily;
							trackMeta.notes = [];

							$.each(trackMeta.notes, function(j, note) {
								note.duration = note.duration
								note.time = note.time
								note.velocity = note.velocity
							});

							song.tracks.push(trackMeta);
						}
					});
				} else if(optimizeOption == 'optimize') {
					song.optimizeOption = 'op'; // Op for Optimized

					$.each(songJson.tracks, function(i, track) {
						if(track.notes != 0) {

							var trackMeta = {}

							trackMeta.instrumentFamily = track.instrumentFamily;
							trackMeta.notes = [];

							$.each(trackMeta.notes, function(j, note) {
								var note = {}

								note.name = note.name;
								note.duration = parseFloat(note.duration.toFixed(4));
								note.time = parseFloat(note.time.toFixed(3));
								note.velocity = parseFloat(note.velocity.toFixed(3));

								trackMeta.notes.push(note)
							});

							song.tracks.push(trackMeta);
						}
					});
				} else if(optimizeOption == 'superOptimize') {

					song.optimizeOption = 'sO'; // sO for Super Optimized

					$.each(songJson.tracks, function(i, track) {
						if(track.notes != 0) {
							var trackMeta = {}
							trackMeta.iF = track.instrumentFamily;
							trackMeta.ns = [];

							$.each(track.notes, function(j, note) {

								var n = {}

								n.n = note.name;
								n.d = parseFloat(note.duration.toFixed(4));
								n.t = parseFloat(note.time.toFixed(3));
								n.v = parseFloat(note.velocity.toFixed(3));

								trackMeta.ns.push(n)
							});

							song.tracks.push(trackMeta);
						}
					});
				}
				$adjustedJson.val(JSON.stringify(song));
			}
		reader.readAsBinaryString(uploadedFile);
	}
});
