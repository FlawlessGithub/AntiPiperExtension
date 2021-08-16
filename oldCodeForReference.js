try {
    /*   chrome.storage.local.get(["blockList"], function(blockList){
	var blockedDomainList = blockList.blockList;
});
	chrome.storage.onChanged.addListener(function() {
	blockedDomainList = changes.blockedDomainList.newValue;
	});
*/
    console.log("\n");
    console.log("%c Welcome to the console! Don't fuck it up.", "background: #5500ff; color: #ffffff");
    console.log("\n");

    function checkUrl(url) {
        for (let blockedDomain of blockedDomainList) {
            if (url.startsWith(blockedDomain)) {
                console.log("\nGiven URL: " + url + " matched with blocked URL: " + blockedUrl + "\n")
                return true;
                break;
            } else {
                console.log("Given URL: " + url + " did not match blocked URL: " + blockedUrl);
            }
        }
        console.log("\nGiven URL: " + url + " did not match any blocked URLs:");
        console.log(blockedDomainList);
    }


    chrome.history.search({
        text: '',
        maxResults: 25
    }, function(historyEntry) {
        console.log("Latest 25 websites in browsing history fetched.");
    });

    function extractDomain(url) {
        let bananaSplit = url.split("/");
        return bananaSplit[0] + "//" + bananaSplit[2];
    }


    async function getCurrentTab() {
        let queryOptions = {
            active: true,
            currentWindow: true
        };
        let [tab] = await chrome.tabs.query(queryOptions);
        console.log(tab.url);
        let domain = extractDomain(tab.url);
        chrome.storage.sync.set({
            "currentDomain": domain
        }, function() {});
        console.log()
        return tab.url;
    }

    chrome.tabs.onActivated.addListener(function() {
        console.log(getCurrentTab());


    });

    function removeBlockedUrls() {
        for (let url of blockedDomainList) {
            chrome.history.deleteUrl({
                "url": url
            });
            console.info(url + "and all identical URLs have been removed from the browser history.");
        };
        console.log("%c History deletion complete. All blocked URLs have been removed from the browser history.", "background: #00dd00")
        console.log(""); // Dead space for readability
    };

    chrome.tabs.onUpdated.addListener(function(tabId) { // Detect basically everything tab-related. New tabs, updates to the website on an existing tab, changing site on a tab. Good catch-all.
        console.info("%c Tab ID #" + tabId + " updated. Deleting blocked URLs from history.", "background: #00dddd");
        removeBlockedUrls();

    });

    //chrome.tabs.onRemoved.addListener(function(tabId) { // Detect when a tab is closed, seemingly the only thing onUpdated doesn't cover.
    //    console.info("%c Tab ID #" + tabId + " closed. Deleting blocked URLs from history.", "background: #00ddff; color: #ffffff");
    //    removeBlockedUrls();

    //});


} catch (error) {
    console.error(error);
}