/**
 * Created by Hellen Rojas Rojas on 09/01/2017.
 */
angular.module('AppPrueba')

    .service('VerRespFormService', function($http,$q) {

        this.getIdFormWIdResp = function (idrespuesta) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('templates/verRespForm.module/verRespForm.logic.php?action=getIdFormWIdResp&idrespuesta='+idrespuesta)
                .success(function (response) {
                    defered.resolve(response);
                });

            return promise;
        };



        this.obtenerDatosResp = function (idrespuesta) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('templates/verRespForm.module/verRespForm.logic.php?action=obtenerDatosResp&idrespuesta='+idrespuesta)
                .success(function (response) {
                    defered.resolve(response);
                });

            return promise;
        };


    })
    
    .service('VerEditarFormServiceCodigoFincaAparto', function() {
        this.respuesta = {};
        this.gidFinca = "";
        this.gidAparto = "";
        this.codigofincaaparto = "";
        this.nombrefinca = "";
        this.tipo = "";
        this.nombrepropietario = "";
        this.apellidosPropietario = "";
        this.fechaRes = 0;
    });

