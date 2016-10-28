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


        this.insertarPag = function (descripcion,orden) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('templates/formulario.module/formulario.module.db.php?action=insertarPag&descripcion='+descripcion
                    +'&orden='+ orden)
                .success(function(response) {
                    defered.resolve(response);
                });

            return promise;

        };

        this.insertarPreguntasForm = function (idform,idpreg,orden,pagina) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('templates/formulario.module/formulario.module.db.php?action=insertarPreguntasForm&idform='+idform
                    +'&idpreg='+idpreg +'&orden='+orden + '&pagina='+pagina)
                .success(function(response) {
                    defered.resolve(response);
                });

            return promise;

        };


    });