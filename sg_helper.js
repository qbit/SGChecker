/*global Image, document, scroll, unescape, window, chrome */
var Gallery = function (imgs ) {
	if( !document.body )
		return;
    var i, l, img, self = this;
    this.running = false;

    imgs = imgs || [];
    
    this.delay = 3000;
    this.count = 0;

    this.bg = document.createElement('div');

    this.bg.style.width = '100%';
    this.bg.style.height = document.body.scrollHeight + 'px';
    this.bg.style.position = 'absolute';
    this.bg.style.textAlign = 'center';
    this.bg.style.top = 0;
    this.bg.style.left = 0;
    this.bg.style.backgroundColor = 'rgba(0,0,0,0.6)';
    this.bg.style.display = 'none';
    this.bg.style.zIndex = 110;
    this.bg.onclick = function() {
      self.stop();
    };

    this.fg = document.createElement('div');

    this.fg.style.width = 'auto';
    this.fg.style.height = 'auto';
    this.fg.style.borderRadius = '5px';
    this.fg.style.padding = '10px';
    this.fg.style.backgroundColor = 'white';
    this.fg.style.marginTop = '30px';
    this.fg.style.display = 'inline-block';
    this.fg.style.opacity = '1.0 !important';

    this.bg.appendChild(this.fg);

    if ( document.body ) {
      document.body.appendChild(this.bg);
    } else {
      return;
    }

    this.images = [];

    this.hasImages = false;
    this.addImages( imgs );

    return this;
};
Gallery.prototype.addImages = function( imgs ) {
    var i, l, img;
    if ( imgs.length > 0 ) {
      this.hasImages = true;
    }
    for (i = 0, l = imgs.length; i < l; i++) {
        img = new Image();
        img.src = imgs[i];
        img.style.width = "100%";
        img.style.height = "auto";
        img.style.opacity = '1.0 !important';
        img.style.boxShadow = '3px 3px 4px #000';
        img.style.borderRadius = '3px';
        this.images.push(img);
    }
};
Gallery.prototype.overlay = function() {
    //
// function addToFavs()
// {
//   var addPath = '';
//   var pic = pics[activePic];
// 
//   var filename = pic[0];
//   var favoriteId = parseInt(pic[8]);
//   var favorite = parseInt(pic[3]);
// 
// //  alert('0: ' + pic[0] + "\n1: " +pic[1] + "\n2: " +pic[2] + "\n3: " +pic[3] + "\n4: " +pic[4] + "\n5: " +pic[5] + "\n6: " +pic[6] + "\n7: " + pic[7] + "\n8: " + pic[8]);
//   var imagePath = filename.split('/');
//   var girl = imagePath[3];
//   var setName = imagePath[5];
//   var picName = favoriteId;
// 
//   if (!favorite) {
//     loadDoc('/xml/pics/addFave/' + picName + '/', 1);
//   }
// }"
};
Gallery.prototype.clear = function () {
    var i, l, c;
    for (i = 0, l = this.fg.children.length; i < l; i++) {
        c = this.fg.children[i];
        c.parentNode.removeChild(c);
    }
};
Gallery.prototype.getImage = function (rev) {
    var img;

    if (!rev) {
        img = this.images[this.count] || null;
        this.count++;
    } else {
        img = this.images[this.count - 2] || null;
        this.count--;
    }
    return img;
};
Gallery.prototype.show = function (idx, back) {
    var self = this,
        img;

    scroll(0, 0);

    if ( idx ) {
      this.count = idx;
    }

    img = this.getImage(back);

    if (img) {
        img.addEventListener('mousedown', function (e) {
            e.preventDefault();
            img.removeEventListener('mousedown', arguments.callee, true);

            this.onmousedown = '';

            if (e.button === 0) {
                self.show(null, false);
            }
            if (e.button === 2) {
                self.show(null, true);
            }
        }, true);

        this.clear();

        this.fg.appendChild(img);

    } else {
        this.stop();
        clearInterval(this.timer);
    }
    return false;
};
Gallery.prototype.timedShow = function () {
    var self = this;
    self.show(0, false);
    self.timer = setInterval(function () {
        self.show();
    }, this.delay);
};
Gallery.prototype.startAuto = function ( delay ) {
    this.delay = delay || this.delay;
    if (!this.running) {
        this.running = true;
        this.bg.style.display = 'block';
        this.timedShow();
    } else {
        return;
    }
};
Gallery.prototype.preventDefault = function(e) {
    e.preventDefault();
};
Gallery.prototype.start = function ( idx ) {
    idx = idx || 0;
    if (!this.running) {
        this.running = true;
        this.count = 0;
        this.bg.style.display = 'block';
        this.show( idx, false );
        document.body.addEventListener('contextmenu', this.preventDefault, false);
    } else {
        return;
    }
};
Gallery.prototype.stop = function () {
    if (this.running) {
        this.running = false;
        this.bg.style.display = 'none';
        this.clear();
        this.count = 0;
        document.body.removeEventListener('contextmenu', this.preventDefault, false);
    } else {
        return;
    }
};        

var sggallery = new Gallery();

var sg_helpers = {
	"addNameToImage": { 
		name: "addNameToImage", 
		desc: "Adds girl name / album name to the alt tag of an image for easy set identification from group posts, boards.",
		enabled: "true",
		fn: function() {
			var sgImages  =  document.getElementsByTagName( 'img' ), i, l, parts, name, album;

			for( i = 0, l = sgImages.length; i < l; i++ ){
				if( sgImages[i].src.indexOf("/girls/") > -1 ){
					parts = sgImages[i].src.split( '/' );
					name = parts[5];
					album = parts[7];
					sgImages[i].title = name + ' / ' + unescape( album );
				}
			}
		}
	},
	"addSetDownloadLink": {
		name: "addSetDownloadLink",
		desc: "Adds a download link for a given image set. <b>WARNING!</b> This can use HUGE amounts of ram.",
		enabled: "false",
    fn: function() {
      if ( window.location.pathname.match( /photos\/.+$/ ) || window.location.pathname.match( /albums\/.+$/ ) ) {
        var head = document.getElementsByClassName( 'launch_title' )[0],
        a = document.createElement( 'a' ),
        set_title = head.firstChild.innerText,
        girl = document.getElementsByClassName( 'name' )[0].innerText;

        a.innerText = " Create Download";
        a.style.font = 'normal 10px Arial';
        a.style.cursor = 'pointer';

        head.appendChild( a );

        a.onclick = function() {
          var set = document.getElementsByClassName( 'pic' ), i, l, images = [],
          zg, zf, count = 1, tot = 0,
          zip = new JSZip(), blob, link;

          tot = set.length;
          set_title = set_title.replace( / /g, '_' );

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
                var blob = req.response;
                fn.call( null, blob, name );
              }
            }

            req.send(null);
          }

          for ( i = 0, l = set.length; i < l; i++ ) {
            var s = set[i].firstChild.href.split( /\// ), name;
            name = s[s.length - 1];


            addData(set[i].firstChild.href, name, inc )
          }
        }
      }
    }
  },
	"addVideoDownloadLink": {
		name: "addVideoDownloadLink",
		desc: "Adds a download video link to the video description page.",
		enabled: "true",
		fn: function() {
			if ( window.location.pathname.match( /\/videos\// ) ) {
				var params = document.getElementsByTagName( 'param' ), i, l,
				si = document.getElementsByClassName( 'setInfo' ),
				a = document.createElement( 'a' );

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
					a.innerText = 'Download Video';

					si.appendChild( a );
				}
			}
		}
	},
  "replaceHTMLGallery": {
    name: "replaceHTMLGallery",
    desc: "Replaces the standard HTML gallery with SGGallery.",
    enabled: "true",
    fn: function() {
      var set, i, l, images = [];
      if ( ! sggallery.hasImages ) {
        set = document.getElementsByClassName( 'pic' );

        for ( i = 0, l = set.length; i < l; i++ ) {
          images.push( set[i].firstChild.href );
        }

        sggallery.addImages( images );
      }

      function makeLink( idx ) {
        return function( e ) {
          sggallery.start( idx );
          return false;
        };
      }

      for ( i = 0, l = set.length; i < l; i++ ) {
        set[i].firstChild.onclick = makeLink( i );
      }
    }
  },
  "addNewGalleryViewer": {
    name: "addNewGalleryViewer",
    desc: "Adds an alternative gallery viewer with Right / Left mouse button navigation.",
    enabled: "true",
    fn: function() {
      if ( window.location.pathname.match( /photos\/.+$/ ) || window.location.pathname.match( /albums\/.+$/ ) ) {

        var nav = document.getElementsByClassName( 'launch_nav' )[0],
        a = document.createElement( 'a' ),
        pho = document.getElementsByClassName( 'launch_date_photographer' )[0],
        li = document.createElement( 'li' ), i, l, set, gal, images = [];
      
        set = document.getElementsByClassName( 'pic' );

        for ( i = 0, l = set.length; i < l; i++ ) {
          images.push( set[i].firstChild.href );
        }

        sggallery = new Gallery( images );

        a.innerText = 'SGGallery';
        
        a.setAttribute('href','#');

        a.onclick = function() { 
          sggallery.start();
        };

        li.appendChild( a );
        li.className = 'gallery';

        pho.style.width = '250px';

        nav.childNodes[1].insertBefore( li, nav.childNodes[1].firstChild );
      }
    }
  },
	"addRemoveAllToFeed": {
		name: "addRemoveAllToFeed",
		desc: "Adds a remove-all button to the feeds page.",
		enabled: "true",
		fn: function() {
			if ( window.location.pathname.match( /\/my\// ) ) {
				var bt = document.getElementById( 'browserRight' ),
				btn1 = document.createElement( 'button' ),
				btn2 = document.createElement( 'button' ),
				btn3 = document.createElement( 'button' ),
				btn4 = document.createElement( 'button' ),
				sgAs;

				btn1.innerHTML = "Remove All";
				btn2.innerHTML = "Load All";
				btn3.innerHTML = "Expand All";
				btn4.innerHTML = "Expand SPOILERS";

				btn1.onclick = function() {
          var i, l;
          sgAs = document.getElementsByTagName( 'a' ); 
          for ( i = 0, l = sgAs.length; i < l; i++ ) { 
						if ( sgAs[i].getAttribute('onclick') && sgAs[i].getAttribute('onclick').match( /stopWatchingEvent/ ) ) { 
							sgAs[i].click();
						}
					}
				};

				btn2.onclick = function() {
          var i, l;
          sgAs = document.getElementsByTagName( 'a' ); 
          for ( i = 0, l = sgAs.length; i < l; i++ ) { 
						if ( sgAs[i].getAttribute('onclick') && sgAs[i].innerHTML.match( /show 10 more/ ) ) { 
							sgAs[i].click();
						}
					}
				};

				btn3.onclick = function() {
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

				btn4.onclick = function() {
          var i, l;
					sgAs = document.getElementsByTagName( 'a' );
					for ( i = 0, l = sgAs.length; i < l; i++ ) { 
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
	},
	"postButtonsEnhanced": {
		name: "postButtonsEnhanced",
		desc: "Makes enhancements to the post/comment buttons.",
		enabled: "true",
		fn: function() {
			var elems = document.getElementsByClassName('in');
			console.log(elems);
			for( var i = 0; i < elems.length; i++ ) {
				console.log('key is ' + i);
				var elem = elems[i].getElementsByTagName('a')[0];
				console.log(elem);
				console.log(elem.getAttribute('href').replace('insertFormat','enhancedInsertFormat'));
				elem.setAttribute('href', elem.getAttribute('href').replace('insertFormat','enhancedInsertFormat'));
			}
		}
	}
};

function size(obj) {
	var s = 0, k;
	for ( k in obj ) {
		if ( obj.hasOwnProperty(k)) {
			s++;
		}
	}
	return s;
}

function enhancedInsertFormat( mode, url ) {
	console.log('calling enhancedInsertFormat');
	switch(mode) {
		case 'youtube':
			//do stuff;
			break;
		default:
			insertFormat(mode,url);
	}
}

function check( name ) {
	chrome.storage.sync.get( name, function( o ) {
    var a;
    if ( size(o) === 0 && sg_helpers[name].enabled !== "false") { 
			sg_helpers[name].fn();
			sg_helpers[name].enabled = "true";
		} else {
			for ( a in o ) {
        if ( o.hasOwnProperty( a ) ) {
          if ( o[a] === "true" )  {
            sg_helpers[a].fn();
            sg_helpers[a].enabled = "true";
          } else {
            sg_helpers[a].enabled = "false";
          }
        }
			}
		}
	});
}

(function(){
	var i,l, n;
	for ( n in sg_helpers ) {
    if ( sg_helpers.hasOwnProperty( n ) ) {
      check( sg_helpers[n].name );
    }
	}
})();
