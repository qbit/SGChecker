var set, i, l, images = [], sggallery, timer;
if ( document.getElementById('thumbs') ) {
	sggallery = sggallery || new Gallery(),
	timer = setInterval( function() {
		if ( document.getElementById('thumbs').childNodes.length === global.data.images.length ) {
			clearInterval(timer);
			set = global.data.images;
			for ( i = 0, l = set.length; i < l; i++ ) {
				images.push( set[i].src );
			}

			sggallery.addImages( images );

			// overwrite teh backbone navigate function
			global.router.navigate = function(f,o) {
				var a = f.split('/');
				sggallery.start(a[a.length-1]);
			}
		}
	}, 100);
};
