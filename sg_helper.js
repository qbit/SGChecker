var sg_helpers = [
	{ 
		name: "addNameToImage", 
		desc: "Adds girl name / album name to the alt tag of an image for easy set identification from group posts, boards.",
		enabled: true,
		fn: function() {
			var sgImages  =  document.getElementsByTagName( 'img' );

			for( var i = 0, l = sgImages.length; i < l; i++ ){
				if( sgImages[i].src.indexOf("/girls/") > -1 ){
					var parts = sgImages[i].src.split( '/' );
					var name = parts[5];
					var album = parts[7];
					sgImages[i].title = name + ' / ' + unescape( album );
				}
			}
		}
	}
];

(function(){
	var i,l;
	for ( i = 0, l = sg_helpers.length; i < l; i++ ) {

		if ( sg_helpers[i].enabled ) {
			sg_helpers[i].fn();
		}
	}
})()
