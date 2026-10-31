// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:239319-239925
appModule.controller('tenant.views.crs.lease.leaseQuotations.createOrEditQuotationModal', ['$uibModal', '$uibModalInstance', 'utilities',
        'abp.services.app.directory', 'abp.services.app.commonLookup', 'abp.services.app.costSetting', 'abp.services.app.chargesSetting', 'abp.services.app.leaseInquiry',
        'abp.services.app.leaseQuotation', 'leaseQuotationId', 'abp.services.app.eRSTariff', 'tariffHelperERS', 'isRevised', 'abp.services.app.vehicleModel', 'inquiryId', 'abp.services.app.costParameter',
        function ($uibModal, $uibModalInstance, utilities, directoryService, lookupService, costSettingService, chargesSettingService, leaseInquiryService,
            leaseQuotationService, leaseQuotationId, tariffService, tariffHelperERS, isRevised, vehicleModelService, inquiryId, costParameterService) {
            var vm = this;
            vm.customers = [];
            vm.isRevised = isRevised;
            vm.revisedQuotationId = leaseQuotationId;
            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };
            vm.permissions = {
                showCostSettingVehiceCost: abp.auth.hasPermission('Pages.Tenant.Lease.CostSettings.ManageVehicleCost'),
            };
            vm.localize = function (input) {
                return app.localize(input);
            };

            var tariffLines = [];

            vm.quotation = {
                quotationLines: []
            };

            if (leaseQuotationId)
                vm.quotation.type = 3;


            vm.extraHours = {
                chargesTypeId: 68,
                limit: 0,
                rateTypeId: 7,
            };

            vm.mobilizationCharges = {
                chargesTypeId: 26,
                limit: 0,
                rate: 0,
                rateTypeId: 6
            };

            vm.quotationTypes = [
                { type: vm.localize("Daily"), id: 1 },
                { type: vm.localize("Weekly"), id: 2 },
                { type: vm.localize("Monthly"), id: 3 },
                { type: vm.localize("Lease"), id: 4 },
                { type: vm.localize("LeaseToOwn"), id: 5 }
            ];

            vm.getPeriodType = function (id) {
                if (id == 1)
                    return "Days";
                if (id == 2)
                    return "Weeks";
                if (id >= 3)
                    return "Months";
            }
            var rateTypes = {
                perDay: { id: 1, name: '/Day' },
                perWeek: { id: 2, name: '/Week' },
                perMonth: { id: 3, name: '/Month' },
            };

            vm.getRateType = function () {
                if (vm.quotation.type == 1) {
                    vm.rateType = rateTypes.perDay;
                }
                else if (vm.quotation.type == 2) {
                    vm.rateType = rateTypes.perWeek;
                }
                else if (vm.quotation.type >= 3) {
                    vm.rateType = rateTypes.perMonth;
                }
            };

            function loadTariffLines() {
                var agreementCategory = 7;
                if (vm.quotation.type >= 4) // if Type is lease or lease to own
                    agreementCategory = 8;
                tariffService.getTariff({ agreementCategory: agreementCategory, agreementType: vm.quotation.type }).success(function (result) {
                    tariffLines = result.items;
                    if (vm.quotation.quotationLines) {
                        angular.forEach(vm.quotation.quotationLines, function (line) {
                            vm.vehicleTypeChanged(line);
                        });
                    }
                });
            }

            vm.vehicleTypeChanged = function (line) {
                if (line.vehicleTypeId)
                    applyTariff(line);
            }
            function applyTariff(line) {

                if (!(tariffLines.length > 0))
                    return;
                var agreementCategory = 7;
                if (vm.quotation.type >= 4) // if Type is lease or lease to own
                    agreementCategory = 8;
                var tariffLinesToPass = tariffLines.filter(e => e.tariffGroupId == line.vehicleTypeId);
                tariffHelperERS.applyTariffQuotation(line, tariffLinesToPass, agreementCategory, vm.quotation.type);
            };
            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };


            vm.quotationTypeChanged = function () {
                loadChargesSettings(true);
            };

            //function loadChargesSettings(loadTariff) {
            //    vm.loading = true;

            //    var module = 7;
            //    if (vm.quotation.type >= 4) // if Type is lease or lease to own
            //        module = 8;

            //    chargesSettingService.getChargesSettings({ module: module }).success(function (data) {
            //        vm.chargesSettings = data.items;
            //        vm.getTariffGroups();

            //        vm.commonCharges = angular.copy(vm.chargesSettings);

            //        //if (vm.quotation.quotationLines && vm.quotation.quotationLines.length > 0) {
            //        //    vm.quotation.quotationLines.forEach(row => {
            //        //        row.extrasLines = angular.copy(vm.chargesSettings);
            //        //        row.extrasLines.forEach(chargesRow => {
            //        //            if (chargesRow.rateTypeId === 1 || chargesRow.rateTypeId === 2 || chargesRow.rateTypeId === 3) {
            //        //                if (vm.quotation.type === 1) {
            //        //                    chargesRow.rateTypeId = rateTypes.perDay.id;
            //        //                    chargesRow.rateType = rateTypes.perDay;
            //        //                }
            //        //                else if (vm.quotation.type === 2) {
            //        //                    chargesRow.rateTypeId = rateTypes.perWeek.id;
            //        //                    chargesRow.rateType = rateTypes.perWeek;
            //        //                }
            //        //                else if (vm.quotation.type >= 3) {
            //        //                    chargesRow.rateTypeId = rateTypes.perMonth.id;
            //        //                    chargesRow.rateType = rateTypes.perMonth;
            //        //                }
            //        //            }
            //        //        });
            //        //        vm.currentExtrasLines = angular.copy(row.extrasLines);
            //        //    });
            //        //}

            //        //if (loadTariff)
            //        //    loadTariffLines();
            //    }).finally(function () {
            //        vm.loading = false;
            //    });
            //};

            // Opening Calculation PopUp
            vm.calculationDetail = function (quotationLine, year) {
                quotationLine.year = year;
                quotationLine.vehiclePrice = 0;
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/lease/leaseQuotations/calculationQuotationDetail.cshtml',
                    controller: 'tenant.views.crs.lease.leaseQuotations.calculationQuotationDetail as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        quotationLine: function () {
                            return quotationLine;
                        },
                        taxPercent: function () {
                            return vm.quotation.taxPercent;
                        },
                        costingParameters: function () {
                            return vm.costingParameters;
                        },
                        viewMode: function () {
                            return false;
                        }
                    }
                }).result.then(function (result) {

                    if (result != null) {
                        quotationLine.vehiclePrice = result.vehiclePrice;
                        if (result.years == 1) {
                            quotationLine.amount1Year = result.amount;
                        }
                        else if (result.years == 2) {
                            quotationLine.amount2Year = result.amount;
                        }
                        else if (result.years == 3) {
                            quotationLine.amount3Year = result.amount;
                        }
                        else if (result.years == 4) {
                            quotationLine.amount4Year = result.amount;
                        }
                        else if (result.years == 5) {
                            quotationLine.amount5Year = result.amount;
                        }
                    }
                });;
            };

            vm.calculationDetailView = function (quotationLine) {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/lease/leaseQuotations/calculationQuotationDetail.cshtml',
                    controller: 'tenant.views.crs.lease.leaseQuotations.calculationQuotationDetail as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        quotationLine: function () {
                            return quotationLine;
                        },
                        taxPercent: function () {
                            return vm.quotation.taxPercent;
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

            vm.qunatityChanged = function (line) {
                //vm.calculate(line, 1);
                //vm.calculate(line, 2);
                //vm.calculate(line, 3);
            };

            vm.calculate = function (line, years) {
                var quotationLine = angular.copy(line);
                quotationLine.years = years;
                //quotationLine.quantity = 1;
                quotationLine.profitMarkup = 0;
                if (!quotationLine.years || !quotationLine.quantity /*|| !quotationLine.vehiclePrice */)
                    return;

                if (quotationLine.costLines.length == 0) {
                    vm.costingParameters.forEach(function (row) {
                        quotationLine.costLines.push({
                            costParam: row,
                            costParamId: row.id,
                            detail: ''
                        });
                    });
                }

                var years = parseFloat(quotationLine.years);
                var quantity = parseFloat(quotationLine.quantity);
                var vehiclePrice = !quotationLine.vehiclePrice ? 100 : parseFloat(quotationLine.vehiclePrice);

                if (years <= 0 || quantity <= 0 /*|| vehiclePrice <= 0*/)
                    return;

                var cost = 0.0;
                var i = 0;
                var tax = 0.0;
                var bookValues = [vehiclePrice];

                for (i = 0; i < quotationLine.costLines.length; i++) {
                    var costLineAmount = 0.0;
                    var description = '';

                    for (j = 1; j <= years; j++) {
                        var filteredRow = null;
                        if (quotationLine.costDetailLoaded != null) {
                            for (k = 0; k < quotationLine.costDetailLoaded.length; k++) {
                                if (quotationLine.costDetailLoaded[k].costParamId == quotationLine.costLines[i].costParamId && j >= quotationLine.costDetailLoaded[k].from && (j <= quotationLine.costDetailLoaded[k].to || quotationLine.costDetailLoaded[k].to == 0)) {
                                    filteredRow = quotationLine.costDetailLoaded[k];
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

                        if (quotationLine.costLines[i].costParam.name.includes("Depreciation")) {
                            bookValues.push(vehiclePrice - costLineAmount);
                        }
                    }
                    quotationLine.costLines[i].amount = costLineAmount;
                    quotationLine.costLines[i].detail = description;


                    cost += quotationLine.costLines[i].amount;
                }

                var extras = 0.0;

                //for (i = 0; i <= quotationLine.extrasLines.length - 1; i++) {
                //    if (quotationLine.extrasLines[i].accepted && quotationLine.extrasLines[i].rate)
                //        quotationLine.extrasLines[i].charges = parseFloat(quotationLine.extrasLines[i].rate) * parseFloat(quotationLine.years);
                //    else
                //        quotationLine.extrasLines[i].charges = 0;

                //    extras += quotationLine.extrasLines[i].charges;
                //}

                quotationLine.cost = cost;
                quotationLine.extras = extras;
                //quotationLine.markup = utilities.round((parseFloat(quotationLine.vehiclePrice) + parseFloat(quotationLine.cost) + parseFloat(quotationLine.extras)) * quotationLine.profitMarkup / 100, 0);
                //quotationLine.markup = utilities.round((parseFloat(quotationLine.cost) + parseFloat(quotationLine.extras)) * quotationLine.profitMarkup / 100, 0);
                quotationLine.markup = utilities.round((parseFloat(quotationLine.cost)) * quotationLine.profitMarkup / 100, 0);
                //quotationLine.amountPerVehicle = parseFloat(quotationLine.vehiclePrice) + parseFloat(quotationLine.cost) + parseFloat(quotationLine.extras) + quotationLine.markup;
                quotationLine.amount3Year = parseFloat(quotationLine.cost) + parseFloat(quotationLine.extras) + quotationLine.markup;
                quotationLine.amount2Year = utilities.round(quotationLine.amount3Year / years / 12, 2);
                quotationLine.total = utilities.round(quotationLine.amount3Year * quantity, 0);
                quotationLine.amount1Year = quotationLine.total;



                if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 
                    //equation solved from following formula... 
                    //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
                    var chargesWithoutTax = (quotationLine.amount * 100) / (100 + vm.leaseQuotation.taxPercent);
                    tax = utilities.round(quotationLine.amount - chargesWithoutTax, 2);

                } else {
                    //prices are without tax. calculate tax and include in total
                    tax = utilities.round(quotationLine.amount * 0 / 100, 2);

                }

                quotationLine.tax = tax;
                line.tax = quotationLine.tax;

                if (quotationLine.years == 1) {
                    line.amount1Year = quotationLine.amount1Year;
                }
                else if (quotationLine.years == 2) {
                    line.amount2Year = quotationLine.amount2Year;
                }
                else if (quotationLine.years == 3) {
                    line.amount3Year = quotationLine.amount3Year;
                }
                else if (quotationLine.years == 4) {
                    line.amount4Year = quotationLine.amount4Year;
                }
                else if (quotationLine.years == 5) {
                    line.amount5Year = quotationLine.amount5Year;
                }

                // vm.sum();
            };

            vm.modelSelected = function (line) {
                debugger
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
                    line.vehiclePrice = data.vehiclePrice;
                    //vm.calculate(line, 1);
                    //vm.calculate(line, 2);
                    //vm.calculate(line, 3);
                }).finally(function () {
                    vm.loading = false;
                });


                if (line.quantity == null)
                    line.quantity = 1;
            };

            function quotationLineObject() {
                var line = new Object();
                line.tariffGroupId = null;
                line.tariffGroup = null;
                line.quantity = null;
                line.amount1Year = null;
                line.amount2Year = null;
                line.amount3Year = null;
                line.amount4Year = null;
                line.amount5Year = null;
                //line.extrasLines = [];
                //line.extrasLines.push(...vm.chargesSettings);
                return line;
            }

            vm.searchContact = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true, includeUnApproved: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            vm.searchContactPerson = function ($select) {
                if (!$select.search) return;
                //whereas contactCategory: 2 (company), contactType: 1 (staff)
                return directoryService.searchForCompany({ keyword: $select.search, companyId: vm.quotation.customer.id }).then(function (response) {
                    vm.contactPersons = response.data;
                });
            };
            vm.showCurrency = false;
            vm.customerChanged = function () {
                vm.quotation.customerId = vm.quotation.customer.id;
                vm.quotation.contactPerson = null;
                vm.quotation.contactPersonId = null;
                vm.contactPersons = [];
                console.log(vm.quotation.customer);
                if (vm.quotation.customer.currency != null) {
                    vm.showCurrency = true;
                    vm.currency = vm.quotation.customer.currency;
                } else {
                    vm.showCurrency = false;
                }
            }
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
                        vm.quotation.customer = customer;
                        vm.quotation.customerId = customer.id;
                    }
                });
            };


            vm.searchModel = function ($select) {
                return vehicleModelService.searchVehicleModelsNew({ name: $select.search }).then(function (response) {
                    vm.models = response.data.items;
                });
            };

            vm.getTariffGroups = function () {
                //vm.loading = true;
                lookupService.getTariffGroups({}).success(function (data) {
                    vm.vehicleTypes = data.items;
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

            //Add row
            vm.addRow = function () {
                vm.quotation.quotationLines.push(quotationLineObject());
            };

            //Remove row
            vm.removeRow = function (obj) {
                var index = vm.quotation.quotationLines.indexOf(obj);
                vm.quotation.quotationLines.splice(index, 1);

            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function initFromInquiry() {

                vm.loading = true;
                leaseInquiryService.getLeaseInquiryForEdit({ id: inquiryId }).success(function (data) {
                    var inquiry = data;
                    //vm.quotation.salePersonId = inquiry.salePersonId;
                    //vm.quotation.salePerson = inquiry.salePerson;
                    vm.quotation.inquiryId = inquiry.id;
                    vm.quotation.contactPersonId = inquiry.contactPersonId;
                    vm.quotation.contactPerson = inquiry.contactPerson;
                    vm.quotation.customer = inquiry.customer;
                    vm.quotation.customerId = inquiry.customerId;
                    inquiry.inquiryLines.forEach(e => {
                        var inquiryLine = {};
                        inquiryLine.vehicleTypeId = e.vehicleTypeId;
                        inquiryLine.vehicleType = e.vehicleType;
                        inquiryLine.vehicleModelId = e.vehicleModelId;
                        inquiryLine.vehicleModel = e.vehicleModel;
                        inquiryLine.quantity = e.quantity;
                        vm.quotation.quotationLines.push(inquiryLine);
                    });
                }).finally(function () {
                    vm.loading = false;
                });
            }


            vm.getcostingParameters = function () {
                costParameterService.getcostingParameters({}).success(function (data) {
                    vm.costingParameters = data.items;
                }).finally(function () {
                });
            };

            function init() {
                vm.loading = true;

                //vm.getTariffGroups();
                var createOrRevise = null;

                if (isRevised)
                    createOrRevise = leaseQuotationService.getLeaseQuotationForRevision({ id: leaseQuotationId });
                else
                    createOrRevise = leaseQuotationService.getLeaseQuotationForEdit({ id: leaseQuotationId });

                

                createOrRevise.success(function (data) {
                    vm.quotation = data;
                    if (!vm.quotation.id && !isRevised) {
                        vm.quotation.type = 1;
                        //loadChargesSettings();
                        vm.addRow();
                    }
                    vm.quotation.customer.currency = vm.quotation.customer.currency.code;

                }).finally(function () {
                    vm.loading = false;
                });

            }

            vm.save = function () {

                vm.saving = true;

                vm.quotation.quotationLines.forEach(e => {
                    var rentRow = {
                        chargesTypeId: 1,
                        rate: e.extras,
                        excessRate: e.cost,
                        rateTypeId: 1
                    };
                });

                var createOrRevise = null;

                vm.quotation.type = 4; // quotation Type Lease

                if (isRevised)
                    createOrRevise = leaseQuotationService.reviseLeaseQuotation({ leaseQuotation: vm.quotation, revisedQuotationId: leaseQuotationId });
                else {
                    createOrRevise = leaseQuotationService.createOrUpdateLeaseQuotation({ leaseQuotation: vm.quotation });
                }
                createOrRevise.success(function () {

                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            function initQuotation() {
                vm.getcostingParameters();
                vm.getTariffGroups();
                if (inquiryId)
                    initFromInquiry();
                else
                    init();
            }
            initQuotation();
        }]);
