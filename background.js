try {
    var urlList = ["https://www.y8.com/", "https://www.newgrounds.com/"];

    console.log("Welcome to the console! Don't fuck it up.\n\n");

    // Search history chronologically w/o a filter, but only take 1 entry. Callback function parses raw array.

    function checkUrl(url) {
        for (let blockedUrl of urlList) {
            if (url == blockedUrl) {
                console.log("\nGiven URL: " + url + " matched with blocked URL: " + blockedUrl + "");
                console.log();
                return true;
                break;
            } else {
                console.log("Given URL: " + url + " did not match blocked URL: " + blockedUrl);
            }
        }
        console.log("\nGiven URL: " + url + " did not match any blocked URLs:");
        console.log(urlList);
    }


    chrome.history.search({
        text: '',
        maxResults: 1
    }, function(historyEntry) {
        console.log("Latest website in browsing history fetched:");
        console.log(historyEntry[0].url + "\n\n"); // Dead space included for improved console readability.


        if (checkUrl(historyEntry[0].url) == true) {
            chrome.history.deleteUrl({
                "url": historyEntry[0].url
            });
            console.log("\n" + historyEntry[0].url + " and all identical URLs have been deleted from the browser history.");
        }
    });

    //checkUrl(latestEntry[0].url);




} catch (error) {
    console.error(error);
}