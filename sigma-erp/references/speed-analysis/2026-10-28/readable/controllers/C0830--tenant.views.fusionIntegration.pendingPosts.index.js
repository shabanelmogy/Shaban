// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:223549-223823
appModule.controller('tenant.views.fusionIntegration.pendingPosts.index', [
        '$scope', '$q', 'abp.services.app.fusionIntegration', 'utilities',
        function ($scope, $q, fusionIntegration, utilities) {

            var vm = this;
            vm.loading = false;
            vm.saving = false;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.filters = {
                type: '',
                enableDateRange: true,
                fromDate: null,
                toDate: null
            }

            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().add(-29, 'days').startOf('day'),
                    endDate: moment().endOf('day')
                };
            }

            vm.dateRangeModelChanged = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
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


            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.getRounding = function (val) {
                if (val) {
                    return utilities.round(val, 2);
                }
            }
            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
            vm.localize = function (value) {
                return app.localize(value);
            };

            vm.enterKeyPress = function (eventOnKeyPress) {
                if (eventOnKeyPress.which === 13) {
                    vm.pendingVouchers();
                    eventOnKeyPress.preventDefault();
                }
            }

            vm.allBoxTicked = function () {
                if (vm.vouchers == null) return;

                angular.forEach(vm.vouchers, function (row) {
                    row.checked = vm.all;
                });
                if (vm.all == true) {
                    vm.savingDisable = false;
                }
                else {
                    vm.savingDisable = true;
                }
            };

            vm.typeSummary = [];
            vm.totalAmount = 0;
            vm.calculateTypeSummary = function (row) {
                if (!row || !row.type) return;


                let existingSummary = vm.typeSummary.find(summary => summary.type === row.type);

                if (row.checked) {
                    if (existingSummary) {
                        existingSummary.count++;
                        existingSummary.amount += row.amount || 0;
                    } else {
                        vm.typeSummary.push({ type: row.type, count: 1, amount: row.amount || 0 });
                    }
                    vm.totalAmount += row.amount || 0;

                }
                else {
                    if (existingSummary) {
                        existingSummary.count--;
                        existingSummary.amount -= row.amount || 0;

                        if (existingSummary.count === 0) {
                            vm.typeSummary = vm.typeSummary.filter(summary => summary.type !== row.type);
                        }
                    }
                    vm.totalAmount -= row.amount || 0;
                }
            };

            vm.toggleAllRows = function (isChecked) {
                vm.typeSummary = [];
                vm.totalAmount = 0;

                angular.forEach(vm.vouchers, function (row) {
                    row.checked = isChecked; // Update all rows' checked state

                    if (isChecked) {
                        let existingSummary = vm.typeSummary.find(summary => summary.type === row.type);

                        if (existingSummary) {
                            existingSummary.count++;
                            existingSummary.amount += row.amount || 0;
                        } else {
                            vm.typeSummary.push({ type: row.type, count: 1, amount: row.amount || 0 });
                        }
                        vm.totalAmount += row.amount || 0;
                    }
                });
            };

            vm.savingDisable = true;
            vm.boxTicked = function () {
                angular.forEach(vm.vouchers, function (row) {
                    if (row.checked == true) {
                        vm.savingDisable = false;
                    }
                });
            }

            vm.postToFusion = () => {
                let vouchersToPost = [];
                angular.forEach(vm.vouchers, (v) => {
                    if (v.checked == true && !v.isShared) {
                        vouchersToPost.push(v);
                    }
                });

                vm.saving = true;
                vm.loading = true;
                let batchSize = 10; // Set your desired batch size
                let vouchersToPostChunks = chunkArray(vouchersToPost, batchSize);
                let allBatches = vouchersToPostChunks.reduce((chain, batch) => {
                    return chain.then(() => $q.when(processBatch(batch)));
                }, $q.resolve());

                allBatches.finally(() => {
                    vm.saving = false;
                    vm.loading = false;

                    let postedSuccessfully = vouchersToPost.filter(v => v.posted && !v.isError).length;
                    let postedWithError = vouchersToPost.filter(v => v.posted && v.isError).length;
                    abp.message.info(`Successfully posted (${postedSuccessfully}). Posted with error (${postedWithError}).`);
                });
            }

            function processBatch(batch) {
                let promises = batch.map(v => {
                    if (v.typeValue === 1) {
                        return fusionIntegration.postInvoice(v)
                            .success((result) => {
                                changeVoucherStateAfterPosting(result);
                            });
                    } else if (v.typeValue === 8) {
                        return fusionIntegration.postCreditNote(v)
                            .success((result) => {
                                changeVoucherStateAfterPosting(result);
                            });
                    } else if (v.typeValue === 9) {
                        return fusionIntegration.postDebitNote(v)
                            .success((result) => {
                                changeVoucherStateAfterPosting(result);
                            });
                    } else if (v.typeValue === 10) {
                        return fusionIntegration.postDeposit(v)
                            .success((result) => {
                                changeVoucherStateAfterPosting(result);
                            });
                    } else if (v.typeValue === 20) {
                        return fusionIntegration.postDepositUsed(v)
                            .success((result) => {
                                changeVoucherStateAfterPosting(result);
                            });
                    } else if (v.typeValue === 3 && v.voucherSubTypeId === 15) {
                        return fusionIntegration.postDepositRefund(v)
                            .success((result) => {
                                changeVoucherStateAfterPosting(result);
                            });
                    } else {

                    }
                });

                return Promise.all(promises);
            }

            function chunkArray(array, size) {
                let result = [];
                for (let i = 0; i < array.length; i += size) {
                    result.push(array.slice(i, i + size));
                }
                return result;
            }

            function changeVoucherStateAfterPosting(result) {
                let voucher = vm.vouchers.find(x => x.id === result.id);
                voucher.isShared = result.isShared;
                voucher.isError = result.isError;
                voucher.notes2 = result.notes2;
                voucher.posted = true;
                if (!voucher.isError) {
                    voucher.checked = false;
                }
            }

            vm.exportToExcel = function () {
                vm.loading = true;
                vm.dateRangeCheck();

                fusionIntegration.exportToExcel(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.getPendingVouchers = function () {
                vm.loading = true;
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                fusionIntegration.pendingVouchers(vm.filters).success(function (result) {
                    if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null)
                        initDate();
                    vm.vouchers = result;
                }).finally(function () {
                    vm.loading = false;
                });
            }


            vm.init = function () {
                vm.loading = true;
                initDate();
                vm.getPendingVouchers();
            };

            vm.init();
        }
    ]);
