/**
 * Created by usuario on 25/11/2016.
 */
angular.module('AppPrueba')

    .service('FormCrudService',function($http, $q) {

        //obtener todos los forms para mostrarlos
        this.getAllForms = function () {

            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('templates/formulario.crud.module/formCrud.php?action=getAllForms')
                .success(function(response) {

                    
                    defered.resolve(response);

                });

            return promise;
        }

    });