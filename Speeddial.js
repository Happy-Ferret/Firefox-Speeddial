/*
Open a new tab, and load "my-page.html" into it.
*/
var dials = [];
var dial = function(name, url, colour)
{
	this._name = name;
	this._url = url;
	this._colour =colour;
}

function speedDial() {
   chrome.tabs.create({
     "url": chrome.extension.getURL("Speeddial.html")
   });
}

function drawDial(dial)
{
	console.log(dial);
	var html = "<div class='dial' data-url='" + dial._url + "' style='background-color: " + dial._colour + ";'>"
		     + "<label>" + dial._name + "</label>"
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
	// try to read back the storage
	chrome.storage.local.get('dials', (res) => {
		var temp = null;
		try
		{
			temp = JSON.parse(res.dials);
		} catch(ex) 
		{ 
			console.log(ex);
			console.log(res);
		}
		
		dials = temp || [];
		console.log(dials);
		
		for(var i = 0; i < dials.length; i++)
		{
			drawDial(dials[i]);
		}
	});
	
	for(var i = 0; i < dials.length; i++)
	{
		drawDial(dials[i]);
	}
	
	$("#speeddial_searchBtn").click(function()
	{
		var text = $("#speeddial_searchTxt").val();
		document.location = "https://www.google.co.uk/search?q=" + text;
	});
	
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
					try
					{
						var $this = $(this);
						var add_dial = new dial($this.find("#addText").val(),$this.find("#addURL").val(),$this.find("#addColour").val());
						dials.push(add_dial);
						console.log(add_dial);
						
						chrome.storage.local.set({ dials: JSON.stringify(dials) });
						
						drawDial(add_dial);
						$(this).empty().remove();
					}
					catch(ex)
					{ alert(ex); }
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
 
