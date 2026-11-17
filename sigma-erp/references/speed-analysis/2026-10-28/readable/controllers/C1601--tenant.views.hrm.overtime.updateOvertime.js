// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:441622-441694
appModule.controller('tenant.views.hrm.overtime.updateOvertime', [
        '$uibModalInstance', 'abp.services.app.overtime', 'options',
        function ($uibModalInstance, overtimeService, options) {

            var vm = this;
            vm.loading = false;

            var overtimeId = options.id;
            vm.modifiedRows = [];

            vm.filters = {
                skipCount: 0,
                maxResultCount: vm.batchSize
            };
            vm.filters.fromDate = moment(vm.filters.monthYear).startOf('month').startOf('day');
            vm.filters.toDate = moment(vm.filters.monthYear).endOf('month').endOf('day').subtract(1, 'milliseconds');

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            // Save function
            vm.save = function () {
                vm.isSaving = true;

                // Send only the modified rows to the backend
                var modifiedData = vm.modifiedRows.map(function (row) {
                    return {
                        staffId: row.staffId,
                        oTHNormal: row.normalOTHours,
                        oTHHoliday: row.holidayOTHours,
                        totalOvertime: row.normalOTHours + row.holidayOTHours
                    };
                });

                overtimeService.createOrUpdateOvertime({
                    id: overtimeId,
                    fromDate: vm.filters.fromDate,
                    toDate: vm.filters.toDate,
                    staffOvertimes: modifiedData
                })
                    .success((id) => {
                        vm.isOverTimeForApprove = true;
                        vm.isSaved = true;
                        abp.notify.success("Overtime Updated Successfully.");

                    })
                    .finally(() => {
                        vm.isSaving = false;
                        vm.isOvertimeForSave = false;
                        $uibModalInstance.close();
                    });
            };

            // Function to track changes
            vm.onOvertimeChange = function (row) {
                if (!vm.modifiedRows.includes(row)) {
                    vm.modifiedRows.push(row);
                }
            };

            function init() {
                vm.loading = true;
                overtimeService.getOvertimeForEdit({ id: overtimeId }).success(function (result) {
                    vm.overtime = result;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
