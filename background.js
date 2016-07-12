function render()
{
   chrome.tabs.create({
     "url": chrome.extension.getURL("Speeddial.html")
   });
}


chrome.browserAction.onClicked.addListener(render);
