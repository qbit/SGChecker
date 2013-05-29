// Detect if we are on a gallery page.. build a hidden list of images
// and append them to the dom. Then set a class when all images are
// appended
//
// Then in the actual content script ( non-injected ) in a setInterval
// check for the class on the appended info above.
//
// Iterate through the images and build our list to send to jszip which
// will also run in the content-script area.

if (typeof global !== 'undefined') {
	// if we have global we are on a gallery page
	if ( window.location.pathname.match( /photos\/.+$/ ) || window.location.pathname.match( /albums\/.+$/ ) ) {
		var head = document.getElementsByClassName( 'launch_title' )[0],
		a = document.createElement( 'a' ),
		set_title = head.firstChild.innerText.replace( ' ', '_' ),
		img_ele = document.createElement('div'),
		girl = document.getElementsByClassName( 'name' )[0].innerText;

		img_ele.id = 'sg_img_container';
		img_ele.style.display = 'none';

		a.innerText = " Create Download";
		a.style.font = 'normal 10px Arial';
		a.style.cursor = 'pointer';
		a.id = 'sg_img_a';

		head.appendChild( a );

		img_ele.setAttribute('alt', girl +':'+ set_title );

		document.body.appendChild(img_ele);

		a.onclick = function() {
			var set = global.data.images, i, l;


			for ( i = 0, l = set.length; i < l; i++ ) {
				var s = set[i].src.split( /\// ), name = [], img = new Image();
				img.src = set[i].src;
				img.setAttribute('alt', s[s.length - 1]);

				img_ele.appendChild(img);
				// addData(set[i].src, name, inc )
				if ( i === set.length - 1 ) {
					img_ele.className = "sg_img_done";
				}
			}
		}
	}
} else {
	// we are running in content_script context - so establish
	// our jsizp stuff and watch for sg_img_done

	var running = false, timer = setInterval(function() {
		var gallery = document.getElementsByClassName('sg_img_done')[0];
		if (gallery && !running) {
			running = true;
			clearInterval(timer);

			var i, l, images = [],
			a = document.getElementById('sg_img_a'),
			zg, zf, count = 1, tot = 0,
			zip = new JSZip(), blob, link, girl, set_title;

			girl = gallery.getAttribute('alt').split(':')[0];
			set_title = gallery.getAttribute('alt').split(':')[1];

			tot = gallery.childNodes.length;

			zg = zip.folder( girl );
			zf = zg.folder( set_title );

			a.innerText = " Generating: 0%";

			function done() {
			    var blob = zip.generate({type:"blob"});
			    var l = document.createElement('a');
			    l.style.font = 'normal 10px Arial';
			    l.style.cursor = 'pointer';

			    l.href = window.URL.createObjectURL(blob);
			    l.download = girl + '_' + set_title + ".zip";
			    l.innerText = ' Download';

			    a.parentNode.appendChild(l);
			    a.parentNode.removeChild(a);
			}

			function inc( data, name ) {
			    if ( count >= tot ) {
				    a.innerText = ' Download';
				    done();
			    } else {
				    zf.file( name, data, { type: 'arraybuffer' } );
				    data = null;
			    }

			    count++;
			}

			function addData( url, name, fn ) {
			    var req = new XMLHttpRequest();
			    req.overrideMimeType("text/plain; charset=x-user-defined");
			    req.responseType = "arraybuffer";
			    req.open('GET', url, true);

			    req.onreadystatechange = function( data ) {
				    a.innerText = ' Generating : ' + parseInt( Math.floor( count/tot * 100 ), 10 ) + '%';
				    if ( req.readyState === 4 && req.status === 200 ) { 
					fn.call( null, req.response, name );
					req.onreadystatechange = null;
					req.abort = null;
					req = null;
				    }
			    }

			    req.send(null);
			}

			for ( i = 0, l = gallery.childNodes.length; i < l; i++ ) {
				var s = gallery.childNodes[i];
				addData(s.src, s.getAttribute('alt'), inc);
			}
		}
	},100);
}
