//Send email
//"http://blog.nodeknockout.com/post/34641712180/sending-email-from-nodejs"
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var datos = require('./config.js')
var de = datos.emailDefaultOF365;
var contra = datos.passwordOF365;
var host = datos.correoDom;
var name = datos.nameDefault;
var nodeoutlook = require('nodejs-nodemailer-outlook')
var Sync = require('sync');
//email
var userAdmon = datos.userAdmon;
var urlPublic = datos.urlPublic;
var connectionString = datos.SQL_CONN;
const friendly = require('tedious-friendly');
const { Console } = require('console');
const TYPES = friendly.tedious.TYPES;
const connectionConfig = { options: { useUTC: true } };
const poolConfig = { min: 2, max: 4, log: false };
// create connection pool
const db = friendly.create({ connectionString, connectionConfig, poolConfig });
module.exports.emailRAE = function (idPlanPro) {
    var fs = require('fs');


/////////////////--------/////////-------///////[ubicacion de mi archivo index.html]------->>>
    var cHtml = fs.readFileSync('C:/Web/DGI/config/email/RESOLUCION.html', "utf8");
    Sync(function(){
        try {
                //optiene los datos de mi documento            
                var namRAE = nameRAE.sync(null,idPlanPro)
                //OPTIENE EL CORREO DEL USUARIO 0
                var DataEMAI = getDataEMAIL.sync(null, idPlanPro)
                //OPTIENE LA URL DE MI DOCUMNENTO
                var DataEMAIURL = getDataEMAILURL.sync(null, idPlanPro)
                conteoDEcorreo()
                    para = DataEMAI[0].email
                    cHtml = cHtml.replace('<%nombre%>',namRAE[0].nombre);//nombre
                    cHtml = cHtml.replace('<%resolucion%>',namRAE[0].status);//RESOLUCION POR PARTE DE GERNCIA
                    cHtml = cHtml.replace('<%n%>',namRAE[0].ncRAE);//CODIGO GENERADO POR FINANZAS
                    cHtml = cHtml.replace('<%motivo%>',"REQUISICION DE PERSONAL");//ASUNTO DE MI DOCUMENTO
                    cHtml = cHtml.replace('<%comentareos%>','N/A');//CONDICIONES DE GERENCIA
                    cHtml = cHtml.replace('<%link%>',DataEMAIURL[0].url);//URL PARA ACCEDER AL ARCHIVO
                    var date = new Date()
                    cHtml = cHtml.replace('<%date%>', dateformat(date));//FECHA
//realiza la creacion de mi correo y guara una copia en una carpeta //nombre con el que se guardara el correo   
                        require("fs").writeFile('C:/Web/DGI/public/correoTF7/TF7-resolucion-' + idPlanPro + ".html", cHtml, "utf8", function (err) {
                            console.log(err); // writes out file without error, but it's not a valid image
                        });  
    //abilita el attch si biene vacio
                    var i = 0
                    var attach = []
                    if (para == ''){
                        return false
                    }
        //realiza el pat demi correo
                        var Fhtml = {path: 'http://'+host+'/correoTF7/TF7-resolucion-'+ idPlanPro+'.html'};
//establece la conexion con mi correo//autenticacion
var transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com", // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    tls: {
       ciphers:'SSLv3'
    },
    auth: {
        user: de,
        pass: contra
    }

    ,

    tls: {
        rejectUnauthorized: false // Desactiva la verificación del certificado
    }


});





//estructura de mi correo//lo que vera el reseptor de mi correo
                    asunto = 'REQUISICION DE PERSONAL'
                    var mailOptions = {
                        from: 'Notifications' + ' <' + de + '> ',
                        to: para,
                        subject: asunto,
                        text: '',
                        attachments: attach,
                        html: Fhtml
                    };
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log("Message sent: " + info.message )
                        }
                        //console.log('Message sent: ' + info.reponse);
                        console.log('De:' + de +  ' - Contra: ' + contra+'- para:------'+para)
                    })
    }
        catch (e) {
            console.error(e);
        }
        
    })
}

 //OPTIENE LA URL DE MI DOCUMNENTO
function getDataEMAILURL(id,  callback){
    //console.log(id)
    var query =  "SELECT  eventosRAE.email,eventosRAE.comen,users.[language],eventosRAE.[url]"
    query=query+"FROM eventosRAE INNER JOIN users  ON eventosRAE.userId = "
    query=query+"users.Id WHERE eventosRAE.idDoc=@id and users.[language]='es' "
    db.query(query,{id:[TYPES.NVarChar, id]}, (err, data) => {
        //console.table(data)
        //console.log(data)
        if (err)
            console.log(err)
        if (data){
            if (data.length > 0 ){
                callback(null, data)
          //console.table(data)
          //console.log(data)
               //console.table(data.length)
            } else {
                callback(null, [])
            }
        } else {
            callback(null, [])
        }
    })
}

//OPTIENE EL CORREO DEL USUARIO 0
function getDataEMAIL(id,  callback){
    var query =  "SELECT top 1  TF7.userID,users.email  "
    query=query+"    FROM TF7 INNER JOIN users  ON TF7.userID "
    query=query+" = users.Id WHERE TF7.idPlanPro=@id"
    db.query(query,{id:[TYPES.NVarChar, id]}, (err, data) => {
        if (err)
            console.log(err)
        else
            callback(null, data)
    })
}

//optiene los datos de mi documento
function nameRAE(id,  callback){
    var values = {id:[TYPES.Int, id]}
    var query="SELECT  planPro.nombre,planPro.[status],planPro.ncRAE  "
    query=query+" FROM planPro INNER JOIN TF7 ON planPro.id ="
    query=query+"  TF7.idplanPro  WHERE planPro.id=@id"
    db.query(query, values, (err, data) => {
        if (err)
            console.log(err)
        else
            callback(null, data)
    })
}

//actualiza en planPro en proceso de quien esta mi documento
function dateformat(fecha){
    var date = new Date(Date.parse(fecha));
    var monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
        'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ]
    var dia = date.getUTCDate();
    var mes = monthNames[date.getMonth()];
    var year = date.getFullYear();
    var fecha = dia + ' de ' + mes + ' de ' + year;
    return fecha
}

//formatea mi fecha--gemnera fecha
function newDate(fecha1){
    var year = fecha1.getFullYear();
    var mes = fecha1.getMonth() + 1;
    var dia = fecha1.getDate();
    var fecha = year + '-' + pad(mes, 2) + '-' + pad(dia, 2) + ' ' + fecha1.getHours() + ':'+ fecha1.getMinutes() + ':' + fecha1.getSeconds()
    return fecha
}

//realiza el path de mi fecha
function pad(number, size) {
    var s = String(number);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}

 //conteoDEcorreo()
 function conteoDEcorreo(){
    var date = new Date()
    var tiempo = newDate(date)
    var tiempo=tiempo.substring(0, 11);
    var values = {
        CONT:[TYPES.Int,1],
        createdDate:[TYPES.NVarChar,tiempo],
    }
    db.query(" insert into  CORREO values ( @CONT,@createdDate)", values, (err, data) => {
        if (err){
            console.log(err)
            }
        else 
        console.log('ok')
    })
}