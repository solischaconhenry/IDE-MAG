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