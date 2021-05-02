//require file system module
const fs = require('fs');

// pass file path and delete file
const deleteFile = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            throw (err);
        }
    })
}

//export deleteFile
exports.deleteFile = deleteFile;