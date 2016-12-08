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

    .directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;
    
                element.bind('change', function(){
                    scope.$apply(function(){
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }])

    .config(function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.when('/', '/login');
        $urlRouterProvider.otherwise('/login');

        $stateProvider

            .state('dusTabs',{
                url:'/tabs',
                templateUrl:'templates/dusTab.module/dusTab.view.html',
                controller:'dusTabsController'
            })

            .state('dusTabs.subir',{
                url:'/subir',
                templateUrl:'templates/subir.module/subir.view.html',
                controller:'SubirController'
            })

            .state('dusTabs.agregar',{
                url:'/agregar',
                templateUrl:'templates/agregar.module/agregar.view.html',
                controller:'AgregarController'
            })

            .state('dusTabs.dividir',{
                url:'/dividir',
                templateUrl:'templates/dividir.module/dividir.view.html',
                controller:'DividirController'
            })

            .state('dusTabs.unir',{
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

            .state('formularioAgricultura',{
                url:'/formularioAgricultura',
                templateUrl:'templates/administrarFormulario.module/administrarFormulario.module.view.html',
                controller:'AdministrarFormulario'
            })

            .state('login',{
                url:'/login',
                templateUrl:'templates/login.module/login.view.html',
                controller:'LoginController'
            })




        
    });
