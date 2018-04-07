$(document).ready(function() {
//==============================================================================
// Global Variables
//==============================================================================
	var $midiDropZone = $('#midiDropZone');
	var $optimizeCheckbox = $('#optimizeCheckbox');
	var $originalJson = $('#originalJson');
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

		$(this).removeClass('midiDropZoneDragging');

		if(e.originalEvent.dataTransfer){
			if(e.originalEvent.dataTransfer.files.length == 1) {
				e.preventDefault();
				e.stopPropagation();

				var uploadedFile = e.originalEvent.dataTransfer.files[0];
				if(uploadedFile.type == 'audio/midi') {
					convertMidiToOriginalJson(uploadedFile);
				}
			}
		}
    return false;
	});

//==============================================================================
// Convert from MIDI to Original JSON
//==============================================================================
	function convertMidiToOriginalJson(uploadedFile) {
		var reader = new FileReader();
			reader.onload = function(e) {
				var partsData = MidiConvert.parse(e.target.result);
				$originalJson.val(JSON.stringify(partsData));
				convertOriginalJsonToAdjustedJson();
			}

		reader.readAsBinaryString(uploadedFile);
	}
//==============================================================================
// Convert from Original JSON to Adjusted JSON
//==============================================================================
	$('#convert').on('click', function() {
		convertOriginalJsonToAdjustedJson();
	});

	function convertOriginalJsonToAdjustedJson() {
		var song = {};
		var originalJsonRaw = $originalJson.val();
		var isValidJson = true;

		try {
			originalJson = JSON.parse(originalJsonRaw);
		} catch (e) {
			isValidJson = false;
				alert('Not valid Json');
		}

		if(isValidJson) {
			song.bpm = originalJson.header.bpm;
			song.duration = originalJson.duration;
			song.tracks = [];

			$.each(originalJson.tracks, function(i, track) {
				if(track.notes != 0) {
					var trackMeta = {}
					trackMeta.instrumentFamily = track.instrumentFamily;
					trackMeta.notes = track.notes;

					$.each(trackMeta.notes, function(j, note) {

						delete note.midi;

						if($optimizeCheckbox.is(':checked')) {
							note.duration = parseFloat(note.duration.toFixed(4));
							note.time = parseFloat(note.time.toFixed(3));
							note.velocity = parseFloat(note.velocity.toFixed(3));
						} else {
							note.duration = note.duration
							note.time = note.time
							note.velocity = note.velocity
						}
					})

					song.tracks.push(trackMeta);
				}
			});

			$adjustedJson.val(JSON.stringify(song));
		}
	}
});
