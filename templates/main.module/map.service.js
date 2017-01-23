angular.module('AppPrueba')
    .service('mapService', function ($rootScope) {
        var sm = [];
        var property = [];
        var propertyStyle = {fillOpacity: 0.3, fillColor: "#2E9AFE", lineColor: "#FFFF00", weight: 5};
        var apartoValidoStyle = {lineColor: "#FFFFFF", weight: 3, fillColor: "#EB0812", fillOpacity: 0.3};
        var apartoPendienteStyle = {lineColor: "#FFFFFF", weight: 3, fillColor: "#f4d142", fillOpacity: 0.3};
        var legendStyle = [{name: "Área de Finca", style: propertyStyle},
            {name: "Aparto Válido", style: apartoValidoStyle},
            {name: "Aparto Pendiente", style: apartoPendienteStyle}
        ];
        var defaultStyle = apartoPendienteStyle;

        this.createInfoApartoTool = function (callback) {
            sm.ui.createTool({
                baseTool: "edit",
                id: "info",
                select: function () {
                    sm.map.addListener(scribblemaps.MapEvent.OVERLAY_CLICK,callback)
                },
                deselect: function (event) {
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
        };

        this.createUnionTool =function (callback) {
            sm.ui.createTool({
                baseTool: "edit",
                id: "union",
                select: function () {
                    sm.map.addListener(scribblemaps.MapEvent.OVERLAY_CLICK,callback)
                },
                deselect: function (event) {
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
        };
        
        this.createDivideTool = function (callback) {
            sm.ui.createTool({
                baseTool: "splitLine",
                id: "divide",
                select: function () {
                    sm.map.addListener(scribblemaps.MapEvent.OVERLAY_CLICK,callback)
                },
                deselect: function (event) {
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
        }

        this.showInfoWindow = function (message) {
            sm.map.openInfoWindow(
                sm.view.getCenter(), message, {lineColor: '#000000',
                    lineOpacity: 1,
                    fillColor: '#FFFFFF',
                    fillOpacity: 1,
                    weight: 2}, true
            );
        };

        this.showAlert = function (message,buttonText,triggerFunction) {
            sm.ui.showAlert(message,[buttonText],[triggerFunction])
        }

        this.showCustomPanel =function (htmlElement,enableMap,callback) {
            sm.ui.showCustomPanel(htmlElement,enableMap);
            callback()
        };

        this.setTool = function (tool) {
            sm.ui.setTool(tool);
        };

        this.closeInfoWindow =function () {
            sm.map.closeInfoWindow();
        };

        this.removeMapOverlayClickListener = function(callback){
            sm.map.removeListener(scribblemaps.MapEvent.OVERLAY_CLICK,callback);
        };
        
        this.hidePanel = function () {
            sm.ui.hidePanel()
        }
        
        this.setMapTools = function (avaiableTools) {
            sm.ui.setAvailableTools(avaiableTools)
        };
        
        this.getGeoJson = function () {
            return sm.data.getGeoJSON()
        };

        this.getOverlays = function(){
            return sm.map.getOverlays();
        };
        
        this.loadMapWithEditTools = function (startCenterCoords,avaibleTools) {
            sm = new scribblemaps.ScribbleMap('ScribbleMap', {
                searchControl: true,
                lineSettingsControl: false,
                mapTypeControl: true,
                fillColorControl: false,
                lineColorControl: false,
                zoomControl: true,
                tools: avaibleTools,
                defaultTool: "edit",
                startCenter: startCenterCoords/*[10.360414404, -84.5096459246]*/,
                startZoom: 17,
                startMapType: "hybrid",
                disableZoom: false
            });
            sm.draw.setStyle(apartoPendienteStyle);

            return sm;
        };

        this.validAddedOverlay = function (event,trig) {
            if (checkInsideProperty(event.data) == true && checkInsideOtherOverlay(event.data) == false){
                trig(event.data,true);
            }else {
                if(checkInsideProperty(event.data) == false){
                    event.data.remove();
                    sm.ui.showAlert("Los apartos solo pueden ubicarse en el area de la finca",
                        ["Aceptar"],
                        [null]);
                }else if(checkInsideOtherOverlay(event.data) == true){
                    event.data.remove();
                    sm.ui.showAlert("Las fincas solo pueden tener una capa de apartos",
                        ["Aceptar"],
                        [null]);
                }

                trig(event.data,false);
            }
        };


        this.addListenerGeometryDraw = function(triggerFunction,triggerFunction2) {
            sm.draw.setStyle(apartoPendienteStyle);
            sm.map.addListener(scribblemaps.MapEvent.OVERLAY_ADDED, function (event) {
                 triggerFunction(event,triggerFunction2);
            });

        };
        
        function checkInsideProperty(overlay) {
            return property.containsOverlay(overlay);
        };
        
        function checkInsideOtherOverlay(overlay) {
            var overlays = sm.map.getOverlays();
            for(var x = 1; x<overlays.length;x++){
                if(overlays[x].containsOverlay(overlay)){
                    return true;
                }
            }
            return false;
        };

        this.clearListenersAndWipeMap = function () {
            sm.settings.clearListeners();
            sm.map.wipe();
        };

        this.dibujarApartosFinca = function(apartosInfo){
            for(var i in apartosInfo){
                if(apartosInfo[i].estado == 2){
                    defaultStyle = apartoPendienteStyle
                }else {
                    defaultStyle = apartoValidoStyle
                }
                sm.draw.poly(JSON.parse(apartosInfo[i].geom).coordinates[0],defaultStyle)
                    .setMetaData({
                        actividad:apartosInfo[i].nombreactividad,
                        idtipoActividad:apartosInfo[i].idactividad,
                        descripcion:apartosInfo[i].descripcion,
                        fechaCreacion:apartosInfo[i].fecha,
                        estado:apartosInfo[i].estado,
                        gidAparto:apartosInfo[i].gid
                    });
            }
        };
        
        this.drawPropertyInUserView = function (propertyInfo,geom) {
            property = sm.draw.poly(geom,propertyStyle).disableEdit();
            property.setMetaData(propertyInfo);
            sm.view.setCenter(geom[0]);
            sm.view.setZoom(17);
            sm.ui.createLegend(legendStyle);
        }

    });