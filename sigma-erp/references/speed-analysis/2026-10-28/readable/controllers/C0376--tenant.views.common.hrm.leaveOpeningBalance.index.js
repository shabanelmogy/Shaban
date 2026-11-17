// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:97703-97811
appModule.controller('tenant.views.common.hrm.leaveOpeningBalance.index', [
        '$scope', 'abp.services.app.leaveOpeningBalance', 'abp.services.app.leaveType',
        function ($scope, leaveOpeningBalanceService, leaveTypeService) {
            var vm = this;
            vm.loading = false;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.leaveTypeId = null;
            vm.modifiedLeaveRecordRows = [];

            vm.save = function () {
                vm.saving = true;

                var rawData = vm.modifiedLeaveRecordRows.length > 0 ? vm.modifiedLeaveRecordRows : vm.leaveOpeningBalanceList;
                var dataToSend = rawData.map(function (row) {
                    return {
                        leaveTypeId: row.leaveTypeId,
                        staffId: row.staff.id,
                        openingBalance: row.openingBalance,
                        lastRejoiningDate: row.lastRejoiningDate,
                        lastTicketIssuanceDate: row.lastTicketIssuanceDate,
                        cutOfDate: row.cutOfDate
                    };
                });

                leaveOpeningBalanceService.createOrUpdateLeaveOpeningBalance({
                    LeaveTypeId: vm.leaveTypeId,
                    LeaveOpeningBalance: dataToSend
                })
                    .success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        vm.getLeaveOpeningBalanceList();
                    })
                    .finally(function () {
                        vm.saving = false;
                        vm.modifiedLeaveRecordRows = [];
                    });
            };

            async function getLeaveTypes() {
                try {
                    const response = await leaveTypeService.getLeaveType({});
                    vm.leaveTypes = response.data.items;
                } catch (error) {

                }
            }

            vm.getLeaveOpeningBalanceList = () => {
                vm.loading = true;
                leaveOpeningBalanceService.getLeaveOpeningBalancesForEdit(vm.leaveTypeId)
                    .then((response) => {
                        if (response && response.data.items) {
                            vm.leaveOpeningBalanceList = response.data.items;
                        } else {
                            vm.leaveOpeningBalanceList = [];
                        }
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.getAllLeaveOpeningBalance = () => {
                vm.loading = true;

                vm.selectedLeaveType = vm.leaveTypes.find(function (leaveType) {
                    return leaveType.id === vm.leaveTypeId;
                });

                leaveOpeningBalanceService.createOrUpdateLeaveOpeningBalance({
                    LeaveTypeId: vm.leaveTypeId,
                })
                    .then(function (response) {
                        vm.leaveOpeningBalanceList = response.data.items;
                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            };

            vm.removeLeaveOpeningBalanceRow = function (row) {
                var index = vm.leaveOpeningBalanceList.indexOf(row);
                vm.leaveOpeningBalanceList.splice(index, 1);
            };

            vm.addLeaveOpeningBalanceRow = function (row) {
                if (vm.leaveOpeningBalanceList == undefined) {
                    vm.leaveOpeningBalanceList = [];
                }
                vm.leaveOpeningBalanceList.push(
                    {
                        staffId: null,
                        openingBalance: 0,
                        lastRejoiningDate: null,
                        lastTicketIssuanceDate: null,
                        cutOfDate: null,
                    });
            };

            function init() {
                getLeaveTypes();
            }

            init();
        }
    ]);
