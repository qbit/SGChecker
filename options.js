window.onload = function() {
	SGChecker.pref_init();

	var i, l;
	setTimeout( function() {
		for ( i in sg_helpers ) {
			var script = sg_helpers[i];
			var table = document.getElementById( 'scripts' );
			var tr = document.createElement( 'tr' );
			var inp = document.createElement( 'input' );

			inp.setAttribute( 'type', 'checkbox' );
			inp.setAttribute( 'id', script.name );

			var td1 = document.createElement( 'td' );
			var td2 = document.createElement( 'td' );
			var td3 = document.createElement( 'td' );
			
			td1.innerHTML = script.name;
			td2.innerHTML = script.desc;

			if ( script.enabled === 'true' || script.enabled === true) {
				inp.setAttribute( 'checked', 'checked' );
			} else {
				inp.removeAttribute( 'checked' );
			}

			inp.onclick = function() {
				var name = this.getAttribute('id');
				var o = {};

				if ( this.checked ) {
					o[name] = 'true';
				} else {
					o[name] = 'false';
				}

				chrome.storage.sync.set( o, function() {
				});
			}

			td3.appendChild( inp );

			tr.appendChild( td1 );
			tr.appendChild( td2 );
			tr.appendChild( td3 );
			table.appendChild( tr );
		}
	}, 500 );
}

