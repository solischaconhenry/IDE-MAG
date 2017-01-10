/**
 * Created by Hellen Rojas Rojas on 09/01/2017.
 */

angular.module('AppPrueba')


    .controller('VerRespFormController', function ($scope, VerEditarFormService,VerRespFormService,ResponderService ) {
       $scope.idrespuesta = VerEditarFormService.idRespuesta;
        $scope.idform = "";


        VerRespFormService.getIdFormWIdResp($scope.idrespuesta).then(function (data) {
            $scope.idform = data[0].idform;
            ResponderService.obtenerFormulario($scope.idform).then(function (data2) {
                console.log(data2);
                var item = {
                    nombre: data2[0]["nombreform"],
                    descripcion: data2[0]["descripcion"],
                    fecha: data2[0]["fecha"]
                };
                $scope.DataForm = item;
                console.log($scope.DataForm);
            });
        });



    });

