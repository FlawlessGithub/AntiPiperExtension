try {
    var urlList = ["https://www.y8.com/", "https://www.newgrounds.com/"];

    console.log("\n");
    console.log("%c Welcome to the console! Don't fuck it up.", "background: #5500ff; color: #ffffff");
    console.log("\n");


    function removeBlockedUrls() {
        for (i in urlList) {
            chrome.history.deleteUrl({
                "url": urlList[i]
            });
            console.info(urlList[i] + "and all identical URLs have been removed from the browser history.");
        };
        console.log("%c History deletion complete. All blocked URLs have been removed from the browser history.", "background: #00dd00")
        console.log(""); // Dead space for readability
    };

    chrome.tabs.onUpdated.addListener(function(tabId) { // Detect basically everything tab-related. New tabs, updates to the website on an existing tab, changing site on a tab. Good catch-all.
        console.info("%c Tab ID #" + tabId + " updated. Deleting blocked URLs from history.", "background: #00dddd");
        removeBlockedUrls();

    });

    chrome.tabs.onRemoved.addListener(function(tabId) { // Detect when a tab is closed, seemingly the only thing onUpdated doesn't cover.
        console.info("%c Tab ID #" + tabId + " closed. Deleting blocked URLs from history.", "background: #00ddff; color: #ffffff");
        removeBlockedUrls();

    });


} catch (error) {
    console.error(error);
}