/**
 * Created by usuario on 21/6/2016.
 */
'use strict'
angular
    .module('AppPrueba', [
        'ui.router',
        'dndLists',
        'ngAnimate', 'ngSanitize', 'ui.bootstrap', 'simplePagination',
        'ngSanitize'
    ])
    .config(function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.when('/', '/formulario');
        $urlRouterProvider.otherwise('/formulario');

        $stateProvider
            .state('subir',{
                url:'/subir',
                templateUrl:'templates/subir.module/subir.view.html',
                controller:'SubirController'
            })

            .state('agregar',{
                url:'/agregar',
                templateUrl:'templates/agregar.module/agregar.view.html',
                controller:'AgregarController'
            })

            .state('dividir',{
                url:'/dividir',
                templateUrl:'templates/dividir.module/dividir.view.html',
                controller:'DividirController'
            })

            .state('unir',{
                url:'/unir',
                templateUrl:'templates/unir.module/unir.view.html',
                controller:'UnirController'
            })

            .state('historicos',{
                url:'/historicos',
                templateUrl:'templates/historicos.module/historicos.view.html',
                controller:'HistoricosController'
            })

            .state('mostrar',{
                url:'/mostrar',
                templateUrl:'templates/mostrar.module/mostrar.view.html',
                controller:'MostrarController'
            })

            .state('formularioGanaderia',{
                url:'/formularioGanaderia',
                templateUrl:'templates/formulario.module/formulario.module.view.html',
                controller:'FormularioGanaderia'
            })
    });
