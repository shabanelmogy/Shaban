// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:78180-78212
appModule.controller('host.views.reports.sales.createOrEditMilestoneModal', [
        '$scope', '$uibModalInstance', 'milestone', 'isEdit',
        function ($scope, $uibModalInstance, milestone, isEdit) {

            var vm = this;
            vm.loading = false;
            vm.saving = false;
            vm.isEdit = isEdit;
          
            vm.milestone = milestone || {};

            vm.save = function () {
                vm.saving = true;
                $uibModalInstance.close(vm.milestone);
                vm.saving = false;
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('DD-MMM-YY');
                }
                else {
                    return "";
                }
            };

        }
    ]);
