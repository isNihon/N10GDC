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
         fechaExp:[TYPES.NVarChar, req.body.fechaExp],
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
        query=query+",0,0,@Cantidad,0,0,0,0,0,@SDC,' ',0,0,0,0,0,0,0,0,0,@fechaExp,@Cantidad,@Cantidad,0,0);"
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
        
        // Formatear lote como YYMMDD
        var year = date.getFullYear().toString().slice(-2);
        var month = ('0' + (date.getMonth() + 1)).slice(-2);
        var day = ('0' + date.getDate()).slice(-2);
        var lote = year + month + day;
        
        // Obtener consecutivo del cuerpo de la petición
        var consecutivo = req.body.Consecutivo || '0001';
        
        var values = {
            Part: [TYPES.VarChar, req.body.NPart],
            Desc: [TYPES.VarChar, req.body.Cript],
            Modelo: [TYPES.VarChar, req.body.MoDel],
            Cant: [TYPES.Int, req.body.CantpRI],
            Dnote: [TYPES.VarChar, req.body.Dnote],
            lote: [TYPES.VarChar, lote],
            Consc: [TYPES.VarChar, consecutivo],
            status: [TYPES.VarChar, 'Print'],
            User: [TYPES.VarChar, req.user[0].user],
            idDetalle: [TYPES.Int, req.body.idDetalle]
        }

        var query = "INSERT INTO Labels (Part, [Desc], Modelo, Cant, Dnote, lote, Consc, [status], [User], idDetalle) VALUES (@Part, @Desc, @Modelo, @Cant, @Dnote, @lote, @Consc, @status, @User, @idDetalle)";
        db.query(query, values ,  (err, valor) => {
            if (err) {
                console.log(err);
                res.send({status:'error', mensage:'Error al guardar etiqueta'})
            }   
            else {
                // Descontar de CantStock después de insertar la etiqueta
                var updateValues = {
                    idDetalle: [TYPES.Int, req.body.idDetalle],
                    cantDescuento: [TYPES.Int, req.body.CantpRI]
                };
                var updateQuery = "UPDATE DETALLE SET CantStock = CantStock - @cantDescuento WHERE Id = @idDetalle AND CantStock >= @cantDescuento";
                db.query(updateQuery, updateValues, (errUpdate, valUpdate) => {
                    if (errUpdate) {
                        console.log(errUpdate);
                        res.send({status:'error', mensage:'Error al actualizar CantStock'})
                    } else {
                        res.send({status:'ok', mensage:'Datos agregados'})
                    }
                });
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


    //---Validar etiqueta escaneada
    app.post('/validate/label', isLoggedIn, function (req, res) {
        var qrCode = req.body.qrCode;
        var idDetalle = req.body.idDetalle;
        
        if(!qrCode || !idDetalle){
            return res.send({status:'error', message:'Datos incompletos'});
        }
        
        var qrParts = qrCode.split(',');
        
        if(qrParts.length !== 4){
            return res.send({status:'error', message:'Formato de QR inválido. Debe ser: NumParte,Lote,Cantidad,Consecutivo'});
        }
        
        var numParte = qrParts[0].trim();
        var lote = qrParts[1].trim();
        var cantidad = parseInt(qrParts[2].trim());
        var consecutivo = qrParts[3].trim();
        
        // Validar que la etiqueta existe con estatus 'Print'
        var queryValidar = "SELECT * FROM Labels WHERE Part = @numParte AND lote = @lote AND Cant = @cantidad AND Consc = @consecutivo AND idDetalle = @idDetalle AND status = 'Print'";
        
        db.query(queryValidar, {
            numParte: [TYPES.VarChar, numParte],
            lote: [TYPES.VarChar, lote],
            cantidad: [TYPES.Int, cantidad],
            consecutivo: [TYPES.VarChar, consecutivo],
            idDetalle: [TYPES.Int, idDetalle]
        }, (errValidar, resultValidar) => {
            if(errValidar){
                console.log(errValidar);
                return res.send({status:'error', message:'Error al validar etiqueta'});
            }
            
            if(resultValidar.length === 0){
                // Verificar si la etiqueta existe pero con otro estatus: Valid
                var queryExiste = "SELECT * FROM Labels WHERE Part = @numParte AND lote = @lote AND Cant = @cantidad AND Consc = @consecutivo AND idDetalle = @idDetalle";
                db.query(queryExiste, {
                    numParte: [TYPES.VarChar, numParte],
                    lote: [TYPES.VarChar, lote],
                    cantidad: [TYPES.Int, cantidad],
                    consecutivo: [TYPES.VarChar, consecutivo],
                    idDetalle: [TYPES.Int, idDetalle]
                }, (errExiste, resultExiste) => {
                    if(resultExiste && resultExiste.length > 0){
                        return res.send({status:'error', message:'Esta etiqueta ya fue utilizada'});
                    } else {
                        return res.send({status:'error', message:'Etiqueta no encontrada para este registro'});
                    }
                });
            } else {
                // Etiqueta válida
                res.send({
                    status:'ok', 
                    message:'Etiqueta válida',
                    data: {
                        labelId: resultValidar[0].Id,
                        numParte: numParte,
                        lote: lote,
                        cantidad: cantidad,
                        consecutivo: consecutivo
                    }
                });
            }
        });
    });
    //---Validar etiqueta escaneada

    //---Guardar movimiento de material con etiqueta QR
    app.post('/save/material/movement', isLoggedIn, function (req, res) {
        var date = new Date();
        var tiempo = newDate(date);
        
        // Parsear el código QR
        var qrCode = req.body.qrCode;
        var qrParts = qrCode.split(',');
        
        if(qrParts.length !== 4){
            return res.send({status:'error', message:'Formato de QR inválido'});
        }
        
        var numParte = qrParts[0].trim();
        var lote = qrParts[1].trim();
        var cantidad = parseInt(qrParts[2].trim());
        var consecutivo = qrParts[3].trim();
        
        var idDetalle = req.body.idDetalle;
        var tipoMovimiento = req.body.tipoMovimiento; // 'scrap' o 'proceso'
        var destino = tipoMovimiento === 'scrap' ? 'Scrap' : 'Proceso';
        var userId = req.user[0].user; // Usuario que realiza el movimiento
        
        // 1. Primero verificar que la etiqueta existe y tiene estatus 'Print'
        var queryValidar = "SELECT * FROM Labels WHERE Part = @numParte AND lote = @lote AND Cant = @cantidad AND Consc = @consecutivo AND idDetalle = @idDetalle AND status = 'Print'";
        
        db.query(queryValidar, {
            numParte: [TYPES.VarChar, numParte],
            lote: [TYPES.VarChar, lote],
            cantidad: [TYPES.Int, cantidad],
            consecutivo: [TYPES.VarChar, consecutivo],
            idDetalle: [TYPES.Int, idDetalle]
        }, (errValidar, resultValidar) => {
            if(errValidar){
                console.log(errValidar);
                return res.send({status:'error', message:'Error al validar etiqueta'});
            }
            
            if(resultValidar.length === 0){
                return res.send({status:'error', message:'Etiqueta no válida o ya utilizada'});
            }
            
            var labelId = resultValidar[0].Id;
            
            // 2. Obtener datos actuales del detalle
            var queryDetalle = "SELECT CantDisp, Number FROM DETALLE INNER JOIN NUMBERPART ON DETALLE.idRef = NUMBERPART.Id WHERE DETALLE.Id = @idDetalle";
            
            db.query(queryDetalle, {idDetalle: [TYPES.Int, idDetalle]}, (errDetalle, resultDetalle) => {
                if(errDetalle || resultDetalle.length === 0){
                    console.log(errDetalle);
                    return res.send({status:'error', message:'Error al obtener datos del detalle'});
                }
                
                var cantIni = resultDetalle[0].CantDisp || 0;
                var numPartDetalle = resultDetalle[0].Number;
                
                // Verificar que hay cantidad disponible suficiente
                if(cantIni < cantidad){
                    return res.send({status:'error', message:'No hay cantidad disponible suficiente. Disponible: ' + cantIni});
                }
                
                var cantFin = cantIni - cantidad;
                
                // 3. Actualizar estatus de la etiqueta a 'Valid'
                var queryUpdateLabel = "UPDATE Labels SET status = 'Valid' WHERE Id = @labelId";
                
                db.query(queryUpdateLabel, {labelId: [TYPES.Int, labelId]}, (errLabel, resultLabel) => {
                    if(errLabel){
                        console.log(errLabel);
                        return res.send({status:'error', message:'Error al actualizar etiqueta'});
                    }
                    
                    // 4. Actualizar CantDisp y CantProcess o CantScrap en DETALLE según el tipo de movimiento
                    var campoDestino = tipoMovimiento === 'scrap' ? 'CantScrap' : 'CantProcess';
                    var queryUpdateDetalle = "UPDATE DETALLE SET CantDisp = CantDisp - @cantidad, " + campoDestino + " = ISNULL(" + campoDestino + ", 0) + @cantidad WHERE Id = @idDetalle";
                    
                    db.query(queryUpdateDetalle, {
                        cantidad: [TYPES.Int, cantidad],
                        idDetalle: [TYPES.Int, idDetalle]
                    }, (errUpdateDetalle, resultUpdateDetalle) => {
                        if(errUpdateDetalle){
                            console.log(errUpdateDetalle);
                            return res.send({status:'error', message:'Error al actualizar cantidades'});
                        }
                        
                        // 5. Registrar movimiento en tabla Movimientos con User y Fecha
                        var queryMovimiento = "INSERT INTO Movimientos (idDetalle, NumPart, CantIni, CantMov, CantFin, Destino, Fecha, [User]) VALUES (@idDetalle, @numPart, @cantIni, @cantMov, @cantFin, @destino, GETDATE(), @userId)";
                        
                        db.query(queryMovimiento, {
                            idDetalle: [TYPES.Int, idDetalle],
                            numPart: [TYPES.VarChar, numPartDetalle],
                            cantIni: [TYPES.Int, cantIni],
                            cantMov: [TYPES.Int, cantidad],
                            cantFin: [TYPES.Int, cantFin],
                            destino: [TYPES.VarChar, destino],
                            userId: [TYPES.VarChar, userId]
                        }, (errMov, resultMov) => {
                            if(errMov){
                                console.log(errMov);
                                return res.send({status:'error', message:'Error al registrar movimiento'});
                            }
                            
                            // Todo exitoso
                            res.send({
                                status:'ok', 
                                message:'Movimiento registrado exitosamente',
                                data: {
                                    cantidad: cantidad,
                                    cantidadFinal: cantFin,
                                    destino: destino
                                }
                            });
                        });
                    });
                });
            });
        });
    });
    //---Guardar movimiento de material con etiqueta QR
    
    //---Validar etiqueta para regresar material (status='Valid')
    app.post('/validate/label/return', isLoggedIn, (req, res) => {
        var qrCode = req.body.qrCode;
        var idDetalle = req.body.idDetalle;
        
        if(!qrCode || !idDetalle){
            return res.send({status:'error', message:'Datos incompletos'});
        }
        
        // Parsear QR code (formato: NumParte,Lote,Cantidad,Consecutivo)
        var qrParts = qrCode.split(',');
        if(qrParts.length !== 4){
            return res.send({status:'error', message:'Formato de QR inválido'});
        }
        
        var numParte = qrParts[0].trim();
        var lote = qrParts[1].trim();
        var cantidad = parseInt(qrParts[2].trim());
        var consecutivo = qrParts[3].trim();
        
        // Verificar que la etiqueta existe
        var queryValidar = "SELECT * FROM Labels WHERE Part = @numParte AND lote = @lote AND Cant = @cantidad AND Consc = @consecutivo AND idDetalle = @idDetalle";
        
        db.query(queryValidar, {
            numParte: [TYPES.VarChar, numParte],
            lote: [TYPES.VarChar, lote],
            cantidad: [TYPES.Int, cantidad],
            consecutivo: [TYPES.VarChar, consecutivo],
            idDetalle: [TYPES.Int, idDetalle]
        }, (errValidar, resultValidar) => {
            if(errValidar){
                console.log(errValidar);
                return res.send({status:'error', message:'Error al validar etiqueta'});
            }
            
            if(resultValidar.length === 0){
                return res.send({status:'error', message:'Etiqueta no encontrada'});
            }
            
            // Verificar que el estatus sea 'Valid' (ya fue utilizada)
            if(resultValidar[0].status !== 'Valid'){
                return res.send({status:'error', message:'El material no ha sido utilizado'});
            }
            
            // Etiqueta válida
            res.send({
                status:'ok', 
                message:'Etiqueta validada',
                data: {
                    id: resultValidar[0].Id,
                    cantidad: cantidad,
                    numParte: numParte,
                    lote: lote,
                    consecutivo: consecutivo
                }
            });
        });
    });
    //---Validar etiqueta para regresar material
    
    //---Guardar regreso de material al inventario
    app.post('/save/material/return', isLoggedIn, (req, res) => {
        var qrCode = req.body.qrCode;
        var idDetalle = req.body.idDetalle;
        var cantidadSobrante = parseInt(req.body.cantidadSobrante);
        var notas = req.body.notas || '';
        
        if(!qrCode || !idDetalle || !cantidadSobrante){
            return res.send({status:'error', message:'Datos incompletos'});
        }
        
        // Parsear QR code
        var qrParts = qrCode.split(',');
        if(qrParts.length !== 4){
            return res.send({status:'error', message:'Formato de QR inválido'});
        }
        
        var numParte = qrParts[0].trim();
        var lote = qrParts[1].trim();
        var cantidadTotal = parseInt(qrParts[2].trim());
        var consecutivo = qrParts[3].trim();
        
        // Validar que cantidadSobrante no sea mayor a la cantidad de la etiqueta
        if(cantidadSobrante > cantidadTotal){
            return res.send({status:'error', message:'La cantidad sobrante no puede ser mayor a ' + cantidadTotal});
        }
        
        // 1. Verificar que la etiqueta existe
        var queryValidar = "SELECT * FROM Labels WHERE Part = @numParte AND lote = @lote AND Cant = @cantidad AND Consc = @consecutivo AND idDetalle = @idDetalle";
        
        db.query(queryValidar, {
            numParte: [TYPES.VarChar, numParte],
            lote: [TYPES.VarChar, lote],
            cantidad: [TYPES.Int, cantidadTotal],
            consecutivo: [TYPES.VarChar, consecutivo],
            idDetalle: [TYPES.Int, idDetalle]
        }, (errValidar, resultValidar) => {
            if(errValidar){
                console.log(errValidar);
                return res.send({status:'error', message:'Error al validar etiqueta'});
            }
            
            if(resultValidar.length === 0){
                return res.send({status:'error', message:'Etiqueta no encontrada'});
            }
            
            // Verificar que el estatus sea 'Valid' (ya fue utilizada)
            if(resultValidar[0].status !== 'Valid'){
                return res.send({status:'error', message:'El material no ha sido utilizado'});
            }
            
            var labelId = resultValidar[0].Id;
            
            // 2. Obtener datos actuales del detalle
            var queryDetalle = "SELECT CantDisp, CantProcess FROM DETALLE WHERE Id = @idDetalle";
            
            db.query(queryDetalle, {idDetalle: [TYPES.Int, idDetalle]}, (errDetalle, resultDetalle) => {
                if(errDetalle || resultDetalle.length === 0){
                    console.log(errDetalle);
                    return res.send({status:'error', message:'Error al obtener datos del detalle'});
                }
                
                var cantDispActual = resultDetalle[0].CantDisp || 0;
                var cantProcessActual = resultDetalle[0].CantProcess || 0;
                
                // Verificar que hay cantidad suficiente en proceso para regresar
                if(cantProcessActual < cantidadSobrante){
                    return res.send({status:'error', message:'No hay cantidad suficiente en proceso. Disponible: ' + cantProcessActual});
                }
                
                var cantDispFinal = cantDispActual + cantidadSobrante;
                
                // 3. Actualizar cantidades en DETALLE: sumar a CantStock y CantDisp, restar de CantProcess, guardar notas en campo com
                var queryUpdateDetalle = "UPDATE DETALLE SET CantStock = ISNULL(CantStock, 0) + @cantidad, CantDisp = CantDisp + @cantidad, CantProcess = CantProcess - @cantidad, com = @notas WHERE Id = @idDetalle";
                
                db.query(queryUpdateDetalle, {
                    cantidad: [TYPES.Int, cantidadSobrante],
                    idDetalle: [TYPES.Int, idDetalle],
                    notas: [TYPES.NVarChar, notas]
                }, (errUpdateDetalle, resultUpdateDetalle) => {
                    if(errUpdateDetalle){
                        console.log(errUpdateDetalle);
                        return res.send({status:'error', message:'Error al actualizar cantidades'});
                    }
                    
                    // 4. Actualizar estatus de la etiqueta a 'Print' (opcional, podría quedarse en 'Valid')
                    // Por ahora la dejamos en 'Valid' ya que ya fue utilizada
                    // Si se desea resetear: var queryUpdateLabel = "UPDATE Labels SET status = 'Print' WHERE Id = @labelId";
                    
                    // Todo exitoso - NO se guarda en Movimientos según especificaciones
                    res.send({
                        status:'ok', 
                        message:'Material regresado exitosamente',
                        data: {
                            cantidad: cantidadSobrante,
                            cantidadFinal: cantDispFinal
                        }
                    });
                });
            });
        });
    });
    //---Guardar regreso de material al inventario


















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
