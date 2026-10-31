// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:456844-456897
appModule.controller('tenant.views.inspections.checkCard', [
        '$scope', '$stateParams', 'appSession', 'abp.services.app.inspection',
        function ($scope, $stateParams, appSession, inspectionService) {

            var vm = this;
            vm.tenantName = appSession.tenant.name;
            vm.tenancyName = appSession.tenant.tenancyName;
            vm.fileName = vm.tenancyName.toLowerCase() + '-' + 'header.png';
            
            var inspectionId = 0;
            
            if ($scope.$parent != null) {
                if ($scope.$parent.vmMain != null)
                    inspectionId = $scope.$parent.vmMain.filters.inspectionId;
            }

            if (inspectionId == 0) {
                if (!isNaN($stateParams.query))
                    inspectionId = $stateParams.query;
            }

            vm.loading = false;

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            function init() {
                vm.loading = true;

                if (inspectionId > 0) {
                    inspectionService.getInspectionForView({
                        id: inspectionId
                    }).success(function (result) {
                        vm.checkCard = result;
                        vm.checkCard.safetyChecks = JSON.parse(result.safetyChecks);
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
            }

            init();
        }
    ]);
