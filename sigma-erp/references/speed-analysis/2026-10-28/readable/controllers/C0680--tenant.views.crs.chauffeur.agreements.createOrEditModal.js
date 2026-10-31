// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:175750-176416
appModule.controller('tenant.views.crs.chauffeur.agreements.createOrEditModal', [
        '$scope', '$filter', 'utilities', '$uibModal', '$uibModalInstance', 'uiGridConstants', 'chargesCalculator', 'tariffHelper',
        'agreementId', 'abp.services.app.tariffGroup', 'abp.services.app.vehicle', 'abp.services.app.directory', 'abp.services.app.tariff', 'chargesSettings', '$rootScope', 'appSession', 'abp.services.app.tariffCard', 'abp.services.app.commonLookup', 'abp.services.app.chauffeurAgreement', 'abp.services.app.commonLookup',
        function ($scope, $filter, utilities, $uibModal, $uibModalInstance, uiGridConstants, chargesCalculator, tariffHelper, agreementId, tariffGroupService,
            vehicleService, directoryService, tariffService, chargesSettings, $rootScope, appSession, tariffCardService, lookupService, chauffeurAgreementService, commonLookup) {

            var vm = this;

            vm.canChangeRates = abp.auth.hasPermission('Pages.Tenant.Agreements.Edit.CanChangeRates');
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.isTaxOptional = utilities.parseBoolean(abp.setting.get("App.General.IsTaxOptional"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.manualAgreementNo = utilities.parseBoolean(abp.setting.get("App.General.ManualAgreementNo"));
            vm.isTaxCodeEnabled = abp.features.isEnabled("CRS.TaxCodes");
            vm.enableManualAgreementNo = utilities.parseBoolean(abp.setting.get("App.General.EnableManualAgreementNo"));
            vm.isSalesPersonRequired = utilities.parseBoolean(abp.setting.get("App.General.IsSalesPersonRequired"));
            vm.isWeeklyMonthlyEnabled = utilities.parseBoolean(abp.setting.get("App.General.WeeklyMonthlyRental"));
            vm.isTariffCardExplicitSelection = utilities.parseBoolean(abp.setting.get("App.General.TariffCardExplicitSelection"));
            vm.IsInsuranceCompanyAndClaimNoRequired = utilities.parseBoolean(abp.setting.get("App.General.IsInsuranceCompanyAndClaimNoRequired"));
            vm.isTariffCardEnable = abp.features.isEnabled("CRS.Tariff.TariffCards");
            vm.isDeliveryMovementEnable = abp.features.isEnabled("CRS.DeliveryAndCollectionMovements");
            vm.taxAccepted = false;
            vm.showAdvancePopupOnSave = false;
            vm.showDepositPopupOnSave = false;
            vm.saveAndPrint = false;
            vm.branchTaxPercentage = null;
            vm.loading = false;
            vm.tariffGroupId = null;
            vm.tariffGroup = null;
            vm.initTariffGroupId = null;
            vm.initTariffGroup = null;
            vm.searchOtherGroupsVehicle = false;
            vm.chargesSettings = chargesSettings;
            vm.isUserWiseDiscountEnable = abp.features.isEnabled("CRS.UserWiseDiscount");
            vm.isSaleOrderEnabled = abp.features.isEnabled("CRS.Vouchers.SaleOrders");
            vm.isAdvancePaymentRequired = utilities.parseBoolean(abp.setting.get("App.General.IsAdvancePaymentRequired"));
            vm.invoiceBasedOnAgreedRent = utilities.parseBoolean(abp.setting.get("App.General.InvoiceBasedOnAgreedRent"));
            vm.isReadOnlyAdvanceAmount = false;
            vm.vehicles = [];
            vm.customers = [];
            vm.drivers = [];
            var isValid = true;
            vm.discountCodeId = null;
            var errorMessage = {};
            var isTariffEnabled = abp.features.isEnabled("CRS.Tariff");
            vm.discountAuthCode = null;
            var agreementCategory = 4; //chauffeur
            vm.isTotalDaysAndHrs = false;
            vm.disableTariffCard = false;

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

            vm.tariffCards = [];
            vm.tariffCard = null;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.getDateTariffCard = function (row) {
                if (!row.fromDate)
                    return "";
                else
                    return '(' + vm.getlocalDateTime(row.fromDate) + " - " + vm.getlocalDateTime(row.toDate) + ')';
            };


            vm.getTariffCards = function () {
                vm.loading = true;
                tariffCardService.getTariffCardsPeriodWise({ fromDate: vm.agreement.movements[0].outDetail.dateTime, toDate: vm.agreement.endDate }).success(function (data) {
                    vm.tariffCards = data.items;
                    vm.tariffCards.unshift({ id: null, name: app.localize("DefaultTariff") });
                }).finally(function () {
                    vm.loading = false;
                });
            };

            //function allFuelLevels() {
            //vm.allFuelLevels = utilities.allFuelLevels();
            //};

            vm.localize = function (input) {
                return app.localize(input);
            };

            ////date change calls on loading data first time in edit mode. disable tariff loading if it is first time loading of editing mode
            //var startDateLoaded = false;
            vm.startDateChanged = function () {
                if (abp.auth.hasPermission('Pages.Tenant.TariffCards')) {
                    vm.getTariffCards();
                }
                //don't apply tariff in edit mode
                if (isTariffEnabled && !vm.isEditMod)
                    tariffHelper.applyTariff(vm.agreement);


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

            vm.agreementTypeSelected = function () {

                //convert time based rates to corresponding rate type based on selected agreement type
                for (var i = 0; i < vm.agreement.charges.length; i++) {
                    if (vm.agreement.charges[i].rateTypeId == 1 || vm.agreement.charges[i].rateTypeId == 2 || vm.agreement.charges[i].rateTypeId == 3) {
                        if (vm.agreement.agreementType == 2) {
                            vm.agreement.charges[i].rateTypeId = rateTypes.perWeek.id;
                            vm.agreement.charges[i].rateType = rateTypes.perWeek;
                        }
                        else if (vm.agreement.agreementType == 3) {
                            vm.agreement.charges[i].rateTypeId = rateTypes.perMonth.id;
                            vm.agreement.charges[i].rateType = rateTypes.perMonth;
                        } else {
                            vm.agreement.charges[i].rateTypeId = rateTypes.perDay.id;
                            vm.agreement.charges[i].rateType = rateTypes.perDay;
                        }
                    }
                }
                if (isTariffEnabled)
                    tariffHelper.applyTariff(vm.agreement);
            };

            var endDateLoaded = false;
            vm.endDateChanged = function () {

                if (isTariffEnabled && !vm.isEditMod)
                    tariffHelper.applyTariff(vm.agreement);
              
            };

            vm.searchCustomers = function ($select) {
                if (!$select.search) return;
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true, includeSalesPerson: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            vm.searchStaff = function ($select) {
                if (!$select.search) return;
                return directoryService.search({ keyword: $select.search, contactType: 1 }).then(function (response) {
                    vm.staffList = response.data.items;
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
                var modalInstance = openSearchContactModel(2, 1);

                modalInstance.result.then(function (result) {
                    if (result != null)
                        vm.agreement.driver = result;
                });
            };

            vm.driverChargesPopoup = function () {
                var modalInstance = openDriverChargesModel();
                modalInstance.result.then(function (result) {
                    if (result != null)
                        vm.agreement.charges = result;
                });
            };

            vm.customerSelected = function () {

                //if contact (i.e individual person)
                if (vm.agreement.customer.contactCategory == 1) {
                    vm.agreement.driver = vm.agreement.customer;
                    vm.driverSelected();
                    vm.isCompany = false;
                }
                if (vm.agreement.customer.contactCategory == 2) {
                    vm.isCompany = true;
                }
                if (vm.isEditMod && vm.agreementTaxPercent > 0) {
                    vm.agreement.taxPercent = vm.agreement.customer.isTaxExempted ? 0 : vm.agreementTaxPercent;
                    vm.agreement.isTaxExempted = vm.agreement.customer.isTaxExempted;
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
                vm.agreement.salesPerson = vm.agreement.customer.salesPerson;
                vm.agreement.salesPersonId = vm.agreement.customer.salesPerson != null ? vm.agreement.customer.salesPerson.id : null;

                vm.agreement.saleOrder = null;
                vm.agreement.saleOrderId = null;


                if (vm.agreement.customer.tariffCardId != null) {
                    var tariffCardsToCheck = vm.tariffCards.filter(row => row.id == vm.agreement.customer.tariffCardId);
                    if (tariffCardsToCheck.length > 0) {
                        vm.tariffCard = tariffCardsToCheck[0].id;
                        vm.disableTariffCard = true;
                        vm.applyTariff();
                    }
                }
                else {
                    vm.disableTariffCard = false;
                }
            };

            vm.branchTaxCode = function () {
                var userLocationId = appSession.user.locationId;
                if (userLocationId) {
                    commonLookup.getLocationById({ id: userLocationId })
                        .success(function (data) {
                            var userLocation = data;
                            if (userLocation.taxCode) {
                                vm.branchTaxPercentage = userLocation.taxCode.taxPercent;
                            }
                        })
                }
            }

            vm.driverSelected = function () {
                if (isTariffEnabled && !vm.isEditMod)
                    tariffHelper.applyTariff(vm.agreement);
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

            // Validating CreateOrUpdateAgreement 
            function validate() {
                errorMessage = '';
                errorMessage = 'Agreement Can Not Be Saved Due To Following Issues: \n';
                if (isValid == false) {
                    isValid = true;
                }
                if (vm.agreement.movements[0].outDetail.dateTime > moment().endOf('day')) {
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
                if (vm.agreement.customer.contactCategory != 2) {
                    vm.agreement.charges.forEach(function (value) {
                        value.invoiceToDriver = false;
                    });
                }
                vm.advanceChanged = true;
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
                            vm.advanceChanged = true;
                            if (vm.deposit.voucherSubTypeId != 11) // all types except pre authoriation
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

                if (isValid) {
                    //update ids for selected records
                    //vm.agreement.vehicleId = vm.agreement.vehicle.id;
                    vm.agreement.customerId = vm.agreement.customer.id;
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

                    if (!vm.agreement.customer.contactCategory == 2 && !vm.isSaleOrderEnabled) {
                        vm.agreement.saleOrderId = null;
                    }
                    chauffeurAgreementService.createOrUpdateAgreement({
                        agreement: vm.agreement,
                        advance: vm.advance,
                        deposit: vm.deposit,
                        discountAuthCodeId: vm.discountAuthCode == null ? null : vm.discountAuthCode.id,
                        tariffCardId: vm.tariffCard
                    }).success(function (result) {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        vm.agreement.id = result;
                        if (vm.saveAndPrint)
                            saveAndPrint(vm.agreement.id);
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
                else {
                    abp.message.info(app.localize(errorMessage));
                    vm.saving = false;
                }
            }

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            var saveAndPrint = function (id) {
                window.open('/Report#/tenant/printModalAgreement/' + id);
            };
            function loadChargesFromSettings() {

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

                            }
                        );
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

            vm.applyTariff = function () {
                vm.loading = true;
                //load and apply tariff
                tariffHelper.loadTariff(vm.initTariffGroupId, agreementCategory, function () { //vm.tariffGroupId, agreementCategory, function () {
                    tariffHelper.applyTariff(vm.agreement);
                }, vm.tariffCard);
                vm.loading = false;
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

            vm.totalDaysAndTime = function () {
                var startDate = moment(vm.agreement.movements[0].outDetail.dateTime, "DD/MM/YYYY hh:mm");
                var endDate = moment(vm.agreement.endDate, "DD/MM/YYYY hh:mm");

                if (startDate.isValid() && endDate.isValid()) {
                    vm.isTotalDaysAndHrs = true;
                    var duration = moment.duration(moment(endDate.format("LLLL")).diff(moment(startDate.format("LLLL"))));
                    // vm.totalDays = duration.days();
                    vm.totalDays = moment(endDate.format("LLLL")).diff(moment(startDate.format("LLLL")), 'days');
                    vm.remainingHrs = utilities.round(duration.hours() + (duration.minutes() / 60), 2);

                }
                else {
                    vm.isTotalDaysAndHrs = false;
                }
            };


            function getTariffGroup() {
                vm.loading = true;
                tariffGroupService.getTariffGroupForChauffeur().success(function (data) {
                    vm.initTariffGroup = data;
                    vm.initTariffGroupId = data.id;
                }).finally(function () {
                    init();
                });
            };

            function init() {
                vm.loading = true;
                vm.branchTaxCode();
                //allFuelLevels();
                chauffeurAgreementService.getChauffeurAgreementForEdit({
                    id: agreementId
                }).success(function (result) {
                    vm.agreement = result.agreement;
                    vm.tariffCard = vm.agreement.tariffCardId;
                    if (vm.agreement.vehicle != null) {
                        vm.agreement.movements[vm.agreement.movements.length - 1].outDetail.makeAndModel = vm.agreement.vehicle.make + ' ' + vm.agreement.vehicle.model.name;
                    }
                    vm.advance = result.advance;
                    vm.deposit = result.deposit;

                    if (vm.agreement.id > 0 || vm.agreement.bookingId > 0) {
                        vm.isEditMod = true;
                        vm.tariffGroupId = vm.agreement.tariffGroupId;
                        vm.tariffGroup = vm.agreement.tariffGroup;
                        vm.agreementTaxPercent = vm.agreement.taxPercent;

                        if (vm.agreement.vehicle)
                            vm.searchOtherGroupsVehicle = vm.agreement.tariffGroupId != vm.agreement.vehicle.tariffGroupId;

                        if (vm.agreement.customer)
                            vm.disableTariffCard = vm.agreement.customer.tariffCardId != null;


                        //calculate hold for days using fromdate and todate if cash or check deposit
                        if (vm.deposit.voucherSubTypeId != 11) // all types except
                        {
                            var td = moment(vm.deposit.toDate);
                            var duration = moment.duration(td.diff(vm.deposit.fromDate));
                            vm.deposit.holdForDays = utilities.round(duration.asDays(), 0);
                        }


                    } else {
                        vm.agreement.agreementNo = null;
                        vm.isEditMod = false;
                    }

                    loadChargesFromSettings();

                    vm.taxAccepted = vm.agreement.taxPercent > 0 ? true : false;


                    if (!vm.isEditMod) {
                        tariffHelper.loadTariff(vm.initTariffGroupId, agreementCategory, function () { //(groupId, agreementCategory, function () {
                            //  tariffHelper.applyTariff(vm.agreement);
                        }, vm.tariffCard);
                    }
                    console.log(vm.agreement);
                }).finally(function () {
                    vm.loading = false;
                });
            }

            // init();
            getTariffGroup();

        }
    ]);
