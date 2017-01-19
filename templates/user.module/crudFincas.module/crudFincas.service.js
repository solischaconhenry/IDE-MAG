angular.module('AppPrueba')
.service('crudFincasUserService', ['$http','$q', function ($http, $q) {

    this.getFincas = function (idUser) {
        var defered = $q.defer();
        var promise = defered.promise;

        $http.get('templates/user.module/crudFincas.module/crudFincas.logic.php?action=getFincas&idUser='+idUser)
            .success(function(response) {            
            defered.resolve(response);
        });
        return promise;
    };

    this.getTipoActividad = function () {
        var defered = $q.defer();
        var promise = defered.promise;

        $http.get('templates/user.module/crudFincas.module/crudFincas.logic.php?action=getTipoActividad')
            .success(function(response) {
                defered.resolve(response);
            });
        return promise;
    };

    this.getApartosValidosFinca = function (idFinca) {
        var defered = $q.defer();
        var promise = defered.promise;

        $http.get('templates/user.module/crudFincas.module/crudFincas.logic.php?action=getApartosValidosFinca&idFinca='+idFinca)
            .success(function(response) {
                defered.resolve(response);
            });
        return promise;
    };

    this.insertarApartosPendientes = function (infoAparto) {
        var geojson = infoAparto.geom.replace(/'/g, '"');
        var defered = $q.defer();
        var promise = defered.promise;

        $http.get('templates/user.module/crudFincas.module/crudFincas.logic.php?action=insertarApartoPendiente&gidFinca='+infoAparto.gid+'&geom='+geojson+'&fecha='+infoAparto.fecha+'&idactividad='+infoAparto.idActividad+'&descripcion='+infoAparto.descripcion)
        .success(function(response) {
                defered.resolve(response);
            });
        return promise;
    };

    this.actualizarApartosPendientes = function (infoAparto) {
        var geojson = infoAparto.geom.replace(/'/g, '"');
        var defered = $q.defer();
        var promise = defered.promise;

        $http.get('templates/user.module/crudFincas.module/crudFincas.logic.php?action=actualizarApartosPendientes&gidAparto='+infoAparto.gid+'&geom='+geojson+'&fecha='+infoAparto.fecha+'&idactividad='+infoAparto.idActividad+'&descripcion='+infoAparto.descripcion)
            .success(function(response) {
                defered.resolve(response);
            });
        return promise;
    }

    this.insertarHistoricoAparto = function (infoAparto) {
        var geojson = infoAparto.geom.replace(/'/g, '"');
        var defered = $q.defer();
        var promise = defered.promise;

        $http.get('templates/user.module/crudFincas.module/crudFincas.logic.php?action=actualizarApartosPendientes&gidAparto='+infoAparto.gid+'&geom='+geojson+'&fecha='+infoAparto.fecha+'&idactividad='+infoAparto.idActividad+'&descripcion='+infoAparto.descripcion)
            .success(function(response) {
                defered.resolve(response);
            });
        return promise;
    }
    
    
    this.preview = function (gidFinca) {
        var defered = $q.defer();
        var promise = defered.promise;

        $http.get('templates/user.module/crudFincas.module/crudFincas.logic.php?action=preview&gidFinca='+gidFinca)
            .success(function(response) {
            console.log(response)
            defered.resolve(response);
        });

        return promise;
    }
    
    this.putData = function (idAparto, idFinca) {
        var defered = $q.defer();
        var promise = defered.promise;

        $http.get('templates/user.module/crudFincas.module/crudFincas.logic.php?action=divide&gidAparto='+idAparto+'&gidFinca='+idFinca)
            .success(function(response) {
            defered.resolve(response);
        });

        return promise;
    }
    
    
}]);