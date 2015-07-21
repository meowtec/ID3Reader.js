(function(){
    function getId3FromFile(file,callback){
        var reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = function(){
            var buffer = this.result;
            var intArray = new Uint8Array(buffer,buffer.byteLength-128,128);
            var id3tag = decodeIntArray(intArray,0,3);
            if(id3tag=='TAG'){
                var title = decodeIntArray(intArray,3,33);
                var artist = decodeIntArray(intArray,33,63);
                var album = decodeIntArray(intArray,63,93);
                var year = decodeIntArray(intArray,93,97);
                var comment = decodeIntArray(intArray,97,127);
                var genre = decodeIntArray(intArray,127,128);
            }
            callback({
                title:title,
                artist:artist,
                album:album,
                year:year,
                comment:comment,
                genre:genre
            });
        }
    }
    function id3(mp3,callback){
        if(typeof mp3 == 'object'){
            getId3FromFile(mp3,callback);
        }else if(typeof mp3 == 'string'){
            var xhr = new XMLHttpRequest();
            xhr.open('GET',mp3,true);
            xhr.responseType = "blob";
            xhr.send();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    var blob = xhr.response;
                    getId3FromFile(blob,callback);
                }
            }
            window.xhr = xhr;
        }
    }
    window.id3read = id3;
    function decodeIntArray(array,start,end){
        start = start||0;
        end = end||array.length;
        //首先尝试使用utf-8解码
        var notUTF;
        var intUTF = 0;
        var unicode = 0
        var str = '';
        //log(start,array);
        for(var i=start;i<end;i++){
            var item = array[i];
            var highOne = 0;
            var highEnd = false;
            item = item<<24;
            for(var j=0;j<8;j++){
                if(highEnd){
                    unicode = unicode<<1;
                    if(item<0){
                        unicode = unicode|1;
                    }
                }else{
                    if(item>=0){//最高位为0
                        highEnd = true;
                        if(highOne==0){
                            break;
                        }
                    }else{
                        highOne++;
                    }
                }
                item = item<<1;

            }

            if(highOne==0){
                if(intUTF>0){
                    notUTF = true;
                    break;
                }else{
                    item = array[i]
                    str = str+String.fromCharCode(item);
                    unicode = 0;
                }
            }else if(highOne==1){
                if(intUTF>1){
                    intUTF--;
                }else{
                    intUTF = 0;
                    str = str+String.fromCharCode(unicode);
                    unicode = 0;
                }
            }else{
                if(intUTF>0){
                    notUTF = true;
                    break;
                }
                intUTF = highOne-1;
            }
        }
        if(notUTF){
            //使用GBK解码
            str = '';
            var gbk = 0;
            var intGBK;
            for(var i=start;i<end;i++){
                var item = array[i];
                if(item>128&&!intGBK){
                    intGBK = 1;
                    gbk = item;
                }else{
                    intGBK = 0;
                    gbk = gbk*256+item;
                    //str = str + (fromGBKCode(gbk)||'');
                    //фикс проверки
                    str = str + ((typeof fromGBKCode === 'function')?fromGBKCode(gbk):''); 
                    gbk = 0;
                }
            }
        }
        return str;
    }
})();
