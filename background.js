async function getBlockList() { // Returns a promise containing the blockList array.
    return new Promise((resolve, reject) => { // Stealing & modifying Google's code just works.
        // Google's code: Asynchronously fetch all data from storage.sync.
        chrome.storage.sync.get(["blockList"], (items) => {

            // Google's code: Pass any observed errors down the promise chain.

            if (chrome.runtime.lastError) {
                return reject("Google's own code broke in Chrome lmao check getBlockList(): " + chrome.runtime.lastError);
            }

            items = items["blockList"]; // Is there a better way to do this?
            if (Array.isArray(items) !== true) { // If you fetched nothing, make it an empty list, bonehead.
                items = [];
            }
            console.log("Fetched blockList.");
            console.log(items);
            resolve(items); // This is basically a return but for promises.
        });
    });
}

async function getCurrentTabDomain() { // Stealing & modifying Google's code just works.
    const queryOptions = {
        active: true,
        currentWindow: true
    };
    let [tab] = await chrome.tabs.query(queryOptions);
    const bananaSplit = tab.url.split("/");
    console.log("Got current tab's domain.");
    return bananaSplit[0] + "//" + bananaSplit[2]; // Removes paths in URL by splitting at slashes, then concatenating strings.
}

async function getSearchHistory(amount) {
    if (amount > 100) {
        amount = 100;
    } // API returns sub-arrays of 100 if >100 requested, breaking the program.
    const searchOptions = {
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
}

function deleteBlockedHistoryEntries(blockList, searchHistory) {
    for (var entry of searchHistory) {
        const bananaSplit = entry.url.split("/");
        if (blockList.includes(bananaSplit[0] + "//" + bananaSplit[2])) {
            chrome.history.deleteUrl({
                "url": entry.url
            });
            console.log(entry.url + " removed from browser history.");
        }
    }
}


function updateTitleAndIcon(domain, blockList) {
    console.log("Icon changed!");
    if (blockList.includes(domain)) {
        chrome.action.setIcon({
            "path": "/icons/Active/Active128.png"
        });

    } else {
        chrome.action.setIcon({
            "path": "/icons/Inactive/Inactive128.png"
        })
    }
}




try {
    chrome.tabs.onUpdated.addListener(function() { // Mainly covers URL changes in a tab, new tabs. Some other trivial things too.
        getBlockList().then((blockList) => {
            getSearchHistory(100).then((searchHistory) => {
                deleteBlockedHistoryEntries(blockList, searchHistory);
            });
            getCurrentTabDomain().then((domain) => {
                updateTitleAndIcon(domain, blockList);
            });
        });
    });
    chrome.tabs.onActivated.addListener(function() { // Makes cosmetic changes happen on tab switches.
        getBlockList().then((blockList) => {
            getCurrentTabDomain().then((domain) => {
                updateTitleAndIcon(domain, blockList)
            })
        })
    });
} catch (error) {
    console.error(error);
}