// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:312299-312346
appModule.controller('tenant.views.vehicles.printModalVehicle', ['$scope', '$sce', 'appSession', '$stateParams', 'utilities', 'abp.services.app.leaseClause', 'abp.services.app.vehicle',
        function ($scope, sce, appSession, $stateParams, utilities, leaseClauseService, vehicleService) {
            var vm = this;
            vm.loading = false;
            vm.tenantName = appSession.tenant.name;
            vm.tenancyName = appSession.tenant.tenancyName;
            vm.fileName = vm.tenancyName.toLowerCase() + '-' + 'header.png';
            vm.showSignatureButton = true;
            vm.serviceItems = [];
            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };

            //if pop-up print
            if ($scope.$parent != null) {
                if (!isNaN($scope.$parent.vmMain.vehicleId))
                    vehicleId = $scope.$parent.vmMain.vehicleId;
            }
            //if through url print
            if (vehicleId == 0 && !isNaN($stateParams.query)) {
                vehicleId = $stateParams.query;
            }

            vm.onImageError = function () { vm.imgError = true; };
            vm.localize = function (input) {
                if (input == null)
                    return "";

                return app.localize(input);
            };
            
            vm.getlocalDateTime = function (date, format) {
                if (date == null)
                    return "";

                var localTime = moment.utc(date).toDate();
                return moment(localTime).format(format);
            };
            vm.init = function () {
                vehicleService.getVehicleForView({ id: vehicleId })
                    .success(function (result) {
                        vm.vehicle = result;

                    }).finally(function () {
                        vm.loading = false;
                    });
            };
        }]);
