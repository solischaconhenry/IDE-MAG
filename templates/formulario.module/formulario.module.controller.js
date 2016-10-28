
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


        FormulariosService.insertarPreguntasForm(1,1,0,1)
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
                        orden: 0,
                        descripcion:"holi",
                        preguntas:[ 
                            {name: "Prueba", type: "Gen", hel:"text"},
                            {name: "Pruebita", type: "Gen", hel:"text"}]
                    },
                    {
                        pagina:"Patito2",
                        orden: 1,
                        descripcion:"Holis",
                        preguntas:[
                            {name: "Burtota", type: "Terreno", hel:"text"},
                            {name: "Wendy", type: "Terreno", hel:"text"}]
                    }
                    */
                ]
            }

        ];


        $scope.guardarForm = function (nombre,descripcion,fecha,pag) {

        }

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

    /*    $scope.list3 = [
            {
                label: "Prueba",
                allowedTypes: ['Gen', 'Terreno', 'Gem'],
                max: 10,
                people: [
                    {name: "Prueba", type: "Gen", hel:"text"},
                    {name: "Pruebita", type: "Gen", hel:"text"},
                    {name: "Pruebota", type: "unknown", hel:"text"},
                    {name: "Burtota", type: "Terreno", hel:"text"},
                    {name: "Wendy", type: "Terreno", hel:"text"}
                ]
            }

        ];
        */


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
        $scope.pagination.numPages = 2;


    /*    $scope.$watch('list2[0].people', function () {
            console.log("prove");
            $scope.pagination.numPages = Math.ceil($scope.list2[0].people.length/$scope.pagination.perPage);
        }, true);*/

        $scope.$watch('nombrePagina', function() {
            if($scope.nombrePagina != undefined) {
                $scope.pagination.numPages += 1;
                var item = {
                    pagina: $scope.nombrePagina

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
                console.log(nombre)
                $scope.nombrePagina = nombre;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

    });


angular.module('AppPrueba').controller('ModalInstanceCtrl', function ($scope, $uibModalInstance) {
    var $ctrl = this;
    $ctrl.ok = function () {
        $uibModalInstance.close($scope.nombrePagina);
        $uibModalInstance.close();
    };

    $ctrl.cancel = function () {
       // $uibModalInstance.dismiss('cancel');
        $uibModalInstance.close(undefined);
    };
});

