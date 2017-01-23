angular.module('AppPrueba')


    .controller('DashboardController', function ($scope, $state, UserService) {

        $scope.username = UserService.username;
        $scope.tipo = UserService.tipo;

        $scope.userLogged = UserService.username;
        /*
        function htmlbodyHeightUpdate() {
            var height3 = $(window).height();
            var height1 = $('.nav').height() + 50;
            height2 = $('.main').height();
            if (height2 > height3) {
                $('html').height(Math.max(height1, height3, height2) + 10);
                $('body').height(Math.max(height1, height3, height2) + 10);
            }
            else {
                $('html').height(Math.max(height1, height3, height2));
                $('body').height(Math.max(height1, height3, height2));
            }

        }
        */
        $scope.logout = function () {
            UserService.username = '';
            UserService.auth = false;
            UserService.tipo = '';
            $state.go("login");
        };

        /*
        $(document).ready(function () {
            htmlbodyHeightUpdate()
            $(window).resize(function () {
                htmlbodyHeightUpdate()
            });
            $(window).scroll(function () {
                height2 = $('.main').height()
                htmlbodyHeightUpdate()
            });
        });
        /**
         * Created by usuario on 22/11/2016.
         */
    });