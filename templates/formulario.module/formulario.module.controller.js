
angular.module('AppPrueba')

    .controller('FormularioGanaderia',function ($scope, Pagination,FormulariosService,$uibModal, $log, $document, InsertarFormularioFincaxForm) {

        console.log("ID: " + InsertarFormularioFincaxForm.idFincaxFormulario);

       //ALERTAS DE EXITO Y FRACASO
        $scope.alerts = [
           // { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
          //  { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
        ];

        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };
        $scope.seccionActiva = 0;
        $scope.preguntas = [];
        $scope.categorias = [];
        $scope.heightListaPreg = screen.height - ((screen.height/3)+ (screen.height/30));
        $scope.heightFormCrear =   $scope.heightListaPreg - (screen.height/12);

       /* FormulariosService.insertarForm("nombre","blabla","2013-07-01")
            .then(function (data) {
                alert("ok");
                console.log(data);
            });
        FormulariosService.insertarPag("nombrePag",1)
            .then(function (data) {
                alert("ok");
                console.log(data);
            });


        FormulariosService.insertarPreguntasForm(10,0)
            .then(function (data) {
                alert("ok");
                console.log(data);
            });
        */
        //obtiene la lista de categorías para filtrar los datos en el typesTAG5
        FormulariosService.obtenerCategorias().then(function (data) {
            $scope.categorias = data;
            console.log($scope.categorias);
        });

        FormulariosService.getPreguntas().then(function (data) {
            $scope.preguntas = data;

            $scope.lists = [
                {
                    label: "Tipos de preguntas",
                    people: $scope.preguntas
                }

            ];
            console.log( $scope.preguntas)
        });

        $scope.list2 = [
            {
                label: "Formulario",
                people: []
            }

        ];




        //opcion de ELIMINAR UNA PREGUNTA ARRASTRADA
        $scope.eliminarPregForm = function (id) {
            if ($scope.list2[0]["people"][0]["preguntas"] == null) {
                $scope.list2[0]["people"][0]["preguntas"] = [];
            }

            for(var pag = 0; pag < $scope.list2[0].people.length; pag++){
                var index = $scope.list2[0]["people"][pag]["preguntas"].map(function (d) {return d['name'];}).indexOf(id);
                if(index != -1){
                    $scope.preguntas.push($scope.list2[0]["people"][pag].preguntas[index]);
                    $scope.list2[0]["people"][pag]["preguntas"].splice(index, 1);
                }

            }

        };


        $scope.eliminar = function (id) {
            var index = ($scope.list2['people']).map(function(d) { return d['name']; }).indexOf(id);
            alert(index)

        };


        // Model to JSON for demo purpose
        $scope.$watch('list2', function(list2) {
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


        $scope.$watch('nombrePagina', function() {
            if($scope.nombrePagina != undefined) {
                $scope.pagination.numPages += 1;
                var item = {
                    pagina: $scope.nombrePagina,
                    orden: $scope.pagination.numPages,
                    preguntas:[]

                };
                console.log( $scope.nombrePagina);
                $scope.nombrePagina = undefined;
                $scope.list2[0].people.push(item);
            }
        });

        $scope.addPage = function () {
            if($scope.pagination.numPages > 0) {
                if ($scope.list2[0].people[$scope.pagination.numPages - 1].preguntas.length != 0) {
                    $ctrl.open('sm');

                    //change($scope.pagination.numPages);
                }
                else {
                    alert("Agregue preguntas a la sección creada")
                }
            }
            else {
                $ctrl.open('sm');

                //change($scope.pagination.numPages);
            }

        };
        //cuando se presiona una pagina actualiza la varible con el #
        $scope.change = function (page) {
            $scope.seccionActiva = page;
            if( $scope.nombrePag = $scope.list2[0].people.length == 0){
                $scope.nombrePag = "Vacío"
            }
            else {
                $scope.nombrePag = $scope.list2[0].people[$scope.seccionActiva-1].pagina;
            }

        }
        $scope.change(1);

        $scope.myFilter = function (person) {
            return person.orden == $scope.seccionActiva;
        };




        //*************************** GUARDAR FORMULARIO *******************************************************


        var $ctrl = this;
        $ctrl.animationsEnabled = true;
        $ctrl.openForm = function (size, parentSelector) {
            var parentElem = parentSelector ?
                angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
            var modalInstance = $uibModal.open({
                animation: $ctrl.animationsEnabled,
                ariaLabelledBy: 'modal-titleForm',
                ariaDescribedBy: 'modal-bodyForm',
                templateUrl: 'myModalContentForm.html',
                controller: 'ModalInstanceCtrlForm',
                controllerAs: '$ctrl',
                size: size,
                appendTo: parentElem,
            });

            modalInstance.result.then(function (infoForm) {
                $scope.infoForm = infoForm;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };


        //GUARDA EN BD TODO LO REFERENTE AL FORMULARIO
        $scope.$watch('infoForm', function() {

            if($scope.infoForm != undefined) {
                //insertar en la tabla formulario
                console.log("hh");
                console.log($scope.infoForm);
                FormulariosService.insertarForm($scope.infoForm.nombre,$scope.infoForm.descripcion,$scope.infoForm.fecha,InsertarFormularioFincaxForm.idFincaxFormulario)
                    .then(function (data) {
                    });
                //RECORRER LAS PÁGINAS

                for (var i = 0; i<$scope.list2[0].people.length;i++){

                    var pagina = $scope.list2[0].people[i];

                    FormulariosService.insertarPag(pagina.pagina, pagina.orden,function (data) {
                        console.log("pagina");
                        console.log(pagina);


                        for (var k = 0; k <pagina.preguntas.length;k++){

                            var pregunta = pagina.preguntas[k];

                            FormulariosService.insertarPreguntasForm(pregunta.idpreg, 0,function (response) {
                                    console.log("preg");
                                    console.log((pregunta.idpreg));
                                });
                               /* .then(function (data) {
                                    console.log("preg");
                                    console.log((pregunta.idpreg));
                                });*/
                        }

                    });

                }
                $scope.alerts.push({type: 'success',msg: 'Formulario creado con éxito!!'});

            }

        });
        // LEVANTA EL MODAL PARA PEDIR LOS DATOS DEL FORMULARIO
        $scope.guardarForm = function () {

            console.log( $scope.list2[0].people.length == 0 );
            if($scope.list2[0].people.length != 0 ) {
                $ctrl.openForm();
            }
            else {
                alert("Formulario vacío !!!")
            }
        }
    
        

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
        }
        $uibModalInstance.close(infoForm);

    };

    $ctrl.cancel = function () {
        $uibModalInstance.close(undefined);
    };
});



