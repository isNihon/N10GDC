$(document).ready(function () {

    idTabDocs=0;

    //--tabla de formatos inicio
    TableForm(0)
    function TableForm(id){
    var urlLanguage = '../js/datatables/languaje/Spanish.json'
    window.tabFor= $('#table-format').DataTable( {

        scrollY: true,
        scrollY: '40vh',
         pageLength:  25,

        language: {
        url: urlLanguage
        },
        ajax: {
            url:'/tables/form/line/?tp=0',
            dataSrc: ''
        },

        columns: [

        {
            "className": "",
            'orderable': false,
            data: null,
            defaultContent: '',
            width:'1%'
        },

        {
            "className": "icon ion-md-close-circle",
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
            width:'1%'
        },
    
        { data: 'Id' },
        { data: 'Number' },
        { data: 'Modelo' },
        { data: 'Desc' },
        { data: 'status' },
        { data: 'Fecha' },
        ] ,

        rowCallback:function(row,data){
            color='white'
            if(data.status=='!!!CANCELADA!!!'){color='#AEB6BF '}
                for (var i=0;i<=14;i++){
                    $($(row).find("td")[i]).css( "text-align","center");
                    $($(row).find("td")[i]).css("background-color",color);
                    //$($(row).find("td")[i]).css( "font-size","90%");
            }
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
                      if (index !== 22) { // Cambia el número 1 por el índice de la columna que deseas excluir
                        $(this).css("background-color", "#FCF3CF");
                      }
                    });
                  },
                  function() {
                    // Restaurar los colores originales al quitar el cursor
                    $("td").each(function(index) {
                      if ($(this).index() !== 22) { // Cambia el número 1 por el índice de la columna que deseas excluir
                        $(this).css("background-color", originalColors[index]);
                      }
                    });
                  }
                );
              });
        },
        });

        $('#table-format tbody').on('click', 'td.icon.ion-md-close-circle', function () {
            var tr = $(this).closest('tr');
            var row =tabFor.row( tr );
            datos = row.data()
            var opcion = confirm("¿CANCELAR FORMATO?");
            if( opcion==true){
            $.ajax({
            type: 'POST', url: '/data/cancelacion', data : {id:datos.Id},
            dataType: 'text',
                success: function (response) {
                    var response = JSON.parse(response);
                    if (response.status == 'cancelada'){
                        toastr.options = {
                            positionClass: 'toast-top-right',
                            timeOut: 1000,
                            progressBar: true,
                            extendedTimeOut: 1000
                        };
                        // Creamos un mensaje personalizado con HTML
                        var mensajePersonalizado = '<img src="../images/deka-1.png" style="width:50%;">' 
                        toastr.success(mensajePersonalizado,'<p style="font-size: 15px; font-weight: bold; color: #0B0C0C  ;">¡'+response.mensage+'!</p>' );
                        window.tabFor.ajax.url('/tables/form/line/?tp=0').load()
                    } else if (response.status == "error") {
                        toastr.options = {
                            positionClass: 'toast-top-right',
                            timeOut: 1000,
                            progressBar: true,
                            extendedTimeOut: 1000
                        };
                        // Creamos un mensaje personalizado con HTML
                        var mensajePersonalizado = '<img src="../images/deka-1.png" style="width:50%;">' 
                            toastr.error(mensajePersonalizado,'<p style="font-size: 15px; font-weight: bold; color: #0B0C0C  ;">¡Error!</p>' );
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
                    timeOut: 1000,
                    progressBar: true,
                    extendedTimeOut: 1000
                };
                // Creamos un mensaje personalizado con HTML
                var mensajePersonalizado = '<img src="../images/deka-1.png" style="width:50%;">' 
                toastr.success(mensajePersonalizado,'<p style="font-size: 15px; font-weight: bold; color: #0B0C0C  ;">¡OK!</p>' );
            }
        } );

        $('#table-format tbody').on('click', 'td.icon.ion-md-create', function () {
            var tr = $(this).closest('tr');
            var row =tabFor.row( tr );
            datos = row.data()
            document.getElementById('btn-add-User').click();
            $(document).find('input[name=idForm]').val(datos.Id)
            $(document).find('input[name=idFP]').val(datos.Id)
            $(document).find('input[name=idd]').val(0)
            $(document).find('input[name=PartNumber]').val(datos.Number)
            $(document).find('input[name=Model]').val(datos.Modelo)
            $(document).find('input[name=Description]').val(datos.Desc)
            window.Itabla.ajax.url('/tables/report/detalle/?id='+datos.Id).load()
            window.tableDocs.ajax.url('/tables/tabDocs?id=0 ',).load()
            $(document).find('form[form-name=form-Principal]').attr('method', 'PUT')  
            $('#div-movimientos-add').removeAttr('hidden');
            $('#t-doc').removeAttr('hidden');
        } );

        setTimeout(function(){
            var table = $('#table-format').DataTable();
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
            table.buttons().container().appendTo( $('#table-format_filter', table.table().container() ) );
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

    //------inicializa tabla de detalle de formulario principal
    initTableinicio(0)
    function initTableinicio(id){
        var urlLanguage = '../js/datatables/languaje/Spanish.json'
        window.Itabla = $('#Tabledetalle').DataTable( {
        
            language: {
            url: urlLanguage
            },
            ajax: {
                url:'/tables/report/detalle/?id='+id,
                dataSrc: ''
            },
    
            columns: [
    
            {
                "className": "",
                'orderable': false,
                data: null,
                defaultContent: '',
                width:'1%'
            },
    
            {
                "className": "icon ion-md-trash",
                'orderable': false,
                data: null,
                defaultContent: '',
                width:'1%'
            },
    
            {
                "className": "icon ion-md-create",
                'orderable': false,
                data: null,
                defaultContent: '',
                width:'1%'
            },
        
            { data: 'SDS' },
            { data: 'SDC' },
            { data: 'UM' },
            { data: 'CANTIDAD'},
            { data: 'FPO' },
            { data: 'FFIN' },
            { data: 'UBIC'},
            { data: 'NIVEL'},
            { data: 'PRECIO' },
            { data: 'PROVEEDOR' },
            { data: 'COLOR' },

            ] ,
            rowCallback:function(row,data){
                    for (var i=0;i<=14;i++){
                        $($(row).find("td")[i]).css( "text-align","center");
                        $($(row).find("td")[i]).css( "font-size","90%");
                    }

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
                              if (index !== 22) { // Cambia el número 1 por el índice de la columna que deseas excluir
                                $(this).css("background-color", "#FCF3CF");
                              }
                            });
                        },
                        function() {
                            // Restaurar los colores originales al quitar el cursor
                            $("td").each(function(index) {
                              if ($(this).index() !== 22) { // Cambia el número 1 por el índice de la columna que deseas excluir
                                $(this).css("background-color", originalColors[index]);
                                }
                            });
                            }
                        );
                    });

                    if(data.UBIC!=null){
                        if(data.UBIC.trim()=='U1'){
                            $($(row).find("td")[9]).text('Almacen recibo P1');

                        }else if(data.UBIC.trim()=='U2'){
                            $($(row).find("td")[9]).text('Almacen recibo P2');
                        
                        }else if(data.UBIC.trim()=='U3'){
                            $($(row).find("td")[9]).text('Almacen recibo P3');

                        }else if(data.UBIC.trim()=='U4'){
                            $($(row).find("td")[9]).text('Proceso planta 1');

                        }else if(data.UBIC.trim()=='U5'){
                            $($(row).find("td")[9]).text('Proceso planta 2');
                            
                        }else if(data.UBIC.trim()=='U6'){
                            $($(row).find("td")[9]).text('Proceso planta 3');

                        }else if(data.UBIC.trim()=='U7'){
                            $($(row).find("td")[9]).text('Carpa verde planta 1');

                        }else if(data.UBIC.trim()=='U8'){
                            $($(row).find("td")[9]).text('Carpa blanca planta 1');

                        }else if(data.UBIC.trim()=='U9'){
                            $($(row).find("td")[9]).text('Inspección recibo planta 1');

                        }else if(data.UBIC.trim()=='U10'){
                            $($(row).find("td")[9]).text('Inspección recibo planta 2');

                        }else if(data.UBIC.trim()=='U11'){
                            $($(row).find("td")[9]).text('Inspección recibo planta 3');
                        }
                    }else{
                    }
            },
        });

        $('#Tabledetalle tbody').on('click', 'td.icon.ion-md-trash', function () {
            var tr = $(this).closest('tr');
            var row =Itabla.row( tr );
            datos = row.data()
            var opcion = confirm("¿ELIMINAR DOCUMENTO?");
            if( opcion==true){
            $.ajax({
                type: 'POST', url: '/data/eliminar', data : {id:datos.Id},
                dataType: 'text',
                    success: function (response) {
                        var response = JSON.parse(response);
                        if (response.status == 'ok'){
                            toastr.options = {
                                positionClass: 'toast-top-right',
                                timeOut: 1000,
                                progressBar: true,
                                extendedTimeOut: 1000
                            };
                            // Creamos un mensaje personalizado con HTML
                            var mensajePersonalizado = '<img src="../images/deka-1.png" style="width:50%;">' 
                            toastr.success(mensajePersonalizado,'<p style="font-size: 15px; font-weight: bold; color: #0B0C0C  ;">¡'+response.mensage+'!</p>' );
                            id=document.getElementById("idForm").value
                            window.Itabla.ajax.url('/tables/report/detalle/?id='+id).load()
                        } else if (response.status == "error") {
                            toastr.options = {
                                positionClass: 'toast-top-right',
                                timeOut: 1000,
                                progressBar: true,
                                extendedTimeOut: 1000
                            };
                            // Creamos un mensaje personalizado con HTML
                            var mensajePersonalizado = '<img src="../images/deka-1.png" style="width:50%;">' 
                            toastr.error(mensajePersonalizado,'<p style="font-size: 15px; font-weight: bold; color: #0B0C0C  ;">¡Error!</p>' );
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
            $.notify({
                icon: 'icon ion-md-done-all',
                message:'ok'
            },{type: 'success'});
            }
        } );

        $('#Tabledetalle tbody').on('click', 'td.icon.ion-md-create', function () {
            var tr = $(this).closest('tr');
            var row =Itabla.row( tr );
            datos = row.data()
            var Ubicacion = document.getElementById("Ubicacion");
            index = 0
            var searchtext = datos.UBIC;
            for (var i = 0; i < Ubicacion.options.length; ++i) {
                if (Ubicacion.options[i].value === searchtext) Ubicacion.options[i].selected = true;
            }
            /*
            var Nivel = document.getElementById("Nivel");
            index = 0
            var searchtext = datos.NIVEL;
            for (var i = 0; i < Nivel.options.length; ++i) {
                if (Nivel.options[i].value === searchtext) Nivel.options[i].selected = true;
            }
            */
            $(document).find('input[name=SDC]').val(datos.SDC)
            $(document).find('input[name=SDS]').val(datos.SDS)
            $(document).find('input[name=PRECIO]').val(datos.PRECIO)
            $(document).find('input[name=PROVEEDOR]').val(datos.PROVEEDOR)
            $(document).find('input[name=COLOR]').val(datos.COLOR)
            $(document).find('input[name=Nivel]').val(datos.NIVEL)
            $(document).find('input[name=UM]').val(datos.UM)
            $(document).find('input[name=Cant]').val(datos.CANTIDAD)
            $(document).find('input[name=FPO]').val(datos.FPO)
            $(document).find('input[name=FF]').val(datos.FFIN)
            $(document).find('input[name=idd]').val(datos.Id)
            $(document).find('input[name=idPlanPro0]').val(datos.Id)
            idTabDocs=datos.Id
            window.tableDocs.ajax.url('/tables/tabDocs?id='+datos.Id,).load()
            document.getElementById('idLAVEL').value='Anexos:'+datos.SDS
            $(document).find('form[form-name=form-Detall]').attr('method', 'PUT')
        } );
    }

    //--------tabla de documentos
    initTableDocs(0)
    function initTableDocs(id){
        var urlLanguage = '../js/datatables/languaje/Spanish.json'
        window.tableDocs = $('#tab-docs').DataTable( {
            //"paging":   false,
            "ordering": false,
             pageLength:  25,
            //"info":     false, 
            "searching":    false, 
            scrollY: true,
            scrollY: '40vh',
            columnDefs: [{
            "targets": 6,
            "data": 'teamLogo',
            "render": function (data, type, row, meta) {
                return '<a href="'+data+' "target="_blank">'+
                '<object  data="' + data + '" alt="' + data + '"height="125" width="100" placeholder="da clic"/>'+
                '</object>' +
                '</a>';
            }
        }],
                languae: {
                url: urlLanguage
            },
            ajax: {
                url:'/tables/tabDocs?id='+id,
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
                /* {
                    "className": "icon ion-md-create",
                    'orderable': false,
                    data: null,
                    defaultContent: '',
                    width:'3%'
                },*/
                {
                        "className": "icon ion-md-eye",
                    'orderable': false,
                    data: null,
                    defaultContent: '',
                    width:'3%'
                },
                {
                    "className": "icon ion-md-trash",
                    'orderable': false,
                    data: null,
                    defaultContent: '',
                    width:'3%'
                },
                { data: 'id' },
                { data: 'descripcion' },
                { data: 'createDate'},
                { data: 'documentos'},
            ],

            rowCallback:function(row,data){
                for (var i=0;i<=14;i++){
                    $($(row).find("td")[i]).css( "text-align","center");
                   
                }

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
                          if (index !== 22) { // Cambia el número 1 por el índice de la columna que deseas excluir
                            $(this).css("background-color", "#FCF3CF");
                          }
                        });
                      },
                      function() {
                        // Restaurar los colores originales al quitar el cursor
                        $("td").each(function(index) {
                          if ($(this).index() !== 22) { // Cambia el número 1 por el índice de la columna que deseas excluir
                            $(this).css("background-color", originalColors[index]);
                          }
                        });
                      }
                    );
                  });
        },

        });

        $('#tab-docs tbody').on('click', 'td.icon.ion-md-eye', function () {
            var tr = $(this).closest('tr');
            var row = tableDocs.row( tr );
            datos = row.data()
            document.getElementById("pdfFile").src=datos.documentos
            $("#pdfModal").modal("toggle")
        } );

        $('#tab-docs tbody').on('click', 'td.icon.ion-md-trash', function () {
            var tr = $(this).closest('tr');
            var row = tableDocs.row( tr );
            datos = row.data()
            var opcion = confirm("¿ELIMINAR DOCUMENTO?");
            if( opcion==true){
            $.ajax({
                type: 'POST', url: '/data/eliminar/documento', data : {id:datos.id},
                dataType: 'text',
                    success: function (response) {
                        var response = JSON.parse(response);
                        if (response.status == 'ok'){
                            
                            toastr.options = {
                                positionClass: 'toast-top-right',
                                timeOut: 1000,
                                progressBar: true,
                                extendedTimeOut: 1000
                            };
                            // Creamos un mensaje personalizado con HTML
                            var mensajePersonalizado = '<img src="../images/deka-1.png" style="width:50%;">' 
                            toastr.success(mensajePersonalizado,'<p style="font-size: 15px; font-weight: bold; color: #0B0C0C  ;">¡'+response.mensage+'!</p>' );
                            id=document.getElementById("idForm").value
                            window.tableDocs.ajax.url('/tables/tabDocs?id='+datos.idPlanPro,).load()
                        } else if (response.status == "error") {
                            toastr.options = {
                                positionClass: 'toast-top-right',
                                timeOut: 1000,
                                progressBar: true,
                                extendedTimeOut: 1000
                            };
                            // Creamos un mensaje personalizado con HTML
                            var mensajePersonalizado = '<img src="../images/deka-1.png" style="width:50%;">' 
                            toastr.error(mensajePersonalizado,'<p style="font-size: 15px; font-weight: bold; color: #0B0C0C  ;">¡Error!</p>' );
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
                    timeOut: 1000,
                    progressBar: true,
                    extendedTimeOut: 1000
                };
                // Creamos un mensaje personalizado con HTML
                var mensajePersonalizado = '<img src="../images/deka-1.png" style="width:50%;">' 
                toastr.success(mensajePersonalizado,'<p style="font-size: 15px; font-weight: bold; color: #0B0C0C  ;">¡OK!</p>' );
                id=document.getElementById("idForm").value
            }
        } );
    }  
});

//hace que mi modal se mantenga estatico y al presionar fuera no se cierre
$(document).find('#btn-add-User').on('click', function (){
    $('#modalFormPrincipal').modal({'backdrop':false});
    setdefault2()
    setdefault()
});

//limpia el contenido de mi modal
$(document).find('#btn-user').on('click', function (){
    setdefault()
});

//--guarda formulrio principal
function saveForm(){
    var $findTargetRAEdetail = $(document).find('[form-name=form-Principal]');
    var dataPost = $findTargetRAEdetail.serialize();
    var Durl = $findTargetRAEdetail.attr('action');
    var method = $findTargetRAEdetail.attr('method')
    var type = "text";
        $.ajax({
            type: method, url: Durl, data : dataPost,
            dataType: type,
            success: function (response) {
                var response = JSON.parse(response);
                if (response.status == 'ok'){
                    toastr.options = {
                        positionClass: 'toast-top-right',
                        timeOut: 1000,
                        progressBar: true,
                        extendedTimeOut: 1000
                    };
                    // Creamos un mensaje personalizado con HTML
                    var mensajePersonalizado = '<img src="../images/deka-1.png" style="width:50%;">' 
                    toastr.success(mensajePersonalizado,'<p style="font-size: 15px; font-weight: bold; color: #0B0C0C  ;">¡Datos guardados!</p>' );
                    $('#buttom-formPrincipal-report').attr("hidden", "true");
                    $('#div-movimientos-add').removeAttr('hidden');
                    $('#NumberPart').attr("readonly", "true");
                    $('#Model').attr("readonly", "true");
                    $('#Description').attr("readonly", "true");
                    document.getElementById("idForm").value=response.id
                    window.Itabla.ajax.url('/tables/report/detalle/?id='+response.id).load()
                    window.tabFor.ajax.url('/tables/form/line/?tp=0').load()
                } else if (response.status == "error") {
                    toastr.options = {
                        positionClass: 'toast-top-right',
                        timeOut: 1000,
                        progressBar: true,
                        extendedTimeOut: 1000
                    };
                    // Creamos un mensaje personalizado con HTML
                    var mensajePersonalizado = '<img src="../images/deka-1.png" style="width:50%;">' 
                    toastr.error(mensajePersonalizado,'<p style="font-size: 15px; font-weight: bold; color: #0B0C0C  ;">¡Error!</p>' );
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

//guarda el detalle de mi formulario
function saveFormDetalle(){
    var $findTargetRAEdetail = $(document).find('[form-name=form-Detall]');
    var dataPost = $findTargetRAEdetail.serialize();
    var Durl = $findTargetRAEdetail.attr('action');
    var method = $findTargetRAEdetail.attr('method')
    var type = "text";
        $.ajax({
            type: method, url: Durl, data : dataPost,
            dataType: type,
            success: function (response) {
                var response = JSON.parse(response);
                if (response.status == 'ok'){
                    toastr.options = {
                        positionClass: 'toast-top-right',
                        timeOut: 1000,
                        progressBar: true,
                        extendedTimeOut: 1000
                    };
                    // Creamos un mensaje personalizado con HTML
                    var mensajePersonalizado = '<img src="../images/deka-1.png" style="width:50%;">' 
                    toastr.success(mensajePersonalizado,'<p style="font-size: 15px; font-weight: bold; color: #0B0C0C  ;">¡Datos guardados!</p>' );
                    id=document.getElementById("idForm").value
                    window.Itabla.ajax.url('/tables/report/detalle/?id='+id).load()
                    document.getElementById("idPlanPro").value=response.id
                    $('#t-doc').removeAttr('hidden');
                    idTabDocs=response.id
                    window.tableDocs.ajax.url('/tables/tabDocs?id='+idTabDocs,).load()
                    document.getElementById('idLAVEL').value='Anexos:'+response.SDS
                    setdefault()
                    
                } else if (response.status == "error") {
                    toastr.options = {
                        positionClass: 'toast-top-right',
                        timeOut: 1000,
                        progressBar: true,
                        extendedTimeOut: 1000
                    };
                    // Creamos un mensaje personalizado con HTML
                    var mensajePersonalizado = '<img src="../images/deka-1.png" style="width:50%;">' 
                    toastr.error(mensajePersonalizado,'<p style="font-size: 15px; font-weight: bold; color: #0B0C0C  ;">¡Error!</p>' );
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

//realiza el vaciado de mis campos para agregar otro detalle
function setdefault2(){
    $('#div-movimientos-add').attr("hidden", "true");
    $('#t-doc').attr("hidden", "true");
    $(document).find('#idForm').val('')
    $(document).find('#idd').val('')
    $(document).find('#idPlanPro').val('')
    $(document).find('#NumberPart').val('')
    $(document).find('#Model').val('')
    $(document).find('#Description').val('')
    $('#NumberPart').removeAttr('readonly')
    $('#Model').removeAttr('readonly')
    $('#Description').removeAttr('readonly')
    $('#buttom-formPrincipal-report').removeAttr('hidden');
    $(document).find('form[form-name=form-Principal]').attr('method', 'POST')      
    update = false
    window.Itabla.ajax.url('/tables/report/detalle/?id=0').load()
    window.tableDocs.ajax.url('/tables/tabDocs?id=0 ',).load()
}

//realiza el vaciado de mis campos para agregar otro detalle
function setdefault(){
    $(document).find('#SDC').val('')
    $(document).find('#SDS').val('')
    $(document).find('#PRECIO').val('')
    $(document).find('#PROVEEDOR').val('')
    $(document).find('#COLOR').val('')
    $(document).find('#UM').val('')
    $(document).find('#FPO').val('')
    $(document).find('#FF').val('');
    $(document).find('#Nivel').val('');
    $(document).find('#Ubicacion').val('');
    $(document).find('#Cant').val('');
    $(document).find('form[form-name=form-Detall]').attr('method', 'POST')   
}

document.getElementById("Tabla").value="select * FROM  NUMBERPART ";

function searchRegister(){
    var Query=document.getElementById("Tabla").value
    var Wherd=" where  Fecha "
    var Betwn=" BETWEEN '"+document.getElementById("DTIni").value+"' and '"+document.getElementById("DTf").value+"'"
    var ORd=" order by Id desc"
    var vard= Query+Wherd+Betwn+ORd

    window.tabFor.ajax.url('/tables/form/line/?tp=1&vard='+vard).load()
 }

document.getElementById('DocumenDis').title=`
Almacen recibo P1
Almacen recibo P2
Almacen recibo P3
Carpa verde planta 1
Carpa blanca planta 1
Inspección recibo planta 1
Inspección recibo planta 2
Inspección recibo planta 3
Proceso P1
Proceso P2
Proceso P3
`
