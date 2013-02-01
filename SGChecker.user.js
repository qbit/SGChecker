// ==UserScript==
// @name        SGChecker
// @namespace   http://deftly.net
// @description SGChecker for FireFox
// @include     https://suicidegirls.com/*

// @include     http://suicidegirls.com/*
// @version     0.1
// ==/UserScript==




function addNameToImage() { 
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

function addVideoDownloadLink() {
	if ( window.location.pathname.match( /\/videos\// ) ) {
		var params = document.getElementsByTagName( 'param' ), i, l;
		var si = document.getElementsByClassName( 'setInfo' );
		var a = document.createElement( 'a' );

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
			a.innerHTML = 'Download Video';
			si.appendChild( a );
		}
	}
}
function addRemoveAllToFeed() {
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

addRemoveAllToFeed();
addVideoDownloadLink();
addNameToImage();
