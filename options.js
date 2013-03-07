window.onload = function() {
	SGChecker.pref_init();

	var i, l, ii, opt;
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
			var td4 = document.createElement( 'td' );

      var sub_opt_change = function() {
				var plugin = this.getAttribute('value').split( '_' )[0];
				var option = this.getAttribute('value').split( '_' )[1];
				var value = '', o = {};

				if ( this.checked ) {
          value = 'true';
				} else {
          value = 'false';
				}

        o[ plugin + '_' + option ] = value;

        chrome.storage.sync.set( o, function( ) { });
      };

      var check_change = function() {
				var name = this.getAttribute('id');
				var o = {};

				if ( this.checked ) {
					o[name] = 'true';
				} else {
					o[name] = 'false';
				}

				chrome.storage.sync.set( o, function() {
				});
      };
			
			td1.innerHTML = script.name;
			td2.innerHTML = script.desc;

			if ( script.enabled === 'true' || script.enabled === true) {
				inp.setAttribute( 'checked', 'checked' );
			} else {
				inp.removeAttribute( 'checked' );
			}

      if ( script.options ) {
        for ( ii in script.options ) {
          if ( script.options.hasOwnProperty( ii ) ) {
            opt = script.options[ii];

            var oinp = document.createElement( 'input' );
            oinp.setAttribute( 'type', 'checkbox' );
            oinp.setAttribute( 'value', '' + script.name + '_' + opt.id);

            if ( opt.enabled === 'true' || opt.enabled === true) {
              oinp.setAttribute( 'checked', 'checked' );
            } else {
              oinp.removeAttribute( 'checked' );
            }

            oinp.onclick = sub_opt_change;

            td3.appendChild( oinp );
            td3.appendChild( document.createTextNode( opt.name ) );
            td3.appendChild( document.createElement( 'br' ) );
          }
        }
      }

      inp.onclick = check_change;

			td4.appendChild( inp );

			tr.appendChild( td1 );
			tr.appendChild( td2 );
			tr.appendChild( td3 );
			tr.appendChild( td4 );
			table.appendChild( tr );
		}
	}, 500 );
}

