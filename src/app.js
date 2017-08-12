var fs = require('fs');
var Twit = require('twit');

var TwitterImageBotApp = function(credentials, config, imageRandomizer) {
    this.api = Twit(credentials.twitter);
    this.config = config;
    this.delay = config.delay * 1000
    this.randomizer = imageRandomizer;
}

TwitterImageBotApp.prototype.start = function() {
    this.process = setInterval(this.postImageToTwitter.bind(this), this.delay)
}

TwitterImageBotApp.prototype.postImageToTwitter = function() {
    console.log(this.randomizer.getRandomFile())
}

TwitterImageBotApp.prototype.shutdown = function() {
    clearInterval(this.process)
}

module.exports = TwitterImageBotApp