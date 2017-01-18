/**
 * Created by usuario on 17/1/2017.
 */
angular.module('AppPrueba')

    .service('HomeService', function($http,$q) {

        //obtiene las notificaciones y se las muestra al usuario
        this.getNotificacionesXDia = function () {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('templates/home.module/home_notificaciones.logic.php?action=loadNotifications')
                .success(function (response) {
                    defered.resolve(response);
                });

            return promise;
        };

        //borra las notificaciones que el usuario eliminó en la intefaz
        this.deleteNotificacion = function (id) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('templates/home.module/home_notificaciones.logic.php?action=deleteNotificacion&idN=' + id)
                .success(function (response) {
                    defered.resolve(response);
                });

            return promise;
        };

    });//fin service