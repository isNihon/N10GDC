    //Send email
//"http://blog.nodeknockout.com/post/34641712180/sending-email-from-nodejs"
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var datos = require('./config.js')
//var de = datos.emailDefaultRAC;
//var contra = datos.passwordRAC;
var de = datos.emailDefaultOF365;
var contra = datos.passwordOF365;
var name = datos.nameDefault;
var correoDom = datos.Dom;
var nodeoutlook = require('nodejs-nodemailer-outlook')
var Sync = require('sync');
//email
var userAdmon = datos.userAdmon;
var urlPublic = datos.urlPublic;
var connectionString = datos.SQL_CONN;
const friendly = require('tedious-friendly');
const TYPES = friendly.tedious.TYPES;
const connectionConfig = { options: { useUTC: true } };
const poolConfig = { min: 2, max: 4, log: false };
const db = friendly.create({ connectionString, connectionConfig, poolConfig });
module.exports.emailRAE = function (data) {

    var fs = require('fs');
    //--ubicacion de mi archivo index.html---ESPAÑOL->>>
    var cHtml = fs.readFileSync('C:/Web/N10GDC/config/email/reenvioPass.html', "utf8");
/*
console.log('---------------------------///-------------------')
console.log(data)
console.log(data[0].name)
console.log(data[0].user)
console.log(data[0].password)
console.log('---------------------------///-------------------')
*/
    Sync(function(){
        try {
            para = data[0].email
            cHtml = cHtml.replace('<%nombre%>',data[0].name);
            cHtml = cHtml.replace('<%password%>',data[0].password);//NOMBRE DEL DOCUMENTO
            cHtml = cHtml.replace('<%nControl%>',data[0].user);//ASUNTO DEL DOCUMENTO
//realiza la creacion de mi correo y guara una copia en una carpeta //nombre con el que se guardara el correo
            
            require("fs").writeFile('C:/Web/N10GDC/public/correoLoggin/correoLoggin' + data[0].user+ ".html", cHtml, "utf8", function (err) {
                console.log(err); // writes out file without error, but it's not a valid image
            });  
            
            var attach = []
            var Fhtml = {path: 'http://'+correoDom+'/correoLoggin/correoLoggin'+data[0].user+'.html'};
            
            //conteoDEcorreo()
/*
            var transporter = nodemailer.createTransport({
//establece la conexion con mi correo//autenticacion
                host: "smtp.titan.email",
                port: 465,
                secure: true,
                auth: {
                    user: de,
                    pass: contra
                },
                });
*/

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
});

//estructura de mi correo//lo que vera el reseptor de mi correo
            asunto = 'LOGIN-N10-CDNC'
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
                console.log('De:' + de +  ' - Contra: ' + contra+'- para:'+para+'---:')
            })
        }
        catch (e) {
            console.error(e);
        }
    })
}

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

function newDate(fecha1){
    var year = fecha1.getFullYear();
    var mes = fecha1.getMonth() + 1;
    var dia = fecha1.getDate();
    var fecha = year + '-' + pad(mes, 2) + '-' + pad(dia, 2) + ' ' + fecha1.getHours() + ':'+ fecha1.getMinutes() + ':' + fecha1.getSeconds()
    return fecha
}

function pad(number, size) {
    var s = String(number);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}

/*
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
*/