/**
 * Created by usuario on 21/6/2016.
 */
angular.module('AppPrueba')

    .controller('FormularioGanaderia',function ($scope, Pagination) {
        $scope.lists = [
            {
                label: "Generales",
                allowedTypes: ['Gem', 'Terreno', 'Gen'],
                max: 17,
                people: [
                    {name: "Nombre", type: "Gen", hel:"text"},
                    {name: "Apellidos", type: "Gen", hel:"text"},
                    {name: "Cedula", type: "Gen", hel:"text"},
                    {name: "Telefono", type: "Gen", hel:"tel"},
                    {name: "Email", type: "Gen", hel:"email"},
                    {name: "Digite su Nombre Aquí: ", type: "Gen", hel:"plain"},
                    {name: "Terreno", hel: "checkbox",type: "Terreno", options:["Plano", "Empinado", "Elevado"]},
                    {name: "Sexo", hel: "radio", type: "Gem", options:["Masculino", "Femenino", "NA"]}

                ]
            }

        ];

        $scope.list2 = [
            {
                label: "People",
                allowedTypes: ['Gen', 'Terreno', 'Gem'],
                max: 10,
                people: [
                    {name: "Frank", type: "Gen", hel:"text"},
                    {name: "Mallory", type: "Gen", hel:"text"},
                    {name: "Alex", type: "unknown", hel:"text"},
                    {name: "Oscar", type: "Terreno", hel:"text"},
                    {name: "Wendy", type: "Terreno", hel:"text"}

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
    })
1