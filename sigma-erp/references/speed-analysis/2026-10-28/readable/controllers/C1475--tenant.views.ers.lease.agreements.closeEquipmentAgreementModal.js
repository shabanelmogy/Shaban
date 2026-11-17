// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:402686-402998
appModule.controller('tenant.views.ers.lease.agreements.closeEquipmentAgreementModal', [
        '$scope', 'utilities', '$uibModalInstance', '$uibModal', 'equipmentChargesCalculator', 'abp.services.app.equipmentLeaseAgreement',
        'abp.services.app.equipmentLeaseAgreementSearch', 'agreementId', 'abp.services.app.commonLookup',
        'appSession', 'tariffHelper', '$interval', 'abp.services.app.trafficFile',
        'chromeExtDownloader', 'abp.services.app.designation',
        function ($scope, utilities, $uibModalInstance, $uibModal, equipmentChargesCalculator, equipmentLeaseAgreementService, equipmentLeaseAgreementSearchService,
            agreementId, commonLookupService, appSession, tariffHelper, $interval,
            trafficFileService, chromeExtDownloader, designationService) {

            var vm = this;

            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.isTaxOptional = utilities.parseBoolean(abp.setting.get("App.General.IsTaxOptional"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.manualAgreementNo = utilities.parseBoolean(abp.setting.get("App.General.ManualAgreementNo"));
            vm.isWeeklyMonthlyEnabled = utilities.parseBoolean(abp.setting.get("App.General.WeeklyMonthlyRental"));
            var isTariffEnabled = abp.features.isEnabled("CRS.Tariff");

            vm.dailyRateFromDays = parseInt(abp.setting.get("App.General.MonthlyRentDailyRateFromDays"));
            vm.dailyRateToDays = parseInt(abp.setting.get("App.General.MonthlyRentDailyRateToDays"));
            vm.weeklyRateFromDays = parseInt(abp.setting.get("App.General.MonthlyRentWeeklyRateFromDays"));
            vm.weeklyRateToDays = parseInt(abp.setting.get("App.General.MonthlyRentWeeklyRateToDays"));
            vm.isUserWiseDiscountEnable = abp.features.isEnabled("CRS.UserWiseDiscount");
            vm.editDiscountwhileAgreementClosing = utilities.parseBoolean(abp.setting.get("App.General.EditDiscountwhileAgreementClosing"));
            var gracePeriod = parseInt(abp.setting.get("App.General.RentalGracePeriodInMinutes"));

            vm.taxAccepted = false;
            vm.actionsOnOtherBranch = abp.auth.hasPermission('Pages.Tenant.Agreements.AllActionsOnOtherBranchAgreements') || abp.auth.hasPermission('Pages.Tenant.Agreements.ViewOtherBranchAgreements');
            vm.loading = false;
            vm.locations = [];
            vm.agreement = null;
            vm.originalAgreement = null;

            function allFuelLevels() {
                vm.allFuelLevels = utilities.allFuelLevels();
            };
            var isValid = true;
            var errorMessage = {};

            vm.localize = function (input) {
                return app.localize(input);
            };

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';


            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.agreementTypes = [
                { type: app.localize("Lease"), id: 4 },
                { type: app.localize("LeaseToOwn"), id: 5 }
            ];

            vm.getAgreementType = function (type) {
                if (type == 1)
                    return "Daily";
                else if (type == 1)
                    return "Weekly";
                else if (type == 1)
                    return "Monthly";
            };

            var rateTypes = {
                perDay: { id: 1, name: '/Day' },
                perWeek: { id: 2, name: '/Week' },
                perMonth: { id: 3, name: '/Month' },
            };

            vm.tariffOptionSelected = function (chargesRow, tariffLine) {
                chargesRow.included = tariffLine.included;
                chargesRow.rate = tariffLine.rate;
                chargesRow.excessRate = tariffLine.excessRate;
                chargesRow.limit = tariffLine.limit;
                vm.calculate();
            };

            vm.includedChanged = function (chargesRow) {
                if (chargesRow.included)
                    chargesRow.rate = 0;
                vm.calculate();
            };

            vm.firebaseSalikResponse = {};
            vm.traffFilesDownloadingRes = [];
            vm.downloadedFiles = 0;

            vm.getFuelLevel = function (value) {
                return utilities.getFuelLevel(value);
            };
            var endDateLoaded = false;
            vm.endDateChanged = function () {
                if (agreement.customer != null) {
                    if (agreement.customer.contactCategory == 2)
                    gracePeriod = parseInt(abp.setting.get("App.General.RentalGracePeriodInMinutesForCompany"));
                    else
                        gracePeriod = parseInt(abp.setting.get("App.General.RentalGracePeriodInMinutes"));
                }
                if (!endDateLoaded) {
                    endDateLoaded = true;
                    return;
                }
                var dateOut = utilities.jsonUtcDateToLocalMoment(vm.agreement.movements[0].outDetail.dateTime);
                var dateIn = moment(vm.agreement.movements[vm.agreement.movements.length - 1].inDetail.dateTime);
                var duration = moment.duration(dateIn.diff(dateOut));
                var hours = duration.asHours();
                var days = 0;


                days = Math.floor(hours / 24);
                if ((hours - days * 24) * 60 > gracePeriod) // if extra minutes are greater than grace period then calculate 1 day extra
                    days += 1;

                //if (vm.originalAgreementType == 3
                //    && isTariffEnabled &&
                //    (vm.dailyRateFromDays > 0 || vm.dailyRateToDays > 0
                //        || vm.weeklyRateFromDays > 0 || vm.weeklyRateToDays > 0)
                //    && vm.agreement.vehicle.tariffGroupId) {
                //    if (days >= vm.dailyRateFromDays && days <= vm.dailyRateToDays && days < 30) {
                //        vm.agreementCutShortType = 1;

                //        if (vm.originalAgreement == null)
                //            vm.originalAgreement = angular.copy(vm.agreement);

                //        tariffHelper.loadTariff(vm.agreement.vehicle.tariffGroupId, 1, function () {
                //            cutShortExtendApplyTariff();
                //        }, vm.agreement.tariffCardId);
                //    }
                //    else if (days >= vm.weeklyRateFromDays && days <= vm.weeklyRateToDays && days < 30) {
                //        vm.agreementCutShortType = 2;

                //        if (vm.originalAgreement == null)
                //            vm.originalAgreement = angular.copy(vm.agreement);

                //        tariffHelper.loadTariff(vm.agreement.vehicle.tariffGroupId, 1, function () {
                //            cutShortExtendApplyTariff();
                //        }, vm.agreement.tariffCardId);

                //    }
                //    else if (vm.agreement.agreementType != 3) {
                //        if (vm.originalAgreement != null) {
                //            var endDate = angular.copy(vm.agreement.movements[vm.agreement.movements.length - 1].inDetail.dateTime);
                //            var orignalAgreement = angular.copy(vm.originalAgreement);
                //            orignalAgreement.movements[vm.agreement.movements.length - 1].inDetail.dateTime = endDate;
                //            endDateLoaded = false;
                //            vm.agreement = orignalAgreement;
                //            vm.calculate();
                //            return;

                //        }

                //    }

                //}

                if (endDateLoaded)
                    vm.calculate();
                else
                    endDateLoaded = true;
            };

            function cutShortExtendApplyTariff() {

                var tariffLinesToQuery = tariffHelper.getTariffLines();
                if (tariffLinesToQuery.filter(x => x.chargesTypeId == 1
                    && x.rateTypeId == vm.agreementCutShortType).length > 0) {

                    vm.agreement.agreementType = vm.agreementCutShortType;

                    for (var i = 0; i < vm.agreement.charges.length; i++) {
                        if (vm.agreement.agreementType == 2) {
                            vm.agreement.charges[i].rateTypeId = rateTypes.perWeek.id;
                            vm.agreement.charges[i].rateType = rateTypes.perWeek;
                        }
                        else if (vm.agreement.agreementType == 1) {
                            vm.agreement.charges[i].rateTypeId = rateTypes.perDay.id;
                            vm.agreement.charges[i].rateType = rateTypes.perDay;
                        }
                    }

                }
                tariffHelper.applyTariff(vm.agreement);
                vm.calculate();
            }

            vm.calculate = function () {
                equipmentChargesCalculator.calculate(vm.agreement);
            };

            vm.sumCharges = function () {
                return equipmentChargesCalculator.sumCharges(vm.agreement);
            };

            vm.taxAcceptedChanged = function () {
                if (vm.taxAccepted)
                    vm.agreement.taxPercent = vm.taxPercent;
                else
                    vm.agreement.taxPercent = 0;
            };

            // validate
            function validate() {
                errorMessage = '';
                errorMessage = 'Agreement Can Not Be Saved Due To Following Issues: \n';
                if (isValid == false) {
                    isValid = true;
                }
                if (moment.utc(vm.agreement.movements[vm.agreement.movements.length - 1].outDetail.dateTime) > moment(vm.agreement.movements[vm.agreement.movements.length - 1].inDetail.dateTime)) {
                    isValid = false;
                    errorMessage = errorMessage + '\n In Date can not less than Out Date ';
                }

                if (vm.agreement.movements[vm.agreement.movements.length - 1].outDetail.km > vm.agreement.movements[vm.agreement.movements.length - 1].inDetail.km) {
                    isValid = false;
                    errorMessage = errorMessage + '\n ODO IN can not less than ODO OUT ';
                }
            }

            vm.openMileageInfoModal = function (mileageCharges) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/mileageChargesInfoModal.cshtml',
                    controller: 'tenant.views.crs.agreements.mileageChargesInfoModal as vm',
                    backdrop: 'static',
                    size: 'sm',
                    resolve: {
                        mileageCharges: function () {
                            return mileageCharges;
                        }
                    }
                });
            };

            vm.save = function () {
                validate();
                vm.saving = true;
                if (isValid) {
                    //if only one location then location input will not be visible on form. set location for movement in detail.
                    if (vm.locations.length == 1)
                        vm.agreement.movements[vm.agreement.movements.length - 1].inDetail_LocationId = vm.locations[0].id;

                    equipmentLeaseAgreementService.closeEquipmentAgreement({
                        agreement: vm.agreement
                    }).success(function () {
                        abp.notify.info(app.localize('SavedSuccessfullyInvoiceGenerated'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }
                else {
                    abp.message.info(app.localize(errorMessage));
                    vm.saving = false;
                }
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function designationDetails() {
                designationService.getDesignations().success(function (result) {
                    vm.operators = result.items;
                });
            };

            function init() {
                vm.loading = true;
                allFuelLevels();

                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });

                equipmentLeaseAgreementSearchService.getEquipmentAgreementForClosing({
                    id: agreementId
                }).success(function (result) {
                    vm.agreement = result;
                    vm.originalAgreementType = vm.agreement.agreementType;
                    if (vm.agreement.movements[vm.agreement.movements.length - 1].inDetail.dateTime != null && vm.agreement.movements[vm.agreement.movements.length - 1].inDetail.fuelLevel != null && vm.agreement.movements[vm.agreement.movements.length - 1].inDetail.km != null)
                        vm.calculate();
                    if (!vm.actionsOnOtherBranch)
                        vm.agreement.movements[vm.agreement.movements.length - 1].inDetail_LocationId = appSession.user.locationId;
                    //set return date (which was set at time of opening) as date in by default
                    // vm.agreement.movements[vm.agreement.movements.length - 1].inDetail.dateTime = vm.agreement.endDate;
                    vm.agreement.movements[vm.agreement.movements.length - 1].inDetail.dateTime = moment().utc();
                    if (vm.originalAgreementType == 3)
                        endDateLoaded = true;
                    vm.taxAccepted = vm.agreement.taxPercent > 0 ? true : false;

                }).finally(function () {
                    vm.loading = false;
                });

            }

            vm.sendCaptcha = function (row) {
                var event = new CustomEvent('sendCaptchaAndDownloadEvent', { detail: row.captchaTxt + ',' + row.trafficFile.fileId });
                event.initEvent('sendCaptchaAndDownloadEvent');
                document.dispatchEvent(event);
            };

            designationDetails();
            init();
        }
    ]);
