// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:400018-400224
appModule.controller('tenant.views.ers.deliveries.closeEquipmentAgreementModal', [
        '$scope', 'utilities', '$uibModalInstance', '$uibModal', 'equipmentChargesCalculator', 'abp.services.app.equipmentDelivery',
        'abp.services.app.equipmentDeliverySearch', 'agreementId', 'abp.services.app.commonLookup',
        'appSession', 'abp.services.app.designation',
        function ($scope, utilities, $uibModalInstance, $uibModal, equipmentChargesCalculator, equipmentDeliveryService, equipmentDeliverySearch,
            agreementId, commonLookupService, appSession, designationService) {

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
            vm.isUserWiseDiscountEnable = abp.features.isEnabled("CRS.UserWiseDiscount");
            vm.editDiscountwhileAgreementClosing = utilities.parseBoolean(abp.setting.get("App.General.EditDiscountwhileAgreementClosing"));
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
                { type: app.localize("Daily"), id: 1 },
                { type: "Weekly", id: 2 },
                { type: "Monthly", id: 3 },
                { type: "Lease", id: 4 },
                { type: "LeaseToOwn", id: 5 }
            ];
            vm.getAgreementType = function (type) {
                if (type == 1)
                    return "Daily";
                else if (type == 1)
                    return "Weekly";
                else if (type == 1)
                    return "Monthly";
            };



            vm.includedChanged = function (chargesRow) {
                if (chargesRow.included)
                    chargesRow.rate = 0;
                vm.calculate();
            };
            
            var endDateLoaded = false;
            vm.endDateChanged = function () {

                if (!endDateLoaded) {
                    endDateLoaded = true;
                    return;
                }
                if (agreement.customer != null) {
                    if (agreement.customer.contactCategory == 2)
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

                if (endDateLoaded)
                    vm.calculate();
                else
                    endDateLoaded = true;
            };


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

            vm.save = function () {
                validate();
                vm.saving = true;
                if (isValid) {
                    //if only one location then location input will not be visible on form. set location for movement in detail.
                    if (vm.locations.length == 1)
                        vm.agreement.movements[vm.agreement.movements.length - 1].inDetail_LocationId = vm.locations[0].id;

                    vm.agreement.movements[0].inDetail.dateTime = moment(vm.agreement.movements[0].inDetail.dateTime).endOf('day').add(-3,'ms');
                    vm.agreement.operator1Supplier = null;
                    vm.agreement.operator2Supplier = null;
                    equipmentDeliveryService.closeEquipmentAgreement({
                        agreement: vm.agreement,
                        includeDemobilization: vm.includeDemobilization
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

                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });

                equipmentDeliverySearch.getEquipmentAgreementForClosing({
                    id: agreementId
                }).success(function (result) {
                    vm.agreement = result;
                    vm.originalAgreementType = vm.agreement.agreementType;
                    if (vm.agreement.movements[vm.agreement.movements.length - 1].inDetail.dateTime != null && vm.agreement.movements[vm.agreement.movements.length - 1].inDetail.fuelLevel != null && vm.agreement.movements[vm.agreement.movements.length - 1].inDetail.km != null)
                        vm.calculate();
                    if (!vm.actionsOnOtherBranch)
                        vm.agreement.movements[vm.agreement.movements.length - 1].inDetail_LocationId = appSession.user.locationId;
                    //set return date (which was set at time of opening) as date in by default
                    vm.agreement.movements[vm.agreement.movements.length - 1].inDetail.dateTime = moment().utc();
                    if (vm.originalAgreementType == 3)
                        endDateLoaded = true;
                    vm.taxAccepted = vm.agreement.taxPercent > 0 ? true : false;

                }).finally(function () {
                    vm.loading = false;
                });

            }

            designationDetails();
            init();
        }
    ]);
