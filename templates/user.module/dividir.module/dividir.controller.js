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
            tools: ["edit", "drag", "eraser", "lineSnap", "rectangle", "circle",
                "polygon", "label" ],
            defaultTool: "edit",
            startCenter: [10.360414404, -84.5096459246],
            startZoom:17,
            startMapType: "hybrid",
            disableZoom: false
        });
    }

    
    $scope.printCoords = function () {

        console.log(JSON.stringify($scope.sm.data.getGeoJSON(), null, 2));
        console.log($scope.sm.map.getOverlays());
        //console.log(JSON.stringify($scope.sm.data.getSmJSON(), null, 2));

        //sm.ui.showLoader("Loading Data");


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

    



});
