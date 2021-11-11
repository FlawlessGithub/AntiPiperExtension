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
            resolve(items); // This is basically a return but for promises.
        });
    });
}

function addToBlockList(blockList, domain) {
    console.log(domain + " not in blockList. Pushing...");
    blockList.push(domain);
    chrome.storage.sync.set({
        blockList: blockList
    });
}

function removeFromBlockList(blockList, domain) { // I don't know what is happening. I had a million glitches yesterday, now it's fine. 
    const index = blockList.indexOf(domain);
    console.log("Item in blockList. Splicing...");
    blockList.splice(index, 1);
    chrome.storage.sync.set({
        blockList: blockList
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
    return bananaSplit[0] + "//" + bananaSplit[2]; // Removes paths in URL.
}


function updateMenu(blockList, domain) { // Set initial button state.	
    const btn = document.getElementById("btn");
    const root = document.documentElement;
    if (blockList.includes(domain)) {
        btn.innerHTML = "ENABLED";
        root.style.setProperty('--button-color', 'var(--green)');
    } else {
        btn.innerHTML = "DISABLED";
        root.style.setProperty('--button-color', 'var(--red)');
    }
    document.getElementById("currentDomain").innerHTML = domain;
}


try {
    Promise.all([getBlockList(), getCurrentTabDomain()]).then( // Combine results from two promises into array. Index array for individual results.
        values => updateMenu(values[0], values[1])
    );

    const btn = document.getElementById("btn");
    const root = document.documentElement;

    btn.addEventListener("click", function toggleButton() {
      
        Promise.all([getBlockList(), getCurrentTabDomain()]).then(values => {
            let blockList = values[0];
            let domain = values[1];

            if (btn.innerHTML == "ENABLED") {
                btn.innerHTML = "DISABLED";
                root.style.setProperty('--button-color', 'var(--red)');
                removeFromBlockList(blockList, domain);

            } else {
                btn.innerHTML = "ENABLED";
                root.style.setProperty('--button-color', 'var(--green)');
                addToBlockList(blockList, domain);

            }
        });
    })
} catch (error) {
    console.log(error);
}