// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:26925-26932
appModule.controller('common.views.layout', [
        '$scope',
        function ($scope) {
            $scope.$on('$viewContentLoaded', function () {
                App.initComponents(); // init core components
            });
        }
    ]);
