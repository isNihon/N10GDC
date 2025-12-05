//espera que se cargue toda la pagina para ejecutarsde
$(document).ready(function () {
    
    //tabla principal donde se listan los usuarios
    initTable()
    function initTable(){
        var urlLanguage = '../js/datatables/languaje/Spanish.json'
        window.table = $('#material').DataTable( {
            scrollY: true,
        scrollY: '40vh',
         pageLength:  25,
            language: {
                url: urlLanguage
            },
            ajax: {
                url:'/tables/users?',
                dataSrc: ''
            },
            columns: [
                {
                    "className": "",
                    'orderable': false,
                    data: null,
                    defaultContent: '',
                    width:'3%'
                },
                {
                    "className": "icon ion-md-power",
                    'orderable': false,
                    data: null,
                    defaultContent: '',
                    width:'3%'
                },
                {
                    "className": "icon ion-md-create",
                    'orderable': false,
                    data: null,
                    defaultContent: '',
                    width:'3%'
                },
                { data: 'Id' },
                { data: 'name'},
                { data: 'user'},
                { data: 'admin'},
                { data: 'position'},
                { data: 'email'},
                { data: 'depto'},
                { data: 'password' },
                { data: 'disabled'}
            ],

            rowCallback:function(row,data){
                var color=" #52BE80"
                if(data.disabled==0){
                    var color="#EC7063 "
                    $($(row).find("td")[11]).text('BLOQUEADO');
                }else if(data.disabled==1){
                    $($(row).find("td")[11]).text('ACTIVADO '); 
                }

                if(data.admin==0){
                    $($(row).find("td")[6]).text('USUARIO');
                }else if(data.admin==1){
                    $($(row).find("td")[6]).text('ADMINISTRADOR'); 
                    $($(row).find("td")[6]).css("background-color",'#F4D03F')
                }

                for(var i=0;i<=15;i++){
                    $($(row).find("td")[i]).css( "text-align","center");
                }
                
                $($(row).find("td")[11]).css("background-color",color);

                $(document).ready(function() {
                    // Guardar los colores originales al cargar la página
                    var originalColors = [];
                
                    $("td").each(function() {
                      originalColors.push($(this).css("background-color"));
                    });
                
                    $("td").hover(
                       function() {
                        // Obtener el índice de la columna de la celda actual
                        var colIndex = $(this).index();
                        // Cambiar el color de fondo de las celdas en la misma fila, excluyendo la columna específica (en este caso, la segunda columna)
                        $(this).parent().find("td").each(function(index) {
                          if (index !== 11 && index !==6 ) { // Cambia el número 1 por el índice de la columna que deseas excluir
                            $(this).css("background-color", "#FCF3CF");
                        }
                        });
                    },
                    function() {
                        // Restaurar los colores originales al quitar el cursor
                        $("td").each(function(index) {
                          if ($(this).index() !== 11 ) { // Cambia el número 1 por el índice de la columna que deseas excluir
                            $(this).css("background-color", originalColors[index]);
                          }
                        });
                      },
                    );
                  });
            },
        });

        $('#material tbody').on('click', 'td.icon.ion-md-power', function () {
            var tr = $(this).closest('tr');
            var row = table.row( tr );
            datos = row.data()
            if(datos.disabled==1){
                var opcion = confirm("¿BLOQUEAR ACCESO?");
            } else if(datos.disabled==0){
                var opcion = confirm("¿HABILITAR ACCESO?");
            }
            if( opcion==true){
                $.ajax({
                    type: 'PUT', url: '/up/user/on', data : {id:datos.Id,on:datos.disabled},
                    dataType: 'text',
                        success: function (response) {
                            var response = JSON.parse(response);
                            if (response.status == 'ok'){
                                toastr.options = {
                                    positionClass: 'toast-top-right',
                                    timeOut: 5000,
                                    progressBar: true,
                                    extendedTimeOut: 2000
                                };
                                // Creamos un mensaje personalizado con HTML
                                var mensajePersonalizado = '<img src="/images/deka-1.png" style="width:50%">' 
                                toastr.success(mensajePersonalizado, '<p style="font-size: 15px; font-weight: bold; color: #0B0C0C  ;">'+response.mensage+'</p>' );
                                window.table.ajax.url('/tables/users?').load()
                            } else if (response.status == "error") {
                                toastr.options = {
                                    positionClass: 'toast-top-right',
                                    timeOut: 5000,
                                    progressBar: true,
                                    extendedTimeOut: 2000
                                };
                                // Creamos un mensaje personalizado con HTML
                                var mensajePersonalizado = '<img src="/images/deka-1.png" style="width:50%">' 
                                toastr.warning(mensajePersonalizado, '<p style="font-size: 15px; font-weight: bold; color: #0B0C0C  ;">ERROR</p>' );
                            }  
                        },
                    error: function (xhr) {
                        $('#resError').removeClass('hide')
                        $('#resError').append('Error: ' + xhr.status + ' ' + xhr.statusText)
                    },
                    complete: function () {
                    }
                });
                }else{
                    toastr.options = {
                        positionClass: 'toast-top-right',
                        timeOut: 5000,
                        progressBar: true,
                        extendedTimeOut: 2000
                    };
                    // Creamos un mensaje personalizado con HTML
                    var mensajePersonalizado = '<img src="/images/deka-1.png" style="width:50%">' 
                    toastr.success(mensajePersonalizado, '<p style="font-size: 15px; font-weight: bold; color: #0B0C0C  ;">OK</p>' );
                    }
        } );

        $('#material tbody').on('click', 'td.icon.ion-md-create', function () {
            var tr = $(this).closest('tr');
            var row = table.row( tr );
            datos = row.data()
            //console.log(datos);
            var admin = false;
            var acces1 = false;
            var acces2= false;
            var acces3 = false;
            var acces4 = false;
            var acces5 = false;
            var acces6 = false;

            if (datos.admin == 1){
                admin = true
            }

            if (datos.acces1 == 1){
                acces1 = true
            }

            if (datos.acces2 == 1){
                acces2 = true
            }

            if (datos.acces3 == 1){
                acces3 = true
            }

            if (datos.acces4 == 1){
                acces4 = true
            }

            if (datos.acces5 == 1){
                acces5 = true
            }

            if (datos.acces6 == 1){
                acces6 = true
            }

            var depto = document.getElementById("depto");
            index = 0
            var searchtext =''+ datos.depto;
            for (var i = 0; i < depto.options.length; ++i) {
                if (depto.options[i].text === searchtext) depto.options[i].selected = true;
            }

            $(document).find('input[name=tpControl').val(0)
            $(document).find('input[name=idControl]').val(datos.Id)
            $(document).find('input[name=number]').val(datos.user)
            $(document).find('input[name=password]').val(datos.password)
            $(document).find('input[name=name]').val(datos.name)
            $(document).find('input[name=position]').val(datos.position)
            $(document).find('input[name=email]').val(datos.email)
            $(document).find('input[name=depto]').val(datos.depto)
            $(document).find('input[name=admin]').prop('checked',admin )
            $(document).find('input[name=acces1]').prop('checked',acces1 )
            $(document).find('input[name=acces2]').prop('checked',acces2 )
            $(document).find('input[name=acces3]').prop('checked',acces3 )
            $(document).find('input[name=acces4]').prop('checked',acces4 )
            $(document).find('input[name=acces5]').prop('checked',acces5 )
            $(document).find('input[name=acces6]').prop('checked',acces6 )
            $('#modalUsers').modal({'backdrop':'static'}) 
            //abre el modal
            $("#modalUsers").modal("toggle");
            //$(document).find('#btn-add-User').click() 
            //$(document).find('#btn-password').click() 
            $(document).find('form[form-name=form-user]').attr('method', 'PUT') 
        } );

        setTimeout(function(){
            var table = $('#material').DataTable();
            new $.fn.dataTable.Buttons( table, {
                buttons: [
                    {
                        extend: 'copy',
                        text: 'Copiado al Portapapeles'
                    }, 
                    {
                        extend: 'print',
                        messageTop:'Catalogo de Operadores',
                        text: 'Imprimir la pagina activa',
                        autoPrint: true,
                        exportOptions: {
                            columns: ':visible',
                        },
                        customize: function (win) {
                            $(win.document.body).find('h1').addClass('display').css('font-size', '20px');
                            $(win.document.body).find('tr').css('font-size', '16px');
                            $(win.document.body).find('tr td:nth-child(9)').each(function(index){
                                var valor = parseInt($(this).text())
                                var clase = '';
                                $(this).addClass(clase);
                            });
                            $(win.document.body).find('h1').css('text-align','center');
                        }
                    }
                    , 
                    {
                        extend: 'excelHtml5',
                        text: 'Save as Excel',
                        customize: function( xlsx ) {
                        }
                    }
                ]
            } );
            table.buttons().container().appendTo( $('#material_filter', table.table().container() ) );
            $(".buttons-copy span").remove()
            $(".buttons-copy").append("<i class='icon ion-md-copy'></i>")
            $(".buttons-print span").remove()
            $(".buttons-print").append("<i class='icon ion-md-print'></i>")
            $(".buttons-excel span").remove()
            $(".buttons-excel").append("<i class='icon ion-md-download'></i>")
            $(".buttons-pdf span").remove()
            $(".buttons-pdf").append("<i class='icon ion-md-document' alt='pdf'></i>")
        }, 100)  
    }
    
    //bacea el contenido de mi modal para agregar nuevo usuario y no al editar
    $(document).find('#cleardatoUser').on('click', function (){
       setDefaults()
    })

    //BOTON QUE GENERA LAS CONTRACEÑAS
    $(document).find('#btn-password').on('click', function (){
        var leter = ['a', 'b', 'c', 'd', 'f', 'g' , 'h' , 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'v']
        var numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
        var password = 'NPM' + numbers[Math.floor(Math.random() * numbers.length)] + numbers[Math.floor(Math.random() * numbers.length)]
            password += leter[Math.floor(Math.random() * numbers.length)] + numbers[Math.floor(Math.random() * numbers.length)] + numbers[Math.floor(Math.random() * numbers.length)] + leter[Math.floor(Math.random() * numbers.length)]
        $(document).find('input[name=password]').val(password)
    })
    
    //--realiza el insert y update de los usuarios
    $(document).find('#btn-user').on('click', function (){
        var number = $(document).find('#number');
        var name = $(document).find('#inName');
        var perfil = $(document).find('#profile');
        var position = $(document).find('#position');
        var email = $(document).find('#email');
        var depto = $(document).find('#depto');
        var inPassword = $(document).find('#inPassword');
        
        if (number.val() == 0){
            $.notify({
                icon: 'icon ion-md-close-circle',
                message:"El usuario no debe quedar vacio"
              },{type: 'info'});
            return false
        }
       
        if (name.val() == 0){
            $.notify({
                icon: 'icon ion-md-close-circle',
                message:"El nombre del usuario es obligatorio"
              },{type: 'info'});
            return false
        }

        if (inPassword.val() == ''){
            $.notify({
                icon: 'icon ion-md-close-circle',
                message:"Debe generar un password"
              },{type: 'info'});
            return false
        }

        if (position.val() == ''){
            $.notify({
                icon: 'icon ion-md-close-circle',
                message:"Debe elegir un puesto de acceso"
              },{type: 'info'});
            return false
        }

        if (depto.val() == ''){
            $.notify({
                icon: 'icon ion-md-close-circle',
                message:"Debe asignar el departamento "
              },{type: 'info'});
            return false
        }

        if (email.val() == ''){
            $.notify({
                icon: 'icon ion-md-close-circle',
                message:"Debe asignar el email "
              },{type: 'info'});
            return false
        }

        var $findTarget1 = $(document).find('[form-name=form-user]');
        var dataPost = $findTarget1.serialize();
        var Durl = $findTarget1.attr('action');
        var method = $findTarget1.attr('method')
        var type = "text";
        if (dataPost != '') {
            $.ajax({
                type: method, url: Durl, data : dataPost,
                dataType: type,
                success: function (response) {
                    var response = JSON.parse(response);
                    if (response.status == 'ok'){
                        $.notify({
                            icon: 'icon ion-md-done-all',
                            message:response.mensage
                        },{type: 'success'});
                        setDefaults()
                        window.table.ajax.url('/tables/users?').load()
                    } else if (response.status == "error") {
                        $.notify({
                            icon: 'icon ion-md-close-circle',
                            message:response.mensage
                        },{type: 'info'});
                    }   
                },
                error: function (xhr) {
                    $('#resError').removeClass('hide')
                    $('#resError').append('Error: ' + xhr.status + ' ' + xhr.statusText)
                },
                complete: function () {
                }
            });
        }
    });

    //realiza el vaciado de mis campos
    function setDefaults(){
        $(document).find('#number').val('')
        $(document).find('#inName').val('');
        $(document).find('#profile').val('');
        $(document).find('#position').val('');
        $(document).find('#email').val('');
        $(document).find('#depto').val('');
        $(document).find('#inPassword').val('');
        $(document).find('input[name=admin]').prop('checked',false )
        $(document).find('input[name=acces1]').prop('checked',false )
        $(document).find('input[name=acces2]').prop('checked',false )
        $(document).find('input[name=acces3]').prop('checked',false )
        $(document).find('input[name=acces4]').prop('checked',false )
        $(document).find('input[name=acces5]').prop('checked',false )
        $(document).find('input[name=acces6]').prop('checked',false )
        $(document).find('form[form-name=form-user]').attr('method', 'POST')   
    }

//-----------realiza busqueda del usuario si existe o no
    $(document).find('#number').on('blur', function (){
        var us = $(document).find('#number').val()
        if (us != ''){
          getUser(us)
        }   
    })
//-----------realiza busqueda del usuario si existe o no
    function getUser(us){
        var value = us
        $.ajax({
            type: 'GET', url: '/data/user', data : {number:value},
            dataType: 'text',
            success: function (response) {
                var response = JSON.parse(response);
                if (response.status == "ok"){
                    usuario = true
                    $.notify({
                        icon: 'icon ion-md-close-circle',
                        message:"El usuario ya existe"
                    },{type: 'info'});
                } else {
                    usuario = false
                    $(document).find('#btn-password').click() 
                }
            },
            error: function (xhr) {
                $('#resError').removeClass('hide')
                $('#resError').append('Error: ' + xhr.status + ' ' + xhr.statusText)
            },
            complete: function () {
            }
        });  
    }
});

//--carga de datos de mi format
$(document).find('#btn-add-User').on('click', function (){
    setDefaults()
    $('#modalUsers').modal({'backdrop':'static'}) 
});

//realiza el vaciado de mis campos
function setDefaults(){
    $(document).find('#number').val('')
    $(document).find('#inName').val('');
    $(document).find('#profile').val('');
    $(document).find('#position').val('');
    $(document).find('#email').val('');
    $(document).find('#depto').val('');
    $(document).find('#inPassword').val('');
    $(document).find('input[name=admin]').prop('checked',false )
    $(document).find('input[name=acces1]').prop('checked',false )
    $(document).find('input[name=acces2]').prop('checked',false )
    $(document).find('input[name=acces3]').prop('checked',false )
    $(document).find('input[name=acces4]').prop('checked',false )
    $(document).find('input[name=acces5]').prop('checked',false )
    $(document).find('input[name=acces6]').prop('checked',false )
    $(document).find('form[form-name=form-user]').attr('method', 'POST')   
}




