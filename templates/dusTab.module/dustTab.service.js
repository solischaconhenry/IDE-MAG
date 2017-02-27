angular.module('AppPrueba')
    .service('crudFincasAdminService', ['$http','$q', function ($http, $q) {

        this.insertarFinca = function (infoFinca) {
            var geojson = "'"+infoFinca.geom+"'"
            console.log(geojson);
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('templates/dusTab.module/crearFinca.logic.php?action=crearFinca&iduser='+infoFinca.iduser+'&fecha='+infoFinca.fecha+'&provincia='+infoFinca.provincia+'&canton='+infoFinca.canton+'&distrito='+infoFinca.distrito+'&direccionexacta='+infoFinca.direccionexacta+'&codigofinca='+infoFinca.codigofinca+'&telefono='+infoFinca.telefono+'&nombrefinca='+infoFinca.nombrefinca+'&geom='+geojson)
            .success(function(response) {
                    defered.resolve({status:"success"});
                });
            return promise;
        };
    }]);