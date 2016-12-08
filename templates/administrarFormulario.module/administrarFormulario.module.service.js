/**
 * Created by usuario on 21/6/2016.
 */
/**
 * Created by usuario on 21/6/2016.
 */

angular.module('AppPrueba')

    .service('AdministrarFormService', function($http,$q) {

        this.getPreguntas = function () {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('templates/formulario.module/formulario.module.db.php?action=loadPreguntas')
                .success(function (response) {
                    defered.resolve(response);
                });

            return promise;
        };

        this.getPreguntaById = function ($idpreg) {

            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('templates/administrarFormulario.module/administrarFormulario.module.db.php?action=getPreguntaById&idpreg='+ $idpreg)
                .success(function (response) {
                    defered.resolve(response);
                });

            return promise;
        };

        this.getOpcionesById = function ($idpreg) {

            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('templates/administrarFormulario.module/administrarFormulario.module.db.php?action=getOpcionesById&idpreg='+ $idpreg)
                .success(function (response) {
                    defered.resolve(response);
                });

            return promise;
        };

        this.editarOpcionById = function ($idopc,$opcion,$orden) {

            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('templates/administrarFormulario.module/administrarFormulario.module.db.php?action=editarOpcionById&idopc='+ $idopc +
                '&opcion='+$opcion +'&orden='+$orden)
                .success(function (response) {
                    defered.resolve(response);
                });

            return promise;
        };


        this.insertarOpcionByIdPreg = function ($idpreg,$orden,$opcion) {
            console.log($idpreg);
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('templates/administrarFormulario.module/administrarFormulario.module.db.php?action=insertarOpcionByIdPreg&idpreg='+ $idpreg+
                '&orden='+$orden+'&opcion='+$opcion )
                .success(function (response) {
                    defered.resolve(response);
                });

            return promise;
        };

        this.eliminarOpcionById = function ($idopc) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('templates/administrarFormulario.module/administrarFormulario.module.db.php?action=eliminarOpcionById&idopc='+ $idopc)
                .success(function (response) {
                    defered.resolve(response);
                });

            return promise;
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

        this.insertarPreguntas = function (titulo,enunciadopreg,categoria,tipo,fijo,requerido,mascara) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('templates/administrarFormulario.module/administrarFormulario.module.db.php?action=insertarPregunta&titulo='+
                titulo +'&enunciadopreg='+enunciadopreg+'&categoria='+categoria+'&tipo='+tipo+'&fijo='+fijo+
                '&requerido='+requerido+'&mascara='+mascara)
                .success(function(response) {
                    defered.resolve(response);
                });

            return promise;
        }


        this.insertarOpciones = function (orden,opcion) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('templates/administrarFormulario.module/administrarFormulario.module.db.php?action=insertarOpcion&orden='+
                    orden +'&opcion='+opcion)
                .success(function(response) {
                    defered.resolve(response);
                });

            return promise;
        }


        this.editarPregunta = function (idpreg,titulo,enunciadopreg,categoria,tipo,fijo,requerido,mascara) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('templates/administrarFormulario.module/administrarFormulario.module.db.php?action=editarPregunta&idpreg='+
            idpreg +'&titulo='+titulo +'&enunciadopreg='+enunciadopreg+'&categoria='+categoria+'&tipo='+tipo+'&fijo='+fijo+
                '&requerido='+requerido+'&mascara='+mascara)
                .success(function(response) {
                    defered.resolve(response);
                });

            return promise;
        }




    })

    //mantiene en actualización la finca selecccionada por el usuario para agregarle un formulario
    .service("InsertarFormularioFincaxForm",function () {
        this.idFincaxFormulario="";
        
    });