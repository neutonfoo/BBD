// Not in $(document).ready(); to allow for early loading during page render.

//==============================================================================
// Variables
//==============================================================================
var songList = [];

songList.push({
	'name': 'Comforting Sounds',
	'artist': 'Mew',
	'jsonFilename': 'ComfortingSounds'
});

songList.push({
	'name': '鳥の詩',
	'artist': 'Lia',
	'jsonFilename': 'ToriNoUta'
});

songList.push({
	'name': '残酷な天使のテーゼ',
	'artist': '高橋 洋子',
	'jsonFilename': 'ACruelAngelsThesis'
});

songList.push({
	'name': 'You outside my window',
	'artist': 'きのこ帝国',
	'jsonFilename': 'YouOutsideMyWindow'
});

songList.push({
	'name': 'あの夏へ',
	'artist': '久石 譲',
	'jsonFilename': 'OneSummersDay'
});

//==============================================================================
// Song List Modal Loader
//==============================================================================
$(document).ready(function() {
	$songList = $('#songList');

	$.each(songList, function(songIndex, song) {
		var songHtml = '<input type="button" class="changeSong" value="' + song.name + ' by ' + song.artist + '" data-jsonfilename="' + song.jsonFilename + '">';
		$songList.append(songHtml + '<br>');
	});
});
