angular.module('AppPrueba')
.controller('HistoricosController', function ($scope,MostrarService,HistoricosService,VerEditarFormServiceCodigoFincaAparto,InsertarFormularioFincaxForm,$state) {
    $scope.fincas = [];

    $scope.gidFinca = VerEditarFormServiceCodigoFincaAparto.gidFinca;
    // $scope.apartoGid = VerEditarFormServiceCodigoFincaAparto.gidAparto;
    $scope.codigofinca = VerEditarFormServiceCodigoFincaAparto.codigofincaaparto;

    $scope.formularios = [];
    $scope.formulariosFincaAcual = [];
    $scope.respuestasFormActual = [];



    // Se debe de obtener el id del usuario
    $scope.idUser=1;
    HistoricosService.getFincas($scope.idUser).then(function (data) {
        $scope.fincas = data;
        console.log($scope.fincas)
    });

    // CUANDO SE SELECCIONA ALGUNA FINCA EN EL COMBOBOX
    $scope.change = function(){
        HistoricosService.preview($scope.gidFinca).then(function (data) {
            $scope.numHistoricoActual = data.max;
            $scope.Max = data.max;
            reconvertJsonPolygon(data.finca,false);
        });


        MostrarService.getFincasByID("1", $scope.gidFinca).then(function(data){
            $scope.dataFinca = data[0];
            console.log($scope.dataFinca);

            $scope.codigofinca = $scope.dataFinca.codigofinca;

            //Para enviar al mostrarRespuesta el tipo
            VerEditarFormServiceCodigoFincaAparto.codigofincaaparto = $scope.codigofinca;
            VerEditarFormServiceCodigoFincaAparto.tipo = "finca";
            VerEditarFormServiceCodigoFincaAparto.gidFinca = $scope.gidFinca;
            VerEditarFormServiceCodigoFincaAparto.origen = "historicos";

            //Para enviar  a la vista de mostrar
            InsertarFormularioFincaxForm.idFincaxFormulario = $scope.gidFinca;
            // Aqui se actializa la lista de formularios disponibles para la finca seleccionada
            $scope.apartoAtual = false;

        });
    }


    $scope.anadirFormAparto = function () { //funciona bien

        if($scope.formActualAparto == undefined || $scope.formActualAparto == "")
        {

        }
        else {
            MostrarService.insertarFormAparto($scope.formActualAparto,$scope.apartoGid).then(function (data) {
            });
            $scope.formActualAparto = "";
            $scope.actualizarlistaFormAparto();
        }
    }


    $scope.actualizarlistaFormAparto = function () {

        MostrarService.getFormulariosFinca($scope.apartoGid,"aparto").then(function (data) {
            console.log(data);
            if(data != "false") {
                $scope.formulariosApartoActual = data;
            }
            else {
                $scope.formulariosApartoActual = [];
            }


        });
        //Aqui se actualiza la lista de formularios ya añadidos aL aparto
        MostrarService.getFormulariosNoFinca($scope.apartoGid,"aparto").then(function (data) {
            $scope.formularios = data;
        });
    }

    $scope.formActualFuncAparto = function(elem){
        $scope.respActualAparto =  JSON.parse(elem);
    }

    $scope.mostrarRespuestasFormAparto = function () {
        if ($scope.respActualAparto!= "" )
        {

            VerEditarFormServiceCodigoFincaAparto.respuesta = $scope.respActualAparto;
            VerEditarFormServiceCodigoFincaAparto.nombrefinca = $scope.dataFinca.nombrefinca;
            VerEditarFormServiceCodigoFincaAparto.nombrepropietario = $scope.dataFinca.nombreprop;
            VerEditarFormServiceCodigoFincaAparto.apellidosPropietario = $scope.dataFinca.apellidos;
            $state.go('dashboard.verRespForm');
        }


    }




    $scope.json = [];
    function reconvertJsonPolygon(puntos,aparto) {
        var json = [];
        var points = '';

        for(var i = 0; i < puntos.length; i++) {
            for (var j = 0; j < puntos[i].puntos.length; j++) {
                points += puntos[i].puntos[j].x + ',' + puntos[i].puntos[j].y + ' ';
            }
            json.push({gid:puntos[i].gid,puntos: points.slice(0, points.length-1)});
            points = '';
        }
        if(!aparto)
            $scope.json = json;
        else
            $scope.jsonSeleccionado=json;
    }



    $scope.gidAparto = "";
    $scope.jsonSeleccionado=[];
    $scope.unir = function(gid, coordenadas){

        VerEditarFormServiceCodigoFincaAparto.codigofincaaparto = gid;
        VerEditarFormServiceCodigoFincaAparto.tipo = "aparto";
        VerEditarFormServiceCodigoFincaAparto.gidAparto = gid;

        console.log(gid);
        $scope.apartoGid=gid;
        $scope.jsonSeleccionado=[];
        $scope.jsonSeleccionado.push({id:gid,puntos:coordenadas});

        MostrarService.getApartoByID($scope.apartoGid,$scope.gidFinca).then(function(data){
            $scope.dataAparto = data[0];
            $scope.actualizarlistaFormAparto();
        });
        $scope.apartoAtual = true;

    }

    $scope.siguienteFinca = function(){
        if($scope.numHistoricoActual+1 > 0 && $scope.numHistoricoActual+1 <= $scope.Max)
        {      
            $scope.numHistoricoActual+=1;
            getHistorico();
        }
    }
    
    $scope.AnteriorFinca = function(){
        if($scope.numHistoricoActual-1 > 0 && $scope.numHistoricoActual-1 <= $scope.Max)
        {      
            $scope.numHistoricoActual-=1;
            getHistorico();
        }
    }


    var getHistorico = function()
    {
        HistoricosService.getGeomHistorico($scope.gidFinca,$scope.numHistoricoActual).then(function (data) {
            reconvertJsonPolygon(data,false);
        });
    }
    
    $scope.siguienteAparto= function(){
        
        HistoricosService.getHistAparto($scope.apartoGid,0,$scope.gidFinca).then(function(data)
        {
            console.log(data);
            $scope.apartoGid= data[0].gid;
            reconvertJsonPolygon(data,true);
        });
    }
    
    $scope.AnteriorAparto = function(){
        HistoricosService.getHistAparto($scope.apartoGid,1,$scope.gidFinca).then(function(data)
        {
            console.log(data[0].gid);
            $scope.apartoGid= data[0].gid;
            reconvertJsonPolygon(data,true);
        });
    }
    $scope.hist=function(gid)
    {
        console.log(gid);
        $scope.apartoGid= gid;
    }
    
    

    });
