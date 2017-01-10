/**
 * Created by Hellen Rojas Rojas on 09/01/2017.
 */
angular.module('AppPrueba')

    .service('VerRespFormService', function($http,$q) {

        this.getIdFormWIdResp = function (idrespuesta) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('templates/verRespForm.module/verRespForm.logic.php?action=getIdFormWIdResp&idrespuesta='+idrespuesta)
                .success(function (response) {
                    defered.resolve(response);
                });

            return promise;
        };


    })

    .service('VerEditarFormService', function() {
        this.idRespuesta = "";
    });
