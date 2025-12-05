
// Sistema de Configuración de Notificaciones

$(document).ready(function() {
    // Inicializar DataTable de configuraciones
    initNotificationsTable();
    
    // Inicializar DataTable de destinatarios
    initRecipientsTable();
    
    // Evento para auto-llenar días según tipo de notificación
    $('#notificationType').on('change', function() {
        var selectedType = $(this).val();
        if (selectedType === 'LOW_STOCK') {
            $('#daysBefore').val(60);
        } else if (selectedType === 'ORDER_ARRIVAL') {
            $('#daysBefore').val(1);
        }
    });
});

// DATATABLES

function initNotificationsTable() {
    var urlLanguage = '../js/datatables/languaje/Spanish.json';
    
    window.tableNotifications = $('#table-notifications').DataTable({
        scrollY: true,
        scrollY: '50vh',
        responsive: true,
        language: {
            url: urlLanguage
        },
        ajax: {
            url: '/tables/notifications',
            dataSrc: ''
        },
        columns: [
            {
                // Botón editar
                className: "icon ion-md-create",
                orderable: false,
                data: null,
                defaultContent: '',
                width: '3%'
            },
            {
                // Botón eliminar
                className: "icon ion-md-trash",
                orderable: false,
                data: null,
                defaultContent: '',
                width: '3%'
            },
            { data: 'Id' },
            { 
                data: 'notificationType',
                render: function(data) {
                    const types = {
                        'ORDER_ARRIVAL': 'Llegada de Material',
                        'LOW_STOCK': 'Expiración de Material'
                    };
                    return types[data] || data;
                }
            },
            { data: 'triggerTime' },
            { data: 'daysBefore' },
            { data: 'recipientCount' },
            {
                data: 'status',
                render: function(data) {
                    return data === 'Activo' 
                        ? '<span class="badge badge-success">Activo</span>' 
                        : '<span class="badge badge-secondary">Deshabilitado</span>';
                }
            },
            { 
                data: 'lastSentDate',
                render: function(data) {
                    if (!data) return '<span class="text-muted">Nunca</span>';
                    return new Date(data).toLocaleString('es-MX', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                }
            }
        ],
        rowCallback: function(row, data) {
            // Colorear filas según estado
            if (data.status === 'Deshabilitado') {
                $(row).css('background-color', '#f5f5f5');
            }
            
            // Centrar contenido
            $(row).find('td').css('text-align', 'center');
            
            // Click en editar
            $(row).find('td:eq(0)').on('click', function() {
                editNotification(data);
            });
            
            // Click en eliminar
            $(row).find('td:eq(1)').on('click', function() {
                deleteNotification(data.Id);
            });
        }
    });
}

function initRecipientsTable() {
    window.tableRecipients = $('#table-recipients').DataTable({
        paging: true,
        searching: false,
        info: false,
        columns: [
            { data: 'Id' },
            { 
                data: 'recipientType',
                render: function(data) {
                    const types = {
                        'USER': 'Usuario',
                        'EMAIL': 'Email'
                    };
                    return types[data] || data;
                }
            },
            { 
                data: null,
                render: function(data) {
                    if (data.recipientType === 'USER') {
                        return data.userName + ' (' + data.userEmail + ')';
                    } else if (data.recipientType === 'EMAIL') {
                        return data.email;
                    }
                    return '';
                }
            },
            {
                data: null,
                render: function(data) {
                    return `
                        <button class="btn btn-sm" onclick="deleteRecipient(${data.Id})">
                            <i class="icon ion-md-trash"></i>
                        </button>
                    `;
                }
            }
        ]
    });
}


// CRUD - CONFIGURACIÓN

function saveNotificationConfig() {
    var notificationId = $('#notificationId').val();
    var isEdit = notificationId && notificationId !== '';
    
    var formData = {
        Id: $('#notificationId').val(),
        description: $('#notificationDescription').val(),
        notificationType: $('#notificationType').val(),
        triggerTime: $('#triggerTime').val(),
        daysBefore: $('#daysBefore').val(),
        status: $('#notificationStatus').val(),
        emailSubject: $('#emailSubject').val()
    };
    
    // Validaciones
    if (!formData.notificationType || !formData.triggerTime || !formData.emailSubject) {
        swal('Error', 'Por favor complete los campos obligatorios', 'error');
        return;
    }
    
    var url = isEdit ? '/config/notification/update' : '/config/notification/create';
    var method = isEdit ? 'PUT' : 'POST';
    
    $.ajax({
        type: method,
        url: url,
        data: formData,
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success') {
                swal('Éxito', response.message, 'success');
                
                // Si es creación, guardar el ID para agregar destinatarios
                if (!isEdit && response.id) {
                    $('#notificationId').val(response.id);
                    $('#recipientNotificationId').val(response.id);
                    $('#div-recipients').show();
                    $('#btn-save-notification').html('<i class="icon ion-ios-save"></i> Actualizar Configuración');
                }
                
                // Recargar tabla
                tableNotifications.ajax.reload();
            } else {
                swal('Error', response.message, 'error');
            }
        },
        error: function(xhr) {
            swal('Error', 'Error al guardar la configuración', 'error');
            console.error(xhr);
        }
    });
}

function editNotification(data) {
    // Llenar formulario con datos existentes
    $('#notificationId').val(data.Id);
    $('#recipientNotificationId').val(data.Id);
    $('#notificationDescription').val(data.description);
    $('#notificationType').val(data.notificationType);
    $('#triggerTime').val(data.triggerTime);
    $('#daysBefore').val(data.daysBefore);
    $('#notificationStatus').val(data.status);
    $('#emailSubject').val(data.emailSubject);
    
    $('#btn-save-notification').html('<i class="icon ion-ios-save"></i> Actualizar Configuración');
    $('#div-recipients').show();
    
    // Cargar destinatarios
    loadRecipients(data.Id);
    
    // Abrir modal
    $('#modalAddNotification').modal('show');
}

function deleteNotification(id) {
    swal({
        title: '¿Está seguro?',
        text: 'Esta acción eliminará la configuración y todos sus destinatarios',
        icon: 'warning',
        buttons: ['Cancelar', 'Eliminar'],
        dangerMode: true
    }).then((willDelete) => {
        if (willDelete) {
            $.ajax({
                type: 'DELETE',
                url: '/config/notification/delete',
                data: { Id: id },
                dataType: 'json',
                success: function(response) {
                    if (response.status === 'ok') {
                        swal('Eliminado', response.message, 'success');
                        tableNotifications.ajax.reload();
                    } else {
                        swal('Error', response.message, 'error');
                    }
                },
                error: function(xhr) {
                    swal('Error', 'Error al eliminar la configuración', 'error');
                }
            });
        }
    });
}


// CRUD - DESTINATARIOS


function addRecipient() {
    var notificationId = $('#recipientNotificationId').val();
    
    if (!notificationId) {
        swal('Error', 'Primero debe guardar la configuración', 'error');
        return;
    }
    
    var recipientType = $('#recipientType').val();
    var formData = {
        notificationId: notificationId,
        recipientType: recipientType
    };
    
    // Según el tipo, agregar el campo correspondiente
    if (recipientType === 'USER') {
        var userId = $('#recipientUserId').val();
        if (!userId) {
            swal('Error', 'Seleccione un usuario', 'error');
            return;
        }
        // Obtener el email del usuario seleccionado del option
        var userEmail = $('#recipientUserId option:selected').text().split(' - ')[1];
        formData.userId = userId;
        formData.email = userEmail;
    } else if (recipientType === 'EMAIL') {
        formData.email = $('#recipientEmail').val();
        if (!formData.email || !validateEmail(formData.email)) {
            swal('Error', 'Ingrese un email válido', 'error');
            return;
        }
    } else {
        swal('Error', 'Seleccione un tipo de destinatario', 'error');
        return;
    }
    
    $.ajax({
        type: 'POST',
        url: '/config/notification/recipient/add',
        data: formData,
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success') {
                toastr.success(response.message);
                loadRecipients(notificationId);
                clearRecipientForm();
            } else {
                swal('Error', response.message, 'error');
            }
        },
        error: function(xhr) {
            swal('Error', 'Error al agregar destinatario', 'error');
        }
    });
}

function loadRecipients(notificationId) {
    $.ajax({
        type: 'GET',
        url: '/tables/notification/recipients',
        data: { notificationId: notificationId },
        dataType: 'json',
        success: function(response) {
            tableRecipients.clear();
            tableRecipients.rows.add(response);
            tableRecipients.draw();
        },
        error: function(xhr) {
            console.error('Error al cargar destinatarios', xhr);
        }
    });
}

function deleteRecipient(recipientId) {
    swal({
        title: '¿Eliminar destinatario?',
        icon: 'warning',
        buttons: ['Cancelar', 'Eliminar'],
        dangerMode: true
    }).then((willDelete) => {
        if (willDelete) {
            $.ajax({
                type: 'DELETE',
                url: '/config/notification/recipient/delete',
                data: { Id: recipientId },
                dataType: 'json',
                success: function(response) {
                    if (response.status === 'success') {
                        toastr.success(response.message);
                        var notificationId = $('#recipientNotificationId').val();
                        loadRecipients(notificationId);
                    } else {
                        swal('Error', response.message, 'error');
                    }
                },
                error: function(xhr) {
                    swal('Error', 'Error al eliminar destinatario', 'error');
                }
            });
        }
    });
}

// Utilidades

function toggleRecipientFields() {
    var recipientType = $('#recipientType').val();
    
    $('#div-user-select').hide();
    $('#div-email-input').hide();
    $('#div-group-input').hide();
    
    if (recipientType === 'USER') {
        $('#div-user-select').show();
    } else if (recipientType === 'EMAIL') {
        $('#div-email-input').show();
    } else if (recipientType === 'GROUP') {
        $('#div-group-input').show();
    }
}

function clearRecipientForm() {
    $('#recipientType').val('');
    $('#recipientUserId').val('');
    $('#recipientEmail').val('');
    $('#recipientGroup').val('');
    toggleRecipientFields();
}

function validateEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function sendTestEmail() {
    var notificationId = $('#notificationId').val();
    
    if (!notificationId) {
        swal('Error', 'Primero debe guardar la configuración', 'error');
        return;
    }
    
    swal({
        title: 'Enviar correo de prueba',
        text: 'Ingrese el email de destino:',
        content: 'input',
        buttons: ['Cancelar', 'Enviar']
    }).then((email) => {
        if (email && validateEmail(email)) {
            $.ajax({
                type: 'POST',
                url: '/config/notification/test-email',
                data: { 
                    notificationId: notificationId,
                    testEmail: email
                },
                dataType: 'json',
                success: function(response) {
                    if (response.status === 'ok') {
                        swal('Enviado', 'Correo de prueba enviado correctamente', 'success');
                    } else {
                        swal('Error', response.message, 'error');
                    }
                },
                error: function(xhr) {
                    swal('Error', 'Error al enviar el correo', 'error');
                }
            });
        } else if (email) {
            swal('Error', 'Email inválido', 'error');
        }
    });
}

// Limpiar formulario al cerrar modal
$('#modalAddNotification').on('hidden.bs.modal', function() {
    $('form[form-name="form-notification"]')[0].reset();
    $('#notificationId').val('');
    $('#recipientNotificationId').val('');
    $('#btn-save-notification').html('<i class="icon ion-ios-save"></i> Guardar Configuración');
    $('#div-recipients').hide();
    tableRecipients.clear().draw();
    clearRecipientForm();
});
