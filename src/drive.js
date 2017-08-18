var util = require('util')
var google = require('googleapis');

var GoogleDriveImageRandomizer = function(apiKey, parentFolderId) {
    this.apiKey = apiKey;
    this.parentFolderId = parentFolderId;
    this.subFolders = []
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
}

GoogleDriveImageRandomizer.prototype.processEachFolder = function(folder) {
    // var subFolder = {
    //     'id' : folder.id,
    //     'name' : folder.name
    // }
    // subFolders.push(subFolder)
    this.drive.files.list({
        q: util.format("'%s' in parents and mimeType contains 'image/'", folder.id),
        key: this.apiKey
    }, (error, result) => this.processEachImage(error, result, folder))
}

GoogleDriveImageRandomizer.prototype.processImageResult = function(error, result, folder) {
    this.handleError(error)
    result.files.forEach(this.processEachImage.bind(this))
}

GoogleDriveImageRandomizer.prototype.processEachImage = function(image) {
    console.log(image)
}

GoogleDriveImageRandomizer.prototype.handleError = function(error) {
    if (error) {
        throw error;
    }
}

module.exports = GoogleDriveImageRandomizer