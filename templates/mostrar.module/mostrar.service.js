angular.module('AppPrueba')
.service('MostrarService', ['$http','$q', function ($http, $q,InsertarFormularioFincaxF) {

    this.getFincas = function (idUser) {
        var defered = $q.defer();
        var promise = defered.promise;

        $http.get('templates/mostrar.module/mostrar.logic.php?action=getFincasTodo&idUser='+idUser)
            .success(function(response) {
            defered.resolve(response);
        });

        return promise;
    };

    this.getCodigoFincaById = function (gid) {
        var defered = $q.defer();
        var promise = defered.promise;

        $http.get('templates/historicos.module/mostrar.logic.php?action=getCodigoFincaById&gid='+gid)
            .success(function(response) {
                defered.resolve(response);
            });

        return promise;
    };



    this.preview = function (gidFinca) {
        var defered = $q.defer();
        var promise = defered.promise;

        $http.get('templates/historicos.module/historicos.logic.php?action=preview&gidFinca='+gidFinca)
            .success(function(response) {
            defered.resolve(response);
        });

        return promise;
    }

    this.previewValidar = function (gidFinca) {
        var defered = $q.defer();
        var promise = defered.promise;

        $http.get('templates/historicos.module/historicos.logic.php?action=previewValidar&gidFinca='+gidFinca)
            .success(function(response) {
                defered.resolve(response);
            });

        return promise;
    }

    this.getFincasByID = function (idUser, idFinca) {
        var defered = $q.defer();
        var promise = defered.promise;

        $http.get('templates/mostrar.module/mostrar.logic.php?action=getFincasByID&idUser=' + idUser + '&gidFinca=' + idFinca)
            .success(function(response) {
            defered.resolve(response);
        });

        return promise;
    };

    this.getApartoByID = function (idAparto,idFinca) {
        var defered = $q.defer();
        var promise = defered.promise;
        console.log("asdad"+idAparto);
        $http.get('templates/mostrar.module/mostrar.logic.php?action=getApartoByID&gidAparto=' + idAparto+'&gidFinca=' + idFinca)
            .success(function(response) {
            defered.resolve(response);
        });

        return promise;
    };

    this.getGeomHistorico = function (gidFinca,numHistorico) {
        var defered = $q.defer();
        var promise = defered.promise;

        $http.get('templates/historicos.module/historicos.logic.php?action=history&gidFinca='+gidFinca+'&numHistorico='+numHistorico)
            .success(function(response) {
            defered.resolve(response);
        });

        return promise;
    }
    this.getHistAparto = function (gidAparto,anterior,gidFinca) {
        var defered = $q.defer();
        var promise = defered.promise;

        $http.get('templates/historicos.module/historicos.logic.php?action=histAparto&gidAparto='+gidAparto+'&anterior='+anterior+'&gidFinca='+gidFinca)
            .success(function(response) {
            defered.resolve(response);
        });

        return promise;
    }




    this.getFormulariosNoFinca = function (codigofinca,tipo) {
        var defered = $q.defer();
        var promise = defered.promise;

        $http.get('templates/formulario.module/formulario.module.db.php?action=getFormulariosNoFinca&codigofinca='+codigofinca+'&tipo='+tipo)
            .success(function(response) {
                defered.resolve(response);
            });

        return promise;
    }


    this.getFormulariosFinca = function (codigofinca,tipo) {
        var defered = $q.defer();
        var promise = defered.promise;

        $http.get('templates/formulario.module/formulario.module.db.php?action=getFormulariosFinca&codigofinca='+codigofinca+'&tipo='+tipo)
            .success(function(response) {
                defered.resolve(response);
            });

        return promise;
    }

    this.getFormulariosAparto = function (gid) {
        var defered = $q.defer();
        var promise = defered.promise;

        $http.get('templates/formulario.module/formulario.module.db.php?action=getFormulariosAparto&gid='+gid)
            .success(function(response) {
                defered.resolve(response);
            });

        return promise;
    }

    this.insertarFormFinca = function (idform,codigofinca) {
        var defered = $q.defer();
        var promise = defered.promise;

        $http.get('templates/formulario.module/formulario.module.db.php?action=insertarFormFinca&idform=' +idform +'&codigofinca='+codigofinca)
            .success(function(response) {
                defered.resolve(response);
            });

        return promise;
    }

    this.insertarFormAparto = function (idform,gid) {
        var defered = $q.defer();
        var promise = defered.promise;
        console.log("service");
        console.log(idform);
        console.log(gid);

        $http.get('templates/formulario.module/formulario.module.db.php?action=insertarFormAparto&idform=' +idform +'&gid='+gid)
            .success(function(response) {
                defered.resolve(response);
            });

        return promise;
    }

    this.eliminarForm = function (idform,idfincaaparto,tipo) {
        var defered = $q.defer();
        var promise = defered.promise;
        console.log("service");


        $http.get('templates/formulario.module/formulario.module.db.php?action=eliminarForm&idform=' +idform+'&idfincaaparto=' +idfincaaparto+'&tipo='+tipo)
            .success(function(response) {
                defered.resolve(response);
            });

        return promise;
    }




}]);
