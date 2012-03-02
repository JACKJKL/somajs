var SomaApplication = soma.Application.extend({
	init: function() {

	},
	registerWires: function() {
		this.addWire(SearchWire.NAME, new SearchWire());
		this.addWire(TwitterService.NAME, new TwitterService());
	},
	registerCommands: function() {
		this.addCommand(TwitterEvent.SEARCH, TwitterCommand);
	}
});

var app = new SomaApplication();
