/**
 * Created by usuario on 28/10/2016.
 */
angular.module('AppPrueba')
    .controller('dusTabsController', function ($scope,mapService,crudFincasAdminService) {

        $scope.nombreFinca = "";
        $scope.idUsuario = "";
        $scope.fecha ="";
        $scope.provincia = "";
        $scope.canton = "";
        $scope.distrito = "";
        $scope.direccionExacta ="";
        $scope.codigoFinca ="";
        $scope.telefono = "";
        
        $scope.guardarFinca = function () {
            var obj = {
                nombrefinca:$scope.nombreFinca,
                iduser:parseInt($scope.idUsuario),
                fecha:convertDate($scope.fecha),
                provincia:$scope.provincia,
                canton:$scope.canton,
                distrito:$scope.distrito,
                direccionexacta:$scope.direccionExacta,
                codigofinca:parseInt($scope.codigoFinca),
                telefono:parseInt($scope.telefono),
                geom:$scope.geom
            }
            console.log(obj);
            crudFincasAdminService.insertarFinca(obj).then(function (response) {
                //console.log(response);
                if(response.status == "success"){
                    mapService.showAlert("Se inserto correctamente","Aceptar",null);
                }else {
                    mapService.showAlert("Insercion fallida, intente de nuevo","Aceptar",null);
                }
            })
        };

        $scope.loadMap = function () {
            // visualizar la zona norte en un punto central
            var startCenter = [10.323345, -84.430494];
            // carga el mapa con las herramientas
            $scope.sm = mapService.loadMapWithTools(startCenter,["drag","edit"]);
        };

        function convertDate(inputFormat) {
            function pad(s) { return (s < 10) ? '0' + s : s; }
            var d = new Date(inputFormat);
            return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/');
        }

        function reverseLatitudeLong (coordsArray) {

            for (var i in coordsArray){
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

        function getJsonObjectFromFile(file) {
            var reader = new FileReader();
            reader.onload = function(){
                var temp = JSON.parse(reader.result);
                $scope.geom = JSON.stringify(temp.features[0].geometry);
                console.log($scope.geom);
                // draw in the map
                drawGeometyInScribbleMap(JSON.parse(reader.result));
            };
            reader.readAsText(file);
        }

        $scope.uploadFile = function(){
            if($scope.myFile != undefined){
                var os =  getJsonObjectFromFile($scope.myFile);
            }
        };

        $(".nav a").on("click", function(){
            $(".nav").find(".active").removeClass("active");
            $(this).parent().addClass("active");
        });
    });