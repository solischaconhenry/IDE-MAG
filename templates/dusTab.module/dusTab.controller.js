/**
 * Created by usuario on 28/10/2016.
 */
angular.module('AppPrueba')
    .controller('dusTabsController', function ($scope) {

        $(".nav a").on("click", function(){
            $(".nav").find(".active").removeClass("active");
            $(this).parent().addClass("active");
        });
    });