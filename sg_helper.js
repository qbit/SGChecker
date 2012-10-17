var sg_helpers = {
	"addNameToImage": { 
		name: "addNameToImage", 
		desc: "Adds girl name / album name to the alt tag of an image for easy set identification from group posts, boards.",
		enabled: "true",
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
	},
	"addRemoveAllToFeed": {
		name: "addRemoveAllToFeed",
		desc: "Adds a remove-all button to the feeds page.",
		enabled: "true",
		fn: function() {
			if ( window.location.pathname.match( /\/my\// ) ) {
				var bt = document.getElementById( 'browserRight' );
				var btn1 = document.createElement( 'button' );
				var btn2 = document.createElement( 'button' );
				var btn3 = document.createElement( 'button' );
				var btn4 = document.createElement( 'button' );

				var sgAs;

				btn1.innerHTML = "Remove All";
				btn2.innerHTML = "Load All";
				btn3.innerHTML = "Expand All";
				btn4.innerHTML = "Expand SPOILERS";

				btn1.onclick = function() {
					sgAs = document.getElementsByTagName( 'a' ); for ( var i = 0, l = sgAs.length; i < l; i++ ) { 
						if ( sgAs[i].getAttribute('onclick') && sgAs[i].getAttribute('onclick').match( /stopWatchingEvent/ ) ) { 
							sgAs[i].click();
						}
					}
				};

				btn2.onclick = function() {
					sgAs = document.getElementsByTagName( 'a' ); for ( var i = 0, l = sgAs.length; i < l; i++ ) { 
						if ( sgAs[i].getAttribute('onclick') && sgAs[i].innerHTML.match( /show 10 more/ ) ) { 
							sgAs[i].click();
						}
					}
				};

				btn3.onclick = function() {
					sgAs = document.getElementsByTagName( 'a' );
					for ( var i = 0, l = sgAs.length; i < l; i++ ) { 
						if ( btn3.innerHTML === 'Expand All' ) {
							if ( sgAs[i].innerHTML.match( 'Show more' ) ) { 
								sgAs[i].click();
							}
						} else {
							if ( sgAs[i].innerHTML.match( 'Show less' ) ) { 
								sgAs[i].click();
							}
						}
					}
					if ( btn3.innerHTML === 'Collapse All' ) {
						btn3.innerHTML = 'Expand All';
					} else {
						btn3.innerHTML = 'Collapse All';
					}
				};

				btn4.onclick = function() {
					sgAs = document.getElementsByTagName( 'a' );
					for ( var i = 0, l = sgAs.length; i < l; i++ ) { 
						if ( sgAs[i].innerHTML.match( /SPOILERS\!/ ) ) { 
							sgAs[i].click();
						}
					}
				};

				bt.insertBefore( btn1, bt.firstChild );
				bt.insertBefore( btn2, bt.firstChild );
				bt.insertBefore( btn4, bt.firstChild );
				bt.insertBefore( btn3, bt.firstChild );
			}
		}
	}
};

function size(obj) {
	var size = 0; key;
	for ( key in obj ) {
		if ( obj.hasOwnProperty(key)) {
			size++;
		}
	}
	return size;
}

function check( name ) {
	chrome.storage.sync.get( name, function( o ) {
		if ( size(o) === 0 ) { 
			sg_helpers[name].fn();
			sg_helpers[name].enabled = "true";
		} else {
			for ( var a in o ) {
				if ( o[a] === "true" )  {
					sg_helpers[a].fn();
					sg_helpers[a].enabled = "true";
				} else {
					sg_helpers[a].enabled = "false";
				}
			}
		}
	});
}

(function(){
	var i,l;
	for ( var n in sg_helpers ) {
		check( sg_helpers[n].name );
	}
})()
