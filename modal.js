$(document).ready(function() {
	var $adjustedJson = $('#adjustedJson');

	$("#converterListener").on('click', function() {
		$adjustedJson.val('')
	});

	$("#songSelectorListener, #converterListener, #aboutListener, #thanksListener").leanModal({ top : 50 });
});
