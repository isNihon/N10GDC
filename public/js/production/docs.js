$(document).ready(function () {
    var options = {
        beforeSubmit: showRequest, // pre-submit callback
        success: showResponse // post-submit callback
    }; // bind to the form's submit event 
    $('#frmUploader').submit(function () { 
        $(this).ajaxSubmit(options); 
        // always return false to prevent standard browser submit and page navigation 
        return false;
    }); 
    //}); 
    // pre-submit callback 
    function showRequest(formData, jqForm, options) { 
        //alert('Uploading is starting.');
        //$.notify(
        //    "Se esta enviando la solicitud", 
        //    { position:"top right" , className:'info'}
        //  );
        return true;
    } 
        // post-submit callback 
    function showResponse(responseText, statusText, xhr, $form) {
            //alert('status: ' + statusText + '\n\nresponseText: \n' + responseText ); 
            var clas = 'success'
            if (statusText != 'success'){
                clas = 'error'
            }
            $.notify(
                responseText, 
                { position:"top right" , className:clas}
            );

            window.tableDocs.ajax.url('/tables/tabDocs?id='+idTabDocs,).load()
    }
})