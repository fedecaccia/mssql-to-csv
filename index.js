var util = require("./lib/util");
var fs = require("fs");
var sql = require('mssql');


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
    return sql.connect(dbconfig)
    .then(function () {
        options.log && console.log("Starting DB export from", dbconfig.database, "...");       
        
        var exportPromise = options.tables.map(function (table) {
            return util.exportQuery(options.queryString, options.fileName, options.outputDirectory).then(function () {
                options.log && console.log(table.name + " CSV file exported!");
            });
        });
        return Promise.all(exportPromise)
        .then(function () {
            options.log && console.log("Query exported to:", options.outputDirectory);
            sql.close();
        });

    })
    .catch(function (err) {
        sql.close();
        throw (err);
    });
}
