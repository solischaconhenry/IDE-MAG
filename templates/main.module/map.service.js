
angular.module('AppPrueba')
    .service('mapService', function () {
        var sm = [];
        var finca = [];
        var nuevosApartos = [];

        this.loadMapWithEditTools = function (startCenterCoords) {
            sm = new scribblemaps.ScribbleMap('ScribbleMap', {
                searchControl: true,
                lineSettingsControl: false,
                mapTypeControl: true,
                fillColorControl: false,
                lineColorControl: false,
                zoomControl: true,
                tools: ["edit", "drag", "eraser", "lineSnap", "rectangle", "circle",
                    "polygon", "label"],
                defaultTool: "drag",
                startCenter: startCenterCoords/*[10.360414404, -84.5096459246]*/,
                startZoom: 17,
                startMapType: "hybrid",
                disableZoom: false
            });
            return sm;
        }
        
        this.dibujarFinca = function (geom) {
            sm.settings.clearListeners();
            sm.map.wipe();
            finca = sm.draw.poly(geom,{
                fillOpacity: 0.3,
                fillColor: "#D8D8D8",
                lineColor: "#F3F781"
            }).disableEdit();
            sm.view.setCenter(geom[0]);
            sm.view.setZoom(17);
            sm.map.addListener(scribblemaps.MapEvent.OVERLAY_ADDED, function (event) {
                var overlay = event.data;
                if(finca.containsOverlay(overlay)==false){
                    overlay.remove()
                    sm.ui.showAlert("Los apartos solo se pueden crear en el area de la finca",
                        ["Aceptar"],
                        [function () {  }]);
                }else{
                    nuevosApartos.push(overlay);
                    console.log(overlay);
                }
            });
        }

    });