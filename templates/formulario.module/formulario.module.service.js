/**
 * Created by usuario on 21/6/2016.
 */
/**
 * Created by usuario on 21/6/2016.
 */

angular.module('AppPrueba')

    .service('FormulariosService', function($http,$q) {

        this.getPreguntas = function () {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('templates/formulario.module/formulario.module.db.php?action=loadPreguntas')
                .success(function (response) {
                    defered.resolve(response);
                });

            return promise;
        };

        this.getOpciones = function (idPreg) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('templates/formulario.module/formulario.module.db.php?action=loadOpciones&idPreg='+idPreg)
                .success(function (response) {
                    defered.resolve(response);
                });

            return promise;
        };



        //FUNCIONES DE INSERTAR
        this.insertarForm = function (nombre,descripcion,fecha) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('templates/formulario.module/formulario.module.db.php?action=insertarForm&nombre='+nombre
                +'&descripcion='+descripcion+'&fecha='+ fecha)
                .success(function(response) {
                    defered.resolve(response);
                });

            return promise;

        };


        this.insertarPag = function (descripcion,orden,callback) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('templates/formulario.module/formulario.module.db.php?action=insertarPag&descripcion='+descripcion
                    +'&orden='+ orden).success(function(response) {
                callback(response);
            });

            callback(false);

        };

        this.insertarPreguntasForm = function (idpreg,orden,callback) {
            $http.get('templates/formulario.module/formulario.module.db.php?action=insertarPreguntasForm&idpreg='+idpreg +'&orden='+orden)
                .success(function(response) {
                   // defered.resolve(response);
                    callback(response);
                });

            callback(false);

        };

        this.obtenerCategorias = function () {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('templates/formulario.module/formulario.module.db.php?action=loadCategorias')
                .success(function(response) {
                    defered.resolve(response);
                });

            return promise;
        }


    });