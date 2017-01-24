/**
 * Created by usuario on 18/1/2017.
 */
angular.module('AppPrueba')
    .controller('ValidarController', function ($scope,MostrarService,$state,ValidarService) {
        $scope.fincas = [];
        //PARA PODER DEVOLVERNOS
        $scope.gidFinca = "";
        // $scope.apartoGid = VerEditarFormServiceCodigoFincaAparto.gidAparto;
        $scope.codigofinca = "";
        $scope.apartoAtual = "";
        $scope.validarApartoInfo =[];


        $scope.dataFinca = {};
        $scope.heightpanel = screen.height - ((screen.height/3)+ (screen.height/9));
        $scope.heightListaPreg = $scope.heightpanel -(screen.height/9);
        // Se debe de obtener el id del usuario
        $scope.idUser=1;
        MostrarService.getFincas($scope.idUser).then(function (data) {
            $scope.fincas = data;
        });


        $scope.change = function(){

            MostrarService.previewValidar($scope.gidFinca).then(function (data) {
                $scope.numHistoricoActual = data.max;
                $scope.Max = data.max;
                reconvertJsonPolygon(data.finca,false);
            });

            //obtener idUsuario
            MostrarService.getFincasByID("1", $scope.gidFinca).then(function(data){
                $scope.dataFinca = data[0];
                console.log($scope.dataFinca);

                $scope.codigofinca = $scope.dataFinca["gid"];

                console.log("finca:" + $scope.codigofinca);
                ValidarService.getApartosAValidar($scope.codigofinca).then(function (apartoValidarInfo) {
                    console.log($scope.codigofinca);
                    console.log(apartoValidarInfo);
                    if(apartoValidarInfo != false && apartoValidarInfo != "false" && apartoValidarInfo != undefined && apartoValidarInfo != "") {
                        $scope.validarApartoInfo = apartoValidarInfo;
                    }
                    else {
                        $scope.validarApartoInfo = [];
                    }
                });
            });

        };


        $scope.json = [];
        function reconvertJsonPolygon(puntos,aparto) {
            var json = [];
            var points = '';

            for(var i = 0; i < puntos.length; i++) {
                for (var j = 0; j < puntos[i].puntos.length; j++) {
                    points += puntos[i].puntos[j].x + ',' + puntos[i].puntos[j].y + ' ';
                }
                json.push({gid:puntos[i].gid,puntos: points.slice(0, points.length-1)});
                points = '';
            }
            if(!aparto)
                $scope.json = json;
            else
                $scope.jsonSeleccionado=json;
        }


        $scope.gidAparto = "";
        $scope.jsonSeleccionado=[];
        $scope.unir = function(gid, coordenadas){


            $scope.apartoGid = gid;
            $scope.jsonSeleccionado =[];
            $scope.jsonSeleccionado.push({id:gid,puntos:coordenadas});

            console.log($scope.jsonSeleccionado);
            //obtener idUsuario
            MostrarService.getApartoByID($scope.apartoGid,$scope.gidFinca).then(function(data){
                $scope.dataAparto = data[0];
            });

            $scope.apartoAtual = true;
        };

        $scope.aceptarAparto = function (gid) {
            ValidarService.aceptarAparto(gid).then(function (data) {
                console.log(data);
            })
        };

        $scope.rechazarAparto = function (gid) {
            ValidarService.rechazarAparto(gid).then(function (data) {
                console.log(data);
            })
        };


        $scope.gotoForm = function(){

            $state.go("dashboard.formularioGanaderia");
        };
        //********************************************** Llamadas necesarias****************************************************
        $scope.change();


    });

