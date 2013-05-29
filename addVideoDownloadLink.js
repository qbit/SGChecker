if ( window.location.pathname.match( /\/videos\// ) && ! vid_player_replaced ) {
	var params = document.getElementsByTagName( 'param' ), i, l,
	si = document.getElementsByClassName( 'setInfo' ),
	a = document.createElement( 'a' );

	if ( params ) {
		for ( i = 0, l = si.length; i < l; i++ ) {
			if ( si[i].id && si[i].id.match( /video/i ) ) {
				si = si[i];
			}
		}

		for ( i = 0, l = params.length; i < l; i++ ) {
			if ( params[i] && params[i].name && params[i].name === 'href' ) {
				params = params[i];
			}
		}

		if ( ! params.length && ! si.length ) { 
			a.href = params.getAttribute( 'value' );
			a.innerText = 'Download Video';

			si.appendChild( a );
		}
	}
}

