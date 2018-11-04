/*
 *
 * Proverbs in proverbs.txt are from:
 * https://www.engvid.com/english-resource/50-common-proverbs-sayings/
 * 
*/

const fs = require('fs');

const proverbs = {};

proverbs.allProverbs = function () {
    var fileContents = fs.readFileSync(__dirname + '/proverbs.txt', 'utf8');
    var arrayOfProverbs = fileContents.split(/\r?\n/);
    return arrayOfProverbs;
};

module.exports = proverbs;