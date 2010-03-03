var SGChecker = {

	liImage: "sg_in.png",
	loImage: "sg_not_in.png",

	debug: localStorage.debug || 0,

	poll_min: 600000, // This value was recommended by SG staff ( 10 minutes ).  It should not be lowered. 
	poll_max: 3600000, // 1 hour

	// pref_config defines the types of buttons / option stuff that goes into the options page.  My goal is to 
	// eventually define the entire page in js.
	pref_config: {
		debug: 1,
		save_status_div: "sg_save_status",
		url_select: {
			select_name: "url_action",
			dest_div: "sg_click_action_div",
			options: [
				"Main Page", 
				"MySG", 
				"Messages", 
				"Groups"
			]
		},

		check_boxes: [
			group1 = {
				dest_div : "sg_debug_options_div",
				buttons: [
					debug = [ "debug" ]
				]
			}
		],

		radio_buttons: [
			group1 = {
				dest_div: "sg_get_options_div",
				buttons: [
					"Messages",
					"Comments"
				]
			}
		]
	},

	success: function( result ) {
		LoadAnimation.stop();
		SGChecker.showLoggedIn();

		if ( result != '0' ) {
			LoadAnimation.set_count( result );
		} else {
			LoadAnimation.set_count( );
		}

		SGChecker.schedule();

		if ( SGChecker.debug ) {
			console.log( result );
		}
	},

	error: function( reason ) {
		LoadAnimation.stop();
		if ( reason == 'Timeout' ) {
			SGChecker.showLoggedOut();
		}
		if ( reason == 'NotLoggedIn' ) {
			SGChecker.showLoggedOut();
		}
		SGChecker.schedule();
	},

	schedule: function() {
		var rand = Math.random() * ( SGChecker.poll_max - SGChecker.poll_min );
		rand = rand + SGChecker.poll_min;
		var delay = Math.ceil( rand );

		if ( SGChecker.debug ) {
			console.log( 'Checking in %s minutes', Math.ceil( rand / 1000 / 60 ) );
		}

		window.setTimeout( function() { 
				Ajax.make_request( SGChecker.success, SGChecker.error );
			}, delay
		);
	},

	gets: function() {
		var gets;
		if ( localStorage.messages + '' == 'true' ) {
			gets = [ '//getInfo/unreadMessages' ];
		} else if ( localStorage.comments + '' == 'true' ) {
			gets = [ '//getInfo/commentNumber' ];
		} else {
			gets = [ '//getInfo/unreadMessages' ];
		}
		if ( SGChecker.debug ) {
			console.log( gets );
		}
		return gets;
	},

	sg_url: "http://suicidegirls.com/xml/user/getInfo/",

	sg_pref_urls: {
		main_page: "http://suicidegirls.com/",
		mysg: "http://suicidegirls.com/my/",
		messages: "http://suicidegirls.com/my/messages/",
		groups: "http://suicidegirls.com/groups/"
	},

	showLoggedOut: function() {
		chrome.browserAction.setIcon( {path: this.loImage} );
		chrome.browserAction.setBadgeBackgroundColor( {color:[190, 190, 190, 230]} );
	},

	showLoggedIn: function() {
		chrome.browserAction.setBadgeBackgroundColor( {color:[66, 66, 66, 255]} );
		chrome.browserAction.setIcon( {path: this.liImage} );
	},

	get_url_pref: function() { 
		var url_pref = localStorage.url_action || "main_page";	
		return this.sg_pref_urls[ url_pref ]; 
	},

	go_to_sg: function( ) {
		var url = this.get_url_pref();
		if ( SGChecker.debug ) {
			console.log( "Opening preference page: %s ", url );
		}
		chrome.tabs.getAllInWindow( undefined, function( tabs ) {
			for ( var i = 0, tab; tab = tabs[i]; i++ ) {
				if ( tab.url && tab.url === url ) {
					chrome.tabs.update( tab.id, {selected: true} );
					return;
				}
			}
			chrome.tabs.create( {url: url} );
		});
	}, 

	pref_init: function() {
		SGChecker.pref_make_select( SGChecker.pref_config.url_select );
		SGChecker.pref_make_check( SGChecker.pref_config.check_boxes );
		SGChecker.pref_make_radio( SGChecker.pref_config.radio_buttons );
	},

	pref_save: function( name, val ) {
		if ( SGChecker.debug ) {
			console.log( "Saving %s in %s", val, name );
		}
		localStorage[ name ] = val;

		chrome.extension.getBackgroundPage().reload();

		var stat = document.getElementById( SGChecker.pref_config.save_status_div );
		stat.style.display = 'block';

		window.setTimeout( function() {
			stat.style.display = 'none';
		}, 2000 );
	},

	pref_make_radio: function( config ) {
		for ( var i = 0; i < config.length; i++ ) {
			for ( var j = 0; j < config[i].buttons.length; j++ ) {
				var radio_div = document.createElement( "div" );
				var div_text = document.createTextNode( config[i].buttons[j] );

				var radio = document.createElement( "input" );
				radio.id = config[i].buttons[j].toLowerCase();
				radio.value = config[i].buttons[j];
				radio.type = 'radio';
				radio.name = 'group' + i;

				radio.onchange = function() {
					for ( var i = 0; i < config.length; i++ ) {
						for ( var j = 0; j < config[i].buttons.length; j++ ) {
							var cb = config[i].buttons[j].toLowerCase();
							var item = document.getElementById( cb );
							SGChecker.pref_save( item.id, item.checked );
						}
					}
				};

				if ( j == 0 ) {
					radio.checked = 'selected';
				}

				if ( localStorage[ radio.id ] + '' == 'true' ) {
					radio.checked = localStorage[ radio.id ];
					has_setting = true;
				}

				radio_div.appendChild( radio );
				radio_div.appendChild( div_text );
				document.getElementById( config[i].dest_div ).appendChild( radio_div );
			}
		}
	},

	pref_make_check: function( config ) {
		for ( var i = 0; i < config.length; i++ ) {
			for ( var j = 0; j < config[i].buttons.length; j++ ) {
				var check = document.createElement( "input" );
				check.id = config[i].buttons[j];
				check.type = "checkbox";
				check.name = config[i].buttons[j];

				check.onchange = function() {
					var current = this;
					SGChecker.pref_save( current.name, current.checked );
				};

				if ( localStorage[ check.name ] + '' == 'true' ) {
					check.checked = localStorage[ check.name ];
				}

				document.getElementById( config[i].dest_div ).appendChild( check );
			}
		}
	},

	pref_make_select: function( config ) {
		select = document.createElement( "select" );
		select.name = config.select_name;
		select.id = config.select_name;

		select.onchange = function() {
			var current = this.options[ this.selectedIndex ];
			SGChecker.pref_save( config.select_name, current.value );
		};

		for ( var i = 0; i < config.options.length; i++ ) {
			var t = document.createElement( "option" );
			value = config.options[i].toLowerCase().replace( ' ', '_' );

			t.value = value;
			t.text = config.options[i];


			var save_name = config.select_name;
			if ( localStorage[ save_name ] && value == localStorage[ save_name ] ) {
				t.selected = "selected";
			}

			select.appendChild( t );
		}

		document.getElementById( config.dest_div ).appendChild( select );
	},
};
