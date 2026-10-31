// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:116796-117002
appModule.controller('tenant.views.crs.accessories.agreements.closeAgreementModal', [
        '$scope', 'utilities', '$uibModalInstance', '$uibModal', 'uiGridConstants', 'chargesCalculator', 'abp.services.app.accessoriesAgreement', 'agreementId',
        'abp.services.app.commonLookup', 'appSession', 'abp.services.app.accessoriesAgreementSearch',
        function ($scope, utilities, $uibModalInstance, $uibModal, uiGridConstants, chargesCalculator, accessoriesAgreementService, agreementId, commonLookupService,
            appSession, accessoriesAgreementSearchService) {

            var vm = this;

            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.isTaxOptional = utilities.parseBoolean(abp.setting.get("App.General.IsTaxOptional"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.manualAgreementNo = utilities.parseBoolean(abp.setting.get("App.General.ManualAgreementNo"));
            vm.isWeeklyMonthlyEnabled = utilities.parseBoolean(abp.setting.get("App.General.WeeklyMonthlyRental"));

            vm.dailyRateFromDays = parseInt(abp.setting.get("App.General.MonthlyRentDailyRateFromDays"));
            vm.dailyRateToDays = parseInt(abp.setting.get("App.General.MonthlyRentDailyRateToDays"));
            vm.weeklyRateFromDays = parseInt(abp.setting.get("App.General.MonthlyRentWeeklyRateFromDays"));
            vm.weeklyRateToDays = parseInt(abp.setting.get("App.General.MonthlyRentWeeklyRateToDays"));
            var gracePeriod = parseInt(abp.setting.get("App.General.RentalGracePeriodInMinutes"));

            vm.taxAccepted = false;
            vm.actionsOnOtherBranch = abp.auth.hasPermission('Pages.Tenant.Agreements.AllActionsOnOtherBranchAgreements') || abp.auth.hasPermission('Pages.Tenant.Agreements.ViewOtherBranchAgreements');
            vm.loading = false;
            vm.locations = [];
            vm.agreement = null;            
            vm.originalAgreement = null;

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
                { type: "Daily", id: 1 },
                { type: "Weekly", id: 2 },
                { type: "Monthly", id: 3 }
            ];

            vm.getAgreementType = function (type) {
                if (type == 1)
                    return "Daily";
                else if (type == 2)
                    return "Weekly";
                else if (type == 3)
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

            var endDateLoaded = false;
            vm.endDateChanged = function () {
                if (!endDateLoaded) {
                    endDateLoaded = true;
                    return;
                }
                if (vm.agreement.customer != null) {
                    if (vm.agreement.customer.contactCategory == 2)
                    gracePeriod = parseInt(abp.setting.get("App.General.RentalGracePeriodInMinutesForCompany"));
                    else
                        gracePeriod = parseInt(abp.setting.get("App.General.RentalGracePeriodInMinutes"));
                }
                var dateOut = utilities.jsonUtcDateToLocalMoment(vm.agreement.movements[0].outDetail.dateTime);
                var dateIn = moment(vm.agreement.movements[vm.agreement.movements.length - 1].inDetail.dateTime);
                var duration = moment.duration(dateIn.diff(dateOut));
                var hours = duration.asHours();
                var days = 0;


                days = Math.floor(hours / 24);
                if ((hours - days * 24) * 60 > gracePeriod) // if extra minutes are greater than grace period then calculate 1 day extra
                    days += 1;
                // vm.agreement.endDate = vm.agreement.movements[vm.agreement.movements.length - 1].inDetail.dateTime;

                
                if (endDateLoaded)
                    vm.calculate();
                else
                    endDateLoaded = true;
                //vm.agreement.movements[vm.agreement.movements.length - 1].inDetail.dateTime
            };


            vm.calculate = function () {

                chargesCalculator.calculate(vm.agreement);
            };

            vm.sumCharges = function () {
                return chargesCalculator.sumCharges(vm.agreement);
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

            }


            vm.save = function () {
                validate();
                vm.saving = true;
                if (isValid) {
                    //if only one location then location input will not be visible on form. set location for movement in detail.
                    if (vm.locations.length == 1)
                        vm.agreement.movements[vm.agreement.movements.length - 1].inDetail_LocationId = vm.locations[0].id;

                    accessoriesAgreementService.closeAgreement({
                        agreement: vm.agreement,
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

            function init() {
                vm.loading = true;

                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });

                accessoriesAgreementSearchService.getAgreementForClosing({
                    id: agreementId
                }).success(function (result) {
                    vm.agreement = result;
                    vm.agreement.movements[vm.agreement.movements.length - 1].outDetail.fuelLevel = 0;
                    vm.agreement.movements[vm.agreement.movements.length - 1].outDetail.km = 0;
                    vm.agreement.movements[vm.agreement.movements.length - 1].inDetail.fuelLevel = 0;
                    vm.agreement.movements[vm.agreement.movements.length - 1].inDetail.km = 0;
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
                    vm.endDateChanged();

                }).finally(function () {
                    vm.loading = false;
                });

            }
            

            init();
        }
    ]);
