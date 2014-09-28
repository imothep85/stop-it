const {classes: Cc, interfaces: Ci, utils: Cu, results: Cr} = Components;
Cu.import('resource://gre/modules/Services.jsm');

var urls_block = [ //if urls ontain any of these elements they will be blocked or redirected, your choice based on code in observer line 17
'googleads.g.doubleclick.net',
'exoclick.com',
'etc...'];

var observers = {
    'http-on-modify-request': {
        observe: function (aSubject, aTopic, aData) {
            console.info('http-on-modify-request: aSubject = ' + aSubject + ' | aTopic = ' + aTopic + ' | aData = ' + aData);
            var httpChannel = aSubject.QueryInterface(Ci.nsIHttpChannel);
            var requestUrl = httpChannel.URI.spec;
            for (var i=0; i<urls_block.length; i++) {
             if (requestUrl.indexOf(urls_block[i]) > -1) {
              //httpChannel.cancel(Cr.NS_BINDING_ABORTED); //this aborts the load
              httpChannel.redirectTo(Services.io.newURI('data:text,url_blocked', null, null)); //can redirect with this line, if dont want to redirect and just block, then uncomment this line and comment out line above (line 17)
              break;
			 }
            }
        },
        reg: function () {
            Services.obs.addObserver(observers['http-on-modify-request'], 'http-on-modify-request', false);
        },
        unreg: function () {
            Services.obs.removeObserver(observers['http-on-modify-request'], 'http-on-modify-request');
        }
    }
};

function install() {}

function uninstall() {}

function startup() {
 for (var o in observers) {
 	observers[o].reg();
 }
}
 
function shutdown(aData, aReason) {
 if (aReason == APP_SHUTDOWN) return;
 
 for (var o in observers) {
 	observers[o].unreg();
 }
}
