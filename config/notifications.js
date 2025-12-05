// Api de notificaciones
const dbconfig = require('./config');
const friendly = require('tedious-friendly');
const TYPES = friendly.tedious.TYPES;
const db = friendly.create({ 
    connectionString: dbconfig.SQL_CONN,
    connectionConfig: { options: { useUTC: false } },
    poolConfig: { min: 2, max: 4, log: false }
});

module.exports = function(app, passport) {

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/');
}

// Vistas
app.get('/config/emails', isLoggedIn, function(req, res) {
    db.query('SELECT Id, name, email FROM users WHERE disabled = 1 ORDER BY name', (err, usuarios) => {
        if (err) {
            console.error('❌ Error al cargar usuarios:', err.message);
            return res.render('error', { message: 'Error al cargar usuarios' });
        }
        console.log(`✅ Usuarios cargados: ${usuarios ? usuarios.length : 0}`);
        if (usuarios && usuarios.length > 0) {
            console.log('   Ejemplo:', usuarios[0].name, '-', usuarios[0].email);
        }
        res.render('notificaciones', { user: req.user[0], usuarios: usuarios || [] });
    });
});

// Get - Consultas

// Listar configuraciones
app.get('/tables/notifications', isLoggedIn, function(req, res) {
    var query = `
        SELECT 
            nc.Id,
            nc.notificationType,
            nc.triggerTime,
            nc.daysBefore,
            nc.emailSubject,
            nc.description,
            nc.status,
            nc.lastSentDate,
            COUNT(nu.Id) as recipientCount
        FROM notificationsConfig nc
        LEFT JOIN notificationsUsers nu ON nc.Id = nu.notificationId
        GROUP BY nc.Id, nc.notificationType, nc.triggerTime, nc.daysBefore, nc.emailSubject, nc.description, nc.status, nc.lastSentDate
        ORDER BY nc.Id DESC
    `;
    db.query(query, (err, data) => {
        if (err) {
            console.error('❌ Error en /tables/notifications:', err.message);
            return res.status(500).send({ status: 'error', message: err.message });
        }
        console.log(`✅ /tables/notifications: ${data.length} registros`);
        if (data && data.length > 0) {
            console.log('   Primera config:', {
                Id: data[0].Id,
                lastSentDate: data[0].lastSentDate,
                recipientCount: data[0].recipientCount
            });
        }
        res.send(data || []);
    });
});

// Listar destinatarios
app.get('/tables/notification/recipients', isLoggedIn, function(req, res) {
    if (!req.query.notificationId) return res.status(400).send({ status: 'error', message: 'ID requerido' });
    
    var query = `
        SELECT nu.*, u.name as userName, u.email as userEmail
        FROM notificationsUsers nu
        LEFT JOIN users u ON nu.userId = u.Id
        WHERE nu.notificationId = @id
        ORDER BY nu.Id DESC
    `;
    db.query(query, { id: [TYPES.Int, req.query.notificationId] }, (err, data) => {
        if (err) return res.status(500).send({ status: 'error', message: 'Error al consultar' });
        res.send(data || []);
    });
});

// Post - Crear

// Crear configuración
app.post('/config/notification/create', isLoggedIn, function(req, res) {
    var daysBefore = parseInt(req.body.daysBefore) || (req.body.notificationType === 'LOW_STOCK' ? 60 : 1);
    
    var query = `
        INSERT INTO notificationsConfig (notificationType, triggerTime, daysBefore, emailSubject, description, status)
        VALUES (@type, @time, @days, @subject, @desc, @status);
        SELECT SCOPE_IDENTITY() as id
    `;
    
    db.query(query, {
        type: [TYPES.NVarChar, req.body.notificationType],
        time: [TYPES.VarChar, req.body.triggerTime],
        days: [TYPES.Int, daysBefore],
        subject: [TYPES.NVarChar, req.body.emailSubject],
        desc: [TYPES.NVarChar, req.body.description || ''],
        status: [TYPES.VarChar, req.body.status || 'Activo']
    }, (err, result) => {
        if (err) return res.status(500).send({ status: 'error', message: 'Error al crear' });
        res.send({ status: 'success', message: 'Creado exitosamente', id: result && result[0] ? result[0].id : null });
    });
});

// Agregar destinatario
app.post('/config/notification/recipient/add', isLoggedIn, function(req, res) {
    console.log('📧 Agregando destinatario:', {
        notificationId: req.body.notificationId,
        recipientType: req.body.recipientType,
        userId: req.body.userId,
        email: req.body.email
    });
    
    var query = `
        INSERT INTO notificationsUsers (notificationId, recipientType, userId, email)
        VALUES (@nid, @type, @uid, @email);
        SELECT SCOPE_IDENTITY() as id
    `;
    
    db.query(query, {
        nid: [TYPES.Int, req.body.notificationId],
        type: [TYPES.NVarChar, req.body.recipientType],
        uid: [TYPES.Int, req.body.userId || null],
        email: [TYPES.NVarChar, req.body.email || null]
    }, (err, result) => {
        if (err) {
            console.error('❌ Error al agregar destinatario:', err.message);
            return res.status(500).send({ status: 'error', message: 'Error al agregar' });
        }
        console.log('✅ Destinatario agregado con ID:', result && result[0] ? result[0].id : null);
        res.send({ status: 'success', message: 'Agregado exitosamente', id: result && result[0] ? result[0].id : null });
    });
});


// Put - Actualizar

// Actualizar configuración
app.put('/config/notification/update', isLoggedIn, function(req, res) {
    var daysBefore = parseInt(req.body.daysBefore) || (req.body.notificationType === 'LOW_STOCK' ? 60 : 1);
    
    var query = `
        UPDATE notificationsConfig 
        SET notificationType = @type, triggerTime = @time, daysBefore = @days,
            emailSubject = @subject, description = @desc, status = @status
        WHERE Id = @id
    `;
    
    db.query(query, {
        id: [TYPES.Int, req.body.Id],
        type: [TYPES.NVarChar, req.body.notificationType],
        time: [TYPES.VarChar, req.body.triggerTime],
        days: [TYPES.Int, daysBefore],
        subject: [TYPES.NVarChar, req.body.emailSubject],
        desc: [TYPES.NVarChar, req.body.description || ''],
        status: [TYPES.VarChar, req.body.status]
    }, (err) => {
        if (err) return res.status(500).send({ status: 'error', message: 'Error al actualizar' });
        res.send({ status: 'success', message: 'Actualizado exitosamente' });
    });
});

// Activar/desactivar
app.put('/config/notification/toggle', isLoggedIn, function(req, res) {
    db.query('UPDATE notificationsConfig SET status = @status WHERE Id = @id', {
        id: [TYPES.Int, req.body.Id],
        status: [TYPES.VarChar, req.body.status]
    }, (err) => {
        if (err) return res.status(500).send({ status: 'error', message: 'Error al cambiar estado' });
        res.send({ status: 'success', message: req.body.status === 'Activo' ? 'Activado' : 'Desactivado' });
    });
});

// Delete - Eliminar

// Eliminar configuración
app.delete('/config/notification/delete', isLoggedIn, function(req, res) {
    db.query('DELETE FROM notificationsConfig WHERE Id = @id', { id: [TYPES.Int, req.body.Id] }, (err) => {
        if (err) return res.status(500).send({ status: 'error', message: 'Error al eliminar' });
        res.send({ status: 'success', message: 'Eliminado exitosamente' });
    });
});

// Eliminar destinatario
app.delete('/config/notification/recipient/delete', isLoggedIn, function(req, res) {
    db.query('DELETE FROM notificationsUsers WHERE Id = @id', { id: [TYPES.Int, req.body.Id] }, (err) => {
        if (err) return res.status(500).send({ status: 'error', message: 'Error al eliminar' });
        res.send({ status: 'success', message: 'Eliminado exitosamente' });
    });
});

}; // module.exports
