// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:226943-228477
appModule.controller('tenant.views.crs.lease.agreements.createOrEditModal', [
        '$scope', '$filter', 'utilities', '$uibModal', '$uibModalInstance', 'uiGridConstants', 'chargesCalculator', 'abp.services.app.vehicleAlerts', 'tariffHelper', 'abp.services.app.agreement', 'options',
        'abp.services.app.vehicle', 'abp.services.app.directory', 'abp.services.app.tariff', '$rootScope', 'abp.services.app.leaseAgreement',
        'abp.services.app.leaseClause', 'abp.services.app.commonLookup', 'abp.services.app.agreementSaleOrder', 'abp.services.app.accident', 'abp.services.app.commonLookup', 'appSession', 'abp.services.app.taxCode', '$timeout',
        function ($scope, $filter, utilities, $uibModal, $uibModalInstance, uiGridConstants, chargesCalculator, vehicleAlertsService, tariffHelper, agreementService, options, vehicleService,
            directoryService, tariffService, $rootScope, leaseAgreementService, leaseClauseService, lookupService, agreementSaleOrderService, accidentService, commonLookupService, appSession, taxCodeService, $timeout) {

            var vm = this;
            var agreementId = options.agreementId;
            var chargesSettings = options.chargesSettings;
            var chargesLines = options.chargesLines;
            vm.branchTaxPercentage = null;
            vm.isTaxCodeEnabled = abp.features.isEnabled("CRS.TaxCodes");
            vm.canChangeRates = abp.auth.hasPermission('Pages.Tenant.Lease.Agreements.Edit.CanChangeRates');
            vm.vehicleRegistrationExpiryPopupOnAgreementSaving = utilities.parseBoolean(abp.setting.get("App.General.VehicleRegistrationExpiryPopupOnAgreementSaving")); //this is also for service due popup
            vm.isCRSAllowLeaseCalculationOnDailyBasisEnabled = abp.features.isEnabled("CRS.CustomFeatures.AllowLeaseCalculationOnDailyBasis");
            vm.canEditMonth = abp.auth.hasPermission('Pages.Tenant.Lease.Agreements.MonthChange');
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.isTaxOptional = utilities.parseBoolean(abp.setting.get("App.General.IsTaxOptional"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.isAgreementStartDateAsAdvanceAndDepositDate = utilities.parseBoolean(abp.setting.get("App.General.AgreementStartDateAsAdvanceAndDepositDate"));
            vm.searchDropDownSalesPerson = utilities.parseBoolean(abp.setting.get("App.General.SalesPersonSelectionInsteadOfSearching"));
            vm.isDonotChangeAutoLeaseAgreementEndDateWhileChangingMonth = utilities.parseBoolean(abp.setting.get("App.Speed.Common.DonotChangeAutoLeaseAgreementEndDateWhileChangingMonth"));
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
            vm.canChangeKMOut = abp.auth.hasPermission("Pages.Tenant.Lease.Agreements.CanChangeKMOut");
            vm.canChangeFuelOut = abp.auth.hasPermission("Pages.Tenant.Lease.Agreements.CanChangeFuelOut");
            vm.isSeparateInvoiceStartDateForAgreement = abp.features.isEnabled("CRS.CustomFeatures.SeparateInvoiceStartDateForAgreement");
            vm.isMultiCurrencyEnabled = abp.features.isEnabled("Core.MultiCurrency");
            vm.isCreateLeaseAgreementByWizardEnabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.IsCreateLeaseAgreementByWizardEnabled"));
            vm.isSagX3Enabled = abp.features.isEnabled("Core.SagX3Integration");
            vm.taxAccepted = false;
            vm.showAdvancePopupOnSave = false;
            vm.showDepositPopupOnSave = false;
            vm.loading = false;
            vm.canOpenAgreementWithoutSaleOrder = abp.auth.hasPermission('Pages.Tenant.Lease.Agreements.CanOpenAgreementWithoutSaleOrderLease');
            vm.canChangeLeaseClauses = abp.auth.hasPermission('Pages.Tenant.Lease.Agreements.CanChangeLeaseClauses');
            vm.discountAuthCode = null;
            var enableFutureAgreementCheckOuts = utilities.parseBoolean(abp.setting.get("App.Speed.Common.EnableFutureAgreementCheckOuts"));
            var doNotIncludeReplacementVehicle = utilities.parseBoolean(abp.setting.get("App.Speed.Common.DoNotIncludeReplacementVehicles"));
            vm.updateFuelRateGloballyEnabled = abp.features.isEnabled("CRS.CustomFeatures.UpdateFuelRateGlobally");
            vm.isSetFuelRateAutoOnAgreementCreationSettingEnabled = utilities.parseBoolean(abp.setting.get("App.General.SetFuelRateAutoOnAgreementCreation"));
            vm.canChangeFuelRates = abp.auth.hasPermission('Pages.Tenant.Agreements.CanChangeFuelRate');
            vm.fuelRateGlobally = parseFloat(abp.setting.get("App.General.UpdateFuelRate"));
            vm.isLeaseToOwnEnabled = abp.features.isEnabled("CRS.Lease.LeaseToOwn");
            vm.disableKMInOut = utilities.parseBoolean(abp.setting.get("App.General.DisableKMInOutAndDriversInAgreement"));
            var notLoadTariff = false;
            vm.chargesSettings = chargesSettings;
            vm.vehicles = [];
            vm.customers = [];
            vm.drivers = [];
            var isValid = true;
            var errorMessage = {};
            var agreementCategory = 2; //Lease
            vm.isIndividualCustomerRadio = true;
            vm.activeTabIndex = 0;
            [vm.leaseDetail, vm.showProvisions, vm.showClauses, vm.showPreTermination] = [true, false, false, false]
            //var isTariffEnabled = abp.features.isEnabled("CRS.Tariff");
            vm.clausesNextEnabled = true;
            vm.provisionNextEnabled = true;
            vm.allowZeroValueRentalAgreement = utilities.parseBoolean(abp.setting.get("App.Speed.Common.AllowZeroValueRentalAgreement"));
            vm.isVehicleSelectionByTypeInAgreements = utilities.parseBoolean(abp.setting.get("App.Speed.Common.EnableVehicleSelectionByTypeInAgreements"));
            vm.minRentalCharges = 0.1;

            vm.isInitialized = false;
            $timeout(function () {
                vm.isInitialized = true;
            }, 100);

            if (vm.allowZeroValueRentalAgreement)
                vm.minRentalCharges = 0.0;

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
            //public enum AgreementPreTerminationTypes
            //{
            //    Fixed = 1,
            //    PercentageOfRemainingPeriod = 2,
            //    NoOfMonths = 3,
            //    }
            vm.agreementTypes = [

                { type: "Lease", id: 4 },
                { type: "LeaseToOwn", id: 5 },
            ];

            //vm.agreementTypes = [
            //    { type: "Daily", id: 1 },
            //    { type: "Weekly", id: 2 },
            //    { type: "Monthly", id: 3 }
            //];

            var rateTypes = {
                perDay: { id: 1, name: '/Day' },
                perWeek: { id: 2, name: '/Week' },
                perMonth: { id: 3, name: '/Month' },
            };
            vm.openExpiredDocAndOutStandingBalanceModal = function (id) {
                openExpiredDocAndOutStandingBalanceModal(id);
            };
            function openExpiredDocAndOutStandingBalanceModal(contactId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/expiredDocOutStandingBalanceModal.cshtml',
                    controller: 'tenant.views.crs.agreements.expiredDocOutStandingBalanceModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        contactId: function () {
                            return contactId;
                        }
                    }

                });
                /* modalInstance.result.then(function () {
                 });*/
            }
            vm.addProvisionRow = function () {
                vm.agreement.provisions.push(
                    {
                        item: null,
                        type: null,
                        value: null
                    });
                vm.checkProvisionsRowEmpty();
            };
            vm.addPreTerminationRuleRow = function () {
                if (vm.agreement.preTerminationRules == undefined) {
                    vm.agreement.preTerminationRules = [];
                }
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
            vm.searchUsersWithDesignation = function () {

                return directoryService.searchSalesPersonActiveOne().then(function (response) {

                    vm.userList = response.data.items;
                });
            };

            vm.salesPersonSelected = function () {
                vm.agreement.salesPersonId = vm.agreement.salesPerson.id;
            };
            vm.calculateCount = function () {
                vm.count = vm.agreement.charges.filter(function (charge) {
                    return charge.invoiceToDriver === true;
                }).length;
                return vm.count;
            };
            function getCustomerPicture(id) {
                vm.picture = [];
                directoryService.searchCustomerPhoto({ id: id }).success(function (result) {
                    if (result) {
                        var img = result;
                        var imageDetail = imageGalleryObject();
                        imageDetail.thumb = img.url;
                        imageDetail.img = img.url;
                        imageDetail.description = img.description;
                        imageDetail.url = img.url;
                        imageDetail.name = img.name;
                        imageDetail.guid = img.guid;
                        imageDetail.ImageURL = img.url;
                        imageDetail.ImagePath = img.name;
                        vm.picture.push(imageDetail);
                    }
                }).finally(function () {
                    vm.loading = false;
                });
            }

            function imageGalleryObject() {
                var detail = new Object();
                detail.thumb = "";
                detail.img = "";
                detail.description = "";
                return detail;
            }
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

                //tariffLine.included == chargesRow.included &&
                //tariffLine.rate == chargesRow.rate &&
                //tariffLine.excessRate == chargesRow.excessRate
                //&& tariffLine.limit == chargesRow.limit
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
                vm.checkProvisionsRowEmpty();
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
                vm.checkClausesRowEmpty();
            };

            vm.addClauses = function () {
                if (vm.agreement.clauses.length == 0) {
                    vm.leaseClauseTypes.forEach(function (row) {
                        // vm.getClauses()
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
                vm.checkClausesRowEmpty();
            };

            vm.noOfMonthsChange = function () {
                if (!vm.isInitialized || !$scope.vm.noOfMonthsManualEdit) return;
                if (vm.agreement.movements[0].outDetail.dateTime)
                    if (!vm.isDonotChangeAutoLeaseAgreementEndDateWhileChangingMonth || !vm.agreement.endDate) {
                        vm.agreement.endDate = moment(vm.agreement.movements[0].outDetail.dateTime).add(vm.agreement.noOfMonths, 'M').utc();
                        vm.endDateChanged();
                    }
            }

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

            vm.localizeChargesType = function (chargesRow) {
                if (chargesRow.chargesTypeId == 2 && chargesRow.excessRate == 0 && chargesRow.accepted)
                    return app.localize("SCDW");
                return app.localize(chargesRow.chargesType.name);
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
                if (!vm.isInitialized || !$scope.vm.startDateManualEdit) return;
                if (vm.agreement.noOfMonths)
                    vm.agreement.endDate = moment(vm.agreement.movements[0].outDetail.dateTime).add(vm.agreement.noOfMonths, 'M').utc();
                if (!vm.isEditMod) {
                    if (isTariffEnabled && !notLoadTariff)
                        tariffHelper.applyTariff(vm.agreement);
                    if (vm.updateFuelRateGloballyEnabled && vm.isSetFuelRateAutoOnAgreementCreationSettingEnabled && vm.agreement.id <= 0) {
                        vm.agreement.charges.forEach(ac => {
                            if (ac.chargesTypeId == 4) {
                                if (ac.rate == 0)
                                    ac.rate = vm.fuelRateGlobally;
                            }
                        });
                    }
                }
                else
                    startDateLoaded = true;
            };
            vm.searchAdditionalDrivers = function ($select) {
                if (!$select.search) return;
                return directoryService.searchPersonStaffCustomer({ keyword: $select.search, activeOnly: true }).then(function (response) {
                    vm.additionaldrivers = response.data.items;
                });
            };
            vm.searchStaff = function ($select) {
                if (!$select.search) return;
                return directoryService.searchSalesPersonWithDesignation({ keyword: $select.search, contactType: 1, activeOnly: true }).then(function (response) {
                    vm.staffList = response.data.items;
                });
            };

            vm.agreementTypeSelected = function () {
                //convert time based rates to corresponding rate type based on selected agreement type
                for (var i = 0; i < vm.agreement.charges.length; i++) {
                    if (vm.agreement.charges[i].rateTypeId == 1 || vm.agreement.charges[i].rateTypeId == 2 || vm.agreement.charges[i].rateTypeId == 3) {
                        vm.agreement.charges[i].rateTypeId = rateTypes.perMonth.id;
                        vm.agreement.charges[i].rateType = rateTypes.perMonth;
                        //if (vm.agreement.agreementType == 2) {
                        //    vm.agreement.charges[i].rateTypeId = rateTypes.perWeek.id;
                        //    vm.agreement.charges[i].rateType = rateTypes.perWeek;
                        //}
                        //else if (vm.agreement.agreementType == 3) {
                        //    vm.agreement.charges[i].rateTypeId = rateTypes.perMonth.id;
                        //    vm.agreement.charges[i].rateType = rateTypes.perMonth;
                        //} else {
                        //    vm.agreement.charges[i].rateTypeId = rateTypes.perDay.id;
                        //    vm.agreement.charges[i].rateType = rateTypes.perDay;
                        //}
                    }
                }
                if (isTariffEnabled && !notLoadTariff)
                    tariffHelper.applyTariff(vm.agreement);
                if (vm.updateFuelRateGloballyEnabled && vm.isSetFuelRateAutoOnAgreementCreationSettingEnabled && vm.agreement.id <= 0) {
                    vm.agreement.charges.forEach(ac => {
                        if (ac.chargesTypeId == 4) {
                            if (ac.rate == 0)
                                ac.rate = vm.fuelRateGlobally;
                        }
                    });
                }
            };

            var endDateLoaded = false;
            vm.endDateChanged = function () {
                if (!vm.isInitialized || !$scope.vm.endDateManualEdit) return;
                if (!vm.isEditMod) {
                    if (isTariffEnabled && !notLoadTariff)
                        tariffHelper.applyTariff(vm.agreement);
                    if (vm.updateFuelRateGloballyEnabled && vm.isSetFuelRateAutoOnAgreementCreationSettingEnabled && vm.agreement.id <= 0) {
                        vm.agreement.charges.forEach(ac => {
                            if (ac.chargesTypeId == 4) {
                                if (ac.rate == 0)
                                    ac.rate = vm.fuelRateGlobally;
                            }
                        });
                    }
                }
                else 
                    endDateLoaded = true;
                
            };

            vm.searchVehicles = function ($select) {
                if ($select.search == "") {
                    vm.vehicles = null; return null;
                }
                var subStatuses = [1, 7];
                if (vm.isVehicleSelectionByTypeInAgreements) {
                    return vehicleService.searchVehicles({
                        plateNo: $select.search, statusId: 'IDL', vehicleType: 'Lease', subStatuses: subStatuses, source: 'openagreement',
                        doNotIncludeReplacementVehicle: doNotIncludeReplacementVehicle, tariffGroupId: vm.vehicleTypeId, modelId: vm.vehicleModelId
                    }).then(function (response) {
                        vm.vehicles = response.data.items;
                    });
                } else {
                    return vehicleService.searchVehicles({
                        plateNo: $select.search, statusId: 'IDL', subStatuses: subStatuses, source: 'openagreement',
                        doNotIncludeReplacementVehicle: doNotIncludeReplacementVehicle, tariffGroupId: vm.vehicleTypeId, modelId: vm.vehicleModelId
                    }).then(function (response) {
                        vm.vehicles = response.data.items;
                    });
                }               
            };

            vm.searchCustomers = function ($select) {
                if (!$select.search) return;
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                var contactCategory = null;
                if (vm.isSagX3Enabled == true) contactCategory = 1;
                return directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true, includeSalesPerson: true, contactCategory: contactCategory }).then(function (response) {
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
                return directoryService.search({ keyword: $select.search, contactCategory: 1, activeOnly: true }).then(function (response) {
                    vm.drivers = response.data.items;
                });
            };

            vm.searchDriverPopoup = function () {
                //var modalInstance = openSearchContactModel(1, null);

                var type = null;
                if (vm.agreement.driverType == 2) type = 1;
                if (vm.agreement.driverType == 3) type = 6;
                var modalInstance = openSearchContactModel(1, type, (vm.agreement.customer.contactCategory == 2 && vm.agreement.driverType == 3));

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
                        if (vm.updateFuelRateGloballyEnabled && vm.isSetFuelRateAutoOnAgreementCreationSettingEnabled && vm.agreement.id <= 0) {
                            vm.agreement.charges.forEach(ac => {
                                if (ac.chargesTypeId == 4) {
                                    if (ac.rate == 0)
                                        ac.rate = vm.fuelRateGlobally;
                                }
                            });
                        }
                    });
                }
            };

            vm.customerSelected = function () {
                getCustomerPicture(vm.agreement.customer.id);

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
                    if (vm.isTaxCodeEnabled && !vm.agreement.customer.isTaxExempted) {
                        if (vm.agreement.customer.taxCodeId > 0) {
                            vm.agreement.taxPercent = vm.agreement.customer.taxCode.taxPercent;
                        }
                        else {
                            if (vm.branchTaxPercentage)
                                vm.agreement.taxPercent = vm.branchTaxPercentage;
                        }
                    }
                }
                else {
                    vm.agreement.taxPercent = vm.agreement.customer.isTaxExempted ? 0 : vm.taxPercent;
                    vm.agreement.isTaxExempted = vm.agreement.customer.isTaxExempted;
                    if (vm.isTaxCodeEnabled && !vm.agreement.customer.isTaxExempted) {
                        if (vm.agreement.customer.taxCodeId > 0) {
                            vm.agreement.taxPercent = vm.agreement.customer.taxCode.taxPercent;
                        }
                        else if (vm.agreement.location.taxCodeId > 0) {
                            vm.agreement.taxPercent = vm.agreement.location.taxCode.taxPercent;
                        }
                    }
                }

                vm.agreement.salesPerson = vm.agreement.customer.salesPerson;
                vm.agreement.salesPersonId = vm.agreement.customer.salesPerson != null ? vm.agreement.customer.salesPerson.id : null;


                vm.agreement.saleOrder = null;
                vm.agreement.saleOrderId = null;
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
            vm.branchTaxCodeForMasterAgreement = function () {
                vm.loading = true; 

                var userLocationId = appSession.user.locationId;

                var fetchBranchTaxPercentagePromise = new Promise(function (resolve, reject) {
                    if (userLocationId) {
                        commonLookupService.getLocationById({ id: userLocationId })
                            .success(function (data) {
                                var userLocation = data;
                                if (userLocation.taxCode) {
                                    vm.branchTaxPercentage = userLocation.taxCode.taxPercent;
                                }
                                resolve();
                            })
                            .error(function (error) {
                                reject(error); 
                            });
                    } else {
                        resolve(); 
                    }
                });

                fetchBranchTaxPercentagePromise
                    .then(function () {
                        if (!vm.agreement.customer.isTaxExempted) {
                            if (vm.agreement.customer.taxCodeId > 0) {
                                return taxCodeService.getTaxCodeById({ id: vm.agreement.customer.taxCodeId }).$promise
                                    .then(function (data) {
                                        var taxCode = data;
                                        if (taxCode) {
                                            vm.agreement.taxPercent = taxCode.taxPercent;
                                        }
                                    });
                            } else {
                                if (vm.branchTaxPercentage) {
                                    vm.agreement.taxPercent = vm.branchTaxPercentage;
                                    $scope.$apply();
                                }
                                return Promise.resolve(); 
                            }
                        }
                        return Promise.resolve(); 
                    })
                    .catch(function (error) {
                        console.error("Error in branchTaxCodeForMasterAgreement:", error);
                    })
                    .finally(function () {
                        vm.loading = false; 
                    });
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
                    return directoryService.search({ keyword: $select.search, contactCategory: contactCategoryId, contactType: contactTypeId, activeOnly: true }).then(function (response) {
                        vm.drivers = response.data.items;
                    });
                };
            }



            vm.individualCustomerRadioSelected = function () {
                //individual
                if (vm.agreement.customer.contactCategory == 1) {
                    if (vm.agreement.driverType == 1) {
                        vm.agreement.driver = null;
                        //vm.searchDrivers = function ($select) {
                        //    if (!$select.search) return;
                        //    //whereas contactCategory: 1 (person). get all persons which includes staff as well
                        //    return directoryService.search({ keyword: $select.search, contactCategory: 1 }).then(function (response) {
                        //        vm.drivers = response.data.items;
                        //    });
                        //};
                        vm.commonDriverSearch(1, null);
                        if (vm.agreement.customer != null) {
                            vm.agreement.driver = vm.agreement.customer;
                            vm.driverSelected();
                        }
                    }
                    else if (vm.agreement.driverType == 2) {
                        vm.agreement.driver = null;
                        //vm.searchDrivers = function ($select) {
                        //    if (!$select.search) return;
                        //    //whereas contactCategory: 1 (person), contactType: 1 (staff)
                        //    return directoryService.search({ keyword: $select.search, contactCategory: 1, contactType:1 }).then(function (response) {
                        //        vm.drivers = response.data.items;
                        //    });
                        //};

                        vm.commonDriverSearch(1, 1);
                    }
                    else if (vm.agreement.driverType == 4) {
                        vm.agreement.driver = null;
                        vm.searchDrivers = function ($select) {
                            if (!$select.search) return;
                            //whereas contactCategory: 1 (person), Exclude staff 
                            return directoryService.search({ keyword: $select.search, contactCategory: 1, activeOnly: true }).then(function (response) {
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
                            return directoryService.searchForCompany({ keyword: $select.search, companyId: vm.agreement.customer.id, activeOnly: true }).then(function (response) {
                                vm.drivers = response.data;
                            });
                        };
                    }
                    else if (vm.agreement.driverType == 2) {

                        vm.agreement.driver = null;
                        //vm.searchDrivers = function ($select) {
                        //    if (!$select.search) return;
                        //    //whereas contactCategory: 2 (company), contactType: 1 (staff)
                        //    return directoryService.search({ keyword: $select.search, contactCategory: 1, contactType: 1 }).then(function (response) {
                        //        vm.drivers = response.data.items;
                        //    });
                        //};
                        vm.commonDriverSearch(1, 1);
                    }

                    else if (vm.agreement.driverType == 4) {
                        vm.agreement.driver = null;
                        vm.searchDrivers = function ($select) {
                            if (!$select.search) return;
                            //whereas contactCategory: 2 (company), Exclude staff 
                            return directoryService.search({ keyword: $select.search, contactCategory: 1, activeOnly: true }).then(function (response) {
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
                if (vm.updateFuelRateGloballyEnabled && vm.isSetFuelRateAutoOnAgreementCreationSettingEnabled && vm.agreement.id <= 0) {
                    vm.agreement.charges.forEach(ac => {
                        if (ac.chargesTypeId == 4) {
                            if (ac.rate == 0)
                                ac.rate = vm.fuelRateGlobally;
                        }
                    });
                }
                vm.loading = true;
                vm.multipleAccidentsDriver = false;
                accidentService.checkRepeatedAccidentsOnDriver({ id: vm.agreement.driver.id })
                    .success(function (result) {
                        if (result)
                            vm.multipleAccidentsDriver = true;
                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            };

            vm.additionalDriverSelected = function () {
                if (isTariffEnabled && !vm.isEditMod && !notLoadTariff)
                    tariffHelper.applyTariff(vm.agreement);
                if (vm.updateFuelRateGloballyEnabled && vm.isSetFuelRateAutoOnAgreementCreationSettingEnabled && vm.agreement.id <= 0) {
                    vm.agreement.charges.forEach(ac => {
                        if (ac.chargesTypeId == 4) {
                            if (ac.rate == 0)
                                ac.rate = vm.fuelRateGlobally;
                        }
                    });
                }
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
                                tariffGroupId: vm.vehicleType != null ? vm.vehicleType.id : null,
                                modelId: vm.vehicleModelId,
                                model: vm.vehicleModel,
                                statusId: 'IDL',
                                vehicleType: vm.isVehicleSelectionByTypeInAgreements ? 'Lease' : null,
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

            //function openSearchContactModel(category, type) {
            //    return $uibModal.open({
            //        templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
            //        controller: 'tenant.views.crs.contacts.searchContactModal as vm',
            //        backdrop: 'static',
            //        resolve: {
            //            category: function () {
            //                return category;
            //            },
            //            type: function () {
            //                return type;
            //            }
            //        }
            //    });
            //}
            function openSearchSagX3ContactModel() {
                return $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchSagX3ContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchSagX3ContactModal as vm',
                    backdrop: 'static'
                });
            }
            vm.addSagX3Contact = function () {
                var modalInstance = openSearchSagX3ContactModel();

                modalInstance.result.then(function (result) {
                    if (result != null) {
                        vm.agreement.customer = result;
                        vm.customerSelected();
                    }
                });
            };
            function openSearchContactModel(category, type, isOnlyCorporate = false) {
                var companyIdToForward = vm.agreement.customer ? vm.agreement.customer.id : null;
                if (vm.isSagX3Enabled) {
                    category = 1;
                }
                return $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactOptionModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactOptionModal as vm',
                    backdrop: 'static',
                    resolve: {
                        options: function () {
                            return {
                                category: category,
                                type: type,
                                isOnlyCorporate: isOnlyCorporate,
                                companyId: companyIdToForward,
                                activeOnly: true
                            }
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

            //function openAgreementAdvanceAndDepositModel() {
            //  
            //    vm.saving = true;
            //    var modalInstance = $uibModal.open({
            //        templateUrl: '~/App/tenant/views/crs/agreements/agreementAdvanceAndDeposit.cshtml',
            //        controller: 'tenant.views.crs.agreements.agreementAdvanceAndDeposit as vm',
            //        backdrop: 'static',
            //        //size: 'sm',
            //        resolve: {
            //            options: function () {
            //                return {
            //                    agreement: agreement,
            //                    advance: receipt,
            //                    securityDeposit: securityDeposit,
            //                };
            //            }
            //        }
            //    });
            //    modalInstance.result.then(function (result) {
            //      
            //        //If result.save that came from $uibModal in agreementAdvanceAndDeposit.js is true, loading will be shown on save button.
            //        vm.saving = result.save;
            //        if (result.save) {
            //            vm.agreement.advance = result.advance;
            //            vm.agreement.securityDeposit = result.securityDeposit;
            //            saveAgreementWithReceipt();
            //        }

            //    });
            //}

            vm.save = function () {
                vm.saving = true;
                validate();

                if (vm.isAgreementStartDateAsAdvanceAndDepositDate) {
                    vm.advance.date = vm.agreement.movements[0].outDetail.dateTime;
                    vm.deposit.date = vm.agreement.movements[0].outDetail.dateTime;
                }
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
                vm.saving = true;

                if (vm.preTermValid() && vm.isCreateLeaseAgreementByWizardEnabled) {
                    abp.message.info(app.localize(errorMessage + 'Pre-Termination row should have valid data.'));
                    vm.saving = false;
                } else {
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

                        if (vm.vehicleRegistrationExpiryPopupOnAgreementSaving) {
                            if (vm.agreement.vehicle.nextRegistrationDate) {
                                vm.currentDate = new Date();
                                vm.formattedNextRegistrationDate = new Date(vm.agreement.vehicle.nextRegistrationDate)
                                var timeDifference = vm.formattedNextRegistrationDate.getTime() - vm.currentDate.getTime();
                                var daysRemaining = Math.ceil(timeDifference / (1000 * 3600 * 24));

                                if (daysRemaining < 0) {
                                    abp.message.confirm(
                                        'Registration is Expired.',
                                        'Do you want to continue?',
                                        function (isConfirmed) {
                                            if (isConfirmed) {
                                                getDueService();
                                            }
                                        }
                                    );
                                    vm.saving = false;
                                }
                                else {
                                    getDueService();

                                }
                            }
                            else {
                                getDueService();

                            }
                        }
                        else {
                            leaseAgreementService.createOrUpdateLeaseAgreement({
                                agreement: vm.agreement,
                                advance: vm.advance,
                                deposit: vm.deposit,
                                discountAuthCodeId: vm.discountAuthCode == null ? null : vm.discountAuthCode.id,
                            }).success(function (result) {
                                abp.notify.info(app.localize('SavedSuccessfully'));

                                $uibModalInstance.close(result);
                            }).finally(function () {
                                vm.saving = false;
                            });

                        }
                    }
                    else {
                        abp.message.info(app.localize(errorMessage));
                        vm.saving = false;
                    }
                }
            }

            async function getDueService() {
                const vehicleService = await vehicleAlertsService.getServiceAlertForVehicle(vm.agreement.vehicle);
                vm.vehicleAlertsRegistration = vehicleService.data.items;
                if (vm.vehicleAlertsRegistration.length > 0) {
                    var message = vm.vehicleAlertsRegistration[0].dueService.name + ', Due Kms:' + ' ' + vm.vehicleAlertsRegistration[0].dueKms + ', Reason:' + ' ' + vm.vehicleAlertsRegistration[0].dueReason;
                    abp.message.confirm(
                        message,
                        'Do you want to continue?',
                        function (isConfirmed) {
                            if (isConfirmed) {
                                vm.saving = true;
                                createOrUpdateLeaseAgreement();
                            }
                        }
                    );
                }
                else {
                    createOrUpdateLeaseAgreement();
                }

            }

            function createOrUpdateLeaseAgreement() {
                leaseAgreementService.createOrUpdateLeaseAgreement({
                    agreement: vm.agreement,
                    advance: vm.advance,
                    deposit: vm.deposit,
                    discountAuthCodeId: vm.discountAuthCode == null ? null : vm.discountAuthCode.id,
                }).success(function (result) {
                    abp.notify.info(app.localize('SavedSuccessfully'));

                    $uibModalInstance.close(result);
                }).finally(function () {
                    vm.saving = false;
                });
            }

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function loadChargesFromSettings() {

                ////if new agreement then load charges detail from settings
                //if (vm.isEditMod == false) {
                //    vm.agreement.charges.length = 0;    //clear charges list

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
                            isSeparatInvoice: vm.chargesSettings[i].isSeparatInvoice,
                            taxable: vm.chargesSettings[i].taxable,
                            accepted: ((vm.chargesSettings[i].chargesType.chargesCategory == 2 || vm.chargesSettings[i].chargesType.chargesCategory == 3 || vm.chargesSettings[i].chargesType.chargesCategory == 4) ? false : true),
                            included: false,
                            excessRate: null,
                            limit: null,
                            chargesType: vm.chargesSettings[i].chargesType,
                            rateType: vm.chargesSettings[i].rateType,
                            tariff: []
                            //    { included: true, rate: 0, excessRate: 5, limit: 100 },
                            //    { included: false, rate: 30, excessRate: 4, limit: 250 },
                            //    { included: false, rate: 50, excessRate: 3, limit: 500 }

                            //]
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
                    //    }
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


            var showActiveStepTab = function (...params) {
                [tab1, tab2, tab3, tab4] = params;
            }

            vm.firstNextButton = function () {
                showActiveStepTab(...[false, true, false, false]);
            };

            vm.secondNextButton = function () {
                showActiveStepTab(...[false, false, true, false]);
            };

            vm.thiredNextButton = function () {
                showActiveStepTab(...[false, false, false, true]);
            };

            vm.secondTabPreviousButton = function () {
                showActiveStepTab(...[true, false, false, false]);
            };

            vm.thiredTabPreviousButton = function () {
                showActiveStepTab(...[false, true, false, false]);
            };

            vm.fourthTabPreviousButton = function () {
                showActiveStepTab(...[false, false, true, false]);
            };

            vm.checkProvisionsRowEmpty = function () {
                if (vm.isCreateLeaseAgreementByWizardEnabled) {
                    vm.agreement.provisions.forEach(function (row) {
                        if (row.item === null || row.value === null || row.type === null) {
                            vm.provisionNextEnabled = false;
                            return;
                        }
                        else
                            vm.provisionNextEnabled = true;
                    });
                }
                else
                    return;
            }
            vm.checkClausesRowEmpty = function () {
                if (vm.isCreateLeaseAgreementByWizardEnabled) {
                    vm.agreement.clauses.forEach(function (row) {
                        if (row.clauseId === null || row.clause.clauseTypeId === null) {
                            vm.clausesNextEnabled = false;
                            return;
                        }
                        else
                            vm.clausesNextEnabled = true;
                    });
                }
                else
                    return;
            }


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

                    //if (!(vm.agreement.provisions && vm.agreement.provisions.length))
                    //    vm.agreement.provisions = getDefaultProvisions();
                    getLeaseClauseTypes();
                    vm.agreement.masterAgreementId = options.masterAgreementId;
                    vm.agreement.customerId = options.customerId;
                    vm.agreement.customer = options.customer;
                    vm.agreement.clauses = !vm.agreement.clauses ? [] : vm.agreement.clauses;
                    vm.agreement.clauses.forEach(function (row) {
                        vm.getClauses(row, row.clause.clauseTypeId);
                    });
                    vm.vehicleType = options.vehicleType;
                    vm.vehicleTypeId = options.vehicleType.id;
                    vm.vehicleModel = options.vehicleModel;
                    vm.vehicleModelId = options.vehicleModel.id;
                    vm.agreement.movements[0].outDetail.dateTime = options.date;
                    vm.agreement.noOfMonths = options.noOfMonths;
                    vm.noOfMonthsChange();
                    vm.agreement.driverType = 1;
                    if (vm.isTaxCodeEnabled && options.masterAgreementId > 0) {
                        vm.branchTaxCodeForMasterAgreement();
                    }
                    //vm.vehicleOwnership = 1;
                    //notLoadTariff = true;

                    //vm.disableOperator = false;
                    //var rentalRow = chargesLines.filter(e => e.chargesTypeId == 1)[0];
                    //if (rentalRow.rate > 0 && !rentalRow.excessRate) {
                    //    vm.disableOperator = true;
                    //    vm.hideCharges = true;
                    //    vm.agreement.operator1Type = 6;
                    //    vm.agreement.operator2Type = 6;
                    //}
                    notLoadTariff = true;
                    loadChargesFromSettings();
                    vm.agreementTypeSelected();
                    vm.taxAccepted = vm.agreement.taxPercent > 0 ? true : false;
                    vm.loading = false;
                });
            };

            function getDefaultProvisions() {
                vm.agreement.provisions = [];
                for (let i in vm.agreementProvisionItems) {
                    vm.agreement.provisions.push({
                        agreementId: agreementId, item: vm.agreementProvisionItems[i].id, type: null, value: 0
                    });
                }
                return vm.agreement.provisions;
            }
            allFuelLevels();
            function init() {
                vm.loading = true;

                leaseAgreementService.getLeaseAgreementWithAdvanceAndDepositForEdit({
                    id: agreementId
                }).success(function (result) {
                    getLeaseClauseTypes();
                    vm.branchTaxCode();
                    vm.agreement = result.agreement;
                    if (vm.agreement.customer)
                        getCustomerPicture(vm.agreement.customer.id);

                    if (vm.isMultiCurrencyEnabled && vm.agreement.customer)
                        vm.agreement.customer.currency = vm.agreement.customer.currency.code;
                    if (vm.agreement.vehicle != null) {
                        vm.agreement.movements[vm.agreement.movements.length - 1].outDetail.makeAndModel = vm.agreement.vehicle.make + ' ' + vm.agreement.vehicle.model.name;
                    }
                    vm.advance = result.advance;
                    vm.deposit = result.deposit;
                    vm.agreement.provisions = vm.isCreateLeaseAgreementByWizardEnabled && !(vm.agreement.provisions && vm.agreement.provisions.length) ? getDefaultProvisions() : vm.agreement.provisions;

                    if (vm.isCreateLeaseAgreementByWizardEnabled && !(vm.agreement.preTerminationRules && vm.agreement.preTerminationRules.length))
                        vm.addPreTerminationRuleRow();

                    vm.agreement.clauses = !vm.agreement.clauses ? [] : vm.agreement.clauses;
                    vm.agreement.clauses.forEach(function (row) {
                        vm.getClauses(row, row.clause.clauseTypeId);
                    });


                    if (vm.agreement.id > 0) {
                        vm.isEditMod = true;
                        vm.agreementTaxPercent = vm.agreement.taxPercent;
                        //vm.agreement.endDate = utilities.jsonUtcDateToLocalMoment(vm.agreement.endDate);

                        vm.agreement.noOfMonths = moment(vm.agreement.endDate).diff(moment(vm.agreement.movements[0].outDetail.dateTime), 'months');
                            /* Dont load or apply tariff in edit mode
                            //in edit mod load tariff for vehicle. which will be used if some parameter is changed like dates etc.
                            var groupId = vm.agreement.vehicle.tariffGroupId;
                            if (groupId == null) groupId = -1;
    
                            if (isTariffEnabled) {
                                //load tariff
                                tariffHelper.loadTariff(groupId, function () {
                                    //don't apply
                                });
                            }
                            */

                        //calculate hold for days using fromdate and todate if cash or check deposit
                        if (vm.deposit.voucherSubTypeId && vm.deposit.voucherSubTypeId != 11) // all types except pre authorization
                        {
                            var td = moment(vm.deposit.toDate);
                            var duration = moment.duration(td.diff(vm.deposit.fromDate));
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

                    if (vm.updateFuelRateGloballyEnabled && vm.isSetFuelRateAutoOnAgreementCreationSettingEnabled && vm.agreement.id <= 0) {
                        vm.agreement.charges.forEach(ac => {
                            if (ac.chargesTypeId == 4) {
                                ac.rate = vm.fuelRateGlobally;
                            }
                        });
                    }

                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.preTermValid = function () {
                if (vm.agreement.preTerminationRules.length) {
                    var row = vm.agreement.preTerminationRules[0];
                    if (row &&
                        row.fromMonth &&
                        row.toMonth &&
                        row.type > 0 &&
                        row.penalityValue > 0)
                        return false;
                    else
                        return true;
                } else
                    return true;
            }

            function initAgreement() {
                vm.searchUsersWithDesignation();
                if (options.masterAgreementId)
                    initFromMasterAgreement();
                else
                    init();
            }

            var showActiveStepTab = function (...params) {
                [vm.leaseDetail, vm.showProvisions, vm.showClauses, vm.showPreTermination] = params;
            };


            vm.firstNextButton = function () {
                vm.activeTabIndex = 1;
                showActiveStepTab(...[false, true, false, false]);
            };

            vm.secondNextButton = function () {
                vm.activeTabIndex = 2;
                showActiveStepTab(...[false, false, true, false]);
            };

            vm.thiredNextButton = function () {
                vm.activeTabIndex = 3;
                showActiveStepTab(...[false, false, false, true]);
            };

            vm.secondScreenPreviousButton = function () {
                vm.activeTabIndex = 0;
                showActiveStepTab(...[true, false, false, false]);
            };

            vm.thiredScreenPreviousButton = function () {
                vm.activeTabIndex = 1;
                showActiveStepTab(...[false, true, false, false]);
            };

            vm.fourthScreenPreviousButton = function () {
                vm.activeTabIndex = 2;
                showActiveStepTab(...[false, false, true, false]);
            };


            initAgreement();
        }
    ]);
