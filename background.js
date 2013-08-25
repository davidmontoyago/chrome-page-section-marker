/*
Copyright (c) 2013 David Montoya - davidmontoyago@gmail.com

See the file license.txt for copying permission.
*/
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    chrome.pageAction.show(tabId);
    chrome.pageAction.setTitle({
        tabId: tab.id,
        title: 'url=' + tab.url
    });
});

chrome.pageAction.onClicked.addListener(function(tab){
    chrome.tabs.executeScript(tab.id, 
	{
	   file:'contentscript.js'
	}
    );
});
