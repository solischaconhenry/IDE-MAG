/**
 * Created by Hellen Rojas Rojas on 09/01/2017.
 */

angular.module('AppPrueba')


    .controller('VerRespFormController', function ($scope, VerEditarFormService,VerRespFormService,ResponderService, $uibModal, $timeout,$log, $document, $http, $state, FormularioResolver,Pagination ) {
        $scope.idrespuesta = VerEditarFormService.idRespuesta;
        // $scope.idform = "";
        /*****PRINCIPALES VARIABLES DE LOS FORMS - ACA ESTAN LOS DE CARGA-*/
        $scope.seccionActiva = 0;
        $scope.preguntas = [];
        $scope.categorias = [];
        $scope.peopleEdit = [];
        $scope.respaldoEdicion = [];
        $scope.respaldoPreguntas = [];
        $scope.DataForm = []; //muestra el nombre del formulario
        $scope.list2 = [];
        $scope.list2.respuestas = [];


        VerRespFormService.getIdFormWIdResp($scope.idrespuesta).then(function (data) {
            $scope.idform = data[0].idform;
            console.log($scope.idform);
            ResponderService.obtenerFormulario($scope.idform).then(function (data2) {
                var item = {
                    nombre: data2[0]["nombreform"],
                    descripcion: data2[0]["descripcion"],
                    fecha: data2[0]["fecha"]
                };
                $scope.DataForm = item;
            });

            var tempArray = [];
            var pregUsadas = [];
            $scope.edicion = function (callback) {
                var idForm = $scope.idform;
                console.log("form: " + idForm);
                ResponderService.obtenerPaginasByID(idForm).then(function (pagina) {
                    console.log(pagina);
                    ResponderService.obtenerAllPreguntasWRespuestas(idForm, $scope.idrespuesta).then(function (pregunta) {
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

                                    if (pregunta[preg].options != undefined && pregunta[preg].options != null && pregunta[preg].options != "") {
                                        console.log(pregunta[preg].options);

                                        var itemP = {
                                            idpreg: pregunta[preg].idpreg,
                                            name: pregunta[preg].titulo,
                                            enunciadopreg: pregunta[preg].enunciadopreg,
                                            categoria: pregunta[preg].categoria,
                                            hel: pregunta[preg].tipo,
                                            fijo: pregunta[preg].fijo,
                                            requerido: (pregunta[preg].requerido === "t"),
                                            mascara: pregunta[preg].mascara,
                                            options: pregunta[preg].options,
                                            answer: pregunta[preg].answer[0]

                                        };
                                    }
                                    else {
                                        var itemP = {
                                            idpreg: pregunta[preg].idpreg,
                                            name: pregunta[preg].titulo,
                                            enunciadopreg: pregunta[preg].enunciadopreg,
                                            categoria: pregunta[preg].categoria,
                                            hel: pregunta[preg].tipo,
                                            fijo: pregunta[preg].fijo,
                                            requerido: (pregunta[preg].requerido === "t"),
                                            mascara: pregunta[preg].mascara,
                                            answer: pregunta[preg].answer[0]
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


            //Guarda la respuestas del usuario
            $scope.guardarRespuestas = function (data) {

                for (var pag = 0; pag < data.length; pag++) {
                    for (var preg = 0; preg < data[pag]["preguntas"].length; preg++) {
                        ResponderService.editarResp_Preg(data[pag]["preguntas"][preg].answer.idresp_preg, data[pag]["preguntas"][preg].answer.valor);
                    }
                }

            }

            $scope.validar =function (lista) {
                var bandera = false;
                var data = lista[0].people;
                console.log(data);
                for(var pag = 0; pag < data.length; pag++) {
                    if(bandera){
                        break;
                    }
                    for (var preg = 0; preg < data[pag]["preguntas"].length; preg++) {

                        if(data[pag]["preguntas"][preg].requerido){

                            if(data[pag]["preguntas"][preg].answer == "" || data[pag]["preguntas"][preg].answer == null || data[pag]["preguntas"][preg].answer == undefined){

                                console.log(data[pag]["preguntas"][preg].name +": " + data[pag]["preguntas"][preg].answer);
                                alert("Hay datos incompletos: " + data[pag]["preguntas"][preg].name);
                                bandera=true;
                                break;
                            }
                        }
                    }
                }
                if(bandera == false){
                   // $scope.alertRespuesta.push({ type: 'success', msg: 'Guardado'});
                    //$("#basicModal").modal("show");
                    $scope.guardarRespuestas(data);
                    console.log("nnn");
                }

            };

        })
    });
