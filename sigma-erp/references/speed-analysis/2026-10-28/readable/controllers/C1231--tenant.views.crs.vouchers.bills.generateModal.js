// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:324233-324378
appModule.controller('tenant.views.crs.vouchers.bills.generateModal', ['appSession', '$stateParams', 'abp.services.app.uaeFine', 'abp.services.app.generateFineBill', '$filter', 'utilities', '$uibModalInstance',
        function (appSession, $stateParams, fineService, generateFineBillService, $filter, utilities, $uibModalInstance) {
            var vm = this;
            vm.loading = false;
            vm.all = false;
            vm.tenantName = appSession.tenant.name;
            vm.setBillDateAsCurrentDate = utilities.parseBoolean(abp.setting.get("App.General.SetBillDateAsCurrentDate"));
            vm.tenancyName = appSession.tenant.tenancyName;
            vm.fileName = appSession.tenant.tenancyName.toLowerCase() + '-' + 'header.png';
            vm.fineAuthoritySupplier = abp.setting.get("App.General.FineAuthoritySupplier");
            vm.enableManuallyDateChange = utilities.parseBoolean(abp.setting.get("App.General.ManuallyDateChangeInFineBillGeneration"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(vm.dateFormat);
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(vm.dateFormat);
            vm.filters = {
                fromDate: null,
                toDate: null,
                dateForAllBills: null,
            };
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };
            vm.allBoxTicked = function () {
                if (vm.finesData == null) return;
                vm.finesData.forEach(function (value) {
                    value.generate = vm.all;
                });
            };
            vm.dateRangeModelChange = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };
            vm.dateForAllBillsChange = function () {
                if (vm.enableManuallyDateChange) {
                    if (vm.finesData == null) return;
                    vm.finesData.forEach(e => {
                        if (!e.billNo) {
                            e.fineDateTime = vm.filters.dateForAllBills;
                        }
                    });
                }
            };
            //vm.datePickerOption = {
            //    format: 'DD/MM/YYYY',
            //    minDate: null
            //};
            //vm.dateChangeForBillGenerationDate = function () {
            //    vm.filters.dateForAllBills = vm.filters.fromDate;
            //};
            //vm.isDateDisabled = function () {
            //    // Convert dates to compare without time
            //    var fromDate = moment(vm.filters.fromDate).startOf('day');
            //    var currentDate = moment().startOf('day');
            //    // Disable if fromDate is after currentDate
            //    return fromDate > currentDate;
            //};
            vm.generate = function () {

                var billsToGenerate = [];
                var i = 1;
                var filteredData = vm.finesData.filter(function (item) {
                    return !item.billId || !item.billNo;
                });
                var billsToGenerate = $filter('filter')(filteredData, {
                    generate: true,
                }, true);

                if (billsToGenerate.length == 0) {
                    vm.saving = false;
                    return;
                }
                billsToGenerate.forEach(function (value) {

                    if (vm.setBillDateAsCurrentDate) {
                        value.date = new Date(Date.now());
                    }
                    else {
                        value.date = value.fineDateTime;
                    }

                });

                vm.saving = true;

                generateFineBillService.generateBills({ billsDue: billsToGenerate }).success(function (data) {
                    generatedBills = data;

                    angular.forEach(generatedBills, function (generateBill) {
                        var foundLines = $filter('filter')(vm.finesData, {
                            fineNo: generateBill.fineNo,
                        }, true);

                        if (foundLines.length > 0) {
                            foundLines[0].billId = generateBill.billId;
                            foundLines[0].billNo = generateBill.billNo;
                            foundLines[0].fineDateTime = generateBill.fineDateTime;
                            foundLines[0].error = generateBill.error;

                        }
                    });


                }).error(function (response) {
                    abp.message.error(response.error);
                    vm.saving = false;

                }).finally(function () {
                    vm.saving = true;
                });
            };

            vm.getFines = function () {

                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                vm.loading = true;
                fineService.getFinesDueToBills(vm.filters).success(function (result) {
                    vm.finesData = result;

                    if (vm.enableManuallyDateChange) {
                        if (vm.finesData == null) return;
                        vm.finesData.forEach(e => {
                            if (vm.filters.dateForAllBills) {
                                e.fineDateTime = vm.filters.dateForAllBills;
                            }
                        });
                    }

                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };


        }]);
