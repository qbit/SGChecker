var vid_player_replaced = false;
if ( window.location.pathname.match( /\/videos\// ) ) {
	var params = document.getElementsByTagName( 'param' ), i, l,
	curVid = document.getElementById('player'),
	lc = document.getElementById( 'leftCol' ),
	vid = document.createElement('video' );

	vid.style.width = '100%';
	vid.style.height = '100%';

	vid.setAttribute( 'controls', 'controls' );

	vid_player_replaced = true;

	for ( i = 0, l = params.length; i < l; i++ ) {
		if ( params[i] && params[i].name && params[i].name === 'href' ) {
			params = params[i];
		}
	}

	if ( ! params.length ) { 
		curVid.remove();
		vid.src = params.getAttribute( 'value' );

		lc.style.marginTop = '6px';
		lc.style.height = '330px';
		lc.style.borderRadius = '5px';
		lc.style.backgroundColor = 'black';
		lc.style.backgroundImage = 'none';

		lc.appendChild( vid );
	}
}
