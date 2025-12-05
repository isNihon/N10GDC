var dbconfig = require('./config');
var fs = require('fs');
var multer = require('multer');
var connectionString = dbconfig.SQL_CONN;
const friendly = require('tedious-friendly');
const TYPES = friendly.tedious.TYPES;
const connectionConfig = { options: { useUTC: true } };
const poolConfig = { min: 2, max: 4, log: false };

//emite correos sobre la resolucion usuario 0
const sendNotfy =  require('./sendNotfy');

const db = friendly.create({ connectionString, connectionConfig, poolConfig });
module.exports = function (app, passport) {


//------------------------------------------------------configuracion de usuarios
//modifica los datos de mi usuario
app.put('/config/user',isLoggedIn,  function (req, res) {

    admin = 0
    acces1 = 0
    acces2 = 0
    acces3 = 0
    acces4 = 0
    acces5 = 0
    acces6 = 0

    if (req.body.admin == "on"){admin = 1}
    if (req.body.acces1 == "on"){acces1 = 1}
    if (req.body.acces2 == "on"){acces2 = 1}
    if (req.body.acces3 == "on"){acces3 = 1}
    if (req.body.acces4 == "on"){acces4 = 1}
    if (req.body.acces5 == "on"){acces5 = 1}
    if (req.body.acces6 == "on"){acces6 = 1}

    var values = {
        idControl:[TYPES.Int, req.body.idControl],
        number:[TYPES.Int, req.body.number],
        password:[TYPES.NVarChar, req.body.password],
        name:[TYPES.NVarChar, req.body.name],
        admin:[TYPES.Int, admin],
        acces1:[TYPES.Int, acces1],
        acces2:[TYPES.Int, acces2],
        acces3:[TYPES.Int, acces3],
        acces4:[TYPES.Int, acces4],
        acces5:[TYPES.Int, acces5],
        acces6:[TYPES.Int, acces6],
        position:[TYPES.NVarChar, req.body.position],
        email:[TYPES.VarChar, req.body.email],
        depto:[TYPES.NVarChar, req.body.depto],
    }

    var query = "update users set  password=@password , name=@name , admin=@admin , position=@position , email=@email , depto=@depto , [user]=@number    "
        query=query+",acces1=@acces1 ,acces2=@acces2, acces3=@acces3, acces4=@acces4, acces5=@acces5, acces6=@acces6 "
        query=query+" where Id=@idControl"
    db.query(query, values ,  (err, rows) => {
        if (err) {
            res.send({status:'error', mensage:err})
            console.log(err);
        } else {
            res.send({status:'ok', mensage:'Se actualizo el usuario de manera correcta'})
            
        }
    });
});
 //configurar contraceña
 app.put('/actualizar/PASSWORD/VALIDAR/USUARIO',isLoggedIn,  function (req, res) {
    var values = {
        password:[TYPES.NVarChar,req.body. newPass],
        Id:[TYPES.Int, req.user[0].Id]
    }
    var query = "update users set password = @password   where Id = @Id "
    db.query(query, values ,  (err, rows) => {
        if (err) {
            res.send({status:'error', mensage:err})
            console.log(err);
        } else {
            var data = ''+ req.body.number + ' ' + req.body.password;
            var name = req.body.number;
            res.send({status:'ok', mensage:'Se actualizo rregistro'})
        }
    });
});
//modifica si se habilita o no al usuario
app.put('/up/user/on',isLoggedIn,  function (req, res) {
    var on=0

    if(req.body.on==0){on=1}
    if(req.body.on==1){on=0}

    var values = {
        idControl:[TYPES.Int, req.body.id],
        on:[TYPES.Int,on],
    }

    var query = "update users set   [disabled]=@on where Id=@idControl  "
    db.query(query, values ,  (err, rows) => {
        if (err) {
            res.send({status:'error', mensage:err})
            console.log(err);
        } else {
            res.send({status:'ok', mensage:'Se actualizo el usuario de manera correcta'})
            
        }
    });
});
//------------------------------------------------------configuracion de usuarios





//----------------------------------------------------------configuracion de Formats
//_------formato principal
//ACTUALIZA MI FORMATO PRINCIPAL
app.put('/register/reporte/',isLoggedIn, function (req, res) {
    var date = new Date()
    var tiempo = newDate(date)
    var values = {

    id:[TYPES.Int, req.body.idFP],
    PartNumber:[TYPES.NVarChar, req.body.PartNumber],
    Model:[TYPES.NVarChar, req.body.Model],
    Description:[TYPES.NVarChar, req.body.Description],
    updateDate:[TYPES.NVarChar,tiempo],
    userId:[TYPES.Int,req.user[0].Id]
    }

    var query = "update NUMBERPART set "
    query =query+ " Number=@PartNumber,Modelo=@Model ,[Desc]=@Description,Fecha=@updateDate,[user]=@userId"
    query =query+ " where Id = @id"

        db.query(query, values ,  (err,valor) => {
            if (err) {
                console.log(err);
            } else {
            res.send({status:'ok', mensage:'Datos agregados',id:req.body.idFP})
        }
    });
    
});
//_------formato principal


//-----detalle
//------------------ACTUALIZA MI DETALLE DE FORMATO
app.put('/register/reporte/detalle/',isLoggedIn,  function (req, res) {

    var date = new Date()
        var tiempo = newDate(date)
        var values = {
        id:[TYPES.Int,req.body.idd],
        SDC:[TYPES.NVarChar, req.body.SDC],
        FPO:[TYPES.NVarChar, req.body.FPO],
        FF:[TYPES.NVarChar, req.body.FF],
        Nivel:[TYPES.NVarChar, req.body.Nivel],
        Ubicacion:[TYPES.NVarChar, req.body.Ubicacion],
        Cantidad:[TYPES.Int,req.body.Cant],
        SDS:[TYPES.NVarChar, req.body.SDS],
        PRECIO:[TYPES.Float, req.body.PRECIO],
        PROVEEDOR:[TYPES.NVarChar, req.body.PROVEEDOR],
        COLOR:[TYPES.NVarChar, req.body.COLOR],
        UM:[TYPES.NVarChar, req.body.UM],
        updateDate:[TYPES.NVarChar,tiempo],
        }
    
        var query = "update DETALLE set "
        query =query+ " FPO=@FPO,FFIN=@FF,NIVEL=@Nivel,UBIC=@Ubicacion,CANTIDAD=@Cantidad,"
        query =query+ " Fecha=@updateDate,SDS=@SDS,PRECIO=@PRECIO,"
        query =query+ " PROVEEDOR=@PROVEEDOR,COLOR=@COLOR,UM=@UM,SDC=@SDC"
        query =query+ " where Id = @id"
        
        db.query(query, values ,  (err,valor) => {
                if (err) {
                    console.log(err);
                } else {
                res.send({status:'ok', mensage:'Datos guardados',id:req.body.idd})
            }
        });
    });
//-----detalle
//----------------------------------------------------------configuracion de Formats





//----------------------------------------------------------configuracion de print and notfy
app.put('/notify/number/part/',isLoggedIn,  function (req, res) {

    var date = new Date()
    var tiempo = newDateNotFy(date)
    var values = {
        id:[TYPES.Int,req.body.idM1],
        PERIODO:[TYPES.Int,req.body.PERIODO],
        updateDate:[TYPES.NVarChar,tiempo]
    }

    var query = "update DETALLE set  "
    query =query+ "  Notfy=@PERIODO,detNotfy=   "
    query =query+ "  (SELECT CONVERT(VARCHAR, DATEADD(DAY, -@PERIODO,  "
    query =query+ "  (select top 1  FFIN from DETALLE where Id=@id)  "
    query =query+ "  ), 23) AS Fecha)  "
    query =query+ "  where Id = @id "
    
    db.query(query, values ,  (err,valor) => {
            if (err) {
                console.log(err);
            } else {
            res.send({status:'ok', mensage:'Datos guardados'})
        }
    });
});

//---confy print set
app.put('/config/print/ifet/con/',isLoggedIn,  function (req, res) {

    var date = new Date()
    var tiempo = newDate(date)

    var values = {

    ZPL:[TYPES.NVarChar, req.body.ZPL],
    IPPrint:[TYPES.NVarChar, req.body.IPPrint],
    PORT:[TYPES.Int, req.body.PORT],

    updateDate:[TYPES.NVarChar,tiempo],
    userId:[TYPES.Int,req.user[0].Id]
    }

    var query = "update printConfy set "
    query =query+ " zpl=@ZPL,"
    query =query+ " IP=@IPPrint,"
    query =query+ " port=@PORT,"
    query =query+ " Fecha=@updateDate,"
    query =query+ " [user]=@userId"

    
    db.query(query, values ,  (err,valor) => {
            if (err) {
                console.log(err);
            } else {
            res.send({status:'ok', mensage:'Datos guardados'})
        }
    });


});








//pendiente por configurar para comparar el agregado de la fecha, 
  //---tabla de movimientos
  app.put('/dat/get/notFy/Get/',  function(req, res){
    var date = new Date()
    var tiempo = newDate(date)
    var tiemponewDateNotFy = newDateNotFy(date)
    var hora=date.getHours()

    if(hora==11){
    var query = "select top 1 Id,FFIN,detNotfy,Notfy  "
        query =query+ " from DETALLE where Notfy > 0 and  "
        query =query+ "  detNotfy like '%"+tiemponewDateNotFy+"%'"

    //and detNotfy != CURDATE()
    db.query(query, (err, users,) => {

            if (err)
            console.log(err)
            if (users.length > 0 ){
                //-----correo de notificacion
                sendNotfy.email(users[0].Id)
            } else  {
                res.send({})
            }
        })  
    }

    })

//--------notfy---cont--TIME


//--------notfy---cont--TIME





//----------------------------------------------------------configuracion de print and notfy
    


//-------------------PENDIENTE POR VALIDAR
function pad(number, size) {
    var s = String(number);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}

function newDate(fecha1){
    var year = fecha1.getFullYear();
    var mes = fecha1.getMonth() + 1;
    var dia = fecha1.getDate();
    var fecha = year + '-' + pad(mes, 2) + '-' + pad(dia, 2) + ' ' + fecha1.getHours() + ':'+ fecha1.getMinutes() + ':' + fecha1.getSeconds()
    return fecha
}

function newDateNotFy(fecha1){
    var year = fecha1.getFullYear();
    var mes = fecha1.getMonth() + 1;
    var dia = fecha1.getDate();
    var fecha = year + '-' + pad(mes, 2) + '-' + pad(dia, 2) ;
    return fecha
}

};

function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();
    // if they aren't redirect them to the home page
    //res.redirect('/');
    res.send("<div style='widht:100%; font-size:3em; text-aling:center; padding:40px;margin-left:100px;'><a href='.\'>Tu usuario no es valido, por favor ingresa Aqui...</a></div>")
}
