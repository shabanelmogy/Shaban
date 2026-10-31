// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:257790-258521
appModule.controller('tenant.views.crs.rental.quotations.createOrEditQuotationModal', ['$uibModal', '$uibModalInstance', 'utilities',
        'abp.services.app.directory', 'abp.services.app.commonLookup',
        'abp.services.app.rentalQuotation', 'quotationId', 'tariffHelper', 'isRevised', 'abp.services.app.vehicleModel',
        'abp.services.app.chargesSetting', 'abp.services.app.commonLookup', 'appSession',
        function ($uibModal, $uibModalInstance, utilities, directoryService, lookupService,
            rentalQuotationService, quotationId, tariffHelper, isRevised, vehicleModelService,
            chargesSettingService, commonLookupService, appSession) {
            var vm = this;
            vm.customers = [];
            vm.chargesSettings = [];
            vm.isRevised = isRevised;
            vm.revisedQuotationId = quotationId;
            vm.branchTaxPercentage = null;
            var rentalQuotationId = quotationId;
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.isTaxCodeEnabled = abp.features.isEnabled("CRS.TaxCodes");
            vm.rentalQuotationCustomField1 = utilities.parseBoolean(abp.setting.get('App.Speed.Common.RentalQuotation_CustomField1'));
            vm.rentalQuotationCustomField2 = utilities.parseBoolean(abp.setting.get('App.Speed.Common.RentalQuotation_CustomField2'));
            vm.rentalQuotationCustomField3 = utilities.parseBoolean(abp.setting.get('App.Speed.Common.RentalQuotation_CustomField3'));
            vm.rentalQuotationCustomField4 = utilities.parseBoolean(abp.setting.get('App.Speed.Common.RentalQuotation_CustomField4'));
            vm.rentalQuotationDateCustomField1 = utilities.parseBoolean(abp.setting.get('App.Speed.Common.RentalQuotation_DateCustomField1'));
            vm.rentalQuotationDateCustomField2 = utilities.parseBoolean(abp.setting.get('App.Speed.Common.RentalQuotation_DateCustomField2'));
            vm.rentalQuotationDateCustomField3 = utilities.parseBoolean(abp.setting.get('App.Speed.Common.RentalQuotation_DateCustomField3'));
            vm.isDiscountInRentalQuotations = abp.features.isEnabled("CRS.Rental.Quotations.Discount");
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.isTaxOptional = utilities.parseBoolean(abp.setting.get("App.General.IsTaxOptional"));

            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };
            vm.searchSalesPersons = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 1 }).then(function (response) {
                    vm.salesPersons = response.data.items;
                });
            };

            vm.taxAcceptedChanged = function (line) {
                if (line.taxAccepted) {
                    line.taxPercent = vm.taxPercent;
                    //vm.calculateTaxForShow(line);
                }
                else {
                    line.taxPercent = 0;
                    line.tax = 0;
                }
                line.tax = vm.calculateTaxForShow(line);
            };

            vm.searchSalesPersonPopoup = function () {
                var modalInstance = openSearchContactModel(null, 1);

                modalInstance.result.then(function (result) {
                    if (result != null) {
                        vm.quotation.salePerson = result;
                        vm.salesPersonSelected();
                    }
                });
            };

            vm.salesPersonSelected = function () {
                vm.quotation.salePersonId = vm.quotation.salePerson.id;
            };

            function openSearchContactModel(category, type) {
                return $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return category;
                        },
                        type: function () {
                            return type;
                        }
                    }
                });
            }

            vm.agreementTypes = [
                { type: "Daily", id: 1 },
                { type: "Weekly", id: 2 },
                { type: "Monthly", id: 3 }
            ];

            vm.localize = function (input) {
                return app.localize(input);
            };

            vm.quotation = {
                quotationLines: []
            };
            vm.isdateNull = function () {
                if (!vm.quotation.date)
                    return true;
                else
                    return false;

            }
            if (quotationId)
                vm.quotation.type = 3;


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

            vm.vehicleTypeChanged = function (line) {
                if (line.vehicleTypeId)
                    applyTariff(line);
            };

            vm.loadandApplyTariffToAllLines = function () {
                if (vm.quotation.quotationLines)
                    vm.quotation.quotationLines.forEach(e => vm.loadandApplyTariff(e));
            };

            vm.loadandApplyTariff = function (line) {
                if (line.vehicleTypeId) {
                    vm.loading = true;
                    var agreementCategory = 1; // rental
                    var groupId = line.vehicleTypeId;
                    if (!line.years)
                        line.years = 0;
                    var duration = line.years;

                    tariffHelper.loadTariff(groupId, agreementCategory, function () {
                        vm.loading = false;
                        tariffHelper.applyTariffOnRentalQuotation(line.extrasLines, duration);
                    }, null);

                    vm.calculateTax(line);
                }

            };
            vm.calculateTax = function (line) {
                line.tax = 0.0;
                if (vm.quotation.customer && vm.quotation.customer.isTaxExempted)
                    return line.tax;
                line.extrasLines.forEach(charge => {
                    charge.tax = 0.0;
                    if (charge.taxable && charge.accepted) {
                        if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 
                            //equation solved from following formula... 
                            //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
                            var chargesWithoutTax = (charge.rate * 100) / (100 + vm.quotation.taxPercent);
                            charge.tax = utilities.round(charge.rate - chargesWithoutTax, 2);

                        } else {
                            //prices are without tax. calculate tax and include in total
                            charge.tax = utilities.round(charge.rate * vm.quotation.taxPercent / 100, 2);
                        }
                    }
                    line.tax += charge.tax;
                });

                return line.tax;
            };

            vm.calculateTaxForShow = function (line) {
                var taxSum = 0.0;
                if (vm.quotation.customer && vm.quotation.customer.isTaxExempted)
                    return line.tax;
          
                line.extrasLines.forEach(charge => {
                    if (charge.accepted) {
                        charge.tax = 0.0;
                        if (charge.taxable && charge.accepted) {
                            if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 
                                //equation solved from following formula... 
                                //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
                                var chargesWithoutTax = (charge.charges * 100) / (100 + line.taxPercent);
                                charge.tax = utilities.round(charge.charges - chargesWithoutTax, 2);

                            } else {
                                //prices are without tax. calculate tax and include in total
                                charge.tax = utilities.round(charge.charges * line.taxPercent / 100, 2);
                            }
                        }
                        taxSum += charge.tax;
                    }
                });

                return taxSum;
            };



            vm.applyTariff = function (line) {
                if (line.vehicleTypeId && line.years) {
                    vm.loading = true;
                    var duration = line.years;
                    tariffHelper.applyTariffOnRentalQuotation(line.extrasLines, duration);
                }

            };


            vm.quotationTypeChanged = function () {

                vm.currentExtrasLines = angular.copy(vm.chargesSettings);

                var rateTypesToChange = [1, 2, 3];

                vm.currentExtrasLines.filter(e => rateTypesToChange.includes(e.rateTypeId)).forEach(row => {
                    if (vm.quotation.type == 1) {
                        row.rateTypeId = 1;
                        row.rateType = rateTypes.perDay;
                        vm.periodType = "Days";
                    }
                    else if (vm.quotation.type == 2) {
                        row.rateTypeId = 2;
                        row.rateType = rateTypes.perWeek;
                        vm.periodType = "Weeks";
                    }
                    else if (vm.quotation.type == 3) {
                        row.rateTypeId = 3;
                        row.rateType = rateTypes.perMonth;
                        vm.periodType = "Months";
                    }
                });
                if (vm.quotation.quotationLines) {
                    vm.quotation.quotationLines.forEach(line => {
                        line.extrasLines.filter(e => rateTypesToChange.includes(e.rateTypeId)).forEach(row => {
                            if (vm.quotation.type == 1) {
                                row.rateTypeId = 1;
                                row.rateType = rateTypes.perDay;
                            }
                            else if (vm.quotation.type == 2) {
                                row.rateTypeId = 2;
                                row.rateType = rateTypes.perWeek;
                            }
                            else if (vm.quotation.type == 3) {
                                row.rateTypeId = 3;
                                row.rateType = rateTypes.perMonth;
                            }
                        });
                        vm.loadandApplyTariff(line);
                    });
                }
            };


            function getChargesSettings() {

                chargesSettingService.getChargesSettings({ module: 1 }).success(function (data) {
                    vm.chargesSettings = data.items;
                    vm.chargesSettings.forEach(row => {
                        row.tariff = [];
                        row.discountPercent = 0;
                        //row.accepted = row.chargesTypeId == 1;
                        row.accepted = row.chargesType.chargesCategory == 2 || row.chargesType.chargesCategory == 3 || row.chargesType.chargesCategory == 4 ? false : true;
                    });

                    vm.quotationTypeChanged();


                }).finally(function () {

                });
            };

            function getChargesSettingsForEdit() {

                chargesSettingService.getChargesSettings({ module: 1 }).success(function (data) {
                    vm.chargesSettingsForEdit = data.items;
                    vm.chargesSettingsForEdit.forEach(row => {
                        row.tariff = [];
                        row.discountPercent = 0;
                        //row.accepted = row.chargesTypeId == 1;
                        row.accepted = row.chargesType.chargesCategory == 2 || row.chargesType.chargesCategory == 3 || row.chargesType.chargesCategory == 4 ? false : true;
                    });

                    vm.currentExtrasLinesForEdit = angular.copy(vm.chargesSettingsForEdit);

                    var rateTypesToChange = [1, 2, 3];

                    vm.currentExtrasLinesForEdit.filter(e => rateTypesToChange.includes(e.rateTypeId)).forEach(row => {
                        if (vm.quotation.type == 1) {
                            row.rateTypeId = 1;
                            row.rateType = rateTypes.perDay;
                            vm.periodType = "Days";
                        }
                        else if (vm.quotation.type == 2) {
                            row.rateTypeId = 2;
                            row.rateType = rateTypes.perWeek;
                            vm.periodType = "Weeks";
                        }
                        else if (vm.quotation.type == 3) {
                            row.rateTypeId = 3;
                            row.rateType = rateTypes.perMonth;
                            vm.periodType = "Months";
                        }
                    });









                }).finally(function () {

                });

            };

            vm.lineCalc = function (quotationLine) {
                var totalLineCharges = 0;
                var totalLineTax = 0;
                quotationLine.extrasLines.forEach(el => {
                    if (el.accepted) {
                        let charges = 0.0;
                        let rate = isNaN(parseFloat(el.rate)) ? 0 : parseFloat(el.rate);
                        let quantity = isNaN(parseFloat(quotationLine.quantity)) ? 0 : parseFloat(quotationLine.quantity);
                        let period = isNaN(parseFloat(quotationLine.years)) ? 0 : parseFloat(quotationLine.years);
                        if (el.rateTypeId === 6) {
                            charges = quantity * rate;
                        } else if (el.rateTypeId === 1 || el.rateTypeId === 8 || el.rateTypeId === 7 || el.rateTypeId === 3 || el.rateTypeId === 2 || el.rateTypeId === 14) {
                            charges = quantity * period * rate;
                        } else if (el.rateTypeId === 4) {
                            charges = 0;
                        } else {
                            charges = rate;
                        }
                        el.charges = charges;
                        totalLineCharges += charges;
                        totalLineTax += el.tax;
                    }

                });
                quotationLine.total = totalLineCharges;
                quotationLine.totalTax = totalLineTax;

                vm.sumTotal = 0;
                vm.quotation.quotationLines.forEach(line => {
                    line.extrasLines.forEach(el => {
                        if (el.accepted) {
                            vm.sumTotal += el.charges + ((line.taxAccepted && !vm.isTaxInclusive) ? el.tax : 0);
                        }
                    });
                });
                return totalLineCharges;
            };

            // Opening Calculation PopUp
            vm.calculationDetail = function (quotationLine, year) {
                quotationLine.year = year;
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/rental/quotations/calculationDetail.cshtml',
                    controller: 'tenant.views.crs.rental.quotations.calculationDetail as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        quotationLine: function () {
                            return quotationLine;
                        },
                        quotation: function () {
                            return vm.quotation;
                        },
                        viewMode: function () {
                            return false;
                        }
                    }
                }).result.then(function (result) {
                    if (result != null) {
                        quotationLine.vehiclePrice = result.vehiclePrice;
                        if (result.years == 1) {
                            quotationLine.amount = result.amount;
                        }
                        else if (result.years == 2) {
                            quotationLine.amountPerMonth = result.amount;
                        }
                        else if (result.years == 3) {
                            quotationLine.amountPerVehicle = result.amount;
                        }
                    }
                });
            };

            vm.calculationDetailView = function (quotationLine) {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/lease/leaseQuotations/viewCalculationDetail.cshtml',
                    controller: 'tenant.views.crs.rental.quotations.viewCalculationDetail as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        quotationLine: function () {
                            return quotationLine;
                        },
                    }
                });
            };

            function quotationLineObject() {

                var line = new Object();
                line.tariffGroupId = null;
                line.tariffGroup = null;
                line.quantity = null;
                line.amount = null;
                line.amountPerMonth = null;
                line.amountPerVehicle = null;

                line.taxAccepted = true;
                line.taxPercent = vm.taxPercent;

                if (vm.currentExtrasLines)
                    line.extrasLines = JSON.parse(JSON.stringify(vm.currentExtrasLines));
                else if (vm.quotation.id > 0 || isRevised) {


                    line.extrasLines = JSON.parse(JSON.stringify(vm.currentExtrasLinesForEdit));

                }
                return line;
            }
            vm.searchContact = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true, includeUnApproved: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            var getContactsByCompanyId = function () {
                //whereas contactCategory: 2 (company), contactType: 1 (staff)
                return directoryService.getContactsByCompanyId({ id: vm.quotation.customer.id }).then(function (response) {
                    vm.contactPersons = response.data;
                });
            };
            vm.branchTaxCode = function () {
                var userLocationId = appSession.user.locationId;
                if (userLocationId) {
                    commonLookupService.getLocationById({ id: userLocationId })
                        .success(function (data) {
                            var userLocation = data;
                            if (userLocation.taxCode) {
                                vm.branchTaxPercentage = userLocation.taxCode.taxPercent;
                            }
                        })
                }
            }


            vm.customerChanged = function () {
                vm.quotation.customerId = vm.quotation.customer.id;
                vm.quotation.contactPerson = null;
                vm.quotation.contactPersonId = null;
                vm.contactPersons = [];
                if (vm.quotation.customer.contactCategory == 2) {
                    getContactsByCompanyId();
                }
                if (vm.isTaxCodeEnabled && !vm.quotation.customer.isTaxExempted) {
                    if (vm.quotation.customer.taxCodeId > 0) {
                        vm.quotation.taxPercent = vm.quotation.customer.taxCode.taxPercent;
                    }
                    else {
                        if (vm.branchTaxPercentage)
                            vm.quotation.taxPercent = vm.branchTaxPercentage;
                    }
                }
                vm.loadandApplyTariffToAllLines();
                //if (vm.quotation.customer.isTaxExempted) {
                //    vm.quotation.quotationLines.forEach(e => e.tax = 0.0);
                //}
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
                        vm.quotation.customer = customer;
                        vm.quotation.customerId = customer.id;
                        if (vm.isTaxCodeEnabled) {
                            vm.quotation.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
                            if (!vm.quotation.customer.isTaxExempted) {
                                if (vm.quotation.customer.taxCodeId > 0) {
                                    vm.quotation.taxPercent = vm.quotation.customer.taxCode.taxPercent;
                                }
                                else {
                                    if (vm.branchTaxPercentage)
                                        vm.quotation.taxPercent = vm.branchTaxPercentage;
                                }
                            }
                        }
                        if (vm.quotation.customer.contactCategory == 2) {
                            getContactsByCompanyId();
                        }
                    }
                });
            };

            vm.modelSelected = function (line) {
                line.vehicleModelId = line.vehicleModel.id;
                checkDuplicateMakeModelAndVehicleType(line);
                vm.calculateCharges(line);
            };

            vm.vehicleTypeChanged = function (line) {
                line.vehicleTypeId = line.vehicleType.id;
                checkDuplicateMakeModelAndVehicleType(line);
                vm.calculateCharges(line);
            };

            function checkDuplicateMakeModelAndVehicleType(line) {
                if (line.vehicleTypeId && line.vehicleModelId) {
                    var foundLines = vm.quotation.quotationLines.filter(e => e.vehicleTypeId == line.vehicleTypeId && e.vehicleModelId == line.vehicleModelId);
                    if (foundLines.length > 1) {
                        abp.message.info("duplicate type and make model");
                        line.vehicleTypeId = null;
                        line.vehicleModelId = null;
                        line.vehicleType = null;
                        line.vehicleModel = null;
                    }
                    else {
                        vm.loadandApplyTariff(line);
                    }
                }
            }

            vm.searchModel = function ($select) {
                return vehicleModelService.searchVehicleModelsNew({ name: $select.search }).then(function (response) {
                    vm.models = response.data.items;
                });
            };

            vm.getTariffGroups = function () {
                lookupService.getTariffGroups({}).success(function (data) {
                    vm.vehicleTypes = data.items;
                });
            };

            // Only Active location will show here
            /*   function getLocations() {
                   commonLookupService.getLocations({}).success(function (data) {
                       vm.locations = data.items;
                   });
               }*/

            // all location inactive and active
            function getAllLocations() {
                commonLookupService.getLocationsActiveAndInActive({}).success(function (data) {
                    vm.locationsAll = data.items;
                });
            }

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
                let quotationLine = quotationLineObject();
                vm.quotation.quotationLines.push(quotationLine);
                vm.calculateCharges(quotationLine);
            };

            //Remove row
            vm.removeRow = function (obj) {
                var index = vm.quotation.quotationLines.indexOf(obj);
                vm.quotation.quotationLines.splice(index, 1);

            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                vm.loading = true;
                /*getLocations();*/
                getAllLocations();
                vm.branchTaxCode();

                var createOrRevise = null;

                if (isRevised)
                    createOrRevise = rentalQuotationService.getQuotationForRevision({ id: rentalQuotationId });
                else
                    createOrRevise = rentalQuotationService.getQuotationForEdit({ id: rentalQuotationId });

                createOrRevise.success(function (data) {

                    vm.quotation = data;
                    if (vm.quotation.id > 0) {
                        getContactsByCompanyId();
                    }
                    if (!vm.quotation.id && !isRevised) {
                        vm.quotation.type = 3;
                        vm.quotation.taxPercent = vm.taxPercent;
                        getChargesSettings();

                    }
                    if (vm.isTaxOptional) {
                        if (!vm.quotation.id) {
                            angular.forEach(vm.quotation.quotationLines, function (line) {
                                line.taxAccepted = true;
                                line.taxPercent = vm.taxPercent;
                            });
                        }
                        else {
                            angular.forEach(vm.quotation.quotationLines, function (line) {
                                if (line.tax == 0) {
                                    line.taxPercent = 0;
                                    line.taxAccepted = false;
                                }
                                else {
                                    line.taxAccepted = true;
                                    line.taxPercent = vm.taxPercent;
                                }
                            });
                        }
                    }
                    else {
                        angular.forEach(vm.quotation.quotationLines, function (line) {
                            line.taxPercent = vm.taxPercent;
                        });
                    }
                    if (vm.quotation.id || isRevised) {
                        vm.quotation.quotationLines.forEach(e => {
                            var rentRow = e.extrasLines.find(f => f.chargesTypeId == 1);
                            if (rentRow.discountPercent > 0) {
                                rentRow.discountedRate = rentRow.rate - rentRow.rate * rentRow.discountPercent / 100;
                            }

                        });
                        getChargesSettingsForEdit();
                        getContactsByCompanyId();
                    }
                }).finally(function () {
                    vm.loading = false;
                });

            }

            vm.calculateCharges = (leaseQuotationLine) => {
                leaseQuotationLine.extrasLines.forEach(el => {
                    let charges = 0.0;
                    let rate = isNaN(parseFloat(el.rate)) ? 0 : parseFloat(el.rate);
                    let quantity = isNaN(parseFloat(leaseQuotationLine.quantity)) ? 0 : parseFloat(leaseQuotationLine.quantity);
                    let period = isNaN(parseFloat(leaseQuotationLine.years)) ? 0 : parseFloat(leaseQuotationLine.years);
                    if (el.rateTypeId === 6) {
                        charges = quantity * rate;
                    } else if (el.rateTypeId === 1 || el.rateTypeId === 8 || el.rateTypeId === 7 || el.rateTypeId === 3 || el.rateTypeId === 2 || el.rateTypeId === 14) {
                        charges = quantity * period * rate;
                    } else if (el.rateTypeId === 4) {
                        charges = 0;
                    } else {
                        charges = rate;
                    }
                    el.charges = charges;
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
                    vm.calculateCharges(e);
                });

                vm.quotation.amount = vm.sumTotal - vm.quotation.discount;
                var createOrRevise = null;
                if (isRevised)
                    createOrRevise = rentalQuotationService.reviseQuotation({ quotation: vm.quotation, revisedQuotationId: vm.revisedQuotationId });
                else
                    createOrRevise = rentalQuotationService.createOrUpdateQuotation({ quotation: vm.quotation });

                createOrRevise.success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            function initQuotation() {
                vm.getTariffGroups();
                init();
            }
            initQuotation();
        }]);
