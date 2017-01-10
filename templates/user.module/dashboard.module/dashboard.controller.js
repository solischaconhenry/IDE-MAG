angular.module('AppPrueba')
    .controller('DashboardUserController', function ($scope, $state, UserService, GetUserInfo) {

        GetUserInfo.userInfo(UserService.username).then(function () {
            $scope.fullName = UserService.nombre + UserService.apellidos;
        });
        $scope.logout = function () {
            UserService.username = '';
            UserService.auth = false;
            UserService.tipo = '';
            $state.go("login");
        };

    });