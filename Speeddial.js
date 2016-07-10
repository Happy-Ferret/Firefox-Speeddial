/*
Open a new tab, and load "my-page.html" into it.
*/
var dials = [];
var dial = function(name, url, colour)
{
	this._id = utils.createUUID();
	this._name = name;
	this._url = url;
	this._colour =colour;
}

// function removeDial(id)
// {
	// alert(id);
	// for(var i=0; i < dials.length; i++)
	// {
		// if(dial[i]._id == id)
		// {
			// //dials = utils.removeAt(dials,i);
			// chrome.storage.local.set({ dials: JSON.stringify(dials) });
			
			// $("#" + id).empty().remove();
		// }
	// }
// }

function speedDial() {
   chrome.tabs.create({
     "url": chrome.extension.getURL("Speeddial.html")
   });
}

function drawDial(dial)
{
	console.log(dial);
	var html = "<div id='" + dial._id + "' class='dial' data-url='" + dial._url + "' style='background-color: " + dial._colour + ";'>"
		     + "<label>" + dial._name + "</label>"
			 + "<span class='extra menu'>...</span>" // under the label so its above it in z-index
			 + "<span class='extra' style='overflow: hidden;'>" + dial._url + "</span>"
			 + "<ul><li class='item'>Remove</li></ul>"
		     + "</div>";
	var $html = $(html);
	
	$html.find("label").label({ lineHeight: "180px", margin: "auto", width: "200px" });
	$html.find(".menu").click(function(evt)
	{
		$(this).parent().find("ul").css( { display: "block" });
	});
	
	$html.mousedown(function(evt)
	{
		var $src = $(evt.target);
		if($src.hasClass("item"))
		{
			//removeDial($(this).parent().parent().attr("id");
		}
		else if(!$src.hasClass("menu"))
		{		
			var url = $(this).data("url");
			switch(evt.which)
			{
				case 1: // left
					document.location = url;
					break;
				case 2: // right
					window.open(url,"_blank");
					break;
			}
		}
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
 
