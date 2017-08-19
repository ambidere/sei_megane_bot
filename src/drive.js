var _ = require('lodash')
var fs = require('fs')
var tmp = require('tmp')
var path = require('path')
var util = require('util')
var google = require('googleapis');

var GoogleDriveImageRandomizer = function(apiKey, parentFolderId) {
    this.apiKey = apiKey;
    this.parentFolderId = parentFolderId;
    this.subFolders = []
    this.shuffledFolders = []
    this.drive = google.drive('v3');
    this.buildFileHierarchy()
}

GoogleDriveImageRandomizer.prototype.buildFileHierarchy = function() {
    this.drive.files.list({
        q: util.format("'%s' in parents and mimeType='application/vnd.google-apps.folder'", this.parentFolderId),
        key: this.apiKey
    }, this.processFolderResult.bind(this))
}

GoogleDriveImageRandomizer.prototype.processFolderResult = function(error, result) {
    this.handleError(error)
    result.files.forEach(this.processEachFolder.bind(this))
    this.shuffleFolderDirectory(this.subFolders)
}

GoogleDriveImageRandomizer.prototype.processEachFolder = function(folder) {
    var subFolder = {
        'id' : folder.id,
        'name' : folder.name
    }
    this.subFolders.push(subFolder)
}

GoogleDriveImageRandomizer.prototype.requestRandomImage = function(callback) {
    if (!_.isEmpty(this.shuffledFolders)) {
        var shuffledFolder = this.shuffledFolders.shift();
        var shuffledFolderName = shuffledFolder.name;

        console.log(shuffledFolderName)
        this.drive.files.list({
            q: util.format("'%s' in parents and mimeType contains 'image/'", shuffledFolder.id),
            key: this.apiKey
        }, (error, result) => this.processImageResult(error, result, shuffledFolderName, callback))
    }
    else {
        this.shuffleFolderDirectory(this.subFolders)
        this.requestRandomImage(callback)
    }
}

GoogleDriveImageRandomizer.prototype.processImageResult = function(error, result, folderName, callback) {
    this.handleError(error)
    randomItem = this.getRandomItemInArray(result.files)
    
    var tempDest = tmp.dirSync()
    var tempFilePath = path.resolve(tempDest.name, randomItem.name)
    var tempFileDest = fs.createWriteStream(tempFilePath);

    this.drive.files.get({
        auth: this.apiKey,
        fileId: randomItem.id,
        mimeType: randomItem.mimeType,
        alt: 'media'
    })
    .on('end', function() {
        this.imageDownloaded(folderName, tempDest, tempFilePath, callback)
    }.bind(this))
    .on('error', this.handleError)
    .pipe(tempFileDest)   
}

GoogleDriveImageRandomizer.prototype.imageDownloaded = function(folderName, tempDest, imagePath, callback) {
    var image = {
        folderName : folderName,
        imagePath : imagePath
    }
    callback(image)
}

GoogleDriveImageRandomizer.prototype.getRandomItemInArray = function(array) {
    return array[Math.floor(Math.random() * array.length)]
}

GoogleDriveImageRandomizer.prototype.shuffleFolderDirectory = function(folderArray) {
    this.shuffledFolders = _.shuffle(folderArray)
    console.log('Directories inside parent folder' + this.parentFolderId + ' shuffled.')
}

GoogleDriveImageRandomizer.prototype.handleError = function(error) {
    if (error) {
        throw error;
    }
}

module.exports = GoogleDriveImageRandomizer