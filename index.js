var fs  = require('fs');
var argv = require('minimist')(process.argv.slice(2));
var async = require('async');
var _   = require('underscore');
_.str   = require('underscore.string');

var filename1 = argv.file1 || 'labels-in-ui.txt';
var filename2 = argv.file2 ||'labels-in-db.txt';

var words1 = [];
var words2 = [];

var outputFileName = argv.output || 'results.txt';

var options = {
    encoding: 'utf8'
};

fs.readFile(filename1, options, function(err, data){
    if(err){
        console.log(err);
    } else {
        words1 = _.str.words(data);
        fs.readFile(filename2, options, function(err, data){
            if(err){
                console.log(err);
            } else {
                words2 = _.str.words(data);

                words1.sort();
                words2.sort();

                words1 = _.uniq(words1);
                words2 = _.uniq(words2);

                console.log('file 1 ('+filename1+') has '+words1.length+' words');
                console.log('file 2 ('+filename2+') has '+words2.length+' words');


                //compare
                var missingIn1 = getMissing(words2, words1);
                var missingIn2 = getMissing(words1, words2);

                console.log('There are '+missingIn1.length +' words missing in file 1 ('+filename1+')')
                console.log('There are '+missingIn2.length +' words missing in file 2 ('+filename2+')')

                var str = missingIn1.length+ ' words missing in file: '+filename1+'\r\n\r\n';
                if(missingIn1.length > 0){
                    missingIn1.forEach(function(word){
                        str += word+'\r\n';
                    });
                } else {
                    str += 'No words missing.\r\n'
                }

                str += '\r\n';

                str += missingIn2.length + ' words missing in file: '+filename2+'\r\n\r\n';
                if(missingIn2.length > 0){
                    missingIn2.forEach(function(word){
                        str += word+'\r\n';
                    });
                } else {
                    str += 'No words missing.\r\n'
                }

                fs.writeFile(outputFileName, str, options, function(err){
                    if(err){
                        console.log(err);
                    } else {
                        console.log('file written');
                    }
                });
            }
        });
    }
});


//return the words that are missing in array 2 compared to array 1 (source) 
function getMissing(arr1, arr2){
    var missing = [];

    arr1.forEach(function(word){
        if(arr2.indexOf(word) == -1){
            missing.push(word);
        } 

    });

    return missing;
}