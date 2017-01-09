angular.module('AppPrueba')
.controller('MostrarUserController', function ($scope,MostrarUserService,$state,UserService, FormularioResolver) {
    $scope.fincas = [];
    $scope.gidFinca = "";
    $scope.formActual = 0;
    $scope.apartoGid ="";
    $scope.apartoAtual = "";
    $scope.formularios = [];
    $scope.formulariosFincaAcual = [];
    $scope.idFinca = 0;


    //TODO: Un aparto puede tambien tener formularios relacionados, entonces hay que mostrarlos

    // Se debe de obtener el id del usuario
    $scope.idUser = UserService.username;
    MostrarUserService.getFincas($scope.idUser).then(function (data) {
        $scope.fincas = data;
    });

    $scope.change = function(){

        /**
         * Busca el con el código de la finca el ID de la finca para mostrarla
         * @Params: idUser: id de user relacionado con el usuario
         * @Params: gidFinca: Código de la finca
         * @Return: el id de la finca en BD para hacer el preview
         */
        MostrarUserService.getFincasByID($scope.idUser, $scope.gidFinca).then(function(data){

            console.warn(data[0].gid);
            $scope.idFinca = data[0].gid;

        });

        //muestra un preview de la finca, la carga de BD por los punto geom
        MostrarUserService.preview($scope.idFinca).then(function (data) {
            $scope.numHistoricoActual = data.max;
            $scope.Max = data.max;
            reconvertJsonPolygon(data.finca,false);
        });

        $scope.actualizarlistaForm();


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
        console.log(gid);
        $scope.apartoGid = gid;
        $scope.jsonSeleccionado =[];
        $scope.jsonSeleccionado.push({id:gid,puntos:coordenadas});

        console.log($scope.jsonSeleccionado);
        //obtener idUsuario
        MostrarUserService.getApartoByID($scope.apartoGid).then(function(data){
          $scope.dataAparto = data[0];
          console.log(data);
        });

        $scope.apartoAtual = true;
    };

    $scope.gotoForm = function(){

        $state.go("dashboard.formularioGanaderia");
    };

    /**
     * Trae los formularios relacionados a una finca y usuario
     */
    $scope.actualizarlistaForm = function () {

        MostrarUserService.getFormulariosFinca($scope.gidFinca).then(function (data) {
            console.log(data);
            if(data != "false") {
                $scope.formulariosFincaAcual = data;
            }
            else {
                $scope.formulariosFincaAcual = [];
            }


        });
    };

    //CAMBIA EL ESTADO AL FORMULARIO SELECCIONADO PARA RESPONDERLO
    $scope.chooseForm = function(idform){
        console.info(idform);
        FormularioResolver.idFormularioResolver = idform;
        $state.go("dashboardUser.crudFincas.responderForm")
    }

});
