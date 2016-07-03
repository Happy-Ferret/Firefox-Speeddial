/*
Open a new tab, and load "my-page.html" into it.
*/
function speedDial() {
   chrome.tabs.create({
     "url": chrome.extension.getURL("Speeddial.html")
   });
}

function search()
{
	var text = document.getElementById("speeddial_searchTxt").value;
	document.location = "https://www.google.co.uk/search?q=" + text;
}


/*
Add openMyPage() as a listener to clicks on the browser action.
*/
chrome.browserAction.onClicked.addListener(speedDial);
 
