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

	var songListHTML = '<table>'
	songListHTML += '<thead>'
	songListHTML += '<tr>'
	songListHTML += '<th>Title</th>'
	songListHTML += '<th>Artist</th>'
	songListHTML += '<th></th>'
	songListHTML += '</tr>'
	songListHTML += '</thead>'
	songListHTML += '<tbody>'

	$.each(songList, function(songIndex, song) {

		songListHTML += '<tr>'
		songListHTML += '<td>' + song.name + '</td>'
		songListHTML += '<td>' + song.artist + '</td>'
		songListHTML += '<td><input type="button" class="changeSong" value="Play"  data-jsonfilename="' + song.jsonFilename + '"></td>'
		songListHTML += '</tr>'
	});
	
	songListHTML += '</tbody>'
	songListHTML += '</table>'

	$songList.html(songListHTML);
});
