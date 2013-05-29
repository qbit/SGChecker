var menus = document.getElementsByClassName('menuTop')[0].getElementsByTagName('li');
var links = [
	[{"href": "/girls/#filter:true/filter:active/mode:suicidegirls","label":"SUICIDE GIRLS"},{"href":"/girls/#filter:true/mode:hopefuls","label":"HOPEFULS"}],
	[{"href":"/albums/girls/","label":"SETS OF THE DAY"},{"href":"/albums/hopefuls/","label":"MEMBER REVIEW"},{"href":"/albums/girls/staff/","label":"STAFF PICKS"},{"href":"/albums/remix/","label":"REMIXES"},{"href":"/albums/misc/","label":"MISC"},{"href":"/albums/hopefuls/queue/","label":"MR QUEUE"}],
	[{"href":"/videos/girls/","label":"SUICIDEGIRLS"},{"href":"/videos/members/","label":"MEMBERS"}],
	[],
	[],
	[{"href":"/shop/all/","label":"ALL ITEMS"},{"href":"/shop/women/","label":"WOMEN'S CLOTHES"},{"href":"/shop/men/","label":"MEN'S CLOTHES"},{"href":"/shop/media/","label":"BOOKS, CD &amp; DVD"},{"href":"/shop/accessories/","label":"ACCESSORIES"}]
];

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

