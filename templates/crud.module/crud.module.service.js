/**
 * Created by usuario on 21/6/2016.
 */
/**
 * Created by usuario on 21/6/2016.
 */

angular.module('AppPrueba')

    .service('CrudFormulariosService', function($http,$q,EditarFormularioFincaxForm,$timeout) {

        this.getPreguntas = function () {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('templates/crud.module/crud.module.db.php?action=loadPreguntas')
                .success(function (response) {
                    defered.resolve(response);
                });

            return promise;
        };

        this.getOpciones = function (idPreg) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('templates/crud.module/crud.module.db.php?action=loadOpciones&idPreg='+idPreg)
                .success(function (response) {
                    defered.resolve(response);
                });

            return promise;
        };



        //FUNCIONES DE INSERTAR
        this.insertarForm = function (nombre,descripcion,fecha) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('templates/crud.module/crud.module.db.php?action=insertarForm&nombre='+nombre
                    +'&descripcion='+descripcion+'&fecha='+ fecha)
                .success(function(response) {
                    defered.resolve(response);
                });

            return promise;

        };


        this.insertarPag = function (descripcion,orden,preguntas) {
            /*var defered = $q.defer();
            var promise = defered.promise;
            console.log("desp: " + descripcion +", orden: "+ orden);

            $http.get('templates/crud.module/crud.module.db.php?action=insertarPag&descripcion='+descripcion +'&orden='+ orden)
                .success(function(response) {

                    defered.resolve(true);

                });

            return promise;*/

            console.log("desp: " + descripcion +", orden: "+ orden);

            $http.get('templates/crud.module/crud.module.db.php?action=insertarPag&descripcion='+descripcion +'&orden='+ orden);
            console.info("insertó pag");
            $timeout(function () {
                console.info("pas1");
                for(var i = 0; i<preguntas.length; i++){
                    console.info("pass");
                    $http.get('templates/crud.module/crud.module.db.php?action=insertarPregNuevaPag&idpreg='+preguntas[i] +'&orden='+0+'&idform='+ EditarFormularioFincaxForm.idFormularioEditar);
                    console.info("insertó preg_pag");
                }
            }, 2000);

        };

        this.insertarPreguntasForm = function (idpreg,orden,idform,idpag,callback) {
            $http.get('templates/crud.module/crud.module.db.php?action=insertarPreguntasForm&idpreg='+idpreg +'&orden='+orden+'&idform='+idform+'&idpag='+idpag)
                .success(function(response) {
                    // defered.resolve(response);
                    callback(response);
                });

            callback(false);

        };

        this.obtenerCategorias = function () {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('templates/crud.module/crud.module.db.php?action=loadCategorias')
                .success(function(response) {
                    defered.resolve(response);
                });

            return promise;
        };

        this.obtenerPaginasByID = function (idform) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('templates/crud.module/crud.module.db.php?action=getPaginas&idform='+idform)
                .success(function(response) {

                    defered.resolve(response);
                });

            return promise;
        };

        this.obtenerAllPreguntas = function (idform) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('templates/crud.module/crud.module.db.php?action=getPreguntas&idform='+idform)
                .success(function(response) {

                    defered.resolve(response);
                });

            return promise;
        };

        this.deletePregunta = function (idpag, idpreg) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('templates/crud.module/crud.module.db.php?action=deletePreguntas&idpag='+idpag+'&idpreg='+idpreg)
                .success(function(response) {

                    defered.resolve(response);
                });

            return promise;
        };

        this.insertarPregNuevaPag = function (idpreg,orden,idform) {
            var defered = $q.defer();
            var promise = defered.promise;
            $http.get('templates/crud.module/crud.module.db.php?action=insertarPregNuevaPag&idpreg='+idpreg +'&orden='+orden+'&idform='+ idform)
                .success(function(response) {

                    console.log("idpreg: " + idpreg +", orden: "+ orden + ", form: " + idform);
                    defered.resolve(response);

                });

            return promise;

        };

        this.deletePagina = function (idpag) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('templates/crud.module/crud.module.db.php?action=deletePaginas&idpag='+idpag)
                .success(function(response) {

                    defered.resolve(response);
                });

            return promise;
        };

        this.updateOrdenPagina = function (idpag, orden) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('templates/crud.module/crud.module.db.php?action=updateOrdenPag&idpag='+idpag +'&ordenN='+orden)
                .success(function(response) {

                    defered.resolve(response);
                });

            return promise;
        };


    })

    //mantiene en actualización la finca selecccionada por el usuario para agregarle un formulario
    .service("EditarFormularioFincaxForm",function () {
        this.idFormularioEditar="";

    })

    //mantiene respaldo cargado de formular
    .service("RespaldoFormulario",function () {
        this.respaldoForm="";

    });