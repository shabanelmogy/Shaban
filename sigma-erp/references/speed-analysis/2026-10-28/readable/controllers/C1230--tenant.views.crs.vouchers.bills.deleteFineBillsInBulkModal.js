// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:324129-324230
appModule.controller('tenant.views.crs.vouchers.bills.deleteFineBillsInBulkModal', ['appSession', '$stateParams', 'abp.services.app.uaeFine', 'abp.services.app.generateFineBill', 'abp.services.app.bill', '$filter', 'utilities', '$uibModalInstance',
        function (appSession, $stateParams, fineService, generateFineBillService, billService, $filter, utilities, $uibModalInstance) {
            var vm = this;
            vm.loading = false;
            vm.all = false;
            vm.approvedTypes = [{ id: 2, name: 'Approved' }, { id: 3, name: 'Not Approved' }, { id: 4, name: 'Rejected' }];
            vm.approveAllEnableBotton = false;
            vm.fineAuthoritySupplier = abp.setting.get("App.General.FineAuthoritySupplier");
            vm.isApprovedEnabled = abp.features.isEnabled("CRS.Vouchers.Approval.Bills");
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(vm.dateFormat);
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(vm.dateFormat);

            vm.filters = {
                enableDateRange: true,
                voucherNo: null,
                refNo: null,
                vehicleId: null,
                vehicle: null,
                fromDate: null,
                toDate: null,
                status: 1,
                approvedType:3,
                isPaymentPlanDefined: false,
                skipCount: 0,
                printingWithoutLogo: false,
                maxResultCount: 1000,
                billDateFilter: 1,
                enableSupplierBillDate: false
            }

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.dateRangeModelChange = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };

            vm.allBoxTicked = function () {
                if (vm.billsData == null) return;
                vm.billsData.forEach(function (value) {
                    value.deleteBill = vm.all;
                });
            };


            vm.deleteBill = function () {
                var selectedBills = vm.billsData.filter(function (bill) {
                    return bill.deleteBill;
                });

                if (selectedBills.length === 0) {
                    abp.message.warn(app.localize('SelectBillsToDelete'));
                    return;
                }

                abp.message.confirm(
                    app.localize('DeleteWarningMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            var billIds = selectedBills.map(function (bill) {
                                return bill.id;
                            });

                            generateFineBillService.deleteBillsInBulk(billIds).success(function () {
                                vm.getBills();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };


            vm.getBills = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                //vm.filters.status = 1;
                //vm.filters.approvedType = 1;
                vm.loading = true;
                billService.getFineBillsBulk(vm.filters).success(function (data) {
                    vm.billsData = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };


            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
        }]);
