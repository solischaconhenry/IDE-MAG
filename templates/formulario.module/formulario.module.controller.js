
angular.module('AppPrueba')

    .controller('FormularioGanaderia',function ($scope, Pagination,FormulariosService) {

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
                allowedTypes: ['Gen', 'Terreno', 'Datos generales','input'],
                max: 10,
                people: [

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
        $scope.$watch('lists', function(lists) {
            $scope.modelAsJson = angular.toJson(lists, true);
        }, true);

        $scope.status = {
            isCustomHeaderOpen: false,
            isFirstOpen: true,
            isFirstDisabled: false
        };
        $scope.oneAtATime = true;

        $scope.pagination = Pagination.getNew();
        $scope.pagination = Pagination.getNew(3);
        console.log($scope.list2[0].people.length);
        $scope.pagination.numPages = Math.ceil($scope.list2[0].people.length/$scope.pagination.perPage);



        $scope.$watch('list2[0].people', function () {
            console.log("prove");
            $scope.pagination.numPages = Math.ceil($scope.list2[0].people.length/$scope.pagination.perPage);
        }, true);
        

        
    });



