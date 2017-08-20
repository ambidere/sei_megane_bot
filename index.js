var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var mmm = require('mmmagic');

var TwitterImageBotApp = require('./src/app')
var LocalImageRepositoryRandomizer = require('./src/repo')
var GoogleDriveImageRandomizer = require('./src/drive')
var config = require('./config');

function getRandomizer(config) {
    if (config.app.mode === 'gdrive') {
        var googleCredentials = config.googleapi;
        return new GoogleDriveImageRandomizer(googleCredentials.api_key, googleCredentials.parent_folder)
    }
    else if (config.app.mode === 'local') {
        return new LocalImageRepositoryRandomizer(path.resolve(__dirname, config.folder));
    }
}

var botApp = new TwitterImageBotApp(config, config.app, getRandomizer(config));
try {
    botApp.start();
    console.log('Bot app started.')
} 
catch (error) {
    botApp.shutdown();
    console.error('Bot app shutdown due to error ' + error)
}