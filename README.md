# mssql-to-csv-query
Node.js module to export MS SQL database to CSV, 

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
        tables: [{name:"trades"}], // empty to export all the tables
        outputDirectory: 'somedir',
        log: true,
        header: false, // true to export column names as csv header
	// queryString is optional, and was added by me after forking the original project mssql-to-csv
        // by default mssql-to-csv-query run 'select * from <each table in tables>'
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

