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
                                console.log(pregunta[preg].options);
                                if(pregunta[preg].options != undefined && pregunta[preg].options != null &&pregunta[preg].options != "" ){
                                    var itemP = {
                                        idpreg: pregunta[preg].idpreg,
                                        name: pregunta[preg].titulo,
                                        enunciadopreg: pregunta[preg].enunciadopreg,
                                        categoria: pregunta[preg].categoria,
                                        hel: pregunta[preg].tipo,
                                        fijo: pregunta[preg].fijo,
                                        requerido: pregunta[preg].requerido,
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
                                        requerido: pregunta[preg].requerido,
                                        mascara: pregunta[preg].mascara,
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
            $scope.respaldoList2 = angular.copy($scope.list2[0].people);

            //se recorre el arreglo de respado de la BD y sus pag y preguntas para ver el estado anterior con el actual
            for(var pag = 0; pag < $scope.respaldoEdicion.length; pag++){
                var idPag = $scope.respaldoEdicion[pag].idpag; //id pag buscada
                var indexRL2 = $scope.respaldoList2.map(function (d) {return d['idpag'];}).indexOf(idPag); //pos de la pag en respaldoList2


                if(indexRL2 != -1) {

                    //comprobamos que el orden se iguales en ambas paginas
                    console.log($scope.respaldoEdicion[pag].orden);
                    console.log($scope.respaldoList2[indexRL2].orden);
                    if($scope.respaldoEdicion[pag].orden != $scope.respaldoList2[indexRL2].orden){
                        console.log("Update: "+$scope.respaldoList2[indexRL2].orden);
                        ResponderService.updateOrdenPagina(idPag, $scope.respaldoList2[indexRL2].orden);
                        $scope.respaldoEdicion[pag].orden = $scope.respaldoList2[indexRL2].orden
                    }

                    //recorremos las preguntas de esa pagina desde el respaldo de BD
                    for(var preg = 0; preg < $scope.respaldoEdicion[pag]["preguntas"].length; preg++){
                        //buscamos las preguntas del respaldo de BD en el respaldo de List2
                        var idPreg = $scope.respaldoEdicion[pag]["preguntas"][preg].idpreg;
                        var indexRL2Preg = $scope.respaldoList2[indexRL2]["preguntas"].map(function (d) {return d['idpreg'];}).indexOf(idPreg);
                        //si el indice indica -1 no se encontró la preg en el respado de list2 por tanto fue eliminada y la quitamos de BD y del Arreglo respaldo
                        if(indexRL2Preg == -1){
                            ResponderService.deletePregunta(idPag, idPreg);
                            //$scope.respaldoEdicion[pag]["preguntas"].splice(preg,1);
                        }
                        /*else{
                         //sino eliminarmos ambas preguntas para que no vuelvan a ser evaluadas y reducir tiempos en for siguientes y no se les hace nada
                         $scope.respaldoEdicion[pag]["preguntas"].splice(preg, 1);
                         $scope.respaldoList2[indexRL2]["preguntas"].splice(indexRL2Preg, 1)
                         }*/

                    }
                    //recorremos el respaldo del actual para verificar si hay preguntas nuevas
                    for(var preg2 = 0; preg2 < $scope.respaldoList2[indexRL2]["preguntas"].length; preg2++){
                        //buscamos la pregunta del respaldoList2 en el respaldo de BD para ver si hay preg nuevas en esa pag
                        var idPreg2 = $scope.respaldoList2[indexRL2]["preguntas"][preg2].idpreg;
                        var indexREPreg = $scope.respaldoEdicion[pag]["preguntas"].map(function (d) {return d['idpreg'];}).indexOf(idPreg2);
                        //si el indice indica -1 no se encontró la preg en el respaldoBD por tanto es nueva y la agregamos a la pag en BD
                        //siendo la pag ya anterior y conociendo el IDPAG
                        if(indexREPreg == -1){

                            ResponderService.insertarPreguntasForm(idPreg2, 0, FormularioResolver.idFormularioResolver, idPag, function (data) {
                                if(data == false){
                                    $scope.alerts.push({type: 'danger', msg: 'Formulario NO guardado con éxito!'});
                                    //break;
                                }
                            });
                            //$scope.respaldoEdicion.splice(preg2,1);
                        }
                    }

                }//cuando es -1 o sea no se encontró pag en el respaldoLista2m por tanto de eliminan las preguntas de esa pag y luego la pag como tal
                else{
                    for(var delPreg = 0; delPreg < $scope.respaldoEdicion[pag]["preguntas"].length; delPreg++){
                        //obtenemos el id de la pregunta a eliminar
                        var idPregDL = $scope.respaldoEdicion[pag]["preguntas"][delPreg].idpreg;
                        //borramos la pregu y la sacamos de la pag y arreglo
                        ResponderService.deletePregunta(idPag, idPregDL);
                        //$scope.respaldoEdicion[pag]["preguntas"].splice(delPreg,1);

                    }
                    //se elimina la pagina en BD y se saca la PAG DEL Arreglo respaldo de BD
                    ResponderService.deletePagina(idPag);
                    //$scope.respaldoEdicion.splice(pag,1);
                }

            }
            //ahora recorremos el arreglo RespaldoList2 para verificar si hay paginas nuevas
            for(var pagRL2 = 0; pagRL2<$scope.respaldoList2.length; pagRL2++){
                //una pagina nueva aún no tiene un ID de pag asignado por tanto si el ID es undefined es una pagina nueva a insertar
                if($scope.respaldoList2[pagRL2].idpag == undefined) {
                    var arregloPreg = [];
                    for(var preg3 = 0; preg3 < $scope.respaldoList2[pagRL2]["preguntas"].length; preg3++){
                        arregloPreg.push($scope.respaldoList2[pagRL2]["preguntas"][preg3].idpreg);
                    }

                    ResponderService.insertarPag($scope.respaldoList2[pagRL2].pagina, $scope.respaldoList2[pagRL2].orden, arregloPreg);
                    /*//no se encontró la pag en el respaldoEdición por tanto es una pag nueva y se agrega a bd
                     ResponderService.insertarPag($scope.respaldoList2[pagRL2].pagina, $scope.respaldoList2[pagRL2].orden)
                     .then(function (data) {
                     if(!data){
                     $scope.alerts.push({type: 'danger', msg: 'Formulario NO guardado con éxito!'});
                     console.warn("Error insertar PAG");
                     }
                     });
                     //insertamos preguntas en la pagina nueva
                     for(var preg3 = 0; preg3 < $scope.respaldoList2[pagRL2]["preguntas"].length; preg3++){
                     var idPregN = $scope.respaldoList2[pagRL2]["preguntas"][preg3].idpreg;
                     ResponderService.insertarPregNuevaPag(idPregN,0,FormularioResolver.idFormularioResolver)
                     .then(function (data2) {
                     if(!data2){
                     $scope.alerts.push({type: 'danger', msg: 'Formulario NO guardado con éxito!'});
                     console.warn("Error insertar Preguntas en PAG");
                     }
                     });
                     }*/
                }
            }

            $scope.alerts.push({type: 'success', msg: 'Formulario guardado con éxito!'});


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




