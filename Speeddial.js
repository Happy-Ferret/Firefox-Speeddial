

$(document).ready(function()
{
	console.log("Document ready");
	$("#speeddial_searchBtn").click(function()
	{
		console.log("Searching");
		var text = $("#speeddial_searchTxt").val();
		document.location = "https://www.google.co.uk/search?q=" + encodeURIComponent(text);
	});
	$("#speeddial_searchTxt").keydown(function(evt)
	{
		if(evt.which == 13) // enter
			$("#speeddial_searchBtn").trigger("click");
	});

	
	$("#dial_add").click(function()
	{
		var id = utils.createUUID();

		var defaults = { dialogClass: "utils-no-close", modal: true, closeOnEscape: false, autoOpen: true, buttons: { "Close": function () { $(this).empty().remove(); }}};
		var settings = $.extend({},defaults, { 
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
						
						$(this).dialog("close"); 
					}
					catch(ex)
					{ alert(ex); }
				},
				"Cancel": function () 
				{ 
					$(this).dialog("close"); 
				}
			},
			open: function()
			{
				$(this).find("label").label( { width: "100px" } );
				$(this).find("input").input();
			},
			close: function()
			{
				$(this).find("input").val("");
			}
		});

		$("#add_dial").dialog(settings);
	});
});




var dials = [];
var dial = function(name, url, colour)
{
	this._id = utils.createUUID();
	this._name = name;
	this._url = url;
	this._colour =colour;
}

function removeDial(id)
{
	console.log("Remove dial - " + id);
	for(var i=0; i < dials.length; i++)
	{
		if(dials[i]._id == id)
		{
			dials = utils.removeAt(dials,i);
			chrome.storage.local.set({ dials: JSON.stringify(dials) });
			$("#" + id).empty().remove();
		}
	}
}

function drawDial(dial)
{
	console.log(dial);
	
	var $dialEl = $("<div></div>")
			.attr("id",dial._id)
			.addClass("dial")
			.css({ backgroundColor: dial._colour })
			.data("url", dial._url)
			.html("<label></label>"
				 + "<span class='extra menu'>...</span>"
				 + "<span class='selector-url extra' style='overflow: hidden;'></span>"
				 + "<ul><li class='item'>Remove</li></ul>");
	
	$dialEl.find("label").label({ lineHeight: "180px", margin: "auto", width: "200px" }).html(document.createTextNode(dial._name));
	$dialEl.find(".selector-url").html(document.createTextNode(dial._url));
	$dialEl.find(".menu").click(function(evt)
	{
		$(this).parent().find("ul").css( { display: "block" });
	});
	
	$dialEl.mousedown(function(evt)
	{
		var $div = $(this);
		var $src = $(evt.target);
		if($src.hasClass("item"))
		{
			removeDial($div.attr("id"));
		}
		else if(!$src.hasClass("menu"))
		{		
			var url = $div.data("url");
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
	$dialEl.insertBefore("#dial_add");
}


chrome.storage.local.get('dials', (res) => {
	console.log("Read from storage");
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
		console.log("Drawing dial");
		dials[i]._id = dials[i]._id || utils.createUUID();
		drawDial(dials[i]);
	}
});






 
