angular.module('AppPrueba')
    .directive('newaparto', function() {
    return {
        templateUrl: './templates/user.module/crudFincas.module/addApartoInMap.html'
    };
})
    .controller('CRUDFincasController', function ($scope,mapService,UserService,crudFincasUserService, fileUploadUser, PrevisualizarUser, $compile,$filter) {
        $scope.fincas = [];
        $scope.selectedFinca = undefined;
        $scope.showInfoFinca = false;
        $scope.actividades = [];
        $scope.selectedActividad = undefined;
        $scope.descripcionAparto = undefined;
        $scope.actualOverlay = undefined;
        $scope.currentDate = $filter("date")(Date.now(), 'dd-MM-yyyy');
        $scope.apartosFinca = [];


        $scope.loadMap = function () {
            var startCenter = [10.360414404, -84.5096459246]; // visualizar la zona norte en un punto central
            $scope.sm = mapService.loadMapWithEditTools(startCenter);
            $scope.sm.ui.createTool({
                baseTool: "edit",
                id: "info",
                select: function () {
                    $scope.sm.map.openInfoWindow(
                        $scope.sm.view.getCenter(), "Seleccione " +
                        "un aparto", {lineColor: '#000000',
                            lineOpacity: 1,
                            fillColor: '#FFFFFF',
                            fillOpacity: 1,
                            weight: 2}, true
                    );
                    $scope.sm.map.addListener(scribblemaps.MapEvent.OVERLAY_CLICK,function (event) {
                        console.log(event.data.getMetaData());
                        $scope.selectedActividad = event.data.getMetaData().actividad;
                        $scope.descripcionAparto = event.data.getMetaData().descripcion;
                        $scope.currentDate = $filter("date")(event.data.getMetaData().fechaCreacion, 'dd-MM-yyyy');
                        $scope.createDivElementWithDirective();
                        $scope.sm.map.closeInfoWindow();
                        $scope.sm.map.removeListener(scribblemaps.MapEvent.OVERLAY_CLICK,null);
                        $scope.sm.ui.setTool("edit");

                    });
                },
                deselect: function (event) {
                    console.log(event);
                    //scope.sm.map.removeListener(scribblemaps.MapEvent.OVERLAY_CLICK,null);
                },
                mousedown: function (event) {
                    //console.log(event);
                },
                mouseup: function (event) {
                    //console.log(event);
                },
                mousemove: function (event) {
                    //console.log(event);
                }
            });
            mapService.avaibleTools.push("info");
            $scope.sm.ui.setAvailableTools(mapService.avaibleTools);
        };


        $scope.printCoords = function () {
            console.log(JSON.stringify($scope.sm.data.getGeoJSON(), null, 2));
            //console.log($scope.sm.map.getOverlays());
            //console.log(JSON.stringify($scope.sm.data.getSmJSON(), null, 2));
            //sm.ui.showLoader("Loading Data");
        }

        $scope.getApartosValidosFinca = function (idFinca,callback) {
            crudFincasUserService.getApartosValidosFinca(idFinca).then(callback)
        }


        $scope.getFincas = function () {
            crudFincasUserService.getFincas(UserService.username).then(function (data) {
                if(data != 'false'){ // validar que no pasen datos nulos
                    $scope.fincas = data;
                }
            });
        };

        $scope.getActividades = function () {
            crudFincasUserService.getTipoActividad().then(function (data) {
                if(data != 'false'){
                    $scope.actividades = data;
                }
            });
        };

        $scope.getIdActividad = function (nombreActividad) {
            for(i in $scope.actividades){
                if($scope.actividades[i].nombre == nombreActividad)
                    return $scope.actividades[i].idtipoactividad;
            }
        }

        $scope.agregarSolicitudAparto = function () {
            $scope.actualOverlay.setMetaData(
                {
                    actividad:$scope.selectedActividad,
                    idtipoActividad:$scope.getIdActividad($scope.selectedActividad),
                    descripcion:$scope.descripcionAparto,
                    fechaCreacion: new Date($scope.currentDate).getTime()
                });
            $scope.sm.ui.hidePanel();
            $scope.descripcionAparto = undefined;
        }

        $scope.createDivElementWithDirective = function () {
            var div = document.createElement("div");
            div.style.width = "250px";
            div.style.height = "250px";
            div.setAttribute("newAparto","");
            $scope.sm.ui.showCustomPanel(div,false);
            $compile(div)($scope);
        }

        $scope.nuevoApartoCreadoListener = function (overlay,response) {
            $scope.actualOverlay = overlay;
            if(response == true){
                if(isEmpty(overlay.getMetaData())){ // validar que solo contenga el gid en el metadata
                    $scope.selectedActividad = undefined;
                    $scope.descripcionAparto = undefined;
                    $scope.currentDate = $filter("date")(Date.now(), 'dd-MM-yyyy');
                    $scope.createDivElementWithDirective();
                }
                // else{
                //     console.log(overlay.getMetaData());
                //     $scope.selectedActividad = overlay.getMetaData().actividad;
                //     $scope.descripcionAparto = overlay.getMetaData().descripcion;
                //     $scope.currentDate = overlay.getMetaData().fechaCreacion;
                // }

            }
        }

        $scope.manageDrawFincaAndApartoInMap = function () {
            var type = JSON.parse($scope.selectedFinca.geom).type;
            var geom = JSON.parse($scope.selectedFinca.geom);
            mapService.clearListenersAndWipeMap();
            if(JSON.parse($scope.selectedFinca.geom).type == "Polygon"){
                mapService.drawPropertyInUserView($scope.selectedFinca,geom.coordinates[0]);
            }else if(JSON.parse($scope.selectedFinca.geom).type == "MultiPolygon"){
                for (g in geom.coordinates[0]) {
                    mapService.drawPropertyInUserView($scope.selectedFinca,geom.coordinates[0][g]);
                }
            }
            $scope.getApartosValidosFinca($scope.selectedFinca.gid,function (response) {
                mapService.dibujarApartosValidosFinca(response);
                mapService.addListenerGeometryDraw(mapService.validAddedOverlay,$scope.nuevoApartoCreadoListener); // Agrega un listener al mapa cuando se dibujen nuevas geometrias;
            });



        }

        $scope.fincaIsSelectedFromCombo = function(){
            $scope.showInfoFinca = !$scope.showInfoFinca;
            $scope.manageDrawFincaAndApartoInMap();
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


        $scope
    
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

    function isEmpty(obj) {

        // null and undefined are "empty"
        if (obj == null) return true;

        // Assume if it has a length property with a non-zero value
        // that that property is correct.
        if (obj.length > 0)    return false;
        if (obj.length === 0)  return true;

        // If it isn't an object at this point
        // it is empty, but it can't be anything *but* empty
        // Is it empty?  Depends on your application.
        if (typeof obj !== "object") return true;

        // Otherwise, does it have any properties of its own?
        // Note that this doesn't handle
        // toString and valueOf enumeration bugs in IE < 9
        for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) return false;
        }

        return true;
    }



    $(".nav a").on("click", function(){
        $(".nav").find(".active").removeClass("active");
        $(this).parent().addClass("active");
    });


});
