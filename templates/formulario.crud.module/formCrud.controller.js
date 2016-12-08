/**
 * Created by usuario on 25/11/2016.
 */
angular.module('AppPrueba')


    .controller('FromCrudController', function ($scope, UserService, $state, FormCrudService, EditarFormularioFincaxForm) {

        $scope.formularios =[];

        FormCrudService.getAllForms().then(function (data) {
            var values = [];

            for(var x = 0; x< data.length; x++){

                var newJson ={
                    idform: data[x].idform,
                    nombre: data[x].nombreform,
                    descripcion: data[x].descripcion,
                    fecha: data[x].fecha
                };

                values.push(newJson);
            }
            $scope.formularios = values;
            

        })

        $scope.change =function (id) {
            
            EditarFormularioFincaxForm.idFormularioEditar = id
        }
       


    });
