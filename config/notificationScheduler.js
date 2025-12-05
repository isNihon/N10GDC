// Planificador de Notificaciones

const friendly = require('tedious-friendly');
const TYPES = friendly.tedious.TYPES;
const dbconfig = require('./config');
const { sendMail } = require('../helpers/mailer');
const { orderArrivalTemplate, lowStockTemplate } = require('../helpers/emailTemplates');

const db = friendly.create({
    connectionString: dbconfig.SQL_CONN,
    connectionConfig: { options: { useUTC: false } },
    poolConfig: { min: 1, max: 3, log: false }
});

let schedulerInterval = null;

// funciones principales

function start() {
    console.log('📧 [Scheduler] Iniciando sistema de notificaciones...');
    
    // Ejecutar inmediatamente
    runScheduler();
    
    // Ejecutar cada minuto (precisión exacta)
    schedulerInterval = setInterval(() => {
        runScheduler();
    }, 60 * 1000); // 1 minuto
    
    console.log('[Scheduler] Sistema activo - Verificando cada minuto');
}

function stop() {
    if (schedulerInterval) {
        clearInterval(schedulerInterval);
        schedulerInterval = null;
        console.log('[Scheduler] Sistema detenido');
    }
}

async function runScheduler() {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    console.log(`\n[Scheduler] Verificando - ${currentTime}`);
    
    try {
        // Obtener configuraciones activas
        const configs = await getActiveConfigs();
        
        if (!configs || configs.length === 0) {
            console.log('No hay configuraciones activas');
            return;
        }
        
        console.log(`${configs.length} configuraciones activas`);
        
        // Procesar cada configuración
        for (const config of configs) {
            // Verificar si ya se envió en esta hora exacta
            const lastSent = config.lastSentDate ? new Date(config.lastSentDate) : null;
            const shouldSkip = lastSent && 
                               lastSent.getDate() === now.getDate() &&
                               lastSent.getMonth() === now.getMonth() &&
                               lastSent.getFullYear() === now.getFullYear() &&
                               lastSent.getHours() === now.getHours() &&
                               lastSent.getMinutes() === now.getMinutes();
            
            if (shouldSkip) {
                continue; // Ya se envió en este minuto exacto hoy
            }
            
            // Verificar coincidencia EXACTA con triggerTime
            if (config.triggerTime === currentTime) {
                console.log(`\n⏰ HORA EXACTA - Procesando: ${config.notificationType} (${config.triggerTime})`);
                await processNotification(config);
            }
        }
        
    } catch (error) {
        console.error('Error en scheduler:', error.message);
    }
}

// Procesamiento de notificaciones

async function processNotification(config) {
    try {
        console.log(`\n  Procesando notificación ID: ${config.Id}`);
        
        // Obtener destinatarios
        const recipients = await getRecipients(config.Id);
        
        if (!recipients || recipients.length === 0) {
            console.log(`No hay destinatarios configurados`);
            return;
        }
        
        console.log(`Destinatarios encontrados: ${recipients.length}`);
        recipients.forEach(r => console.log(`      - ${r.email} (${r.name || 'N/A'})`));
        
        // Calcular fecha objetivo
        const targetDate = calculateTargetDate(config.daysBefore);
        const dateStr = formatDate(targetDate);
        
        console.log(`Fecha objetivo: ${dateStr} (${config.daysBefore} días desde hoy)`);
        
        // Obtener materiales según tipo
        let materials;
        if (config.notificationType === 'ORDER_ARRIVAL') {
            materials = await getMaterialsByFFIN(dateStr);
        } else if (config.notificationType === 'LOW_STOCK') {
            materials = await getMaterialsByFechaExp(dateStr);
        }
        
        if (!materials || materials.length === 0) {
            console.log(`No hay materiales para notificar en esta fecha`);
            return;
        }
        
        console.log(`Materiales encontrados: ${materials.length}`);
        
        // Obtener descripción personalizada o usar default
        const description = config.description || 
            (config.notificationType === 'ORDER_ARRIVAL' 
                ? 'Los siguientes materiales están programados para llegar:' 
                : 'Los siguientes materiales están próximos a su fecha de expiración:');
        
        // Generar HTML según tipo
        const html = config.notificationType === 'ORDER_ARRIVAL'
            ? orderArrivalTemplate(materials, dateStr, description)
            : lowStockTemplate(materials, config.daysBefore, description);
        
        // Enviar email a cada destinatario
        const subject = config.emailSubject.replace('{{date}}', dateStr);
        
        let sentCount = 0;
        for (const recipient of recipients) {
            const result = await sendMail({
                to: recipient.email,
                subject: subject,
                html: html
            });
            
            if (result.success) {
                console.log(`Enviado a: ${recipient.email}`);
                sentCount++;
            } else {
                console.log(`Error enviando a ${recipient.email}: ${result.error}`);
            }
        }
        
        if (sentCount > 0) {
            // Actualizar fecha de último envío
            await updateLastSentDate(config.Id);
            console.log(`Notificaciones enviadas exitosamente: ${sentCount}/${recipients.length}`);
        }
        
    } catch (error) {
        console.error(`Error procesando notificación:`, error.message);
    }
}

// Funciones de base de datos

function getActiveConfigs() {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM notificationsConfig WHERE status = 'Activo'";
        db.query(query, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
}

function getRecipients(configId) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                nu.recipientType,
                nu.email,
                u.email as userEmail,
                u.name as userName
            FROM notificationsUsers nu
            LEFT JOIN users u ON nu.userId = u.Id
            WHERE nu.notificationId = @id
        `;
        
        db.query(query, { id: [TYPES.Int, configId] }, (err, data) => {
            if (err) {
                reject(err);
            } else {
                const emails = data.map(r => ({
                    email: r.recipientType === 'USER' ? r.userEmail : r.email,
                    name: r.recipientType === 'USER' ? r.userName : 'Destinatario'
                }));
                resolve(emails);
            }
        });
    });
}

function getMaterialsByFFIN(date) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                np.Number as NUMBERPART,
                np.[Desc] as NAMEP,
                d.FFIN,
                d.CANTIDAD,
                d.PROVEEDOR,
                d.COLOR
            FROM DETALLE d
            INNER JOIN NUMBERPART np ON d.idRef = np.Id
            WHERE d.FFIN = @date 
            AND d.idRef IS NOT NULL
            ORDER BY np.Number, d.FFIN
        `;
        
        db.query(query, { date: [TYPES.VarChar, date] }, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
}

function getMaterialsByFechaExp(date) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                np.Number as NUMBERPART,
                np.[Desc] as NAMEP,
                d.FechaExp,
                d.CANTIDAD,
                d.PROVEEDOR,
                d.COLOR
            FROM DETALLE d
            INNER JOIN NUMBERPART np ON d.idRef = np.Id
            WHERE d.FechaExp IS NOT NULL 
            AND d.FechaExp != ''
            AND d.FechaExp <= @date
            AND d.idRef IS NOT NULL
            ORDER BY d.FechaExp, np.Number
        `;
        
        db.query(query, { date: [TYPES.VarChar, date] }, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
}

function updateLastSentDate(configId) {
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE notificationsConfig 
            SET lastSentDate = GETDATE() 
            WHERE Id = @id
        `;
        
        db.query(query, { id: [TYPES.Int, configId] }, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
}

// Funciones auxiliares

function calculateTargetDate(daysToAdd) {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    return date;
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Exportar

module.exports = {
    start,
    stop,
    runScheduler
};
