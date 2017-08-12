var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var mmm = require('mmmagic');

var App = require('./src/app')
var LocalImageRepositoryRandomizer = require('./src/repo')

var appConfig = {
    delay : 5, //number of minutes before a bot posts an image
    folder : 'images'
}

fs.readFile('config/credentials.json', function processClientSecrets(err, content) {
    var credentials = JSON.parse(content);
    var imageRandomizer = new LocalImageRepositoryRandomizer(path.resolve(__dirname, appConfig.folder));
    var botApp = new App(credentials, appConfig, imageRandomizer);
    try {
        botApp.start();
        console.log('Bot app started.')
    } 
    catch (error) {
        botApp.shutdown();
        console.error('Bot app shutdown due to error ' + error)
    }
});

// fs.readFile('credentials.json', function processClientSecrets(err, content) {
//     if (err) {
//         console.log('Error loading client secret file: ' + err);
//         return;
//     }
  
//     credentials = JSON.parse(content)
//     var api = Twit(credentials.twitter)

//     var interval_in_millisecs = app_config.delay * 60000;
//     var INTERVAL_ID = setInterval(function() {
//         const isDirectory = source => fs.lstatSync(source).isDirectory();
//         const getDirectories = source => fs.readdirSync(source).map(name => path.resolve(source, name)).filter(isDirectory);

//         directories = getDirectories(path.resolve(__dirname, app_config.folder));
//         random_folder = directories[Math.floor(Math.random() * directories.length)]
//         console.log(random_folder)

//         files_in_random_directory = []
//         fs.readdirSync(random_folder).forEach(file => {
//             files_in_random_directory.push(file)
//         });

//         random_directory_name = random_folder.split(path.sep).pop()
//         random_file = path.resolve(random_folder, files_in_random_directory[Math.floor(Math.random() * files_in_random_directory.length)]);

//         var Magic = mmm.Magic;
//         var magic = new Magic(mmm.MAGIC_MIME_TYPE);
//         magic.detectFile(random_file, function(err, result) {
//             if (err) {
//                 throw err;
//             }

//             if (_.indexOf(SUPPORTED_IMG_TYPES, result) > -1) {
//                 var b64content = fs.readFileSync(random_file, { encoding: 'base64' });
//                 api.post('media/upload', { media_data: b64content }, function (err, data, response) {
//                     if (err) {
//                     console.log('ERROR');
//                     console.log(err);
//                     }
//                     else {
//                         console.log('Uploaded an image!');

//                         api.post('statuses/update', {
//                             status : random_directory_name,
//                             media_ids: new Array(data.media_id_string)
//                         },
//                             function(err, data, response) {
//                                 if (err) {
//                                     console.log('Error!');
//                                     console.log(err);
//                                 }
//                                 else {
//                                     console.log('Posted an image!');
//                                 }
//                         }
//                         );
//                     }
//                 });
//             }
//         });

//     }, interval_in_millisecs)
// })

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