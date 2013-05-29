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


var elems = document.getElementsByClassName('in');
for( var i = 0; i < elems.length; i++ ) {
	var elem = elems[i].getElementsByTagName('a')[0];
	elem.setAttribute('href', elem.getAttribute('href').replace('insertFormat','enhancedInsertFormat'));
}
