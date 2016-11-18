angular.module('AppPrueba')
.controller('MostrarController', function ($scope,MostrarService, InsertarFormularioFincaxForm,$state) {
    $scope.fincas = [];
    $scope.gidFinca = "";
    $scope.apartoGid ="";
    $scope.apartoAtual = "";

    // Se debe de obtener el id del usuario
    $scope.idUser=1;
    MostrarService.getFincas($scope.idUser).then(function (data) {
        $scope.fincas = data;
    });

    $scope.change = function(){
        MostrarService.preview($scope.gidFinca).then(function (data) {
            $scope.numHistoricoActual = data.max;
            $scope.Max = data.max;
            reconvertJsonPolygon(data.finca,false);
        });

        //obtener idUsuario
        MostrarService.getFincasByID("1", $scope.gidFinca).then(function(data){
          $scope.dataFinca = data[0];
          console.log(data);
        });
        InsertarFormularioFincaxForm.idFincaxFormulario = $scope.gidFinca;
    };

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
        $state.go("formularioGanaderia");
    }    

});
