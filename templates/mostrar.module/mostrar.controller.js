angular.module('AppPrueba')
angular.module('AppPrueba')
.controller('MostrarController', function ($scope,MostrarService,$state,VerEditarFormServiceCodigoFincaAparto,InsertarFormularioFincaxForm) {
    $scope.fincas = [];
    //PARA PODER DEVOLVERNOS
    $scope.gidFinca = VerEditarFormServiceCodigoFincaAparto.gidFinca;
   // $scope.apartoGid = VerEditarFormServiceCodigoFincaAparto.gidAparto;
    $scope.codigofinca = VerEditarFormServiceCodigoFincaAparto.codigofincaaparto;

    $scope.formActual = 0;
    $scope.apartoAtual = "";
    $scope.formularios = [];
    $scope.formulariosFincaAcual = [];
    $scope.respuestasFormActual = [];



    $scope.dataFinca = {};
    $scope.heightpanel = screen.height - ((screen.height/3)+ (screen.height/9));
    $scope.heightListaPreg = $scope.heightpanel -(screen.height/9);
    // Se debe de obtener el id del usuario
    $scope.idUser=1;
    MostrarService.getFincas($scope.idUser).then(function (data) {
        $scope.fincas = data;
    });


    $scope.change = function(){

        MostrarService.preview($scope.gidFinca).then(function (data) {
            $scope.numHistoricoActual = data.max;
            $scope.Max = data.max;
            reconvertJsonPolygon(data.finca,false);
        });

        //obtener idUsuario
        MostrarService.getFincasByID("1", $scope.gidFinca).then(function(data){
                     $scope.dataFinca = data[0];
            console.log($scope.dataFinca);

            $scope.codigofinca = $scope.dataFinca.codigofinca;

            //Para enviar al mostrarRespuesta el tipo
            VerEditarFormServiceCodigoFincaAparto.codigofincaaparto = $scope.codigofinca;
            VerEditarFormServiceCodigoFincaAparto.tipo = "finca";
            VerEditarFormServiceCodigoFincaAparto.gidFinca = $scope.gidFinca;

            //Para enviar  a la vista de mostrar
            InsertarFormularioFincaxForm.idFincaxFormulario = $scope.gidFinca;
            // Aqui se actializa la lista de formularios disponibles para la finca seleccionada
            $scope.actualizarlistaForm();
            $scope.apartoAtual = false;

        });
    };
    $scope.anadirFormFinca = function () {

        if($scope.formActual == undefined || $scope.formActual == "")
        {

        }
        else {
            MostrarService.insertarFormFinca($scope.formActual, $scope.codigofinca).then(function (data) {
                console.log(data)
            });
            $scope.formActual = "";

            $scope.actualizarlistaForm();
        }
    }

    $scope.anadirFormAparto = function () { //funciona bien

        if($scope.formActualAparto == undefined || $scope.formActualAparto == "")
        {

        }
        else {
            MostrarService.insertarFormAparto($scope.formActualAparto,$scope.apartoGid).then(function (data) {
            });
            $scope.formActualAparto = "";
            $scope.actualizarlistaFormAparto();
        }
    }

    $scope.actualizarlistaForm = function () {

        MostrarService.getFormulariosFinca($scope.dataFinca.codigofinca,"finca").then(function (data) {
            console.log(data);
            if(data != "false") {
                $scope.formulariosFincaAcual = data;
            }
            else {
                $scope.formulariosFincaAcual = [];
            }


        });
        //Aqui se actializa la lista de formularios ya añadidos a la finca
        MostrarService.getFormulariosNoFinca($scope.dataFinca.codigofinca,"finca").then(function (data) {
            $scope.formularios = data;
            // console.log($scope.formularios);
        });
    }



    $scope.actualizarlistaFormAparto = function () {

        MostrarService.getFormulariosFinca($scope.apartoGid,"aparto").then(function (data) {
            console.log(data);
            if(data != "false") {
                $scope.formulariosApartoActual = data;
            }
            else {
                $scope.formulariosApartoActual = [];
            }


        });
        //Aqui se actualiza la lista de formularios ya añadidos aL aparto
        MostrarService.getFormulariosNoFinca($scope.apartoGid,"aparto").then(function (data) {
            $scope.formularios = data;
        });
    }



    $scope.formActualFunc = function (elem) {
        $scope.respActual = JSON.parse(elem);
    }
    $scope.formActualFuncAparto = function(elem){
        $scope.respActualAparto =  JSON.parse(elem);
    }


    $scope.mostrarRespuestasForm = function () {
        if ($scope.respActual.idrespuesta!= "" )
        {

            VerEditarFormServiceCodigoFincaAparto.gidAparto = "";
            VerEditarFormServiceCodigoFincaAparto.respuesta = $scope.respActual;
            VerEditarFormServiceCodigoFincaAparto.nombrefinca = $scope.dataFinca.nombrefinca;
            VerEditarFormServiceCodigoFincaAparto.nombrepropietario = $scope.dataFinca.nombreprop;
            VerEditarFormServiceCodigoFincaAparto.apellidosPropietario = $scope.dataFinca.apellidos;
            $state.go('dashboard.verRespForm');
        }


    }

    $scope.mostrarRespuestasFormAparto = function () {
        if ($scope.respActualAparto!= "" )
        {

            VerEditarFormServiceCodigoFincaAparto.respuesta = $scope.respActualAparto;
            VerEditarFormServiceCodigoFincaAparto.nombrefinca = $scope.dataFinca.nombrefinca;
            VerEditarFormServiceCodigoFincaAparto.nombrepropietario = $scope.dataFinca.nombreprop;
            VerEditarFormServiceCodigoFincaAparto.apellidosPropietario = $scope.dataFinca.apellidos;
            $state.go('dashboard.verRespForm');
        }


    }





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

        VerEditarFormServiceCodigoFincaAparto.codigofincaaparto = gid;
        VerEditarFormServiceCodigoFincaAparto.tipo = "aparto";
        VerEditarFormServiceCodigoFincaAparto.gidAparto = gid;
        console.log(gid);
        $scope.apartoGid = gid;
        $scope.jsonSeleccionado =[];
        $scope.jsonSeleccionado.push({id:gid,puntos:coordenadas});

        console.log($scope.jsonSeleccionado);
        //obtener idUsuario
        MostrarService.getApartoByID($scope.apartoGid,$scope.gidFinca).then(function(data){
          $scope.dataAparto = data[0];
            $scope.actualizarlistaFormAparto();
        });

        $scope.apartoAtual = true;
    };

    $scope.gotoForm = function(){

        $state.go("dashboard.formularioGanaderia");
    }

    //********************************************** Llamadas necesarias****************************************************
    $scope.change();




});
