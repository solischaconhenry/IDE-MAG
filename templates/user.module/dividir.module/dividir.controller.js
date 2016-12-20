// angular.module('AppPrueba').directive('fdInput', ['$timeout', function ($timeout) {
//     return {
//         link: function (scope, element, attrs) {
//             element.on('change', function  (evt) {
//                 var files = evt.target.files;
//                 console.log(files[0].name);
//                 console.log(files[0].size);
//                 console.log(files);
//             });
//         }
//     }
// }]);

angular.module('AppPrueba')
.controller('DividirUserController', function ($scope,DividirUserService, fileUploadUser, PrevisualizarUser) {
    $scope.fincas = [];
    $scope.gidFinca = "";
    $scope.loadViewver = function () {
        $scope.sm = new scribblemaps.ScribbleMap('ScribbleMap', {
            searchControl: true,
            lineSettingsControl: false,
            mapTypeControl: true,
            fillColorControl: false,
            lineColorControl: false,
            zoomControl: true,
            tools: ["edit", "drag", "eraser", "line", "rectangle", "circle",
                "polygon", "label"],
            defaultTool: "edit",
            startCenter: [10.360414404, -84.5096459246],
            startZoom:15,
            startMapType: "hybrid",
            disableZoom: false
        });
    }
    
    $scope.printCoords = function () {
        $scope.sm.settings.clearListeners();
        console.log(JSON.stringify($scope.sm.data.getGeoJSON(), null, 2));

        //sm.ui.showLoader("Loading Data");

        // $scope.sm.map.addListener(scribblemaps.MapEvent.OVERLAY_ADDED,function (event) {
        //
        //     var overlay = event.data;
        //     var coords = overlay.getCoords();
        //     console.log(coords);
        // })
    }



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
        var reader = new FileReader();
        reader.onload = function(){
            var text = reader.result;
            // var node = document.getElementById('output');
            //node.innerText = text;
            console.log(JSON.parse(text));
        };
        reader.readAsText(file.files[0]);
        // console.log(file);
        // var uploadUrl = "templates/user.module/subir.module/subir.logic.php?action=upload";
        // fileUploadUser.uploadFileToUrl(file, uploadUrl)
        //     .then(function (data) {
        //         console.log(data);
        //     $scope.svg = true;
        //     $scope.previsualizar();
        // });

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
