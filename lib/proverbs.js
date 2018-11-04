const fs = require('fs');

const proverbs = {};

proverbs.allProverbs = function () {
    var fileContents = fs.readFileSync(__dirname + '/proverbs.txt', 'utf8');
    var arrayOfProverbs = fileContents.split(/\r?\n/);
    return arrayOfProverbs;
};

module.exports = proverbs;