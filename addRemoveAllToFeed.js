if ( window.location.pathname.match( /\/my\/$/ ) ) {
	var bt = document.getElementById( 'browserRight' ),
	btn1 = document.createElement( 'button' ),
	btn2 = document.createElement( 'button' ),
	btn3 = document.createElement( 'button' ),
	btn4 = document.createElement( 'button' ),
	b1,
	b2,
	b3,
	b4,
	c1,
	c2,
	c3,
	c4,
	sgAs;

	btn1.innerHTML = "Remove All";
	btn2.innerHTML = "Load All";
	btn3.innerHTML = "Expand All";
	btn4.innerHTML = "Expand SPOILERS";

	c1 = function() {
		var i, l;
		sgAs = document.getElementsByTagName( 'a' ); 
		for ( i = 0, l = sgAs.length; i < l; i++ ) { 
			if ( sgAs[i].getAttribute('onclick') && sgAs[i].getAttribute('onclick').match( /stopWatchingEvent/ ) ) { 
				sgAs[i].click();
			}
		}
	};

	c2 = function() {
		var i, l;
		sgAs = document.getElementsByTagName( 'a' ); 
			for ( i = 0, l = sgAs.length; i < l; i++ ) { 
				if ( sgAs[i].getAttribute('onclick') && sgAs[i].innerHTML.match( /show 10 more/ ) ) { 
				sgAs[i].click();
			}
		}
	};

	c3 = function() {
		var i, l;
		sgAs = document.getElementsByTagName( 'a' );
		for ( i = 0, l = sgAs.length; i < l; i++ ) { 
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

	c4 = function() {
		var i, l;
		sgAs = document.getElementsByTagName( 'a' );
		for ( i = 0, l = sgAs.length; i < l; i++ ) { 
			if ( sgAs[i].innerHTML.match( /SPOILERS\!/ ) ) { 
				sgAs[i].click();
			}
		}
	};

	btn1.onclick = c1;
	btn2.onclick = c2;
	btn3.onclick = c3;
	btn4.onclick = c4;

	b1 = btn1.cloneNode(true);
	b2 = btn2.cloneNode(true);
	b3 = btn3.cloneNode(true);
	b4 = btn4.cloneNode(true);

	b1.onclick = c1;
	b2.onclick = c2;
	b3.onclick = c3;
	b4.onclick = c4;

	bt.insertBefore( btn1, bt.firstChild );
	bt.insertBefore( btn2, bt.firstChild );
	bt.insertBefore( btn4, bt.firstChild );
	bt.insertBefore( btn3, bt.firstChild );

	bt.appendChild( b3 );
	bt.appendChild( b4 );
	bt.appendChild( b2 );
	bt.appendChild( b1 );
}

