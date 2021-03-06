var animation_config = {
	maxDot: 4,
	current: 0,
	maxCount: 8,
	canvas: 'canvas',
	image: SGChecker.liImage
};

SGChecker.debug = true;

Ajax.init( SGChecker.sg_url, 'SGChecker' );
Ajax.debug = SGChecker.debug;

function init() {
	LoadAnimation.init( animation_config );
	SGChecker.showLoggedOut();
	LoadAnimation.start();

	Ajax.make_request( SGChecker.success, SGChecker.error );

	chrome.browserAction.onClicked.addListener( function( ) {
		SGChecker.go_to_sg();
	});
};

function reload() {
	LoadAnimation.start();

	Ajax.make_request( SGChecker.success, SGChecker.error );
};

chrome.tabs.onUpdated.addListener( function( tabId, changeInfo ) {
	if ( changeInfo.url && SGChecker.is_sg_url( changeInfo.url ) ) {
		if ( SGChecker.debug ) {
			console.log( "Reloading because we are on your pref page" );
		}
		Ajax.make_request( SGChecker.success, SGChecker.error );
	}
});

setTimeout(function() {
	init();
}, 500 );
