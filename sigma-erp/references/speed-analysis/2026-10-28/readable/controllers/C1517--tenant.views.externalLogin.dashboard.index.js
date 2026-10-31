// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:413777-413787
appModule.controller('tenant.views.externalLogin.dashboard.index', [
        '$scope',
        function ($scope) {
            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            //...
        }]);
