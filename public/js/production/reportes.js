$(document).ready(function () {

    idTabDocs=0;

    //--tabla de formatos inicio
    TableForm(0)
    function TableForm(id){
    var urlLanguage = '../js/datatables/languaje/Spanish.json'
    window.tabFor= $('#table-format').DataTable( {

        scrollY: true,
        scrollY: '20vh',

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
            // Mantener bloqueados FPO, Ubicacion y fechaExp
            // Solo se desbloquean al editar un detalle específico con CantStock = 0
            $('#FPO').prop('disabled', true);
            $('#Ubicacion').prop('disabled', true);
            $('#fechaExp').prop('disabled', true);
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

            {
                "className": "icon ion-md-print",
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
            { data: 'FechaExp'},
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
            $(document).find('input[name=Ubicacion]').val(datos.UBIC)
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
            $(document).find('input[name=fechaExp]').val(datos.FechaExp)
            $(document).find('input[name=Nivel]').val(datos.NIVEL)
            $(document).find('input[name=UM]').val(datos.UM)
            $(document).find('input[name=Cant]').val(datos.CANTIDAD)
            $(document).find('input[name=FPO]').val(datos.FPO)
            $(document).find('input[name=FF]').val(datos.FFIN)
            $(document).find('input[name=idd]').val(datos.Id)
            $(document).find('input[name=idPlanPro0]').val(datos.Id)
            
            // Verificar CantStock para bloquear/desbloquear campos
            var cantStock = parseInt(datos.CantStock) || 0;
            
            if (cantStock === 0) {
                // Si CantStock = 0, desbloquear los campos FPO, Ubicacion y fechaExp
                $('#FPO').prop('disabled', false);
                $('#Ubicacion').prop('disabled', false);
                $('#fechaExp').prop('disabled', false);
                
                // Remover estilos de bloqueo si existen
                $('#FPO').css('background-color', '');
                $('#Ubicacion').css('background-color', '');
                $('#fechaExp').css('background-color', '');
                
                // Remover tooltips
                $('#FPO').removeAttr('title');
                $('#Ubicacion').removeAttr('title');
                $('#fechaExp').removeAttr('title');
            } else {
                // Si CantStock > 0, bloquear los campos FPO, Ubicacion y fechaExp
                $('#FPO').prop('disabled', true);
                $('#Ubicacion').prop('disabled', true);
                $('#fechaExp').prop('disabled', true);
                
                // Agregar estilo visual para indicar que están bloqueados
                $('#FPO').css('background-color', '#f0f0f0');
                $('#Ubicacion').css('background-color', '#f0f0f0');
                $('#fechaExp').css('background-color', '#f0f0f0');
                
                // Agregar tooltips informativos
                var mensajeBloqueo = 'Este campo está bloqueado. CantStock debe ser 0 para editarlo (actual: ' + cantStock + ')';
                $('#FPO').attr('title', mensajeBloqueo);
                $('#Ubicacion').attr('title', mensajeBloqueo);
                $('#fechaExp').attr('title', mensajeBloqueo);
                
                // Mostrar notificación informativa
                toastr.options = {
                    positionClass: 'toast-top-right',
                    timeOut: 3000,
                    progressBar: true,
                    extendedTimeOut: 2000
                };
                var mensajePersonalizado = '<img src="../images/deka-1.png" style="width:50%;">';
                toastr.info(mensajePersonalizado,'<p style="font-size: 15px; font-weight: bold; color: #0B0C0C;">Los campos Fecha PO, Ubicación y Fecha Expiración están bloqueados porque necesitan imprimirse todas las etiquetas</p>');
            }
            
            idTabDocs=datos.Id
            window.tableDocs.ajax.url('/tables/tabDocs?id='+datos.Id,).load()
            document.getElementById('idLAVEL').value='Anexos:'+datos.SDS
            $(document).find('form[form-name=form-Detall]').attr('method', 'PUT')
        } );

        $('#Tabledetalle tbody').on('click', 'td.icon.ion-md-print', function () {
            var tr = $(this).closest('tr');
            var row = Itabla.row( tr );
            datos = row.data()
            
            // Mostrar la sección de impresión de etiquetas
            $('#div-print-labels').removeAttr('hidden');
            
            // Scroll hacia la sección de impresión
            setTimeout(function() {
                document.getElementById('div-print-labels').scrollIntoView({ behavior: 'smooth' });
            }, 100);

            // Obtener datos de NUMBERPART del formulario principal
            var numberPart = document.getElementById('NumberPart').value;
            var modelo = document.getElementById('Model').value;
            var descripcion = document.getElementById('Description').value;
            
            // Asignar valores a los campos
            document.getElementById('idDAT-reportes').value = datos.Id
            document.getElementById('idDetalle-reportes').value = datos.Id
            document.getElementById('NPart-reportes').value = numberPart
            document.getElementById('Cript-reportes').value = descripcion
            document.getElementById('MoDel-reportes').value = modelo
            document.getElementById('FeLL-reportes').value = datos.FFIN
            document.getElementById('SDS1-reportes').value = datos.SDS
            document.getElementById('Dnote-reportes').value = datos.NIVEL || ''
            
            // Usar CantStock para mostrar disponible
            var cantStock = parseInt(datos.CantStock) || 0;
            document.getElementById('totCAN-reportes').value = cantStock
            
            // Calcular etiquetas disponibles inicial (se actualizará cuando se ingrese cantidad)
            document.getElementById('NEtf-reportes').value = 0;
            document.getElementById('CantpRI-reportes').value = 0;
            document.getElementById('PrintLabelET-reportes').value = 0;
            
            // Obtener el último consecutivo usado para este registro
            $.ajax({
                type: "GET",
                url: "/get/last/consecutivo/",
                data: {idDetalle: datos.Id},
                dataType: "json",
                success: function(response) {
                    // Guardar el último consecutivo en una variable global o en el campo oculto
                    window.ultimoConsecutivo = response.consecutivo || 0;
                    console.log('Último consecutivo para este registro:', window.ultimoConsecutivo);
                },
                error: function(xhr) {
                    console.error('Error al obtener consecutivo:', xhr);
                    window.ultimoConsecutivo = 0;
                }
            });
            
            getInfoPrintReportes()
        } );
    }

    //--------tabla de documentos
    initTableDocs(0)
    function initTableDocs(id){
        var urlLanguage = '../js/datatables/languaje/Spanish.json'
        window.tableDocs = $('#tab-docs').DataTable( {
            //"paging":   false,
            "ordering": false,
            //"info":     false, 
            "searching":    false, 
            scrollY: true,
            scrollY: '20vh',
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
    // Validar que los campos no estén vacíos
    var numberPart = $('#NumberPart').val().trim();
    var model = $('#Model').val().trim();
    var description = $('#Description').val().trim();
    
    if (numberPart === '' || model === '' || description === '') {
        toastr.options = {
            positionClass: 'toast-top-right',
            timeOut: 2000,
            progressBar: true,
            extendedTimeOut: 1000
        };
        var mensajePersonalizado = '<img src="../images/deka-1.png" style="width:50%;">';
        toastr.warning(mensajePersonalizado,'<p style="font-size: 15px; font-weight: bold; color: #0B0C0C;">¡Todos los campos son obligatorios!</p>');
        return;
    }
    
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
                    // Mantener bloqueados campos FPO, Ubicacion y fechaExp para nuevos detalles
                    $('#FPO').prop('disabled', true);
                    $('#Ubicacion').prop('disabled', true);
                    $('#fechaExp').prop('disabled', true);
                    // Remover estilos de bloqueo visual para que se vean normales pero disabled
                    $('#FPO').css('background-color', '');
                    $('#Ubicacion').css('background-color', '');
                    $('#fechaExp').css('background-color', '');
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
    // Validar que los campos obligatorios no estén vacíos
    var sds = $('#SDS').val().trim();
    var sdc = $('#SDC').val().trim();
    var precio = $('#PRECIO').val().trim();
    var proveedor = $('#PROVEEDOR').val().trim();
    var color = $('#COLOR').val().trim();
    var um = $('#UM').val().trim();
    var cant = $('#Cant').val().trim();
    var ff = $('#FF').val().trim();
    var nivel = $('#Nivel').val().trim();
    
    
    if (sds === '' || sdc === '' || precio === '' || proveedor === '' || color === '' || 
        um === '' || cant === '' || ff === '' || nivel === '') {
        toastr.options = {
            positionClass: 'toast-top-right',
            timeOut: 2000,
            progressBar: true,
            extendedTimeOut: 1000
        };
        var mensajePersonalizado = '<img src="../images/deka-1.png" style="width:50%;">';
        toastr.warning(mensajePersonalizado,'<p style="font-size: 15px; font-weight: bold; color: #0B0C0C;">¡Todos los campos son obligatorios!</p>');
        return;
    }
    
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
                        timeOut: 3000,
                        progressBar: true,
                        extendedTimeOut: 2000
                    };
                    // Creamos un mensaje personalizado con HTML
                    var mensajePersonalizado = '<img src="../images/deka-1.png" style="width:50%;">' 
                    // Mostrar el mensaje de error específico del servidor si existe
                    var errorMsg = response.mensage || '¡Error!';
                    toastr.error(mensajePersonalizado,'<p style="font-size: 15px; font-weight: bold; color: #0B0C0C  ;">' + errorMsg + '</p>' );
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
    $('#div-print-labels').attr("hidden", "true");
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
    // Asegurar que los campos estén bloqueados para nuevo formato
    $('#FPO').prop('disabled', true);
    $('#Ubicacion').prop('disabled', true);
    $('#fechaExp').prop('disabled', true);
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
    $(document).find('#fechaExp').val('');
    $(document).find('#Cant').val('');
    $(document).find('form[form-name=form-Detall]').attr('method', 'POST')
    // Bloquear campos al limpiar formulario (nuevo registro)
    $('#FPO').prop('disabled', true);
    $('#Ubicacion').prop('disabled', true);
    $('#fechaExp').prop('disabled', true);
    // Limpiar estilos de bloqueo visual
    $('#FPO').css('background-color', '');
    $('#Ubicacion').css('background-color', '');
    $('#fechaExp').css('background-color', '');
    $('#FPO').removeAttr('title');
    $('#Ubicacion').removeAttr('title');
    $('#fechaExp').removeAttr('title');
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

//----------- FUNCIONES PARA IMPRESIÓN DE ETIQUETAS EN REPORTES -----------

// Función para mostrar/ocultar configuración de impresora
function settingPrintReportes(){
    var div = document.getElementById("div-print-config");
    if (div.hasAttribute('hidden')){
        div.removeAttribute('hidden');
    }else{
        div.setAttribute('hidden', true);
    }
}

// Función para obtener información de impresión
function getInfoPrintReportes(){
    $.ajax({  
        type: "GET", 
        url: "/get/info/print/", 
        data: {},
        dataType: "text",
        success: function (response) {  
            var response = JSON.parse(response);
            var textarea = document.getElementById("ZPL-reportes");
            textarea.value = response[0].zpl;
            printimageLabelReportes(response[0].zpl)
            document.getElementById('IPPrint-reportes').value = response[0].IP
            document.getElementById('PORT-reportes').value = response[0].port
        },
        error: function (xhr) {
            console.error('Error: ' + xhr.status + ' ' + xhr.statusText)
        },
    });
}

// Función para actualizar configuración de impresora
function UpConfyPrintReportes(){
    var $findTargetRAEdetail = $(document).find('[form-name=form-print-reportes]');
    var dataPost = $findTargetRAEdetail.serialize();
    var Durl = $findTargetRAEdetail.attr('action');
    var method = $findTargetRAEdetail.attr('method')
    var type = "text";
    $.ajax({
        type: method, 
        url: Durl, 
        data: dataPost,
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
                var mensajePersonalizado = '<img src="../images/deka-1.png" style="width:50%;">' 
                toastr.success(mensajePersonalizado,'<p style="font-size: 15px; font-weight: bold; color: #0B0C0C;">¡Configuración actualizada!</p>');
                getInfoPrintReportes()
            } else if (response.status == "error") {
                toastr.options = {
                    positionClass: 'toast-top-right',
                    timeOut: 1000,
                    progressBar: true,
                    extendedTimeOut: 1000
                };
                var mensajePersonalizado = '<img src="../images/deka-1.png" style="width:50%;">' 
                toastr.error(mensajePersonalizado,'<p style="font-size: 15px; font-weight: bold; color: #0B0C0C;">¡Error!</p>');
            }                 
        },
        error: function (xhr) {
            console.error('Error: ' + xhr.status + ' ' + xhr.statusText)
        },
        complete: function () {
        }
    });
}

// Función principal para imprimir etiquetas
function printLabelReportes(){
    var vl1 = document.getElementById('NEtf-reportes').value
    var vl2 = document.getElementById('PrintLabelET-reportes').value
    var cantStock = parseInt(document.getElementById('totCAN-reportes').value) || 0;
    
    if (parseInt(vl2) > parseInt(vl1) || parseInt(vl2) == 0) {
        document.getElementById("PrintLabelET-reportes").value = 0
        toastr.options = {
            positionClass: 'toast-top-right',
            timeOut: 1000,
            progressBar: true,
            extendedTimeOut: 1000
        };
        var mensajePersonalizado = '<img src="../images/deka-1.png" style="width:50%;">' 
        toastr.error(mensajePersonalizado,'<p style="font-size: 15px; font-weight: bold; color: #0B0C0C;">¡Operacion no valida!</p>');
    } else if (cantStock <= 0) {
        toastr.options = {
            positionClass: 'toast-top-right',
            timeOut: 1000,
            progressBar: true,
            extendedTimeOut: 1000
        };
        var mensajePersonalizado = '<img src="../images/deka-1.png" style="width:50%;">' 
        toastr.error(mensajePersonalizado,'<p style="font-size: 15px; font-weight: bold; color: #0B0C0C;">¡No hay stock disponible para imprimir!</p>');
    } else if(parseInt(vl2) <= parseInt(vl1)){
        var zpl = document.getElementById("ZPL-reportes").value
        var ip = document.getElementById("IPPrint-reportes").value
        var port = document.getElementById("PORT-reportes").value
        var cant = document.getElementById("PrintLabelET-reportes").value
        
        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        
        async function runWithDelay() {
            // Obtener el último consecutivo y continuar desde ahí
            var consecutivoInicial = (window.ultimoConsecutivo || 0) + 1;
            
            for (var i = 0; i < cant; i++) {
                var consecutivoActual = consecutivoInicial + i;
                console.log(`Iteración ${i + 1}, Consecutivo: ${consecutivoActual}`);
                
                // Formatear consecutivo con 4 dígitos
                var consecutivoFormateado = consecutivoActual.toString().padStart(4, '0');
                // Actualizar el campo Consecutivo en el formulario
                document.getElementById("Consecutivo-reportes").value = consecutivoFormateado;
                InserLbelPrintReportes(cant, consecutivoActual, zpl, ip, port)
                await delay(2800);
            }
            // Después de terminar todas las impresiones, recargar la tabla
            setTimeout(function() {
                var idForm = document.getElementById("idForm").value;
                if (idForm && window.Itabla) {
                    window.Itabla.ajax.url('/tables/report/detalle/?id=' + idForm).load();
                }
                // Ocultar el div de impresión
                $('#div-print-labels').attr('hidden', true);
            }, 1000);
        }
        runWithDelay();
    }
}

// Función para enviar comandos de impresión
function imprintQRReportes(zpl, ip, port, consecutivo){
    var fecha = new Date();
    const printerAddress = ip;
    const printerPort = port;
    var zplCommand = zpl;
    
    // Obtener datos de los campos
    var nPart = document.getElementById("NPart-reportes").value;
    var desc = document.getElementById("Cript-reportes").value;
    var modelo = document.getElementById("MoDel-reportes").value;
    var cantidad = document.getElementById("CantpRI-reportes").value;
    var dnote = document.getElementById("Dnote-reportes").value;
    
    // Función para dividir texto largo en líneas
    function splitText(text, maxChars) {
        if (!text || text.length <= maxChars) {
            return { line1: text || '', line2: '' };
        }
        
        // Buscar el último espacio antes del límite
        var splitIndex = text.lastIndexOf(' ', maxChars);
        if (splitIndex === -1) {
            splitIndex = maxChars; // Si no hay espacio, cortar en el límite
        }
        
        return {
            line1: text.substring(0, splitIndex).trim(),
            line2: text.substring(splitIndex).trim()
        };
    }
    
    // Dividir descripción si es muy larga (máximo 22 caracteres por línea)
    var descSplit = splitText(desc, 22);
    
    // Dividir Dnote si tiene dos palabras o es largo (máximo 8 caracteres)
    var dnoteSplit = splitText(dnote, 8);
    
    // Formatear fecha como YYMMDD (lote)
    var year = fecha.getFullYear().toString().slice(-2);
    var month = ('0' + (fecha.getMonth() + 1)).slice(-2);
    var day = ('0' + fecha.getDate()).slice(-2);
    var lote = year + month + day;
    
    // Formatear consecutivo con 4 dígitos
    var consec = ('0000' + consecutivo).slice(-4);
    
    // Crear código QR: No.parte,lote,cantidad,consecutivo
    var qrData = nPart + ',' + lote + ',' + cantidad + ',' + consec;
    
    // Reemplazar marcadores en la plantilla ZPL
    zplCommand = zplCommand
        .replace('-PARTNUMBER-', nPart)
        .replace('-DESC-', descSplit.line1)
        .replace('-MODEL-', modelo)
        .replace('-QTY-', cantidad)
        .replace('-DNOTE-', dnoteSplit.line1)
        .replace('>821PART', qrData)
        .replace('BQN,2,10', 'BQN,2,8') // Ajustar tamaño del QR
        .replace('^FT36,46', '^FT36,60') // Mover label No.Part más abajo
        .replace('^FT147,45', '^FT147,60') // Mover valor PARTNUMBER más abajo
        .replace('^FT36,381', '^FT36,406'); // Mover QR más abajo
    
    // Agregar segunda línea de descripción si existe (posición Y + 45 para nueva línea)
    if (descSplit.line2) {
        // Insertar campo adicional para segunda línea de descripción antes de ^PQ
        var descLine2Field = '^FT267,224^A0N,45,46^FH\\^CI28^FD' + descSplit.line2 + '^FS^CI27\r\n';
        zplCommand = zplCommand.replace('^PQ1,0,1,Y', descLine2Field + '^PQ1,0,1,Y');
        
        // Mover hacia abajo los elementos que están debajo de descripción (agregar 50 puntos al eje Y)
        var offset = 50;
        // Mover Modelo (posición original Y=262)
        zplCommand = zplCommand.replace('^FT327,266', '^FT327,' + (266 + offset));
        zplCommand = zplCommand.replace('^FT523,262', '^FT523,' + (262 + offset));
        // Mover Cantidad (posición original Y=379)
        zplCommand = zplCommand.replace('^FT327,379', '^FT327,' + (379 + offset));
        zplCommand = zplCommand.replace('^FT559,378', '^FT559,' + (378 + offset));
        // Mover Dnote (posición original Y=487)
        zplCommand = zplCommand.replace('^FT327,487', '^FT327,' + (487 + offset));
        zplCommand = zplCommand.replace('^FT520,487', '^FT520,' + (487 + offset));
        // Mover QR (posición original Y=545)
        zplCommand = zplCommand.replace('^FT39,545', '^FT39,' + (545 + offset));
    }
    
    // Agregar segunda línea de Dnote si existe
    if (dnoteSplit.line2) {
        // Calcular posición Y para segunda línea de Dnote (depende de si descripción tiene 2 líneas)
        var dnoteY2 = descSplit.line2 ? 582 : 532;
        // Insertar campo adicional para segunda línea de Dnote antes de ^PQ
        var dnoteLine2Field = '^FT520,' + dnoteY2 + '^A0N,49,51^FH\\^CI28^FD' + dnoteSplit.line2 + '^FS^CI27\r\n';
        zplCommand = zplCommand.replace('^PQ1,0,1,Y', dnoteLine2Field + '^PQ1,0,1,Y');
    }
    
    const url = `http://${printerAddress}:${printerPort}`;
    const data = zplCommand;
    
    fetch(url, {
        method: 'POST',
        body: data,
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log('Comandos ZPL enviados con éxito a la impresora.');
    })
    .catch(error => {
        console.error('Error al enviar comandos ZPL a la impresora:', error);
    });
}

// Función para previsualizar etiqueta
function printimageLabelReportes(zpl) {
    // Crear una vista previa con datos de ejemplo
    var fecha = new Date();
    var year = fecha.getFullYear().toString().slice(-2);
    var month = ('0' + (fecha.getMonth() + 1)).slice(-2);
    var day = ('0' + fecha.getDate()).slice(-2);
    var lote = year + month + day;
    
    var nPart = document.getElementById("NPart-reportes").value || 'EJEMPLO';
    var desc = document.getElementById("Cript-reportes").value || 'Descripción';
    var modelo = document.getElementById("MoDel-reportes").value || 'Modelo';
    var cantidad = document.getElementById("CantpRI-reportes").value || '1';
    var dnote = document.getElementById("Dnote-reportes").value || 'DNOTE';
    var consec = '0001';
    
    var qrData = nPart + ',' + lote + ',' + cantidad + ',' + consec;
    
    var zplPreview = zpl
        .replace('-PARTNUMBER-', nPart)
        .replace('-DESC-', desc)
        .replace('-MODEL-', modelo)
        .replace('-QTY-', cantidad)
        .replace('-DNOTE-', dnote)
        .replace('>821PART', qrData)
        .replace('BQN,2,10', 'BQN,2,8') // Ajustar tamaño del QR
        .replace('^FT36,46', '^FT36,60') // Mover label No.Part más abajo
        .replace('^FT147,45', '^FT147,60') // Mover valor PARTNUMBER más abajo
        .replace('^FT36,381', '^FT30,400'); // Mover QR más abajo
    
    const url = 'http://api.labelary.com/v1/printers/8dpmm/labels/4x6/0/';
    const headers = new Headers({
        'Accept': 'image/png',
        'Content-Type': 'application/x-www-form-urlencoded'
    });
    
    fetch(url, {
        method: 'POST',
        headers: headers,
        body: zplPreview
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.blob();
    })
    .then(blob => {
        const url = URL.createObjectURL(blob);
        document.getElementById('label-reportes').src = url;
    })
    .catch(error => console.error('Error:', error));
}

// Función final para insertar registro de impresión
function InserLbelPrintReportes(C, I, zpl, ip, port){
    var $findTargetRAEdetail = $(document).find('[form-name=form-registerPrint-reportes]');
    var dataPost = $findTargetRAEdetail.serialize();
    var method = $findTargetRAEdetail.attr('method')
    var Durl = $findTargetRAEdetail.attr('action');
    var type = "text";
    
    $.ajax({
        type: method, 
        url: Durl, 
        data: dataPost,
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
                var mensajePersonalizado = '<img src="../images/deka-1.png" style="width:50%;">' 
                toastr.success(mensajePersonalizado,'<p style="font-size: 15px; font-weight: bold; color: #0B0C0C;">¡Imprimiendo etiqueta: ' + I + ' DE ' + C + '!</p>');
                imprintQRReportes(zpl, ip, port, I)
            } else if (response.status == "error") {
                toastr.options = {
                    positionClass: 'toast-top-right',
                    timeOut: 1000,
                    progressBar: true,
                    extendedTimeOut: 1000
                };
                var mensajePersonalizado = '<img src="../images/deka-1.png" style="width:50%;">' 
                toastr.error(mensajePersonalizado,'<p style="font-size: 15px; font-weight: bold; color: #0B0C0C;">¡Error!</p>');
            }  
        },
        error: function (xhr) {
            console.error('Error: ' + xhr.status + ' ' + xhr.statusText)
        },
        complete: function () {
        }
    });
}

// Listener para calcular N.Etiquetas disponibles cuando se cambia la cantidad por etiqueta
$(document).on('input change', '#CantpRI-reportes', function() {
    var cantStock = parseInt($('#totCAN-reportes').val()) || 0;
    var cantidadPorEtiqueta = parseInt($('#CantpRI-reportes').val()) || 0;
    
    if (cantidadPorEtiqueta > 0) {
        var etiquetasDisponibles = Math.floor(cantStock / cantidadPorEtiqueta);
        $('#NEtf-reportes').val(etiquetasDisponibles);
    } else {
        $('#NEtf-reportes').val(0);
    }
    
    // Resetear el campo de imprimir etiquetas
    $('#PrintLabelET-reportes').val(0);
});
