/**
 * Created by usuario on 25/11/2016.
 */
angular.module('AppPrueba')


    .controller('FromCrudController', function ($scope, UserService, $state, FormCrudService, EditarFormularioFincaxForm) {

        $scope.formularios =[];

        //ALERTAS DE EXITO Y FRACASO
        $scope.alertsForm = [
            // { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
            //  { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
        ];

        $scope.closeAlert = function (index) {
            $scope.alertsForm.splice(index, 1);
        };

        FormCrudService.getAllForms().then(function (data) {
            var values = [];

            for(var x = 0; x< data.length; x++){

                var newJson ={
                    idform: data[x].idform,
                    nombre: data[x].nombreform,
                    descripcion: data[x].descripcion,
                    fecha: data[x].fecha,
                    editable: (data[x].editable ==="f")
                };
                console.info(newJson);
                values.push(newJson);
            }
            $scope.formularios = values;
            

        });

        $scope.change =function (id) {
            
            EditarFormularioFincaxForm.idFormularioEditar = id
        };

        $scope.deleteForm = function (id) {
            FormCrudService.deleteFormbyID(id).then(function () {
                $scope.alertsForm.push({type: 'success', msg: 'Formulario eliminado con éxito!'});
            });

        }
       


    });
