const fs = require('fs');

function getFiles (pattern) {
    const files = fs.readdirSync(__dirname).filter(function (file) {
        return file.match(new RegExp(pattern));
    });
    return files.map((file) => require(`./${file}`));
}

module.exports = {
    controllers: getFiles('.ctrl.js'),
};

