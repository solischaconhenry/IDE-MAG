/**
 * Created by usuario on 21/6/2016.
 */
angular.module('AppPrueba')

    .controller('FormularioGanaderia',function ($scope, Pagination,FormulariosService) {

        $scope.preguntas = [];

       /* FormulariosService.getOpciones(11).then(function (data2) {
            $scope.prueba = data2;
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

        });


/*
        $scope.lists = [
            {
                label: "Tipos de preguntas",
                allowedTypes: ['Gem', 'Terreno', 'Gen','input'],
                max: 17,
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



        $scope.list2 = [
            {
                label: "Formulario",
                allowedTypes: ['Gen', 'Terreno', 'Datos generales','input'],
                max: 10,
                people: [



                ]
            }

        ];

        $scope.list3 = [
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

