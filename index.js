var util = require("./lib/util");
var fs = require("fs");
var sql = require('mssql');
const { resolve } = require("path");


module.exports = function (dbconfig, options) {

    try {
        options = util.updateOptions(options);
        if (fs.existsSync(options.outputDirectory) == false) {
            fs.mkdirSync(options.outputDirectory);
        }
    }
    catch (err) {
        return Promise.reject(err);
    }

    options.log && console.log("Connecting to the database:", dbconfig.database, "...");
    
    sql.connect(dbconfig)
    .then(function () {
        
        util.exportQuery(options.queryString, options.fileName, options.outputDirectory)        
        .then(function () {
            options.log && console.log("Query exported to:", options.outputDirectory);
            sql.close()
            .then((res) => {
                resolve();
            })
            .catch(function (err) {                
                throw (err);
            });
        })
        .catch(function (err) {
            sql.close();
            throw (err);
        });
    })
    .catch(function (err) {
        sql.close();
        throw (err);
    });
}
