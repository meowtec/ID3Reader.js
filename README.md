ID3Reader.js
============

a JavaScript Library to read ID3 tags of MP3 file.

file = "music.mp3"
// or
file = input.files[0]
id3read("music.mp3", function(id3){
  id3.title;
  id3.title;
  id3.artist;
  id3.album;
  id3.year;
  id3.comment;
  id3.genre;
})
