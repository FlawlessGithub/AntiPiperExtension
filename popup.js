async function getCurrentTabDomain() {
    let queryOptions = {
        active: true,
        currentWindow: true
    };
    let [tab] = await chrome.tabs.query(queryOptions);
	return extractDomain(tab.url);
}

function updateBlockList(newBlockList) {
    chrome.storage.sync.set({
            "blockList": newBlockList
        }, function blockListUpdateHelper() {
            console.log("blockList updated!");
        }

    );
}


function extractDomain(urlToConvert) {
    console.log(urlToConvert);
    // Removes paths in URL by splitting at slashes, then concatenating strings.
    let bananaSplit = urlToConvert.split("/"); // Reason for the variable here is the mildly amusing name.
    //return bananaSplit[0] + "//" + bananaSplit[2]; // Replace with callback function???
    console.log(bananaSplit[0] + "//" + bananaSplit[2]);
    return bananaSplit[0] + "//" + bananaSplit[2];
}

function toggle(button, root, domain, blockedDomains) {
  

  if (button.innerHTML == "ENABLED") {
        button.innerHTML = "DISABLED";
		root.style.setProperty('--button-color', 'var(--red)');
        // blockList shenanignans
        
		index = blockedDomains.indexOf(domain);
        if (index !== -1) {	// indexOf returns -1 if it's not in the array. If you try to splice -1, it removes the second last item in the array.
            console.log(blockedDomains.splice(index, 1) + " removed from the blockList.");
            chrome.storage.sync.set({
                "blockList": blockedDomains
            });
            console.log(chrome.storage.sync.get(["blockList"]));


        } else {
            console.log(domain + " isn't in the blockList! No changes made.");
        }

    } else {
        button.innerHTML = "ENABLED";
        root.style.setProperty('--button-color', 'var(--green)');

        // blockList shenanigans
        if (blockedDomains.indexOf(domain) == -1) { // indexOf returns -1 if it's not in the array.
            chrome.storage.sync.set({
                "blockList": blockedDomains.push(domain)
            });

            console.log(domain + " added to the blockList.");
            console.log(blockedDomains);
        } else {
            console.log(domain + " is already in the blockList!");
        }
    }
}

async function refreshBlockList(callback) { // Umbrella function. Gets blockList from online, sets initial button state based off domain.
    let blockList = await new Promise((resolve, reject) => {
    // Asynchronously fetch all data from storage.sync.
    chrome.storage.sync.get(["blockList"], (items) => {
      // Pass any observed errors down the promise chain.
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      // Pass the data retrieved from storage down the promise chain.
	console.log("items");
	console.log(items);
	resolve(items);
	});
	});
	if (!Array.isArray(blockList)) blockList = [];	// Hack solution. Fix later.
	console.log("blockList");
	console.log(blockList);
    return blockList;
}

/*
function addDomainToBlockList(domain, blockList) {
    if (blockList.indexOf(domain) == -1) { // indexOf returns -1 if it's not in the array.
        chrome.storage.sync.set({
            "blockList": blockList.push(domain)
        });
        console.log(domain + " added to the blockList.");
    } else {
        console.log(domain + " is already in the blockList!");
    }
}

function removeDomainFromBlockList(domain, blockList) {
    index = blockList.indexOf(domain);
    if (index !== -1) { // // indexOf returns -1 if it's not in the array. If you try to splice -1, it removes the second last item in the array.
        console.log(blockList.splice(index, 1) + " removed from the blockList.");
        chrome.storage.sync.set({
            "blockList": blockList
        });
    } else {
        console.log(domain + " isn't in the blockList! No changes made.");
    }
}
*/

try {
    var root = document.documentElement; // For CSS variable editing.
    var currentDomain = getCurrentTabDomain();
	var blockList = refreshBlockList();
	var blockBtn = document.getElementById("btn");

	document.getElementById("currentDomain").innerHTML = currentDomain;
		
	console.log("Current domain: ");
	console.log(currentDomain);
	console.log("Blocked URLs: ");
	console.log(blockList);
	console.log("Blocked URLs length: " + blockList.length);
            
    if (blockList.includes(currentDomain)) {
        blockBtn.innerHTML = "ENABLED";
        root.style.setProperty('--button-color', 'var(--green)');
    } else {
        blockBtn.innerHTML = "DISABLED";
        root.style.setProperty('--button-color', 'var(--red)');
        }
		
    blockBtn.addEventListener("click", function toggler() {
		toggle(blockBtn, root, currentDomain, blockList);
			});

} catch (error) {
    console.error(error);
}