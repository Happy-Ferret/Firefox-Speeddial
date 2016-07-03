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

function drawDial(name, url, colour)
{
	var html = "<div class='dial' data-url='" + url + "' style='background-color: " + colour + ";'>"
		     + "<label>" + name + "</label>"
		     + "</div>";
	var $html = $(html);
	$html.click(function()
	{
		document.location = $(this).data("url");
	});
	$html.insertBefore("#dial_add");
}

utils.ready(function()
{
	$("#dial_add").click(function()
	{
		var id = utils.createUUID();
		var html = "<label>Name</label><input type='text' id='addText' /><br />"
				 + "<label>URL</label><input type='text' id='addURL' /><br />"
				 + "<label>Colour</label><input type='text' id='addColour' />";

		utils.userChoice("Add Dial",html, 
		{
			width: 400,
			buttons: 
			{ 
				"Add": function () 
				{ 
					drawDial($(this).find("#addText").val(), $(this).find("#addURL").val(), $(this).find("#addColour").val());
					$(this).empty().remove();
				},
				"Close": function () { $(this).empty().remove(); }
			},
			open: function()
			{
				$(this).find("label").label( { width: "100px" } );
				$(this).find("input").input();
			}
		});
	});
});


/*
Add openMyPage() as a listener to clicks on the browser action.
*/
chrome.browserAction.onClicked.addListener(speedDial);
 
