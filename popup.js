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

async function logBlockList() { // Just here so I can check blockList directly from Chrome DevTools easily.
    console.log(await getBlockList());
}

function addToBlockList(blockList, domain) { // I don't know what is happening. I had a million glitches yesterday, now it's fine. 
    console.log(domain + " not in blockList. Pushing...");
    blockList.push(domain);
    chrome.storage.sync.set({
        blockList: blockList
    }, logBlockList);
}

function removeFromBlockList(blockList, domain) { // I don't know what is happening. I had a million glitches yesterday, now it's fine. 
    let index = blockList.indexOf(domain);
    console.log("Item in blockList. Splicing...");
    blockList.splice(index, 1);
    chrome.storage.sync.set({
        blockList: blockList
    });
}

async function getCurrentTabDomain() { // Stealing & modifying Google's code just works.
    let queryOptions = {
        active: true,
        currentWindow: true
    };
    let [tab] = await chrome.tabs.query(queryOptions);
    let bananaSplit = tab.url.split("/");
	console.log("Got current tab's domain.");
    return bananaSplit[0] + "//" + bananaSplit[2]; // Removes paths in URL by splitting at slashes, then concatenating strings.
}


function startUp(blockList, domain) { // Set initial button state.	
    console.log("startUp run with the following values: " + blockList + " and " + domain);
    let btn = document.getElementById("btn");
    let root = document.documentElement;
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
        values => startUp(values[0], values[1])
    );

    let btn = document.getElementById("btn");
    let root = document.documentElement;

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