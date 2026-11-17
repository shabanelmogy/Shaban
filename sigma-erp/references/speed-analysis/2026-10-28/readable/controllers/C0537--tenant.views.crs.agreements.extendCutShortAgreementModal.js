// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:141636-142385
appModule.controller('tenant.views.crs.agreements.extendCutShortAgreementModal', [
        '$scope', '$filter', 'utilities', '$uibModal', '$uibModalInstance', 'uiGridConstants', 'chargesCalculator', 'tariffHelper', 'abp.services.app.agreement', 'options', 'abp.services.app.vehicle', 'abp.services.app.directory', 'abp.services.app.tariff', '$rootScope', 'appSession',
        function ($scope, $filter, utilities, $uibModal, $uibModalInstance, uiGridConstants, chargesCalculator, tariffHelper, agreementService, options, vehicleService, directoryService, tariffService, $rootScope, appSession) {

            var vm = this;

            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.isTaxOptional = utilities.parseBoolean(abp.setting.get("App.General.IsTaxOptional"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.isEditLimited = false;
            vm.editLimitedRates = abp.auth.hasPermission('Pages.Tenant.Agreements.Edit.EditLimitedRates');
            vm.canChangeRates = abp.auth.hasPermission('Pages.Tenant.Agreements.Edit.CanChangeRates');
            vm.manualAgreementNo = utilities.parseBoolean(abp.setting.get("App.General.ManualAgreementNo"));
            vm.enableManualAgreementNo = utilities.parseBoolean(abp.setting.get("App.General.EnableManualAgreementNo"));
            vm.isWeeklyMonthlyEnabled = utilities.parseBoolean(abp.setting.get("App.General.WeeklyMonthlyRental"));
            vm.taxAccepted = false;
            vm.isAdvanceInvoicingEnabled = abp.features.isEnabled("CRS.CustomFeatures.AdvanceInvoicingOnAgreementCreationAndExtension");
            vm.showAdvancePopupOnSave = false;
            vm.showDepositPopupOnSave = false;
            vm.saveAndPrint = false;
            vm.loading = false;
            vm.chargesSettings = options.chargesSettings;
            vm.isUserWiseDiscountEnable = abp.features.isEnabled("CRS.UserWiseDiscount");
            vm.isDepositsEnable = abp.features.isEnabled("CRS.Vouchers.Deposits");
            vm.action = options.action;
            vm.alerts = abp.auth.hasPermission('Pages.Tenant.Vehicles.Alerts');
            //vm.userMaxdiscountPercent = appSession.user.maxDiscountPercent > 0 ? true : false;
            vm.vehicles = [];
            vm.customers = [];
            vm.drivers = [];
            var isValid = true;
            vm.discountCodeId = null;
            var errorMessage = {};
            var isTariffEnabled = abp.features.isEnabled("CRS.Tariff");
            vm.discountAuthCode = null;
            vm.tariffCards = [];
            vm.tariffCard = null;
            vm.extendCutShort = abp.auth.hasPermission('Pages.Tenant.Agreements.ExtendCutShort'),
                //  vm.extendCutShort = true;
                vm.isTotalDaysAndHrs = false;
            vm.agreementTypeDisableCheck = function (item) {
                if (vm.agreement) {
                    if (item.id < vm.agreementType && vm.action == 1)
                        return false;
                    else if (item.id > vm.agreementType && vm.action == 2)
                        return false;

                }
                return true;
            };
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

            function allFuelLevels() {
                vm.allFuelLevels = utilities.allFuelLevels();
            };
            vm.localize = function (input) {
                return app.localize(input);
            };

            //////date change calls on loading data first time in edit mode. disable tariff loading if it is first time loading of editing mode
            ////var startDateLoaded = false;
            //vm.startDateChanged = function () {
            //    //don't apply tariff in edit mode
            //    if (isTariffEnabled && !vm.isEditMod)
            //        tariffHelper.applyTariff(vm.agreement);

            //    //apply tariff in edit mode if startDate & endDate initialized on first time load and tariff is enabled
            //    //if ((vm.isEditMod && startDateLoaded && endDateLoaded) || !vm.isEditMod) {
            //    //    if (isTariffEnabled) 
            //    //        tariffHelper.applyTariff(vm.agreement);
            //    //}
            //    //else
            //    //    startDateLoaded = true;
            //};

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

                tariffHelper.loadTariff(vm.agreement.vehicle.tariffGroupId, 1, function () {
                    tariffHelper.applyTariff(vm.agreement);
                }, vm.tariffCard);
                //if (isTariffEnabled)
                //    tariffHelper.applyTariff(vm.agreement);
            };

            ////var endDateLoaded = false;
            //vm.endDateChanged = function () {
            //    if (isTariffEnabled && !vm.isEditMod)
            //        tariffHelper.applyTariff(vm.agreement);

            //    //if ((vm.isEditMod && startDateLoaded && endDateLoaded) || !vm.isEditMod) {
            //    //    if (isTariffEnabled)
            //    //        tariffHelper.applyTariff(vm.agreement);
            //    //}
            //    //else
            //    //    endDateLoaded = true;
            //};

            vm.searchVehicles = function ($select) {
                if ($select.search == "") { vm.vehicles = null; return null; }
                return vehicleService.searchVehicles({ plateNo: $select.search, statusId: 'IDL', subStatus: 1, source: 'openagreement' }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };

            vm.searchCustomers = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2 }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            vm.searchStaff = function ($select) {
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
            vm.updateMileage = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/updateMileageAlertModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.updateMileageAlertModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        mileageAlert: function () {
                            return {
                                id: vm.agreement.vehicle.id,
                                plateNo: vm.agreement.vehicle.plateNo,
                                kms: vm.agreement.vehicle.kMs
                            };
                        }
                    }
                });
                modalInstance.result.then(function (updatedKms) {
                    vm.agreement.vehicle.kMs = updatedKms;
                    //init();
                });

            };
            vm.searchDrivers = function ($select) {
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

            vm.searchAdditionalDrivers = function ($select) {
                //whereas contactCategory: 1 (person). contactType: 2 (customer) get individual customers/drivers
                return directoryService.search({ keyword: $select.search, contactCategory: 1, contactType: 2 }).then(function (response) {
                    vm.additionaldrivers = response.data.items;
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
                var groupId = vm.agreement.vehicle.tariffGroupId;
                if (groupId == null) groupId = -1;

                if (isTariffEnabled && !vm.isEditMod) {
                    //load and apply tariff
                    tariffHelper.loadTariff(groupId, function () {
                        tariffHelper.applyTariff(vm.agreement);
                    });
                }
            };

            vm.customerSelected = function () {
                //if contact (i.e individual person)
                if (vm.agreement.customer.contactCategory == 1) {
                    vm.agreement.driver = vm.agreement.customer;
                    vm.driverSelected();
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
                vm.agreement.salesPersonId = vm.agreement.customer.salesPerson.id;
            };

            vm.driverSelected = function () {
                if (isTariffEnabled && !vm.isEditMod)
                    tariffHelper.applyTariff(vm.agreement);
            };

            vm.additionalDriverSelected = function () {
                if (isTariffEnabled && !vm.isEditMod)
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
                                tariffGroup: null,
                                statusId: 'IDL',
                                subStatus: 1,
                                source: 'openagreement',
                                selectable: true
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
                errorMessage = 'Agreement Can Not Be Saved Due To Following Issue(s): \n';
                if (isValid == false) {
                    isValid = true;
                }
                if (vm.agreement.endDate != null) {
                    if (moment(vm.agreement.movements[0].outDetail.dateTime) > moment(vm.agreement.endDate)) {
                        isValid = false;
                        errorMessage = errorMessage + '\n Return Date can not  less than Out Date ';
                    }
                }
                if (vm.agreement.endDate == null || vm.agreement.endDate == false) {
                    isValid = false;
                    errorMessage = errorMessage + '\n Return Date Required! ';
                }

            }

            vm.save = function () {
                save();
            };

            function save() {
                vm.saving = true;
                validate();
                if (isValid) {

                    if (vm.agreement &&
                        vm.isAdvanceInvoicingEnabled &&
                        vm.agreement.movements &&
                        vm.agreement.movements.length &&
                        vm.agreement.movements[0].outDetail &&
                        vm.agreement.endDate) {

                        // Start date local
                        var startDateLocal = moment(vm.agreement.movements[0].outDetail.dateTime).local();

                        var endDateLocal = moment(vm.agreement.endDate);

                        endDateLocal.hour(startDateLocal.hour());
                        endDateLocal.minute(startDateLocal.minute());
                        endDateLocal.second(startDateLocal.second());
                        endDateLocal.millisecond(startDateLocal.millisecond());

                        vm.agreement.endDate = endDateLocal.utc().toDate();
                    }

                    //update ids for selected records
                    agreementService.extendCutShortAgreement({
                        agreement: vm.agreement,
                        action: vm.action,
                        discountAuthCodeId: vm.discountAuthCode == null ? null : vm.discountAuthCode.id
                    }).success(function (result) {

                        vm.agreement.id = result;

                        if (vm.isAdvanceInvoicingEnabled) {
                            agreementService.advanceInvoiceOnCreation({
                                agreement: vm.agreement
                            }).success(function (output) {
                                abp.notify.info('Saved Successfully and Invoice Created');

                                if (vm.saveAndPrint)
                                    saveAndPrint(vm.agreement.id);

                                vm.saving = false;
                                $uibModalInstance.close();
                            }).error(function () {
                                vm.saving = false;
                            });
                        } else {
                            abp.notify.info(app.localize('SavedSuccessfully'));

                            if (vm.saveAndPrint)
                                saveAndPrint(vm.agreement.id);

                            vm.saving = false;
                            $uibModalInstance.close();
                        }

                    }).error(function () {
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

            vm.tariffOptionSelected = function (chargesRow, tariffLine) {
                chargesRow.included = tariffLine.included;
                chargesRow.rate = tariffLine.rate;
                chargesRow.excessRate = tariffLine.excessRate;
                chargesRow.limit = tariffLine.limit;
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
            vm.calculate = function () {
                if (vm.agreement && vm.agreement.charges) {
                    var foundLines = $filter('filter')(vm.agreement.charges, {
                        chargesTypeId: 1
                    }, true);
                    if (foundLines.length == 1) {
                        if (foundLines[0].discountPercent > 0) {
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
                if (!vm.agreement ||
                    !vm.agreement.movements ||
                    !vm.agreement.movements.length ||
                    !vm.agreement.movements[0].outDetail ||
                    !vm.agreement.endDate) {
                    vm.isTotalDaysAndHrs = false;
                    return;
                }

                var startDate = moment(vm.agreement.movements[0].outDetail.dateTime).local();
                var endDate = moment(vm.agreement.endDate).local();

                if (startDate.isValid() && endDate.isValid()) {
                    vm.isTotalDaysAndHrs = true;

                    var totalHours = endDate.diff(startDate, 'hours', true);

                    //if (vm.endDateChangedByUser) {
                    //    var localTimeZoneOffset = moment().utcOffset();  // in minutes

                    //    var localTimeZoneOffsetInHours = localTimeZoneOffset / 60;

                    //    totalHours += localTimeZoneOffsetInHours;
                    //}

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

            vm.updateEndDateTimeWithStartDate = function () {
                if (!vm.agreement ||
                    !vm.agreement.movements ||
                    !vm.agreement.movements.length ||
                    !vm.agreement.movements[0].outDetail ||
                    !vm.agreement.endDate) return;

                var startMoment = moment(vm.agreement.movements[0].outDetail.dateTime).local();
                var endMoment = moment(vm.agreement.endDate).local();

                if (!startMoment.isValid() || !endMoment.isValid()) {
                    console.log("Invalid dates", {
                        start: vm.agreement.movements[0].outDetail.dateTime,
                        end: vm.agreement.endDate
                    });
                    return;
                }

                // Local date from selected end date
                var endDatePart = endMoment.format("DD/MM/YYYY");

                // Local time from start date
                var startTimePart = startMoment.format("HH:mm");

                var finalDateTimeString = endDatePart + " " + startTimePart;

                // This is the desired LOCAL display value
                var finalEndDate = moment(finalDateTimeString, "DD/MM/YYYY HH:mm", true);

                if (!finalEndDate.isValid()) {
                    console.log("Invalid finalEndDate:", finalDateTimeString);
                    return;
                }

                if (moment(vm.agreement.endDate).local().isSame(finalEndDate, "minute")) {
                    vm.totalDaysAndTime();
                    return;
                }

                vm.skipWatcher = true;

                // Important: assign UTC moment that represents the desired local time
                vm.agreement.endDate = finalEndDate.clone().utc();

                vm.skipWatcher = false;

                vm.totalDaysAndTime();
            };

            $scope.$watch('vm.agreement.endDate', function (newVal, oldVal) {
                if (!vm.isAdvanceInvoicingEnabled) {
                    return;
                }
                if (!oldVal || !newVal) return;

                if (moment(newVal).isSame(oldVal, 'minute')) return;

                vm.endDateChangedByUser = true;
                vm.updateEndDateTimeWithStartDate();
                if (isAdvanceInvoicingEnabled) {
                    if (moment(vm.agreement.endDate).isSame(vm.agreement.startDate, 'minute')) {
                        return;
                    }
                    else {

                    }
                }
            });


            function init() {
                vm.loading = true;
                allFuelLevels();
                agreementService.getAgreementWithAdvanceAndDepositForEdit({
                    id: options.agreementId
                }).success(function (result) {
                    vm.agreement = result.agreement;
                    vm.advance = result.advance;
                    vm.deposit = result.deposit;
                    vm.tariffCard = vm.agreement.tariffCardId;
                    vm.agreementType = vm.agreement.agreementType;
                    if (vm.agreement.id > 0) {
                        vm.isEditMod = true;
                        vm.agreementTaxPercent = vm.agreement.taxPercent;

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

                    } else {
                        vm.agreement.agreementNo = null;
                        vm.isEditMod = false;
                    }

                    loadChargesFromSettings();

                    vm.taxAccepted = vm.agreement.taxPercent > 0 ? true : false;
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

                    vm.totalDaysAndTime();
                    vm.endDateChangedByUser = false;
                    //if (vm.isAdvanceInvoicingEnabled) {
                    //    $scope.$watch('vm.agreement.endDate', function (newVal, oldVal) {
                    //        if (!oldVal || !newVal) return;

                    //        if (moment(newVal).isSame(oldVal, 'minute')) return;

                    //        vm.endDateChangedByUser = true;
                    //        vm.updateEndDateTimeWithStartDate();
                    //    });
                    //}


                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
