// ============================================
// Helper de Email - Notificaciones
// ============================================

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: {
        user: 'notificaciones@nipsa.com.mx',
        pass: '01.temporal'
    },
    tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false
    }
});

async function sendMail({ to, subject, html }) {
    try {
        const info = await transporter.sendMail({
            from: '"Sistema N10GDC" <notificaciones@nipsa.com.mx>',
            to,
            subject,
            html
        });
        console.log('✓ Email enviado: ' + info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error al enviar email:', error.message);
        return { success: false, error: error.message };
    }
}

module.exports = { sendMail };
