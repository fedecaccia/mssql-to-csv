var sql = require('mssql');
var csv = require("fast-csv");
var fs = require('fs');

var options = {
    ignoreList: ["sysdiagrams"],
    outputDirectory: '.',
    log: true,
    header: false,
    queryString: '',
    fileName:'default'
};

module.exports = {    
    
    exportQuery: function (queryString, fileName, outputDirectory) {
        return new Promise(function (resolve, reject) {
            var csvStream = csv.format({ headers: false, quoteColumns: true }),
                writableStream = fs.createWriteStream(outputDirectory + "/" + fileName + ".csv", { encoding: "utf8" });
            writableStream.on("finish", function () {
                resolve();
            });
            csvStream.pipe(writableStream);
            var request = new sql.Request();
            request.stream = true;
            request.query(queryString);

            if (options.header) {
                request.on('recordset', function (columns) {
                    var keys = [];
                    for (var key in columns) {
                        if (columns.hasOwnProperty(key)) {
                            keys.push(key);
                        }
                    }
                    csvStream.write(keys);
                });
            }
            request.on('row', function (row) {
                // fix for null values getting replaced with empty string
                for (var key in row) {
                    if (row.hasOwnProperty(key) && row[key] == null) {
                        row[key] = "null";
                    }
                }
                csvStream.write(row);
            });
            request.on('error', function (err) {
                reject(err);
            });
            request.on('done', function (returnValue) {
                csvStream.end();
            });
        });
    },
    updateOptions: function (opts) {
        if(!opts) {
            return options;
        }
        if(opts.ignoreList && Array.isArray(opts.ignoreList)) {
            options.ignoreList = opts.ignoreList;
        }
        if(opts.outputDirectory && opts.outputDirectory.length) {
            options.outputDirectory = opts.outputDirectory;
        }
        if(opts.log !== 'undefined') {
            options.log = opts.log;
        }
        if(opts.header !== 'undefined') {
            options.header = opts.header;
        }
        if(opts.fileName !== 'undefined') {
            options.fileName = opts.fileName;
        }
        if(opts.queryString !== 'undefined') {
            options.queryString = opts.queryString;
        } else {
            throw new Error("No query string provided");
        }
        return options;
    }
}