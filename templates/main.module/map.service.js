
angular.module('AppPrueba')
    .service('mapService', function () {
        var sm = [];
        var property = [];
        var apartsAdded = [];
        var propertyStyle = {fillOpacity: 0.5, fillColor: "#2E9AFE", lineColor: "#FFFF00", weight: 5};
        var apartoStyle = {lineColor: "#FFFFFF", weight: 3,fillColor: "#EB0812", fillOpacity: 0.3};
        var legendStyle = [  {name: "Finca", style: propertyStyle},
                            {name: "Apartos", style: apartoStyle}
                        ];

        this.loadMapWithEditTools = function (startCenterCoords) {
            sm = new scribblemaps.ScribbleMap('ScribbleMap', {
                searchControl: true,
                lineSettingsControl: false,
                mapTypeControl: true,
                fillColorControl: false,
                lineColorControl: false,
                zoomControl: true,
                tools: ["edit", "drag", "eraser", "lineSnap", "rectangle", "circle",
                    "polygon"],
                defaultTool: "edit",
                startCenter: startCenterCoords/*[10.360414404, -84.5096459246]*/,
                startZoom: 17,
                startMapType: "hybrid",
                disableZoom: false
            });

            return sm;
        };

        function validAddedOverlay(event) {
            if (checkInsideProperty(event.data) == true && checkInsideOtherOverlay(event.data) == false){
                apartsAdded.push(event.data);
                return true;
            }else {
                if(checkInsideProperty(event.data) == false){
                    event.data.remove();
                    showAlert("Los apartos solo pueden ubicarse en el area de la finca","Aceptar",null);
                }else if(checkInsideOtherOverlay(event.data) == true){
                    event.data.remove();
                    showAlert("Las fincas solo pueden tener una capa de apartos","Aceptar",null);
                }
                return false;
            }
        };

        function addListenerGeometryDraw(triggerFunction) {
            sm.draw.setStyle(apartoStyle);
            sm.map.addListener(scribblemaps.MapEvent.OVERLAY_ADDED, function (event) {
                if(triggerFunction(event)){
                    
                    // function hitme() {
                    //     alert(":v");
                    // }
                    //
                    // var div = document.createElement("div");
                    // div.style.width = "250px";
                    // div.style.height = "250px";
                    // div.setAttribute("class","row");
                    // var otherdiv = document.createElement("div");
                    // div.setAttribute("class","col-xs-12");
                    // div.appendChild(otherdiv);
                    //
                    // var input  = document.createElement("button");
                    // input.setAttribute("class","col-xs-12 btn btn-danger");
                    // input.setAttribute("type","button");
                    // input.setAttribute("value","hitme");
                    // input.addEventListener("click", hitme, false);
                    // input.innerHTML = 'test value';
                    // otherdiv.appendChild(input)
                    //
                    //
                    // sm.ui.showCustomPanel(div,true);
                }
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
        
        this.dibujarFinca = function (propertyInfo,geom) {
            sm.settings.clearListeners();
            sm.map.wipe();
            property = sm.draw.poly(geom,propertyStyle).disableEdit();
            property.setMetaData(propertyInfo);
            sm.view.setCenter(geom[0]);
            sm.view.setZoom(17);
            sm.ui.createLegend(legendStyle);
            addListenerGeometryDraw(validAddedOverlay);





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