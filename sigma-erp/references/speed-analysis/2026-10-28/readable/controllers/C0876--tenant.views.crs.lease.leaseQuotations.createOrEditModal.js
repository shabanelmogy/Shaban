// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:238888-239316
appModule.controller('tenant.views.crs.lease.leaseQuotations.createOrEditModal', ['$uibModal', '$uibModalInstance', 'utilities',
        'abp.services.app.directory', 'abp.services.app.vehicleModel', 'abp.services.app.costSetting', 'abp.services.app.chargesSetting', '$filter', 'abp.services.app.leaseQuotation', 'abp.services.app.costParameter', 'leaseQuotationId', 'isRevised',
        function ($uibModal, $uibModalInstance, utilities, directoryService, vehicleModelService, costSettingService, chargesSettingService, $filter, leaseQuotationService, costParameterService, leaseQuotationId, isRevised) {
            var vm = this;
            vm.customers = [];
            vm.models = [];
            vm.isRevised = isRevised;

            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };

            vm.leaseQuotation = {
                //date: null,
                //contactId: null,
                //quotationLines: []
            };

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
                line.amount3Year = null;
                line.amount2Year = null;
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
                        vm.leaseQuotation.customer = customer;
                        vm.leaseQuotation.customerId = customer.id;
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
                vm.leaseQuotation.quotationLines.push(quotationLineObject());
            };

            //Remove row
            vm.removeRow = function (obj) {
                var index = vm.leaseQuotation.quotationLines.indexOf(obj);
                vm.leaseQuotation.quotationLines.splice(index, 1);

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
                            return vm.leaseQuotation.taxPercent;
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
                            return vm.leaseQuotation.taxPercent;
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
                var bookValues = [vehiclePrice]; 

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
                            description = description + 'Year ' + j + ': ' + filteredRow.rate + ' ' + app.localize(filteredRow.rateType.name) + ', '

                        } else if (filteredRow && filteredRow.rateTypeId == 15) { // % /year
                            costLineAmount = costLineAmount + utilities.round(vehiclePrice * filteredRow.rate / 100, 0);
                            description = description + 'Year ' + j + ': ' + filteredRow.rate + ' ' + app.localize(filteredRow.rateType.name) + ', '

                        } else if (filteredRow && filteredRow.rateTypeId == 6 && j == 1) { //one time (charge once only)
                            costLineAmount = utilities.round(filteredRow.rate, 0);
                            description = filteredRow.rate + ' ' + app.localize(filteredRow.rateType.name)

                        } else if (filteredRow && filteredRow.rateTypeId == 16 && j == 1) { //percent of above (cost calculated so far)
                            costLineAmount = utilities.round(cost * filteredRow.rate / 100, 0);
                            description = filteredRow.rate + ' ' + app.localize(filteredRow.rateType.name) + ' (' + cost + ')';

                        } else if (filteredRow && filteredRow.rateTypeId == 17) { //percent of Book Values on start of years
                            if (bookValues.length >= j) {
                                var bookValue = bookValues[j - 1];
                                costLineAmount = costLineAmount + utilities.round(bookValue * filteredRow.rate / 100, 0);
                                description = description + 'Year ' + j + ': ' + filteredRow.rate + ' ' + app.localize(filteredRow.rateType.name) + ' (' + bookValue + ')' + ', ';
                            }
                            
                        }

                        if (line.costLines[i].costParam.name.includes("Depreciation")) {
                        debugger;
                            bookValues.push(vehiclePrice - costLineAmount);
                        }
                    }
                    line.costLines[i].amount = costLineAmount;
                    line.costLines[i].detail = description;


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
                //line.markup = utilities.round((parseFloat(line.cost) + parseFloat(line.extras)) * line.profitMarkup / 100, 0);
                line.markup = utilities.round((parseFloat(line.cost)) * line.profitMarkup / 100, 0);
                //line.amountPerVehicle = parseFloat(line.vehiclePrice) + parseFloat(line.cost) + parseFloat(line.extras) + line.markup;
                line.amount3Year = parseFloat(line.cost) + parseFloat(line.extras) + line.markup;
                line.amount2Year = utilities.round(line.amount3Year / years / 12, 2);
                line.total = utilities.round(line.amount3Year * quantity, 0);
                line.amount1Year = line.total;

                if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 
                    //equation solved from following formula... 
                    //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
                    var chargesWithoutTax = (line.amount * 100) / (100 + vm.leaseQuotation.taxPercent);
                    tax = utilities.round(line.amount - chargesWithoutTax, 2);

                } else {
                    //prices are without tax. calculate tax and include in total
                    tax = utilities.round(line.amount * vm.leaseQuotation.taxPercent / 100, 2);

                }

                line.tax = tax;
                vm.sum();
            };

            vm.sum = function () {
                //if (vm.leaseQuotation == null)
                //    return 0;

                //if (vm.leaseQuotation.quotationLines == null)
                //    return 0;

                //var sum = 0;
                //for (var i = 0; i < vm.leaseQuotation.quotationLines.length; i++) {
                //    if (vm.leaseQuotation.quotationLines[i].total != null) {
                //        sum = sum + parseFloat(vm.leaseQuotation.quotationLines[i].total);
                //    }
                //}

                //return sum;

                var totalAmount = 0.0;
                var totalTax = 0.0;
                for (var i = 0; i < vm.leaseQuotation.quotationLines.length; i++) {
                    if (vm.leaseQuotation.quotationLines[i].total != null) {
                        totalAmount = totalAmount + parseFloat(vm.leaseQuotation.quotationLines[i].total);
                        totalTax = totalTax + parseFloat(vm.leaseQuotation.quotationLines[i].tax);
                    }
                }
                vm.leaseQuotation.tax = totalTax;
                vm.leaseQuotation.amount = vm.isTaxInclusive ? utilities.round(totalAmount, 2) : (utilities.round(totalAmount, 2) + utilities.round(totalTax, 2)) / 1;
                vm.leaseQuotation.amount = utilities.round(vm.leaseQuotation.amount, 2);
                vm.leaseQuotation.tax = utilities.round(vm.leaseQuotation.tax, 2);
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
                    if (vm.leaseQuotation.quotationLines.length == 0)
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

            function init() {
                vm.loading = true;

                var createOrRevise = null;

                if (isRevised)
                    createOrRevise = leaseQuotationService.getLeaseQuotationForRevision({ id: leaseQuotationId });
                else
                    createOrRevise = leaseQuotationService.getLeaseQuotationForEdit({ id: leaseQuotationId });

                createOrRevise.success(function (data) {
                    vm.leaseQuotation = data;
                    vm.leaseQuotation.taxPercent = vm.taxPercent;
                    vm.leaseQuotation.date = moment();
                    vm.leaseQuotation.quotationLines.forEach(function (row) {
                        row.total = row.amount;
                        vm.loading = true;
                        costSettingService.getCostSettingByModel({ id: row.vehicleModelId }).success(function (data) {
                            row.costDetailLoaded = data.settingLines;
                        }).finally(function () {
                            vm.loading = false;
                        });
                    });
                    getChargesSettings();
                    vm.getcostingParameters();
                }).finally(function () {
                    vm.loading = false;
                });

            }

            vm.save = function () {

                vm.saving = true;
                var totalAmount = 0.0;
                var totalTax = 0.0;
                for (var i = 0; i < vm.leaseQuotation.quotationLines.length; i++) {
                    if (vm.leaseQuotation.quotationLines[i].total != null) {
                        totalAmount = totalAmount + parseFloat(vm.leaseQuotation.quotationLines[i].total);
                        totalTax = totalTax + parseFloat(vm.leaseQuotation.quotationLines[i].tax);
                    }
                }
                vm.leaseQuotation.tax = totalTax;
                vm.leaseQuotation.amount = vm.isTaxInclusive ? utilities.round(totalAmount, 2) : (utilities.round(totalAmount, 2) + utilities.round(totalTax, 2)) / 1;
                vm.leaseQuotation.amount = utilities.round(vm.leaseQuotation.amount, 2);
                vm.leaseQuotation.tax = utilities.round(vm.leaseQuotation.tax, 2);


                var createOrRevise = null;
                if (isRevised)
                    createOrRevise = leaseQuotationService.reviseLeaseQuotation({ leaseQuotation: vm.leaseQuotation, revisedQuotationId: leaseQuotationId });
                else
                    createOrRevise = leaseQuotationService.createOrUpdateLeaseQuotation({ leaseQuotation: vm.leaseQuotation });

                createOrRevise.success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });

            }

            init();

        }]);
