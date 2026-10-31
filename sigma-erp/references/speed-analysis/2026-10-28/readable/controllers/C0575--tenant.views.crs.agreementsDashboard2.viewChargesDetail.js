// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:157223-157611
appModule.controller('tenant.views.crs.agreementsDashboard2.viewChargesDetail', [
        'utilities', '$uibModalInstance', 'chargesCalculator', '$uibModal', 'abp.services.app.rentalAgreementSearch', 'abp.services.app.directory', 'abp.services.app.commonAgreement', 'agreementId', '$filter',
        function (utilities, $uibModalInstance, chargesCalculator, $uibModal, rentalAgreementSearchService, directoryService, commonAgreementService, agreementId, $filter) {

            var vm = this;
            vm.calculateAndShowAgreementChargesTillNow = utilities.parseBoolean(abp.setting.get("App.General.CalculateAndShowAgreementChargesTillNow"));
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
            vm.isTaxOnSalikOrFineForTaxExemptedCustomers = utilities.parseBoolean(abp.setting.get("App.General.TaxOnSalikOrFineForTaxExemptedCustomers"));
            vm.isRentalQuotationEnabled = abp.features.isEnabled("CRS.Rental.Quotations");
            vm.isExcessKMsInvoiceEnabled = abp.features.isEnabled("Core.ExcessKMsCharging");
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

                return chargesCalculator.calculate(vm.agreement);
            };

            vm.getlocalDate = function (date) {
                if (date == null)
                    return "";

                var localTime = moment.utc(date).toDate();
                return moment(localTime).format(vm.dateFormat);
            };

            vm.localize = function (input) {
                return app.localize(input);
            };

            vm.localizeChargesType = function (chargesRow) {
                if (chargesRow.chargesTypeId == 2 && chargesRow.excessRate == 0 && chargesRow.accepted)
                    return app.localize("SCDW");
                return app.localize(chargesRow.chargesType.name);
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

            vm.getFuelLevel = function (value) {
                return utilities.getFuelLevel(value);
            };

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

            function openCompanyViewModal(companyId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/companies/viewModel.cshtml',
                    controller: 'tenant.views.crs.companies.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        companyId: function () {
                            return companyId;
                        }
                    }
                });
            }

            vm.viewContact = function (ContactId) {
                if (vm.agreement.customer.contactCategory == 1)
                    openCustomerViewModal(ContactId);
                if (vm.agreement.customer.contactCategory == 2)
                    openCompanyViewModal(ContactId);
            };

            vm.openMileageInfoModal = function (mileageCharges) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/mileageChargesInfoModal.cshtml',
                    controller: 'tenant.views.crs.agreements.mileageChargesInfoModal as vm',
                    backdrop: 'static',
                    size: 'sm',
                    resolve: {
                        mileageCharges: function () {
                            return mileageCharges;
                        },
                    }
                });
            }

            vm.printModel = function myfunction(movementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/printtemplates/printReplacementPreview.cshtml',
                    controller: 'tenant.views.crs.agreements.printtemplates.printReplacementPreview as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        movementId: function () {
                            return movementId;
                        }
                    }
                });
            };

            function openViewMovementModal(movementId, checklist) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/mcc/movements/viewModal.cshtml',
                    controller: 'tenant.views.movements.viewModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        movementId: function () {
                            return movementId;
                        },
                        checklist: function () {
                            return checklist;
                        }
                    }
                });
            }

            vm.viewMovement = function (movementId) {
                openViewMovementModal(movementId, null);
            };

            vm.showTollsDetail = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/tollsDetailModal.cshtml',
                    controller: 'tenant.views.crs.agreements.tollsDetailModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        tolls: function () {
                            return null;
                        },
                        dateTimeIn: function () {
                            return null;
                        },
                        agreementId: function () {
                            return vm.agreement.id;
                        }
                    }
                });
            };
            vm.showDarbsDetail = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/darbsDetailModal.cshtml',
                    controller: 'tenant.views.crs.agreements.darbsDetailModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        tolls: function () {
                            return null;
                        },
                        dateTimeIn: function () {
                            return null;
                        },
                        agreementId: function () {
                            return vm.agreement.id;
                        }
                    }
                });
            };

            vm.showFinesDetail = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/finesDetailModal.cshtml',
                    controller: 'tenant.views.crs.agreements.finesDetailModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        fines: function () {
                            return null;
                        },
                        dateTimeIn: function () {
                            return null;
                        },
                        agreementId: function () {
                            return vm.agreement.id;
                        }
                    }
                });
            };

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

            function getExcessKMsOnAgreement() {
                vm.loading = true;
                commonAgreementService.getExcessKMsOnAgreement({ id: agreementId })
                    .success(function (result) {
                        vm.excessKMsCharged = result;
                    })
                    .finally(function () { vm.loading = false; });
            }

            vm.viewInvoice = function (invoiceId) {
                openViewInvoiceModal(invoiceId);
            };

            function openViewInvoiceModal(invoiceId) {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/invoices/viewModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.invoices.viewModal as vm',

                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        invoiceId: function () {
                            return invoiceId;
                        }
                    }
                });

            }

            var fineChargesTypeIds = [7, 8, 33, 34, 73, 74];

            function init() {
                vm.loading = true;

                rentalAgreementSearchService.getAgreementForView({
                    id: agreementId
                }).success(function (result) {
                    vm.agreement = result;
                    getCustomerPicture(vm.agreement.customer.id);

                    console.log(vm.agreement.customer.currency);
                    vm.agreement.vehicle.makeAndModel = vm.agreement.vehicle.make + ' ' + vm.agreement.vehicle.model;
                    //vm.agreement.agreementType = 1;

                    var excludedChargesSum = vm.agreement.charges
                        .filter(e => fineChargesTypeIds.includes(e.chargesTypeId))
                        .reduce((a, c) => a + c.charges, 0);

                    vm.agreement.totalCharges = vm.agreement.totalCharges - excludedChargesSum;
                    //angular.forEach(vm.agreement.charges, function (value, key) {
                    //    if (value.chargesTypeId == 7 || value.chargesTypeId == 8 || value.chargesTypeId == 33 || value.chargesTypeId == 34 || value.chargesTypeId == 73 || value.chargesTypeId == 74) {
                    //        vm.agreement.totalCharges = vm.agreement.totalCharges - value.charges;
                    //    }

                    //});


                    vm.agreement.charges = vm.agreement.charges.filter(e => !fineChargesTypeIds.includes(e.chargesTypeId));

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
                    if (vm.agreement.customer.contactCategory == 1) {
                        vm.isIndividualCustomerRadio = true;
                    }
                    else if (vm.agreement.customer.contactCategory == 2) {
                        vm.isIndividualCustomerRadio = false;
                    }



                    vm.totalDaysAndTime();
                }).finally(function () {
                    vm.loading = false;
                });

                if (vm.isExcessKMsInvoiceEnabled) {
                    getExcessKMsOnAgreement();
                }
            }

            init();
        }
    ]);
