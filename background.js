	// Startup code
	console.log("\n");
	console.log("%c Welcome to the console! Don't fuck it up.", "background: #5500ff; color: #ffffff");
	console.log("\n");

	var blockList = [
	    "https://www.y8.com/",
	    "https://www.w3schools.com/",
	    "https://developer.google.chrome/",
	    "https://www.github.com/"
	];

	// Functions
	async function getSearchHistory(amount) {

	    // Returns x amount latest entries in browser history as array.
	    if (amount > 100) amount = 100; // API returns sub-arrays of 100 entries if >100 requested, breaking the program.

	    let entries = await chrome.history.search({
	        // Search for x amount latest history entries w/o filter. Send to promise.
	        text: '',
	        maxResults: amount,
	        startTime: 0 // Set start date for history as 0 in the Unix epoch.
	    }, (items) => {
	        // Pass any observed errors down the promise chain.
	        if (chrome.runtime.lastError) {
	            return reject(chrome.runtime.lastError);
	        }
	        // Pass the data retrieved from storage down the promise chain.
	        console.log("items");
	        console.log(items);
	        resolve(items);
	    });
		console.log("Latest " + amount + " websites in browsing history fetched:");
		console.log(entries);
		return entries;
	}

	function isDomainBlocked(urlToCheck) {

	    // Returns true when url starts with the domain on the blockList. Else, does nothing.
	    i = 1; // Just for a fancy little readout in DevTools. Literally useless.
	    for (let blockedDomain of blockList) {
	        if (urlToCheck.startsWith(blockedDomain)) {
	            console.log("\nGiven URL #" + i + ": " + urlToCheck + " matched with blocked domain: " + blockedDomain + "\n");
	            i += 1;
	            return true;
	        }

	        // console.log("\nGiven URL: "+urlToCheck+ " did not match with any blocked domain.\n");
	    }
	}

	function removeBlocked(entries) {

	    // Iterates through entries (from getSearchHistory) and deletes those matching the blockList.
	    for (let url of entries) {
			console.log(url.url);
	        if (isDomainBlocked(url.url)) {		// url.url looks ridiculous. Better way to write it?
	            chrome.history.deleteUrl({
	                "url": url.url
	            }); // Pack URL into a UrlDetails format in API call. It took me 20 minutes to figure out.
	            console.log(url.url + " has been cleared from the browser history.");
	        }
	    }
			console.log("All blocked URLs deleted from browser history.");
	}

	function historyBusiness(amount) { // Combines all history kerfuffle into one function.
	    removeBlocked(getSearchHistory(amount));
	}

// Listeners
    chrome.tabs.onUpdated.addListener(function() { // Mainly covers URL changes in a tab, new tabs. Some other trivial things too.
        historyBusiness(3); // This event will trigger OFTEN. That's why it's such a narrow amount of entries.
		console.log(getCurrentTabUrl());
    });
    chrome.tabs.onRemoved.addListener(function() { // Covers tab removal.
        historyBusiness(100); // This event triggers far less often than the update, so do a "deeper clean", so to speak.
		console.log(getCurrentTabUrl());
    });