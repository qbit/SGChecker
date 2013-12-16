// Detect if we are on a gallery page.. build a hidden list of images
// and append them to the dom. Then set a class when all images are
// appended
//
// Then in the actual content script ( non-injected ) in a setInterval
// check for the class on the appended info above.
//
// Iterate through the images and build our list to send to jszip which
// will also run in the content-script area.

function getImages(tag, parClass) {
	var imgs = [], eles = document.getElementsByTagName(tag), i, l;

	for (i = 0, l = eles.length; i < l; i++) {
		if (eles[i].parentNode.className.match(parClass)) {
			imgs.push(eles[i].getAttribute('href'));
		}
	}

	return imgs;
}


if (window.location.pathname.match(/\/album\/.+$/)) {
	var a = document.createElement('a'), parent, ele;
	a.className = 'button icon-download has-bar';
	a.id = 'sg_img_a';

	ele = document.getElementsByClassName('button icon-share has-bar')[0]
	parent = ele.parentNode;

	parent.insertBefore(a, ele);

	a.onclick = function() {
		running = true;
		var i, l, images = [],
		a = document.getElementById('sg_img_a'),
		zg, zf, count = 1, tot = 0,
		zip = new JSZip(), blob, link, girl, set_title;

		images = getImages('a', 'photo-container');
		girl = document.location.pathname.split('/')[2];
		set_title = document.getElementsByClassName('title')[0].innerText;

		tot = images.length;

		zg = zip.folder( girl );
		zf = zg.folder( set_title );

		a.className = 'button has-bar';

		a.innerText = "0%";

		function done() {
		    var blob = zip.generate({type:"blob"});
		    var l = document.createElement('a');
		    // l.style.font = 'normal 10px Arial';
		    l.style.cursor = 'pointer';

		    l.className = 'button';

		    l.href = window.URL.createObjectURL(blob);
		    l.download = girl + '_' + set_title + ".zip";
		    l.innerText = ' Download';

		    a.parentNode.insertBefore(l, a);
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
			    a.innerText = parseInt( Math.floor( count/tot * 100 ), 10 ) + '%';
			    if ( req.readyState === 4 && req.status === 200 ) { 
				fn.call( null, req.response, name );
				req.onreadystatechange = null;
				req.abort = null;
				req = null;
			    }
		    }

		    req.send(null);
		}

		for ( i = 0, l = images.length; i < l; i++ ) {
			var s = images[i];
			addData(s, i + '.jpg', inc);
		}
	}
}
