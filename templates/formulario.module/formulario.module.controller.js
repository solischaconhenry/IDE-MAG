
angular.module('AppPrueba')

    .controller('FormularioGanaderia',function ($scope, Pagination,FormulariosService,$uibModal, $log, $document) {

        $scope.seccionActiva = 0;
        $scope.preguntas = [];
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

        FormulariosService.getPreguntas().then(function (data) {
            $scope.preguntas = data;

            $scope.lists = [
                {
                    label: "Tipos de preguntas",
                    allowedTypes: ['Gem', 'Terreno', 'Datos generales','input'],
                    max: 17,
                    people: $scope.preguntas
                }

            ];
            console.log( $scope.preguntas)
        });

        $scope.list2 = [
            {
                label: "Formulario",
                people: [
                    /* {

                        pagina: "Patito",
                        orden: 1,
                        descripcion:"holi",
                        preguntas:[ 
                            {name: "Prueba", type: "Gen", hel:"text"},
                            {name: "Pruebita", type: "Gen", hel:"text"}]
                    },
                    {
                        pagina:"Patito2",
                        orden: 2,
                        descripcion:"Holis",
                        preguntas:[
                            {name: "Burtota", type: "Terreno", hel:"text"},
                            {name: "Wendy", type: "Terreno", hel:"text"}]
                    }
                    */
                ]
            }

        ];




        $scope.eliminarPregForm = function (id) {
            console.log(id);
            console.log($scope.list2);
            console.log($scope.list2[0]["people"]);
           var index = $scope.list2[0]["people"].map(function(d) { return d['name']; }).indexOf(id);


            delete $scope.list2[0]["people"][index];
            $scope.list2[0][["people"]] = JSON.parse(JSON.stringify($scope.list2[0]["people"]));

            console.log(index);
            console.log($scope.list2[0]["people"]);
        }


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
                appendTo: parentElem,
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

                }
                console.log( $scope.nombrePagina)
                $scope.nombrePagina = undefined;
                $scope.list2[0].people.push(item);
            }
        });

        $scope.addPage = function () {
            $ctrl.open('sm');

        }

        $scope.change = function (page) {
            $scope.seccionActiva = page;
        }

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
                console.log($scope.infoForm)
                FormulariosService.insertarForm($scope.infoForm.nombre,$scope.infoForm.descripcion,$scope.infoForm.fecha)
                    .then(function (data) {
                    });
                //RECORRER LAS PÁGINAS
                angular.forEach($scope.list2[0].people, function(pagina){
                    console.log("entro");
                    FormulariosService.insertarPag(pagina.pagina,pagina.orden)
                        .then(function (data) {
                        });
                    //RECORRER LAS PREGUNTAS
                    angular.forEach(pagina.preguntas, function(pregunta) {
                        console.log(pregunta.idpreg);
                        FormulariosService.insertarPreguntasForm(pregunta.idpreg,0)
                            .then(function (data) {
                            });
                    })
                })

            }
        });
        // LEVANTA EL MODAL PARA PEDIR LOS DATOS DEL FORMULARIO
        $scope.guardarForm = function () {
             $ctrl.openForm();
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
        var infoForm = {
            nombre: $scope.nombreForm,
            descripcion: $scope.descripcionForm,
            fecha:$scope.fechaForm.toLocaleString()
        }
        $uibModalInstance.close(infoForm);

    };

    $ctrl.cancel = function () {
        $uibModalInstance.close(undefined);
    };
});
