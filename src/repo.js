var _ = require('lodash')
var fs = require('fs');
var path = require('path');

var LocalImageRepositoryRandomizer = function(folder) {
    this.folder = folder
    this.shuffleFolderDirectory(folder)
}

LocalImageRepositoryRandomizer.prototype.shuffleFolderDirectory = function(folder) {
    const isDirectory = source => fs.lstatSync(source).isDirectory();
    const getDirectories = source => fs.readdirSync(source).map(name => path.resolve(source, name)).filter(isDirectory);

    this.shuffledDirectories = _.shuffle(getDirectories(this.folder))
    console.log('Directories inside ' + this.folder + ' shuffled.')
}

LocalImageRepositoryRandomizer.prototype.getRandomFile = function() {
    if (!_.isEmpty(this.shuffledDirectories)) {
        var nextDirectoryPath = this.shuffledDirectories.shift();
        var nextDirectoryName = nextDirectoryPath.split(path.sep).pop();

        filesInRandomFolder = this.getFilesInFolder(nextDirectoryPath);
        randomFile = path.resolve(nextDirectoryPath, this.getRandomItemInArray(filesInRandomFolder));
    
        return {
            folderName : nextDirectoryName,
            imagePath : randomFile
        }
    }
    else {
        this.shuffleFolderDirectory(this.folder)
        return this.getRandomFile()
    }
}

LocalImageRepositoryRandomizer.prototype.getRandomItemInArray = function(array) {
    return array[Math.floor(Math.random() * array.length)]
}

LocalImageRepositoryRandomizer.prototype.getFilesInFolder = function(folder) {
    filesInFolder = []
    fs.readdirSync(folder).forEach(file => {
        filesInFolder.push(file)
    });
    return filesInFolder;
}

module.exports = LocalImageRepositoryRandomizer;