/**
 * Created by usuario on 21/6/2016.
 */
'use strict';
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

    .directive('myEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if(event.which === 13) {
                    scope.$apply(function (){
                        scope.$eval(attrs.myEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    })

    .config(function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.when('/', '/login');
        $urlRouterProvider.when('/formCrud/crud', '/dashboard/crud');
        $urlRouterProvider.otherwise('/login');

        $stateProvider

            .state('login',{
                url:'/login',
                templateUrl:'templates/login.module/login.view.html',
                controller:'LoginController',
                authenticate: false
            })

            //dashboard de administrador
            .state('dashboard',{
                url:'/dashboard',
                templateUrl:'templates/dashboard.module/dashboard.view.html',
                controller:'DashboardController',
                authenticate: true
            })


            .state('dashboard.home',{
                url:'/home',
                views:{
                    'dashboard':{
                        templateUrl:'templates/home.module/home.module.view.html'
                    }
                },
                authenticate: true

            })

            .state('dashboard.dusTabs',{
                url:'/tabs',
                
                views:{
                    'dashboard':{
                        templateUrl:'templates/dusTab.module/dusTab.view.html',
                        controller:'dusTabsController'
                    }
                },
                authenticate: true

            })

            .state('dashboard.dusTabs.subir',{
                url:'/subir',
                views: {
                    'dusTabs': {
                        templateUrl: 'templates/subir.module/subir.view.html',
                        controller: 'SubirController'
                    }
                },
                authenticate: true
            })
            .state('dashboard.dusTabs.agregar',{
                url:'/agregar',
                views: {
                    'dusTabs': {
                        templateUrl: 'templates/agregar.module/agregar.view.html',
                        controller: 'AgregarController'
                    }
                },
                authenticate: true
            })

            .state('dashboard.dusTabs.dividir',{
                url:'/dividir',
                views: {
                    'dusTabs': {
                        templateUrl: 'templates/dividir.module/dividir.view.html',
                        controller: 'DividirController'
                    }
                },
                authenticate: true
            })

            .state('dashboard.dusTabs.unir',{
                url:'/unir',
                views: {
                    'dusTabs': {
                        templateUrl: 'templates/unir.module/unir.view.html',
                        controller: 'UnirController'
                    }
                },
                authenticate: true
            })

            .state('dashboard.historicos',{
                url:'/historicos',
                views: {
                    'dashboard': {
                        templateUrl: 'templates/historicos.module/historicos.view.html',
                        controller: 'HistoricosController'
                    }
                }
            })

            .state('dashboard.mostrar',{
                url:'/mostrar',
                views: {
                    'dashboard': {
                        templateUrl: 'templates/mostrar.module/mostrar.view.html',
                        controller: 'MostrarController'
                    }
                },
                authenticate: true
            })

            .state('dashboard.formularioGanaderia',{
                url:'/formularioGanaderia',
                views: {
                    'dashboard': {
                        templateUrl: 'templates/formulario.module/formulario.module.view.html',
                        controller: 'FormularioGanaderia'
                    }
                },
                authenticate: true
            })

            .state('dashboard.formularioAgricultura',{
                url:'/formularioAgricultura',
                views:{
                    'dashboard':{
                        templateUrl:'templates/administrarFormulario.module/administrarFormulario.module.view.html',
                        controller:'AdministrarFormulario'
                    }
                },
                authenticate: true
            })

            .state('dashboard.formCrud',{
                url:'/formCrud',
                views: {
                    'dashboard': {
                        templateUrl: 'templates/formulario.crud.module/formCrud.view.html',
                        controller: 'FromCrudController'
                    }
                },
                authenticate: true
            })

            .state('dashboard.crud',{
                url:'/crud',
                views: {
                    'dashboard': {
                        templateUrl: 'templates/crud.module/crud.module.view.html',
                        controller: 'CRUDController'
                    }
                },
                authenticate: true
            })



        //***********************USER SECTION******************************/
            //dashboard de usuario
            .state('dashboardUser',{
                url:'/dashboardUser',
                templateUrl:'templates/user.module/dashboard.module/dashboard.view.html',
                controller:'DashboardUserController',
                authenticate: true

            })


            .state('dashboardUser.crudFincas',{
                url:'/crudFincas',
                views: {
                    'dashboardUser': {
                        templateUrl: 'templates/user.module/crudFincas.module/crudFincas.view.html',
                        controller: 'CRUDFincasController',
                    }

                },
                authenticate: true
            })

            .state('dashboardUser.crudFincas.crudApartos',{
                url:'/crudApartos',
                views: {
                    'dusTabsUser': {
                        templateUrl: 'templates/user.module/crudApartos/crudApartos.view.html',
                        controller: 'CRUDFincasController'
                    }
                },
                authenticate: true
            })

            .state('dashboardUser.crudFincas.mostrarFormUser',{
                url:'/formularioAparto',
                views: {
                    'dusTabsUser': {
                        
                        templateUrl: 'templates/user.module/mostrar.module/mostrar.view.html',
                        controller: 'MostrarUserController'
                    }
                },
                authenticate: true
            })

            .state('dashboardUser.crudFincas.responderForm',{
                url:'/responderForm',

                views:{
                    'dashboardUser':{
                        templateUrl:'templates/user.module/responder.module/responder.view.html',
                        controller: 'ResponderController'
                    }
                },
                authenticate: true

            })



    }).run(function ($rootScope, $state, UserService) {
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
        if (toState.authenticate && !UserService.auth){
            $state.transitionTo("login");
            event.preventDefault();
        }
        else if (toState.url === '/login') {
            UserService.auth = false;
        }
    });
});
