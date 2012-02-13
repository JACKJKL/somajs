var SomaApplication = new Class({

	Extends: soma.Application,

	registerWires: function() {
		this.addWire(SearchWire.NAME, new SearchWire);
		this.addWire(TwitterService.NAME, new TwitterService);
	},

	registerCommands: function() {
		this.addCommand(TwitterEvent.SEARCH, TwitterCommand);
	}
	
});

new SomaApplication();
