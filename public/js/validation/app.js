
// Copyright 2016 Google Inc.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//      http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


(function() {
  'use strict';
  var app = {
    isLoading: false,
    visibleCards: {},
    selectedCities: [],
    spinner: document.querySelector('.loader'),
    menu: document.querySelector("#menu"),
    mondatoOp: document.querySelector("#montadoOp"),
    costuraOp: document.querySelector("#costuraOp"),
    montadoAsig: document.querySelector("#montadoAsig"),
    costuraAsig: document.querySelector("#costuraAsig"),
    labels: document.getElementById("labels"),
    ok: document.querySelector("#ok"),
    scrap: document.querySelector("#scrap"),
    current: "Inicio",
    process:"",
    configOperator:0,
    configRework:0,
    processBefore: "",
    asigOperator:0,
    validation:0,
    scrapValidation: 0, 
    operador:'',
    line:'',
    processLine: ''
  };

  /*****************************************************************************
   *
   * Event listeners for UI elements
   *
   ****************************************************************************/
  
  app.process =  (document.getElementById('process').value).trim()
  var url = '/process?process=' + app.process
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState === XMLHttpRequest.DONE) {
      if (request.status === 200) {
        var res = JSON.parse(request.response);
        //console.log(res)
        app.process = res.process.trim()
        app.configOperator = res.operator
        app.configRework = res.rework
        app.processBefore =  res.processBefore.trim()
        app.asigOperator = res.asigOperator
        app.validation = res.validation
        app.scrapValidation = res.scrapValidation
        app.configOperator = res.operator
        app.user = res.user
        app.processLine = res.line
        app.init()
      }
    } else {
      console.log("error")
    }
  };
  request.open('GET', url);
  request.send();


  
  $.notifyDefaults({
    allow_dismiss: true,
    
    placement: {
      from: "top",
      align: "right"
    },
    delay: 2000,
    animate: {
      enter: 'animated fadeInDown',
      exit: 'animated fadeOutUp'
    },
    z_index:10001,
  });
  state = 'Nivel2'
  app.init = function(){
    if (app.configOperator == 1){
        document.getElementById('operador').removeAttribute('hidden')
    } else {
        document.getElementById('label').removeAttribute('hidden')
        document.querySelector('.backL').classList.add('optionMenu')
    }
    document.querySelector('.backL').addEventListener('click', function(e) {
      if (app.configOperator == 1){
        e.preventDefault()
        document.getElementById("operator").value = ''
        document.getElementById("label").setAttribute('hidden', true)
        document.getElementById("operador").removeAttribute('hidden')
        setTimeout(() => {
          document.querySelector("#operator").focus()
        }, 200);
      }
      state = 'Nivel2'
    });
    document.getElementById("sidebarCollapse").setAttribute('hidden', true)
    
    //alert(app.process)
    var operator = document.getElementById("operator")
    operator.addEventListener('keyup', function (e) {
      if (e.keyCode == 13){
        
        var label = '' + operator.value
        app.operador = label
        //alert(label.length)
        if(label.length > 5){
          $.notify({
            icon: 'icon ion-md-close-circle',
            message: "El codigo del operador no tiene el formato correcto."
          },{type: 'info'});
        } else {
          app.getLabel(label, 'operator', app.process, "",'','') 
        } 
      }
    })
    if (app.process.trim() == 'Devolucion'){
      status = 'NG'
    } else {
      status = 'OK'
    }
    changeStatus(status)
    var labelI = document.querySelector(".input-label")
    labelI.addEventListener('keyup', function (e) {
      if (e.keyCode == 13){
        var label = labelI.value.toUpperCase()
        if (app.validation == 1 ){
            status = ''
        } 
        if (label == "OKSIG"){
          document.querySelector('.backL').click()
        } else {
          if (label == "RW"){
              if (app.configRework == 1){
                status = 'RW'
                changeStatus(status)
                labelI.value = ''
                labelI.focus()
              } else {
                  $.notify({
                    icon: 'icon ion-md-close-circle',
                    message: "El proceso no esta habilitado para hacer retrabajo"
                  },{type: 'info'});
                  labelI.value = ""
                  labelI.focus()
              }   
          } else if (label == 'NG') {
              status = 'NG'
              changeStatus(status) 
              
              labelI.value = ''
              labelI.focus()
          } else {
              if (status == 'NG' && app.scrapValidation == 1){
                app.label = labelI.value
                app.scrap.removeAttribute("hidden")
                app.scrap.focus()
              } else {
                app.getLabel(label, 'validation', app.process, '', status, app.operador)
                if (app.process.trim() == 'Devolucion'){
                  status = 'NG'
                } else {
                  status = 'OK'
                }
                
                changeStatus(status) 
              }
          }
        }
      }
    })

    var ok = document.getElementById("ok")
    ok.addEventListener('keyup', function (e) {
      if (e.keyCode == 13){
        var respuesta = app.ok.value
        var label = app.label
        if (respuesta == "OK"){
          app.getLabel(label, 'validation', app.process, "", 'OK', app.operador)
        } else if (respuesta == "NG") {
          app.scrap.removeAttribute("hidden")
          app.scrap.focus()
        } else if (respuesta == 'RT') {
          app.getLabel(label, 'validation', app.process, "", 'RT', app.operador)
        } else {
          $.notify({
            icon: 'icon ion-md-close-circle',
            message: "El codigo no es correcto"
          },{type: 'info'});
          app.ok.value = ""
          app.ok.focus()
        }
      }
    })
    var scrap = document.getElementById("scrap")
    scrap.addEventListener('keyup', function (e) {
      if (e.keyCode == 13){
        var label = app.label
        var scrap = app.scrap.value
        app.getLabel(label, 'scrap', app.process, scrap, 'NG', app.operador)
        
      }
    })

    if (app.configOperator == 0){
      app.operador = app.user
      app.getProduction(app.operador, app.process)
      app.getLabels(app.operador, app.process)
      document.querySelector('.input-label').focus()
    } else {
      document.querySelector('.input-scanner').focus()
    }
  }
  function changeStatus(st){
      var el = document.querySelector('#lbl-type')
      el.innerHTML = ""
      el.insertAdjacentHTML( 'afterbegin',st)
  }
  /*****************************************************************************
   *
   * Methods to update/refresh the UI
   *
   ****************************************************************************/

  /*****************************************************************************
   *
   * Methods for dealing with the model
   *
   ****************************************************************************/

  app.getProduction = function(operator, process) {
    var operator = operator
    var url = '/production?operator=' + operator + '&process=' + process ;

    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState === XMLHttpRequest.DONE) {
        if (request.status === 200 || request.status === 300) {
            var response = JSON.parse(request.response);
            document.getElementById("nooperador").innerHTML = operator;
            if (response.production < 0){
              document.getElementById("noproduccion").innerHTML =Math.abs(parseInt(response.production)) ;  
              
            } else {
              document.getElementById("noproduccion").innerHTML =response.production ;  
            }
            
        }
      } else {
      }
    };
    request.open('GET', url);
    request.send();
  }

  app.getLabels = function(operator, process) {
    var operator = operator
    $(document).find('#labels').empty()
    var url = '/data/labels?operator=' + operator + "&process=" + process
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState === XMLHttpRequest.DONE) {
        if (request.status === 200) {
          var response = JSON.parse(request.response);
          //console.log(response)
          var i = 0
          while (i < response.length){
              var label = response[i].production;
              var ok = 'ok'
              if (response[i].ok == 0){
                ok = 'ng'
              } else if (response[i].ok == -1){
                ok = 'ng'
              }
              var html = '<div class="label">' +
              '<img src="/images/' + ok + '.ico" style="height:25px;" class="'+ ok + '">' + label +
              '</div>'
              app.labels.insertAdjacentHTML( 'afterbegin',html);
              i = i + 1
          }
        }
      } else {
        // Return the initial weather forecast since no data is available.
      }
    };
    request.open('GET', url);
    request.send();
  }

  // TODO uncomment line below to test app with fake data
  // app.updateForecastCard(initialWeatherForecast);

 

  app.getLabel = function(label, type, process, scrap, okng, operador ) {
    if (app.configOperator == 0 ){
        app.line = app.processLine
    }
    var statement = '&label=' + label +'&typo=' + type + '&process=' + process +  '&scrap=' + scrap +  '&ok=' + okng + '&operator=' + app.operador + '&line=' + app.line
    if (type == "operator"){
      var url = '/operator?' +
        statement;
    } else if (type == "scrap"){
      var url = '/scrap?' +
        statement;
    } else if (type == "validation"){
      var url = '/barcode?' +
        statement + '&processVal=' +  app.processBefore;

        if (app.validation == 1){
          statement = statement + '&okng=true'
        }
    }
    app.label = label
    // Fetch the latest data.
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState === XMLHttpRequest.DONE) {
        if (request.status === 200) {
          var response = JSON.parse(request.response);
          if (response.status == 'ok'){
              if (type == "operator"){
                  show(true, process)
                  app.getProduction(app.label, process)
                  app.getLabels(app.label, process)
                  app.operator = app.label
                  app.line = response.line
                  
              } else if (type == "validation"){
                  if (app.validation == 1 && okng == '' ){
                      app.getProduction(app.operador, process)
                      app.ok.removeAttribute('hidden')
                      app.ok.focus()
                  } else {
                      //if (app.asigOperator == 1){
                      app.getProduction(app.operador, process)
                      ///}
                      addLabel(app.label,process, response, okng)
                  } 
              } else if (type == "scrap"){
                  app.getLabel(app.label, 'validation', process, scrap, 'NG', app.operador)
                  document.getElementById("scrap").setAttribute('hidden', true)
                  if (status == 'Devolucion'){
                    status = 'NG'
                  } else {
                    status = 'OK' 
                  }
                 
                  changeStatus(status) 
                  
              }
          } else  {
            $.notify({
              icon: 'icon ion-md-close-circle',
              message: response.mensage
            },{type: 'info'});
            if (type == 'operator'){
              var operador = document.querySelector('.input-scanner')
              operador.value = ""
              operador.focus()
            } else if (type == 'validation'){
              var label = document.querySelector('.input-label')
              label.value = ''
              label.focus()
            } else if (type =='scrap'){
              app.scrap.value = ''
              app.scrap.focus()
            }
          }
        } else if (request.status == 0){
          $.notify({
            icon: 'icon ion-md-close-circle',
            message: "Se ha perdido la conexion , actualiza la ventana."
          },{type: 'infor'});
        }
      } else {
        //notifier.alert("No hubo conexcion con el servidor.")
        // Return the initial weather forecast since no data is available.
        //app.updateForecastCard(initialWeatherForecast);
      }
    };
    request.open('GET', url);
    request.send();
  };
  function show(ok, process){
    if (ok){
        var operador = document.getElementById('operador')
        operador.setAttribute('hidden', true)
        var label = document.getElementById('label')
        label.removeAttribute('hidden') 
        //operador.value = ""
        document.querySelector('.input-label').focus()
        state = 'Nivel3'
    }
  }

  function addLabel(label,process,  response, status){
      //console.log("addLabel")
      var ok = "ok"
      if (status == "NG" ){ok = "ng"}
      if (status == "RT"){ok = "rt"}
      var html = '<div class="label">' +
        '<img src="/images/' + ok + '.ico" style="height:25px;" class="'+ ok + '">' + label +
        '</div>'
      
      app.labels.insertAdjacentHTML( 'afterbegin',html);
      var lbl = document.querySelector('.input-label')
      lbl.value = "";
      lbl.focus()   
      $.notify({
        icon: 'icon ion-md-done-all',
        message: response.mensage
      },{type: 'success'});

      app.ok.setAttribute('hidden', true)
      app.ok.value = ''
      app.scrap.setAttribute('hidden', true)
      app.scrap.value = '';
  }
})();


