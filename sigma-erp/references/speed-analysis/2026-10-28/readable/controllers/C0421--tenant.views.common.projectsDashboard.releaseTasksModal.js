// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:104705-104754
appModule.controller('tenant.views.common.projectsDashboard.releaseTasksModal', [
        '$scope', 'releaseId', '$uibModalInstance', '$uibModal', 'abp.services.app.customerCareTenant', 'utilities',
        function ($scope, releaseId, $uibModalInstance, $uibModal, customerCareTenantService, utilities) {
            var vm = this;
            vm.releaseId = releaseId;
            vm.loading = false;
            vm.multilineStringToHTMLWordBreak = (s) => utilities.multilineStringToHTMLWordBreak(s);

            vm.getReleaseTasks = function (releaseId) {

                vm.loading = true;
                customerCareTenantService.getReleaseTasksByReleaseId({ id: releaseId })
                    .success(function (data) {
                        vm.releaseTasks = data;
                    })
                    .error(function () {
                        abp.notify.error("Failed to load releases");
                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            }

            vm.getTaskStatus = function (taskStatus) {
                if (!taskStatus) return '';
                else if (taskStatus == 1) return 'New';
                else if (taskStatus == 2) return 'TBD';
                else if (taskStatus == 3) return 'In Progress';
                else if (taskStatus == 4) return 'Completed';
                else return '';
            };

            vm.getLocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('DD-MMM-YY');
                }
                else {
                    return "";
                }
            };


            vm.getReleaseTasks(vm.releaseId);

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
        }
    ]);
