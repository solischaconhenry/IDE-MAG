
angular.module('AppPrueba')
    .service('mapService', function ($rootScope) {
        var sm = [];
        var property = [];
        var apartsAdded = [];
        var isValidApart = [];
        var propertyStyle = {fillOpacity: 0.5, fillColor: "#2E9AFE", lineColor: "#FFFF00", weight: 5};
        var apartoValidoStyle = {lineColor: "#FFFFFF", weight: 3, fillColor: "#EB0812", fillOpacity: 0.3};
        var apartoPendienteStyle = {lineColor: "#FFFFFF", weight: 3, fillColor: "#f4d142", fillOpacity: 0.5};
        var legendStyle = [{name: "Área de Finca", style: propertyStyle},
            {name: "Aparto Válido", style: apartoValidoStyle},
            {name: "Aparto Pendiente", style: apartoPendienteStyle},
        ];

        this.avaibleTools = ["edit", "drag", "eraser", "lineSnap", "rectangle", "circle",
            "polygon"];


        this.loadMapWithEditTools = function (startCenterCoords) {
            sm = new scribblemaps.ScribbleMap('ScribbleMap', {
                searchControl: true,
                lineSettingsControl: false,
                mapTypeControl: true,
                fillColorControl: false,
                lineColorControl: false,
                zoomControl: true,
                tools: this.avaibleTools,
                defaultTool: "edit",
                startCenter: startCenterCoords/*[10.360414404, -84.5096459246]*/,
                startZoom: 17,
                startMapType: "hybrid",
                disableZoom: false
            });

            return sm;
        };

        this.validAddedOverlay = function (event,trig) {
            if (checkInsideProperty(event.data) == true && checkInsideOtherOverlay(event.data) == false){
                apartsAdded.push(event.data);
                trig(event.data,true);
            }else {
                if(checkInsideProperty(event.data) == false){
                    //event.data.remove();
                    showAlert("Los apartos solo pueden ubicarse en el area de la finca","Aceptar",null);
                }else if(checkInsideOtherOverlay(event.data) == true){
                    //event.data.remove();
                    showAlert("Las fincas solo pueden tener una capa de apartos","Aceptar",null);
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

        function showAlert(message,buttonText,triggerAction){
            sm.ui.showAlert(message,
                [buttonText],
                [triggerAction]);
        };
        
        function checkInsideProperty(overlay) {
            return property.containsOverlay(overlay);
        };
        
        function checkInsideOtherOverlay(overlay) {
            if(apartsAdded == null){
                return false;
            }else {
                for(x in apartsAdded){
                    if(apartsAdded[x].containsOverlay(overlay)){
                        return true;
                    }
                }
            }
            return false;
        };

        this.clearListenersAndWipeMap = function () {
            sm.settings.clearListeners();
            sm.map.wipe();
        };

        this.dibujarApartosValidosFinca = function(apartosInfo){
            for(i in apartosInfo){
                sm.draw.poly(JSON.parse(apartosInfo[i].geom).coordinates[0],apartoValidoStyle)
                    .setMetaData({
                        actividad:null,
                        idtipoActividad:apartosInfo[i].idactividad,
                        descripcion:null,
                        fechaCreacion:apartosInfo[i].fecha
                    });
            }
        };
        
        this.drawPropertyInUserView = function (propertyInfo,geom) {
            property = sm.draw.poly(geom,propertyStyle).disableEdit();
            property.setMetaData(propertyInfo);
            sm.view.setCenter(geom[0]);
            sm.view.setZoom(17);
            sm.ui.createLegend(legendStyle);





            // function hitme() {
            //     alert("hola que hace");
            // }
            //
            // var div = document.createElement("div");
            // div.style.width = "250px";
            // div.style.height = "250px";
            // var input  = document.createElement("button");
            // input.setAttribute("type","button");
            // input.setAttribute("value","hitme");
            // input.addEventListener("click", hitme, false);
            // input.innerHTML = 'test value';
            // div.appendChild(input)
            //
            //
            // sm.ui.showCustomPanel(div,true);


        }

    });