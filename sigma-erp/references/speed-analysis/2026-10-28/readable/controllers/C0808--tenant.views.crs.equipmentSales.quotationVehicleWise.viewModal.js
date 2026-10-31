// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:216339-217661
appModule.controller('tenant.views.crs.equipmentSales.quotationVehicleWise.viewModal', ['$scope', '$uibModal', '$uibModalInstance', 'utilities',
        'abp.services.app.directory', 'abp.services.app.commonLookup',
        'abp.services.app.quotationVehicleWise', 'quotationId', 'tariffHelper', 'isRevised', 'abp.services.app.vehicleModel',
        'abp.services.app.chargesSetting', 'abp.services.app.commonLookup', 'appSession', 'abp.services.app.vehicle', 'abp.services.app.billingMethod', 'abp.services.app.equipmentSales',
        function ($scope, $uibModal, $uibModalInstance, utilities, directoryService, lookupService,
            quotationVehicleWiseService, quotationId, tariffHelper, isRevised, vehicleModelService,
            chargesSettingService, commonLookupService, appSession, vehicleService, billingMethodService, equipmentSalesService) {
            var vm = this;
            vm.customers = [];
            vm.chargesSettings = [];
            vm.isRevised = isRevised;
            vm.revisedQuotationId = quotationId;
            vm.disableDownPayment = false;
            vm.overAllTotal = null;
            vm.branchTaxPercentage = null;
            var quotationVehicleWiseId = quotationId;
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.isTaxCodeEnabled = abp.features.isEnabled("CRS.TaxCodes");
            vm.isDiscountInRentalQuotations = abp.features.isEnabled("CRS.Rental.Quotations.Discount");
            vm.invoicePerInstallment = utilities.parseBoolean(abp.setting.get("App.Speed.Common.CreateInvoicePerInstallment"));
            vm.billingMethods = [];

            vm.rounding = function (value) {
                if (!value) return 0;
                return Math.round(value * 100) / 100; // always two decimals
            };
            vm.searchSalesPersons = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 1 }).then(function (response) {
                    vm.salesPersons = response.data.items;
                });
            };
            vm.getInstallmentIndex = function (index) {
                // If there's a down payment, subtract 1 from index
                return vm.quotation.downPayment > 0 ? index : index + 1;
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

            vm.quotationTypes = [
                { type: "Daily", id: 1 },
                { type: "Weekly", id: 2 },
                { type: "Monthly", id: 3 }
            ];

            vm.localize = function (input) {
                //debugger
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
                line.vehicleTypeId = line.vehicleType.id;
                checkDuplicateMakeModelAndVehicleType(line);
                vm.calculateChargesForAll(line);

                // ✅ recalculate overall quotation totals
                //vm.recalculateQuotation();
            };

            vm.modelSelected = function (line) {
                line.vehicleModelId = line.vehicleModel.id;
                checkDuplicateMakeModelAndVehicleType(line);
                vm.calculateChargesForAll(line);

                // ✅ recalculate overall quotation totals
                //vm.recalculateQuotation();
            };

            //vm.vehicleTypeChanged = function (line) {
            //    if (line.vehicleTypeId)
            //        applyTariff(line);
            //};
            vm.priceChanged = function (row) {
                row.amount = vm.rounding(parseFloat(row.amount) || 0);

                vm.quotation.quotationcharges[0].amount = vm.quotation.quotationLines.reduce(
                    (sum, vehicle) => sum + (vehicle.amount > 0 ? vm.rounding(vehicle.amount) : 0),
                    0
                );

                let totalChargesList = vm.quotation.quotationcharges.reduce(
                    (sum, item) => sum + (item.amount || 0),
                    0
                );

                totalChargesList -= (vm.quotation.discount > 0 ? vm.quotation.discount : 0);

                if (!(vm.quotation.quotationId > 0)) {
                    vm.quotation.tax = vm.rounding(
                        (totalChargesList * vm.quotation.taxPercent) / 100
                    );
                    vm.quotation.amount = vm.rounding(
                        totalChargesList + vm.quotation.tax
                    );
                }

                if (vm.quotation.period > 0) {
                    vm.perInstallmentChanged();
                    vm.calculateEachInstallment();
                }
                vm.downPaymentChanged();
            };

            vm.taxAcceptedChanged = function () {
                if (vm.taxAccepted)
                    vm.quotation.taxPercent = vm.taxPercent;
                else
                    vm.quotation.taxPercent = 0;
                vm.updateCharges();
                vm.perInstallmentChanged();
                vm.downPaymentChanged();

            };

            vm.loadandApplyTariffToAllLines = function () {
                if (vm.quotation.quotationLines)
                    vm.quotation.quotationLines.forEach(e => vm.loadandApplyTariff(e));
            };

            vm.loadandApplyTariff = function (line) {
                if (line.vehicleTypeId) {
                    vm.loading = true;
                    var quotationCategory = 1; // rental
                    var groupId = line.vehicleTypeId;
                    if (!line.years)
                        line.years = 0;
                    var duration = line.years;

                    tariffHelper.loadTariff(groupId, quotationCategory, function () {
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
                                var chargesWithoutTax = (charge.charges * 100) / (100 + vm.quotation.taxPercent);
                                charge.tax = utilities.round(charge.charges - chargesWithoutTax, 2);

                            } else {
                                //prices are without tax. calculate tax and include in total
                                charge.tax = utilities.round(charge.charges * vm.quotation.taxPercent / 100, 2);
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
                //vm.recalculateQuotation();
            };
            vm.normalizeQuotationCharges = function () {
                if (!vm.quotation || !vm.quotation.quotationcharges) return;

                vm.quotation.quotationcharges.forEach(function (c) {

                    c.amount = parseFloat(c.amount) || 0;
                    c.financeCost = parseFloat(c.financeCost) || 0;
                    c.emi = parseFloat(c.emi) || 0;

                    c.isAddInEMI = !!c.isAddInEMI;
                    c.applyOnClosing = !!c.applyOnClosing;
                });
            };

            // Sum of all charges except typeId 78 and 79
            vm.getTotalCharges = function () {
                if (!vm.quotation || !vm.quotation.quotationcharges) return 0;

                return vm.quotation.quotationcharges
                    .filter(c => !c.applyOnClosing && c.chargesTypeId != 78 && c.chargesTypeId != 79)
                    .reduce((total, c) => total + (parseFloat(c.amount) || 0), 0);
            };

            function getChargesSettings() {
                vm.loading = true;

                chargesSettingService.getChargesSettings({ module: 9 }).success(function (data) {
                    vm.chargesSettings = data.items;
                    vm.quotation.quotationcharges = data.items;
                    vm.normalizeQuotationCharges();
                }).finally(function () {
                    vm.loading = false;
                });
            };
            function loadChargesFromSettings() {

                for (var i = 0; i < vm.chargesSettings.length; i++) {

                    var foundLines = $filter('filter')(vm.quotation.quotationcharges, {
                        chargesTypeId: vm.chargesSettings[i].chargesTypeId
                    }, true);



                    if (foundLines.length == 0) {
                        vm.quotation.quotationcharges.push(
                            {
                                quotationId: null,
                                order: vm.chargesSettings[i].order,
                                chargesTypeId: vm.chargesSettings[i].chargesTypeId,
                                rateTypeId: vm.chargesSettings[i].rateTypeId,
                                discountPercent: 0,
                                rate: null,
                                units: null,
                                amount: null,
                                applyOnClosing: vm.chargesSettings[i].applyOnClosing,
                                isMandatory: vm.chargesSettings[i].isMandatory,
                                taxable: vm.chargesSettings[i].taxable,
                                accepted: ((vm.chargesSettings[i].chargesType.chargesCategory == 2 || vm.chargesSettings[i].chargesType.chargesCategory == 3 || vm.chargesSettings[i].chargesType.chargesCategory == 4) ? false : true),
                                included: false,
                                excessRate: null,
                                limit: null,
                                chargesType: vm.chargesSettings[i].chargesType,
                                rateType: vm.chargesSettings[i].rateType,
                                tariff: []

                            }
                        );
                    }
                }
            }

            function getChargesSettingsForEdit() {

                chargesSettingService.getChargesSettings({ module: 9 }).success(function (data) {
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


            // Opening Calculation PopUp
            vm.calculationDetail = function (quotationLine, year) {
                quotationLine.year = year;
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/equipmentSales/quotationVehicleWise/calculationDetail.cshtml',
                    controller: 'tenant.views.crs.equipmentSales.quotationVehicleWise.calculationDetail as vm',
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
                line.quantity = 0;
                line.amount = null;
                line.amountPerMonth = 0;
                line.amountPerVehicle = 0;

                //if (vm.currentExtrasLines)
                //    line.extrasLines = JSON.parse(JSON.stringify(vm.currentExtrasLines));
                //else if (vm.quotation.id > 0 || isRevised) {


                //    line.extrasLines = JSON.parse(JSON.stringify(vm.currentExtrasLinesForEdit));

                //}
                return line;
            };

            vm.searchContact = function ($select) {
                return directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true, includeUnApproved: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            var getContactsByCompanyId = function () {
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

                // vm.loadandApplyTariffToAllLines();

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
            vm.searchCustomerPopoup = function () {
                var modalInstance = openSearchContactModel(null, 2);

                modalInstance.result.then(function (result) {
                    if (result != null) {
                        vm.agreement.customer = result;
                        vm.customerSelected();
                    }
                });
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
            vm.searchModel = function ($select) {
                return vehicleModelService.searchVehicleModelForSale({ name: $select.search }).then(function (response) {
                    vm.models = response.data.items;
                });
            };
            vm.searchVehicles = function ($select) {
                if ($select.search == "") { vm.vehicles = null; return null; }
                var subStatuses = [3]; //1: Available, 7: Ready to go
                var ownerships = [1, 10];
                return equipmentSalesService.searchEquipmentsForQuotationVehicleWise({ plateNo: $select.search, chassisNo: $select.search, statusId: 'IDL', subStatuses: subStatuses, ownerships: ownerships }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };
            vm.getTariffGroups = function () {
                lookupService.getTariffGroups({}).success(function (data) {
                    vm.vehicleTypes = data.items;
                });
            };
            vm.roundingWithSeparator = function (value) {
                if (value == null) return null;

                // Round to 2 decimals
                var roundedValue = utilities.round(value, 2);

                // Convert to string with thousand separators
                var parts = roundedValue.toString().split('.');

                // Add thousand separators to integer part
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                // Only keep decimals if > 0
                if (parts[1] && parseInt(parts[1]) > 0) {
                    return parts.join('.');
                } else {
                    return parts[0];
                }
            };

            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };
            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
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
                vm.calculateChargesForAll(quotationLine);
            };

            //Remove row
            vm.removeRow = function (obj) {
                var index = vm.quotation.quotationLines.indexOf(obj);
                vm.quotation.quotationLines.splice(index, 1);
                vm.quotation.quotationLines.forEach(line => {
                    vm.calculateChargesForAll(line);
                });
                vm.calculateSums();
                vm.updateCharges();
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                vm.loading = true;
                getBillingMethods();
                getAllLocations();
                vm.branchTaxCode();

                var createOrRevise = null;

                if (isRevised)
                    createOrRevise = quotationVehicleWiseService.getQuotationForRevision({ id: quotationVehicleWiseId });
                else
                    createOrRevise = quotationVehicleWiseService.getQuotationForEdit({ id: quotationVehicleWiseId });

                createOrRevise.success(function (data) {

                    vm.quotation = data;
                    vm.quotation.emiFinanceCostSale = 0;
                    //vm.quotation.quotationLines = vm.quotation.quotationLines || [];
                    //vm.quotation.quotationcharges = vm.quotation.quotationcharges || [];

                    ////vm.calculateSums();
                    //vm.quotation.quotationcharges.forEach(chargesRow => {
                    //    vm.updateCharges(chargesRow);
                    //});



                    if (quotationId > 0) {
                        if (vm.quotation.isDownPaymentReceipt == true) {
                            vm.disableDownPayment = true;
                        }
                    }

                    if (vm.quotation.id > 0) {
                        getContactsByCompanyId();
                    }
                    if (!vm.quotation.id && !isRevised) {
                        vm.quotation.type = 3;
                        vm.quotation.taxPercent = vm.taxPercent;
                        //vm.quotation.quotationcharges = [];
                        getChargesSettings();

                    }
                    if (!vm.quotation.id) {
                        vm.taxAccepted = vm.taxPercent > 0;
                        vm.quotation.taxPercent = vm.taxAccepted ? vm.taxPercent : 0;
                    }
                    // EDIT
                    else {
                        vm.taxAccepted = vm.quotation.taxPercent > 0;
                    }

                    loadChargesFromSettings();
                    vm.calculateSums();
                    vm.updateCharges();
                    // Ensure exactly ONE row when creating new quotation
                    if (!quotationVehicleWiseId) {
                        vm.quotation.quotationLines = vm.quotation.quotationLines || [];

                        if (vm.quotation.quotationLines.length === 0) {
                            vm.addRow();
                        }
                        else if (vm.quotation.quotationLines.length > 1) {
                            // keep only first row since Add Row is hidden
                            vm.quotation.quotationLines = [vm.quotation.quotationLines[0]];
                        }
                    }
                    vm.downPaymentChanged();
                    vm.getOtherChargesEMI();
                    if (vm.quotation.noOfInstallment > 0) {
                        vm.quotation.emiFinanceCostSale = vm.rounding((vm.quotation.financeCostTotal + vm.quotation.financeCostTotalTax) / vm.quotation.noOfInstallment);
                    }
                }).finally(function () {
                    vm.loading = false;
                });

            }
            vm.calculateChargesForAll = (saleLines) => {
                //let quantity = parseFloat(saleLines.quantity) || 0;
                let amount = parseFloat(saleLines.amount) || 0;

                //let amount = quantity * price;

                saleLines.amount = vm.rounding(amount);

                let tax = (amount * vm.taxPercent) / 100;
                saleLines.tax = vm.rounding(tax);

                vm.calculateSums();
                vm.updateCharges();
            };

            vm.calculateSums = function () {
                vm.sumAmount = 0;
                vm.sumTax = 0;
                vm.sumTotal = 0;

                // Calculate totals for quotationLines
                vm.quotation.quotationLines.forEach(function (line) {
                    vm.sumAmount += isNaN(parseFloat(line.amount)) ? 0 : parseFloat(line.amount);
                    vm.sumTax += isNaN(parseFloat(line.tax)) ? 0 : parseFloat(line.tax);
                });

                // Calculate total for lines
                vm.sumTotal = vm.sumAmount + vm.sumTax;
                vm.downPaymentChanged();

            };
            //vm.calculateSums = function () {
            //    vm.sumAmount = 0;
            //    vm.sumTax = 0;

            //    (vm.quotation.quotationLines || []).forEach(line => {
            //        vm.sumAmount += parseFloat(line.amount) || 0;
            //        vm.sumTax += parseFloat(line.tax) || 0;
            //    });

            //    vm.sumTotal = vm.sumAmount + vm.sumTax;
            //};

            vm.onFincanceCostChanged = function () {
                vm.perInstallmentChanged();
                vm.recalculateOtherChargesEMI();
            };
            vm.recalculateFinance = function () {

                //let emiBaseAmount = vm.quotation.remainingAmount;

                ////vm.quotation.quotationcharges.forEach(c => {
                ////    let amt = parseFloat(c.amount) || 0;

                ////    if (c.isAddInEMI !== false) {
                ////        emiBaseAmount += amt;
                ////    }
                ////});

                //let percent = parseFloat(vm.quotation.financeCostPercent) || 0;

                //// Monthly finance cost
                //let financeCost = (emiBaseAmount * percent) / 100;

                //// Total finance cost (for entire period)
                //vm.quotation.financeCostTotal = financeCost;


                //// Total Amount With Finance
                ////vm.quotation.totalAmountWithFinance = vm.rounding(
                ////    vm.quotation.remainingAmount + vm.quotation.financeCostTotal
                ////);
                //vm.perInstallmentChanged();
            };

            vm.updateCharges = function () {
                vm.quotation.amount = 0;
                vm.quotation.tax = 0;
                vm.quotation.quotationcharges.forEach(function (c) {
                    let chargeAmount = parseFloat(c.amount) || 0;
                    if (c.chargesTypeId == 78) {
                        vm.quotation.amount += chargeAmount;
                        if (c.taxable && !isNaN(chargeAmount)) {
                            let taxAmount = (chargeAmount * vm.quotation.taxPercent) / 100;
                            vm.quotation.tax += taxAmount;
                        }
                    }
                    else if (c.chargesTypeId == 79 && c.taxable && !isNaN(chargeAmount)) {
                        c.tax = (chargeAmount * vm.quotation.taxPercent) / 100;
                    }
                    else {
                        if (c.taxable && vm.quotation.taxPercent > 0) {
                            c.tax = chargeAmount * (vm.quotation.taxPercent / 100);
                            c.amountWithTax = c.amount + c.tax;
                        }
                    }
                });
                vm.processingFeeCharges =
                    (vm.quotation.quotationcharges.filter(e => e.chargesTypeId === 79)[0] || {}).amount || 0;

                vm.quotation.amount += vm.quotation.tax;
                if (vm.quotation.amount < 0) {
                    vm.quotation.amount = 0;
                }
                vm.quotation.amount -= (vm.quotation.discount > 0 ? vm.quotation.discount : 0);
                vm.recalculateFinance();
                var perInstallmentAmount = utilities.round(parseFloat(vm.quotation.totalCharges - vm.quotation.advance) / parseFloat(vm.quotation.period));
                //vm.quotation.perInstallmentAmount = perInstallmentAmount;
                //for (let i = 0; i < vm.quotation.quotationPaymentInstallments.length; i++) {
                //    if (vm.quotation.advance > 0) {

                //        vm.quotation.quotationPaymentInstallments[i + 1].amount = vm.quotation.perInstallmentAmount;  // Set the same value for 'amount' property
                //    }
                //    else {
                //        vm.quotation.quotationPaymentInstallments[i].amount = vm.quotation.perInstallmentAmount;  // Set the same value for 'amount' property

                //    }
                //}
            };


            //vm.getExcludedChargesTotal = function () {
            //    let total = 0;

            //    vm.quotation.quotationcharges.forEach(function (c) {
            //        if (c.isAddInEMI === false) {
            //            total += parseFloat(c.amount) || 0;
            //        }
            //    });

            //    return total;
            //};

            vm.downPaymentChanged = function () {

                let excludedTotal = vm.getExcludedChargesTotal();
                let downPayment = parseFloat(vm.quotation.downPayment) || 0;

                //if (excludedTotal > downPayment) {
                //    abp.message.error(
                //        'Down Payment should be greater than or equal to excluded charges'
                //    );
                //    return;
                //}

                // existing logic
                vm.quotation.remainingAmount =
                    vm.quotation.amount - downPayment;

                vm.recalculateFinance();
                vm.perInstallmentChanged();
                vm.recalculateOtherChargesEMI();
            };
            vm.onEmiFlagChanged = function (charge) {

                if (!charge) {
                    if (vm.quotation && vm.quotation.quotationcharges) {
                        vm.quotation.quotationcharges.forEach(function (c) {
                            vm.onEmiFlagChanged(c);
                        });
                    }

                    vm.getIncludedChargesTotal();
                    vm.getOtherChargesEMI();
                    vm.getExcludedChargesTotal();
                    vm.onNumOfInstallmentsChange();
                    return;
                }

                if (charge && charge.isAddInEMI === true) {

                    let amount = parseFloat(charge.amount) || 0;
                    let percent = parseFloat(vm.quotation.financeCostPercent) || 0;

                    let installments = Math.min(
                        parseInt(vm.quotation.noOfInstallment) || 1,
                        12
                    );

                    charge.financeCost = vm.rounding(
                        amount * (percent / 100) * installments
                    );
                    charge.emi = vm.rounding((amount + charge.financeCost) / installments);
                    charge.emi = vm.rounding(charge.emi);
                    if (vm.quotation.taxPercent > 0) {

                        charge.financeCostTax = vm.rounding(charge.financeCost * (vm.quotation.taxPercent / 100));
                        charge.emiTax = vm.rounding(charge.emi * (vm.quotation.taxPercent / 100));
                    }
                    else {
                        charge.tax = 0;
                        charge.financeCostTax = 0;
                        charge.emiTax = 0;
                    }
                    charge.financeCostWithTax = vm.rounding(charge.financeCost + charge.financeCostTax);
                    charge.emiTax = vm.rounding(charge.emiTax);
                    charge.emiWithTax = charge.emi + charge.emiTax;
                    charge.emiWithTax = vm.rounding(charge.emiWithTax);
                }
                else if (charge && charge.isAddInEMI !== true) {
                    charge.financeCost = 0;
                    charge.financeCostTax = 0;
                    charge.emi = 0;
                    charge.emiTax = 0;
                    charge.tax = 0;
                }

                vm.getIncludedChargesTotal();
                vm.getOtherChargesEMI();
            };
            vm.recalculateOtherChargesEMI = function () {

                let percent = parseFloat(vm.quotation.financeCostPercent) || 0;

                // 🔒 Restrict to 12 installments maximum
                let installments = Math.min(
                    parseInt(vm.quotation.noOfInstallment) || 1,
                    12
                );

                if (installments <= 0) {
                    installments = 1;
                }

                angular.forEach(vm.quotation.quotationcharges, function (charge) {

                    if (charge.isAddInEMI) {

                        let amount = parseFloat(charge.amount) || 0;

                        charge.financeCost = vm.rounding(
                            amount * (percent / 100) * installments
                        );

                        charge.emi = vm.rounding(
                            (amount + charge.financeCost) / installments
                        );
                    }
                    else {
                        charge.financeCost = 0;
                        charge.emi = 0;
                    }

                });

                vm.getIncludedChargesTotal();
                vm.getOtherChargesEMI();
            };


            vm.perInstallmentChanged = function () {
                if (!vm.quotation.noOfInstallment) {
                    vm.quotation.perInstallmentAmount = 0;
                    return;
                }
                else {
                    //var amountWithoutProcessingFee = vm.quotation.financeCostTotal * vm.quotation.noOfInstallment
                    //var amountWithoutProcessingFee = angular.copy(vm.quotation.totalAmountWithFinance);
                    //amountWithoutProcessingFee = vm.quotation.amount - vm.quotation.downPayment;
                    var remainingAmountWithoutTax = vm.quotation.remainingAmount / (1 + vm.quotation.taxPercent / 100);
                    vm.quotation.financeCostTotal = vm.rounding(remainingAmountWithoutTax * (vm.quotation.financeCostPercent / 100) * vm.quotation.noOfInstallment);
                    if (vm.quotation.taxPercent > 0)
                        vm.quotation.financeCostTotalTax = vm.quotation.financeCostTotal * (vm.quotation.taxPercent / 100);
                    else
                        vm.quotation.financeCostTotalTax = 0;

                    vm.quotation.financeCostTotalWithTax = vm.quotation.financeCostTotal + vm.quotation.financeCostTotalTax;
                    vm.quotation.emiCore = (vm.quotation.financeCostTotalWithTax + vm.quotation.remainingAmount) / vm.quotation.noOfInstallment;
                    //var perInstamentAmount = parseFloat(vm.quotation.totalAmountWithFinance) / parseFloat(vm.quotation.noOfInstallment);
                    //vm.quotation.perInstallmentAmount = vm.rounding(perInstamentAmount);
                }
                //vm.recalculateFinance();
                //vm.onEmiFlagChanged();
                vm.recalculateOtherChargesEMI();
            };

            vm.vehicleSelected = function (line) {
                if (!line.vehicle) return;

                line.makeAndModel = line.vehicle.model.make.name + ' ' + line.vehicle.model.name;
                line.vehicleId = line.vehicle.id;
                line.vehicleModelId = line.vehicle.modelId;
                line.vehiclePrice = line.vehicle.purchasePrice;
                // Map to expected format
                line.vehicleModel = {
                    plateNo: line.vehicle.plateNo,
                    id: line.vehicle.modelId,       // use modelId
                    makeId: line.vehicle.modelId,  // if your code uses this
                    make: {
                        id: line.vehicle.model.make.id || null,  // optional if not present
                        name: line.vehicle.model.make.name || ''
                    },
                    name: line.vehicle.model.name || ''
                };



                //line.vehicleTypeId = line.vehicleType.id;
                //line.vehiclePrice = line.vehicle.purchasePrice || 0;
                //line.amount = line.vehicle.salePrice || 0;

                //line.price = line.salePrice;

                //line.taxApplicable = true;
                //line.tariffGroupId = line.vehicle.tariffGroupId || null;

                vm.calculateChargesForAll(line);
            };


            vm.costPriceOrMarginChanged = function (row) {
                // Apply margin on purchase price if marginPercent exists
                //if (row.purchasePrice && row.marginPercent) {
                //    row.price = vm.rounding(row.purchasePrice * (1 + row.marginPercent / 100));
                if (row.amount) {
                    row.amount = vm.rounding(row.amount);
                }
                //} else {
                //    row.price = vm.rounding(row.purchasePrice || 0);
                //}

                vm.priceChanged(row);
                //vm.recalculateQuotation();
            };


            vm.downPaymentOrInstallmentsChanged = function () {
                let remainingAmount = vm.quotation.amount - (parseFloat(vm.quotation.downPayment) || 0);
                vm.quotation.remainingAmount = vm.rounding(remainingAmount);

                let noOfInstallments = parseFloat(vm.quotation.noOfInstallment) || 0;
                vm.quotation.perInstallmentAmount = noOfInstallments > 0
                    ? vm.rounding(remainingAmount / noOfInstallments)
                    : 0;
            };

            // When sale price changes
            vm.onSalePriceChanged = function (row) {
                let quantity = parseFloat(row.quantity) || 0;
                let price = parseFloat(row.price) || 0;
                row.amount = vm.rounding(quantity * price);

                // Recalculate all totals
                vm.updateTotalWithTax();
            };
            function getBillingMethods() {
                vm.loading = true;
                billingMethodService.getBillingMethods({ category: 1 }).success(function (data) {
                    vm.billingMethods = data.items.filter(i => i.isActive && (i.locationId == null || i.locationId === appSession.user.locationId) && (i.userId == null || i.userId === appSession.user.id));
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.calculateEachInstallment = function () {
                if (!vm.quotation.period) {
                    vm.quotation.perInstallmentAmount = 0;
                    return;
                }
                else {
                    if (vm.quotation.quotationcharges.length > 0) {
                        vm.processingFeeCharges = vm.quotation.quotationcharges.filter(e => e.chargesTypeId === 79)[0].amount;
                    }
                    var perInstallmentAmount = utilities.round(parseFloat(vm.quotation.totalCharges - vm.quotation.advance) / parseFloat(vm.quotation.period));
                    vm.quotation.perInstallmentAmount = perInstallmentAmount;
                    vm.quotation.quotationPaymentInstallments.forEach(function (value, index) {
                        if (index === 0 && vm.quotation.advance > 0) {
                            value.amount = vm.quotation.advance;  // Show down payment
                        } else {
                            value.amount = vm.quotation.perInstallmentAmount;  // Show per installment
                        }
                    });
                }
            }
            vm.calculateTotalCharges = function () {
                let vehicleTotal = vm.quotation.quotationLines.reduce((sum, line) => sum + (line.price || 0), 0);
                let chargesTotal = vm.quotation.quotationcharges.reduce((sum, c) => sum + (c.amount || 0), 0);
                vm.quotation.totalCharges = vehicleTotal + chargesTotal;

                // Update Remaining Amount
                vm.quotation.remainingAmount = vm.quotation.totalCharges - (vm.quotation.advance || 0);
            };

            // Update Per Installment and Total Amount
            //vm.updateInstallments = function () {
            //    let total = vm.quotation.totalCharges - (vm.quotation.advance || 0);

            //    // If tax accepted, add tax
            //    if (vm.taxAccepted) total += vm.quotation.tax || 0;

            //    vm.quotation.totalAmount = total;

            //    // Calculate per installment
            //    if (vm.quotation.period && vm.quotation.period > 0) {
            //        vm.quotation.perInstallmentAmount = total / vm.quotation.period;
            //    } else {
            //        vm.quotation.perInstallmentAmount = total;
            //    }
            //};

            // Watch downpayment or number of installments changes
            //$scope.$watchGroup([
            //    () => vm.quotation.advance,
            //    () => vm.quotation.period,
            //    () => vm.taxAccepted
            //], function () {
            //    vm.updateInstallments();
            //});
            vm.updateTotalWithTax = function () {
                // Recalculate sumAmount and sumTax
                vm.sumAmount = 0;
                vm.sumTax = 0;

                vm.quotation.quotationLines.forEach(line => {
                    let amount = parseFloat(line.amount) || 0;
                    let tax = vm.taxAccepted ? (amount * vm.taxPercent / 100) : 0;

                    line.tax = vm.rounding(tax);

                    vm.sumAmount += amount;
                    vm.sumTax += line.tax;
                });

                // Include extra charges
                if (vm.quotation.quotationcharges) {
                    vm.quotation.quotationcharges.forEach(c => {
                        if (c.accepted) {
                            let amount = parseFloat(c.amount) || 0;
                            let tax = vm.taxAccepted && c.taxable ? (amount * vm.taxPercent / 100) : 0;
                            c.tax = vm.rounding(tax);
                            vm.sumAmount += amount;
                            vm.sumTax += tax;
                        }
                    });
                }

                // Total amount including tax
                vm.quotation.totalAmount = vm.rounding(vm.sumAmount + vm.sumTax);

                // Remaining after advance/downpayment
                let remaining = vm.quotation.totalAmount - (parseFloat(vm.quotation.advance) || 0);
                vm.quotation.remainingAmount = vm.rounding(remaining);

                // Per installment
                if (vm.quotation.period && vm.quotation.period > 0) {
                    vm.quotation.perInstallmentAmount = vm.rounding(remaining / vm.quotation.period);
                } else {
                    vm.quotation.perInstallmentAmount = remaining;
                }
            };

            vm.getExcludedChargesTotal = function () {
                if (!vm.quotation || !vm.quotation.quotationcharges) {
                    vm.quotation.chargesUpfront = 0;
                    return 0;
                }

                var excludedTotal = vm.quotation.quotationcharges
                    .filter(function (c) {
                        return !c.applyOnClosing && c.chargesTypeId != 78 && c.chargesTypeId != 79 &&
                            c.amount > 0 &&
                            c.isAddInEMI === false;
                    })
                    .reduce(function (sum, c) {
                        return sum + (c.amount + c.tax || 0);
                    }, 0);

                vm.quotation.chargesUpfront = excludedTotal;

                return excludedTotal;
            };
            vm.getIncludedChargesTotal = function () {
                if (!vm.quotation || !vm.quotation.quotationcharges) {
                    vm.quotation.chargesFinanceCost = 0;
                    return 0;
                }

                var includedTotal = vm.quotation.quotationcharges
                    .filter(function (c) {
                        return !c.applyOnClosing && c.chargesTypeId != 78 && c.chargesTypeId != 79 &&
                            c.financeCost > 0 &&
                            c.isAddInEMI === true;
                    })
                    .reduce(function (sum, c) {
                        return sum + (c.financeCost + c.financeCostTax || 0);
                    }, 0);
                vm.getExcludedChargesTotal();
                vm.quotation.chargesFinanceCost = includedTotal;

                return includedTotal;
            };
            vm.getOtherChargesEMI = function () {
                if (!vm.quotation || !vm.quotation.quotationcharges) {
                    vm.quotation.otherChargesEMI = 0;
                    return 0;
                }

                var total = vm.quotation.quotationcharges
                    .filter(c =>
                        !c.applyOnClosing && c.chargesTypeId != 78 && c.chargesTypeId != 79 &&
                        c.isAddInEMI === true
                    )
                    .reduce((sum, c) => sum + (parseFloat(c.emi) + (c.emiTax) || 0), 0);

                vm.quotation.otherChargesEMI = vm.rounding(total);

                vm.quotation.perInstallmentAmount =
                    vm.rounding((vm.quotation.emiCore || 0) + vm.quotation.otherChargesEMI);

                return vm.quotation.otherChargesEMI;
            };


            vm.save = function () {
                //var excludedTotal = vm.getExcludedChargesTotal();
                //var downPayment = vm.quotation.downPayment || 0;

                //if (excludedTotal > downPayment) {
                //    abp.message.error(
                //        'Down Payment must be greater than or equal to excluded charges.\n' +
                //        'Excluded Charges Total: ' + excludedTotal.toFixed(2),
                //        'Validation Error'
                //    );
                //    return;
                //}
                vm.saving = true;
                vm.quotation.quotationLines.forEach(e => {
                    var rentRow = {
                        chargesTypeId: 1,
                        rate: e.extras,
                        excessRate: e.cost,
                        rateTypeId: 1
                    };
                    //vm.calculateChargesForAll(e);
                });

                var createOrRevise = null;
                if (isRevised)
                    createOrRevise = quotationVehicleWiseService.reviseQuotation({ quotation: vm.quotation, revisedQuotationId: vm.revisedQuotationId });
                else
                    createOrRevise = quotationVehicleWiseService.createOrUpdateQuotation({ quotation: vm.quotation });

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
