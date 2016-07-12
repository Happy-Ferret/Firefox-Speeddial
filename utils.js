// hang everything off a global variable, if theres already an object called utils use that
// duplicate functions / variables might therefore behave in an unexpected manner depending on load order
var utils = utils || {};

// create a UUID
// http://stackoverflow.com/a/8809472
utils.createUUID = function ()
{
    var d = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function")
    {
        d += performance.now(); //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c)
    {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
};

utils.removeAt = function(array, index)
{
	var vItem = array[index];
	if (vItem) 
		array.splice(index, 1);
	return array;
};

// some styling for inputs
(function($)
{
    $.fn.input = function (css)
    {
        if (!css)
            css = {};
        return this.each(function ()
        {
            $(this).addClass("ui-widget ui-widget-content ui-corner-all ui-button");
            $(this).css(css);
        });
    }
})(jQuery);
// and labels
(function ($)
{
    $.fn.label = function (css)
    {
        if (!css)
            css = {};
        return this.each(function ()
        {
            $(this).addClass("ui-widget ui-button");
            $(this).css(css);
        });
    }
})(jQuery);
