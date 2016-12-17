angular.module('AppPrueba')


.controller('AgregarUserController', function ($scope, AgregarUserService, fileUploadUser, PrevisualizarUser, Save) {

    $scope.fincas = [];
    $scope.svg = false;
    $scope.gidFinca = "";

    // Se debe de obtener el id del usuario
    $scope.idUser=1;
    AgregarUserService.getFincas($scope.idUser).then(function (data) {
        $scope.fincas = data;
    });
    
    $scope.change = function(){
        AgregarUserService.preview($scope.gidFinca).then(function (data) {
           $scope.json = reconvertJsonPolygon(data);
        });
    }
    
    function reconvertJsonPolygon(puntos) {
        var json = [];
        var points = '';

        for(var i = 0; i < puntos.length; i++) {
            for (var j = 0; j < puntos[i].puntos.length; j++) {
                points += puntos[i].puntos[j].x + ',' + puntos[i].puntos[j].y + ' ';
            }
            json.push({gid:puntos[i].gid,puntos: points.slice(0, points.length-1)});
            points = '';
        }
        return json;
    }
    
    
    $scope.uploadFile = function(){
        var file = $scope.myFile;
        var uploadUrl = "templates/user.module/subir.module/subir.logic.php?action=upload";
        fileUploadUser.uploadFileToUrl(file, uploadUrl)
            .then(function (data) {
            $scope.svg = true;
            $scope.previsualizar();
        });

    };
    
    $scope.previsualizar = function(){
        PrevisualizarUser.getData()
            .then(function (data) {
            $scope.jsonCargado = reconvertJsonPolygon(data);
        });
    }
    
    $scope.save = function(){
        AgregarUserService.agregar($scope.gidFinca)
            .then(function (data) {
            alert("ok");
            console.log(data);
        });        
    }

});
