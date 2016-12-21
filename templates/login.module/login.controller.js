angular.module('AppPrueba')


    .controller('LoginController', function ($scope, UserService, LoginService, $state) {

        $scope.users = [];
        $scope.username = UserService.username;
        $scope.password = "";
        $scope.tipo = UserService.tipo;
        $scope.error = false;
        //show alert of fail
        $scope.show = false;

        $scope.login = function(){

            if($scope.username == ''|| $scope.password == '' || $scope.username == undefined|| $scope.password == undefined){
                $scope.show = true;
            }
            
            LoginService.loginS($scope.username, $scope.password).then(function (data) {
                if (data == 'admin'){
                    UserService.username = $scope.username;
                    UserService.tipo = data;
                    UserService.auth = true;
                    console.info("Logged");
                    $scope.show = false;
                    $state.go('dashboard.home');
                    
                }
                else if(data == 'user'){
                    //acá sección incial de user
                    UserService.username = $scope.username;
                    UserService.tipo = data;
                    UserService.auth = true;
                    $scope.show = false;
                    $state.go('dashboardUser.dusTabsUser.dividirUser');
                    console.info("Logged User");
                    $scope.show = false;
                }
                else if (data == 'error'){
                    $scope.show = true;
                }
            })
        };
    });