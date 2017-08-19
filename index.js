var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var mmm = require('mmmagic');

var App = require('./src/app')
var LocalImageRepositoryRandomizer = require('./src/repo')
var GoogleDriveImageRandomizer = require('./src/drive')

var appConfig = {
    delay : 2, //number of minutes before a bot posts an image
    folder : 'images'
}

fs.readFile('config/config.json', function processClientSecrets(err, content) {
    var config = JSON.parse(content);
    var googleCredentials = config.googleapi;
    var driveRandomizer = new GoogleDriveImageRandomizer(googleCredentials.api_key, googleCredentials.parent_folder)
    var botApp = new App(credentials, config.app, driveRandomizer);
    //var imageRandomizer = new LocalImageRepositoryRandomizer(path.resolve(__dirname, appConfig.folder));
    //var botApp = new App(credentials, appConfig, imageRandomizer);
    try {
        botApp.start();
        console.log('Bot app started.')
    } 
    catch (error) {
        botApp.shutdown();
        console.error('Bot app shutdown due to error ' + error)
    }
});