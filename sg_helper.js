function addNameToImage() {
	var sgImages  =  document.getElementsByTagName( 'img' );
	for( var i = 0, l = sgImages.length; i < l; i++){
			if( sgImages[i].src.indexOf("/girls/") > -1){
				var parts = sgImages[i].src.split( '/' );
				var name = parts[5];
				var album = parts[7];
				sgImages[i].title = name + ' / ' + unescape( album );
			}
	}
}

(function(){
	addNameToImage();
})()
