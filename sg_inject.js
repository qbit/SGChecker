// iterate through the list of plugins and determin if they should be
// injected

var p, plugins = {
	// "addNameToImage": { 
	// 	name: "addNameToImage", 
	// 	desc: "Adds girl name / album name to the alt tag of an image for easy set identification from group posts, boards.",
	// 	enabled: "true"
	// },
	// "addSetDownloadLink": {
	// 	name: "addSetDownloadLink",
	// 	desc: "Adds a download link for a given image set. <b>WARNING!</b> This can use HUGE amounts of ram.",
	// 	enabled: "false"
	// },
	"loadMyGroups": {
		name: "loadMyGroups",
		desc: "Make clicking 'GROUPS' always load 'MY GROUPS' instead of 'PUBLIC GROUPS",
		enabled: "true"
	}
	// "replaceVideoPlayer": {
	// 	name: "replaceVideoPlayer",
	// 	desc: "Replaces the flash video player with HTML5 video tag. ( allowing for full screen! )",
	// 	enabled: "true"
	// },
	// "addVideoDownloadLink": {
	// 	name: "addVideoDownloadLink",
	// 	desc: "Adds a download video link to the video description page. ( <b>does not run if replaceVideoPlayer is active!</b> )",
	// 	enabled: "true"
	// },
	// "replaceHTMLGallery": {
	// 	name: "replaceHTMLGallery",
	// 	desc: "Replaces the standard HTML gallery with SGGallery.",
	// 	enabled: "false"
	// },
	// "addNewGalleryViewer": {
	// 	name: "addNewGalleryViewer",
	// 	desc: "Adds an alternative gallery viewer with Right / Left mouse button navigation.",
	// 	enabled: "true",
	// 	options: {
	// 		"resize": {
	// 			"id" : "enResize",
	// 			"name": "Enable Resize",
	// 			"desc": "Automatically resize images based on screen size",
	// 			"enabled": true
	// 		},
	// 		"overlay": {
	// 			"id" : "enOverlay",
	// 			"name": "Enable Overlay",
	// 			"desc": "Enable the image overlay that displays next / previous / <3",
	// 			"enabled": true
	// 		},
	// 		"replacePopup": {
	// 			"id" : "enReplacePopup",
	// 			"name": "Replace Popup",
	// 			"desc": "Replace the default image popup viewer for posts",
	// 			"enabled": true
	// 		}
	// 	}
	// },
	// "addRemoveAllToFeed": {
	// 	name: "addRemoveAllToFeed",
	// 	desc: "Adds a remove-all button to the feeds page.",
	// 	enabled: "true"
	// },
	// "postButtonsEnhanced": {
	// 	name: "postButtonsEnhanced",
	// 	desc: "Makes enhancements to the post/comment buttons.",
	// 	enabled: "true"
	// },
	// "addSubMenus": {
	// 	name: "addSubMenus",
	// 	desc: "Adds submenus to the main menus.",
	// 	enabled: "true"
	// }
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

function inject( file ) {
	var s = document.createElement('script');
	s.src = chrome.extension.getURL(file);
	(document.head||document.documentElement).appendChild(s);
}

function load_plugin( plugin, options ) {
	if ( ! window.location.href.match( 'chrome-extension' ) ) {
		os = document.createElement('script'), 
		o = 'var ' + plugin.name;

		o += ' = ' + JSON.stringify(options);

		os.innerHTML = o;

		inject( plugin.name + '.js' );

		(document.head||document.documentElement).appendChild(os);
	}
}

function check( plugin ) {
  var name = plugin.name;
  chrome.storage.sync.get( name, function( o ) {
    var a;
    if ( size(o) === 0 && plugins[name].enabled !== "false") { 
      if ( plugins[name].options ) {
        check_opts( plugin, function( options ) {
          set_opt( plugins[name], options );
          // sg_helpers[name].fn( options );
          // sg_helpers[name].enabled = "true";
	  load_plugin( plugins[name], options );
        });
      } else {
        // sg_helpers[name].fn( {} );
        // sg_helpers[name].enabled = "true";
	  load_plugin( plugins[name], {} );
      }
    } else {
      for ( a in o ) {
        if ( o.hasOwnProperty( a ) ) {
          if ( o[a] === "true" )  {
            if ( plugins[a].options ) {
              check_opts( plugin, function( options ) {
                set_opt( plugins[name], options );

		  load_plugin( plugins[name], options );

                // sg_helpers[name].fn( options );
                // sg_helpers[name].enabled = "true";
              });
            } else {
              // plugins[a].fn( {} );
              plugins[a].enabled = "true";
		  load_plugin( plugins[a], {} );
            }

          } else {
            plugins[a].enabled = "false";
          }
        }
      }
    }
  });
}

inject('Gallery.js');
// inject('jszip.js');

for ( p in plugins ) {
	check( plugins[p] );
}

