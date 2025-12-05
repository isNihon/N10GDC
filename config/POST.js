var config = require('./config');
var fs = require('fs');
var bcrypt = require('bcrypt-nodejs');
var bcrypt = require('bcrypt-nodejs');
var multer = require('multer');
var exec = require('child_process').execFile;

var connectionString = config.SQL_CONN;
const friendly = require('tedious-friendly');
const TYPES = friendly.tedious.TYPES;
const connectionConfig = { options: { useUTC: true } };
const poolConfig = { min: 4, max: 16, log: false };

//emite correos sobre la resolucion usuario 0
//const sendEresolucion =  require('./sendEresolucion');

//-------------------------------------------------------------------------------correos
var Storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "./public/files");
    },
    filename: function(req, file, callback) {
        callback(null, '' + "" + Date.now() + "_" + file.originalname);   
    }
});

var upload = multer({
    storage: Storage
}).array("imgUploader", 3); //Field name and max count
// create connection pool
const db = friendly.create({ connectionString, connectionConfig, poolConfig });

module.exports = function (app, passport) {

// process the signup form
app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/Inicio', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));



    //------------------------------------------------------configuracion de usuarios
    // AGREGA USUARIO DESDE BASE
    app.post('/config/user',isLoggedIn, function (req, res) {
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
        var query = "insert into users values ( @number,@password, @name,@admin, @position, @email, @depto,1,@acces1,@acces2,@acces3,@acces4,@acces5,@acces6) "
        db.query(query, values ,  (err, rows) => {
            if (err) {
                res.send({status:'error', mensage:err})
                console.log(err);
            } else {
                res.send({status:'ok', mensage:'Se agrego el usuario de manera correcta'})
            }
        });
    });

    //--------------------------------------------------------configuracion de usuarios




    //----------------------------------------------------------configuracion de Formats
    //_------formato principal
    //insertar registro en la tabla principal
    app.post('/register/reporte/',isLoggedIn, function (req, res) {
        var date = new Date()
        var tiempo = newDate(date)
        var values = {
        PartNumber:[TYPES.NVarChar, req.body.PartNumber],
        Model:[TYPES.NVarChar, req.body.Model],
        Description:[TYPES.NVarChar, req.body.Description],
        updateDate:[TYPES.NVarChar,tiempo],
        userId:[TYPES.Int,req.user[0].Id]
        }

        var query = "insert into NUMBERPART values (@PartNumber,@Model,@Description,@updateDate,@userId,'PENDIENTE'); SELECT SCOPE_IDENTITY() as 'id'; "
        db.query(query, values ,  (err,valor) => {
                if (err) {
                    console.log(err);
                } else {
                res.send({status:'ok', mensage:'Datos agregados',id:valor[0].id})
            }
        });
        
    });

    //----cancelar formato
    //produection--cancela docuemnto
    app.post('/data/cancelacion',isLoggedIn, function (req, res) {
        var date = new Date()
        var tiempo = newDate(date)
        var values = {
            id:[TYPES.Int,req.body.id],
            cancelada:[TYPES.NVarChar,'!!!CANCELADA!!!'],
            updateDate:[TYPES.NVarChar,tiempo]
        } 
        var query = "update NUMBERPART set  status=@cancelada,Fecha=@updateDate where Id=@id";
        db.query(query, values ,  (err,valor) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send({status:'cancelada', mensage:'CANCELADA'})
                }
            });
    }); 
    //_------formato principal


    //-----detalle
    //anexa detalle  de formato principal
    app.post('/register/reporte/detalle/',isLoggedIn, function (req, res) {
        var date = new Date()
        var tiempo = newDate(date)
        var values = {

        idForm:[TYPES.Int,req.body.idForm],
        FPO:[TYPES.NVarChar, req.body.FPO],
        FF:[TYPES.NVarChar, req.body.FF],
        Nivel:[TYPES.NVarChar, req.body.Nivel],
        Ubicacion:[TYPES.NVarChar, req.body.Ubicacion],
        Cantidad:[TYPES.Int,req.body.Cant],
        updateDate:[TYPES.NVarChar,tiempo],
        userId:[TYPES.Int,req.user[0].Id],
        SDS:[TYPES.NVarChar, req.body.SDS],
        SDC:[TYPES.NVarChar, req.body.SDC],
        PRECIO:[TYPES.Float, req.body.PRECIO],
        PROVEEDOR:[TYPES.NVarChar, req.body.PROVEEDOR],
        COLOR:[TYPES.NVarChar, req.body.COLOR],
        UM:[TYPES.NVarChar, req.body.UM],

        }
        var query = "insert into DETALLE values "
        query=query+"(@idForm,@FPO,@FF,@Nivel,@Ubicacion,@Cantidad,@updateDate"
        query=query+",@userId,@SDS,@PRECIO,@PROVEEDOR,@COLOR,@UM"
        query=query+",0,0,@Cantidad,0,0,0,0,0,@SDC,' ',0,0,0,0,0,0,0,0,0)"
        query=query+"; SELECT SCOPE_IDENTITY() as 'id'; "
        
        
        db.query(query, values ,  (err,valor) => {
                if (err) {
                    console.log(err);
                } else {
                res.send({status:'ok', mensage:'Datos agregados', id: valor[0].id,SDS:req.body.SDS})

            
            }
        });
        
    });
    //permite eliminar detalle de registro
    app.post('/data/eliminar/',isLoggedIn, function (req, res) {
        var values = {
            id:[TYPES.Int,req.body.id],
        } 

        var query = "DELETE  FROM DETALLE where id=@id  ";
        db.query(query, values ,  (err,valor) => {
            if (err) {
                
                console.log(err);
                    } else {
                        res.send({status:'ok', mensage:'ELIMINADO'})

                    }
                });
            }); 
    //insertar eventos
    app.post('/register/evento/',isLoggedIn, function (req, res) {
        var date = new Date()
        var tiempo = newDate(date)
        var values = {
        idM:[TYPES.Int, req.body.idM],//id de detalle
        idF:[TYPES.Int, req.body.idF],//id formato
        //SNP:[TYPES.Int, req.body.SNP],
        //PROD:[TYPES.Int, req.body.PROD],
        //NG:[TYPES.Int, req.body.NG],
        //TOT:[TYPES.Int, req.body.TOT],
        //U1:[TYPES.Int, req.body.U1],
        //U2:[TYPES.Int, req.body.U2],
        //U3:[TYPES.Int, req.body.U3],
        //U4:[TYPES.Int, req.body.U4],
        cunt:[TYPES.Int, req.body.cunt],
        MD:[TYPES.NVarChar, req.body.MD],
        NOTA:[TYPES.NVarChar, req.body.NOTA],
        CANTOT:[TYPES.Int, req.body.CANTOT],
        DT:[TYPES.NVarChar, req.body.DT],
        //PartN:[TYPES.NVarChar, req.body.PartN],
        //SDS:[TYPES.NVarChar, req.body.SDS],
        //UBI:[TYPES.NVarChar, req.body.UBI],
        date:[TYPES.NVarChar,tiempo],
        userId:[TYPES.Int,req.user[0].Id]
        }

        var query = "insert into eventos values (@idM,@idF,@cunt,@MD,@CANTOT,@DT,@date,@userId,@NOTA) ";
        db.query(query, values ,  (err,valor) => {
            if (err) {
                console.log(err);
            }   
            else {
                updateProd(req.body, res)
            } 
        });
    });


    //--actualiza m tabla de detalle
    function  updateProd(dato, res){
        var MD=dato.MD
        var DT=dato.DT

        if(dato.MD=="Disponible"){MD="RES"}
        if(dato.MD=="NG"){MD="NGT"}
        if(dato.MD=="Produccion"){MD="PRODT"}
        if(dato.MD=="U1"){MD="U1"}
        if(dato.MD=="U2"){MD="U2"}
        if(dato.MD=="U3"){MD="U3"}
        if(dato.MD=="U4"){MD="U4"}
        if(dato.MD=="U5"){MD="U5"}
        if(dato.MD=="U6"){MD="U6"}
        if(dato.MD=="U7"){MD="U7"}
        if(dato.MD=="U8"){MD="U8"}

        if(dato.MD=="U9"){MD="U9"}
        if(dato.MD=="U10"){MD="U10"}
        if(dato.MD=="U11"){MD="U11"}



        if(dato.MD=="Procesado"){MD="CtdO"}
        if(dato.DT=="Disponible"){DT="RES"}
        if(dato.DT=="NG"){DT="NGT"}
        if(dato.DT=="Produccion"){DT="PRODT"}
        if(dato.DT=="U1"){DT="U1"}
        if(dato.DT=="U2"){DT="U2"}
        if(dato.DT=="U3"){DT="U3"}
        if(dato.DT=="U4"){DT="U4"}
        if(dato.DT=="U5"){DT="U5"}
        if(dato.DT=="U6"){DT="U6"}
        if(dato.DT=="U7"){DT="U7"}
        if(dato.DT=="U8"){DT="U8"}

        if(dato.DT=="U9"){DT="U9"}
        if(dato.DT=="U10"){DT="U10"}
        if(dato.DT=="U11"){DT="U11"}

        


        if(dato.DT=="Procesado"){DT="CtdO"}

        var values = {
            idM:[TYPES.Int,dato.idM],
            CANTOT:[TYPES.Int,dato.CANTOT],
            nota:[TYPES.NVarChar,dato.NOTA],
        }
        
        var query = "update DETALLE set "+MD+"="+MD+"-@CANTOT,"+DT+"="+DT+"+@CANTOT,com=@nota where Id=@idM";
        db.query(query, values ,  (err,valor) => {
            if (err) {
                console.log(err);
            } else {
                res.send({status:'ok', mensage:'Datos agregados', idD:dato.idM})
            }
        });
    }
    //-----detalle     


    //----documentos
    //--save pdf doc
    app.post('/pdf', function(req, res){
        upload(req, res, function(err) {
            if (err) {
                console.log(err)
                return res.end("No se pudo subir el archivo.");
            }
            if(req.files.length!= 0){

                var filename = 'http://npms16.nipsa.com.mx:93/files/' + req.files[0].filename
                var  idUSER =req.user[0].Id
                //console.log(req.body)
                //console.log(req.files)
                //console.log(filename)
                //console.log(idUSER)
                //console.log(req.body.idPlanPro0)

                addDocumentADD(filename,req.body,idUSER)

                return res.end('ok');
            
            }else {
                return res.end("A ocurrido un error al subir el archivo.");
            }
        });
    })
    //---insertar documentos
    function addDocumentADD(filename,datos,idUSER){
        var date = new Date()
        var tiempo = newDate(date)
        var values = {
            documentos:[TYPES.NVarChar,filename],
            descripcion:[TYPES.NVarChar,datos.descripcion],
            idPlanPro:[TYPES.Int,datos.idPlanPro0],
            createdDate:[TYPES.NVarChar,tiempo],
            updateDate:[TYPES.NVarChar,tiempo],
            userId:[TYPES.Int,idUSER]
                }

        var query = "insert into documentos values ( @idPlanPro,@descripcion,@documentos,@createdDate, @updateDate, @userId ) ";
        db.query(query, values ,  (err,valor) => {
            if (err) {
                console.log(err);
            }   
            else {
                console.log('ok');
            } 
        });
    }
    //---------------------elimina documento
    app.post('/data/eliminar/documento',isLoggedIn, function (req, res) {
        var values = {
        id:[TYPES.Int,req.body.id],
        } 
        var query = "DELETE FROM documentos where id=@id";
        db.query(query, values ,  (err,valor) => {
        if (err) {
            console.log(err);
                } else {
                    res.send({status:'ok', mensage:'DOCUMENTO ELIMINADO'})
                }
        });
    }); 
    //----documentos


    //----------------------------------------------------------configuracion de Formats




    //----------------------------------------------------------print and notfy
    //_----notyficaciones
    //insertar eventos
    app.post('/notify/number/part/',isLoggedIn, function (req, res) {
        var date = new Date()
        var tiempo = newDate(date)

        var values = {
        idM:[TYPES.Int, req.body.idM1],//id de detalle
        NOTIFICAR:[TYPES.NVarChar, req.body.NOTIFICAR],
        date:[TYPES.NVarChar,tiempo],
        userId:[TYPES.Int,req.user[0].Id]
        }

        var query = "insert into Notfy values (@idM,@NOTIFICAR,@date,@userId) ";
        db.query(query, values ,  (err,valor) => {
            if (err) {
                console.log(err);
            }   
            else {
                res.send({status:'ok', mensage:'Datos agregados', idD:req.body.idM1})
            } 
        });
    });
    //ELIMINAR NOMBRE DE NOTIFY
    app.post('/data/eliminar/NotItY',isLoggedIn, function (req, res) {
        var values = {
            id:[TYPES.Int,req.body.id],
        } 

        var query = "DELETE  FROM Notfy where id=@id  ";
        db.query(query, values ,  (err,valor) => {
            if (err) {
                
                console.log(err);
                    } else {
                        res.send({status:'ok', mensage:'ELIMINADO'})

                    }
                });
            });
    //_----notyficaciones

    //------------------insertcion de print
    //insert register label
    app.post('/register/prin/label',isLoggedIn, function (req, res) {
        var date = new Date()
        var tiempo = newDate(date)
        var values = {
        idM:[TYPES.Int, req.body.idDAT],
        NP:[TYPES.NVarChar, req.body. NPart],
        DSC:[TYPES.NVarChar, req.body.Cript],
        MDL:[TYPES.NVarChar, req.body.MoDel],
        SDS:[TYPES.NVarChar, req.body.SDS1],
        SRL:[TYPES.NVarChar, "000-0000-000"],
        SNP:[TYPES.Int, req.body.CantpRI],
        date:[TYPES.NVarChar,tiempo],
        userId:[TYPES.Int,req.user[0].Id]
        }

        var query = "insert into LabelsPrint values (@idM,@NP,@DSC,@MDL,@SDS,@SRL,@SNP,@date,@userId) ";
        db.query(query, values ,  (err,valor) => {
            if (err) {
                console.log(err);
            }   
            else {
                
                res.send({status:'ok', mensage:'Datos agregados'})
            } 
        });

    });
    //------------------insertcion de print

    //----------------------------------------------------------print and notfy

    //insertar eventos
    app.post('/int/regs/Scann/',isLoggedIn, function (req, res) {
        var date = new Date()
        var tiempo = newDate(date)
        var values = {
        idM:[TYPES.Int, req.body.IId],//id de detalle
        idF:[TYPES.Int, req.body.idRefFF],//id formato
        //SNP:[TYPES.Int, req.body.SNP],
        //PROD:[TYPES.Int, req.body.PROD],
        //NG:[TYPES.Int, req.body.NG],
        //TOT:[TYPES.Int, req.body.TOT],
        //U1:[TYPES.Int, req.body.U1],
        //U2:[TYPES.Int, req.body.U2],
        //U3:[TYPES.Int, req.body.U3],
        //U4:[TYPES.Int, req.body.U4],
        cunt:[TYPES.Int, req.body.Dispcunt],
        MD:[TYPES.NVarChar, req.body.DREMmD],
        NOTA:[TYPES.NVarChar, req.body.NOTANew],
        CANTOT:[TYPES.Int, req.body.CRANTdt],
        DT:[TYPES.NVarChar, req.body.DDTT],
        //PartN:[TYPES.NVarChar, req.body.PartN],
        //SDS:[TYPES.NVarChar, req.body.SDS],
        //UBI:[TYPES.NVarChar, req.body.UBI],
        date:[TYPES.NVarChar,tiempo],
        userId:[TYPES.Int,req.user[0].Id]
        }

        var query = "insert into eventos values (@idM,@idF,@cunt,@MD,@CANTOT,@DT,@date,@userId,@NOTA) ";
        db.query(query, values ,  (err,valor) => {
            if (err) {
                console.log(err);
            }   
            else {
            upPDetall(req.body, res)
            } 
        });
    });

    //--actualiza m tabla de detalle
    function  upPDetall(dato, res){
        var MD=dato.DREMmD
        var DT=dato.DDTT

        if(dato.DREMmD=="Disponible"){MD="RES"}
        if(dato.DREMmD=="NG"){MD="NGT"}
        if(dato.DREMmD=="Produccion"){MD="PRODT"}
        if(dato.DREMmD=="U1"){MD="U1"}
        if(dato.DREMmD=="U2"){MD="U2"}
        if(dato.DREMmD=="U3"){MD="U3"}
        if(dato.DREMmD=="U4"){MD="U4"}
        if(dato.DREMmD=="U5"){MD="U5"}
        if(dato.DREMmD=="U6"){MD="U6"}
        if(dato.DREMmD=="U7"){MD="U7"}
        if(dato.DREMmD=="U8"){MD="U8"}
        if(dato.DREMmD=="U9"){MD="U9"}
        if(dato.DREMmD=="U10"){MD="U10"}
        if(dato.DREMmD=="U11"){MD="U11"}

        if(dato.DREMmD=="Procesado"){MD="CtdO"}
        if(dato.DDTT=="Disponible"){DT="RES"}
        if(dato.DDTT=="NG"){DT="NGT"}
        if(dato.DDTT=="Produccion"){DT="PRODT"}
        if(dato.DDTT=="U1"){DT="U1"}
        if(dato.DDTT=="U2"){DT="U2"}
        if(dato.DDTT=="U3"){DT="U3"}
        if(dato.DDTT=="U4"){DT="U4"}
        if(dato.DDTT=="U5"){DT="U5"}
        if(dato.DDTT=="U6"){DT="U6"}
        if(dato.DDTT=="U7"){DT="U7"}
        if(dato.DDTT=="U8"){DT="U8"}
        if(dato.DDTT=="U9"){DT="U9"}
        if(dato.DDTT=="U10"){DT="U10"}
        if(dato.DDTT=="U11"){DT="U11"}


        if(dato.DDTT=="Procesado"){DT="CtdO"}

        var values = {
            idM:[TYPES.Int,dato.IId],
            CANTOT:[TYPES.Int,dato.CRANTdt],
            nota:[TYPES.NVarChar,dato.NOTANew],
        }
        
        var query = "update DETALLE set "+MD+"="+MD+"-@CANTOT,"+DT+"="+DT+"+@CANTOT,com=@nota where Id=@idM";
        db.query(query, values ,  (err,valor) => {
            if (err) {
                console.log(err);
            } else {
                res.send({status:'ok', mensage:'Datos agregados', idD:dato.idM})
            }
        });
    }


















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
};

function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();
    // if they aren't redirect them to the home page
    //res.redirect('/');
    res.send("<div style='widht:100%; font-size:3em; text-aling:center; padding:40px;margin-left:100px;'><a href='.\'>Tu usuario no es valido, por favor ingresa Aqui...</a></div>")
}
