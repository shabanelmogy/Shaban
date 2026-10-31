// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:402471-402649
appModule.controller('tenant.views.ers.deliveries.viewModal', [
        'utilities', '$uibModalInstance', '$uibModal', 'abp.services.app.equipmentDeliverySearch', 'agreementId', '$filter', 'abp.services.app.designation', 'abp.services.app.synch',
        function (utilities, $uibModalInstance, $uibModal, equipmentDeliverySearchService, agreementId, $filter, designationService, synchAppService) {

            var vm = this;

            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.isTaxOptional = utilities.parseBoolean(abp.setting.get("App.General.IsTaxOptional"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.manualAgreementNo = utilities.parseBoolean(abp.setting.get("App.General.ManualAgreementNo"));
            vm.enableManualAgreementNo = utilities.parseBoolean(abp.setting.get("App.General.EnableManualAgreementNo"));
            vm.enableAdditionalNotes = utilities.parseBoolean(abp.setting.get("App.General.EnableAdditionalNotes"));
            vm.isWeeklyMonthlyEnabled = utilities.parseBoolean(abp.setting.get("App.General.WeeklyMonthlyRental"));
            vm.isUserWiseDiscountEnable = abp.features.isEnabled("CRS.UserWiseDiscount");
            vm.isTariffCardExplicitSelection = utilities.parseBoolean(abp.setting.get("App.General.TariffCardExplicitSelection"));
            vm.isTariffCardEnable = abp.features.isEnabled("CRS.Tariff.TariffCards");
            vm.isDeliveryMovementEnable = abp.features.isEnabled("CRS.DeliveryAndCollectionMovements");
            vm.IsInsuranceCompanyAndClaimNoRequired = utilities.parseBoolean(abp.setting.get("App.General.IsInsuranceCompanyAndClaimNoRequired"));
            vm.isSaleOrderEnabled = abp.features.isEnabled("CRS.Vouchers.SaleOrders");
            vm.isTotalDaysAndHrs = false;
            vm.invoiceBasedOnAgreedRent = utilities.parseBoolean(abp.setting.get("App.General.InvoiceBasedOnAgreedRent"));
            vm.isIndividualCustomerRadio = true;
            vm.loading = false;
            vm.locations = [];
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.getlocalDateTime = function (date) {
                if (date == null)
                    return "";

                var localTime = moment.utc(date).toDate();
                return moment(localTime).format(vm.dateTimeFormat);
            };

            vm.localize = function (input) {
                return app.localize(input);
            };

            vm.agreementTypes = [
                { type: "Daily", id: 1 },
                { type: "Weekly", id: 2 },
                { type: "Monthly", id: 3 },
                { type: "Lease", id: 4 },
                { type: "LeaseToOwn", id: 5 },
            ];

            vm.getAgreementStatus = function (id) {
                if (id == 1)
                    return vm.localize("Delivered");
                else if (id == 2)
                    return vm.localize("Closed");
                else if (id == 3)
                    return vm.localize("Cancelled");
                else if (id == 4)
                    return vm.localize("Approval1Pending");
                else if (id == 5)
                    return vm.localize("Approval2Pending");
                else if (id == 6)
                    return vm.localize("DeliveryPending");
                else
                    return vm.localize("NA");
            }
            var rateTypes = {
                perDay: { id: 1, name: '/Day' },
                perWeek: { id: 2, name: '/Week' },
                perMonth: { id: 3, name: '/Month' },
            };

            vm.getAgreementType = function (type) {
                if (type == 1) {
                    return app.localize("Daily");
                }
                else if (type == 2) {
                    return app.localize("Weekly");
                }
                else if (type == 3) {
                    return app.localize("Monthly");
                }
                else if (type == 4) {
                    return app.localize("Lease");
                }
                else if (type == 5) {
                    return app.localize("LeaseToOwn");
                }
            }


            function openCustomerViewModal(personId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/viewModel.cshtml',
                    controller: 'tenant.views.crs.contacts.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        personId: function () {
                            return personId;
                        },
                        isFromSearchScreen: function () {
                            return false;
                        }
                    }
                });
            }

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.totalDaysAndTime = function () {
                var startDate = moment(vm.agreement.movements[0].outDetail.dateTime);
                var endDate = moment(vm.agreement.movements[vm.agreement.movements.length - 1].inDetail.dateTime);

                vm.totalDays = moment(endDate.format("LLLL")).diff(moment(startDate.format("LLLL")), 'days');
                var totalHrs = moment(endDate.format("LLLL")).diff(moment(startDate.format("LLLL")), 'hours');
                vm.remainingHrs = totalHrs - (vm.totalDays * 24);

                var startDateForEndDate = moment(vm.agreement.movements[0].outDetail.dateTime);
                var endDateForEndDate = moment(vm.agreement.endDate);

                vm.totalDaysForEndDate = moment(endDateForEndDate.format("LLLL")).diff(moment(startDateForEndDate.format("LLLL")), 'days');
                var totalHrsForEndDate = moment(endDateForEndDate.format("LLLL")).diff(moment(startDateForEndDate.format("LLLL")), 'hours');
                vm.remainingHrsForEndDate = totalHrsForEndDate - (vm.totalDaysForEndDate * 24);
            };

            function designationDetails() {
                designationService.getDesignations().success(function (result) {
                    vm.operators = result.items;
                });
            };
            function getAllChecklistItems() {
                vm.loading = true;
                synchAppService.getAllCheckListItems()
                    .success(function (result) {
                        vm.checklistItems = result;
                        vm.checklistItems.forEach(e => {
                            vm.agreement.movements[0].outCheckList.forEach(a => {
                                if (e.id == a.id) {
                                e.isSelected = true;
                                }
                            });
                        });
                    }).finally(function () { vm.loading = false; });
            }

            function init() {
                vm.loading = true;

                equipmentDeliverySearchService.getEquipmentRentalAgreementForView({
                    id: agreementId
                }).success(function (result) {
                    vm.agreement = result;
                    vm.agreement.vehicle.makeAndModel = vm.agreement.vehicle.make + ' ' + vm.agreement.vehicle.model;
                    //vm.agreement.agreementType = 1;

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

                    var mobilizationRow = vm.agreement.charges.filter(e => e.chargesTypeId == 26)[0];
                    vm.includeMobilization = mobilizationRow.accepted;

                    getAllChecklistItems();
                }).finally(function () {
                    vm.loading = false;
                });
            }

            designationDetails();
            init();
        }
    ]);
