var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var mmm = require('mmmagic');

var App = require('./src/app')
var LocalImageRepositoryRandomizer = require('./src/repo')
var GoogleDriveImageRandomizer = require('./src/drive')

var appConfig = {
    delay : 10, //number of minutes before a bot posts an image
    folder : 'images'
}

fs.readFile('config/credentials.json', function processClientSecrets(err, content) {
    var credentials = JSON.parse(content);
    var googleCredentials = credentials.googleapi;
    var driveRandomizer = new GoogleDriveImageRandomizer(googleCredentials.api_key, googleCredentials.parent_folder)
    //var imageRandomizer = new LocalImageRepositoryRandomizer(path.resolve(__dirname, appConfig.folder));
    //var botApp = new App(credentials, appConfig, imageRandomizer);
    try {
        //botApp.start();
        console.log('Bot app started.')
    } 
    catch (error) {
        botApp.shutdown();
        console.error('Bot app shutdown due to error ' + error)
    }
});

// var readline = require('readline');

// var Google = require('googleapis');
// var GoogleAuth = require('google-auth-library');

// var API_SCOPES = [
//     'https://www.googleapis.com/auth/drive',
//     'https://www.googleapis.com/auth/drive.file']

// fs.readFile('credentials.json', function processClientSecrets(err, content) {
//   if (err) {
//     console.log('Error loading client secret file: ' + err);
//     return;
//   }
  
//   credentials = JSON.parse(content)
//   google_authorize(credentials.googleapi)
// })

// //convert into class later
// function google_authorize(credentials) {
//     var clientSecret = credentials.client_secret;
//     var clientId = credentials.client_id;
//     var redirectUrl = credentials.redirect_uris[0];

//     var auth = new GoogleAuth()
//     var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
//     var authUrl = oauth2Client.generateAuthUrl({
//         access_type: 'offline',
//         scope: API_SCOPES
//     });

//     console.log('Authorize this app by visiting this url: ', authUrl);
//     var rl = readline.createInterface({
//         input: process.stdin,
//         output: process.stdout
//     });
//     rl.question('Enter the code from that page here: ', function(code) {
//         rl.close();
//         oauth2Client.getToken(code, function(err, token) {
//         if (err) {
//             console.log('Error while trying to retrieve access token', err);
//             return;
//         }
//         oauth2Client.credentials = token
//         oauth2Client.refreshAccessToken( function(err, tokens) {
//             console.log(tokens)
//         });
//         });

        
//     });


// }