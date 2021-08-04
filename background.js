console.log("I have learned basic reading comprehension. Observe as I read you the latest entry from your search history: \n");

// Search history chronologically w/o a filter, but only take 1 entry. Callback function parses raw array.
chrome.history.search({
	text: '', 
	maxResults: 1
}, function(data){
	console.log(data[0].url);
});

