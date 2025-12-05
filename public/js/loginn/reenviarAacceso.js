
function iniciaSolitud(){
    document.getElementById("REGISTRYNUMBERdiv").removeAttribute("hidden");
    $('#REGISTRYNUMBERbt').attr("hidden", "true");
}

function sendDtata(){
        $('#REGISTRYNUMBERdiv').attr("hidden", "true");

        var UserNumber=document.getElementById('REGISTRYNUMBER').value

        $.ajax({
            type: 'GET', url:'/REENVIO/DE/CONTRACEnA?id='+UserNumber,
            dataType: 'text',
        success: function (response) {
            var response = JSON.parse(response);

            if (response.mesage.trim() == "NOT"){
                $.notify("Algo salió mal, válida que tu número de control sea el correcto");
                } else if (response.mesage.trim() == "OK") {
                $.notify("Se ha enviado un correo con sus datos, revise su bandeja de correos", "success");
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
