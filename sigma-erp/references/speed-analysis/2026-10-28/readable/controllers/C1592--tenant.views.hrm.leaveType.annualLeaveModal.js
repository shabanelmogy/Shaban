// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:439265-439305
appModule.controller('tenant.views.hrm.leaveType.annualLeaveModal', [
    '$scope', '$uibModalInstance', 'staffWiseAnnualLeaves',
    function ($scope, $uibModalInstance, staffWiseAnnualLeaves) {
        var vm = this;

        // Modal-specific data
        vm.staffWiseAnnualLeaves = staffWiseAnnualLeaves;

        vm.staffCategories = [
            { name: "Top Management", id: 1 },
            { name: "Manager", id: 2 },
            { name: "General", id: 3 }
        ];
        // Add new row logic for modal
        vm.addAnnualLeaveRow = function () {
            var row = new Object();
            row.order = vm.staffWiseAnnualLeaves.length < 1
                ? 1
                : vm.staffWiseAnnualLeaves[vm.staffWiseAnnualLeaves.length - 1].order + 1;
            vm.staffWiseAnnualLeaves.push(row);
        };

        // Remove row logic for modal
        vm.removeAnnualLeaveRow = function (staffAnnualLeave) {
            var index = vm.staffWiseAnnualLeaves.indexOf(staffAnnualLeave);
            if (index !== -1) {
                vm.staffWiseAnnualLeaves.splice(index, 1);
            }
        };

        // Save changes in modal and pass back data
        vm.save = function () {
            $uibModalInstance.close(vm.staffWiseAnnualLeaves);
        };

        // Close without saving
        vm.cancel = function () {
            $uibModalInstance.dismiss();
        };
    }
]);
