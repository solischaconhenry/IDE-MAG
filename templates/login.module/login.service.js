'use strict';

angular.module('AppPrueba')
    .service('UserService',function(){
        var th = this;
        th.username = '';
        th.auth = false;
        th.tipo = '';
        th.apellidos = '';
        th.ciudad = '';
        th.nombre = '';
        th.direccion = '';
        th.email = '';
        th.telefono = '';
    })

    .service('LoginService', function ($http, $q) {
        //comprobar user y pass
        this.loginS = function (user, passwordR) {
            var defered = $q.defer();
            var promise = defered.promise;
            console.log(user);
            $http.get('templates/login.module/login.php?action=getPass&username='+ user)
                .success(function(response) {
                    
                    var pass = response[0].contrasena;
                    var tipo = response[0].tipo;
                    
                    if(pass === passwordR){
                        defered.resolve(tipo);
                    }
                    else{
                        defered.resolve('error');
                    }

                });

            return promise;
        }
        
    });
