/***
|''Name''|TiddlySpaceToolbar|
|''Description''|augments tiddler toolbar commands with SVG icons|
***/
//{{{
(function($){

var _handler = config.macros.toolbar.handler;
config.macros.toolbar.handler = function(place, macroName, params, wikifier,
		paramString, tiddler) {
	var status = _handler.apply(this, arguments);
	// TODO: refresh; cf. http://github.com/jdlrobson/tiddlyspace/commit/beb21fd
	if(tiddler.isReadOnly()){
		$(place).addClass("toolbarReadOnly");
	}
	if(config.macros.image && config.macros.image.svgAvailable){
		augmentToolbar(place);
	}
	return status;
};

var augmentToolbar = function(toolbar) { // XXX: should not be private!?
	$(toolbar).children(".button").each(function(i, el) {
		var cmd = el.className.match(/\bcommand_([^ ]+?)\b/); // XXX: gratuitous RegEx?
		cmd = cmd ? cmd[1] : "moreCommand"; // XXX: special-casing of moreCommand due to ticket #1234
		var title = "%0.svg".format([cmd]);
		if(store.tiddlerExists(title)) { // XXX: does not support shadow tiddler
			$(el).empty();
			wikify("<<image %0>>".format([title]), el); // XXX: use function call instead of wikification
		}
	});
};

config.macros.toolbar.onClickMore = function(ev) {
	var sibling = this.nextSibling;
	var commands = sibling.childNodes;
	var popup = Popup.create(this);
	addClass(popup ,"taggedTiddlerList");

	for(var i = 0; i < commands.length; i++){
		var li = createTiddlyElement(popup, "li", null);
		var oldCommand = commands[i];
		var command = oldCommand.cloneNode(true);
		command.onclick = oldCommand.onclick;
		li.appendChild(command);
	}
	Popup.show();
	ev.stopPropagation();
};

// XXX: does not belong here; TiddlySpaceConfig!? -- XXX: overriding is bad (cf. TiddlyWebConfig)
config.shadowTiddlers.ToolbarCommands = "|~ViewToolbar|+editTiddler closeTiddler > cloneTiddler pubRev closeOthers fields publishTiddlerRevision revisions syncing permalink references jump|"+
"\n|~EditToolbar|+saveTiddler -cancelTiddler deleteTiddler|";

})(jQuery);
//}}}