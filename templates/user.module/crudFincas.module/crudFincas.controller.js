angular.module('AppPrueba')
    .directive('newaparto', function() {
    return {
        templateUrl: './templates/user.module/crudFincas.module/addApartoInMap.html'
    };
}).factory("LS",function ($window,$rootScope) {
        return{
            setApartosFinca:function (val) {
                $window.localStorage.setItem('apartosFinca',JSON.stringify(val));
                return this;
            },
            getApartosFinca:function () {
                return JSON.parse($window.localStorage.getItem('apartosFinca'));
            }
        };
    })
    .controller('CRUDFincasController', function ($scope,mapService,UserService,crudFincasUserService, fileUploadUser, PrevisualizarUser, $compile,$filter,LS,$state,FormularioResolver) {
        $scope.fincas = [];
        $scope.selectedFinca = undefined;
        $scope.showInfoFinca = false;
        $scope.actividades = [];
        $scope.selectedActividad = undefined;
        $scope.descripcionAparto = undefined;
        var actualOverlay = undefined;
        $scope.currentDate = [];//$filter("date")(Date.now(), 'dd-MM-yyyy');
        $scope.apartosFinca = [];


        $scope.loadMap = function () {
            // visualizar la zona norte en un punto central
            var startCenter = [10.360414404, -84.5096459246];
            // carga el mapa con las herramientas
            $scope.sm = mapService.loadMapWithTools(startCenter,[]);

        };

        function changeColorsToSelectedAparto() {
            for(var i in mapService.getOverlays()){
                if(mapService.getOverlays()[i].getStyle().fillColor == "#00E600"){
                    var newStyle = mapService.getOverlays()[i].getStyle();
                    if(mapService.getOverlays()[i].getMetaData().estado == 0){
                        mapService.getOverlays()[i].setStyle({lineColor: "#FFFFFF", weight: 3, fillColor: "#EB0812", fillOpacity: 0.3})
                    }else if(mapService.getOverlays()[i].getMetaData().estado == 2) {
                        mapService.getOverlays()[i].setStyle({lineColor: "#FFFFFF", weight: 3, fillColor: "#f4d142", fillOpacity: 0.3})
                    }
                }
            }
        }

        $scope.loadTools = function () {

            mapService.clearListeners();
            mapService.removeTool("info");
            mapService.showSearchControl();
            mapService.createInfoApartoTool("edit",showInfoApartoInPopup); // crea la herramienta para seleccionar aparto y ver informacion
            changeColorsToSelectedAparto();
            mapService.createUnionTool(function (event) {

            });
            mapService.setMapTools(["edit", "drag", "eraser", "rectangle", "circle", "polygon", "info","union","divide"]); // agrega la nueva herramienta al mapa
        };

        //funcion que se ejecuta al seleccionar la herramienta para ver informacion de aparto
        function showInfoApartoInPopup(event) {
            actualOverlay = event.data;
            $scope.selectedActividad = event.data.getMetaData().actividad; // enlazado con la vista addApartoInMap
            $scope.descripcionAparto = event.data.getMetaData().descripcion; // enlazado con la vista addApartoInMap
            $scope.currentDate = $filter("date")(event.data.getMetaData().fechaCreacion, 'MM/dd/yyyy'); // enlazado con la vista addApartoInMap.html
            createDivElementWithDirective(); // crea la ventana popup y carga la vista addApartoInMap.html por medio de una directiva
            mapService.closeInfoWindow();
            mapService.removeMapOverlayClickListener(null);
            mapService.setTool("edit");
        }

         function convertCoordsToArrayOfCoords (coords) {
            var coordsArray = [];
            for(var i in coords){
                coordsArray.push([parseFloat(coords[i].lat),parseFloat(coords[i].lng)]);
            }
            return coordsArray;
        }
        
         function isGeomEqual(geom1,geom2) {
            var coordsArray = convertCoordsToArrayOfCoords(geom1);
            if(JSON.stringify(coordsArray) == JSON.stringify(geom2)){
                return true;
            }
            return false;
        }
        
        function insertApartsChangedOrNew() {
            var geojson = mapService.getGeoJson();
             for(var i in geojson.features){
                 var metaDataInfo = {
                     gid:parseInt(geojson.features[0].properties.metaData.gid),
                     geom: JSON.stringify(geojson.features[i].geometry),
                     fecha:parseInt(geojson.features[i].properties.metaData.fechaCreacion),
                     idActividad:parseInt(geojson.features[i].properties.metaData.idtipoActividad),
                     descripcion:geojson.features[i].properties.metaData.descripcion
                 };
                 if(geojson.features[i].properties.metaData.GeomwasEdited == true && geojson.features[i].properties.metaData.estado == 0){
                     // si la geometria de un aparto valido fue editada cree historico para ese aparto, si solo la actividad cree un nuevo historico de formulario
                     metaDataInfo.gidFinca = parseInt(geojson.features[0].properties.metaData.gid);
                     metaDataInfo.gid = parseInt(geojson.features[i].properties.metaData.gidAparto);
                     crudFincasUserService.insertarHistoricoAparto(metaDataInfo);
                }else if(geojson.features[i].properties.metaData.GeomwasEdited == true && geojson.features[i].properties.metaData.estado == 2){
                     // si la geometria de un aparto pendiente fue editada actualize la informacion geografica y la informacion adicional
                     metaDataInfo.gid = parseInt(geojson.features[i].properties.metaData.gidAparto);
                     crudFincasUserService.actualizarApartosPendientes(metaDataInfo).then(function (response) {
                     })
                 }
                else if(geojson.features[i].properties.metaData.isNew == true){
                     // si es un aparto nuevo inserte en la base de datos la informacion geografica y la informacion adicional
                    crudFincasUserService.insertarApartosPendientes(metaDataInfo).then(function (response) {
                     })
                }
            }
        }

        function validIfGeomChanged() {
            if(LS.getApartosFinca() != "false"){
                var apartosValidosFinca = LS.getApartosFinca();
                for(var i in mapService.getOverlays()){
                    for(var j in apartosValidosFinca){
                        if(mapService.getOverlays()[i].getMetaData().gidAparto == apartosValidosFinca[j].gid){
                            var actualMetaData = mapService.getOverlays()[i].getMetaData();
                                if(isGeomEqual(mapService.getOverlays()[i].getCoords(),JSON.parse(apartosValidosFinca[j].geom).coordinates[0]) || mapService.getOverlays()[i].getMetaData().idActividad == apartosValidosFinca[j].idactividad){ // check if geometry or activity was changed
                                    actualMetaData.GeomwasEdited = false;
                                    mapService.getOverlays()[i].setMetaData(actualMetaData);
                                }else {
                                    actualMetaData.GeomwasEdited = true;
                                    mapService.getOverlays()[i].setMetaData(actualMetaData);
                                }
                        }
                    }
                }
            }
        };
        
        function validGeomsHadMetaData() {
            var geojson = mapService.getGeoJson();
            for(var i in geojson.features){
                if(geojson.features[i].properties.metaData==null){
                    mapService.showAlert("Complete la informacion solicitada en los apartos","Aceptar",null);
                    return false
                }
            }
            return true
         }
        function sleep (time) {
            return new Promise((resolve) => setTimeout(resolve, time));
        }

        $scope.printCoords = function () {
            /*if(validGeomsHadMetaData()){*/
                validIfGeomChanged();
                insertApartsChangedOrNew();
                mapService.showLoader("Procesando cambios...",0.99,false,null);
                sleep(2000).then(function () {
                    mapService.hideLoader();
                });
            //}
        }

        function getApartosValidosFinca(idFinca,callback) {
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

        function getIdActividad (nombreActividad) {
            for(var i in $scope.actividades){
                if($scope.actividades[i].nombre == nombreActividad)
                    return $scope.actividades[i].idtipoactividad;
            }
        }

        $scope.agregarSolicitudAparto = function () {
            var actualMetaData = actualOverlay.getMetaData();
            actualMetaData.actividad = $scope.selectedActividad;
            actualMetaData.idtipoActividad = getIdActividad($scope.selectedActividad);
            actualMetaData.descripcion = $scope.descripcionAparto;
            actualMetaData.fechaCreacion =  new Date($scope.currentDate).getTime()
            if(actualMetaData.estado == 2 || actualMetaData.estado == 0){
                actualOverlay.setMetaData(actualMetaData)
            }else{
                actualMetaData.isNew = true
                actualOverlay.setMetaData(actualMetaData)
            }
            mapService.hidePanel();
            $scope.descripcionAparto = undefined;
        }

        function createDivElementWithDirective() {
            var div = document.createElement("div");
            div.style.width = "250px";
            div.style.height = "250px";
            div.setAttribute("newAparto","");
            mapService.showCustomPanel(div,false,function () {
                $compile(div)($scope);
            });
        };

         $scope.nuevoApartoCreadoListener = function(overlay,response) {
            actualOverlay = overlay;
            if(response == true){
                if(isEmpty(overlay.getMetaData())){ // validar que solo contenga el gid en el metadata
                    $scope.selectedActividad = undefined;
                    $scope.descripcionAparto = undefined;
                    $scope.currentDate = undefined;
                    createDivElementWithDirective();
                }
            }
        }

         function manageDrawFincaAndApartoInMap() {
            var geom = JSON.parse($scope.selectedFinca.geom);
            mapService.clearListenersAndWipeMap();
            if(JSON.parse($scope.selectedFinca.geom).type == "Polygon"){
                mapService.drawPropertyInUserView($scope.selectedFinca,geom.coordinates[0]);
            }else if(JSON.parse($scope.selectedFinca.geom).type == "MultiPolygon"){
                for (var g in geom.coordinates[0]) {
                    mapService.drawPropertyInUserView($scope.selectedFinca,geom.coordinates[0][g]);
                }
            }
            getApartosValidosFinca($scope.selectedFinca.gid,function (response) {
                if(response != "false"){
                    LS.setApartosFinca(response);
                    mapService.dibujarApartosFinca(response);
                }
                mapService.addListenerGeometryDraw(mapService.validAddedOverlay,$scope.nuevoApartoCreadoListener); // Agrega un listener al mapa cuando se dibujen nuevas geometrias;
            });
        };

        $scope.fincaIsSelectedFromCombo = function(){
            FormularioResolver.idFincaAResponder = $scope.selectedFinca.codigofinca;
            FormularioResolver.nombreFinca = $scope.selectedFinca.nombrefinca;
            $scope.showInfoFinca = !$scope.showInfoFinca;
            manageDrawFincaAndApartoInMap();
        };

    function getJsonObjectFromFile(file) {
        var reader = new FileReader();
        reader.onload = function(){
            // draw in the map
            drawGeometyInScribbleMap(JSON.parse(reader.result));
        };
        reader.readAsText(file);
    }

    function reverseLatitudeLong (coordsArray) {

        for (i in coordsArray){
            coordsArray[i] =  coordsArray[i].reverse();
        }
        return coordsArray;
    }

    
    function drawGeometyInScribbleMap(geoJson) {
        if(geoJson.features[0].geometry.type == "Polygon"){
            geoJson.features[0].geometry.coordinates[0] = reverseLatitudeLong( geoJson.features[0].geometry.coordinates[0]);
            $scope.sm.draw.poly(geoJson.features[0].geometry.coordinates[0],{
                fillOpacity: 0.3,
                fillColor: "#D8D8D8",
                lineColor: "#F3F781",
                editable: false
            }).setMetaData({idFinca:"hola"});
            $scope.sm.view.setCenter([geoJson.features[0].geometry.coordinates[0][0][0],geoJson.features[0].geometry.coordinates[0][0][1]]);
        }else if (geoJson.features[0].geometry.type == "LineString"){
            geoJson.features[0].geometry.coordinates = reverseLatitudeLong( geoJson.features[0].geometry.coordinates);
            $scope.sm.draw.line(geoJson.features[0].geometry.coordinates,{
                lineColor: "#F3F781"
            });
            $scope.sm.view.setCenter([geoJson.features[0].geometry.coordinates[0][0],geoJson.features[0].geometry.coordinates[0][1]]);
        }
    }

    $scope.uploadFile = function(){
        if($scope.myFile != undefined){
            var os =  getJsonObjectFromFile($scope.myFile);
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

    /*Henry*/


});
