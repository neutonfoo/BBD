$(document).ready(function() {
	var $adjustedJson = $('#adjustedJson');

	$("#converterListener").on('click', function() {
		$adjustedJson.val('')
	});

	$("#converterListener").leanModal({ top : 50 });
	$("#aboutListener").leanModal({ top : 50 });
	$("#thanksListener").leanModal({ top : 50 });
});
