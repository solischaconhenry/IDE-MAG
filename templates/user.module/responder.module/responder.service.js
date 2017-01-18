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

        this.obtenerAllPreguntasWRespuestas = function (idform,idrespuesta) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('templates/user.module/responder.module/responder.logic.php?action=getPreguntasWRespuestas&idform='+idform+"&idrespuesta="+idrespuesta)
                .success(function(response) {

                    defered.resolve(response);
                });

            return promise;
        };



        this.obtenerFormulario = function (idform) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('templates/user.module/responder.module/responder.logic.php?action=getFormulario&idformulario='+idform)
                .success(function(response) {

                    defered.resolve(response);
                });

            return promise;
        };

        this.insertarRespuesta = function (idform,codigo,fecha) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('templates/user.module/responder.module/responder.logic.php?action=insertRespuesta&idform='+idform+'&codigo='+codigo+'&fecha='+fecha)
                .success(function(response) {

                    defered.resolve(response);
                });

            return promise;
        };

        /**
         * Busca obtener el ID de la respuesta insertada,  para poder insertar
         * @param idform
         * @param codigo
         * @param fecha
         * @return {*|d}
         */
        this.insertarRespuesta = function (idform,codigo,fecha) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('templates/user.module/responder.module/responder.logic.php?action=insertRespuesta&idform='+idform+'&codigo='+codigo+'&fecha='+fecha)
                .success(function(response) {

                    defered.resolve(response);
                });

            return promise;
        };

        /**
         * cuando se inserta una respuesta al formulario no se puede tomar la ultima insertada porque podría existir otra respeusta de alguién más
         * por tanto se debe buscar por el id del form, la fecha y hora y finca para estar seguros
         * @param idform id del formulario que se guardó una respuesta
         * @param codigo código de la finca a la que se esta asociada y se trabaja actualmente
         * @param fecha fecha y hora almacena, pero esta es en milisegundos
         * @return {d|*} retorna el id de la respuesta en BD
         */
        this.getRespuestaform = function (idform,codigo,fecha) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('templates/user.module/responder.module/responder.logic.php?action=getRespuestaForm&idform='+idform+'&codigo='+codigo+'&fecha='+fecha)
                .success(function(response) {
                    console.log(response);

                    defered.resolve(response);
                });

            return promise;
        };

        /**
         * Inserta la pregunta respondida por el usuario para luego generar estadisticas o mostrar las respuestas al admin
         * @param idresp se necesita el ID de la repuesta para relacionar pregunta repondida a cual form
         * @param idpreg ID de la pregunta respondida, para cuando tenga que ser respondida
         * @param valor valor o repuesta del user
         * @return {d|*} no retorna
         */
        this.insertResp_Preg = function (idresp,idpreg,valor) {
            console.log("asd: " + idresp +", " + idpreg + "," + valor);
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('templates/user.module/responder.module/responder.logic.php?action=insertResp_Preg&idresp='+idresp+'&idpreg='+idpreg+'&valor='+valor)
                .success(function(response) {
                    console.log(response);
                    defered.resolve(response);
                });

            return promise;
        };


        this.editarResp_Preg = function (idresp_preg,valor) {
            console.log("asd: " +idresp_preg + "," + valor);
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('templates/user.module/responder.module/responder.logic.php?action=editarResp_Preg&idresp_preg='+idresp_preg+'&valor='+valor)
                .success(function(response) {
                    console.log(response);
                    defered.resolve(response);
                });

            return promise;
        };


        this.insertRespOpcionesMulti = function (idresp,idpreg,valor) {
            console.log("asd: " + idresp + ", " + idpreg + "," + valor);
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('templates/user.module/responder.module/responder.logic.php?action=insertRespMultipleOpc&idresp=' + idresp + '&idpreg=' + idpreg + '&valor=' + valor)
                .success(function (response) {
                    console.log(response);
                    defered.resolve(response);
                });

            return promise;
        };

        //Servicio para el editar del administrador
        this.insertWIdRespOpcionesMulti = function (idresp_preg,valor) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('templates/user.module/responder.module/responder.logic.php?action=insertWIdRespOpcionesMulti&idresp_preg=' + idresp_preg +  '&valor=' + valor)
                .success(function (response) {
                    console.log(response);
                    defered.resolve(response);
                });

            return promise;
        };

        //Servicio para el editar del administrador
        this.eliminarRespOpcionesMulti = function (idresp_preg,valor) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('templates/user.module/responder.module/responder.logic.php?action=eliminarRespOpcionesMulti&idresp_preg=' + idresp_preg +  '&valor=' + valor)
                .success(function (response) {
                    console.log(response);
                    defered.resolve(response);
                });

            return promise;
        };



    });