angular.module('AppPrueba')
.controller('CRUDFincasController', function ($scope,mapService,UserService,crudFincasUserService, fileUploadUser, PrevisualizarUser) {
    $scope.fincas = [];
    $scope.selectedFinca = undefined;
    $scope.showInfoFinca = false;

    $scope.loadMap = function () {
        var startCenter = [10.360414404, -84.5096459246]; // visualizar la zona norte en un punto central
        $scope.sm = mapService.loadMapWithEditTools(startCenter);
    };

    $scope.hitme = function () {
        alert("hola que hace :v");
    }

    $scope.printCoords = function () {
        console.log(JSON.stringify($scope.sm.data.getGeoJSON(), null, 2));
        console.log($scope.sm.map.getOverlays());
        //console.log(JSON.stringify($scope.sm.data.getSmJSON(), null, 2));
        //sm.ui.showLoader("Loading Data");
    }
    
    
    $scope.getFincas = function () {
        crudFincasUserService.getFincas(UserService.username).then(function (data) {
            if(data != 'false'){
                $scope.fincas = data;
            }
        });
    }

    $scope.fincaIsSelectedFromCombo = function(){
        $scope.showInfoFinca = !$scope.showInfoFinca;
        var type = JSON.parse($scope.selectedFinca.geom).type;
        var geom = JSON.parse($scope.selectedFinca.geom)
        if(type == "Polygon"){
            mapService.dibujarFinca(geom.coordinates[0]);
        }else if(type == "MultiPolygon"){
            for (g in geom.coordinates[0]) {
                mapService.dibujarFinca(geom.coordinates[0][g]);
            }
        }
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
    
    $scope.getJsonObjectFromFile = function(file) {
        var reader = new FileReader();
        reader.onload = function(){

            // draw in the map
            $scope.drawGeometyInScribbleMap(JSON.parse(reader.result));
        };
        reader.readAsText(file);
    }

    $scope.reverseLatitudeLong = function (coordsArray) {

        for (i in coordsArray){
            coordsArray[i] =  coordsArray[i].reverse();
        }
        return coordsArray;
    }

    
    $scope.drawGeometyInScribbleMap = function (geoJson) {
        if(geoJson.features[0].geometry.type == "Polygon"){
            geoJson.features[0].geometry.coordinates[0] = $scope.reverseLatitudeLong( geoJson.features[0].geometry.coordinates[0]);
            $scope.sm.draw.poly(geoJson.features[0].geometry.coordinates[0],{
                fillOpacity: 0.3,
                fillColor: "#D8D8D8",
                lineColor: "#F3F781",
                editable: false
            }).setMetaData({idFinca:"hola"});
            $scope.sm.view.setCenter([geoJson.features[0].geometry.coordinates[0][0][0],geoJson.features[0].geometry.coordinates[0][0][1]]);
        }else if (geoJson.features[0].geometry.type == "LineString"){
            geoJson.features[0].geometry.coordinates = $scope.reverseLatitudeLong( geoJson.features[0].geometry.coordinates);
            $scope.sm.draw.line(geoJson.features[0].geometry.coordinates,{
                lineColor: "#F3F781"
            });
            $scope.sm.view.setCenter([geoJson.features[0].geometry.coordinates[0][0],geoJson.features[0].geometry.coordinates[0][1]]);
        }
    }

    $scope.uploadFile = function(){
        if($scope.myFile != undefined){
            var os =  $scope.getJsonObjectFromFile($scope.myFile);
        }
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



    $(".nav a").on("click", function(){
        $(".nav").find(".active").removeClass("active");
        $(this).parent().addClass("active");
    });


});
