// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:225471-225695
appModule.controller('tenant.views.joFotara.posting.index', [
        '$scope', 'abp.services.app.joFotaraIntegration', 'utilities', '$uibModal',
        function ($scope, joFotaraIntegrationService, utilities, $uibModal) {

            var vm = this;
            vm.loading = false;
            vm.saving = false;
            vm.response = null;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.filters = {
                enableDateRange: true,
                voucherNo: '',
                fromDate: null,
                toDate: null,
                }

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.getRounding = function (val) {
                if (val) {
                    return utilities.round(val, 2);
                }
                else return "0.00";
            }


            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };
            // Doing this to fetch vouchers from the month as posting start date in Jofotara Configuration for the first time

            function getJofotaraSettings() {
                vm.loading = true;
                joFotaraIntegrationService.getAllSettings().success(function (result) {
                    vm.settings = result;
                    if (vm.settings && vm.settings.configuration) {
                        vm.configuration = vm.settings.configuration;
                        if (vm.configuration.postingStartDate) {
                            var parsedDate = new Date(vm.configuration.postingStartDate);
                            if (!isNaN(parsedDate)) {
                                var year = parsedDate.getFullYear();
                                var month = parsedDate.getMonth(); // 

                                var startDate = new Date(year, month, 1);
                                var endDate = new Date(year, month + 1, 0); 

                                // Setting the date range model
                                vm.dateRangeModel = {
                                    startDate: startDate,
                                    endDate: endDate
                                };
                            }
                        }
                        vm.dateRangeModelChanged();
                    }
                    vm.getVouchersForPosting();
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.viewVoucher = function (invoiceId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/viewModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.viewModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        invoiceId: function () {
                            return invoiceId;
                        },
                        voucherSubtypeId: function () {
                            return null;
                        }
                    }
                });
            };

            vm.dateRangeModelChanged = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };

            

            vm.dateRangeCheck = function () {
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format(abp.setting.get("App.General.DateFormat"))).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format(abp.setting.get("App.General.DateFormat"))).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
            };



            vm.hasSelectedVouchers = function () {
                var hasSelected = false;
                angular.forEach(vm.vouchers, function (voucher) {
                    if (voucher.selected && !voucher.processed) {
                        hasSelected = true;
                    }
                });
                return hasSelected;
            };

            vm.toggleSelectAll = function () {
                angular.forEach(vm.vouchers, function (voucher) {
                    if (!voucher.processed) {
                        voucher.selected = vm.selectAll;
                    }
                });
            };

            vm.postSelectedToJofotara = function () {

                var selectedVouchers = vm.vouchers.filter(function (voucher) {
                    return voucher.selected && !voucher.processed;
                });
                if (selectedVouchers.length === 0) return;
                processVouchersSequentially(selectedVouchers);


            }

            function processVouchersSequentially(vouchers) {
                var index = 0;

                function processNext() {
                    if (index >= vouchers.length) return;

                    var voucher = vouchers[index];
                    voucher.processing = true;

                    // Call your single voucher posting service
                    joFotaraIntegrationService.joFotaraVoucherPosting(voucher.id)
                        .then(function (response) {
                            voucher.processing = false;
                            voucher.processed = true;
                            voucher.postSuccess = response.data.status == "False" ? false : true;
                            voucher.statusMessage = response.data.message;

                            voucher.jofotaraPostings = [{
                                status: response.data.status == "False" ? 2 : 3
                            }];

                            // Process next voucher
                            index++;
                            processNext();
                        })
                        .catch(function (error) {
                            voucher.processing = false;
                            voucher.processed = true;
                            voucher.postSuccess = false;
                            voucher.statusMessage = error.message || 'Failed to process';

                            voucher.jofotaraPostings = [{
                                status: 2
                            }];

                            // Process next voucher even if current one failed
                            index++;
                            processNext();
                        });
                }

                // Start processing
                processNext();
            }

            vm.postToJofotara = function (voucherId) {
                joFotaraIntegrationService.joFotaraVoucherPosting(voucherId).success(function (result) {
                    vm.response = result;
                    if (vm.response.status == "True") {
                        abp.notify.success(app.localize('Successfully Posted'));
                    }
                    else {
                        abp.message.error("Error while Posting")
                    }
                    vm.getVouchersForPosting();
                });
            };

            vm.getVouchersForPosting = function () {
                vm.loading = true;
                joFotaraIntegrationService.getVouchersForPosting(vm.filters).success(function (result) {
                    vm.vouchers = result;
                    vm.vouchers.forEach(x => { x.processed = false; });
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.getVoucherType = function (type) {
                if (type === 1) {
                    return "Invoice";
                }
                else {
                    return "Credit Note";
                }
            }

            function init() {
                getJofotaraSettings();
                
            }


            init();
        }
    ]);
