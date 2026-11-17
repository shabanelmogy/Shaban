// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:99376-99535
appModule.controller('tenant.views.common.hrm.payrolls.payrollApprovalModal', ['abp.services.app.purchaseOrder', 'abp.services.app.salaryVoucher', '$scope', '$uibModal', 'uiGridConstants', 'utilities', 'abp.services.app.payroll', 'payrollId', '$uibModalInstance',
        function (purchaseOrdersService, salaryVouchersService, $scope, $uibModal, uiGridConstants, utilities, payrollService, payrollId, $uibModalInstance) {

            var vm = this;
            vm.loading = false;
            vm.approving = false;
            vm.showApprovalStatus = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.currency = abp.setting.get("App.General.CurrencyCode");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.vouchersList = [];
            vm.filters = {
                enableDateRange: true,
                voucherNo: null,
                fromDate: null,
                toDate: null,
                contactId: null,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                paginate: true,
                salaryVoucherType: null,
            }
            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.getType = function (value) {
                return utilities.getPayrollType(value);
            };
            vm.salaryVoucherTypes = function (value) {
                if (value === 111) {
                    return 'Regular';
                }
                else if (value === 112) {
                    return 'Leave Salary';
                }
                else {
                    return 'Final Settlement';
                }
            };

            vm.permissions = {
                view: abp.auth.hasPermission('Pages.HRM.SalaryVoucher.View'),
                delete: abp.auth.hasPermission('Pages.HRM.SalaryVoucher.Delete'),
            };
            vm.dateRangeCheck = function () {

                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
            };

            vm.dateRangeModelChanged = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };

            vm.salaryVoucherType = [{ id: 111, name: 'Regular' }, { id: 112, name: 'Leave Salary' }, { id: 113, name: 'Final Settlement' }];

            vm.isPrintEnabled = function (voucher) {
                return utilities.canPrintVoucher(voucher);
            };


            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().add(-29, 'days').startOf('day'),
                    endDate: moment().endOf('day')
                };
            }

            vm.approvePayroll = function (payrollId) {

                salaryVouchersService.getPayrollRecord(payrollId).success(function (data) {
                    vm.payrollData = data;
                    vm.totalCount = data.totalCount;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            // Get payroll on id
            vm.getPayroll = function () {
                vm.approving = true;
                vm.showApprovalStatus = true;
                vm.filters.id = payrollId;

                function fetchPayrollData() {
                    vm.filters.skipCount = vm.skipCount;

                    return salaryVouchersService.getPayrollDetailsByPayrollId(vm.filters)
                        .then(function (response) {
                            if (response.data.vouchers && Array.isArray(response.data.vouchers)) {
                                vm.vouchersList = vm.vouchersList.concat(response.data.vouchers);
                                vm.payrollData.countWithVoucherId += response.data.vouchers.length;
                            }
                            vm.skipCount += vm.batchSize;
                            if (vm.skipCount < vm.totalCount) {
                                return fetchPayrollData(); // Recursive call
                            }
                        })
                }

                // Start fetching data
                fetchPayrollData()
                    .finally(function () {
                        vm.approving = false;
                    });
            };

            vm.cancel = () => {
                if (vm.payrollData.countWithVoucherId) {
                    if (vm.totalCount === vm.payrollData.countWithVoucherId) {
                        $uibModalInstance.close(true);
                    } else {
                        $uibModalInstance.close(false);
                    }
                }
                else
                    $uibModalInstance.close(false);
            };

            function init() {
                vm.loading = true;
                vm.skipCount = 0;
                vm.batchSize = 5;
                /*vm.totalCount = 0;*/
                vm.filters = {
                    skipCount: 0,
                    maxResultCount: vm.batchSize
                };
                initDate();
                vm.approvePayroll(payrollId);
            }
            init();
        }]);
