async function getCurrentTabDomain(callback) {
    let queryOptions = {
        active: true,
        currentWindow: true
    };
    let [tab] = await chrome.tabs.query(queryOptions);
    if (typeof callback == "function") callback(extractDomain(tab.url));
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

function toggle(button, root) {
    if (button.innerHTML == "ENABLED") {
        button.innerHTML = "DISABLED";
        root.style.setProperty('--button-color', 'var(--red)');
    } else {
        button.innerHTML = "ENABLED";
        root.style.setProperty('--button-color', 'var(--green)');
    }
}

function refreshBlockList(callback) { // Umbrella function. Gets blockList from online, sets initial button state based off domain.
    chrome.storage.sync.get(["blockList"], function initBlockList(result) {
        var blockList = result;
        if (typeof blockList.length != 'object') blockList = []; // 'object' is a catch-all for non-strings non-numbers etc...
        if (typeof callback == "function") callback(blockList);
    });
}

/*function addDomainToBlockList(domain) {
    chrome.storage.sync.set({
        "blockList": blockList.push(domain)
    });
    refreshButton();
}

function removeDomainFromBlockList(domain) {
    newBlockList
    
    if (blockList. !== -1) {
         array.splice(blockList.indexOf(domain), 1);
    }
    
    chrome.storage.sync.set({
        "blockList": blockList.pop()
    })
}
*/
    


try {

    var blockBtn = document.getElementById("btn");
    var displayedDomain = document.getElementById("currentDomain");
    var root = document.documentElement; // For CSS variable editing.
    var currentDomain = "";

    refreshBlockList(function main(blockedUrls) {
        var blockList = blockedUrls;

        getCurrentTabDomain(function startUpHelper(url) {
            var currentDomain = url;
            console.log(url);
            console.log(currentDomain);
            displayedDomain.innerHTML = currentDomain;
            if (blockList.includes(currentDomain)) { // Find, set starting button state.
                blockBtn.innerHTML = "ENABLED";
                root.style.setProperty('--button-color', 'var(--green)');
            } else {
                blockBtn.innerHTML = "DISABLED";
                root.style.setProperty('--button-color', 'var(--red)');
            }

        });

    });
    blockBtn.addEventListener("click", function toggler() {
        toggle(blockBtn, root);
    });




} catch (error) {
    console.error(error);
}