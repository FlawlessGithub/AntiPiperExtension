async function getBlockList() { // Returns a promise containing the blockList array.
    return new Promise((resolve, reject) => { // Stealing & modifying Google's code just works.
        // Google: Asynchronously fetch all data from storage.sync.
        chrome.storage.sync.get(["blockList"], (items) => {
            // Google: Pass any observed errors down the promise chain.
            if (chrome.runtime.lastError) {
                return reject("Google's own code broke in Chrome lmao check getBlockList(): " + chrome.runtime.lastError);
            }

            items = items["blockList"]; // Is there a better way to do this?
            if (Array.isArray(items) != true) { // If you fetched literally fucking nothing, make it an empty list, bonehead.
                items = [];
            }
            console.log("Fetched blockList.");
            console.log(items);
            resolve(items); // This is basically a return but for promises.
        });
    });
}

async function getSearchHistory(amount) {
    if (amount > 100) {
        amount = 100;
    } // API returns sub-arrays of 100 if >100 requested, breaking the program.
    let searchOptions = {
        text: '',
        maxResults: amount,
        startTime: 0 // Set start date for history as 0 in the Unix epoch.
    };
    return new Promise((resolve, reject) => { // Stealing & modifying Google's code just works.
        // Google: Asynchronously fetch all data from storage.sync.
        chrome.history.search(searchOptions, (items) => {
            // Google: Pass any observed errors down the promise chain.
            if (chrome.runtime.lastError) {
                return reject("Check getSearchHistory(): " + chrome.runtime.lastError);
            }
            console.log(items);
            resolve(items); // This is basically a return but for promises.
        });
    });
    //return [{"url" : "donda?"}] 	// Test string
}

function deleteBlockedHistoryEntries(searchAmount) {
    Promise.all([getBlockList(), getSearchHistory(searchAmount)]).then(values => {
        console.log("values:");
        console.log(values);
        let blockList = values[0];
        let historyEntries = values[1];
        console.log("historyEntries:");
        console.log(historyEntries);
        for (entry of historyEntries) {
            for (blockedDomain of blockList) {
                if (entry.url.startsWith(blockedDomain)) {
                    chrome.history.deleteUrl({
                        "url": entry.url
                    });
                    console.log(entry.url + " matched with " + blockedDomain + ". It has been deleted from the browser history.");
                    break; // No need to check every blockedDomain if it matches one already...
                }
            }
        }
    });
}



try {
    chrome.tabs.onUpdated.addListener(function() { // Mainly covers URL changes in a tab, new tabs. Some other trivial things too.
        deleteBlockedHistoryEntries(100);
    });
    chrome.tabs.onRemoved.addListener(function() { // Covers tab removal.
        deleteBlockedHistoryEntries(100);
    });
} catch (error) {
    console.error(error);
}
