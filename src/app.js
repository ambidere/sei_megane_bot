var _ = require('lodash');
var fs = require('fs');
var Twit = require('twit');
var mmm = require('mmmagic');

var SUPPORTED_IMG_TYPES = ['image/png', 'image/jpeg', 'image/gif'];

var TwitterImageBotApp = function(credentials, config, imageRandomizer) {
    this.api = Twit(credentials.twitter);
    this.config = config;
    this.delay = config.delay * 60000
    this.randomizer = imageRandomizer;
}

TwitterImageBotApp.prototype.start = function() {
    this.process = setInterval(this.requestImage.bind(this), this.delay)
    console.log('Bot process started.');
}

TwitterImageBotApp.prototype.requestImage = function() {
    this.randomizer.requestRandomImage(this.performBotAction.bind(this));
}

TwitterImageBotApp.prototype.performBotAction = function(imageData) {
    var magic = new mmm.Magic(mmm.MAGIC_MIME_TYPE);
    magic.detectFile(imageData.imagePath, function(error, result) {
        this.handleError(error)

        if (_.indexOf(SUPPORTED_IMG_TYPES, result) > -1) {
            this.postImageToTwitter(imageData);
        }
    }.bind(this));
}

TwitterImageBotApp.prototype.postImageToTwitter = function(imageData) {
    var b64content = fs.readFileSync(imageData.imagePath, { encoding: 'base64' });
    this.api.post('media/upload', { media_data: b64content }, function(error, twitterData, response) {
        this.handleError(error);
        this.handleSuccessfulUpload(imageData, twitterData, response);
        console.log('Image from folder ' + imageData.folderName + ' uploaded.')
    }.bind(this));
}

TwitterImageBotApp.prototype.handleSuccessfulUpload = function(imageData, twitterData, response) {
    this.api.post('statuses/update',
            this.createTweetObject(imageData, twitterData),
            this.handleTweetUpdate.bind(this));
}

TwitterImageBotApp.prototype.createTweetObject = function(imageData, twitterData) {
    return {
        status : imageData.folderName,
        media_ids: new Array(twitterData.media_id_string)
    }
}

TwitterImageBotApp.prototype.handleTweetUpdate = function(error, twitterData, response) {
    this.handleError(error);
    console.log('Posted an image!');
}

TwitterImageBotApp.prototype.handleError = function(error) {
    if (error) {
        throw error;
    }
}

TwitterImageBotApp.prototype.shutdown = function() {
    clearInterval(this.process)
    console.log('Bot process stopped.');
}

module.exports = TwitterImageBotApp