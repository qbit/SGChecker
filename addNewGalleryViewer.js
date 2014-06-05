if (window.location.pathname.match(/\/album\/.+$/)) {
      function getImages(tag, parClass) {
	    var imgs = [], eles = document.getElementsByTagName(tag), i, l;

	    for (i = 0, l = eles.length; i < l; i++) {
		      if (eles[i].parentNode.className.match(parClass)) {
			     imgs.push(eles[i].getAttribute('href'));
		      }
	       }

	       return imgs;
        }
      
        var nav = document.getElementsByClassName('button icon-share has-bar')[0],
	    parent = nav.parentNode,
	    options = addNewGalleryViewer,
        a = document.createElement( 'a' ),
        //pho = document.getElementsByClassName( 'photographer' )[0],
        li = document.createElement( 'li' ), i, l, set, gal, images = [], pics = {},
        overlay_fn = function( overlay, gallery ) {
          var back = document.createElement( 'div' ),
            forward = document.createElement( 'div' ),
            addFav = document.createElement( 'div' ),
            resize = document.createElement( 'div' );

          back.innerText = '⬅';
          forward.innerText = '➡';
          //addFav.innerText = '♥';
          resize.innerText = '☒';

          back.style.float = 'left';
          forward.style.float = 'left';
          //addFav.style.float = 'left';
          resize.style.float = 'left';

          back.style.color = 'white';
          forward.style.color = 'white';
          //addFav.style.color = '#b7115c';
          resize.style.color = 'white';

          back.style.fontSize = '4em';
          forward.style.fontSize = '4em';
          //addFav.style.fontSize = '4em';
          resize.style.fontSize = '4em';

          back.style.cursor = 'pointer';
          forward.style.cursor = 'pointer';
          //addFav.style.cursor = 'pointer';
          resize.style.cursor = 'pointer';

          back.title = 'back';
          forward.title = 'forward';
          //addFav.title = 'Add to favorite images';
          resize.title = 'Toggle fit to page';

          back.style.opacity = '0.1';
          forward.style.opacity = '0.1';
          //addFav.style.opacity = '0.1';
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

          /*if ( window.location.pathname.match( /girls\/.*\/photos/ ) ) {
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
          };*/

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
          //overlay.appendChild( addFav );
          overlay.appendChild( resize );
          overlay.appendChild( forward );
        },

        opts = {
            overlay: true,
            resize: true,
        };
    
        set = document.getElementsByClassName( 'pic' );

        // for ( i = 0, l = set.length; i < l; i++ ) {
        //     images.push( set[i].firstChild.href );
        //     pics[set[i].firstChild.href] = set[i].parentNode.id.split(/_/)[1];
        // }
	    //set = global.data.images;
	    //for( i = 0, l = set.length; i < l; i++ ) {
            //images.push( set[i].src );
            // pics[set[i].src] = set[i].id.split(/_/)[1];
	    //}

        images = getImages('a', 'photo-container');

        if ( options['addNewGalleryViewer_enOverlay'] === "false" ) {
            opts.overlay = false;
        }

        if ( options['addNewGalleryViewer_enResize'] === "false" ) {
            opts.resize = false;
        }


        sggallery = new Gallery( images, overlay_fn, opts );

        a.innerText = '';
        
        a.setAttribute('href','#');
        a.className = "button icon-photos has-bar";
        a.style.borderLeft = "1px solid #ccc";

        a.onclick = function() { 
            sggallery.start();
        };

        //li.appendChild( a );
        //li.className = 'gallery';

        //pho.style.width = '250px';
        parent.insertBefore(a, nav);
        //nav.insertBefore( li, nav.childNodes[2].firstChild );
        //document.getElementById('sg_img_a').insertBefore(li, document.getElementsById('sg_img_a'));
        //nav.childNodes[2].insertBefore(li, nav.childNodes[2].firstChild);
    }

