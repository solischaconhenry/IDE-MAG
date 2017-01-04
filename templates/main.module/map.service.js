
angular.module('AppPrueba')
    .service('mapService', function () {

        var sm = [];

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
            sm.map.wipe();
            sm.draw.poly(geom,{
                fillOpacity: 0.3,
                fillColor: "#D8D8D8",
                lineColor: "#F3F781"
            }).disableEdit();
            sm.view.setCenter(geom[0]);
            sm.view.setZoom(17);
        }
    });