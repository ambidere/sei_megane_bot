var fs = require('fs');
var path = require('path');

var SUPPORTED_IMG_TYPES = ['image/png', 'image/jpeg', 'image/gif'];

var LocalImageRepositoryRandomizer = function(folder) {
    this.folder = folder
}

LocalImageRepositoryRandomizer.prototype.getRandomFile = function() {
    const isDirectory = source => fs.lstatSync(source).isDirectory();
    const getDirectories = source => fs.readdirSync(source).map(name => path.resolve(source, name)).filter(isDirectory);

    directories = getDirectories(this.folder);
    randomFolder = this.getRandomItemInArray(directories);
    randomFolderName = randomFolder.split(path.sep).pop();

    filesInRandomFolder = this.getFilesInFolder(randomFolder);
    randomFile = path.resolve(randomFolder, this.getRandomItemInArray(filesInRandomFolder));

    return {
        folderName : randomFolderName,
        imagePath : randomFile
    }
}

LocalImageRepositoryRandomizer.prototype.getRandomItemInArray = function(array) {
    return array[Math.floor(Math.random() * array.length)]
}

LocalImageRepositoryRandomizer.prototype.getFilesInFolder = function(folder) {
    filesInRandomFolder = []
    fs.readdirSync(randomFolder).forEach(file => {
        filesInRandomFolder.push(file)
    });
    return filesInRandomFolder;
}

module.exports = LocalImageRepositoryRandomizer;