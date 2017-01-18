/**
 * Created by usuario on 17/1/2017.
 */
angular.module('AppPrueba')

    .controller('HomeController', function ($scope, $state, HomeService) {

        $scope.notificaciones = [];
        $scope.num_notificaciones = 0;


        //obtiene las notificaciones del día utilizando milisengundos, por ello se obtiene 3
        HomeService.getNotificacionesXDia().then(function (data) {
            console.log(data);
            $scope.notificaciones = data;
            $scope.num_notificaciones = data.length;
        });//fin getNotificacionesXdDia

        //envía el ID de la notifacion para que sea borrada de la BD y dar a entender que ya fue resuelta o descartada, así
        //evita la notificación inncesaria a otros admin
        $scope.deleteNotificacion = function (id) {
            //console.info("borra");
            eliminarNotificacionLista(id);
            HomeService.deleteNotificacion(id).then(function (err) {
                //console.log(err)
            });
        };//fin deleteNotificaciones

        //eliminar notificacion de la lista
        function eliminarNotificacionLista (id) {
            if($scope.notificaciones == null){
                $scope.notificaciones =[];
            }
            var index = $scope.notificaciones.map(function(d) { return d["idnotificacion"]; }).indexOf(id);

            //console.log(index);
            $scope.notificaciones.splice(index,1);

        };

    });//fin controller
