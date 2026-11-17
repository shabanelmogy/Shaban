// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:122938-123085
appModule.controller('tenant.views.crs.accounting.fiscalYear.closeFiscalYearModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.fiscalYear', '$filter', '$interval', 'fiscalYearId',
        function ($scope, $uibModal, $uibModalInstance, fiscalYearService, $filter, $interval, fiscalYearId) {

            var vm = this;
            vm.loading = false;

            vm.all = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));

            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc()
            };

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.getlocalDateTime = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.allBoxTicked = function () {
                if (vm.findAgreements === null) return;
                angular.forEach(vm.findAgreements, function (invoiceDue) {
                    invoiceDue.generate = vm.all;
                });
            };
            vm.nextValidFiscalYear = function () {
                vm.validFiscalYearClass = 'done';
                vm.voucherApprovalsClass = 'active';
                vm.showValidFiscalYear = false;
                vm.showVoucherApprovals = true;
                vm.verfiyVoucherApprovals();
            };
            // at voucher approvals
            vm.nextVoucherApprovals = function () {
                vm.voucherApprovalsClass = 'done';
                vm.dataInconsistencyClass = 'active';
                vm.showVoucherApprovals = false;
                vm.showDataInconsistency = true;
                vm.verfiyDataInconsistency();
            };
            vm.previousVoucherApprovals = function () {
                vm.showVoucherApprovals = false;
                vm.showValidFiscalYear = true;
                vm.validFiscalYearClass = 'active';
                vm.voucherApprovalsClass = '';
            };
            //at data inconstistancy
            vm.nextDataInconsistency = function () {
                vm.dataInconsistencyClass = 'done';
                vm.closeFiscalYearClass = 'active';
                vm.showDataInconsistency = false;
                vm.showCloseFiscalYear = true;
                vm.closeFiscalYear();
            };
            vm.previousDataInconsistency = function () {
                vm.showDataInconsistency = false;
                vm.showVoucherApprovals = true;
                vm.voucherApprovalsClass = 'active';
                vm.dataInconsistencyClass = '';
            };
            //at closing FY
            vm.previousCloseFiscalYear = function () {
                vm.showCloseFiscalYear = false;
                vm.showDataInconsistency = true;
                vm.dataInconsistencyClass = 'active';
                vm.closeFiscalYearClass = '';
                
            };
            vm.finishInvoice = function () {
                vm.invoiceClass = 'done';
            };
            vm.cancel = function () {
                $uibModalInstance.close();
            };

            vm.verfiyValidFiscalYear = function () {
                vm.processing = true;
                fiscalYearService.verfiyValidFiscalYear({ id: fiscalYearId }).success(function (data) {
                    vm.validationError = data;
                    if (!vm.validationError)
                        vm.validFiscalYearChecked = true;

                }).finally(function () {
                    vm.processing = false;
                });
            };
            vm.verfiyVoucherApprovals = function () {
                vm.processing = true;
                fiscalYearService.verfiyVoucherApprovals({ id: fiscalYearId }).success(function (data) {
                    vm.approvalError = data;
                    if (!vm.approvalError)
                        vm.voucherApprovalsChecked = true;

                }).finally(function () {
                    vm.processing = false;
                });
            };
            vm.verfiyDataInconsistency = function () {
                vm.processing = true;
                fiscalYearService.verfiyDataInconsistency({ id: fiscalYearId }).success(function (data) {
                    vm.consistancyError = data;
                    if (!vm.consistancyError)
                        vm.dataInconsistencyChecked = true;
                }).finally(function () {
                    vm.processing = false;
                });
            };


            function init() {
                vm.validFiscalYearClass = 'active';
                vm.showValidFiscalYear = true;
                vm.showVoucherApprovals = false;
                vm.showDataInconsistency = false;
                vm.showCloseFiscalYear = false;

                vm.validFiscalYearChecked = false;
                vm.voucherApprovalsChecked = false;
                vm.dataInconsistencyChecked = false;
                vm.verfiyValidFiscalYear();
            }

            vm.closeFiscalYear = function () {
                vm.processing = true;
                fiscalYearService.closeFiscalYear({ id: fiscalYearId })
                    .success(function (data) {
                        vm.processing = false;
                        vm.closingError = data;
                    }).finally(function () {
                        vm.processing = false;
                    });

            };

            init();
        }
    ]);
