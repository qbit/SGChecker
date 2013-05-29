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

