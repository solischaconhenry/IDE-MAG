angular.module('AppPrueba')
.controller('MostrarController', function ($scope,MostrarService,$state,InsertarFormularioFincaxForm) {
    $scope.fincas = [];
    $scope.gidFinca = "";
    $scope.formActual = 0;
    $scope.apartoGid ="";
    $scope.apartoAtual = "";
    $scope.formularios = [];
    $scope.formulariosFincaAcual = [];
    $scope.respuestasFormActual = [];
    $scope.codigofinca = 0;
    $scope.dataFinca = {};
    // Se debe de obtener el id del usuario
    $scope.idUser=1;
    MostrarService.getFincas($scope.idUser).then(function (data) {
        $scope.fincas = data;
    });

    $scope.change2 = function() {
        console.log($scope.formActual);
    }

    $scope.change = function(){
        MostrarService.preview($scope.gidFinca).then(function (data) {
            $scope.numHistoricoActual = data.max;
            $scope.Max = data.max;
            reconvertJsonPolygon(data.finca,false);
        });

        //obtener idUsuario
        MostrarService.getFincasByID("1", $scope.gidFinca).then(function(data){
                     $scope.dataFinca = data[0];

            $scope.codigofinca = $scope.dataFinca.codigofinca;

            InsertarFormularioFincaxForm.idFincaxFormulario = $scope.gidFinca;
            // Aqui se actializa la lista de formularios disponibles para la finca seleccionada
            $scope.actualizarlistaForm();

        });
    };
    $scope.anadirFormFinca = function () {
        if($scope.formActual == undefined || $scope.formActual == "")
        {

        }
        else {
            MostrarService.insertarFormFinca($scope.formActual, $scope.codigofinca).then(function (data) {
            });

            $scope.actualizarlistaForm();
        }
    }

    $scope.actualizarlistaForm = function () {

        MostrarService.getFormulariosFinca($scope.dataFinca.codigofinca).then(function (data) {
            console.log(data);
            if(data != "false") {
                $scope.formulariosFincaAcual = data;
            }
            else {
                $scope.formulariosFincaAcual = [];
            }


        });
        //Aqui se actializa la lista de formularios ya añadidos a la finca
        MostrarService.getFormulariosNoFinca($scope.dataFinca.codigofinca).then(function (data) {
            $scope.formularios = data;
            // console.log($scope.formularios);
        });
    }


    $scope.mostrarRespuestasForm = function () {
        if ($scope.respActual!= "" )
        {
            
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
        console.log(gid);
        $scope.apartoGid = gid;
        $scope.jsonSeleccionado =[];
        $scope.jsonSeleccionado.push({id:gid,puntos:coordenadas});

        console.log($scope.jsonSeleccionado);
        //obtener idUsuario
        MostrarService.getApartoByID($scope.apartoGid).then(function(data){
          $scope.dataAparto = data[0];
          console.log(data);
        });

        $scope.apartoAtual = true;
    };

    $scope.gotoForm = function(){

        $state.go("dashboard.formularioGanaderia");
    }

});
