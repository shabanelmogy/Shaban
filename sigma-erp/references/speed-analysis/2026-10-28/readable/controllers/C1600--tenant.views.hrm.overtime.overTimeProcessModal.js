// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:441360-441616
appModule.controller('tenant.views.hrm.overtime.overTimeProcessModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.overtime',

        function ($scope, $uibModal, $uibModalInstance, overtimeService) {

            var vm = this;
            vm.permissions = {
                import: abp.auth.hasPermission('Pages.HRM.Overtime.Import'),
            };

            vm.isGranted = function (permission) {
                return abp.auth.isGranted(permission);
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.monthChanged = function () {

                vm.isProcessEnabled = true;
                vm.isImportEnabled = false;
                vm.isOvertimeForSave = false;
                vm.isOverTimeForApprove = false;
                vm.isSaved = false;
                vm.isApproved = false;
                vm.overtime = [];
                vm.overtimeCount = 0;
            };

            vm.processReferesh = function () {

                if (!vm.filters.monthYear) {
                    abp.message.warn("Please select month first.");
                    return;
                }

                vm.overtime = [];
                vm.isProcess = true;
                vm.loading = true;

                vm.filters.startDate = moment(vm.filters.monthYear).startOf('month').startOf('day');
                vm.filters.endDate = moment(vm.filters.monthYear).endOf('month').endOf('day').subtract(1, 'milliseconds');

                overtimeService.overtimeState(vm.filters)
                    .success(function (s) {
                        vm.state = s;

                        if (s === 3) {

                            abp.message.warn(
                                'Unable to process this month. Overtime for this month is already Processed and Approved.'
                            );

                            vm.isProcess = false;
                            vm.loading = false;
                            return;
                        }

                        vm.filters.isReprocess = false;
                        vm.process();
                    })

                    .error(function () {
                        vm.isProcess = false;
                        vm.loading = false;
                    });
            };

            vm.process = function () {

                vm.loading = true;
                vm.filters.startDate = moment(vm.filters.monthYear).startOf('month').startOf('day');
                vm.filters.endDate = moment(vm.filters.monthYear).endOf('month').endOf('day').subtract(1, 'milliseconds');

                overtimeService.getStaffsOvertimes(vm.filters)
                    .success(function (data) {

                        vm.overtime = data || [];

                        angular.forEach(
                            vm.overtime,
                            function (row) {

                                row.isImported = false;

                            }
                        );

                        vm.overtimeCount = vm.overtime.length;
                        vm.isImportEnabled = true;
                        vm.isOvertimeForSave = vm.overtime.length > 0;

                    })
                    .finally(function () {

                        vm.loading = false;
                        vm.isProcess = false;
                        vm.isProcessEnabled = false;

                    });

            };

            vm.openImportModal = function () {

                if (!vm.filters.monthYear) {

                    abp.message.warn("Please select month first.");
                    return;
                }

                if (!vm.isImportEnabled) {

                    abp.message.warn("Please process the month first.");
                    return;
                }

                var modalInstance =
                    $uibModal.open({

                        templateUrl: '~/App/tenant/views/hrm/overtime/importOvertime.cshtml',
                        controller: 'tenant.views.hrm.overtime.importOvertime as vm',
                        backdrop: 'static',
                        size: 'xl'

                    });

                modalInstance.result.then(
                    function (result) {

                        if (!result || result.length === 0) {
                            return;
                        }

                        vm.mergeImportedOvertimes(result);
                    }
                );
            };

            vm.mergeImportedOvertimes =
                function (importedRows) {

                    if (!vm.overtime) {

                        vm.overtime = [];
                    }
                    angular.forEach(
                        importedRows,
                        function (excelRow) {

                            if (excelRow.importStatus !== 'success') {
                                return;
                            }

                            var index =
                                vm.overtime.findIndex(
                                    function (row) {

                                        return row.staffId === excelRow.staffId;
                                    }
                                );

                            var importedRow = {
                                staffId: excelRow.staffId,
                                staffName: excelRow.name,
                                code: excelRow.employeeCode,
                                designation: excelRow.designation,
                                othNormal: excelRow.normalOTHours,
                                othHoliday: excelRow.holidayOTHours,
                                totalOvertime: excelRow.normalOTHours + excelRow.holidayOTHours,
                                dateAndTime: excelRow.dateAndTime,
                                isImported: true
                            };
                            if (index >= 0) {

                                vm.overtime[index] = importedRow;
                            }
                            else {

                                vm.overtime.push(importedRow);
                            }
                        }
                    );

                    vm.overtimeCount = vm.overtime.length;
                    vm.isOvertimeForSave = vm.overtime.length > 0;
                    vm.isImportEnabled = true;
                };

            vm.save = function () {

                if (!vm.overtime || vm.overtime.length === 0) {
                    abp.message.warn("No overtime records available to save.");
                    return;
                }
                vm.isSaving = true;
                overtimeService.save({

                    fromDate: vm.filters.startDate,
                    toDate: vm.filters.endDate,
                    staffOvertimes: vm.overtime
                })
                    .success(function (id) {

                        vm.isOverTimeForApprove = true;
                        vm.isSaved = true;
                        abp.notify.success("Successfully saved overtime.");
                    })
                    .finally(function () {
                        vm.isSaving = false;
                        vm.isOvertimeForSave = false;
                        $uibModalInstance.close();
                    });
            };

            vm.rounding = function (value) {

                if (value === null || value === undefined) {
                    return null;
                }

                return value.toLocaleString(
                    'en',
                    {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }
                );
            };

            function init() {

                vm.isProcessEnabled = false;
                vm.isImportEnabled = false;
                vm.isProcess = false;
                vm.isOvertimeForSave = false;
                vm.isSaving = false;
                vm.isOverTimeForApprove = false;
                vm.isApproving = false;
                vm.isSaved = false;
                vm.isApproved = false;
                vm.skipCount = 0;
                vm.batchSize = 10;
                vm.totalCount = 0;
                vm.state = 1;
                vm.overtime = [];
                vm.overtimeCount = 0;
                vm.filters = {
                    skipCount: 0,
                    maxResultCount:
                        vm.batchSize
                };
            }
            init();
        }
    ]);
