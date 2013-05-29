var sgImages  =  document.getElementsByTagName( 'img' ), i, l, parts, name, album;

for( i = 0, l = sgImages.length; i < l; i++ ){
	if( sgImages[i].src.indexOf("/girls/") > -1 ){
		parts = sgImages[i].src.split( '/' );
		name = parts[5];
		album = parts[7];
		sgImages[i].title = name + ' / ' + unescape( album );
	}
}
