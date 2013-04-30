/*global Image, document, scroll, unescape, window, chrome */
var Gallery = function ( imgs, overlay, options ) {
    if( !document.body )
        return;
    var i, l, img, self = this;
    this.running = false;

    imgs = imgs || [];
    
    this.delay = 3000;
    this.count = 0;

    this.overlay_fn = overlay || function() {
      return;
    };

    this.options = {};
    for ( i in options ) {
      if ( options.hasOwnProperty( i ) ) {
        this.options[i] = options[i];
      }
    }

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

    window.addEventListener('resize', function() {
        self.show(null, -1);
    });

    return this;
};
Gallery.prototype.addImages = function( imgs ) {
    var i, l, img;
    if ( imgs.length > 0 ) {
        this.hasImages = true;
    }
    for (i = 0, l = imgs.length; i < l; i++) {
        // img = new Image();
        img = document.createElement('img');
        img.src = imgs[i];
        img.style.width = "100%";
        img.style.height = "auto";
        img.style.opacity = '1.0 !important';
        img.style.boxShadow = '3px 3px 4px #000';
        img.style.borderRadius = '3px';
        this.images.push(img);
    }
};
Gallery.prototype.overlay = function( ) {
  var i, l, c;
  this.has_overlay = true;
  if ( this.overlay_ele && this.overlay_ele.parentNode ) {
    this.overlay_ele.parentNode.removeChild( this.overlay_ele );
  }

  this.overlay_ele = document.createElement( 'div' );

  this.fg.appendChild( this.overlay_ele );
  this.overlay_fn( this.overlay_ele, this );
  // fn.call( null, this.overlay_ele );
};
Gallery.prototype.clear = function () {
    var i, l, c;
    for (i = 0, l = this.fg.children.length; i < l; i++) {
      if ( this.fg.children[i] ) {
        c = this.fg.children[i];
        c.parentNode.removeChild(c);
      }
    }
};
Gallery.prototype.getImage = function (rev) {
    if ( rev === false )
        this.count++;
    if ( rev === true )
        this.count--;
    // If it's neither true/false, return current image
    return this.images[this.count - 1] || null;
};
Gallery.prototype.show = function (idx, back) {
    var self = this,
        img, scaleX, scaleY, scale = 1, marginAdjust = 80;

    scroll(0, 0);

    if ( idx ) {
        this.count = idx;
    }

    img = this.getImage(back);
    
    this.current_img = img;

    if (img) {
        document.body.addEventListener('keyup', function (e) {
            e.preventDefault();
            document.body.removeEventListener('keyup', arguments.callee, true);
            var bt = e.keyCode || e.charCode;
            if (bt === 39) {
                self.show(null, false);
            }
            if (bt === 37) {
                self.show(null, true);
            }
            if (bt === 27) {
                self.stop();
            }
        }, true);
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

        if ( this.options.resize ) {
            scaleX = ( (document.body.clientWidth-marginAdjust) < img.naturalWidth ? (document.body.clientWidth-marginAdjust)/img.naturalWidth : 1);
            scaleY = ( (document.body.clientHeight-marginAdjust) < img.naturalHeight ? (document.body.clientHeight-marginAdjust)/img.naturalHeight : 1);

            if( scaleX < 1 || scaleY < 1 ) {
                scale = (scaleX < scaleY ? scaleX : scaleY);
            }
        }
        img.style.height = (img.naturalHeight*scale)+'px';
        img.style.width = (img.naturalWidth*scale)+'px';

        this.clear();


        this.fg.appendChild(img);

        if ( this.options.overlay ) { 
          this.overlay( img );
        }
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
        fn: function( options ) {
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
    fn: function( options ) {
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
    "replaceVideoPlayer": {
        name: "replaceVideoPlayer",
        desc: "Replaces the flash video player with HTML5 video tag. ( allowing for full screen! )",
        enabled: "true",
        fn: function( options ) {
            if ( window.location.pathname.match( /\/videos\// ) ) {
                var params = document.getElementsByTagName( 'param' ), i, l,
		curVid = document.getElementById('player'),
                lc = document.getElementById( 'leftCol' ),
		vid = document.createElement('video' );

		vid.style.width = '100%';
		vid.style.height = '100%';

		vid.setAttribute( 'controls', 'controls' );


                for ( i = 0, l = params.length; i < l; i++ ) {
                    if ( params[i] && params[i].name && params[i].name === 'href' ) {
                        params = params[i];
                    }
                }

                if ( ! params.length ) { 
			curVid.remove();
                    vid.src = params.getAttribute( 'value' );

		    lc.style.marginTop = '6px';
		    lc.style.height = '330px';
		    lc.style.borderRadius = '5px';
		    lc.style.backgroundColor = 'black';
		    lc.style.backgroundImage = 'none';

                    lc.appendChild( vid );
                }
            }
        }
    },
    "addVideoDownloadLink": {
        name: "addVideoDownloadLink",
        desc: "Adds a download video link to the video description page. ( <b>does not run if replaceVideoPlayer is active!</b> )",
        enabled: "true",
        fn: function( options ) {
            if ( window.location.pathname.match( /\/videos\// ) ) {
                var params = document.getElementsByTagName( 'param' ), i, l,
                si = document.getElementsByClassName( 'setInfo' ),
                a = document.createElement( 'a' );

		if ( params ) {
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
        }
    },
"replaceHTMLGallery": {
    name: "replaceHTMLGallery",
    desc: "Replaces the standard HTML gallery with SGGallery.",
    enabled: "true",
    fn: function( options ) {
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
    options: {
      "resize": {
        "id" : "enResize",
        "name": "Enable Resize",
        "desc": "Automatically resize images based on screen size",
        "enabled": true
      },
      "overlay": {
        "id" : "enOverlay",
        "name": "Enable Overlay",
        "desc": "Enable the image overlay that displays next / previous / <3",
        "enabled": true
      },
      "replacePopup": {
        "id" : "enReplacePopup",
        "name": "Replace Popup",
        "desc": "Replace the default image popup viewer for posts",
        "enabled": true
      }
    },
    fn: function( options ) {
    if ( window.location.pathname.match( /photos\/.+$/ ) || window.location.pathname.match( /albums\/.+$/ ) ) {

        var nav = document.getElementsByClassName( 'launch_nav' )[0],
        a = document.createElement( 'a' ),
        pho = document.getElementsByClassName( 'launch_date_photographer' )[0],
        li = document.createElement( 'li' ), i, l, set, gal, images = [], pics = {},
        overlay_fn = function( overlay, gallery ) {
          var back = document.createElement( 'div' ),
            forward = document.createElement( 'div' ),
            addFav = document.createElement( 'div' ),
            resize = document.createElement( 'div' );

          back.innerText = '⬅';
          forward.innerText = '➡';
          addFav.innerText = '♥';
          resize.innerText = '☒';

          back.style.float = 'left';
          forward.style.float = 'left';
          addFav.style.float = 'left';
          resize.style.float = 'left';

          back.style.color = 'white';
          forward.style.color = 'white';
          addFav.style.color = '#b7115c';
          resize.style.color = 'white';

          back.style.fontSize = '4em';
          forward.style.fontSize = '4em';
          addFav.style.fontSize = '4em';
          resize.style.fontSize = '4em';

          back.style.cursor = 'pointer';
          forward.style.cursor = 'pointer';
          addFav.style.cursor = 'pointer';
          resize.style.cursor = 'pointer';

          back.title = 'back';
          forward.title = 'forward';
          addFav.title = 'Add to favorite images';
          resize.title = 'Toggle fit to page';

          back.style.opacity = '0.1';
          forward.style.opacity = '0.1';
          addFav.style.opacity = '0.1';
          resize.style.opacity = '0.1';

          back.onclick = function( e ) {
            e.stopPropagation();
            gallery.show(null, true);
          };

          forward.onclick = function( e ) {
            e.stopPropagation();
            gallery.show(null, false);
          };
          
          resize.onclick = function( e ) {
            e.stopPropagation();
            
            // toggle resize option
            gallery.options.resize = !gallery.options.resize;
            gallery.show(null, -1);
          };

          if ( window.location.pathname.match( /girls\/.*\/photos/ ) ) {
            addFav.onclick = function( e ) {
              var p, url = 'http://suicidegirls.com/xml/pics/addFave/';
              e.stopPropagation();
              p = imageToSGArray( gallery.current_img, pics );

              ajax( url + p[8], function( data ) {
                if ( data.match( '<success>1</success>' ) ) {
                  alert( 'Added!' );
                } else {
                  alert( 'Something went wrong!' );
                }
              });
            };
          } else {
            addFav.style.color = '#ccc';
            addFav.title = null;
            addFav.onclick = function( e ) {
              e.stopPropagation();
            }
          }

          addFav.onmouseover = function(e) {
            var that = this,
            big = false;
            gallery.throbber = setInterval( function() {
              if ( !big ) {
                that.style.fontSize = '3.9em';
              } else {
                that.style.fontSize = '4em';
              }

              big = !big;
            },300);
          };

          addFav.onmouseout = function(e) {
            clearInterval( gallery.throbber );
            this.style.fontSize = '4em';
          };

          overlay.style.backgroundColor = 'black';
          overlay.style.padding = '5px';
          overlay.style.width = '160px';
          overlay.style.height = '50px';
          overlay.style.borderRadius = '5px';
          overlay.style.position = 'fixed';
          overlay.style.top = '4em';
          overlay.style.left = '50%';
          overlay.style.marginLeft = '-80px';
          overlay.style.whiteSpace = 'nowrap';

          overlay.style.backgroundColor = 'rgba(0,0,0,0.1)';

          overlay.onmouseover = function(e) {
            var i, l;
            this.style.backgroundColor = 'rgba(0,0,0,0.7)';
            for ( i = 0, l = this.children.length; i < l; i++ ) {
              // this.children[i].style.display = 'block';
              this.children[i].style.opacity = '1';
            }
          };

          overlay.onmouseout = function(e) {
            var i, l;
            this.style.backgroundColor = 'rgba(0,0,0,0.1)';
            for ( i = 0, l = this.children.length; i < l; i++ ) {
              // this.children[i].style.display = 'none';
              this.children[i].style.opacity = '0.01';
            }
          };

          overlay.appendChild( back );
          overlay.appendChild( addFav );
          overlay.appendChild( resize );
          overlay.appendChild( forward );
        },

        opts = {
            overlay: true,
            resize: true,
        };
    
        set = document.getElementsByClassName( 'pic' );

        for ( i = 0, l = set.length; i < l; i++ ) {
            images.push( set[i].firstChild.href );
            pics[set[i].firstChild.href] = set[i].parentNode.id.split(/_/)[1];
        }

        if ( options['addNewGalleryViewer_enOverlay'] === "false" ) {
            opts.overlay = false;
        }

        if ( options['addNewGalleryViewer_enResize'] === "false" ) {
            opts.resize = false;
        }


        sggallery = new Gallery( images, overlay_fn, opts );

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
        fn: function( options ) {
            if ( window.location.pathname.match( /\/my\/$/ ) ) {
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
        fn: function( options ) {
            var elems = document.getElementsByClassName('in');
            for( var i = 0; i < elems.length; i++ ) {
                var elem = elems[i].getElementsByTagName('a')[0];
                elem.setAttribute('href', elem.getAttribute('href').replace('insertFormat','enhancedInsertFormat'));
            }
            var scriptElem = document.createElement('script');
            scriptElem.innerHTML = enhancedInsertFormat.toString();
            document.body.appendChild(scriptElem);
        }
    },
    "addSubMenus": {
        name: "addSubMenus",
        desc: "Adds submenus to the main menus.",
        enabled: "true",
        fn: function( options ) {
            var menus = document.getElementsByClassName('menuTop')[0].getElementsByTagName('li');
            var links = [[{"href": "/girls/#filter:true/filter:active/mode:suicidegirls","label":"SUICIDE GIRLS"},{"href":"/girls/#filter:true/mode:hopefuls","label":"HOPEFULS"}],
                [{"href":"/albums/girls/","label":"SETS OF THE DAY"},{"href":"/albums/hopefuls/","label":"MEMBER REVIEW"},{"href":"/albums/girls/staff/","label":"STAFF PICKS"},{"href":"/albums/remix/","label":"REMIXES"},{"href":"/albums/misc/","label":"MISC"},{"href":"/albums/hopefuls/queue/","label":"MR QUEUE"}],
                [{"href":"/videos/girls/","label":"SUICIDEGIRLS"},{"href":"/videos/members/","label":"MEMBERS"}],
                [],
                [],
                [{"href":"/shop/all/","label":"ALL ITEMS"},{"href":"/shop/women/","label":"WOMEN'S CLOTHES"},{"href":"/shop/men/","label":"MEN'S CLOTHES"},{"href":"/shop/media/","label":"BOOKS, CD &amp; DVD"},{"href":"/shop/accessories/","label":"ACCESSORIES"}]];

            for( var i = 0; i < menus.length; i++ ) {
                var elem = menus[i];
                elem.linkRef = links[i];
                elem.addEventListener('mouseover', function(e){
                    if( oldMenu = document.getElementById('sgc_sub_menu'))
                        oldMenu.parentNode.removeChild(oldMenu);
                    var target = ( e.target.tagName == 'A' ? e.target.parentNode : e.target );
                    if( target.linkRef.length == 0 ) // If this menu doesn't have a submenu, exit
                        return;
                    var div = document.createElement('div');
                    div.id = 'sgc_sub_menu';
                    div.style.width = '100px';
                    div.style.backgroundColor = '#efefd7';
                    div.style.position = 'absolute';
                    div.style.left = target.offsetLeft+'px';
                    div.style.top = (target.offsetTop + target.clientHeight) + 'px';
                    for( var n = 0; n < target.linkRef.length; n++ ) {
                        var link = target.linkRef[n];
                        var a = document.createElement('a');
                        a.href = link.href;
                        a.innerHTML = link.label;
                        a.style.margin = '3px';
                        a.style.display = 'block';
                        div.appendChild(a);
                    }
                    div.addEventListener('mouseout', function(e) {
                        var elem = document.getElementById('sgc_sub_menu');
                        if( elem == null ) {
                            return; // if the menu doesn't exist, exit
                        }
                        var pn = e.relatedTarget;
                        do {
                            if( pn == elem ) {
                                return;
                            } else if ( pn.tagName == 'BODY') {
                                elem.parentNode.removeChild(elem);
                                return;
                            }
                        } while( pn = pn.parentNode );
                    }, false);

                    document.body.appendChild(div);
                }, false);
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

function enhancedInsertFormat( mode, method ) {
    if(!method)
        method="insertTarget"
    method=$(method);
    var c=getSelectedText(method);
    switch(mode) {
        case 'youtube':
            a=c?c:a=prompt("Enter the address of the YouTube page containing the video you'd like to embed","");
            if(a!==null){
                a = a.replace(/(^.*\?)(.*)(v=[^&]*)(.*)/,'$1$3')
                  .replace( /^https/, 'http' );
                f="[YOUTUBE]"+a+"[/YOUTUBE]";//do stuff;
            }
            break;
        default:
            insertFormat(mode,method);
            return;
    }
    if(f)
        insertAtCursor(method,f);
    g.focus();
}

function imageToSGArray( img, pics ) {
  var a = [], p = img.src.split( '/' );
  a[0] = img.src;
  a[1] = img.height;
  a[2] = img.width;
  a[3] = '';
  a[4] = '';
  a[5] = '';
  a[6] = '';
  a[7] = '';
  a[8] = pics[img.src]; // need to figure out where to get this!
  a[9] = '/girls/' + p[5];
  return a;
}

function ajax( url, fn ) {
    var req = new XMLHttpRequest();
    req.open('GET', url, true);

    req.onreadystatechange = function( data ) {
      if ( req.readyState === 4 && req.status === 200 ) { 
          fn.call( null, req.responseText );
      }
    }

    req.send(null);
}

function check_opts( plugin, fn ) {
  var o, opt, q = size( plugin.options ), count = 0, opt = {}, timer, 
  plugin_opts = plugin.options,
  f = function( name ) {
    chrome.storage.sync.get( name, function( option ) {
      opt[name] = option[name] || "true";
      count++;
    });
  };

  for ( o in plugin_opts ) {
    if ( plugin_opts.hasOwnProperty( o ) ) {
      f( plugin.name + '_' + plugin_opts[o].id );
    }
  }
  timer = setInterval( function() {
    if ( count === q ) {
      clearInterval( timer );
      fn.call( null, opt );
    }
  }, 50 );
}

function set_opt( helper, options ) {
  var o, p;

  for ( o in helper.options ) {
    if ( helper.options.hasOwnProperty( o ) ) {
      p = helper.name + '_' + helper.options[o].id;
      if ( options[ p ] ) {
        helper.options[ o ].enabled = options[p];
      }
    }
  }
}

function check( plugin ) {
  var name = plugin.name;
  chrome.storage.sync.get( name, function( o ) {
    var a;
    if ( size(o) === 0 && sg_helpers[name].enabled !== "false") { 
      if ( sg_helpers[name].options ) {
        check_opts( plugin, function( options ) {
          set_opt( sg_helpers[name], options );
          sg_helpers[name].fn( options );
          sg_helpers[name].enabled = "true";
        });
      } else {
        sg_helpers[name].fn( {} );
        sg_helpers[name].enabled = "true";
      }
    } else {
      for ( a in o ) {
        if ( o.hasOwnProperty( a ) ) {
          if ( o[a] === "true" )  {
            if ( sg_helpers[a].options ) {
              check_opts( plugin, function( options ) {
                set_opt( sg_helpers[name], options );
                sg_helpers[name].fn( options );
                sg_helpers[name].enabled = "true";
              });
            } else {
              sg_helpers[a].fn( {} );
              sg_helpers[a].enabled = "true";
            }

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
            check( sg_helpers[n] );
        }
    }
})();
