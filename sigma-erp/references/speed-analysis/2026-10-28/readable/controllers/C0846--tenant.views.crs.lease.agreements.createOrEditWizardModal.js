// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:228481-229396
appModule.controller('tenant.views.crs.lease.agreements.createOrEditWizardModal', [
        '$scope', '$filter', 'utilities', '$uibModal', '$uibModalInstance', 'uiGridConstants', 'chargesCalculator', 'tariffHelper', 'abp.services.app.agreement', 'options',
        'abp.services.app.vehicle', 'abp.services.app.directory', 'abp.services.app.tariff', '$rootScope', 'abp.services.app.leaseAgreement',
        'abp.services.app.leaseClause', 'abp.services.app.commonLookup', 'abp.services.app.agreementSaleOrder',
        function ($scope, $filter, utilities, $uibModal, $uibModalInstance, uiGridConstants, chargesCalculator, tariffHelper, agreementService, options, vehicleService,
            directoryService, tariffService, $rootScope, leaseAgreementService, leaseClauseService, lookupService, agreementSaleOrderService) {

            var vm = this;
            var agreementId = options.agreementId;
            var chargesSettings = options.chargesSettings;
            var chargesLines = options.chargesLines;
            vm.canChangeRates = abp.auth.hasPermission('Pages.Tenant.Lease.Agreements.Edit.CanChangeRates');
            vm.canEditMonth = abp.auth.hasPermission('Pages.Tenant.Lease.Agreements.MonthChange');
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.isTaxOptional = utilities.parseBoolean(abp.setting.get("App.General.IsTaxOptional"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.manualAgreementNo = utilities.parseBoolean(abp.setting.get("App.General.ManualAgreementNo"));
            vm.enableManualAgreementNo = utilities.parseBoolean(abp.setting.get("App.General.EnableManualAgreementNo"));
            vm.enableAdditionalNotes = utilities.parseBoolean(abp.setting.get("App.General.EnableAdditionalNotes"));
            vm.isWeeklyMonthlyEnabled = utilities.parseBoolean(abp.setting.get("App.General.WeeklyMonthlyRental"));
            vm.isDepositsEnable = abp.features.isEnabled("CRS.Vouchers.Deposits");
            var isTariffEnabled = abp.features.isEnabled("CRS.Tariff");
            vm.isSaleOrderEnabled = abp.features.isEnabled("CRS.Vouchers.SaleOrders");
            vm.isUserWiseDiscountEnable = abp.features.isEnabled("CRS.UserWiseDiscount");
            vm.isAdvancePaymentRequired = utilities.parseBoolean(abp.setting.get("App.General.IsAdvancePaymentRequired"));
            vm.isDeliveryMovementEnable = abp.features.isEnabled("CRS.DeliveryAndCollectionMovements");
            vm.isVipCustomer = utilities.parseBoolean(abp.setting.get("App.General.IsVipCustomer"));

            vm.taxAccepted = false;
            vm.showAdvancePopupOnSave = false;
            vm.showDepositPopupOnSave = false;
            vm.loading = false;
            vm.canOpenAgreementWithoutSaleOrder = abp.auth.hasPermission('Pages.Tenant.Lease.Agreements.CanOpenAgreementWithoutSaleOrderLease');
            vm.canChangeLeaseClauses = abp.auth.hasPermission('Pages.Tenant.Lease.Agreements.CanChangeLeaseClauses');
            vm.discountAuthCode = null;
            var enableFutureAgreementCheckOuts = utilities.parseBoolean(abp.setting.get("App.Speed.Common.EnableFutureAgreementCheckOuts"));
            var doNotIncludeReplacementVehicle = utilities.parseBoolean(abp.setting.get("App.Speed.Common.DoNotIncludeReplacementVehicles"));
            var notLoadTariff = false;
            vm.chargesSettings = chargesSettings;
            vm.vehicles = [];
            vm.customers = [];
            vm.drivers = [];
            var isValid = true;
            var errorMessage = {};
            var agreementCategory = 2; //Lease
            vm.isIndividualCustomerRadio = true;
            //var isTariffEnabled = abp.features.isEnabled("CRS.Tariff");

            vm.agreementProvisionItems = [
                { id: 1, name: app.localize('Battery') },
                { id: 2, name: app.localize('Tyres') }
            ];

            vm.agreementProvisionTypes = [
                { id: 1, name: app.localize('KMs') },
                { id: 2, name: app.localize('Months') }
            ];

            vm.agreementPreTerminationTypes = [
                { id: 1, name: app.localize('Fixed') },
                { id: 2, name: app.localize('PercentageOfRemainingPeriod') },
                { id: 3, name: app.localize('NoOfMonths') },
            ];
            vm.agreementTypes = [
                { type: "Daily", id: 1 },
                { type: "Weekly", id: 2 },
                { type: "Monthly", id: 3 }
            ];

            var rateTypes = {
                perDay: { id: 1, name: '/Day' },
                perWeek: { id: 2, name: '/Week' },
                perMonth: { id: 3, name: '/Month' },
            };

            vm.addProvisionRow = function () {
                vm.agreement.provisions.push(
                    {
                        item: null,
                        type: null,
                        value: null
                    });
            };
            vm.addPreTerminationRuleRow = function () {
                vm.agreement.preTerminationRules.push(
                    {
                        fromMonth: null,
                        toMonth: null,
                        type: null,
                        penalityValue: null
                    });
            };

            vm.clearAdditionalDriver = function () {
                vm.agreement.additionalDriver = null;
                vm.agreement.additionalDriverId = null;
            };

            vm.searchGoogleLocations = function ($select) {
                if ($select.search == "") { vm.vehicles = null; return null; }
                lookupService.searchGooglePlaces({ keyWord: $select.search }).then(function (response) {
                    vm.geoLocations = response.data.items;
                });
            };

            function openApplyDiscountModal(chargesRow) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/discountCodes/applyDiscountModal.cshtml',
                    controller: 'tenant.views.crs.discountCodes.applyDiscountModal as vm',
                    backdrop: 'static',
                    resolve: {
                        options: function () {
                            return {
                                chargesRow: chargesRow,
                                discountAuthCode: vm.discountAuthCode
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.discountAuthCode = result.discountAuthCode;
                    chargesRow.discountPercent = result.chargesRow.discountPercent;
                    chargesRow.discountedRate = result.chargesRow.discountedRate;
                    chargesRow.rate = chargesRow.discountedRate > chargesRow.rate ? chargesRow.discountedRate : chargesRow.rate;
                });
            }

            vm.applyDiscount = function (chargesRow) {

                openApplyDiscountModal(chargesRow);
            };

            vm.disableRate = function (chargesRow) {

                if (chargesRow.tariff.length > 1) {
                    var foundLines = $filter('filter')(chargesRow.tariff, {
                        included: chargesRow.included,
                        rate: chargesRow.rate,
                        excessRate: chargesRow.excessRate,
                        limit: chargesRow.limit
                    }, true);
                    if (foundLines.length > 0) {
                        return foundLines[0].rate > 0;
                    }
                    else {
                        return false;
                    }
                }

                return chargesRow.tariff[0].rate > 0;
            };

            vm.removeProvisionRow = function (row) {
                var index = vm.agreement.provisions.indexOf(row);
                vm.agreement.provisions.splice(index, 1);
            };

            vm.removePreTerminationRuleRow = function (row) {
                var index = vm.agreement.preTerminationRules.indexOf(row);
                vm.agreement.preTerminationRules.splice(index, 1);
            };

            vm.addClauseRow = function () {
                vm.agreement.clauses.push(
                    {
                        clauseId: null,
                    });
            };

            vm.addClauses = function () {
                if (vm.agreement.clauses.length == 0) {
                    vm.leaseClauseTypes.forEach(function (row) {
                        vm.loading = true;
                        leaseClauseService.getClausesForEdit({
                            id: row.id
                        }).success(function (data) {
                            row.leaseClauses = data.clauses;
                            var foundLines = $filter('filter')(row.leaseClauses, {
                                isDefault: true
                            }, true);
                            if (foundLines.length >= 1) {
                                vm.agreement.clauses.push(
                                    {
                                        clause: {
                                            clauseTypeId: row.id
                                        },
                                        leaseClauses: row.leaseClauses,
                                        clauseId: foundLines[0].id
                                    });

                            }
                        }).finally(function () {
                            vm.loading = false;
                        });
                    });
                }
            };

            vm.removeClauseRow = function (row) {
                var index = vm.agreement.clauses.indexOf(row);
                vm.agreement.clauses.splice(index, 1);
            };

            vm.noOfMonthsChange = function () {
                if (vm.agreement.movements[0].outDetail.dateTime) {
                    vm.agreement.endDate = moment(vm.agreement.movements[0].outDetail.dateTime).add(vm.agreement.noOfMonths, 'M');
                    vm.endDateChanged();
                }
            };

            vm.leaseRateTypes = [{ id: 3, name: app.localize('/Month') }, { id: 6, name: app.localize('OneTime') }];

            vm.changeStatusReceiptCreation = function () {
                if (vm.advance.amount > 0)
                    vm.showAdvancePopupOnSave = true;
                else
                    vm.showAdvancePopupOnSave = false;
            };
            vm.changeStatusDepositCreation = function () {
                if (vm.deposit.amount > 0)
                    vm.showDepositPopupOnSave = true;
                else
                    vm.showDepositPopupOnSave = false;
            };
            function allFuelLevels() {
                vm.allFuelLevels = utilities.allFuelLevels();
            };
            vm.localize = function (input) {
                return app.localize(input);
            };
            vm.driverChargesPopoup = function () {
                var modalInstance = openDriverChargesModel();
                modalInstance.result.then(function (result) {
                    if (result != null)
                        vm.agreement.charges = result;
                });
            };
            function openDriverChargesModel() {
                return $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/driverChargesModal.cshtml',
                    controller: 'tenant.views.crs.agreements.driverChargesModal as vm',
                    backdrop: 'static',
                    resolve: {
                        agreementCharges: function () {
                            return vm.agreement.charges
                        }
                    }
                });
            }
            //date change calls on loading data first time in edit mode. disable tariff loading if it is first time loading of editing mode
            var startDateLoaded = false;
            vm.startDateChanged = function () {
                if (vm.agreement.noOfMonths)
                    vm.agreement.endDate = moment(vm.agreement.movements[0].outDetail.dateTime).add(vm.agreement.noOfMonths, 'M');
                if (!vm.isEditMod) {
                    if (isTariffEnabled && !notLoadTariff)
                        tariffHelper.applyTariff(vm.agreement);
                }
                else
                    startDateLoaded = true;
            };
            vm.searchAdditionalDrivers = function ($select) {
                if (!$select.search) return;
                return directoryService.searchPersonStaffCustomer({ keyword: $select.search }).then(function (response) {
                    vm.additionaldrivers = response.data.items;
                });
            };
            vm.searchStaff = function ($select) {
                if (!$select.search) return;
                return directoryService.search({ keyword: $select.search, contactType: 1 }).then(function (response) {
                    vm.staffList = response.data.items;
                });
            };

            vm.agreementTypeSelected = function () {
                //convert time based rates to corresponding rate type based on selected agreement type
                for (var i = 0; i < vm.agreement.charges.length; i++) {
                    if (vm.agreement.charges[i].rateTypeId == 1 || vm.agreement.charges[i].rateTypeId == 2 || vm.agreement.charges[i].rateTypeId == 3) {
                        vm.agreement.charges[i].rateTypeId = rateTypes.perMonth.id;
                        vm.agreement.charges[i].rateType = rateTypes.perMonth;
                    }
                }
                if (isTariffEnabled && !notLoadTariff)
                    tariffHelper.applyTariff(vm.agreement);
            };

            var endDateLoaded = false;
            vm.endDateChanged = function () {
                if (!vm.isEditMod) {
                    if (isTariffEnabled && !notLoadTariff)
                        tariffHelper.applyTariff(vm.agreement);
                }
                else
                    endDateLoaded = true;
            };

            vm.searchVehicles = function ($select) {
                if ($select.search == "") {
                    vm.vehicles = null; return null;
                }
                var subStatuses = [1, 7];
                return vehicleService.searchVehicles({
                    plateNo: $select.search, statusId: 'IDL', subStatuses: subStatuses, source: 'openagreement',
                    doNotIncludeReplacementVehicle: doNotIncludeReplacementVehicle, tariffGroupId: vm.vehicleTypeId, modelId: vm.vehicleModelId
                }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };

            vm.searchCustomers = function ($select) {
                if (!$select.search) return;
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true, includeSalesPerson: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            vm.searchCustomerPopoup = function () {
                var modalInstance = openSearchContactModel(null, 2);

                modalInstance.result.then(function (result) {
                    if (result != null) {
                        vm.agreement.customer = result;
                        vm.customerSelected();
                    }
                });
            };

            vm.searchDrivers = function ($select) {
                if (!$select.search) return;
                //whereas contactCategory: 1 (person). get all persons which includes staff as well
                return directoryService.search({ keyword: $select.search, contactCategory: 1 }).then(function (response) {
                    vm.drivers = response.data.items;
                });
            };

            vm.searchDriverPopoup = function () {
                var modalInstance = openSearchContactModel(1, null);

                modalInstance.result.then(function (result) {
                    if (result != null)
                        vm.agreement.driver = result;
                });
            };



            vm.searchAdditionalDriverPopoup = function () {
                var modalInstance = openSearchContactModel(1, 2);

                modalInstance.result.then(function (result) {
                    if (result != null)
                        vm.agreement.additionalDriver = result;
                });
            };

            vm.vehicleSelected = function () {
                vm.agreement.movements[0].outDetail.fuelLevel = vm.agreement.vehicle.fuelLevel;
                vm.agreement.movements[0].outDetail.km = vm.agreement.vehicle.kMs;
                vm.agreement.movements[0].outDetail.makeAndModel = vm.agreement.vehicle.make + ' ' + vm.agreement.vehicle.model;

                var groupId = vm.agreement.vehicle.tariffGroupId;
                if (groupId == null) groupId = -1;

                if (isTariffEnabled && !vm.isEditMod && !notLoadTariff) {
                    //load and apply tariff
                    tariffHelper.loadTariff(groupId, agreementCategory, function () {
                        tariffHelper.applyTariff(vm.agreement);
                    });
                }
            };

            vm.customerSelected = function () {

                //if contact (i.e individual person)
                if (vm.agreement.customer.contactCategory == 1) {
                    vm.agreement.driver = vm.agreement.customer;
                    vm.driverSelected();
                    vm.isIndividualCustomerRadio = true;
                    vm.agreement.driverType = 1;
                    vm.individualCustomerRadioSelected();
                }
                if (vm.agreement.customer.contactCategory == 2) {
                    //  vm.isCompany = true;
                    vm.isIndividualCustomerRadio = false;
                    vm.agreement.driverType = 3;
                    vm.individualCustomerRadioSelected();
                }
                if (vm.isEditMod && vm.agreementTaxPercent > 0) {
                    vm.agreement.taxPercent = vm.agreement.customer.isTaxExempted ? 0 : vm.agreementTaxPercent;
                    vm.agreement.isTaxExempted = vm.agreement.customer.isTaxExempted;
                }
                else {
                    vm.agreement.taxPercent = vm.agreement.customer.isTaxExempted ? 0 : vm.taxPercent;
                    vm.agreement.isTaxExempted = vm.agreement.customer.isTaxExempted;
                }

                vm.agreement.salesPerson = vm.agreement.customer.salesPerson;
                vm.agreement.salesPersonId = vm.agreement.customer.salesPerson != null ? vm.agreement.customer.salesPerson.id : null;


                vm.agreement.saleOrder = null;
                vm.agreement.saleOrderId = null;
            };


            vm.searchSaleOrders = function ($select) {
                if (!$select.search) return;
                return agreementSaleOrderService.searchSaleOrdersForAgreement({ keyword: $select.search, contactId: vm.agreement.customer.id }).then(function (response) {
                    vm.saleOrders = response.data.items;
                });
            };


            vm.commonDriverSearch = function (contactCategoryId, contactTypeId) {
                vm.searchDrivers = function ($select) {
                    if (!$select.search) return;
                    //whereas contactCategory: 1 (person). get all persons which includes staff as well
                    return directoryService.search({ keyword: $select.search, contactCategory: contactCategoryId, contactType: contactTypeId }).then(function (response) {
                        vm.drivers = response.data.items;
                    });
                };
            }

            vm.individualCustomerRadioSelected = function () {
                //individual
                if (vm.agreement.customer.contactCategory == 1) {
                    if (vm.agreement.driverType == 1) {
                        vm.agreement.driver = null;
                        vm.commonDriverSearch(1, null);
                        if (vm.agreement.customer != null) {
                            vm.agreement.driver = vm.agreement.customer;
                            vm.driverSelected();
                        }
                    }
                    else if (vm.agreement.driverType == 2) {
                        vm.agreement.driver = null;
                        vm.commonDriverSearch(1, 1);
                    }
                    else if (vm.agreement.driverType == 4) {
                        vm.agreement.driver = null;
                        vm.searchDrivers = function ($select) {
                            if (!$select.search) return;
                            //whereas contactCategory: 1 (person), Exclude staff 
                            return directoryService.search({ keyword: $select.search, contactCategory: 1 }).then(function (response) {
                                var staffExcludedData = response.data.items.filter(e => e.contactType != 1);
                                vm.drivers = staffExcludedData;
                            });
                        };
                    }
                }
                // company
                else if (vm.agreement.customer.contactCategory == 2) {
                    if (vm.agreement.driverType == 3) {
                        vm.agreement.driver = null;
                        vm.searchDrivers = function ($select) {
                            if (!$select.search) return;
                            //whereas contactCategory: 2 (company), contactType: 1 (staff)
                            return directoryService.searchForCompany({ keyword: $select.search, companyId: vm.agreement.customer.id }).then(function (response) {
                                vm.drivers = response.data;
                            });
                        };
                    }
                    else if (vm.agreement.driverType == 2) {

                        vm.agreement.driver = null;
                        vm.commonDriverSearch(1, 1);
                    }

                    else if (vm.agreement.driverType == 4) {
                        vm.agreement.driver = null;
                        vm.searchDrivers = function ($select) {
                            if (!$select.search) return;
                            //whereas contactCategory: 2 (company), Exclude staff 
                            return directoryService.search({ keyword: $select.search, contactCategory: 1 }).then(function (response) {
                                var staffExcludedData = response.data.items.filter(e => e.contactType != 1);
                                vm.drivers = staffExcludedData;
                            });
                        };
                    }
                }
            };


            vm.driverSelected = function () {
                if (isTariffEnabled && !vm.isEditMod && !notLoadTariff)
                    tariffHelper.applyTariff(vm.agreement);
            };

            vm.additionalDriverSelected = function () {
                if (isTariffEnabled && !vm.isEditMod && !notLoadTariff)
                    tariffHelper.applyTariff(vm.agreement);
            };

            vm.searchVehiclePopup = function () {
                openSearchVehicleModal();
            };

            function openSearchVehicleModal() {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/searchVehicleModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.searchVehicleModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                fromDateTime: moment(vm.agreement.movements[0].outDetail.dateTime ? vm.agreement.movements[0].outDetail.dateTime : moment().startOf('day')).utc(),
                                toDateTime: moment(vm.agreement.endDate ? vm.agreement.endDate : moment().endOf('day')).utc(),
                                tariffGroup: vm.vehicleType,
                                tariffGroupId: vm.vehicleType.id,
                                modelId: vm.vehicleModelId,
                                model: vm.vehicleModel,
                                statusId: 'IDL',
                                subStatuses: [1, 7],
                                source: 'openagreement',
                                selectable: true,
                                doNotIncludeReplacementVehicle: doNotIncludeReplacementVehicle
                            };
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    if (result != null) {
                        vm.agreement.vehicle = result;
                        vm.vehicleSelected();
                    }
                });
            }

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

            // Validating CreateOrUpdateAgreement 
            function validate() {
                errorMessage = '';
                errorMessage = 'Agreement Can Not Be Saved Due To Following Issues: \n';
                if (isValid == false) {
                    isValid = true;
                }
                if (vm.agreement.movements[0].outDetail.dateTime > moment().endOf('day') && !enableFutureAgreementCheckOuts) {
                    isValid = false;
                    errorMessage = errorMessage + '\n Agreement Out Date Can not less than Current Date';
                }
                if (vm.agreement.endDate != null) {
                    if (vm.agreement.movements[0].outDetail.dateTime > vm.agreement.endDate) {
                        isValid = false;
                        errorMessage = errorMessage + '\n Return Date can not  less than Out Date ';
                    }
                }
            }

            vm.save = function () {
                vm.saving = true;
                validate();

                //popup for advance or deposit if needed
                if (vm.showAdvancePopupOnSave || vm.showDepositPopupOnSave) {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/crs/agreements/agreementAdvanceAndDeposit.cshtml',
                        controller: 'tenant.views.crs.agreements.agreementAdvanceAndDeposit as vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            options: function () {
                                return {
                                    agreement: vm.agreement,
                                    advance: vm.advance,
                                    deposit: vm.deposit,
                                };
                            }
                        }
                    });
                    modalInstance.result.then(function (result) {
                        var continueSaving = false;
                        if (result != null && result.save != null)
                            continueSaving = result.save;

                        vm.saving = continueSaving;
                        if (continueSaving) {
                            if (vm.deposit.voucherSubTypeId != 11) // all types except pre authorization
                            {
                                //put hold for days in the from of fromdate & todate
                                vm.deposit.fromDate = moment();
                                var fromDate = angular.copy(vm.deposit.fromDate);
                                vm.deposit.toDate = fromDate.add(vm.deposit.holdForDays, 'day');
                            }

                            save(); //save on closing of popup
                        }
                        else
                            vm.saving = false; //saving cacelled on popup
                    });

                } else //if advance or deposit popup is not shown then save directly
                    save();
            };

            function save() {
                vm.processing = true;
                if (isValid) {
                    //update ids for selected records
                    vm.agreement.vehicleId = vm.agreement.vehicle.id;
                    vm.agreement.customerId = vm.agreement.customer.id;
                    vm.agreement.driverId = vm.agreement.driver.id;
                    if (vm.deposit)
                        vm.agreement.deposit = vm.deposit.amount;
                    if (vm.advance)
                        vm.agreement.advance = vm.advance.amount;
                    if (vm.agreement.customer.contactCategory != 2)
                        vm.agreement.poNo = null;

                    if (vm.agreement.additionalDriver != null)
                        vm.agreement.additionalDriverId = vm.agreement.additionalDriver.id;

                    if (vm.agreement.salesPerson != null)
                        vm.agreement.salesPersonId = vm.agreement.salesPerson.id;
                    else
                        vm.agreement.salesPersonId = null;

                    if (!vm.agreement.customer.contactCategory == 2 && !vm.isSaleOrderEnabled) {
                        vm.agreement.saleOrderId = null;
                    }

                    leaseAgreementService.createOrUpdateLeaseAgreement({
                        agreement: vm.agreement,
                        advance: vm.advance,
                        deposit: vm.deposit,
                        discountAuthCodeId: vm.discountAuthCode == null ? null : vm.discountAuthCode.id,
                    }).success(function (result) {
                        if (vm.agreement) {
                            showActiveStepTab(...[false, false, false, false, true]);
                            vm.showPreTerminationClass = 'done';
                        }
                        //abp.notify.info(app.localize('SavedSuccessfully'));
                        //$uibModalInstance.close(result);
                    }).finally(function () {
                        vm.processing = false;
                    });
                }
                else {
                    abp.message.info(app.localize(errorMessage));
                    vm.processing = false;
                }
            }

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function loadChargesFromSettings() {
                //navigation charges settings and add charges rows in agreement charges list
                for (var i = 0; i < vm.chargesSettings.length; i++) {

                    var foundLines = $filter('filter')(vm.agreement.charges, {
                        chargesTypeId: vm.chargesSettings[i].chargesTypeId
                    }, true);

                    if (foundLines.length == 0) {
                        var chargesRow = {
                            agreementId: null,
                            order: vm.chargesSettings[i].order,
                            chargesTypeId: vm.chargesSettings[i].chargesTypeId,
                            rateTypeId: vm.chargesSettings[i].rateTypeId,
                            rate: null,
                            units: null,
                            charges: null,
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
                        };

                        if (chargesLines && chargesLines.length > 0) {
                            if (chargesLines.some(e => e.chargesTypeId == chargesRow.chargesTypeId)) {
                                var filteredRow = chargesLines.filter(e => e.chargesTypeId == chargesRow.chargesTypeId)[0];
                                chargesRow.rate = utilities.round(filteredRow.rate, 2);
                                chargesRow.limit = filteredRow.limit;
                                chargesRow.excessRate = filteredRow.excessRate;
                                chargesRow.included = filteredRow.included;
                                chargesRow.accepted = filteredRow.accepted;
                                if (chargesRow.rate > 0) {
                                    chargesRow.accepted = true;
                                }
                            }
                        }

                        vm.agreement.charges.push(chargesRow);
                    }
                }
            }

            vm.tariffOptionSelected = function (chargesRow, tariffLine) {
                chargesRow.included = tariffLine.included;
                chargesRow.rate = tariffLine.rate;
                chargesRow.excessRate = tariffLine.excessRate;
                chargesRow.limit = tariffLine.limit;
            };

            vm.calculate = function () {
                if (vm.agreement && vm.agreement.charges) {
                    var foundLines = $filter('filter')(vm.agreement.charges, {
                        chargesTypeId: 1
                    }, true);
                    if (foundLines.length == 1) {
                        if (foundLines[0].discountPercent >= 0) {
                            foundLines[0].discountedRate = utilities.round(foundLines[0].rate - (foundLines[0].rate * (foundLines[0].discountPercent / 100)), 2);
                        }
                    }
                }
                return chargesCalculator.calculate(vm.agreement);
            };

            vm.includedChanged = function (chargesRow) {
                if (chargesRow.included)
                    chargesRow.rate = 0;
            };
            vm.taxAcceptedChanged = function () {
                if (vm.taxAccepted)
                    vm.agreement.taxPercent = vm.taxPercent;
                else
                    vm.agreement.taxPercent = 0;
            };
            vm.discountApplied = function () {
                if (vm.taxAccepted)
                    vm.agreement.taxPercent = vm.taxPercent;
                else
                    vm.agreement.taxPercent = 0;
            };
            vm.changeStatusReceiptCreation = function () {
                if (vm.advance.amount > 0)
                    vm.showAdvancePopupOnSave = true;
                else
                    vm.showAdvancePopupOnSave = false;
            };
            vm.changeStatusDepositCreation = function () {
                if (vm.deposit.amount > 0)
                    vm.showDepositPopupOnSave = true;
                else
                    vm.showDepositPopupOnSave = false;
            };

            vm.getClauses = function (row, id) {
                vm.loading = true;
                leaseClauseService.getClausesForEdit({
                    id: id
                }).success(function (data) {
                    row.leaseClauses = data.clauses;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function getLeaseClauseTypes() {
                vm.loading = true;
                leaseClauseService.getLeaseClauseTypes({}).success(function (data) {
                    vm.leaseClauseTypes = data.items;
                    vm.addClauses();
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function initFromMasterAgreement() {
                vm.loading = true;
                leaseAgreementService.getLeaseAgreementWithAdvanceAndDepositForEdit({
                    id: null
                }).success(function (result) {
                    vm.agreement = result.agreement;
                    vm.agreement.masterAgreementId = options.masterAgreementId;
                    vm.agreement.customerId = options.customerId;
                    vm.agreement.customer = options.customer;
                    vm.vehicleType = options.vehicleType;
                    vm.vehicleTypeId = options.vehicleType.id;
                    vm.vehicleModel = options.vehicleModel;
                    vm.vehicleModelId = options.vehicleModel.id;
                    vm.agreement.movements[0].outDetail.dateTime = options.date;
                    vm.agreement.noOfMonths = options.noOfMonths;
                    vm.noOfMonthsChange();
                    vm.agreement.driverType = 1;
                    notLoadTariff = true;
                    loadChargesFromSettings();
                    vm.agreementTypeSelected();
                    vm.taxAccepted = vm.agreement.taxPercent > 0 ? true : false;
                    vm.loading = false;
                });
            };


            var showActiveStepTab = function (...params) {
                [vm.leaseDetail, vm.showClauses, vm.showPreTermination, vm.showProvisions, vm.showSaveProcess] = params;
            }

            vm.firstNextButton = function () {
                vm.showProvisionsClass = 'active';
                showActiveStepTab(...[false, false, false, true, false]);
            };

            vm.secondNextButton = function () {
                vm.showClausesClass = 'active'
                showActiveStepTab(...[false, true, false, false, false]);
            };

            vm.thiredNextButton = function () {
                vm.showPreTerminationClass = 'active';
                showActiveStepTab(...[false, false, true, false, false]);
            };

            vm.secondScreenPreviousButton = function () {
                vm.leaseDetailClass = 'active';
                vm.showProvisionsClass = 'bg-grey';
                showActiveStepTab(...[true, false, false, false, false]);
            };

            vm.thiredScreenPreviousButton = function () {
                vm.showProvisionsClass = 'active';
                vm.showClausesClass = 'bg-grey';
                showActiveStepTab(...[false, false, false, true, false]);
            };

            vm.fourthScreenPreviousButton = function () {
                vm.showClausesClass = 'active';
                vm.showPreTerminationClass = 'bg-grey';
                showActiveStepTab(...[false, true, false, false, false]);
            };

            function getLeaseAgreementForEdit() {
                vm.processing = true;
                leaseAgreementService.getLeaseAgreementWithAdvanceAndDepositForEdit({
                    id: agreementId
                }).success(function (result) {
                    getLeaseClauseTypes();
                    vm.agreement = result.agreement;
                    //if (vm.agreement) {
                    //    vm.showPreTerminationClass = 'done';
                    //    showActiveStepTab(...[false, false, false, false, true]);
                    //}
                    if (vm.agreement.vehicle != null) {
                        vm.agreement.movements[vm.agreement.movements.length - 1].outDetail.makeAndModel = vm.agreement.vehicle.make + ' ' + vm.agreement.vehicle.model.name;
                    }
                    vm.advance = result.advance;
                    vm.deposit = result.deposit;
                    vm.agreement.provisions = !vm.agreement.provisions ? [] : vm.agreement.provisions;
                    vm.agreement.preTerminationRules = !vm.agreement.preTerminationRules ? [] : vm.agreement.preTerminationRules;
                    vm.agreement.clauses = !vm.agreement.clauses ? [] : vm.agreement.clauses;
                    vm.agreement.clauses.forEach(function (row) {
                        vm.getClauses(row, row.clause.clauseTypeId);
                    });
                    if (vm.agreement.id > 0) {
                        vm.isEditMod = true;
                        vm.agreementTaxPercent = vm.agreement.taxPercent;
                        vm.agreement.endDate = utilities.jsonUtcDateToLocalMoment(vm.agreement.endDate);

                        vm.agreement.noOfMonths = vm.agreement.endDate.diff(moment(vm.agreement.movements[0].outDetail.dateTime), 'months');
                        //calculate hold for days using fromdate and todate if cash or check deposit
                        if (vm.deposit.voucherSubTypeId != 11) // all types except pre authorization
                        {
                            var duration = moment.duration(vm.deposit.toDate.diff(vm.deposit.fromDate));
                            vm.deposit.holdForDays = duration.asDays();
                        }
                        if (vm.agreement.customer.contactCategory == 1) {
                            vm.isIndividualCustomerRadio = true;
                        }
                        else if (vm.agreement.customer.contactCategory == 2) {
                            vm.isIndividualCustomerRadio = false;
                        }
                    } else {
                        vm.agreement.agreementNo = null;
                        vm.isEditMod = false;
                        vm.agreement.driverType = 1;
                    }
                    loadChargesFromSettings();
                    vm.taxAccepted = vm.agreement.taxPercent > 0 ? true : false;
                }).finally(function () {
                    vm.processing = false;
                });
            }

            function init() {
                vm.leaseDetailClass = 'active';
                allFuelLevels();
                vm.leaseDetail = true;
                getLeaseAgreementForEdit();
            };

            function initAgreement() {
                if (options.masterAgreementId)
                    initFromMasterAgreement();
                else
                    init();
            }

            initAgreement();
        }
    ]);
