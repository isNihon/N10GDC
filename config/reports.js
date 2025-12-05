var dbconfig = require('./config');
var ja = require('./language/japanesse.js');
var es = require('./language/spanish.js');
var en = require('./language/english.js');
var Sync = require('sync');

var connectionString = dbconfig.SQL_CONN;
const friendly = require('tedious-friendly');
const TYPES = friendly.tedious.TYPES;
const connectionConfig = { options: { useUTC: true } };
const poolConfig = { min: 2, max: 4, log: false };

// create connection pool
const db = friendly.create({ connectionString, connectionConfig, poolConfig });

var fs = require('fs')
module.exports = function(app, passport) {

    app.get('/Inicio', isLoggedIn,  function (req, res) {
        //(req.headers)
        //console.log(req.user)
        if (req.query.lang){
            if (req.query.lang == 'es'){
                language = es
            } else if (req.query.lang == 'en-au'){
                language = en
            } else if (req.query.lang == 'ja'){
                language = ja
            }
        } else {
            language = en
        }
        Sync(function(){
            try { 
                    res.render('inicio', {'user':req.user[0], language:language})
            }
            catch (e) {
                console.error(e);
            }
        })   
          
    });

  

   

}


function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
    //res.redirect('/login');
    res.send("<div style='widht:100%; font-size:3em; text-aling:center; padding:40px;margin-left:100px;'><a href='.\'>Tu usuario no es valido, por favor ingresa Aqui...</a></div>")
}

