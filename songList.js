// Not in $(document).ready(); to allow for early loading during page render.

//==============================================================================
// Variables
//==============================================================================
var songList = [];

songList.push({
	'name': 'Kiss The Rain',
	'artist': 'Yiruma',
	'jsonFilename': 'KissTheRain'
});

songList.push({
	'name': 'Comforting Sounds',
	'artist': 'Mew',
	'jsonFilename': 'ComfortingSounds'
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

songList.push({
	'name': 'Shooting Stars',
	'artist': 'The Bag Raiders',
	'jsonFilename': 'ShootingStars'
});

songList.push({
	'name': 'Comforting Sounds [AT]',
	'artist': 'Mew',
	'jsonFilename': 'AT'
});

songList.sort(function SortByName(a, b){
  var aName = a.artist.toLowerCase();
  var bName = b.artist.toLowerCase();
  return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
});

//==============================================================================
// Song List Modal Loader
//==============================================================================
$(document).ready(function() {
	$songList = $('#songList');

	var songListHTML = '<table id="songListTable">'
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
		songListHTML += '<td><input type="button" class="changeSong" value="Load"  data-jsonfilename="' + song.jsonFilename + '"></td>'
		songListHTML += '</tr>'
	});

	songListHTML += '</tbody>'
	songListHTML += '</table>'

	$songList.html(songListHTML);
});
