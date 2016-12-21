

/**
 * Created by usuario on 17/12/2016.
 */
angular.module('AppPrueba')

    .controller('ResponderController', function ($scope, Pagination, ResponderService, $uibModal, $timeout,$log, $document, $http, FormularioResolver) {

        console.log("ID: " + FormularioResolver.idFormularioResolver);


        //ALERTAS DE EXITO Y FRACASO
        $scope.alerts = [
            // { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
            //  { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
        ];

        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };


        /*****PRINCIPALES VARIABLES DE LOS FORMS - ACA ESTAN LOS DE CARGA-*/
        $scope.seccionActiva = 0;
        $scope.preguntas = [];
        $scope.categorias = [];
        $scope.peopleEdit = [];
        $scope.respaldoEdicion = [];
        $scope.respaldoPreguntas = [];
        $scope.DataForm =[]; //muestra el nombre del formulario
        $scope.value="Culpa Gabriel";

        //trae los sigueintes datos: nombreform,idform,descripcion,fecha
        ResponderService.obtenerFormulario(FormularioResolver.idFormularioResolver).then(function (data) {
            console.log(data);
            var item = {
                nombre: data[0]["nombreform"],
                descripcion: data[0]["descripcion"],
                fecha: data[0]["fecha"]
            };
            $scope.DataForm = item;
            console.log($scope.DataForm);
        });

        /****************************************CARGADO Y EDICIÓN DE FORMULARIOS*********************************************/

        var tempArray = [];
        var pregUsadas = [];
        $scope.edicion = function (callback) {
            var idForm = FormularioResolver.idFormularioResolver;
            console.log("form: " + idForm);
            ResponderService.obtenerPaginasByID(idForm).then(function (pagina) {
                console.log(pagina);
                ResponderService.obtenerAllPreguntas(idForm).then(function (pregunta) {
                    console.log(pregunta);
                    for (var pag = 0; pag < pagina.length; pag++) {
                        var item = {
                            pagina: pagina[pag].descripcion,
                            orden: pagina[pag].orden,
                            idpag: pagina[pag].idpag,
                            preguntas: []
                        };
                        for (var preg = 0; preg < pregunta.length; preg++) {
                            if (pregunta[preg].descripcion === pagina[pag].descripcion) {

                                if(pregunta[preg].options != undefined && pregunta[preg].options != null &&pregunta[preg].options != "" ){
                                    console.log(pregunta[preg].options);

                                    var itemP = {
                                        idpreg: pregunta[preg].idpreg,
                                        name: pregunta[preg].titulo,
                                        enunciadopreg: pregunta[preg].enunciadopreg,
                                        categoria: pregunta[preg].categoria,
                                        hel: pregunta[preg].tipo,
                                        fijo: pregunta[preg].fijo,
                                        requerido: (pregunta[preg].requerido ==="t"),
                                        mascara: pregunta[preg].mascara,
                                        options: pregunta[preg].options

                                    };
                                }
                                else{
                                    var itemP = {
                                        idpreg: pregunta[preg].idpreg,
                                        name: pregunta[preg].titulo,
                                        enunciadopreg: pregunta[preg].enunciadopreg,
                                        categoria: pregunta[preg].categoria,
                                        hel: pregunta[preg].tipo,
                                        fijo: pregunta[preg].fijo,
                                        requerido: (pregunta[preg].requerido ==="t"),
                                        mascara: pregunta[preg].mascara
                                    };
                                }
                                item.preguntas.push(itemP);

                                pregUsadas.push(pregunta[preg].titulo);
                                //              console.warn(item);
                            }

                        }

                        tempArray.push(item);
                        console.info(tempArray);
                    }
                    // $scope.peopleEdit = tempArray;
                    $scope.respaldoEdicion = angular.copy(tempArray);
                    $scope.pagination.numPages = pagina.length;
                    $scope.change(1);

                });
            });


            callback(tempArray);
        };


        /****************************************FIN CARGADO Y EDICIÓN DE FORMULARIOS*********************************************/


        //carga el formulario a las seccion ya arrastrada y borra las preguntas usadas de las categ
        $scope.edicion(function (data) {
            $scope.peopleEdit = data;


            $scope.list2 = [
                {
                    label: "Formulario",
                    people: $scope.peopleEdit
                }

            ];


        });

        // Model to JSON for demo purpose
        $scope.$watch('list2', function (list2) {
            $scope.modelAsJson = angular.toJson(list2, true);
        }, true);

        //for control expandable panel
        $scope.status = {
            isCustomHeaderOpen: false,
            isFirstOpen: true,
            isFirstDisabled: false
        };
        $scope.oneAtATime = true;

        //for control of pagination
        $scope.pagination = Pagination.getNew();
        //$scope.pagination = Pagination.getNew(2);
        console.log($scope.list2[0].people.length);
        //$scope.pagination.numPages = Math.ceil($scope.list2[0].people.length/$scope.pagination.perPage);
        $scope.pagination.numPages = 0;


        /*    $scope.$watch('list2[0].people', function () {
         console.log("prove");
         $scope.pagination.numPages = Math.ceil($scope.list2[0].people.length/$scope.pagination.perPage);
         }, true);*/


        //*************************** PAGINAS *******************************************************
        // MOSTRAR MODAL DE PAGINA
        var $ctrl = this;
        $ctrl.animationsEnabled = true;
        $ctrl.open = function (size, parentSelector) {
            var parentElem = parentSelector ?
                angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
            var modalInstance = $uibModal.open({
                animation: $ctrl.animationsEnabled,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                controllerAs: '$ctrl',
                size: size,
                appendTo: parentElem
            });

            modalInstance.result.then(function (nombre) {
                $scope.nombrePagina = nombre;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };


        $scope.$watch('nombrePagina', function () {
            if ($scope.nombrePagina != undefined) {
                $scope.pagination.numPages += 1;
                var item = {
                    pagina: $scope.nombrePagina,
                    orden: $scope.pagination.numPages,
                    preguntas: []

                };
                console.log($scope.nombrePagina);
                $scope.nombrePagina = undefined;
                $scope.list2[0].people.push(item);
            }
        });



        //cuando se presiona una pagina actualiza la varible con el #
        $scope.change = function (page) {
            console.log(page);
            $scope.seccionActiva = page;
            if ($scope.nombrePag = $scope.list2[0].people.length == 0) {
                $scope.nombrePag = "Vacío"
            }
            else {
                console.info($scope.seccionActiva);
                $scope.nombrePag = $scope.list2[0].people[$scope.seccionActiva - 1].pagina;
            }

        };


        $scope.myFilter = function (person) {
            return person.orden == $scope.seccionActiva;
        };


        //*************************** GUARDAR FORMULARIO *******************************************************


        //Edita EN BD TODO LO REFERENTE AL FORMULARIO
        $scope.editarForm = function () {


            //se recorre las páginas pare revisar el contenido de sus preguntas
            for(var pag = 0; pag < $scope.list2[0]["people"].length; pag++) {
                //recorremos las preguntas de esa pagina desde el respaldo de BD
                for (var preg = 0; preg < $scope.respaldoEdicion[pag]["preguntas"].length; preg++) {


                }
                //recorremos el respaldo del actual para verificar si hay preguntas nuevas
            }

            $scope.alerts.push({type: 'success', msg: 'Respuesta enviada con éxito!'});


        };

        // LEVANTA EL MODAL PARA PEDIR LOS DATOS DEL FORMULARIO
        $scope.guardarForm = function () {

            console.log($scope.list2[0].people.length == 0);
            if ($scope.list2[0].people.length != 0) {
                for (var i = 0; i < $scope.list2[0].people.length; i++) {
                    if ($scope.list2[0].people[i].preguntas.length == 0) {
                        alert("Pagina en Blanco");
                        break;
                    }
                }
                $scope.editarForm()
            }
            else {
                alert("Formulario vacío !!!")
            }
        };

        $scope.print = function(){
            console.info($scope.list2);
        };

    });



//*************************** CONTROLLER PARA PAGINAS *******************************************************
angular.module('AppPrueba').controller('ModalInstanceCtrl', function ($scope, $uibModalInstance) {
    var $ctrl = this;
    $ctrl.ok = function () {
        $uibModalInstance.close($scope.nombrePagina);
    };

    $ctrl.cancel = function () {
        $uibModalInstance.close(undefined);
    };
});

//*************************** CONTROLLER PARA FORMULARIO *******************************************************

angular.module('AppPrueba').controller('ModalInstanceCtrlForm', function ($scope, $uibModalInstance) {
    var $ctrl = this;
    $ctrl.ok = function () {
        console.log("drg");
        var infoForm = {
            nombre: $scope.nombreForm,
            descripcion: $scope.descripcionForm,
            fecha: $scope.fechaForm.toLocaleString()
        };
        $uibModalInstance.close(infoForm);

    };

    $ctrl.cancel = function () {
        $uibModalInstance.close(undefined);
    };
});




