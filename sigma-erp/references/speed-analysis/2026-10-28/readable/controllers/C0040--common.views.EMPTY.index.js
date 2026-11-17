// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:29583-29594
appModule.controller('common.views.EMPTY.index', [
        '$scope', '$uibModal',
        function ($scope, $uibModal) {
            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            //start from here...
        }
    ]);
