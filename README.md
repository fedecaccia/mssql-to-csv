# mssql-to-csv-query
Node.js module to export MS SQL database to CSV, using a specific query (could be a call to a store procedure).

## Installation

  npm install mssql-to-csv-query --save

## Usage
```javascript
    var mssqlExport = require('mssql-to-csv-query')

    // All config options supported by https://www.npmjs.com/package/mssql
    var dbconfig = {
        user: 'username',
        password: 'pass',
        server: 'servername',
        database: 'dbname',
        requestTimeout: 320000,
        pool: {
            max: 20,
            min: 12,
            idleTimeoutMillis: 30000
        }
    };

    var options = {
        ignoreList: [], // tables to ignore        
        outputDirectory: 'somedir',
        fileName: 'default',
        log: true,
        header: false, // true to export column names as csv header
	    queryString: 'select * from trades where id>0'
    };

    mssqlExport(dbconfig, options).then(function(){
        console.log("All done successfully!");
        process.exit(0);
    }).catch(function(err){
        console.log(err.toString());
        process.exit(-1);
    });
```

