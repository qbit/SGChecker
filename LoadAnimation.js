var LoadAnimation = {
	init: function( config ) {
		this.maxDot = config.maxDot || 4;
		this.current = config.current || 0;
		this.maxCount = config.maxCount || 8;
		this.timerId = config.timerId || 0;
		this.frames = config.frames || 36;
		this.animationSpeed = 100;
		this.rotation = 0;
		this.c = config.canvas || 'canvas';
		this.canvas = document.getElementById( this.c );
		this.canvasContext = this.canvas.getContext( '2d' );
		this.image = config.image;
	},

	start: function() {
		if ( this.timerId ) {
		   return;
		}

		// Don't think I need self here either....
		var self = this;
		this.timerId = window.setInterval( function() {
			self.paintFrame();
		}, 100 );
	},

	set_count: function( count ) {
		if ( this.timerId ) {
			return;
		}

		if ( count ) {
			chrome.browserAction.setBadgeText( { text: count } );
		} else {
			chrome.browserAction.setBadgeText( { text: '' } );
		}

	},

	stop: function() {
		if ( ! this.timerId ) {
			return;
		}

		window.clearInterval( this.timerId );
		this.timerId = 0;
		chrome.browserAction.setBadgeText( { text: '' } );
	},

	paintFrame: function() {
		var text = "";
		for ( var i = 0; i < this.maxDot; i++ ) {
			text += ( i == this.current ) ? "." : " ";
		}

		chrome.browserAction.setBadgeText( { text:text } );
		this.current++;
		if ( this.current == this.maxCount ) {
				this.current = 0;
		}		
	}
};
