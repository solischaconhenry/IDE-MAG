angular.module('AppPrueba')
.controller('DividirUserController', function ($scope,DividirUserService, fileUploadUser, PrevisualizarUser) {
    $scope.fincas = [];
    $scope.gidFinca = "";

    // Se debe de obtener el id del usuario
    $scope.idUser=1;
    DividirUserService.getFincas($scope.idUser).then(function (data) {
        $scope.fincas = data;
    });

    $scope.change = function(){
        DividirUserService.preview($scope.gidFinca).then(function (data) {
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
    
    
    $scope.gidAparto = "";
    $scope.dividir = function(gid, coordenadas){
        $scope.gidAparto = gid;
        $scope.apartoToEdit = coordenadas;
    }
    
    
    $scope.svg = false;
    $scope.uploadFile = function(){
        var file = $scope.myFile;
        console.log(file);
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
    
    
    $scope.dividirAparto = function(){
        DividirUserService.putData ($scope.gidAparto, $scope.gidFinca)
        .then(function (data) {
            console.log(data)
        });
    }

    



});
