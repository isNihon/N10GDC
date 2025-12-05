
var dbconfig = require('./config');
var connectionString = dbconfig.SQL_CONN;
const friendly = require('tedious-friendly');
const TYPES = friendly.tedious.TYPES;
const connectionConfig = { options: { useUTC: true } };
const poolConfig = { min: 1, max: 3, log: false };
//   connection pool
const db = friendly.create({ connectionString, connectionConfig, poolConfig });
module.exports = function(app, passport) {

const reenvioDePassword =  require('./reenvioDePassword');


	// =====================================
	// HOME PAGE (with login links) ========
    // =====================================
	app.get('/', function(req, res) {
        //res.render('index', { title: 'APPCF' }); // load the index.ejs file
        res.render('login', { message: req.flash('loginMessage') });
        //res.render('presentation')
        //res.redirect('/login');
    });

	// LOGIN ===============================
	// show the login form
	app.get('/login', function(req, res) {
		// render the page and pass in any flash data if it exists
		//res.render('login', { message: req.flash('loginMessage') });
    });

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/inicio?lang=es', // redirect to the secure profile section
            failureRedirect : '/', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
		}),
        function(req, res) {
            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });

	// SIGNUP =============================
	// show the signup form
	app.get('/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('Registrar', { message: req.flash('signupMessage') });
	});




//------------------------------------------------------configuracion de usuarios
 //Es para poder acceder a las opciones desde la base de datos
 app.get('/config/users', isLoggedIn,function(req, res){
    db.query("Select distinct name from profiles  ", (err, profiles) => {
        if (err)
            console.log(err)
        console.log(profiles)
        res.render('user',{ user:req.user[0], perfiles:profiles})
        
    })
})
//_----reeenvia un correo con la contraceña
app.get('/REENVIO/DE/CONTRACEnA',  function(req, res){
    id=parseInt(req.query.id)
        var query = "select * FROM users where [user]="+id
        db.query(query,  (err, users) => {
            if (err){
                console.log(err)
            }else if (users.length > 0 ){
                res.send({ mesage:'OK'})
                reenvioDePassword.emailRAE(users)
            } else {
                res.send({ mesage:'NOT'})
            }
        })
    })
//--------------configuracion de usuarios
app.get('/tables/users',isLoggedIn,  function(req, res){
    var query = "select * FROM users "
    db.query(query,  (err, users) => {
        if (err)
            console.log(err)
        if (users.length > 0 ){
            res.send(users)
        } else {
            res.send({})
        }
    })
})
 //-----------realiza busqueda del usuario si existe o no
 app.get("/data/user", isLoggedIn, function(req, res){
    db.query("Select * from [users] where [user] = @number",{number:[TYPES.Int, req.query.number]}, (err, data)=>{
        if (err)
            console.log(err)
        if (data.length > 0){
            res.send({status:'ok', mesage:'El usuario ya existe'})
        } else {
            res.send({status:'error', mesage:'El usuario no existe'})
        }
        
    })
})









//------------------------------------------------------configuracion de usuarios



 //----------------------------------------------------------configuracion de Formats
    //redirige a la view de reports
    app.get('/config/report', isLoggedIn,function(req, res){
        db.query("Select distinct name from profiles  ", (err, profiles) => {
            if (err)
                console.log(err)
            console.log(profiles)
            res.render('reportes',{ user:req.user[0], perfiles:profiles})
            
        })
    })

    //_------formato principal
    //----------------------------TABALA DE MOVIMIENTOS
    app.get('/tables/MOVIMIENTOS/invent/FOR/',isLoggedIn,  function(req, res){

        var query = "SELECT top 1000  NUMBERPART.*, DETALLE.*FROM   NUMBERPART INNER JOIN DETALLE ON NUMBERPART.Id = DETALLE.idRef; "
        if(req.query.tp==0){
        }else if(req.query.tp==1){
            query=req.query.vard
        }

        db.query(query,  (err, users) => {
            if (err)
                console.log(err)
            if (users.length > 0 ){
                res.send(users)
            } else {
                res.send({})
            }
        })
    })

 //-----------------TABLA DE FORMATOS EN LINEA
    app.get('/tables/form/line/',isLoggedIn,  function(req, res){

        var query = "select top 1000 * FROM  NUMBERPART "
        if(req.query.tp==0){
        }else if(req.query.tp==1){
            query=req.query.vard
        }

        db.query(query,  (err, users) => {
            if (err)
                console.log(err)
            if (users.length > 0 ){
                res.send(users)
            } else {
                res.send({})
            }
        })
    })
    
    //tabla de mis documento    
    app.get('/tables/tabDocs',  function(req, res){
        var id=req.query.id
        var query = "select * FROM documentos where idPlanPro="+id
        db.query(query, (err, users,) => {
                if (err)
                console.log(err)
                if (users.length > 0 ){
                    res.send(users)
                } else  {
                    res.send({})
                }
            })   
        })
    //_------formato principal


    
    //-----detalle
     //optiene item de Detalle   
    app.get('/refres/val/data',  function(req, res){
        var id=req.query.id
        var query = "select * FROM DETALLE where Id="+id
        db.query(query, (err, users,) => {
                if (err)
                console.log(err)
                if (users.length > 0 ){
                    res.send(users)
                } else  {
                    res.send({})
                }
            })   
        })
    //tabla de detalle de formato
    app.get('/tables/report/detalle/',isLoggedIn,  function(req, res){
        var query = "select * FROM DETALLE where idRef="+req.query.id
        db.query(query,  (err, users) => {
            if (err)
                console.log(err)
            if (users.length > 0 ){
                res.send(users)
            } else {
                res.send({})
            }
        })
    })
      //tabla de mis documento    
    app.get('/tables/movimientos/reference/',  function(req, res){
        var id=req.query.id
        var query = "select * FROM eventos where idM="+id
        db.query(query, (err, users,) => {
                if (err)
                console.log(err)
                if (users.length > 0 ){
                    res.send(users)
                } else  {
                    res.send({})
                }
            })   
        })
    //regresamis documentos
    app.get('/respuesta/documentos/miniatura',  function(req, res,){
            
        let id=req.query.id
                
        var query = " SELECT * from documentos where idPlanPro="+id +"ORDER BY id asc"
            db.query(query, (err, users,) => {
                // console.log(users)
                // console.table(users)
                if (err)
            console.log(err)
            if (users.length > 0 ){
                res.render('documentos',{ datos:users}) 
            } else {
                res.render('documentos',{ datos:users}) 
                // res.render({})
            }
        }) 
    })
    //-----detalle
 //----------------------------------------------------------configuracion de Formats



//----------------------------------------------------------print and notfy
    //optiene item de Detalle   
    app.get('/tables/NotFy/correo',  function(req, res){
        var id=req.query.id
        var query = "select * FROM Notfy where idM="+id
        db.query(query, (err, users,) => {
                if (err)
                console.log(err)
                if (users.length > 0 ){
                    res.send(users)
                } else  {
                    res.send({})
                }
            })   
        })
    //oget info impresora   
    app.get('/get/info/print/',  function(req, res){
  
        var query = "select top 1 * FROM printConfy"
        db.query(query, (err, users,) => {
                if (err)
                console.log(err)
                if (users.length > 0 ){
                    res.send(users)
                } else  {
                    res.send({})
                }
            })   
        })
//----------------------------------------------------------print and notfy





//---------------------------------------------------------ACCESO DE REPORTES DE MONITOREO DE FORMATOS
//redirige a la view de reports
app.get('/config/reports/config/hidtorico/', isLoggedIn,function(req, res){
    db.query("Select distinct name from profiles  ", (err, profiles) => {
        if (err)
            console.log(err)
        console.log(profiles)
        res.render('History',{ user:req.user[0], perfiles:profiles})
        
    })
})


//------------------------tablas
    //---tabla de etiquetas
    app.get('/tables/label/history/',  function(req, res){

        var query = "select top 1000 * FROM LabelsPrint "
        if(req.query.tp==0){
        }else if(req.query.tp==1){
            query=req.query.vard
        }

        db.query(query, (err, users,) => {
                if (err)
                console.log(err)
                if (users.length > 0 ){
                    res.send(users)
                } else  {
                    res.send({})
                }
            })   
        })

    //---tabla de movimientos
    app.get('/tables/movimient/history/',  function(req, res){

        var query = "select top 1000 * FROM eventos  "

        if(req.query.tp==0){
        }else if(req.query.tp==1){
            query=req.query.vard
        }
        db.query(query, (err, users,) => {
                if (err)
                console.log(err)
                if (users.length > 0 ){
                    res.send(users)
                } else  {
                    res.send({})
                }
            })   
        })
//------------------------tablas

//---------------------------------------------------------ACCESO DE REPORTES DE MONITOREO DE FORMATOS




//------mov scanner


///---editar si escanea un valor equivocado devlover vacio
//--optiene dato s
app.get('/Get/date/val/Detall/',  function(req, res){

    
    var query = "SELECT top 1  NUMBERPART.*, DETALLE.* FROM   NUMBERPART INNER JOIN DETALLE  ON NUMBERPART.Id = DETALLE.idRef where DETALLE.Id="+req.query.id

    db.query(query, (err, users,) => {
            if (err)
            console.log(err)
            if (users.length > 0 ){

                //res.send(users)
                res.send({users:users,status:'ok'})

            } else  {
                res.send({})
            }
        })   
    })



//------mov scanner






    /********************* data per input *********************/
 
	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
        //req.logout();
		res.redirect('/');
    });

//-------------------PENDIENTE POR VALIDAR

};

// route middleware to make sure
function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();
	// if they aren't redirect them to the home page
    //res.redirect('/lo');
    res.send("<div style='widht:100%; font-size:3em; text-aling:center; padding:40px;margin-left:100px;'><a href='.\'>Tu usuario no es valido, por favor ingresa Aqui...</a></div>")
}
