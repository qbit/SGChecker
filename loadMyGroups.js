var grps = document.getElementsByClassName('icon-groups-nav'), i, l;
for (i = 0, l = grps.length; i < l; i++) {
	if (grps[i].getAttribute('href') === '/groups/') {
		grps[i].setAttribute('href', '/groups/my/recent/');
	}
}
