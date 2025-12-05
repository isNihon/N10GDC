$(document).ready(function () {
    //--tabla de etiquetas
    tableLabels()
    function tableLabels(){
    var urlLanguage = '../js/datatables/languaje/Spanish.json'
    window.tablabel= $('#table-labels').DataTable( {

        scrollY: '40vh',
        scrollX: true,
        responsive: false,
        autoWidth: false,

        language: {
        url: urlLanguage
        },
        ajax: {
            url:'/tables/label/history/?tp=0',
            dataSrc: ''
        },

        columns: [

        {
            "className": "",
            'orderable': false,
            data: null,
            defaultContent: '',
            width:'30px'
        },
    
        { data: 'Id', width: '50px' },
        { data: 'idDetalle', width: '60px' },
        { data: 'Part', width: '120px' },
        { data: 'Desc', width: '150px' },
        { data: 'Modelo', width: '80px' },
        { data: 'Cant', width: '60px' },
        { data: 'Dnote', width: '80px' },
        { data: 'lote', width: '70px' },
        { data: 'Consc', width: '80px' },
        { data: 'status', width: '70px' },
        { data: 'Fecha', width: '130px' },
        { data: 'User', width: '70px' },
        ] ,
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


        setTimeout(function(){
            var table = $('#table-labels').DataTable();
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
            table.buttons().container().appendTo( $('#table-labels_filter', table.table().container() ) );
      
           
        }, 100) 

    };
    //--tabla de emovimientos
    tableMovs()
    function tableMovs(){
    var urlLanguage = '../js/datatables/languaje/Spanish.json'
    window.tabMov= $('#Table-Mov').DataTable( {

        scrollY: '40vh',
        scrollX: true,
        responsive: false,
        autoWidth: false,

        language: {
        url: urlLanguage
        },
        ajax: {
            url:'/tables/movimient/history/?tp=0',
            dataSrc: ''
        },

        columns: [

        {
            "className": "",
            'orderable': false,
            data: null,
            defaultContent: '',
            width:'30px'
        },
    
        { data: 'Id', width: '50px'},
        { data: 'idDetalle', width: '60px'},
        { data: 'NumPart', width: '120px'},
        {data:'CantIni', width: '80px'},
        {data: 'CantMov', width: '80px'},
        {data: 'CantFin', width: '80px'},
        {data: 'Destino', width: '80px'},
        {data: 'Fecha', width: '130px'},
        {data: 'User', width: '70px'},
        ] ,
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
              }
          }else{
          }










        },
        });


        setTimeout(function(){
            var table = $('#Table-Mov').DataTable();
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
            table.buttons().container().appendTo( $('#Table-Mov_filter', table.table().container() ) );
      
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



});



//SELECCION DE TABLAS Y ACCIONES
(input = document.querySelector('#tipoDeDocumento')).addEventListener('change', function () {
    var  TPDoc = $("#tipoDeDocumento :selected").val();

if(TPDoc==1){
    $('#div-eventos').removeAttr('hidden');
    $('#div-labels').attr("hidden", "true");
window.tabMov.ajax.url('/tables/movimient/history/?').load()

var v1 = document.getElementById("titleTables");
v1.textContent = 'MOVIMIENTOS';
document.getElementById("Tabla").value="select * FROM eventos ";


}
if(TPDoc==2){
    $('#div-labels').removeAttr('hidden');
    $('#div-eventos').attr("hidden", "true");
    window.tablabel.ajax.url('/tables/label/history/?').load()

    var v2 = document.getElementById("titleTables");
    v2.textContent = 'ETIQUETAS';
    document.getElementById("Tabla").value="select * FROM LabelsPrint ";
}
});


document.getElementById("Tabla").value="select * FROM eventos ";
document.getElementById("tipoDeDocumento").value=1;



function searchRegister(){
  var Query=document.getElementById("Tabla").value
  var Wherd=" where  NUMBERPART.Fecha"
  var Betwn=" BETWEEN '"+document.getElementById("DTIni").value+"' and '"+document.getElementById("DTf").value+"'"
  var ORd=" order by DETALLE.Id desc"
  var vard= Query+Wherd+Betwn+ORd


  var pt=document.getElementById("tipoDeDocumento").value
   
  if(pt==1){
    window.table.ajax.url('/tables/MOVIMIENTOS/invent/FOR/?tp=1&vard='+vard).load()
    
  }
  if(pt==2){
    window.table.ajax.url('/tables/MOVIMIENTOS/invent/FOR/?tp=1&vard='+vard).load()
  }

}





function searchRegister(){
  var Query=document.getElementById("Tabla").value
  var Wherd=" where  [date] "
  var Betwn=" BETWEEN '"+document.getElementById("DTIni").value+"' and '"+document.getElementById("DTf").value+"'"
  var ORd=" order by Id desc"
  var vard= Query+Wherd+Betwn+ORd

  if(document.getElementById('tipoDeDocumento').value==1){
    window.tabMov.ajax.url('/tables/movimient/history/?tp=1&vard='+vard).load()

  }else if(document.getElementById('tipoDeDocumento').value==2){
    window.tablabel.ajax.url('/tables/label/history/?tp=1&vard='+vard).load()
  }


}