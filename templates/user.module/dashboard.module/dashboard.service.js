angular.module('AppPrueba')
    .service('GetUserInfo',function($http, $q, UserService){

        this.userInfo = function (userId) {
            var defered = $q.defer();
            var promise = defered.promise;
            $http.get('templates/user.module/dashboard.module/dashboard.logic.php?action=getUserInfo&userId='+ userId)
                .success(function(response) {

                    UserService.email = response[0];
                    UserService.telefono = response[1];
                    UserService.direccion = response[2];
                    UserService.ciudad = response[3];
                    UserService.nombre = response[4];
                    UserService.apellidos = response[5];

                    defered.resolve(true);
                });
            return promise;
        }

    })