var Ajax = { 

	init: function ( service_url, mod_name ) { 
		this.service_url = service_url;
		this.module_name = mod_name;
		this.abortId;
		this.requestTimeout = 10000;
		this.failCount = 0;
	},  

	onError: function( oe, reason ) {
		++Ajax.failCount;
		Ajax.making_request = 0;
		window.clearTimeout( Ajax.abortId );
		if ( Ajax.debug ) {
			console.log( reason, oe );
		}
		if ( oe ) {
			oe( reason );
		}
	},

	onSuccess: function( oc, returnVal ) {
		Ajax.failCount = 0;
		Ajax.making_request = 0;
		window.clearTimeout( Ajax.abortId );
		if ( oc ) {
			oc( returnVal );
		}
	},

	making_request: 0,
        
	make_request: function ( on_complete, on_error ) { 
		if ( Ajax.making_request != 0 ) {
			return;
		}
		try {
			Ajax.making_request = 1;
			var A = new XMLHttpRequest();

			this.abortId = window.setTimeout( function () {
				Ajax.onError( on_error, 'Timeout' );
				A.abort();
			}, this.requestTimeout );

			A.onerror = function( e ) {
				Ajax.onError;
			};

			A.onreadystatechange = function() {
				var mod = this.module_name;
				if (A.readyState === 4) {
					if (A.status === 200) {
						var xml = A.responseXML;
						

						Ajax.onSuccess( on_complete, null );
					} else { 
						Ajax.onError( on_error, A.status );
					}   
				} else { 
					return;
				}
			};

			A.open("GET", this.service_url, true);

			A.send();
		} catch( e ) {
			console.error( "Can't connect to : %s", this.service_url );
		}
	}
};
