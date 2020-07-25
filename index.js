var util = require("./lib/util");
var fs = require("fs");
var sql = require('mssql');
const { resolve } = require("path");


module.exports = function (dbconfig, options) {

    return new Promise((resolve, reject) => {

        try {
            options = util.updateOptions(options);
            if (fs.existsSync(options.outputDirectory) == false) {
                fs.mkdirSync(options.outputDirectory);
            }
        }
        catch (err) {
            return reject(err);
        }
    
        options.log && console.log("Connecting to the database:", dbconfig.database, "...");
        
        sql.connect(dbconfig)
        .then(function () {
            
            util.exportQuery(options.queryString, options.fileName, options.outputDirectory)        
            .then(function () {
    
                options.log && console.log("Query exported to:", options.outputDirectory);
                sql.close()
                .then((res) => {
                    return resolve(res);
                })
                .catch(function (err) {                
                    return reject(err);
                });
            })
            .catch(function (err) {
                sql.close();
                return reject(err);
            });
        })
        .catch(function (err) {
            sql.close();
            return reject(err);
        });
    });    
}