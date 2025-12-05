//---bloque que se ejecuta cuando el documento se cargA DE FORMA COMPLETA
$(document).ready(function () {//---valida el idioma para mostrarlo en mis datatble


    //----------inico de menu
    //--control de mi menu lateral no mover--esta oculto
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });
    $.notifyDefaults({
            allow_dismiss: true,
        placement: {
        from: "top",
        align: "right"
        },
        delay: 3000,
        animate: {
        enter: 'animated fadeInDown',
        exit: 'animated fadeOutUp'
        },
        z_index:10001,
    });
    $(document).on("click", function(e){
        var $tar = $(e.target);
        //console.log($tar.attr("class"))
        if ($tar.hasClass("optionMenu")){
            
            e.preventDefault()  
            if ($('#sidebar').hasClass('active')){
                $('#sidebar').toggleClass('active');
                //$(document).find('body').scrollRight(0) ;
            }
            state = 'Nivel1'
            document.querySelector(".lds-ring").removeAttribute("hidden")
            //document.getElementById("sidebarCollapse").removeAttribute('hidden')
            var url = $tar.attr("href")
            $(document).find("li.active").removeClass('active')
            $('#'+ $tar.attr('menu')).addClass("active");
            $(document).find('.content').empty()
            $.ajax({
                type: 'GET', url: url, data : {},
                dataType: 'text',
                success: function (response) { 
                    document.querySelector(".lds-ring").setAttribute("hidden", true) 
                    $(document).find('.content').append(response)  
                },
                error: function (xhr) {
                    $('#errorDisplay').html('Error: ' + xhr.status + ' ' + xhr.statusText);
                },
                complete: function (response) {
                }
            });
        }   
    })
    //----------inico de menu



    //----tablas--model
    //--control de mi menu lateral no mover-esta oculto
    //--tabla de inicio donde se lsitaran las no conformidades
    initTable()
    //--tabla de inicio donde se lsitaran las no conformidades
    function initTable(){
        var urlLanguage = '../js/datatables/languaje/Spanish.json'
        window.table = $('#material').DataTable( {
            scrollY: true,
            scrollY: '40vh',
            language: {
                url: urlLanguage
            },
            ajax: {
                url:'/tables/MOVIMIENTOS/invent/FOR/?tp=0',
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
                    "className": "icon ion-md-mail",
                    'orderable': false,
                    data: null,
                    defaultContent: '',
                    width:'3%'
                },
                
                {
                    "className": "icon ion-md-print",
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

                { data: 'Id'},
                { data: 'Number'},
                { data: 'SDS' },
                {data:'CANTIDAD'},
                {data: 'UBIC'},
                {data: 'PRODT'},
                {data: 'NGT'},
                {data: 'RES'},
                {data: 'FFIN'},
                {data: 'com'},
                {  "className": "",
                    'orderable': false,
                    data: null,
                    defaultContent: '',
                    width:'3%'},
            ],
            rowCallback:function(row,data){
                var colorNG='#FC7777'
                var colorProd='#D4E6F1'
                var colorProd2='#FEF9E7'
                    for (var i=0;i<=14;i++){
                        $($(row).find("td")[7]).css("background-color",colorProd);
                        $($(row).find("td")[9]).css("background-color",colorProd2);
                        $($(row).find("td")[10]).css("background-color",colorNG);
                        $($(row).find("td")[11]).css("background-color",colorProd);
                        $($(row).find("td")[i]).css( "text-align","center");
                        if(i==7 || i==9 || i==10 || i==11 ){
                            $($(row).find("td")[i]).css( "font-weight","  bolder");
                        }
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
                            $($(row).find("td")[8]).text('Almacen recibo P1');

                        }else if(data.UBIC.trim()=='U2'){
                            $($(row).find("td")[8]).text('Almacen recibo P2');
                        
                        }else if(data.UBIC.trim()=='U3'){
                            $($(row).find("td")[8]).text('Almacen recibo P3');

                        }else if(data.UBIC.trim()=='U4'){
                            $($(row).find("td")[8]).text('Proceso planta 1');

                        }else if(data.UBIC.trim()=='U5'){
                            $($(row).find("td")[8]).text('Proceso planta 2');
                            
                        }else if(data.UBIC.trim()=='U6'){
                            $($(row).find("td")[8]).text('Proceso planta 3');

                        }else if(data.UBIC.trim()=='U7'){
                            $($(row).find("td")[8]).text('Carpa verde planta 1');

                        }else if(data.UBIC.trim()=='U8'){
                            $($(row).find("td")[8]).text('Carpa blanca planta 1');

                        }else if(data.UBIC.trim()=='U9'){
                            $($(row).find("td")[8]).text('Inspección recibo planta 1');

                        }else if(data.UBIC.trim()=='U10'){
                            $($(row).find("td")[8]).text('Inspección recibo planta 2');

                        }else if(data.UBIC.trim()=='U11'){
                            $($(row).find("td")[8]).text('Inspección recibo planta 3');
                        }
                    }else{
                    }
                    stat(row,data)
            },
        });
    
        $('#material tbody').on('click', 'td.icon.ion-md-mail', function () {
            var tr = $(this).closest('tr');
            var row = table.row( tr );
            datos = row.data()

            //EVITA QUE ELMODAL SE CIERRE AL PRECIONAR FUERA DE EL
            $('#modal-send-mail').modal({'backdrop':'static'})
            //abre el modal
            $("#modal-send-mail").modal("toggle");

            // Asigna una nueva cadena de texto al h1
            var v1 = document.getElementById("h1");
                v1.textContent = 'No.Parte:'+datos.Number;

            var v2 = document.getElementById("h2");
                v2.textContent = 'Descripción:'+datos.Desc;
          
            var v3 = document.getElementById("h3");
                v3.textContent = 'Modelo:'+datos.Modelo;

            var v3 = document.getElementById("h4");
                v3.textContent = 'Fecha de llegada:'+datos.FFIN;

                var PERIODO = document.getElementById("PERIODO");
                index = 0
                var searchtext =''+ datos.Notfy;
                for (var i = 0; i < PERIODO.options.length; ++i) {
                    if (PERIODO.options[i].value === searchtext) PERIODO.options[i].selected = true;
                }
        
            $(document).find('input[name=idM1]').val(datos.Id)
            $(document).find('input[name=idF1]').val(datos.idRef)

            setTimeout(function(){
                window.tabNTF.ajax.url('/tables/NotFy/correo/?id='+datos.Id).load()
            }, 300)

        } );

        $('#material tbody').on('click', 'td.icon.ion-md-create', function () {
            var tr = $(this).closest('tr');
            var row = table.row( tr );
            datos = row.data()

            //EVITA QUE ELMODAL SE CIERRE AL PRECIONAR FUERA DE EL
            $('#modal-edit-format').modal({'backdrop':'static'})
             //abre el modal
            $("#modal-edit-format").modal("toggle");



            var valder="Almacen recibo P1"

                if(datos.UBIC.trim()=='U1'){
                    valder='Almacen recibo P1';

                }else if(datos.UBIC.trim()=='U2'){
                    valder='Almacen recibo P2';
                
                }else if(datos.UBIC.trim()=='U3'){
                    valder='Almacen recibo P3';

                }else if(datos.UBIC.trim()=='U4'){
                    valder='Proceso planta 1';

                }else if(datos.UBIC.trim()=='U5'){
                    valder='Proceso planta 2';
                    
                }else if(datos.UBIC.trim()=='U6'){
                    valder='Proceso planta 3';

                }else if(datos.UBIC.trim()=='U7'){
                    valder='Carpa verde planta 1';

                }else if(datos.UBIC.trim()=='U8'){
                    valder='Carpa blanca planta 1';

                }else if(datos.UBIC.trim()=='U9'){
                    valder='Inspección recibo P1';

                }else if(datos.UBIC.trim()=='U10'){
                    valder='Inspección recibo P2';

                }else if(datos.UBIC.trim()=='U11'){
                    valder='Inspección recibo P3';
                }

            $(document).find('input[name=PartN]').val(datos.Number)
            $(document).find('input[name=SDS]').val(datos.SDS)
            $(document).find('input[name=CtdO]').val(datos.CtdO)
            $(document).find('input[name=UBI]').val(valder)
            $(document).find('input[name=idM]').val(datos.Id)
            $(document).find('input[name=idF]').val(datos.idRef)
            $(document).find('input[name=SNP]').val(datos.CANTIDAD)
            $(document).find('input[name=PROD]').val(datos.PRODT)
            $(document).find('input[name=NG]').val(datos.NGT)
            $(document).find('input[name=TOT]').val(datos.RES)
            $(document).find('input[name=U1]').val(datos.U1)
            $(document).find('input[name=U2]').val(datos.U2)
            $(document).find('input[name=U3]').val(datos.U3)
            $(document).find('input[name=U4]').val(datos.U4)
            $(document).find('input[name=U5]').val(datos.U5)
            $(document).find('input[name=U6]').val(datos.U6)
            $(document).find('input[name=U7]').val(datos.U7)
            $(document).find('input[name=U8]').val(datos.U8)

            $(document).find('input[name=U9]').val(datos.U9)
            $(document).find('input[name=U10]').val(datos.U10)
            $(document).find('input[name=U11]').val(datos.U11)


            if(datos.RES !=0){
                document.getElementById("TOT").style.backgroundColor = "#D4E6F1";
            }
            if(datos.CtdO !=0){
                document.getElementById("CtdO").style.backgroundColor = "#a9dfbf";
            }
            if(datos.PRODT !=0){
                document.getElementById("PROD").style.backgroundColor = "#FEF9E7";
            }
            if(datos.NGT !=0){
                document.getElementById("NG").style.backgroundColor = "#FC7777 ";
            }
            if(datos.U1 !=0){
                document.getElementById("U1").style.backgroundColor = "#c7e9ee ";
            }
            if(datos.U2 !=0){
                document.getElementById("U2").style.backgroundColor = "#c7e9ee ";
            }
            if(datos.U3 !=0){
                document.getElementById("U3").style.backgroundColor = "#c7e9ee ";
            }
            if(datos.U4 !=0){
                document.getElementById("U4").style.backgroundColor = "#c7e9ee ";
            }
            if(datos.U5 !=0){
                document.getElementById("U5").style.backgroundColor = "#c7e9ee ";
            }
            if(datos.U6 !=0){
                document.getElementById("U6").style.backgroundColor = "#c7e9ee ";
            }
            if(datos.U7 !=0){
                document.getElementById("U7").style.backgroundColor = "#c7e9ee ";
            }
            if(datos.U8 !=0){
                document.getElementById("U8").style.backgroundColor = "#c7e9ee ";
            }
            if(datos.U9 !=0){
                document.getElementById("U9").style.backgroundColor = "#c7e9ee ";
            }
            if(datos.U10 !=0){
                document.getElementById("U10").style.backgroundColor = "#c7e9ee ";
            }
            if(datos.U11 !=0){
                document.getElementById("U11").style.backgroundColor = "#c7e9ee ";
            }



            setTimeout(function(){
                window.tabMOV.ajax.url('/tables/movimientos/reference/?id='+datos.Id).load()
            }, 300) 

            //realiza la busqueda demis documentos anexos a formato y losmuestra en miniatura
            documentos(datos.Id)
            
        } );

        $('#material tbody').on('click', 'td.icon.ion-md-print', function () {
            var tr = $(this).closest('tr');
            var row = table.row( tr );
            datos = row.data()

            //EVITA QUE ELMODAL SE CIERRE AL PRECIONAR FUERA DE EL
            $('#ModalPrint').modal({'backdrop':'static'})
            //abre el modal
            $("#ModalPrint").modal("toggle");

            // Asigna una nueva cadena de texto al h1
            var v1 = document.getElementById("p1");
                v1.textContent = 'No.Parte:'+datos.Number;

            var v2 = document.getElementById("p2");
                v2.textContent = 'Descripción:'+datos.Desc;
            
            var v3 = document.getElementById("p3");
                v3.textContent = 'Modelo:'+datos.Modelo;

            var v4 = document.getElementById("p4");
                v4.textContent = 'Fecha de llegada:'+datos.FFIN;

            var v5 = document.getElementById("p5");
                v5.textContent = 'SDS:'+datos.SDS;

            $(document).find('input[name=idDAT]').val(datos.Id)
            $(document).find('input[name=NPart]').val(datos.Number)
            $(document).find('input[name=Cript]').val(datos.Desc)
            $(document).find('input[name=MoDel]').val(datos.Modelo)
            $(document).find('input[name=FeLL]').val(datos.FFIN)
            $(document).find('input[name=totCAN]').val(datos.RES)
            $(document).find('input[name=SDS1]').val(datos.SDS)

                getInfoPrint()
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
                        messageTop:'Catalogo de Reportes',
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
        }, 1000)  
    }





    function  stat(row,data){

        // Crear un nuevo objeto Date para obtener la fecha y hora actuales
        var fechaActual = new Date();
        // Obtener año, mes y día
        var anio = fechaActual.getFullYear();
        var mes = String(fechaActual.getMonth() + 1).padStart(2, '0'); // Agrega un 0 al principio si el mes es menor a 10
        var dia = String(fechaActual.getDate()).padStart(2, '0');       // Agrega un 0 al principio si el día es menor a 10
        // Formatear la fecha en formato YYYY-MM-DD
        
        var fechaFormateada = anio + "-" + mes + "-" + dia;
        var conDay=""
        var color=""
        
        // Crear dos fechas
        var fecha1 = fechaFormateada;
        var fecha2 =data.FFIN;

        //Fecha 1 es mayor que Fecha 2.
        if (fecha1 > fecha2) {
            conDay="Vencido"
            color="#eaeded "
        
        
        //Fecha 1 es menor que Fecha 2.
        } else if (fecha1 < fecha2) {
            if(data.Notfy>0){
                conDay="LLega en :"+data.Notfy+" Dias"
                color="#ff9e00"
                $($(row).find("td")[14]).css( "font-weight","  bolder");
            }else{
                conDay="Pendiente"
                color="#ff9e00"
            }

        //"Ambas fechas son iguales.
        } else if (fecha1 == fecha2){
            conDay="Hoy llega"
            color="#f4d03f"
        }
        
        //-----Conteo por dias
        $($(row).find("td")[14]).css("background-color",color);
        $($(row).find("td")[14]).text(conDay);

    }

    //--control de mi menu lateral no mover-esta oculto
    //--tabla de inicio donde se lsitaran las no conformidades
    initTableMovimientos(0)
    //--tabla de inicio donde se lsitaran las no conformidades
    function initTableMovimientos(id){
        var urlLanguage = '../js/datatables/languaje/Spanish.json'
        window.tabMOV = $('#Movimientos').DataTable( {
            scrollY: true,
            scrollY: '40vh',
            language: {
                url: urlLanguage
            },
            ajax: {
                url:'/tables/movimientos/reference/?id='+id,
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
                
                { data: 'Id'},
                { data: 'cunt'},
                { data: 'MD' },
                {data:'CANTOT'},
                {data: 'DT'},
                {data: 'date'},
                {data: 'NOTA'},
                
            ],

            rowCallback:function(row,data){
                var color="white"
                var color2="white"

                if(data.MD=="Produccion"){color='#FEF9E7'}
                if(data.MD=="NG"){color='#FC7777'}
                if(data.MD=="RES"){color='#FEF9E7'}
                if(data.MD=="Disponible"){color='#D4E6F1'}
                if(data.DT=="Produccion"){color2='#FEF9E7'}
                if(data.DT=="NG"){color2='#FC7777'}
                if(data.DT=="RES"){color2='#FEF9E7'}
                if(data.DT=="Disponible"){color2='#D4E6F1'}
 
            for (var i=0;i<=14;i++){
                $($(row).find("td")[i]).css( "text-align","center");
                $($(row).find("td")[i]).css( "font-size","90%");
                $($(row).find("td")[2]).css("background-color",color);
                $($(row).find("td")[3]).css("background-color",color);
                $($(row).find("td")[4]).css("background-color",color2);
                $($(row).find("td")[5]).css("background-color",color2);
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




              if(data.MD!=null){
                if(data.MD.trim()=='U1'){
                    $($(row).find("td")[3]).text('Almacen recibo P1');

                }else if(data.MD.trim()=='U2'){
                    $($(row).find("td")[3]).text('Almacen recibo P2');
                
                }else if(data.MD.trim()=='U3'){
                    $($(row).find("td")[3]).text('Almacen recibo P3');

                }else if(data.MD.trim()=='U4'){
                    $($(row).find("td")[3]).text('Proceso planta 1');

                }else if(data.MD.trim()=='U5'){
                    $($(row).find("td")[3]).text('Proceso planta 2');
                    
                }else if(data.MD.trim()=='U6'){
                    $($(row).find("td")[3]).text('Proceso planta 3');

                }else if(data.MD.trim()=='U7'){
                    $($(row).find("td")[3]).text('Carpa verde planta 1');

                }else if(data.MD.trim()=='U8'){
                    $($(row).find("td")[3]).text('Carpa blanca planta 1');

                }else if(data.MD.trim()=='U9'){
                    $($(row).find("td")[3]).text('Inspección recibo planta 1');

                }else if(data.MD.trim()=='U10'){
                    $($(row).find("td")[3]).text('Inspección recibo planta 2');

                }else if(data.MD.trim()=='U11'){
                    $($(row).find("td")[3]).text('Inspección recibo planta 3');
                }
            }else{
            }
            


            if(data.DT!=null){
                if(data.DT.trim()=='U1'){
                    $($(row).find("td")[5]).text('Almacen recibo P1');

                }else if(data.DT.trim()=='U2'){
                    $($(row).find("td")[5]).text('Almacen recibo P2');
                
                }else if(data.DT.trim()=='U3'){
                    $($(row).find("td")[5]).text('Almacen recibo P3');

                }else if(data.DT.trim()=='U4'){
                    $($(row).find("td")[5]).text('Proceso planta 1');

                }else if(data.DT.trim()=='U5'){
                    $($(row).find("td")[5]).text('Proceso planta 2');
                    
                }else if(data.DT.trim()=='U6'){
                    $($(row).find("td")[5]).text('Proceso planta 3');

                }else if(data.DT.trim()=='U7'){
                    $($(row).find("td")[5]).text('Carpa verde planta 1');

                }else if(data.DT.trim()=='U8'){
                    $($(row).find("td")[5]).text('Carpa blanca planta 1');

                }else if(data.DT.trim()=='U9'){
                    $($(row).find("td")[5]).text('Inspección recibo planta 1');

                }else if(data.DT.trim()=='U10'){
                    $($(row).find("td")[5]).text('Inspección recibo planta 2');

                }else if(data.DT.trim()=='U11'){
                    $($(row).find("td")[5]).text('Inspección recibo planta 3');
                }
            }else{
            }

        },
        });
    }
    //--tabla de correos
    initTabNotFy(0)
    //--tabla de inicio donde se lsitaran las no conformidades
    function initTabNotFy(id){
        var urlLanguage = '../js/datatables/languaje/Spanish.json'
        window.tabNTF = $('#tabNFy').DataTable( {
            "paging":   false,
            //"ordering": false,
            "info":     false, 
            "searching":    false, 
            scrollY: true,
            scrollY: '40vh',
            language: {
                url: urlLanguage
            },
            ajax: {
                url:'/tables/NotFy/correo/?id='+id,
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
                    "className": "icon ion-md-trash",
                    'orderable': false,
                    data: null,
                    defaultContent: '',
                    width:'3%'
                },
                { data: 'mail'},
                
            ],

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

        },
    });

        $('#tabNFy tbody').on('click', 'td.icon.ion-md-trash', function () {

            var tr = $(this).closest('tr');
            var row = tabNTF.row( tr );
            datos = row.data()
            usuario = false
            var opcion = confirm("¿ELIMINAR DOCUMENTO?");
            if( opcion==true){
            $.ajax({
                type: 'POST', url: '/data/eliminar/NotItY', data : {id:datos.Id},
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
                            id=document.getElementById("idM1").value
                            window.tabNTF.ajax.url('/tables/NotFy/correo/?id='+id).load()
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
    }
    //realiza la busqueda demis documentos anexos a formato y losmuestra en miniatura
    function documentos(id){
        var contenidoModal = $('#contDoc1');
        // Limpia cualquier contenido existente en el elemento contenedor
        contenidoModal.empty();
        // Agrega el nuevo contenido al elemento contenedor
        contenidoModal.append('');
        var type = "text";  
        $.ajax(
            {  
            type: "GET", url: "/respuesta/documentos/miniatura", data: {id:id} ,
            dataType: type,
            success: function (response) {  
                $(document).find('#contDoc1').append(response);
            // alert(response)
            },
            error: function (xhr) {
                $('#resError').removeClass('hide')
                $('#resError').append('Error: ' + xhr.status + ' ' + xhr.statusText)
            },
        }); 
    }
    //----tablas--model
});


//----------------Bloque de usuario
    //actualizacion de contraceña del usuario
    $(document).find('#btn-actuliza-contracena-select').on('click', function (){
        $('#section-btn-atualizar-contracena').removeAttr('hidden');
    });
    //enlace para visualizar documentacion de capacitacion
    $(document).find('#ayuda').on('click', function (){

        var myWindow = window.open("http://npms16.nipsa.com.mx:93/files/manuales/TEST.pdf", "", "width=1100,height=700");
          // window.open("http://npms16.nipsa.com.mx:90/files/manuales/MDGI-1.pdf","ventana1","width=50000,height=00");
      
    });
    //actualizacion de mi contraceña
    $(document).find('#btn-actuliza-contracena').on('click', function (){
        var newPass=document.getElementById('input-actuliza-contracena').value
        if(newPass.length<8){
            $.notify({
                icon: 'icon ion-md-close-circle',
                message:'Longitud mínima de la contraseña 6 caracteres'
            },{type: 'info'});
        }else{
            $.ajax({
                type: 'PUT', url:'/actualizar/PASSWORD/VALIDAR/USUARIO', data :{newPass:newPass},
                dataType: 'text',
            success: function (response) {
                var response = JSON.parse(response);
                if (response.status == 'ok'){
                    $.notify({
                        icon: 'icon ion-md-done-all',
                        message:response.mensage
                    },{type: 'success'});
                    location.reload()
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
//----------------Bloque de usuario


//---------------Acceso a edit
    //detecta el clik sobremi pdf y lo habre en una pestaña nueva
    $(document).on("click", function(e){
        var $tar = $(e.target);
        if ($tar.hasClass("openPDF")){
            console.log($tar.attr("href"))
            document.getElementById("pdfFile").src=$tar.attr("href")
            $("#pdfModal").modal("toggle")
        }
    });
    // Obtener el elemento select y ejecutar accion
    var selectElement = document.getElementById('MD');
    selectElement.addEventListener('change', function() {

    var selectedValue = selectElement.value;
    if(selectedValue=="Disponible"){selectedValue="TOT"}
    if(selectedValue=="Produccion"){selectedValue="PROD"}
    if(selectedValue=="Procesado"){selectedValue="CtdO"}
    document.getElementById('cunt').value=document.getElementById(selectedValue).value
        
    });
    // Obtener el elemento select y ejecutar accion
    (input = document.querySelector('#CANTOT')).addEventListener('change', function () {
        vl1=document.getElementById('cunt').value
        vl2=document.getElementById('CANTOT').value
        // Comparamos los valores
        if (parseInt(vl2) > parseInt(vl1)) {
            document.getElementById("CANTOT").value=0
            toastr.options = {
            positionClass: 'toast-top-right',
            timeOut: 1000,
            progressBar: true,
            extendedTimeOut: 1000
        };
        // Creamos un mensaje personalizado con HTML
        var mensajePersonalizado = '<img src="../images/deka-1.png" style="width:50%;">' 
        toastr.error(mensajePersonalizado,'<p style="font-size: 15px; font-weight: bold; color: #0B0C0C  ;">¡Operacion no valida!</p>' );
        } 
    });
    //--realiza rel movimiento de las cantidades
    function Event(){
        var $findTargetRAEdetail = $(document).find('[form-name=form-event32]');
        var dataPost = $findTargetRAEdetail.serialize();
        var Durl = $findTargetRAEdetail.attr('action');
        var method = $findTargetRAEdetail.attr('method')
        var type = "text";
        var valdmd=document.getElementById("MD").value
        var valddt=document.getElementById("DT").value
        var cunt=document.getElementById("cunt").value
        var vl1=document.getElementById("MD").value
        var vl2=document.getElementById("DT").value
        //alert(dataPost)

        if (valdmd.length==0 || valddt.length==0 || cunt==0 || vl1==vl2) {
                toastr.options = {
                    positionClass: 'toast-top-right',
                    timeOut: 1000,
                    progressBar: true,
                    extendedTimeOut: 1000
                };
                // Creamos un mensaje personalizado con HTML
                var mensajePersonalizado = '<img src="../images/deka-1.png" style="width:50%;">' 
                toastr.error(mensajePersonalizado,'<p style="font-size: 15px; font-weight: bold; color: #0B0C0C  ;">¡Operacion no valida!</p>' );
        }else{
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
                        var Id=document.getElementById("idM").value
                        //actualiza tablle
                        window.tabMOV.ajax.url('/tables/movimientos/reference/?id='+Id).load()

                        //Tabla Inicio
                        window.table.ajax.url('/tables/MOVIMIENTOS/invent/FOR/?tp=0').load()
                        //---actualizacion de cantidades
                        refresVlues( Id)

                        $(document).find('input[name=cunt]').val(" ")
                        var profile = document.getElementById("MD");
                        profile.options[0].selected = true;
                        $(document).find('input[name=CANTOT]').val(" ")
                        var profile2 = document.getElementById("DT");
                        profile2.options[0].selected = true;
                        document.getElementById('NOTA').value='';

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
    }
    //---actualizacion de cantidades
    function refresVlues(Id){
        $.ajax(
            {  
            type: "GET", url: "/refres/val/data", data: {id:Id} ,
            dataType: "text",
            success: function (response) {  
            var response = JSON.parse(response);
            $(document).find('input[name=PROD]').val(response[0].PRODT)
            $(document).find('input[name=NG]').val(response[0].NGT)
            $(document).find('input[name=TOT]').val(response[0].RES)
            $(document).find('input[name=CtdO]').val(response[0].CtdO)
            $(document).find('input[name=U1]').val(response[0].U1)
            $(document).find('input[name=U2]').val(response[0].U2)
            $(document).find('input[name=U3]').val(response[0].U3)
            $(document).find('input[name=U4]').val(response[0].U4)
            $(document).find('input[name=U5]').val(response[0].U5)
            $(document).find('input[name=U6]').val(response[0].U6)
            $(document).find('input[name=U7]').val(response[0].U7)
            $(document).find('input[name=U8]').val(response[0].U8)
            },
            error: function (xhr) {
                $('#resError').removeClass('hide')
                $('#resError').append('Error: ' + xhr.status + ' ' + xhr.statusText)
            },
        });

    }
//---------------Acceso a edit


//---------------Acceso a notfy
    //----edita el periodo de tiempo para envia el correo
    function FPeriodo(){
        var $findTargetRAEdetail = $(document).find('[form-name=form-notify]');
        var dataPost = $findTargetRAEdetail.serialize();
        var Durl = $findTargetRAEdetail.attr('action');
        var type = "text";

            $.ajax({
                type: "put", url: Durl, data : dataPost,
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
    //---anexa los correos a notificar
    function MNotfy(){
        var $findTargetRAEdetail = $(document).find('[form-name=form-notify]');
        var dataPost = $findTargetRAEdetail.serialize();
        var method = $findTargetRAEdetail.attr('method')
        var Durl = $findTargetRAEdetail.attr('action');
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
                        window.tabNTF.ajax.url('/tables/NotFy/correo/?id='+response.idD).load()
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
//---------------Acceso a notfy


//---------------Acceso a print
    //---CONFIGURACION DE IMPRESORA
    // CHANGE PRINT
    (input = document.querySelector('#CantpRI')).addEventListener('change', function () {
        var cantidad=document.getElementById("totCAN").value
        var NEtiqu=document.getElementById("CantpRI").value
        parseInt(cantidad)
        parseInt(NEtiqu)
        var tot=parseInt(cantidad / NEtiqu)
        document.getElementById("NEtf").value=tot
    });
    //-----configuracion de impresora
    function UpConfyPrint(){
        var $findTargetRAEdetail = $(document).find('[form-name=form-print]');
        var dataPost = $findTargetRAEdetail.serialize();
        var method = $findTargetRAEdetail.attr('method')
        var Durl = $findTargetRAEdetail.attr('action');
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
    //---seting print div
    function settingPrint(){
        var div = $('#div-print');
        if (div.attr('hidden')) {
          div.removeAttr('hidden');
          getInfoPrint()
        } else {
          div.attr('hidden', true);
        }
    }
    //get infor print
    function getInfoPrint(){
        $.ajax(
            {  
            type: "GET", url: "/get/info/print/", data: {} ,
            dataType: "text",
            success: function (response) {  
            var response = JSON.parse(response);
            var textarea = document.getElementById("ZPL");
            textarea.value = response[0].zpl;
            printimageLabel(response[0].zpl)
            $(document).find('input[name=IPPrint]').val(response[0].IP)
            $(document).find('input[name=PORT]').val(response[0].port)
            },
            error: function (xhr) {
                $('#resError').removeClass('hide')
                $('#resError').append('Error: ' + xhr.status + ' ' + xhr.statusText)
            },
        });
    }
    //optiene valores de mi print
    function printLabel(){
        //N.Etiquetas disponibles
        vl1=document.getElementById('NEtf').value
        //Imprimir Etiquetas
        vl2=document.getElementById('PrintLabelET').value
        //se ejecuta cuando la cantidad de etiquetas a imprimir son menores  o son 0 las disponibles
        if (parseInt(vl2) > parseInt(vl1)  || parseInt(vl2) == 0  ) {
            //if (parseInt(vl2) >= parseInt(vl1)  ) {
            //<= (menor o igual que)
            document.getElementById("PrintLabelET").value=0
            toastr.options = {
            positionClass: 'toast-top-right',
            timeOut: 1000,
            progressBar: true,
            extendedTimeOut: 1000
        };
        // Creamos un mensaje personalizado con HTML
        var mensajePersonalizado = '<img src="../images/deka-1.png" style="width:50%;">' 
        toastr.error(mensajePersonalizado,'<p style="font-size: 15px; font-weight: bold; color: #0B0C0C  ;">¡Operacion no valida!</p>' );
        //se ejecuta cuando
        }else if(parseInt(vl2) <= parseInt(vl1)){
        var zpl=document.getElementById("ZPL").value
        var ip=document.getElementById("IPPrint").value
        var port=document.getElementById("PORT").value
        var cant=document.getElementById("PrintLabelET").value
       // for(var i=1;i<=cant;i++){
            //imprintQR(zpl,ip,port)
           // InserLbelPrint()
           // }
            function delay(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }
            async function runWithDelay() {
                for (var i=1;i<=cant;i++) {
                    console.log(`Iteración ${i}`);
                    InserLbelPrint(cant,i,zpl,ip,port)
                    await delay(2800); // Pausa de 2000 milisegundos (2 segundos)
                }
            }
            runWithDelay();
        }
    }
    
    //PrintLabelET(ajuste datas reference print label )
    function imprintQR(zpl,ip,port){
        var fecha = new Date();
    /* const printerAddress = '131.107.20.107';  // Reemplaza con la dirección IP de tu impresora
            const printerPort = 9100;  // Puerto por defecto para impresoras Zebra
            var zplCommand = 'CT~~CD,~CC^~CT~^XA~TA000~JSN^LT0^MNW^MTT^PON^PMN^LH0,0^JMA^PR6,6~SD28^JUS^LRN^CI0^XZ^XA^MMT^PW360^LL0200^LS0^FT168,165^BQN,2,3^FH\^FDLA,-DATO1-^FS^FT148,76^A0I,17,16^FH\^FD-DATO3-^FS^FT148,131^A0I,17,16^FH\^FD-DATO4-^FS^FT148,103^A0I,17,16^FH\^FD-DATO2-^FS^PQ1,0,1,Y^XZ'
    */
            const printerAddress = ip;  // Reemplaza con la dirección IP de tu impresora
            const printerPort = port;  // Puerto por defecto para impresoras Zebra
            var zplCommand = zpl;
            zplCommand = zplCommand
                .replace('<NP>',"No.Parte:"+document.getElementById("NPart").value )
                .replace('<DC>',"Descripcion:"+document.getElementById("Cript").value)
                .replace('<CT>',"Cantidad:"+document.getElementById("CantpRI").value)
                .replace('<LT>', "Lote:")
                .replace('<NC>',"Fecha:"+fecha.toJSON().slice(0,10))
                .replace('<ML>',"Modelo:"+document.getElementById("MoDel").value)
                //.replace('<SS>',"004303404")
                .replace('<QR>', document.getElementById("idDAT").value
                           // "<>"+document.getElementById("NPart").value+
                            //"<>"+document.getElementById("NPart").value
                        )
                ;  // Comando ZPL de ejemplo
                const url = `http://${printerAddress}:${printerPort}`;
                const data = `^XA${zplCommand}^XZ`;
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
    //----previsualizacion de klabel
    function printimageLabel(zpl) {
        const zplCode = zpl; // Si quieres usar el zpl pasado como argumento
        const url = 'http://api.labelary.com/v1/printers/8dpmm/labels/4x6/0/';
        const headers = new Headers({
            'Accept': 'image/png',  // Para obtener la respuesta en formato PNG
            'Content-Type': 'application/x-www-form-urlencoded'
        });
        fetch(url, {
            method: 'POST',
            headers: headers,
            body: zplCode
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.blob();
            })
            .then(blob => {
                const url = URL.createObjectURL(blob);
                document.getElementById('label').src = url;
            })
            .catch(error => console.error('Error:', error));
    }
    //PRINT LABEL FINAL
    function InserLbelPrint(C,I,zpl,ip,port){
        var $findTargetRAEdetail = $(document).find('[form-name=form-registerPrint]');
        var dataPost = $findTargetRAEdetail.serialize();
        var method = $findTargetRAEdetail.attr('method')
        var Durl = $findTargetRAEdetail.attr('action');
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
                        toastr.success(mensajePersonalizado,'<p style="font-size: 15px; font-weight: bold; color: #0B0C0C  ;">¡Imprimiendo etiqueta: ' +I+ ' DE '+ C+' !</p>' );
                        imprintQR(zpl,ip,port)
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
//---------------Acceso a print

document.getElementById("Tabla").value="SELECT   NUMBERPART.*, DETALLE.* FROM   NUMBERPART INNER JOIN DETALLE ON NUMBERPART.Id = DETALLE.idRef ";

function searchRegister(){
   var Query=document.getElementById("Tabla").value
   var Wherd=" where  NUMBERPART.Fecha"
   var Betwn=" BETWEEN '"+document.getElementById("DTIni").value+"' and '"+document.getElementById("DTf").value+"'"
   var ORd=" order by DETALLE.Id desc"
   var vard= Query+Wherd+Betwn+ORd
    window.table.ajax.url('/tables/MOVIMIENTOS/invent/FOR/?tp=1&vard='+vard).load()
}

// Crear una nueva instancia del objeto Date
let fechaActual = new Date();
// Obtener las horas, minutos y segundos actuales
let horas = fechaActual.getHours();
if(horas==11){
    // Configura el intervalo para ejecutar la función cada 1000 milisegundos (1 segundo)
    let intervalId = setInterval(GetREGnOTFy, 18000);
    function GetREGnOTFy(){
       //alert(123)
       $.ajax(
           {  
           type: "put", url: "/dat/get/notFy/Get/", data: {} ,
           dataType: "text",
           success: function (response) {  
           },
           error: function (xhr) {
               $('#resError').removeClass('hide')
               $('#resError').append('Error: ' + xhr.status + ' ' + xhr.statusText)
           },
       });
    }
}

// check nboxo desactivar
const switchButton1 = document.getElementById('switch-label');
// Agrega un event listener para detectar cambios
switchButton1.addEventListener('change', function() {
  // Verifica el estado actual del checkbox
  if (this.checked) {
    //alert('El checkbox está en verde');
    $('#ControlTrasfer').removeAttr('hidden');
    $('#pirncipal-deft-grast').attr("hidden", "true")

    document.getElementById("qrCode").focus({preventScroll:true});
  } else {
    //alert('El checkbox está en azul');
    $('#ControlTrasfer').attr("hidden", "true")
    $('#pirncipal-deft-grast').removeAttr('hidden');
  }
});

// Obtén el campo de entrada por su ID
var input = document.getElementById("qrCode");
// Agrega un evento de teclado al campo de entrada
input.addEventListener("keypress", function(event) {
// Verifica si la tecla presionada es "Enter" (código 13)
    if (event.keyCode === 13) {
        GetControleDella(document.getElementById("qrCode").value)

        var div = document.getElementById("panelEstatus");
        div.style.borderColor = "#ef9100 ";
    }
});

//------asignacion de datos en el form para enviar datos
function GetControleDella(id){
    $.ajax({
        type: 'GET', url: '/Get/date/val/Detall/', data : {id:id},
        dataType: 'text',
        success: function (response) {
            var response = JSON.parse(response);
            if(response.status=='ok'){
            //console.log(response[0])
            // Asigna una nueva cadena de texto al h1
            var VDP1 = document.getElementById("VDP1");
            VDP1.textContent = 'No.Parte:'+response.users[0].Number;
            // Asigna una nueva cadena de texto al h1
            var VDP2 = document.getElementById("VDP2");
            VDP2.textContent = 'Orden de Compra:'+response.users[0].SDS;
            // Asigna una nueva cadena de texto al h1
            var VDP3 = document.getElementById("VDP3");
            VDP3.textContent = 'Modelo:'+response.users[0].Modelo;
            document.getElementById("idRefFF").value=response.users[0].idRef
            document.getElementById("IId").value=response.users[0].Id
            document.getElementById("Disponible1").value=response.users[0].RES
            document.getElementById("Procesado1").value=response.users[0].CtdO
            document.getElementById("Produccion1").value=response.users[0].PRODT
            document.getElementById("NG1").value=response.users[0].NGT
            document.getElementById("UBI11").value=response.users[0].U1
            document.getElementById("UBI21").value=response.users[0].U2
            document.getElementById("UBI31").value=response.users[0].U3
            document.getElementById("UBI41").value=response.users[0].U4
            document.getElementById("UBI51").value=response.users[0].U5
            document.getElementById("UBI61").value=response.users[0].U6
            document.getElementById("UBI71").value=response.users[0].U7
            document.getElementById("UBI81").value=response.users[0].U8
            document.getElementById("UBI91").value=response.users[0].U9
            document.getElementById("UBI101").value=response.users[0].U10
            document.getElementById("UBI111").value=response.users[0].U11
            document.getElementById("qrCode").value=""
            document.getElementById("ProcessScannDef").removeAttribute('hidden')
            //ProcessScannDef
            var div = document.getElementById("panelEstatus");
            div.style.borderColor = "#1ca609 ";
            }else{
            toastr.options = {
                positionClass: 'toast-top-right',
                timeOut: 2000,
                progressBar: true,
                extendedTimeOut: 2000
            };
            // Creamos un mensaje personalizado con HTML
            var mensajePersonalizado = '<img src="../images/deka-1.png" style="width:50%;">' 
            toastr.error(mensajePersonalizado,'<p style="font-size: 15px; font-weight: bold; color: #0B0C0C  ;">¡Registro no encontrado!</p>' );
            $('#ProcessScannDef').attr('hidden','hidden');
            //ProcessScannDef
            //ProcessScannDef
            var div = document.getElementById("panelEstatus");
            div.style.borderColor = "black ";
            }
            
//---pendiente por ejecutar-----validar si existe registro sino hay que ocultarlo
        },
        error: function (xhr) {
            $('#resError').removeClass('hide')
            $('#resError').append('Error: ' + xhr.status + ' ' + xhr.statusText)

            var div = document.getElementById("panelEstatus");
            div.style.borderColor = "red ";
        },
        complete: function () {
        }
    });

}

 // Obtener el elemento select y ejecutar accion
 var selectElementDREMmD = document.getElementById('DREMmD');
 selectElementDREMmD.addEventListener('change', function() {
 var selectedValueDREMmD = selectElementDREMmD.value;
 if(selectedValueDREMmD=="Disponible"){selectedValue="Disponible1"}
 if(selectedValueDREMmD=="Produccion"){selectedValue="Produccion1"}
 if(selectedValueDREMmD=="Procesado"){selectedValue="Procesado1"}
 if(selectedValueDREMmD=="NG"){selectedValue="NG1"}

 if(selectedValueDREMmD=="U1"){selectedValue="UBI11"}
 if(selectedValueDREMmD=="U2"){selectedValue="UBI21"}
 if(selectedValueDREMmD=="U3"){selectedValue="UBI31"}
 if(selectedValueDREMmD=="U4"){selectedValue="UBI41"}
 if(selectedValueDREMmD=="U5"){selectedValue="UBI51"}
 if(selectedValueDREMmD=="U6"){selectedValue="UBI61"}
 if(selectedValueDREMmD=="U7"){selectedValue="UBI71"}
 if(selectedValueDREMmD=="U8"){selectedValue="UBI81"}

 if(selectedValueDREMmD=="U9"){selectedValue="UBI91"}
 if(selectedValueDREMmD=="U10"){selectedValue="UBI101"}
 if(selectedValueDREMmD=="U11"){selectedValue="UBI111"}



 document.getElementById('Dispcunt').value=document.getElementById(selectedValue).value
 });

// Obtener el elemento select y ejecutar accion
(input = document.querySelector('#CRANTdt')).addEventListener('change', function () {
    vl1=document.getElementById('Dispcunt').value
    vl2=document.getElementById('CRANTdt').value
    // Comparamos los valores
    if (parseInt(vl2) > parseInt(vl1)) {
        document.getElementById("CRANTdt").value=0
        toastr.options = {
        positionClass: 'toast-top-right',
        timeOut: 1000,
        progressBar: true,
        extendedTimeOut: 1000
    };
    // Creamos un mensaje personalizado con HTML
    var mensajePersonalizado = '<img src="../images/deka-1.png" style="width:50%;">' 
    toastr.error(mensajePersonalizado,'<p style="font-size: 15px; font-weight: bold; color: #0B0C0C  ;">¡Operacion no valida!</p>' );
    } 
});

/*
//--realiza rel movimiento de las cantidades
function Event(){
    var $findTargetRAEdetail = $(document).find('[form-name=form-event32]');
    var dataPost = $findTargetRAEdetail.serialize();
    var Durl = $findTargetRAEdetail.attr('action');
    var method = $findTargetRAEdetail.attr('method')
    var type = "text";
    var valdmd=document.getElementById("MD").value
    var valddt=document.getElementById("DT").value
    var cunt=document.getElementById("cunt").value
    var vl1=document.getElementById("MD").value
    var vl2=document.getElementById("DT").value
    //alert(dataPost)


    
    if (valdmd.length==0 || valddt.length==0 || cunt==0 || vl1==vl2) {
            toastr.options = {
                positionClass: 'toast-top-right',
                timeOut: 1000,
                progressBar: true,
                extendedTimeOut: 1000
            };
            // Creamos un mensaje personalizado con HTML
            var mensajePersonalizado = '<img src="../images/deka-1.png" style="width:50%;">' 
            toastr.error(mensajePersonalizado,'<p style="font-size: 15px; font-weight: bold; color: #0B0C0C  ;">¡Operacion no valida!</p>' );
    }else{



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
                    var Id=document.getElementById("idM").value
                    //actualiza tablle
                    window.tabMOV.ajax.url('/tables/movimientos/reference/?id='+Id).load()

                    //Tabla Inicio
                    window.table.ajax.url('/tables/MOVIMIENTOS/invent/FOR/?tp=0').load()
                    //---actualizacion de cantidades
                    refresVlues( Id)

                    $(document).find('input[name=cunt]').val(" ")
                    var profile = document.getElementById("MD");
                    profile.options[0].selected = true;
                    $(document).find('input[name=CANTOT]').val(" ")
                    var profile2 = document.getElementById("DT");
                    profile2.options[0].selected = true;
                    document.getElementById('NOTA').value='';

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

}
*/

function enntScann(){
    var $findTarget = $(document).find('[form-name=form-Scan]');
    var dataPost = $findTarget.serialize();
    var Durl = $findTarget.attr('action');
    var method = $findTarget.attr('method')
    var type = "text";
    var valdmd=document.getElementById("DREMmD").value
    var valddt=document.getElementById("DDTT").value
    var cunt=document.getElementById("Dispcunt").value
    var vl1=document.getElementById("DREMmD").value
    var vl2=document.getElementById("DDTT").value

    if (valdmd.length==0 || valddt.length==0 || cunt==0 || vl1==vl2) {
        toastr.options = {
            positionClass: 'toast-top-right',
            timeOut: 1000,
            progressBar: true,
            extendedTimeOut: 1000
        };
        // Creamos un mensaje personalizado con HTML
        var mensajePersonalizado = '<img src="../images/deka-1.png" style="width:50%;">' 
        toastr.error(mensajePersonalizado,'<p style="font-size: 15px; font-weight: bold; color: #0B0C0C  ;">¡Operacion no valida!</p>' );
        }else{

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

                        $(document).find('input[name=cunt]').val("")
                        var profile = document.getElementById("DREMmD");
                        profile.options[0].selected = true;
                        $(document).find('input[name=CANTOT]').val("")
                        var profile2 = document.getElementById("DDTT");
                        profile2.options[0].selected = true;
                        document.getElementById('NOTANew').value='';
                        $(document).find('input[name=Produccion1]').val("")
                        $(document).find('input[name=NG1]').val("")
                        $(document).find('input[name=Disponible1]').val("")
                        $(document).find('input[name=Procesado1]').val("")
                        $(document).find('input[name=UBI11]').val("")
                        $(document).find('input[name=UBI21]').val("")
                        $(document).find('input[name=UBI31]').val("")
                        $(document).find('input[name=UBI41]').val("")
                        $(document).find('input[name=UBI51]').val("")
                        $(document).find('input[name=UBI61]').val("")
                        $(document).find('input[name=UBI71]').val("")
                        $(document).find('input[name=UBI81]').val("")
                        $(document).find('input[name=UBI91]').val("")
                        $(document).find('input[name=UBI101]').val("")
                        $(document).find('input[name=UBI111]').val("")
                        $(document).find('input[name=Dispcunt]').val(0)
                        $(document).find('input[name=CRANTdt]').val(0)
                        $(document).find('input[name=idRefFF]').val("")
                        $(document).find('input[name=IId]').val("")
                        $(document).find('input[name=qrCode]').val("")

                        $('#ProcessScannDef').attr('hidden','hidden');

                        var div = document.getElementById("panelEstatus");
            div.style.borderColor = "black";

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
`;


document.getElementById('DocumenDis1').title=`
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
`;