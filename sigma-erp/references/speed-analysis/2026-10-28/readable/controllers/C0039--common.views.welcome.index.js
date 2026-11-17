// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:29570-29580
appModule.controller('common.views.welcome.index', [
        '$scope',
        function ($scope) {
            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            //...
        }]);
