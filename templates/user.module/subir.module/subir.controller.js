angular.module('AppPrueba')
.controller('SubirUserController', function ($scope, fileUploadUser, PrevisualizarUser, SaveUser) {

    $scope.svg = false;

    $scope.uploadFile = function(){
        var file = $scope.myFile;
        console.log("file: ");
        console.log("File2:" + file);
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
            reconvertJsonPolygon(data);
        });
    }

    $scope.json = [];
    function reconvertJsonPolygon(puntos) {
        var json = [];
        var points = '';

        for(var i = 0; i < puntos.length; i++) {
            for (var j = 0; j < puntos[i].puntos.length; j++) {
                points += puntos[i].puntos[j].x + ',' + puntos[i].puntos[j].y + ' ';
            }
            json.push({puntos: points.slice(0, points.length-1)});
            points = '';
        }
        $scope.json = json;
    }

    
    $scope.idUser = 1;
    $scope.save = function(){
        SaveUser.putData($scope.idUser)
            .then(function (data) {
            alert("ok");
            console.log(data);
        });        
    }

});
