//////////////////////////////////////////////////////////////////////////
// database
//////////////////////////////////////////////////////////////////////////
//
// Main module
//
// An interface to our mongodb backing that's pre-configured to work when
// hosted on Heroku and using a MongoLab db instance
//
/* ----------------------------------------------------------------------
                                                    Object Structures
-------------------------------------------------------------------------
	// Example config for heroku
	var dbConfig = {
		username: heroku_app15621334,
		password: fnosdofvurndllcifvnrflgn16,
		port: 27318,
		host: ds472896.mongolab.com:27318/heroku_app46364329
	}

	// Example config for local debugging
	var dbConfig = {
		port: 27318,
		host: localhost
	}
*/

//////////////////////////////////////////////////////////////////////////
// Namespace (lol)
var config = require("./config");


//////////////////////////////////////////////////////////////////////////
// Constructor
function Database() {
	this.db = {};
	this.isHeroku = process.env.MONGOLAB_URI === undefined ? true : false;
	this.dbConfig = isHeroku ? config.db.remote : config.db.local;
}


//////////////////////////////////////////////////////////////////////////
// Connect to and initialize our database
Database.prototype.init = function() {
	var _this = this;

	function setup( dbToSetup ) {
		dbToSetup.open( function(err, openedDb) {
			if( !err ) {
				console.log( "Successfully opened db" );

				// If we have a username and password, try to authenticate
				if( _this.dbConfig.username != undefined && _this.dbConfig.password != undefined ) {
					openedDb.authenticate( _this.dbConfig.username, _this.dbConfig.password, function(err, success) {
						if( !err || !_this.isHeroku ) {

		                    console.log( "Successfully connected to db" );
		                } else {
		                    console.log( "Error authenticating: " + err );
		                    console.log( "Host: " + _this.dbConfig.host );
		                    console.log( "Port: " + _this.dbConfig.port );
		                }
					});
				}				
			} else {
	            console.log( "Error opening DB: " + err );
	        }
		});
	}

	if( this.isHeroku ) {
	    console.log( "RUNNING ON HEROKU" );
	    
	    mongo.connect( process.env.MONGOLAB_URI, {}, function(error, connectedDb) {
	        console.log("connecting to db");
	        _this.db = connectedDb;

	        _this.db.close();

	        setup( _this.db );
	    });
	} else {
	    console.log( "RUNNING LOCALLY" );

	    var useLocalDb = true,
	        strDBURI = "";

	    if( useLocalDb ) {
	        strDBURI = "mongodb://" + _this.dbConfig.host ":" _this.dbConfig.port;
	        console.log( "Using local DB" );
	    } else {
	        strDBURI = "mongodb://" + _this.dbConfig.username + ":" + _this.dbConfig.password + "@" + _this.dbConfig.host;
	        console.log( "Using heroku/mongolab DB" );
	    }

	    mongo.connect( strDBURI, {}, function(error, connectedDb) {
	        if( connectedDb == null ) {
	            console.log( "Failed to connect to database" );
	            return;
	        }

	        console.log( "connected to db at " + strDBURI );
	        _this.db = connectedDb;
	        _this.db.close();
	        
	        setup( _this.db );
	    });
	}	
}


// leto-marker-database-prototypes