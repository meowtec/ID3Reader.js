ID3Reader.js
============

a JavaScript Library to read ID3 tags of MP3 file.
已经有更好方案。


**支持utf-8和gbk**
####例子：
```javascript
  file = "music.mp3"
  // or
  file = input.files[0]
  id3read(file, function(id3){
    id3.title;
    id3.title;
    id3.artist;
    id3.album;
    id3.year;
    id3.comment;
    id3.genre;
 })
```
