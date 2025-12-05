//Send email
//"http://blog.nodeknockout.com/post/34641712180/sending-email-from-nodejs"
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var datos = require('./config.js')

var de = datos.Dmail;
var contra = datos.pass;
var host = datos.Dom;

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
module.exports.email= function (idPlanPro) {
    var fs = require('fs');

/////////////////--------/////////-------///////[ubicacion de mi archivo index.html]------->>>
    var cHtml = fs.readFileSync('C:/Web/N10GDC/config/email/NotFy.html', "utf8");
    Sync(function(){
        try {

//console.log('-----------------------------------------------------------------------------------------------------------------------------------------')
            //optiene los datos de mi documento            
            var datos = Optendatos.sync(null,idPlanPro)
            //OPTIENE EL CORREO DEL USUARIO 0
            var listMail = getDataEMAIL.sync(null, idPlanPro)
            //Update Notfy
            var upDetall = UpdatDetalle(idPlanPro)

            para = "je.resendiz@nipsa.com.mx"


            //console.log(datos)
            //console.log(listMail)
            //console.log(idPlanPro)

            //console.log(listMail)
            for (var i=0;i<=listMail.length-1;i++){
                para = para +";"+listMail[i].mail
                console.log('valort i-----------------------------------------------------------------------:'+i)
            }

            //para =" "

            //console.log(para)
          //para = DataEMAI[0].email
            cHtml = cHtml.replace('<%SDS%>',datos[0].SDS);//RESOLUCION POR PARTE DE GERNCIA
            cHtml = cHtml.replace('<%DSC%>',datos[0].SDC);//CODIGO GENERADO POR FINANZAS
            cHtml = cHtml.replace('<%FFin%>',datos[0].FFIN);//ASUNTO DE MI DOCUMENTO
            
            var date = new Date()
            cHtml = cHtml.replace('<%dth%>', dateformat(date));//FECHA

            //realiza la creacion de mi correo y guara una copia en una carpeta //nombre con el que se guardara el correo   
            require("fs").writeFile('C:/Web/N10GDC/public/correo/NotFy-'+ idPlanPro + ".html", cHtml, "utf8", function (err) {
                console.log(err); // writes out file without error, but it's not a valid image
            });
            //abilita el attch si biene vacio
            var i = 0
            var attach = []
            if (para == ''){
                return false
            }

            //realiza el pat demi correo
            var Fhtml = {path: 'http://'+host+'/correo/NotFy-'+ idPlanPro+'.html'};
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
                },
                tls: {
                    rejectUnauthorized: false // Desactiva la verificación del certificado
                }
            });


            //estructura de mi correo//lo que vera el reseptor de mi correo
            asunto = 'Notifications N10'
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
                console.log('enviando correo para:'+para)
            })
        }catch (e) {
            console.error(e);
        }
        
    })
}




//optiene los datos de mi documento
function Optendatos(id,  callback){
    var values = {id:[TYPES.Int, id]}
    var query="  select top 1 Id,FFIN,SDS,SDC,Notfy from DETALLE where Notfy>0 and Id=id"
    db.query(query, values, (err, data) => {
        if (err)
            console.log(err)
        else
            callback(null, data)
    })
}

//OPTIENE EL CORREO DEL USUARIO 0
function getDataEMAIL(id,  callback){
    //console.log(id)
    var query =  "  select  *from Notfy where idM=@id"
    db.query(query,{id:[TYPES.Int, id]}, (err, data) => {
        
        if (err)
            console.log(err)
        if (data){
            if (data.length > 0 ){
                callback(null, data)
               //console.table(data)
            } else {
                callback(null, [])
            }
        } else {
            callback(null, [])
        }
    })
}

 //conteoDEcorreo(id)
 function UpdatDetalle(id){

    var date = new Date()
    var tiempo = newDateNotfy(date)

    var values = {
        id:[TYPES.Int,id],
        tiempo:[TYPES.NVarChar,tiempo],
    }
    db.query(" update DETALLE set Notfy=Notfy-1,detNotfy=@tiempo where Id=@id", values, (err, data) => {
        if (err){
            console.log(err)
            }
        else 
        console.log('ok')
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

//formatea mi fecha--gemnera fecha
function newDateNotfy(fecha1){
    var year = fecha1.getFullYear();
    var mes = fecha1.getMonth() + 1;
    var dia = fecha1.getDate();
    var fecha = year + '-' + pad(mes, 2) + '-' + pad(dia+1, 2);
    return fecha
}

//realiza el path de mi fecha
function pad(number, size) {
    var s = String(number);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}


