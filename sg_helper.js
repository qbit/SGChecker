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
	"addVideoDownloadLink": {
		name: "addVideoDownloadLink",
		desc: "Adds a download video link to the video description page.",
		enabled: "true",
		fn: function() {
			if ( window.location.pathname.match( /\/videos\// ) ) {
				var params = document.getElementsByTagName( 'param' ), i, l;
				var si = document.getElementsByClassName( 'setInfo' );
				var a = document.createElement( 'a' );

				console.log( params, si, a );

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
  "addNewGalleryViewer": {
    name: "addNewGalleryViewer",
    desc: "Adds an alternative gallery viewer with Right / Left mouse button navigation.",
    enabled: "true",
    fn: function() {
      if ( window.location.pathname.match( /photos/ ) || window.location.pathname.match( /albums/ ) ) {

        var Gallery = function (imgs ) {
            var i, l, img, self = this;
            this.running = false;
            
            this.delay = 3000;
            this.count = 0;

            this.bg = document.createElement('div');

            this.bg.style.width = '100%';
            this.bg.style.height = '100%';
            this.bg.style.position = 'absolute';
            this.bg.style.textAlign = 'center';
            this.bg.style.top = 0;
            this.bg.style.left = 0;
            this.bg.style.backgroundColor = 'rgba(0,0,0,0.6)';
            this.bg.style.display = 'none';
            this.bg.onclick = function() {
              self.stop();
            }

            this.fg = document.createElement('div');

            this.fg.style.width = '98%';
            this.fg.style.height = 'auto';
            this.fg.style.borderRadius = '5px';
            this.fg.style.padding = '10px';
            this.fg.style.backgroundColor = 'white';
            this.fg.style.marginTop = '30px';
            this.fg.style.display = 'inline-block';
            this.fg.style.opacity = '1.0 !important';

            this.bg.appendChild(this.fg);

            document.getElementsByTagName('body')[0].appendChild(this.bg);

            this.images = [];

            for (i = 0, l = imgs.length; i < l; i++) {
                img = new Image();
                img.src = imgs[i];
                img.style.width = "100%";
                img.style.height = "auto";
                img.style.opacity = '1.0 !important';
                img.style.boxShadow = '3px 3px 4px #000';
                img.style.borderRadius = '3px';
                this.images.push(img)
            }
            return this;
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
                this.bg.style.display = 'block'
                this.timedShow();
            } else {
                return;
            }
        };
        Gallery.prototype.start = function () {
            if (!this.running) {
                this.running = true;
                this.count = 0;
                this.bg.style.display = 'block';
                this.show();
                document.getElementsByTagName('body')[0].addEventListener('contextmenu', function (e) {
                    e.preventDefault();
                }, true);
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
                document.getElementsByTagName('body')[0].removeEventListener('contextmenu', function (e) {
                    e.preventDefault();
                }, false);
            } else {
                return;
            }
        };        

        var nav = document.getElementsByClassName( 'launch_nav' )[0],
        a = document.createElement( 'a' ),
        pho = document.getElementsByClassName( 'launch_date_photographer' )[0],
        li = document.createElement( 'li' ), gal, i, l, set, images = [];
      
        set = document.getElementsByClassName( 'pic' );

        for ( i = 0, l = set.length; i < l; i++ ) {
          images.push( set[i].firstChild.href );
        }

        gal = new Gallery( images );

        a.innerText = 'SGGallery';

        a.onclick = function() { 
          gal.start();
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
