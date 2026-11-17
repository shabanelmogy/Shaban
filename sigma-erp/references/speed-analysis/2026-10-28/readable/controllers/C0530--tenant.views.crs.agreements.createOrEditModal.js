// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:137003-139348
appModule.controller('tenant.views.crs.agreements.createOrEditModal', [
        '$scope', '$timeout', 'appSession', '$filter', 'utilities', '$uibModal', '$uibModalInstance', 'abp.services.app.staff', 'chargesCalculator', 'abp.services.app.vehicleAlerts', 'tariffHelper', 'abp.services.app.agreement',
        'agreementId', 'abp.services.app.vehicle', 'abp.services.app.directory', 'chargesSettings', 'abp.services.app.tariffCard',
        'abp.services.app.commonLookup', 'abp.services.app.agreementSaleOrder', 'abp.services.app.rentalQuotation', 'abp.services.app.accident', 'abp.services.app.saleOrigin', 'abp.services.app.agreementGroup', 'abp.services.app.currency', 'abp.services.app.commonLookup', 'abp.services.app.customerProject',
        function ($scope, $timeout, appSession, $filter, utilities, $uibModal, $uibModalInstance, staffService, chargesCalculator, vehicleAlertsService, tariffHelper, agreementService, agreementId,
            vehicleService, directoryService, chargesSettings, tariffCardService, lookupService, agreementSaleOrderService, rentalQuotationService,
            accidentService, saleOriginService, agreementGroupService, currencyAppService, commonLookupService, customerProjectService) {

            var vm = this;
            vm.picture = [];
            vm.isEditLimited = false;
            vm.count = 0;
            vm.isInitializingDates = false;
            vm.alwaysMakeTariffEditable = abp.features.isEnabled("CRS.CustomFeatures.AlwaysMakeTariffEditable");
            vm.outStandingBalance = null;
            vm.vehicleRegistrationExpiryPopupOnAgreementSaving = utilities.parseBoolean(abp.setting.get("App.General.VehicleRegistrationExpiryPopupOnAgreementSaving"));
            vm.isRentalProjectEnabled = abp.features.isEnabled("CRS.CustomFeatures.RentalCustomerProject");
            vm.clubRentalDriverAndFuelCharges = abp.features.isEnabled("CRS.CustomFeatures.ClubRentalDriverAndFuelCharges");
            vm.isAdvanceInvoicingEnabled = abp.features.isEnabled("CRS.CustomFeatures.AdvanceInvoicingOnAgreementCreationAndExtension");
            vm.isAddMultipleDepositsOnAgreement = abp.features.isEnabled("CRS.CustomFeatures.AddMultipleDepositsOnAgreement");
            vm.enableAutoEndDate = utilities.parseBoolean(abp.setting.get("App.General.AgreementAutoEndDate"));
            vm.canChangeRates = abp.auth.hasPermission('Pages.Tenant.Agreements.Edit.CanChangeRates');
            vm.canChangeFuelRates = abp.auth.hasPermission('Pages.Tenant.Agreements.CanChangeFuelRate');
            vm.editLimitedRates = abp.auth.hasPermission('Pages.Tenant.Agreements.Edit.EditLimitedRates');
            vm.isKMsLimitandExcessEditable = abp.auth.hasPermission('Pages.Tenant.Agreements.AllowKMsLimitandExcessEditable');
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.isTaxOptional = utilities.parseBoolean(abp.setting.get("App.General.IsTaxOptional"));
            vm.defaultCurrencyCode = abp.setting.get("App.General.CurrencyCode");
            vm.currencyCode = null;
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.disableKMInOut = utilities.parseBoolean(abp.setting.get("App.General.DisableKMInOutAndDriversInAgreement"));
            vm.defaultDriverForEquipmentAgreement = parseFloat(abp.setting.get("App.General.DefaultDriverIdForEquipmentAgreement"));
            vm.showOnlyFewerDetail = utilities.parseBoolean(abp.setting.get('App.Speed.Common.ShowOnlyFewerDetailForVehicle'));
            vm.showAgreementNotesInInvoiceDescription = utilities.parseBoolean(abp.setting.get('App.Speed.Common.ShowAgreementNotesInInvoiceDescription'));
            vm.branchTaxPercentage = null;
            vm.isAgreementStartDateAsAdvanceAndDepositDate = utilities.parseBoolean(abp.setting.get("App.General.AgreementStartDateAsAdvanceAndDepositDate"));
            vm.manualAgreementNo = utilities.parseBoolean(abp.setting.get("App.General.ManualAgreementNo"));
            vm.enableManualAgreementNo = utilities.parseBoolean(abp.setting.get("App.General.EnableManualAgreementNo"));
            vm.enablePickAndDropLocationInAgreement = utilities.parseBoolean(abp.setting.get("App.General.EnablePickAndDropLocationInAgreement"));
            vm.enableAdditionalNotes = utilities.parseBoolean(abp.setting.get("App.General.EnableAdditionalNotes"));
            vm.isSalesPersonRequired = utilities.parseBoolean(abp.setting.get("App.General.IsSalesPersonRequired"));
            vm.isWeeklyMonthlyEnabled = utilities.parseBoolean(abp.setting.get("App.General.WeeklyMonthlyRental"));
            vm.isHourlyEnabled = utilities.parseBoolean(abp.setting.get("App.General.HourlyRental"));
            vm.isTariffCardExplicitSelection = utilities.parseBoolean(abp.setting.get("App.General.TariffCardExplicitSelection"));
            vm.IsInsuranceCompanyAndClaimNoRequired = utilities.parseBoolean(abp.setting.get("App.General.IsInsuranceCompanyAndClaimNoRequired"));
            vm.isReturnDateRequired = utilities.parseBoolean(abp.setting.get("App.General.IsReturnDateRequired"));
            var enableFutureAgreementCheckOuts = utilities.parseBoolean(abp.setting.get("App.Speed.Common.EnableFutureAgreementCheckOuts"))
            vm.isTariffCardEnable = abp.features.isEnabled("CRS.Tariff.TariffCards");
            vm.makeTariffCardMandatoryInAgreementAndBooking = utilities.parseBoolean(abp.setting.get("App.Speed.Common.MakeTariffCardMandatoryInAgreementAndBooking"));
            vm.isDeliveryMovementEnable = abp.features.isEnabled("CRS.DeliveryAndCollectionMovements");
            vm.isAutoSelectSalePersonEnable = abp.features.isEnabled("CRS.CustomFeatures.AutoSelectSalePersonWhileAgreementOpeningBaseInUser");
            vm.driverTimeSheetForAgreement = abp.features.isEnabled("CRS.DriverTimeSheetForAgreement");
            vm.isVipCustomer = utilities.parseBoolean(abp.setting.get("App.General.IsVipCustomer"));
            vm.isSalesPersonMandatoryInCustomerMandatory = utilities.parseBoolean(abp.setting.get("App.General.SalesPersonIsMandatoryInCustomerWhileOpeningAgreement"));
            vm.searchDropDownSalesPerson = utilities.parseBoolean(abp.setting.get("App.General.SalesPersonSelectionInsteadOfSearching"));
            var doNotIncludeReplacementVehicle = utilities.parseBoolean(abp.setting.get("App.Speed.Common.DoNotIncludeReplacementVehicles"));
            vm.allowZeroValueRentalAgreement = utilities.parseBoolean(abp.setting.get("App.Speed.Common.AllowZeroValueRentalAgreement"));
            vm.makeTariffCardMandatoryInAgreementAndBooking = utilities.parseBoolean(abp.setting.get("App.Speed.Common.MakeTariffCardMandatoryInAgreementAndBooking"));
            vm.makeQuotationMandatoryForAllIndividualCustomersForWeeklyAndMonthly = utilities.parseBoolean(abp.setting.get("App.General.QuotationIsMandatoryForAllIndividualCustomersForWeeklyAndMonthly"));
            vm.taxAccepted = false;
            vm.carryforwardKMsonRAExtension = utilities.parseBoolean(abp.setting.get("App.Speed.Common.CarryforwardKMsonRAExtension"));
            vm.isVehicleSelectionByTypeInAgreements = utilities.parseBoolean(abp.setting.get("App.Speed.Common.EnableVehicleSelectionByTypeInAgreements"));
            vm.showAdvancePopupOnSave = false;
            vm.showDepositPopupOnSave = false;
            vm.isBooking = false;
            vm.saveAndPrint = false;
            vm.loading = false;
            vm.isTaxCodeEnabled = abp.features.isEnabled("CRS.TaxCodes");
            vm.isAdditionalDriverCharges = false;
            vm.tariffGroupId = null;
            vm.tariffGroup = null;
            vm.searchOtherGroupsVehicle = false;
            vm.chargesSettings = chargesSettings;
            vm.isUserWiseDiscountEnable = abp.features.isEnabled("CRS.UserWiseDiscount");
            vm.isDepositsEnable = abp.features.isEnabled("CRS.Vouchers.Deposits");
            vm.isBrokerContactGroupEnabled = abp.features.isEnabled("CRS.CustomFeatures.BrokerContactGroup");
            vm.isSaleOrderEnabled = abp.features.isEnabled("CRS.Vouchers.SaleOrders");
            vm.isAdvancePaymentRequired = utilities.parseBoolean(abp.setting.get("App.General.IsAdvancePaymentRequired"));
            vm.isDepositPaymentRequired = utilities.parseBoolean(abp.setting.get("App.General.IsDepositPaymentRequired"));
            vm.isPoNoMandatoryForCompanyIn = utilities.parseBoolean(abp.setting.get("App.Speed.Common.IsPoNoMandatoryForCompanyIn"));
            vm.invoiceBasedOnAgreedRent = utilities.parseBoolean(abp.setting.get("App.General.InvoiceBasedOnAgreedRent"));
            vm.isReadOnlyAdvanceAmount = false;
            vm.canChangeAdvanceAmount = abp.auth.hasPermission('Pages.Tenant.Agreements.CanChangeAdvanceAmount');
            vm.allowCompilmentoryAgreement = abp.auth.hasPermission('Pages.Tenant.Agreements.AllowComplimentaryAgreement');
            vm.canChangeKMOut = abp.auth.hasPermission('Pages.Tenant.Agreements.CanChangeKMOut');
            vm.canChangeFuelOut = abp.auth.hasPermission('Pages.Tenant.Agreements.CanChangeFuelOut');
            vm.isAgreementGroups = abp.auth.hasPermission('Pages.Tenant.AgreementGroups');
            vm.canOpenAgreementWithoutSaleOrder = abp.auth.hasPermission('Pages.Tenant.Agreements.CanOpenAgreementWithoutSaleOrderRental');
            vm.isSupplierAgreementsEnabled = abp.features.isEnabled("CRS.ExternalAgreements.SupplierAgreements");
            vm.isSagX3Enabled = abp.features.isEnabled("Core.SagX3Integration");
            vm.isRentalQuotationEnabled = abp.features.isEnabled("CRS.Rental.Quotations");
            vm.isMultiCurrencyEnabled = abp.features.isEnabled("Core.MultiCurrency");
            vm.isAuthCodeEnabled = abp.features.isEnabled("Core.AuthorizationCodes");
            vm.addAdvanceAsATRInBookingOrAgreement = utilities.parseBoolean(abp.setting.get("App.General.AddAdvanceInBookingasATR"));
            vm.isAgreementGroups = abp.features.isEnabled("Core.AgreementGroups");
            vm.isSaleOriginEnabled = abp.features.isEnabled("CRS.CustomFeatures.SaleOrigin");
            vm.updateFuelRateGloballyEnabled = abp.features.isEnabled("CRS.CustomFeatures.UpdateFuelRateGlobally");
            vm.isSetFuelRateAutoOnAgreementCreationSettingEnabled = utilities.parseBoolean(abp.setting.get("App.General.SetFuelRateAutoOnAgreementCreation"));
            vm.fuelRateGlobally = parseFloat(abp.setting.get("App.General.UpdateFuelRate"));
            vm.depositPayble = utilities.parseBoolean(abp.setting.get("App.General.AgreedDepositPayableUponAgreementCreationInBooking"));
            vm.isAllowBlackListedCustomerInAgreementEnabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.AllowBlackListedCustomerInAgreement"));
            var setting = abp.setting.get("App.Speed.Common.AutomaticallySplitFollowingCharges")
            if (setting)
                vm.splitChargesToDriver = JSON.parse(abp.setting.get("App.Speed.Common.AutomaticallySplitFollowingCharges"));


            //vm.userMaxdiscountPercent = appSession.user.maxDiscountPercent > 0 ? true : false;
            vm.vehicles = [];
            vm.customers = [];
            vm.drivers = [];
            var isValid = true;
            vm.discountCodeId = null;
            var errorMessage = {};
            var isTariffEnabled = abp.features.isEnabled("CRS.Tariff");
            vm.discountAuthCode = null;
            var agreementCategory = 1; //Rental
            vm.isTotalDaysAndHrs = false;
            vm.isIndividualCustomerRadio = true;
            vm.disableTariffCard = false;
            //  vm.agreement.driverType = 0;
            vm.quotation = { quotationLines: [] };
            vm.customerQuotations = [];
            vm.authorizationCode = null;
            vm.minRentalCharges = 0.1;

            vm.isComplimentary = true;
            vm.endDateChangedByUser = false;
            vm.isEndDateChanged = false;
            vm.skipWatcher = false;
            //vm.isSplit = false;


            //vm.agreement = {
            //    driverType:0,
            //};
            vm.agreementTypes = [

                { type: "Daily", id: 1 },
                { type: "Weekly", id: 2 },
                { type: "Monthly", id: 3 }
            ];
            if (vm.isHourlyEnabled)
                vm.agreementTypes.push({ type: "Hourly", id: 6 });
            var rateTypes = {
                perHour: { id: 7, name: '/Hour' },
                perDay: { id: 1, name: '/Day' },
                perWeek: { id: 2, name: '/Week' },
                perMonth: { id: 3, name: '/Month' },
            };

            vm.tariffCards = [];
            vm.tariffCard = null;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.searchProjects = function ($select) {
                var keyword = '';
                if ($select && $select.search)
                    keyword = $select.search;
                vm.project = null;
                vm.projectId = null;

                return customerProjectService.getCustomerProject({ status: true, filter: keyword/*, contactId: vm.agreement.customer.id*/ }).then(function (response) {
                    vm.projects = response.data.items;
                });
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

            if (vm.allowZeroValueRentalAgreement)
                vm.minRentalCharges = 0.0;

            vm.isQuotationMandatory = function () {
                return vm.agreement.customer.contactCategory == 1
                    && vm.agreement.agreementType != 1 &&
                    vm.makeQuotationMandatoryForAllIndividualCustomersForWeeklyAndMonthly;
            };
            vm.getDateTariffCard = function (row) {
                if (!row.fromDate)
                    return "";
                else
                    return '(' + vm.getlocalDateTime(row.fromDate) + " - " + vm.getlocalDateTime(row.toDate) + ')';
            };

            vm.searchGoogleLocations = function ($select) {
                if ($select.search == "") { vm.vehicles = null; return null; }
                lookupService.searchGooglePlaces({ keyWord: $select.search }).then(function (response) {
                    vm.geoLocations = response.data.items;
                });
            };

            vm.agreementTypeChange = function () {
                //if ((vm.agreement.agreementType == 1 || vm.agreement.agreementType == 2) && !vm.advanceChanged && !vm.isEditMod) {
                //    vm.advance.amount = vm.calculate();
                //    if (!vm.canChangeAdvanceAmount) {
                //        vm.isReadOnlyAdvanceAmount = true;
                //    }
                //}
                //else if (vm.agreement.agreementType == 3) {
                //    vm.isReadOnlyAdvanceAmount = false;
                //}
                vm.startDateChanged();
                return;
            };

            vm.getTariffCards = function () {
                vm.loading = true;
                tariffCardService.getActiveTariffCardsPeriodWise({ fromDate: vm.agreement.movements[0].outDetail.dateTime, toDate: vm.agreement.endDate }).success(function (data) {
                    vm.tariffCards = data.items;
                    vm.tariffCards.unshift({ id: null, name: app.localize("DefaultTariff") });
                    if (vm.tariffCardForAgreement) {
                        vm.tariffCards.push(vm.tariffCardForAgreement);
                    }
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.getTariffCardForAgreement = function () {
                vm.loading = true;
                tariffCardService.getTariffCardById({ id: vm.agreement.tariffCardId }).success(function (data) {
                    vm.tariffCardForAgreement = data;
                    vm.isTariffCardAlreadyPresent = vm.tariffCards.some(a => a.id === vm.tariffCardForAgreement.id)
                    if (!vm.isTariffCardAlreadyPresent) {
                        vm.tariffCards.push(vm.tariffCardForAgreement);
                    }

                }).finally(function () {
                    vm.loading = false;
                });
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

            ////date change calls on loading data first time in edit mode. disable tariff loading if it is first time loading of editing mode
            var startDateLoaded = false;
            vm.startDateChanged = function () {

                if (vm.enableAutoEndDate && startDateLoaded) {
                    if (vm.agreement && vm.agreement.agreementType == 2)
                        vm.agreement.endDate = moment(vm.agreement.movements[0].outDetail.dateTime).add(1, 'weeks').utc();
                    if (vm.agreement && vm.agreement.agreementType == 3)
                        vm.agreement.endDate = moment(vm.agreement.movements[0].outDetail.dateTime).add(1, 'months').utc();
                    if (vm.agreement && vm.agreement.agreementType == 6)
                        vm.agreement.endDate = moment(vm.agreement.movements[0].outDetail.dateTime).add(1, 'hours').utc();
                }
                startDateLoaded = true;

                // if (abp.auth.hasPermission('Pages.Tenant.TariffCards')) {
                vm.getTariffCards();
                //}
                //don't apply tariff in edit mode
                if (isTariffEnabled && !vm.isEditMod)
                    tariffHelper.applyTariff(vm.agreement);
                if (vm.updateFuelRateGloballyEnabled && vm.isSetFuelRateAutoOnAgreementCreationSettingEnabled && vm.agreement.id <= 0) {
                    vm.agreement.charges.forEach(ac => {
                        if (ac.chargesTypeId == 4) {
                            if (ac.rate == 0)
                                ac.rate = vm.fuelRateGlobally;
                        }
                    });
                }

                //apply tariff in edit mode if startDate & endDate initialized on first time load and tariff is enabled
                //if ((vm.isEditMod && startDateLoaded && endDateLoaded) || !vm.isEditMod) {
                //    if (isTariffEnabled) 
                //        tariffHelper.applyTariff(vm.agreement);
                //}
                //else
                //    startDateLoaded = true;
            };



            vm.shouldDisableRateOtherThanRent = function (chargesRow) {
                if (vm.alwaysMakeTariffEditable) {
                    return false;
                }

                return (
                    (!vm.isEditMod && !vm.isKMsLimitandExcessEditable &&
                        chargesRow.chargesTypeId == 5 && chargesRow.tariff.length > 0)
                    || (chargesRow.included && chargesRow.chargesTypeId == 5)
                    || ((chargesRow.included || !chargesRow.accepted) &&
                        (chargesRow.chargesType.chargesCategory == 2 ||
                            chargesRow.chargesType.chargesCategory == 3 ||
                            chargesRow.chargesType.chargesCategory == 4))
                    || (vm.isUserWiseDiscountEnable &&
                        Array.isArray(chargesRow.tariff) && //check tariff not null
                        chargesRow.tariff.length > 0 &&
                        vm.disableRate(chargesRow))
                    || ((!vm.canChangeRates && vm.isEditMod) && !vm.isEditLimited)
                    || vm.lockCharges
                    || (vm.isEditLimited &&
                        (chargesRow.chargesTypeId == 1 || chargesRow.chargesTypeId == 5))
                    || (chargesRow.chargesTypeId == 4 &&
                        !vm.canChangeFuelRates &&
                        vm.updateFuelRateGloballyEnabled)
                );
            };


            vm.shouldDisableRow = function (chargesRow) {
                if (vm.alwaysMakeTariffEditable) {
                    return false;
                }
                else {


                    return (
                        (chargesRow.included && chargesRow.chargesTypeId == 5)

                        || ((chargesRow.included || !chargesRow.accepted)
                            && (chargesRow.chargesType.chargesCategory == 2
                                || chargesRow.chargesType.chargesCategory == 3
                                || chargesRow.chargesType.chargesCategory == 4))

                        || (vm.isUserWiseDiscountEnable
                            && Array.isArray(chargesRow.tariff)
                            && chargesRow.tariff.length > 0
                            && vm.disableRate(chargesRow))

                        || ((!vm.canChangeRates && vm.isEditMod) && !vm.isEditLimited)

                        || vm.lockCharges

                        || (vm.isEditLimited && (chargesRow.chargesTypeId == 1 || chargesRow.chargesTypeId == 5))
                    );
                }
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
                                discountAuthCode: vm.discountAuthCode,
                                vehicleTypeId: vm.agreement.vehicle.tariffGroup.id,
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

            vm.agreementTypeSelected = function () {

                //convert time based rates to corresponding rate type based on selected agreement type
                for (var i = 0; i < vm.agreement.charges.length; i++) {
                    if (vm.agreement.charges[i].rateTypeId == 1 || vm.agreement.charges[i].rateTypeId == 7 || vm.agreement.charges[i].rateTypeId == 2 || vm.agreement.charges[i].rateTypeId == 3) {
                        if (vm.agreement.agreementType == 2) {
                            vm.agreement.charges[i].rateTypeId = rateTypes.perWeek.id;
                            vm.agreement.charges[i].rateType = rateTypes.perWeek;
                        }
                        else if (vm.agreement.agreementType == 3) {
                            vm.agreement.charges[i].rateTypeId = rateTypes.perMonth.id;
                            vm.agreement.charges[i].rateType = rateTypes.perMonth;
                        }
                        else if (vm.agreement.agreementType == 6) {
                            vm.agreement.charges[i].rateTypeId = rateTypes.perHour.id;
                            vm.agreement.charges[i].rateType = rateTypes.perHour;
                        }
                        else {
                            vm.agreement.charges[i].rateTypeId = rateTypes.perDay.id;
                            vm.agreement.charges[i].rateType = rateTypes.perDay;
                        }
                    }
                }
                if (isTariffEnabled)
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

            //var endDateLoaded = false;

            vm.updateEndDateTimeWithStartDate = function () {
                if (!vm.agreement ||
                    !vm.agreement.movements ||
                    !vm.agreement.movements.length ||
                    !vm.agreement.movements[0].outDetail ||
                    !vm.agreement.movements[0].outDetail.dateTime ||
                    !vm.agreement.endDate) {
                    return;
                }

                var startDate = moment(
                    vm.agreement.movements[0].outDetail.dateTime
                );

                var currentEndDate = moment(
                    vm.agreement.endDate
                );

                if (!startDate.isValid() || !currentEndDate.isValid()) {
                    return;
                }

                var correctedEndDate = currentEndDate.clone()
                    .hour(startDate.hour())
                    .minute(startDate.minute())
                    .second(0)
                    .millisecond(0);

                // Do not assign a new object when the value is already correct.
                if (currentEndDate.valueOf() === correctedEndDate.valueOf()) {
                    return;
                }

                vm.agreement.endDate = correctedEndDate.toDate();

                vm.totalDaysAndTime();
            };
            $scope.$watch(
                function () {
                    return vm.agreement
                        ? vm.agreement.endDate
                        : undefined;
                },
                function (newVal, oldVal) {
                    if (!newVal || !oldVal) {
                        return;
                    }

                    if (vm.skipWatcher ||
                        vm.isInitializingDates ||
                        vm.isUpdatingEndDateFromWatcher ||
                        vm.isUpdatingEndDateFromStartDate) {
                        return;
                    }

                    if (!vm.isAdvanceInvoicingEnabled) {
                        return;
                    }

                    var newDate = moment(newVal);
                    var oldDate = moment(oldVal);

                    if (!newDate.isValid() || !oldDate.isValid()) {
                        return;
                    }

                    /*
                     * Ignore string → Moment/Date conversion when both values
                     * represent the same instant.
                     */
                    if (newDate.valueOf() === oldDate.valueOf()) {
                        return;
                    }

                    vm.endDateChangedByUser = true;
                    vm.isUpdatingEndDateFromWatcher = true;

                    try {
                        vm.updateEndDateTimeWithStartDate();
                    } finally {
                        $timeout(function () {
                            vm.isInitializingDates = false;
                            startDateLoaded = true;
                        }, 100);
                    }
                }
            );

            vm.restrictEndTime = function () {
                if (!vm.isAdvanceInvoicingEnabled ||
                    vm.isInitializingDates ||
                    vm.isUpdatingEndDateFromStartDate ||
                    vm.isUpdatingEndDateFromWatcher) {
                    return;
                }

                if (!vm.agreement ||
                    !vm.agreement.movements ||
                    !vm.agreement.movements.length ||
                    !vm.agreement.movements[0].outDetail) {
                    return;
                }

                var start = vm.agreement.movements[0].outDetail.dateTime;
                var end = vm.agreement.endDate;

                if (!start || !end) {
                    return;
                }

                var startDate = moment(start);
                var currentEndDate = moment(end);

                if (!startDate.isValid() || !currentEndDate.isValid()) {
                    return;
                }

                var correctedEndDate = currentEndDate.clone()
                    .hour(startDate.hour())
                    .minute(startDate.minute())
                    .second(0)
                    .millisecond(0);

                if (currentEndDate.valueOf() === correctedEndDate.valueOf()) {
                    return;
                }

                vm.isUpdatingEndDateFromStartDate = true;

                vm.agreement.endDate = correctedEndDate.toDate();

                $timeout(function () {
                    vm.isUpdatingEndDateFromStartDate = false;
                }, 0);
            };
            vm.onStartDateChanged = function () {
                if (vm.isInitializingDates) {
                    return;
                }

                vm.startDateChanged();
                vm.restrictEndTime();
                vm.totalDaysAndTime();
            };

            vm.onEndDateChanged = function () {
                if (vm.isUpdatingEndDateFromStartDate) {
                    return;
                }

                vm.endDateChanged();
            };




            vm.searchVehicles = function ($select) {
                if ($select.search == "") { vm.vehicles = null; return null; }
                var subStatuses = [1, 7]; //1: Available, 7: Ready to go
                if (vm.isVehicleSelectionByTypeInAgreements) {
                    return vehicleService.searchVehicles({ plateNo: $select.search, statusId: 'IDL', vehicleType: 'Rental', subStatuses: subStatuses, source: 'openagreement', tariffGroupId: vm.searchOtherGroupsVehicle ? null : vm.tariffGroupId, doNotIncludeReplacementVehicle: doNotIncludeReplacementVehicle }).then(function (response) {
                        vm.vehicles = response.data.items;
                    });
                }
                else {
                    return vehicleService.searchVehicles({ plateNo: $select.search, statusId: 'IDL', subStatuses: subStatuses, source: 'openagreement', tariffGroupId: vm.searchOtherGroupsVehicle ? null : vm.tariffGroupId, doNotIncludeReplacementVehicle: doNotIncludeReplacementVehicle }).then(function (response) {
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


            vm.searchUsersWithDesignation = function () {

                return directoryService.searchSalesPersonActiveOne().then(function (response) {

                    vm.userList = response.data.items;
                });
            };

            vm.salesPersonSelected = function () {
                vm.agreement.salesPersonId = vm.agreement.salesPerson.id;
            };

            vm.searchStaff = function ($select) {
                if (!$select.search) return;
                return directoryService.searchSalesPersonWithDesignation({ keyword: $select.search, contactType: 1, activeOnly: true }).then(function (response) {
                    vm.staffList = response.data.items;
                });
            };

            vm.searchSaleOrigin = function ($select) {
                if (!$select.search) return;
                return saleOriginService.getSaleOrigins({ keyword: $select.search }).then(function (response) {
                    vm.saleOrigins = response.data.items;
                });
            };

            const getAgreementGroups = function () {
                return agreementGroupService.getAgreementGroups().then(function (response) {
                    vm.agreementGroups = response.data.items;
                });
            };

            vm.endDateChanged = function () {
                if (isTariffEnabled && !vm.isEditMod)
                    tariffHelper.applyTariff(vm.agreement);
                if (vm.updateFuelRateGloballyEnabled && vm.isSetFuelRateAutoOnAgreementCreationSettingEnabled && vm.agreement.id <= 0) {
                    vm.agreement.charges.forEach(ac => {
                        if (ac.chargesTypeId == 4) {
                            if (ac.rate == 0)
                                ac.rate = vm.fuelRateGlobally;
                        }
                    });
                }
                //if (abp.auth.hasPermission('Pages.Tenant.TariffCards')) {
                vm.getTariffCards();
                //}
                //if ((vm.isEditMod && startDateLoaded && endDateLoaded) || !vm.isEditMod) {
                //    if (isTariffEnabled)
                //        tariffHelper.applyTariff(vm.agreement);
                //}
                //else
                //    endDateLoaded = true;



            };

            vm.searchCustomerPopoup = function () {
                var modalInstance = openSearchContactModel(null, 2, false);

                modalInstance.result.then(function (result) {
                    if (result != null) {
                        if (result.isBlackListed) {
                            abp.message.warn(app.localize("Selected Customer is blacklisted."));
                        } else {
                            vm.agreement.customer = result;
                            vm.customerSelected();
                        }
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


            vm.searchSupplierContact = function ($select) {
                if (!$select.search) return;
                // Only contact Suppliers=3 is required
                return directoryService.searchByContactGroup({ keyword: $select.search, contactType: 3 }).then(function (response) {
                    vm.suppliers = response.data.items;
                });
            };

            vm.searchDriverPopoup = function () {
                var type = null;
                if (vm.agreement.driverType == 2) type = 1;
                if (vm.agreement.driverType == 3) type = 6;
                var modalInstance = openSearchContactModel(1, type, (vm.agreement.customer.contactCategory == 2 && vm.agreement.driverType == 3));
                //var modalInstance = openSearchContactModel(1, 2);

                modalInstance.result.then(function (result) {
                    if (result != null)
                        vm.agreement.driver = result;
                });
            };



            vm.searchSupplierPopoup = function () {
                var modalInstance = openSearchContactModel(null, 3, false);

                modalInstance.result.then(function (result) {
                    if (result != null)
                        vm.agreement.insuranceCompany = result;
                });
            };



            vm.driverChargesPopoup = function () {
                var modalInstance = openDriverChargesModel();
                modalInstance.result.then(function (result) {
                    if (result != null)
                        vm.agreement.charges = result;
                });
            };

            vm.clearAdditionalDriver = function () {
                vm.agreement.additionalDriver = null;
                vm.agreement.additionalDriverId = null;
            };


            vm.searchAdditionalDrivers = function ($select) {
                if (!$select.search) return;
                return directoryService.searchPersonStaffCustomer({ keyword: $select.search, activeOnly: true, isAdditionalDriverSearch: true, companyId: vm.agreement.customer && vm.agreement.customer.contactCategory == 2 ? vm.agreement.customer.id : null }).then(function (response) {
                    vm.additionaldrivers = response.data.items;
                });
            };

            vm.searchAdditionalDriverPopoup = function () {
                var modalInstance = openSearchContactModel(1, 2, false, true);

                modalInstance.result.then(function (result) {
                    if (result != null)
                        vm.agreement.additionalDriver = result;
                });
            };
            vm.tariffCardChanged = function () {

            };
            vm.vehicleSelected = function () {
                vm.vehicleMessage = null;
                vm.agreement.movements[0].outDetail.fuelLevel = vm.agreement.vehicle.fuelLevel;
                vm.agreement.movements[0].outDetail.km = vm.agreement.vehicle.kMs;


                vm.agreement.movements[0].outDetail.makeAndModel = vm.agreement.vehicle.make + ' ' + vm.agreement.vehicle.model;

                var groupId = vm.agreement.vehicle.tariffGroupId;
                if (groupId == null) groupId = -1;

                if (isTariffEnabled && !vm.isEditMod) {
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
                        vm.changeTariffBasedOnCustomerCurrency();

                    }, vm.tariffCard);

                }
                vm.changesRegardingQuotationCharges();

            };

            vm.changesRegardingQuotationCharges = function () {

                vm.lockCharges = false;
                if (!vm.agreement.vehicle || !vm.isRentalQuotationEnabled)
                    return;
                if (vm.quotation) {
                    var quotationLine = vm.quotation.quotationLines.find(e => e.vehicleModelId == vm.agreement.vehicle.modelId
                        && e.vehicleTypeId == vm.agreement.vehicle.tariffGroupId);

                    if (quotationLine) {
                        vm.lockCharges = true;
                        takeRatesFromQuotation(quotationLine);
                    }
                }

            };
            function imageGalleryObject() {
                var detail = new Object();
                detail.thumb = "";
                detail.img = "";
                detail.description = "";
                return detail;
            }
            vm.quotationSelected = function () {
                vm.agreement.quotationId = vm.agreement.quotation.id;
                vm.quotation = vm.agreement.quotation;
                vm.changesRegardingQuotationCharges();
                //vm.lockCharges = false;

                //vm.agreement.quotation.quotationLines.forEach(e => {
                //    if (e.vehicleModelId == vm.agreement.vehicle.modelId && e.vehicleTypeId == vm.agreement.vehicle.tariffGroupId) {
                //        //vm.agreement.charges = e.extrasLines;
                //        takeRatesFromQuotation(e);
                //        vm.lockCharges = true;
                //    }
                //});
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
            vm.splitChargesForBroker = function () {
                if (vm.splitChargesToDriver) {
                    if (vm.splitChargesToDriver.length > 0) {
                        if (!(vm.agreement.id > 0)) {
                            if (vm.agreement.customer.isBroker && vm.isBrokerContactGroupEnabled) {
                                if (vm.agreement.driver) {
                                    if (vm.agreement.driver.contactType == 1 || vm.agreement.driver.contactType == 2) {
                                        vm.agreement.charges.forEach(function (charges) {
                                            var setChargesAutomatically = !vm.splitChargesToDriver.some(e => e.id == charges.chargesTypeId);
                                            if (setChargesAutomatically) {
                                                charges.invoiceToDriver = true;
                                            }
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
            }

            function getAllCurrencies() {
                currencyAppService.getCurrencies().then(function (response) {
                    vm.allCurrencies = response.data.items;
                    vm.baseCurrencyId = response.data.items.filter(p => p.isBase)[0].id;
                    vm.baseCurrency = response.data.items.filter(p => p.isBase);
                });
            };

            function getCurrencies() {
                commonLookupService.getCurrencies({}).success(function (data) {
                    vm.currencies = data.items;
                });
            };

            vm.calculateCount = function () {
                vm.count = vm.agreement.charges.filter(function (charge) {
                    return charge.invoiceToDriver === true;
                }).length;
                return vm.count;
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

            vm.getOutStandingBalance = function () {
                if (vm.agreement.customer) {
                    directoryService.getCustomerOutstandingBalance({ id: vm.agreement.customer.id }).success(function (result) {
                        vm.outStandingBalance = result;
                    });
                }
            }

            vm.changeTariffBasedOnCustomerCurrency = function () {
                if (vm.isMultiCurrencyEnabled) {
                    if (!vm.isEditMod) {
                        if (vm.agreement.customer.currencyDto) {
                            vm.currencyCode = vm.agreement.customer.currencyDto.code;
                            let currencyToBaseRate = vm.agreement.customer.currencyDto.currencyToBaseRate;
                            vm.agreement.currencyId = vm.agreement.customer.currencyDto.id;
                            vm.agreement.currencyRate = vm.agreement.customer.currencyDto.currencyToBaseRate;
                            vm.agreement.charges.forEach(ch => {
                                ch.rate = utilities.round(ch.rate / currencyToBaseRate);
                            });
                        }
                    }

                    else {
                        tariffHelper.loadTariff(vm.agreement.vehicle.tariffGroupId, agreementCategory, function () {
                            tariffHelper.applyTariff(vm.agreement);

                            if (vm.updateFuelRateGloballyEnabled && vm.isSetFuelRateAutoOnAgreementCreationSettingEnabled) {
                                vm.agreement.charges.forEach(ac => {
                                    if (ac.chargesTypeId == 4) {
                                        if (ac.rate == 0)
                                            ac.rate = vm.fuelRateGlobally;
                                    }
                                });
                            }

                            if (vm.agreement.customer.currencyDto) {
                                vm.currencyCode = vm.agreement.customer.currencyDto.code;
                                let currencyToBaseRate = vm.agreement.customer.currencyDto.currencyToBaseRate;
                                vm.agreement.currencyId = vm.agreement.customer.currencyDto.id;
                                vm.agreement.currencyRate = vm.agreement.customer.currencyDto.currencyToBaseRate;
                                vm.agreement.charges.forEach(ch => {
                                    ch.rate = utilities.round(ch.rate / currencyToBaseRate);
                                });
                            }
                        }, vm.tariffCard);
                    }
                }
            }

            vm.customerSelected = function () {
                getCustomerPicture(vm.agreement.customer.id);
                //getExpiredDocumentAndOutStandingBalance(vm.agreement.customer.id);
                //if contact (i.e individual person)
                if (vm.agreement.customer.contactCategory == 1) {
                    vm.agreement.driver = vm.agreement.customer;
                    vm.driverSelected();
                    vm.isCompany = false;
                    vm.isIndividualCustomerRadio = true;
                    vm.agreement.driverType = 1;
                    vm.individualCustomerRadioSelected();



                    if (vm.isRentalQuotationEnabled) {
                        vm.agreement.quotation = null;
                        vm.agreement.quotationId = null;
                        vm.customerQuotations = [];

                        rentalQuotationService.getQuotationsByContactId({ id: vm.agreement.customer.id }).success(function (result) {
                            vm.customerQuotations = result;
                            vm.lockCharges = false;

                        }).finally(function () {
                            vm.loading = false;
                        });
                    }
                }

                if (vm.agreement.customer.contactCategory == 2) {
                    vm.isCompany = true;
                    vm.isIndividualCustomerRadio = false;
                    vm.agreement.driverType = 3;
                    vm.individualCustomerRadioSelected();
                    vm.customerQuotations = [];
                }
                if (vm.isEditMod && vm.agreementTaxPercent > 0) {
                    vm.agreement.taxPercent = vm.agreement.customer.isTaxExempted ? 0
                        : vm.agreementTaxPercent;
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
                        else {
                            if (vm.branchTaxPercentage)
                                vm.agreement.taxPercent = vm.branchTaxPercentage;
                        }
                    }
                }
                if (vm.agreement.customer.salesPerson != null) {
                    vm.agreement.salesPerson = vm.agreement.customer.salesPerson;
                    vm.agreement.salesPersonId = vm.agreement.customer.salesPerson.id;
                } else {
                    vm.getAuthorizedUserName(appSession.user.id);
                }
                vm.agreement.saleOrder = null;
                vm.agreement.saleOrderId = null;

                vm.getSaleOrders();

                if (vm.agreement.customer.tariffCardId != null) {
                    var tariffCardsToCheck = vm.tariffCards.filter(row => row.id == vm.agreement.customer.tariffCardId);
                    if (tariffCardsToCheck.length > 0) {
                        vm.tariffCard = tariffCardsToCheck[0].id;
                        vm.disableTariffCard = true;
                        vm.vehicleSelected();
                    }
                }
                else {
                    vm.disableTariffCard = false;
                }
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

            vm.isBlackListedCustomerCheck = function (customer) {
                if (customer.isBlackListed) {
                    abp.message.warn(app.localize("Selected Customer is blacklisted."));
                }
            }

            vm.onCustomerSelect = function (customer) {
                agreementId = null;
                vm.agreement.customerId = customer.id;
                if (vm.agreement.customer) {
                    if (vm.isMultiCurrencyEnabled) {
                        if (!vm.agreement.customer.currencyDto) {
                            vm.agreement.customer.currencyDto = vm.baseCurrency[0];
                        }
                        if (vm.agreement.customer.currencyDto) {
                            vm.advance.currencyId = vm.agreement.customer.currencyDto.id;
                            if (customer.currencyDto?.id && vm.isMultiCurrencyEnabled) {
                                vm.advance.inputCurrencyId = customer.currencyDto.id;
                            }
                        }
                    }
                }

                //if (customer.contactType == 2 && !customer.currencyDto?.id && vm.isMultiCurrencyEnabled) {
                //    abp.message.info("Attach Currency With Customer");
                //}
            };


            vm.commonDriverSearch = function (contactCategoryId, contactTypeId) {
                vm.searchDrivers = function ($select) {
                    if (!$select.search) return;
                    //whereas contactCategory: 1 (person). get all persons which includes staff as well
                    return directoryService.search({ keyword: $select.search, contactCategory: contactCategoryId, contactType: contactTypeId, activeOnly: true }).then(function (response) {
                        vm.drivers = response.data.items;
                    });
                };
            };

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

                            var companyIdToForward = vm.agreement.customer ? vm.agreement.customer.id : null;
                            //whereas contactCategory: 2 (company), contactType: 1 (staff)
                            return directoryService.searchForCompany({ keyword: $select.search, companyId: companyIdToForward, activeOnly: true }).then(function (response) {
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

            //vm.searchSaleOrders = function ($select) {
            //    if (!$select.search) return;

            //    return agreementSaleOrderService.searchSaleOrdersForAgreement({ keyword: $select.search, contactId: vm.agreement.customer.id }).then(function (response) {
            //        vm.saleOrders = response.data.items;
            //    });
            //};


            vm.getSaleOrders = function () {
                if (!vm.agreement.customer) return;

                return agreementSaleOrderService.getAgreementSaleOrdersByContactId({ id: vm.agreement.customer.id }).then(function (response) {
                    vm.saleOrders = response.data.items;
                });
            };

            vm.saleOrderChanged = function () {

                vm.agreement.saleOrderId = vm.agreement.saleOrder.id;
                if (vm.agreement.saleOrder.quotationId) {
                    vm.loading = true;
                    rentalQuotationService.getQuotationForEdit({ id: vm.agreement.saleOrder.quotationId }).success(function (result) {
                        vm.quotation = result;
                        vm.agreement.quotation = vm.quotation;
                        vm.changesRegardingQuotationCharges();
                        //vm.lockCharges = false;

                        //vm.quotation.quotationLines.forEach(e => {
                        //    if (e.vehicleModelId == vm.agreement.vehicle.modelId && e.vehicleTypeId == vm.agreement.vehicle.tariffGroupId) {
                        //        //vm.agreement.charges = e.extrasLines;
                        //        takeRatesFromQuotation(e);
                        //        vm.lockCharges = true;
                        //    }
                        //});
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
            };


            function takeRatesFromQuotation(quotationLine) {
                vm.agreement.charges.forEach(ac => {
                    var el = quotationLine.extrasLines.find(el => el.chargesTypeId == ac.chargesTypeId);
                    if (el) {
                        ac.rate = el.rate;
                        ac.accepted = el.accepted;
                        ac.included = el.included;
                        ac.limit = el.limit;
                        ac.excessRate = el.excessRate;
                    }
                    //quotationLine.extrasLines.forEach(qc => {
                    //    if (ac.chargesTypeId == qc.chargesTypeId) {
                    //        ac.rate = qc.rate;
                    //        ac.accepted = qc.accepted;
                    //        ac.included = qc.included;
                    //        ac.limit = qc.limit;
                    //        ac.excessRate = qc.excessRate;
                    //    }
                    //});
                });
            }

            vm.driverSelected = function () {
                if (isTariffEnabled && !vm.isEditMod)
                    tariffHelper.applyTariff(vm.agreement);
                if (vm.updateFuelRateGloballyEnabled && vm.isSetFuelRateAutoOnAgreementCreationSettingEnabled && vm.agreement.id <= 0) {
                    vm.agreement.charges.forEach(ac => {
                        if (ac.chargesTypeId == 4) {
                            if (ac.rate == 0)
                                ac.rate = vm.fuelRateGlobally;
                        }
                    });
                }
                vm.changeTariffBasedOnCustomerCurrency();
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
                vm.splitChargesForBroker();
            };

            vm.additionalDriverSelected = function () {
                if (isTariffEnabled && !vm.isEditMod)
                    tariffHelper.applyTariff(vm.agreement);
                if (vm.updateFuelRateGloballyEnabled && vm.isSetFuelRateAutoOnAgreementCreationSettingEnabled && vm.agreement.id <= 0) {
                    vm.agreement.charges.forEach(ac => {
                        if (ac.chargesTypeId == 4) {
                            if (ac.rate == 0)
                                ac.rate = vm.fuelRateGlobally;
                        }
                    });
                }
                vm.changeTariffBasedOnCustomerCurrency();

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
                                tariffGroup: vm.searchOtherGroupsVehicle ? null : vm.tariffGroup,
                                tariffGroupId: vm.searchOtherGroupsVehicle ? null : vm.tariffGroupId,
                                statusId: 'IDL',
                                vehicleType: vm.isVehicleSelectionByTypeInAgreements ? 'Rental' : null,
                                subStatuses: [1, 7], //1: Available, 7: Ready to go
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

            vm.addExternalVehiclePopup = function () {
                openAddExternalVehicleModal();
            };

            function openAddExternalVehicleModal() {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/addExternalVehicle.cshtml',
                    controller: 'tenant.views.crs.vehicles.addExternalVehicle as vm',
                    backdrop: 'static',
                    size: 'sm'
                });
                modalInstance.result.then(function (vehicle) {
                    vm.agreement.vehicle = vehicle;
                });
            }

            function openSearchContactModel(category, type, isOnlyCorporate, isAdditionalDriverSearch) {
                if (vm.isSagX3Enabled) {
                    category = 1;
                }

                var companyIdToForward = vm.agreement.customer && vm.agreement.customer.contactCategory == 2 ? vm.agreement.customer.id : null;

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
                                isAdditionalDriverSearch: isAdditionalDriverSearch,
                                companyId: companyIdToForward,
                                activeOnly: true
                            }
                        }
                    }
                });
            }

            vm.addExternalVehiclePopup = function () {
                openAddExternalVehicleModal();
            };

            vm.addSagX3Contact = function () {
                var modalInstance = openSearchSagX3ContactModel();

                modalInstance.result.then(function (result) {
                    if (result != null) {
                        vm.agreement.customer = result;
                        vm.customerSelected();
                    }
                });
            };

            function openSearchSagX3ContactModel() {
                return $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchSagX3ContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchSagX3ContactModal as vm',
                    backdrop: 'static'
                });
            }

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
                modalInstance.result.then(function (result) {
                    vm.calculateCount();
                });
            }

            function openVerifyAuthorizationCodeModal(validationObj) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/authorizationCodes/verifyAuthCodeModal.cshtml',
                    controller: 'tenant.views.common.authorizationCodes.verifyAuthCodeModal as vm',
                    backdrop: 'static',
                    resolve: {
                        validationObj: function () {
                            return validationObj;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    if (result)
                        vm.authorizationCode = result;
                    advanceAndDepositCheck();
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
                    errorMessage = errorMessage + '\n Agreement Out Date Can not be future Date';
                }
                if (vm.agreement.endDate != null) {
                    if (vm.agreement.movements[0].outDetail.dateTime > vm.agreement.endDate) {
                        isValid = false;
                        errorMessage = errorMessage + '\n Return Date can not  less than Out Date ';
                    }
                }
                if (vm.isSalesPersonMandatoryInCustomerMandatory) {
                    if (vm.agreement.customer) {
                        if (!vm.agreement.customer.salesPersonId) {
                            isValid = false;
                            errorMessage = errorMessage + '\n Customer Have no Salesperson';
                        }
                    }

                }

            }
            vm.save = function () {
                vm.saving = true;
                validate();

                lookupService.validateCreditLimit({ id: vm.agreement.customer.id }).success(function (result) {
                    if (result.isLimitCrossed && !vm.isEditMod)
                        openVerifyAuthorizationCodeModal(result);
                    else
                        advanceAndDepositCheck();
                });

            };

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

            function advanceAndDepositCheck() {

                //if (vm.validateCreditLimit(vm.agreement.customerId))
                //    return;

                if (vm.agreement.customer.contactCategory != 2) {
                    vm.agreement.charges.forEach(function (value) {
                        value.invoiceToDriver = false;
                    });
                }
                vm.advanceChanged = true;
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
                        keyboard: true, // Enable Esc key to close the modal
                        resolve: {
                            options: function () {
                                return {
                                    agreement: vm.agreement,
                                    customerCurrencyDetails: vm.agreement.customer.currencyDto,
                                    isBooking: false,
                                    advance: vm.advance,
                                    deposit: vm.deposit,
                                };
                            }
                        }
                    });

                    modalInstance.result.then(function (result) {
                        if (result && result.save) {
                            vm.saving = result.save;
                            if (vm.saving) {
                                vm.advanceChanged = true;
                                if (vm.deposit.voucherSubTypeId !== 11) {
                                    vm.deposit.fromDate = moment();
                                    var fromDate = angular.copy(vm.deposit.fromDate);
                                    vm.deposit.toDate = fromDate.add(vm.deposit.holdForDays, 'day');
                                }
                                save(); // Call the save function
                            }
                        } else {
                            vm.saving = false;
                            // Other actions if save is not true or result is null
                        }
                    }, function () {
                        // This function executes if the modal is dismissed (e.g., by pressing Esc)
                        vm.saving = false; // Update the state when the modal is dismissed
                        // Additional actions if the modal is dismissed
                    });

                } else //if advance or deposit popup is not shown then save directly
                    save();
            };
            function save() {
                vm.saving = true;
                vm.skipWatcher = true;
                if (isValid) {
                    //update ids for selected records
                    vm.agreement.vehicleId = vm.agreement.vehicle.id;
                    vm.agreement.customerId = vm.agreement.customer.id;
                    //if (vm.enableAutoEndDate) {
                    //    if (vm.agreement.agreementType == 2)
                    //        vm.agreement.endDate = moment(vm.agreement.movements[0].outDetail.dateTime).add(1, 'weeks');
                    //    if (vm.agreement.agreementType == 3)
                    //        vm.agreement.endDate = moment(vm.agreement.movements[0].outDetail.dateTime).add(1, 'months');
                    //}
                    if (vm.disableKMInOut)
                        vm.agreement.driverId = vm.defaultDriverForEquipmentAgreement;
                    else
                        vm.agreement.driverId = vm.agreement.driver.id;

                    if (vm.agreement.insuranceCompany != null)
                        vm.agreement.InsuranceCompanyId = vm.agreement.insuranceCompany.id;

                    if (vm.agreement.customer.contactCategory != 2)
                        vm.agreement.poNo = null;

                    if (vm.agreement.additionalDriver != null)
                        vm.agreement.additionalDriverId = vm.agreement.additionalDriver.id;
                    else
                        vm.agreement.additionalDriverId = null;

                    if (vm.agreement.salesPerson != null)
                        vm.agreement.salesPersonId = vm.agreement.salesPerson.id;
                    else
                        vm.agreement.salesPersonId = null;



                    if (vm.agreement.pickupLocation != null)
                        vm.agreement.pickupLocationId = vm.agreement.pickupLocation.id;
                    else
                        vm.agreement.pickupLocationId = null;

                    if (vm.agreement.dropoffLocation != null)
                        vm.agreement.dropoffLocationId = vm.agreement.dropoffLocation.id;
                    else
                        vm.agreement.dropoffLocationId = null;

                    if (vm.projectName != null) {
                        vm.agreement.projectId = vm.projectName.id;
                        vm.agreement.project = null
                    }

                    if (!vm.agreement.customer.contactCategory == 2 && !vm.isSaleOrderEnabled) {
                        vm.agreement.saleOrderId = null;
                    }
                    if (vm.quotation) {
                        vm.agreement.quotationId = vm.quotation.id;
                    }
                    if (vm.agreement.saleOrigin) {
                        vm.agreement.saleOriginId = vm.agreement.saleOrigin.id;
                    }
                    /*if (vm.agreement.agreementGroup) {
                        vm.agreement.agreementGroupId = vm.agreement.agreementGroup.id;
                    }*/
                    vm.agreement.isBooking = false;
                    if (vm.agreement.agreementGroupId > 0) {

                    }
                    else {
                        vm.agreement.agreementGroupId = null;
                    }

                    if (vm.isEditMod) {
                        var currentEndDateTs = new Date(vm.agreement.endDate).getTime();
                        vm.isEndDateChanged = vm.originalEndDateTs !== currentEndDateTs;
                    }

                    // Update time part of end date
                    if (vm.agreement &&
                        vm.isEditMod &&
                        vm.isAdvanceInvoicingEnabled &&
                        vm.agreement.startDate &&
                        vm.agreement.endDate &&
                        vm.isEndDateChanged) {

                        var startUtc = moment.utc(vm.agreement.startDate);
                        var endUtc = moment.utc(vm.agreement.endDate);

                        // Combine endDate’s date + startDate’s time in UTC
                        var finalEndUtc = moment.utc({
                            year: endUtc.year(),
                            month: endUtc.month(),
                            date: endUtc.date(),
                            hour: startUtc.hour(),
                            minute: startUtc.minute(),
                            second: startUtc.second(),
                            millisecond: startUtc.millisecond()
                        });

                        vm.agreement.endDate = finalEndUtc.toISOString();

                        vm.endDateChangedByUser = false;
                        vm.isEndDateChanged = false;
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
                            }
                            else {
                                getDueService();
                            }
                            vm.saving = false;
                        }
                        else {
                            getDueService();
                        }
                    }
                    else {
                        agreementService.createOrUpdateAgreement({
                            agreement: vm.agreement,
                            advance: vm.advance,
                            deposit: vm.deposit,
                            discountAuthCodeId: vm.discountAuthCode == null ? null : vm.discountAuthCode.id,
                            authorizationCodeId: vm.authorizationCode == null ? null : vm.authorizationCode.id,
                            tariffCardId: vm.tariffCard
                        }).success(function (result) {
                            vm.agreement.id = result;

                            if (vm.isAdvanceInvoicingEnabled && !vm.isEditModForAdvanceInvoice) {
                                agreementService.advanceInvoiceOnCreation({
                                    agreement: vm.agreement
                                }).success(function (output) {
                                    abp.notify.info('Saved Successfully and Advance Invoice Created');
                                    if (vm.saveAndPrint)
                                        saveAndPrint(vm.agreement.id);
                                    $uibModalInstance.close(vm.agreement.id); // Close after invoice is done
                                }).finally(function () {
                                    vm.saving = false;
                                });
                            }
                            else {
                                if (!vm.saveAndPrint) {
                                    abp.notify.info(app.localize('SavedSuccessfully'));
                                }
                                if (vm.saveAndPrint)
                                    saveAndPrint(vm.agreement.id);
                                vm.saving = false;
                                $uibModalInstance.close(vm.agreement.id);
                            }
                        });
                    }

                }
                else {
                    abp.message.info(app.localize(errorMessage));
                    vm.saving = false;
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
                                createOrUpdateAgreement();
                            }

                        }
                    );
                }
                else {
                    createOrUpdateAgreement();
                }

            }

            function createOrUpdateAgreement() {
                vm.saving = true;
                agreementService.createOrUpdateAgreement({
                    agreement: vm.agreement,
                    advance: vm.advance,
                    deposit: vm.deposit,
                    discountAuthCodeId: vm.discountAuthCode == null ? null : vm.discountAuthCode.id,
                    authorizationCodeId: vm.authorizationCode == null ? null : vm.authorizationCode.id,
                    tariffCardId: vm.tariffCard
                }).success(function (result) {
                    if (!vm.saveAndPrint && !vm.isAdvanceInvoicingEnabled) {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                    }
                    if (vm.isAdvanceInvoicingEnabled && !vm.isEditModForAdvanceInvoice) {
                        vm.agreement.id = result;
                        agreementService.advanceInvoiceOnCreation({
                            agreement: vm.agreement
                        }).success(function (result) {
                            abp.notify.info('Saved Successfully and Advance Invoice Created');
                        })
                    }
                    vm.agreement.id = result;
                    if (vm.saveAndPrint)
                        saveAndPrint(vm.agreement.id);
                    $uibModalInstance.close(vm.agreement.id);
                }).finally(function () {
                    vm.saving = false;
                    vm.skipWatcher = false;
                });
            }

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            var saveAndPrint = function (id) {
                //window.open('/Report#/tenant/printModalAgreement/' + id);
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.agreements.printPreview as vmMain',
                    backdrop: 'static',
                    //windowClass: 'app-modal-window',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return id;
                        }
                    }
                });
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
                        vm.agreement.charges.push(
                            {
                                agreementId: null,
                                order: vm.chargesSettings[i].order,
                                chargesTypeId: vm.chargesSettings[i].chargesTypeId,
                                rateTypeId: vm.chargesSettings[i].rateTypeId,
                                discountPercent: 0,
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
                                //    { included: true, rate: 0, excessRate: 5, limit: 100 },
                                //    { included: false, rate: 30, excessRate: 4, limit: 250 },
                                //    { included: false, rate: 50, excessRate: 3, limit: 500 }

                                //]
                            }
                        );
                    }
                    //    }
                }
            }
            vm.unCheckAllCharges = function () {
                if (!vm.isSplit) {
                    for (var i = 0; i < vm.agreement.charges.length; i++) {
                        vm.agreement.charges[i].invoiceToDriver = false;
                    }
                }
                else if (vm.isSplit) {
                    for (var i = 0; i < vm.agreement.charges.length; i++) {
                        if (vm.automaticallySplitFollowingCharges) {
                            var setChargesAutomatically = vm.automaticallySplitFollowingCharges.some(e => e.id == vm.agreement.charges[i].chargesTypeId);
                            if (setChargesAutomatically) {
                                vm.agreement.charges[i].invoiceToDriver = true;
                            }
                        }

                    }
                }
            }

            //vm.changeSuperCDW = (chargesRow, tariffLine) => {
            //    $scope.$watchCollection('vm.agreement', function (newNames, oldNames) {
            //        if (chargesRow.chargesType.chargesCategory === 2) {
            //            ((tariffLine.included == chargesRow.included && tariffLine.rate == chargesRow.rate && tariffLine.excessRate == chargesRow.excessRate) && tariffLine.to === 0) ?
            //                chargesRow.chargesType.name = "SCDW" :
            //                chargesRow.chargesType.name = "CDW";
            //        }
            //    });
            //}

            vm.tariffOptionSelected = function (chargesRow, tariffLine) {
                chargesRow.included = tariffLine.included;
                chargesRow.rate = tariffLine.rate;
                chargesRow.excessRate = tariffLine.excessRate;
                chargesRow.limit = tariffLine.limit;

                //if (chargesRow.chargesType.chargesCategory === 2 && tariffLine.to !== 0) {
                //    chargesRow.chargesType.name = "CDW";
                //}
                //else if (chargesRow.chargesType.chargesCategory === 2 && tariffLine.to === 0) {
                //    chargesRow.chargesType.name = "SCDW";
                //}

                //vm.changeSuperCDW(chargesRow, tariffLine);
                vm.localizeChargesType(chargesRow, tariffLine);

            };

            vm.disableRate = function (chargesRow) {
                if (!Array.isArray(chargesRow.tariff) || chargesRow.tariff.length === 0) {
                    return false;
                }
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

            vm.calculate = function () {
                if (vm.agreement == null) return 0;

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

                //if ((vm.agreement.agreementType == 1 || vm.agreement.agreementType == 2) && !vm.advanceChanged && !vm.isEditMod) {
                //    vm.advance.amount = chargesCalculator.calculate(vm.agreement);
                //}
                //else if (vm.agreement.agreementType == 3) {
                //    vm.isReadOnlyAdvanceAmount = false;
                //}

                let calculatedValue = chargesCalculator.calculate(vm.agreement);
                setIsComplimentary();
                return calculatedValue;
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
                if (vm.advance.amount > 0) {
                    vm.showAdvancePopupOnSave = true;
                    vm.isBooking = false;
                }

                else
                    vm.showAdvancePopupOnSave = false;
            };

            vm.changeStatusDepositCreation = function () {
                if (vm.deposit.amount > 0)
                    vm.showDepositPopupOnSave = true;
                else
                    vm.showDepositPopupOnSave = false;
            };

            vm.totalDaysAndTime = function () {
                if (!vm.agreement ||
                    !vm.agreement.movements ||
                    !vm.agreement.movements.length ||
                    !vm.agreement.movements[0].outDetail ||
                    !vm.agreement.endDate) {
                    vm.isTotalDaysAndHrs = false;
                    return;
                }

                var startDate = moment(vm.agreement.movements[0].outDetail.dateTime);
                var endDate = moment(vm.agreement.endDate);

                if (startDate.isValid() && endDate.isValid()) {
                    vm.isTotalDaysAndHrs = true;

                    var totalHours = endDate.diff(startDate, 'hours', true);

                    vm.totalDays = Math.floor(totalHours / 24);

                    var remainingHours = totalHours - (vm.totalDays * 24);

                    if (remainingHours >= 23.9067) {
                        vm.totalDays += 1;
                        remainingHours = 0;
                    }

                    vm.remainingHrs = Math.round(remainingHours * 100) / 100;

                    vm.endDateChangedByUser = false;
                } else {
                    vm.isTotalDaysAndHrs = false;
                }
            };
            function getLocations() {


                lookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                }).finally(function () {

                });
            }

            vm.otherPickUpLocationChanged = function () {
                if (vm.otherPickUpLocation)
                    vm.agreement.locationId = null;
                else
                    vm.agreement.pickupLocation = null;
            };
            vm.otherDropoffLocationChanged = function () {
                if (vm.otherDropoffLocation)
                    vm.agreement.closingLocationId = null;
                else
                    vm.agreement.dropoffLocation = null;
            };


            vm.complimentaryOnChange = () => {
                if (vm.isComplimentary) {
                    vm.agreement.charges.forEach(c => {
                        if (c.chargesTypeId === 1) {
                            c.rate = 0;
                            vm.calculate();
                        }
                    });
                }
            }

            vm.rentOnChange = () => {
                vm.calculate();
            }

            function setIsComplimentary() {
                let isComplimentary = false;
                vm.agreement.charges.forEach(c => {
                    if (c.chargesTypeId === 1 && c.rate !== undefined && c.rate !== 0) {
                        isComplimentary = true;
                    }
                });
                const isManuallyChecked = vm.isComplimentary;
                if (isComplimentary) {
                    vm.isComplimentary = false;
                } else {
                    vm.isComplimentary = isManuallyChecked;
                }
            }




            //vm.otherPickUpLocationChanged = function () {
            //    if (vm.otherPickUpLocation) {


            //    }
            //    else
            //    {

            //        vm.agreement.pickupLocationId = null;

            //    }

            //};
            //vm.otherDropoffLocationChanged = function () {
            //    if (vm.otherDropoffLocation) {

            //        vm.agreement.closingLocationId = null;
            //    }
            //    else {

            //        vm.agreement.dropoffLocationId = null;
            //    }

            //};
            function allFuelLevels() {
                vm.allFuelLevels = utilities.allFuelLevels();
            };
            function getSalesPerson(agreement) {

                if (agreement)
                    if (agreement.customer && !agreement.salesPersonId)
                        if (agreement.customer.salesPersonId) {
                            staffService.getStaffForEdit({
                                id: agreement.customer.salesPersonId
                            }).success(function (result) {

                                vm.salesPerson = {
                                    name: result.name,
                                    id: result.id,
                                    code: result.code
                                };
                                if (vm.agreement.salesPersonId != null) {
                                    vm.agreement.salesPerson = vm.salesPerson;
                                    vm.agreement.salesPersonId = vm.salesPerson.id;
                                }
                                else {
                                    vm.agreement.salesPersonId = null;
                                }
                            }).finally(function () {
                                vm.loading = false;
                            });
                        }

            }
            vm.getAuthorizedUserName = function (userId) {
                commonLookupService.getUser({
                    id: userId
                }).success(function (result) {
                    vm.agreement.salesPerson = result.contact;
                    vm.agreement.salesPersonId = result.contactId;
                });
            };
            vm.amountChangedDeposit = function () {
                if (vm.deposit.amount == 0 || angular.isUndefined(vm.deposit.amount)) {
                    if (vm.autoCalculateAmountInWords == "true")
                        vm.deposit.amountInWords = '';
                    return;
                }
                if (vm.autoCalculateAmountInWords == "true")
                    vm.deposit.amountInWords = utilities.toWords(vm.deposit.amount);

            };
            function fixTariffCardRequiredValidation() {
                // Angular's default `required` validator treats null as empty.
                // But for us, "Default Tariff" (id: null) IS a valid, explicit selection —
                // only a genuinely untouched field (undefined) should fail validation.
                $timeout(function () {
                    if ($scope.createAgreementForm && $scope.createAgreementForm.tariffCard) {
                        $scope.createAgreementForm.tariffCard.$isEmpty = function (value) {
                            return angular.isUndefined(value);
                        };
                        // re-run validation with the corrected empty-check
                        $scope.createAgreementForm.tariffCard.$validate();
                    }
                });
            }
            function init() {
                vm.loading = true;
                vm.lockAdvance = false;
                getAgreementGroups();
                allFuelLevels();
                vm.branchTaxCode();
                if (vm.isMultiCurrencyEnabled) {
                    getCurrencies();
                    getAllCurrencies();
                }


                getLocations();
                vm.searchUsersWithDesignation();
                agreementService.getAgreementWithAdvanceAndDepositForEdit({
                    id: agreementId
                }).success(function (result) {
                    vm.isInitializingDates = true;
                    vm.agreement = result.agreement;

                    // Backup for enddate to compare while saving
                    vm.originalEndDateTs = vm.agreement.endDate
                        ? new Date(vm.agreement.endDate).getTime()
                        : null;

                    if (vm.isMultiCurrencyEnabled) {
                        if (vm.agreement.customer) {
                            if (vm.agreement.customer.currency) {
                                vm.currencyCode = vm.agreement.customer.currency.code;
                            }
                            else {
                                vm.currencyCode = vm.defaultCurrencyCode;
                            }
                        }

                    }
                    if (vm.isAutoSelectSalePersonEnable && vm.agreement.id <= 0) {
                        vm.getAuthorizedUserName(appSession.user.id);
                    }
                    if (vm.isAgreementGroups) {
                        if (!vm.agreement.id || vm.agreement.id < 0) {
                            agreementGroupService.getDefaultGroupId()
                                .success(id => {
                                    vm.agreement.agreementGroupId = id;
                                });
                        }
                    }

                    getSalesPerson(vm.agreement);

                    if (vm.agreement.id > 0 || vm.agreement.isBooking) {
                        vm.getOutStandingBalance();
                    }

                    if (vm.disableKMInOut) {
                        vm.agreement.movements[0].outDetail.km = 0;
                        vm.agreement.movements[0].outDetail.fuelLevel = 0;
                    }
                    vm.otherPickUpLocation = vm.agreement.pickupLocation != null ? true : false;
                    vm.otherDropoffLocation = vm.agreement.dropoffLocation != null ? true : false;
                    if (vm.agreement.customer)
                        getCustomerPicture(vm.agreement.customer.id);

                    if (vm.isMultiCurrencyEnabled && vm.agreement.customer) {
                        if (vm.agreement.customer.currency) {
                            vm.agreement.customer.currencyDto = vm.agreement.customer.currency;
                            vm.agreement.customer.currency = vm.agreement.customer.currency.code;
                        }

                    }
                    vm.tariffCard = vm.agreement.tariffCardId;
                    if (vm.agreement.tariffCardId) {
                        vm.getTariffCardForAgreement();
                    }
                    fixTariffCardRequiredValidation();
                    if (vm.agreement.vehicle != null) {
                        vm.agreement.movements[vm.agreement.movements.length - 1].outDetail.makeAndModel = vm.agreement.vehicle.make + ' ' + vm.agreement.vehicle.model.name;
                    }

                    if (vm.agreement.project != null)
                        vm.projectName = vm.agreement.project;

                    if (vm.agreement.charges.some(charges => charges.invoiceToDriver)) {
                        //vm.isSplit = true;
                    }
                    vm.advance = result.advance;
                    vm.advance.amount = vm.advance.amount - vm.advance.creditCardCommission;
                    if (vm.advance) {
                        if (vm.advance.amount > 0) {
                            vm.lockAdvance = true;
                        }
                    }
                    vm.deposit = result.deposit;
                    if (vm.depositPayble) {
                        vm.deposit.amount = vm.agreement.deposit;
                        vm.changeStatusDepositCreation();
                        vm.amountChangedDeposit();
                    }
                    if (vm.agreement.id > 0) {
                        vm.isEditModForAdvanceInvoice = true;
                    } else {
                        vm.isEditModForAdvanceInvoice = false;
                    }

                    if (vm.agreement.id > 0 || vm.agreement.bookingId > 0) {
                        vm.isEditMod = true;
                        vm.tariffGroupId = vm.agreement.tariffGroupId;
                        vm.tariffGroup = vm.agreement.tariffGroup;

                        vm.quotation = vm.agreement.quotation;
                        vm.agreementTaxPercent = vm.agreement.taxPercent;
                        if (vm.agreement.customer)
                            vm.disableTariffCard = vm.agreement.customer.tariffCardId != null;
                        if (vm.agreement.vehicle)
                            vm.searchOtherGroupsVehicle = vm.agreement.tariffGroupId != vm.agreement.vehicle.tariffGroupId;

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
                        if (vm.deposit.voucherSubTypeId != 11) // all types except
                        {
                            var td = moment(vm.deposit.toDate);
                            var duration = moment.duration(td.diff(vm.deposit.fromDate));
                            vm.deposit.holdForDays = utilities.round(duration.asDays(), 0);
                        }
                        //if (vm.agreement && vm.agreement.charges) {
                        //    var foundLines = $filter('filter')(vm.agreement.charges, {
                        //        chargesTypeId: 1
                        //    }, true);
                        //    
                        //    if (foundLines.length == 1) {
                        //        if (foundLines[0].discountPercent >0) {
                        //            foundLines[0].discountedRate = foundLines[0].rate - (foundLines[0].rate * (foundLines[0].discountPercent / 100));
                        //        }
                        //    }
                        //}

                        if (vm.agreement.customer.contactCategory == 1) {
                            vm.isIndividualCustomerRadio = true;
                        }
                        else if (vm.agreement.customer.contactCategory == 2) {
                            vm.isIndividualCustomerRadio = false;
                        }

                    } else {
                        vm.agreement.locationId = appSession.user.locationId;
                        vm.agreement.closingLocationId = appSession.user.locationId;
                        vm.agreement.agreementNo = null;
                        vm.isEditMod = false;
                        vm.agreement.driverType = 1;
                    }
                    loadChargesFromSettings();

                    vm.taxAccepted = vm.agreement.taxPercent > 0 ? true : false;
                    // vm.agreementTypeChange();
                    if (!vm.canChangeRates) {
                        if (vm.agreement.id > 0) {
                            if (vm.editLimitedRates) {
                                vm.isEditLimited = true;
                            }
                        }
                        if ((!vm.canChangeRates && vm.isEditMod) && !vm.isEditLimited) {
                            vm.editRate = true;
                        } else {
                            vm.editRate = false;
                        }
                    }
                    if (vm.updateFuelRateGloballyEnabled && vm.isSetFuelRateAutoOnAgreementCreationSettingEnabled && vm.agreement.id <= 0) {
                        vm.agreement.charges.forEach(ac => {
                            if (ac.chargesTypeId == 4) {
                                ac.rate = vm.fuelRateGlobally;

                            }
                        });
                    }

                }).finally(function () {
                    vm.loading = false;
                    fixTariffCardRequiredValidation();
                });
            }


            init();

        }
    ]);
