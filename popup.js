chrome.storage.onChanged.addListener(function(changes, namespace) {
 document.getElementById(currentUrl).innerHTML = changes.activeUrl;});