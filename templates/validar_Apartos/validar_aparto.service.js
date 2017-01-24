/**
 * Created by usuario on 19/1/2017.
 */
angular.module('AppPrueba')
    .service('ValidarService', ['$http','$q', function ($http, $q,InsertarFormularioFincaxF) {

        this.getApartosAValidar = function (idfinca) {
            var defered = $q.defer();
            var promise = defered.promise;


            $http.get('templates/validar_Apartos/validar_aparto.logic.php?action=apartoValidar&finca=' +idfinca)
                .success(function(response) {
                    defered.resolve(response);
                });

            return promise;
        };

        this.aceptarAparto = function (idAparto) {
            var defered = $q.defer();
            var promise = defered.promise;


            $http.get('templates/validar_Apartos/validar_aparto.logic.php?action=aceptarAparto&idAparto=' +idAparto)
                .success(function(response) {
                    defered.resolve(response);
                });

            return promise;
        };

        this.rechazarAparto = function (idAparto) {
            var defered = $q.defer();
            var promise = defered.promise;


            $http.get('templates/validar_Apartos/validar_aparto.logic.php?action=rechazarAparto&idAparto=' +idAparto)
                .success(function(response) {
                    defered.resolve(response);
                });

            return promise;
        }





    }]);

