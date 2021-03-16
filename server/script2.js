module.exports = function (content,back) {

   let content1 ="let r=4 let y=4 let c=3,5"
   let content2 = `let c=3,5 let y=4 let r=4`
   let callback = back;

    var pos = require('pos');
    var crc = require('crc');
    var fs = require('fs');
    var async = require('async');

    var SHINGLE_LENGTH = 1;

    function escapeForRegExp(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }

    function strWordRemove(text, entry) {
        var regex = new RegExp('(^|\\s)' + escapeForRegExp(entry) + '(?=\\s|$)', 'g');
        return text.replace(regex, '');
    }

    function strCharacterRemove(text, entry) {
        var regex = new RegExp(escapeForRegExp(entry), 'g');
        return text.replace(regex, '');
    }

    function textCanonization (text, callback) {
        var withoutTagsRegex = /(<([^>]+)>)/ig;
        text = text.replace(withoutTagsRegex, "");
        text = text.trim();
        ['”', '“', "\n", '\r', ',', '.', ':', '$', '#', '"', '(', ')', '[', ']', ';'].forEach(function(entry) {
            text = strCharacterRemove(text, entry);
        });

        var words = new pos.Lexer().lex(text);
        var taggedWords = new pos.Tagger().tag(words);

        var removeWords = [];
        var nounWords = [];

        for (var i in taggedWords) {
            var taggedWord = taggedWords[i];
            var word = taggedWord[0];
            var tag = taggedWord[1];
            if (tag === 'NNS') {
                nounWords.push(word);
            }

            if (['JJ', 'JJR', 'JJS', 'CC', 'IN', 'TO', 'UH', 'DT'].indexOf(tag) !== -1) {
                removeWords.push(word);
            }
        }

        removeWords.forEach(function(entry) {
            text = strWordRemove(text, entry);
        });
        nounWords.forEach(function (entry) {
            if (entry.length > 2 && entry.slice(-2) === "’s") {
                return;
            }

            var newOne = '';

            if (entry.length > 3 && entry.slice(-3) === "ies") {
                newOne = entry.slice(0, -3) + 'y';
            } else if (entry.length > 2 && entry.slice(-1) === "s") {
                newOne = entry.slice(0, -1);
            } else {
                return;
            }

            var rexp = new RegExp('(^|\\s)' + escapeForRegExp(entry) + '(?=\\s|$)', 'g');
            text = text.replace(rexp, "$1" + newOne);
        });
        text = text.replace(/ +(?= )/g, '');

        return callback(null, text);
    }

    var makeShingles = function (text, callback) {
        var words = text.split(' ');
        var shingles = [];
        var wordsLength = words.length;

        if (wordsLength < SHINGLE_LENGTH) {
            shingles.push(words.join(' '));
        } else {
            while (shingles.length !== (wordsLength - SHINGLE_LENGTH + 1)) {
                shingles.push(words.slice(0, SHINGLE_LENGTH).join(' '));
                words = words.slice(1);
            }
        }

        return callback(null, shingles);
    };

    var hashingShingles = function (shingles, callback) {
        var hashes = [];
        for (var i = 0, n = 1; i < n; i++) {
            var hashedArr = [];
            for (var j = 0, k = shingles.length; j < k; j++) {
                hashedArr.push(crc.crc32(shingles[j]));
            }
            hashes.push(hashedArr);
        }

        return callback(null, hashes);
    };
    async.parallel([
        function (callback) {
            textCanonization(content1, function (err, text) {
                if (err) {
                    return callback(err);
                }

                makeShingles(text, function (err, shingles) {
                    if (err) {
                        return callback(err);
                    }

                    hashingShingles(shingles, function (err, hashes) {
                        if (err) {
                            return callback(err);
                        }

                        callback(null, hashes);
                    });
                })
            });
        },
        function (callback) {
            textCanonization(content2, function (err, text) {
                if (err) {
                    return callback(err);
                }
                makeShingles(text, function (err, shingles) {
                    if (err) {
                        return callback(err);
                    }
                    hashingShingles(shingles, function (err, hashes) {
                        if (err) {
                            return callback(err);
                        }
                        return callback(null, hashes);
                    });
                })
            });
        }
    ], function (err, results) {
        if(err) {
            callback(err);
            return ;
        }

        var firstHashes = results[0];
        var secondHashes = results[1];


        var compareShingles = function (arr1, arr2) {
            var count = 0;
            arr1[0].forEach(function (item) {
                if (arr2[0].includes(item)) {
                    count++;
                }
            });

            return (count * 2) / (arr1[0].length + arr2[0].length)*100;
        };

        var c = compareShingles(firstHashes, secondHashes);
        callback(null, c);
    });
};
