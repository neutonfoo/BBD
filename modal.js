$(document).ready(function() {
	var $adjustedJson = $('#adjustedJson');

	$("#converterListener").on('click', function() {
		$adjustedJson.val('')
	});

	$("#converterListener, #aboutListener, #thanksListener").leanModal({ top : 50 });
});
