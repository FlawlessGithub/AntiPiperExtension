try {	

	var blockedUrls = [];

		async function getCurrentTab() {
		let queryOptions = { active: true, currentWindow: true };
		let [tab] = await chrome.tabs.query(queryOptions);
		return tab;
		}
	


    console.log("\n");
    console.log("%c Welcome to the console! Don't fuck it up.", "background: #5500ff; color: #ffffff");
    console.log("\n");



	function getActiveTab() {
	console.log("%c Fetching new URL...", "background: #00dddd")
	chrome.tabs.query({
        active: true,
        currentWindow: true
	}, function (tabs) {
		console.log(tabs[0].url)
		chrome.storage.sync.set({"activeUrl": tabs[0].url}, function(){})
		});}

    function removeBlockedUrls() {
        chrome.storage.sync.get(["blockedUrls"], function(result){var blockedUrls = result;}); // Update blocked URL list.
		for (i in blockedUrls) {
            chrome.history.deleteUrl({
                "url": blockedUrls[i]
            });
            console.info(blockedUrls[i] + " and all identical URLs have been removed from the browser history.");
        };
        console.log("%c History deletion complete. All blocked URLs have been removed from the browser history.", "background: #00dd00")
        console.log(""); // Dead space for readability
    };

    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) { // Detect basically everything tab-related. New tabs, updates to the website on an existing tab, changing site on a tab. Good catch-all.
        
		if(changeInfo.url) {
		console.info("%c URL of Tab ID #" + tabId + " updated. Deleting blocked URLs from history.", "background: #00dddd");
        getActiveTab();
		removeBlockedUrls();
		}

    });

    chrome.tabs.onActivated.addListener(function() { // Detect when a tab is closed, seemingly the only thing onUpdated doesn't cover.
        getCurrentTab();
		
		
    });


} catch (error) {
    console.error(error);
}