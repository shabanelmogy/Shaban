// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:241396-241876
appModule.controller('tenant.views.crs.lease.masterAgreements.masterAgreementModal', [ '$uibModal', '$uibModalInstance', 'utilities',
        'abp.services.app.directory', 'abp.services.app.vehicleModel', 'abp.services.app.costSetting', 'abp.services.app.chargesSetting', '$filter', 'abp.services.app.leaseMasterAgreement', 'abp.services.app.costParameter', 'leaseQuotation',
        function ( $uibModal, $uibModalInstance, utilities, directoryService, vehicleModelService, costSettingService, chargesSettingService, $filter, masterAgreementService, costParameterService, leaseQuotation) {
            var vm = this;
            vm.customers = [];
            vm.models = [];

            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };

            vm.localize = function (input) {
                return app.localize(input);
            };
            vm.masterAgreementPar = leaseQuotation;
            var leaseQuotationId = leaseQuotation.id;
            function quotationLineObject() {
                var line = new Object();
                line.modelId = null;
                line.model = null;
                line.years = null;
                line.vehiclePrice = null;
                line.cost = 0;
                line.extras = 0;
                line.profitMarkup = null;
                line.markup = null;
                line.amountPerVehicle = null;
                line.amountPerMonth = null;
                line.quantity = null;
                line.total = 0;
                line.costLines = [];
                line.extrasLines = vm.chargesSettings;
                return line;
            }

            vm.searchContact = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            // extended search using search contact popup
            vm.searchContactPopoup = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return null;
                        },
                        type: function () {
                            return 2;
                        }
                    }
                }).result.then(function (customer) {
                    if (customer != null) {
                        vm.expensePayment.contact = customer;
                    }
                });
            };

            vm.searchModel = function ($select) {
                return vehicleModelService.searchVehicleModelsNew({ name: $select.search }).then(function (response) {
                    vm.models = response.data.items;
                });
            };

            vm.getStatus = function (code) {
                if (code === 1)
                    return "Open";
                else if (code === 2)
                    return "Approved";
                else if (code === 3)
                    return "Rejected";
                else
                    return "Open";
            };

            vm.modelSelected = function (line) {
                vm.loading = true;
                costSettingService.getCostSettingByModel({ id: line.vehicleModel.id }).success(function (data) {
                    line.costDetailLoaded = data.settingLines;
                    line.costLines = [];
                    //if (line.years) {
                    //    line.costDetailLoaded.forEach(function (row) {
                    //        if (line.years >= row.from && (line.years <= row.to || line.to == 0)) {
                    //            line.costLines.push(row);
                    //        }
                    //    });
                    //}
                    line.profitMarkup = data.markupPercent;
                    vm.calculate(line);
                }).finally(function () {
                    vm.loading = false;
                });


                if (line.quantity == null)
                    line.quantity = 1;
            };

            vm.periodChanged = function (line) {
                //  line.costLines = [];
                //line.costDetailLoaded.forEach(function (row) {
                //    if (line.years >= row.from && (line.years <= row.to || line.to == 0)) {
                //        line.costLines.push(row);
                //    }
                //});
                vm.calculate(line);
            };

            //Add row
            vm.addRow = function () {
                vm.masterAgreement.quotation.quotationLines.push(quotationLineObject());
            };

            //Remove row
            vm.removeRow = function (obj) {
                var index = vm.masterAgreement.quotation.quotationLines.indexOf(obj);
                vm.masterAgreement.quotation.quotationLines.splice(index, 1);

            };

            // Opening Calculation PopUp
            vm.calculationDetail = function (quotationLine) {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/lease/leaseQuotations/calculationDetail.cshtml',
                    controller: 'tenant.views.crs.lease.leaseQuotations.calculationDetail as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        quotationLine: function () {
                            return quotationLine;
                        },
                        taxPercent: function () {
                            return vm.masterAgreement.taxPercent;
                        },
                        costingParameters: function () {
                            return vm.costingParameters;
                        },
                        viewMode: function () {
                            return false;
                        }
                    }
                });
            };

            vm.calculationDetailView = function (quotationLine) {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/lease/leaseQuotations/calculationDetail.cshtml',
                    controller: 'tenant.views.crs.lease.leaseQuotations.calculationDetail as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        quotationLine: function () {
                            return quotationLine;
                        },
                        taxPercent: function () {
                            return vm.masterAgreement.taxPercent;
                        },
                        costingParameters: function () {
                            return vm.costingParameters;
                        },
                        viewMode: function () {
                            return true;
                        }
                    }
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function checkPeriod(row, index, costParamIdArgument) {
                return row.costParamId == costParamIdArgument && index >= row.from && index <= row.to;
            }

            vm.calculate = function (line) {
                if (line.years == null || line.quantity == null || line.vehiclePrice == null)
                    return;

                if (line.costLines.length == 0) {
                    vm.costingParameters.forEach(function (row) {
                        line.costLines.push({
                            costParam: row,
                            costParamId: row.id,
                            detail: ''
                        });
                    });
                }


                var years = parseFloat(line.years);
                var quantity = parseFloat(line.quantity);
                var vehiclePrice = parseFloat(line.vehiclePrice);

                if (years <= 0 || quantity <= 0 || vehiclePrice <= 0)
                    return;

                var cost = 0.0;
                var i = 0;
                var tax = 0.0;

                for (i = 0; i < line.costLines.length; i++) {   
                    var costLineAmount = 0.0;
                    var description = '';
                    for (j = 1; j <= years; j++) {

                        var filteredRow = null;
                        if (line.costDetailLoaded != null) {
                            for (k = 0; k < line.costDetailLoaded.length; k++) {
                                if (line.costDetailLoaded[k].costParamId == line.costLines[i].costParamId && j >= line.costDetailLoaded[k].from && (j <= line.costDetailLoaded[k].to || line.costDetailLoaded[k].to == 0)) {
                                    filteredRow = line.costDetailLoaded[k];
                                    break;
                                }
                            }
                        }


                        if (filteredRow && filteredRow.rateTypeId == 14) { // /year
                            costLineAmount = costLineAmount + utilities.round(filteredRow.rate, 0);
                            description = description + 'Year ' + j + ': ' + filteredRow.rate + ' ' + filteredRow.rateType.name + ','

                        } else if (filteredRow && filteredRow.rateTypeId == 15) { // % /year
                            costLineAmount = costLineAmount + utilities.round(vehiclePrice * filteredRow.rate / 100, 0);
                            description = description + 'Year ' + j + ': ' + filteredRow.rate + ' ' + filteredRow.rateType.name + ','
                        }
                        //   console.log(filteredRow);
                    }

                    line.costLines[i].amount = costLineAmount;
                    line.costLines[i].detail = description;

                    //if (line.costLines[i].rateTypeId == 14) { // /year
                    //    line.costLines[i].amount = utilities.round(line.costLines[i].rate * years, 0);

                    //} else { // % /year
                    //    line.costLines[i].amount = utilities.round(vehiclePrice * line.costLines[i].rate / 100 * years, 0);
                    //}

                    cost += line.costLines[i].amount;
                }

                var extras = 0.0;

                for (i = 0; i <= line.extrasLines.length - 1; i++) {
                    if (line.extrasLines[i].accepted && line.extrasLines[i].rate)
                        line.extrasLines[i].charges = parseFloat(line.extrasLines[i].rate) * parseFloat(line.years);
                    else
                        line.extrasLines[i].charges = 0;

                    extras += line.extrasLines[i].charges;
                }

                line.cost = cost;
                line.extras = extras;
                //line.markup = utilities.round((parseFloat(line.vehiclePrice) + parseFloat(line.cost) + parseFloat(line.extras)) * line.profitMarkup / 100, 0);
                line.markup = utilities.round((parseFloat(line.cost) + parseFloat(line.extras)) * line.profitMarkup / 100, 0);
                //line.amountPerVehicle = parseFloat(line.vehiclePrice) + parseFloat(line.cost) + parseFloat(line.extras) + line.markup;
                line.amountPerVehicle = parseFloat(line.cost) + parseFloat(line.extras) + line.markup;
                line.amountPerMonth = utilities.round(line.amountPerVehicle / years / 12, 2);
                line.total = utilities.round(line.amountPerVehicle * quantity, 0);
                line.amount = line.total;

                if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 
                    //equation solved from following formula... 
                    //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
                    var chargesWithoutTax = (line.amount * 100) / (100 + vm.masterAgreement.taxPercent);
                    tax = utilities.round(line.amount - chargesWithoutTax, 2);

                } else {
                    //prices are without tax. calculate tax and include in total
                    tax = utilities.round(line.amount * vm.masterAgreement.taxPercent / 100, 2);

                }

                line.tax = tax;
                vm.sum();
            };

            vm.sum = function () {
                //if (vm.masterAgreement == null)
                //    return 0;

                //if (vm.masterAgreement.quotationLines == null)
                //    return 0;

                //var sum = 0;
                //for (var i = 0; i < vm.masterAgreement.quotationLines.length; i++) {
                //    if (vm.masterAgreement.quotationLines[i].total != null) {
                //        sum = sum + parseFloat(vm.masterAgreement.quotationLines[i].total);
                //    }
                //}

                //return sum;

                var totalAmount = 0.0;
                var totalTax = 0.0;
                for (var i = 0; i < vm.masterAgreement.quotation.quotationLines.length; i++) {
                    if (vm.masterAgreement.quotation.quotationLines[i].total != null) {
                        totalAmount = totalAmount + parseFloat(vm.masterAgreement.quotation.quotationLines[i].total);
                        totalTax = totalTax + parseFloat(vm.masterAgreement.quotation.quotationLines[i].tax);
                    }
                }
                vm.masterAgreement.tax = totalTax;
                vm.masterAgreement.amount = vm.isTaxInclusive ? utilities.round(totalAmount, 2) : (utilities.round(totalAmount, 2) + utilities.round(totalTax, 2)) / 1;
                vm.masterAgreement.amount = utilities.round(vm.masterAgreement.amount, 2);
                vm.masterAgreement.tax = utilities.round(vm.masterAgreement.tax, 2);
            };

            function getChargesSettings() {
                //vm.loading = true;
                vm.chargesSettings = [];
                chargesSettingService.getChargesSettings({ module: 2 }).success(function (data) {
                    vm.chargesSettingsAll = data.items;
                    var foundLines = $filter('filter')(vm.chargesSettingsAll, {
                        rateTypeId: 3,
                    }, true);
                    foundLines.forEach(function (row) {
                        row.rateType = { id: 14, name: '/Year' };
                        row.rateTypeId = 14;
                        if (row.chargesTypeId != 1) {
                            row.accepted = ((row.chargesType.chargesCategory == 2 || row.chargesType.chargesCategory == 3 || row.chargesType.chargesCategory == 4) ? false : true);
                            vm.chargesSettings.push(row);
                        }

                    })
                    if (vm.masterAgreement.quotation.quotationLines.length == 0)
                        vm.addRow();
                }).finally(function () {
                    //vm.loading = false;
                });
            };

            vm.getcostingParameters = function () {
                costParameterService.getcostingParameters({}).success(function (data) {
                    vm.costingParameters = data.items;
                }).finally(function () {
                });
            };

            var addRentRowAndUpdateRates = function () {
                vm.masterAgreement.quotation.quotationLines.forEach(row => {
                    var quotationRow = row;

                    quotationRow.extrasLines.forEach(row => {
                        row.rate = utilities.round(row.rate / 12, 2);
                        if (row.chargesTypeId == 5)
                            row.limit = row.limit / 12;
                        row.rateTypeId = 3;
                        row.rateType = {
                            id: 3,
                            name: 'PerMonth'
                        };
                    });

                    var extraLinesTotal = quotationRow.extrasLines.reduce((accumulator, cuurent) => {
                        return accumulator = accumulator + cuurent.rate;
                    }, 0);

                    //var extraLinesMarkUp = (row.profitMarkup / 100) * extraLinesTotal;
                    //var extraLinesTotalWithMarkUp = extraLinesTotal + extraLinesMarkUp;
                    var rentRate = row.amountPerMonth - extraLinesTotal;

                    quotationRow.extrasLines.splice(0, 0, {
                        chargesTypeId: 1,
                        rate: utilities.round(rentRate, 2),
                        rateTypeId: 3,
                        accepted: true,
                        rateType: {
                            id: 3,
                            name: 'PerMonth'
                        },
                        chargesType: {
                            name:'Rent'
                        }
                    });
                });
            }

            vm.addAgreementUnderMasterAgreement = function (row) {
                //var quotationRow = angular.copy(row);

                //quotationRow.extrasLines.forEach(row => {
                //    row.rate = row.rate / 12;
                //    if (row.chargesTypeId == 5)
                //        row.limit = row.limit / 12;
                //});

                //var extraLinesTotal = quotationRow.extrasLines.reduce((accumulator, cuurent) => {
                //    return accumulator = accumulator + cuurent.rate;
                //}, 0);

                //var extraLinesMarkUp = (row.profitMarkup / 100) * extraLinesTotal;
                //var extraLinesTotalWithMarkUp = extraLinesTotal + extraLinesMarkUp;
                //var rentRate = row.amountPerMonth - extraLinesTotalWithMarkUp;

                //quotationRow.extrasLines.push({
                //    chargesTypeId: 1,
                //    rate: rentRate
                //});
                //openCreateOrEditLeaseAgreementModal(quotationRow);
                openCreateOrEditLeaseAgreementModal(row);
            };

            function openCreateOrEditLeaseAgreementModal(quotationLine) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/lease/agreements/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.lease.agreements.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                chargesSettings: vm.chargesSettings,
                                masterAgreementId: vm.masterAgreement.id,
                                date: moment(),
                                chargesLines: quotationLine.extrasLines,
                                noOfMonths: (quotationLine.years * 12),
                                customer: vm.masterAgreement.quotation.customer,
                                customerId: vm.masterAgreement.quotation.customerId
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getAgreements();
                });
            }

            function getChargesSettings() {

                chargesSettingService.getChargesSettings({ module: 2 }).success(function (data) {
                    vm.chargesSettings = data.items;
                }).finally(function () {

                });
            };

            function init() {
                vm.loading = true;

                var createOrRevise = null;

                getChargesSettings();

                masterAgreementService.getMasterLeaseAgreementForView({ id: leaseQuotationId }).success(function (data) {
                    vm.masterAgreement = data;
                    vm.masterAgreement.taxPercent = vm.taxPercent;
                    vm.masterAgreement.date = moment();
                    //vm.masterAgreement.quotation.quotationLines.forEach(function (row) {
                    //    row.total = row.amount;
                    //    vm.loading = true;
                    //    costSettingService.getCostSettingByModel({ id: row.vehicleModelId }).success(function (data) {
                    //        row.costDetailLoaded = data.settingLines;
                    //    }).finally(function () {
                    //        vm.loading = false;
                    //    });
                    //});
                    addRentRowAndUpdateRates();
                    getChargesSettings();
                    vm.getcostingParameters();

                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();

        }]);
