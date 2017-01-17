angular.module('AppPrueba')
    .service('MostrarUserService', ['$http','$q', function ($http, $q,InsertarFormularioFincaxF) {

        this.getFincas = function (idUser) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('templates/user.module/mostrar.module/mostrar.logic.php?action=getFincas&idUser='+idUser)
                .success(function(response) {
                    defered.resolve(response);
                });

            return promise;
        };

        this.getCodigoFincaById = function (gid) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('templates/user.module/mostrar.module/mostrar.logic.php?action=getCodigoFincaById&gid='+gid)
                .success(function(response) {
                    defered.resolve(response);
                });

            return promise;
        };



        this.preview = function (gidFinca) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('templates/user.module/mostrar.module/mostrar.logic.php?action=preview&gidFinca='+gidFinca)
                .success(function(response) {
                    defered.resolve(response);
                });

            return promise;
        };

        this.getFincasByID = function (idUser, codigoFinca) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('templates/user.module/mostrar.module/mostrar.logic.php?action=getFincasByID&idUser=' + idUser + '&gidFinca=' + codigoFinca)
                .success(function(response) {
                    defered.resolve(response);
                });

            return promise;
        };

        this.getApartoByID = function (idAparto) {
            var defered = $q.defer();
            var promise = defered.promise;
            console.log("asdad"+idAparto);
            $http.get('templates/user.module/mostrar.module/mostrar.logic.php?action=getApartoByID&gidAparto=' + idAparto)
                .success(function(response) {
                    defered.resolve(response);
                });

            return promise;
        };

        this.getGeomHistorico = function (gidFinca,numHistorico) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('templates/user.module/mostrar.module/mostrar.logic.php?action=history&gidFinca='+gidFinca+'&numHistorico='+numHistorico)
                .success(function(response) {
                    defered.resolve(response);
                });

            return promise;
        };
        this.getHistAparto = function (gidAparto,anterior,gidFinca) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('templates/user.module/mostrar.module/mostrar.logic.php?action=histAparto&gidAparto='+gidAparto+'&anterior='+anterior+'&gidFinca='+gidFinca)
                .success(function(response) {
                    defered.resolve(response);
                });

            return promise;
        };




        this.getFormulariosNoFinca = function (codigofinca) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('templates/formulario.module/formulario.module.db.php?action=getFormulariosNoFinca&codigofinca='+codigofinca)
                .success(function(response) {
                    defered.resolve(response);
                });

            return promise;
        };

        this.getFormulariosFinca = function (codigofinca) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('templates/formulario.module/formulario.module.db.php?action=getFormulariosFinca&codigofinca='+codigofinca)
                .success(function(response) {
                    defered.resolve(response);
                });

            return promise;
        };

        this.getFormulariosAparto = function (codigoaparto) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('templates/formulario.module/formulario.module.db.php?action=getFormulariosAparto&codigoaparto='+codigoaparto)
                .success(function(response) {
                    defered.resolve(response);
                });

            return promise;
        };
    }])

    .service('FormularioResolver', function () {
        this.idFormularioResolver = "";
        this.idFincaAResponder ="";
        this.idApartoAResponder = "";
    });
