$(document).ready(function() {
//==============================================================================
// Global Variables
//==============================================================================
	var $midiDropZone = $('#midiDropZone');
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
				var optimizeOption = $('.optimizeRadio:checked').val();

				if(songJson.header.name) {
					song.name = songJson.header.name;
				} else {
					console.log(uploadedFile)
					song.name = uploadedFile.name;
				}

				song.bpm = songJson.header.bpm.toFixed(0);
				song.duration = songJson.duration;
				song.tracks = [];

				if(optimizeOption == 'normal') {
					song.optimizeOption = 'n'; // n for Normal

					$.each(songJson.tracks, function(i, track) {
						if(track.notes != 0) {
							var trackMeta = {}
							trackMeta.instrumentFamily = track.instrumentFamily;
							trackMeta.notes = [];

							$.each(track.notes, function(j, trackNote) {

								var note = {}

								note.name = trackNote.name;
								note.duration = trackNote.duration;
								note.time = trackNote.time;
								note.velocity = trackNote.velocity;

								trackMeta.notes.push(note)
							});

							song.tracks.push(trackMeta);
						}
					});
				} else if(optimizeOption == 'optimize') {
					song.optimizeOption = 'o'; // o for Optimized

					$.each(songJson.tracks, function(i, track) {
						if(track.notes != 0) {
							var trackMeta = {}
							trackMeta.iF = track.instrumentFamily;
							trackMeta.ns = [];

							$.each(track.notes, function(j, trackNote) {

								var n = {}

								n.n = trackNote.name;
								n.d = parseFloat(trackNote.duration.toFixed(4));
								n.t = parseFloat(trackNote.time.toFixed(3));
								n.v = parseFloat(trackNote.velocity.toFixed(3));

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
