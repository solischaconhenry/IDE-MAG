/**
 * Created by usuario on 17/12/2016.
 */

angular.module('AppPrueba')

    .service('ResponderService', function($http,$q,EditarFormularioFincaxForm,$timeout) {

        this.getPreguntas = function () {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('templates/user.module/responder.module/responder.logic.php?action=loadPreguntas')
                .success(function (response) {
                    defered.resolve(response);
                });

            return promise;
        };

        this.getOpciones = function (idPreg) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('templates/user.module/responder.module/responder.logic.php?action=loadOpciones&idPreg='+idPreg)
                .success(function (response) {
                    defered.resolve(response);
                });

            return promise;
        };


        this.obtenerCategorias = function () {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('templates/user.module/responder.module/responder.logic.php?action=loadCategorias')
                .success(function(response) {
                    defered.resolve(response);
                });

            return promise;
        };

        this.obtenerPaginasByID = function (idform) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('templates/user.module/responder.module/responder.logic.php?action=getPaginas&idform='+idform)
                .success(function(response) {

                    defered.resolve(response);
                });

            return promise;
        };

        this.obtenerAllPreguntas = function (idform) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('templates/user.module/responder.module/responder.logic.php?action=getPreguntas&idform='+idform)
                .success(function(response) {

                    defered.resolve(response);
                });

            return promise;
        };



    });