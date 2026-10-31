// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:150042-150595
appModule.controller('tenant.views.crs.agreements.viewModal', [
        'utilities', '$uibModalInstance', '$uibModal', 'chargesCalculator', 'abp.services.app.rentalAgreementSearch', 'abp.services.app.directory', 'abp.services.app.commonAgreement', 'abp.services.app.parkingTicket', 'agreementId', '$filter',
        function (utilities, $uibModalInstance, $uibModal, chargesCalculator, rentalAgreementSearchService, directoryService, commonAgreementService, parkingTicketService, agreementId, $filter) {

            var vm = this;
            vm.enablePickAndDropLocationInAgreement = utilities.parseBoolean(abp.setting.get("App.General.EnablePickAndDropLocationInAgreement"));

            vm.isRentalProjectEnabled = abp.features.isEnabled("CRS.CustomFeatures.RentalCustomerProject");
            vm.clubRentalDriverAndFuelCharges = abp.features.isEnabled("CRS.CustomFeatures.ClubRentalDriverAndFuelCharges");
            vm.calculateAndShowAgreementChargesTillNow = utilities.parseBoolean(abp.setting.get("App.General.CalculateAndShowAgreementChargesTillNow"));
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.isTaxOptional = utilities.parseBoolean(abp.setting.get("App.General.IsTaxOptional"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.editCloseMovement = abp.features.isEnabled("MCC.EditCloseMovement");
            vm.isMultiCurrencyEnabled = abp.features.isEnabled("Core.MultiCurrency");
            vm.expectedEndDate = utilities.parseBoolean(abp.setting.get("App.General.ExpectedEndDate"));
            vm.manualAgreementNo = utilities.parseBoolean(abp.setting.get("App.General.ManualAgreementNo"));
            vm.isRentalMasterAgreementEnabled = abp.features.isEnabled('CRS.Rental.Agreements.MasterAgreement');
            vm.driverTimeSheetForAgreement = abp.features.isEnabled("CRS.DriverTimeSheetForAgreement");
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
            vm.isAgreementGroups = abp.features.isEnabled("Core.AgreementGroups");
            vm.isAgreementAndCustomerBalanceInAgreement = utilities.parseBoolean(abp.setting.get("App.Speed.Common.AgreementAndCustomerBalanceInAgreementView"));
            vm.showAgreementNotesInInvoiceDescription = utilities.parseBoolean(abp.setting.get('App.Speed.Common.ShowAgreementNotesInInvoiceDescription'));

            vm.isIndividualCustomerRadio = true;
            vm.loading = false;
            vm.locations = [];
            vm.parkingData = null;
            vm.agreementBalance = 0;
            vm.outStandingBalance = 0;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.isSaleOriginEnabled = abp.features.isEnabled("CRS.CustomFeatures.SaleOrigin");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.allowZeroValueRentalAgreement = utilities.parseBoolean(abp.setting.get("App.Speed.Common.AllowZeroValueRentalAgreement"));
            vm.showExtendedDate = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowExtendedDateInLeaseAgreement"));
            vm.carryforwardKMsonRAExtension = utilities.parseBoolean(abp.setting.get("App.Speed.Common.CarryforwardKMsonRAExtension"));

            vm.getlocalDateTime = function (date) {
                if (date == null)
                    return "";

                var localTime = moment.utc(date).toDate();
                return moment(localTime).format(vm.dateTimeFormat);
            };
            vm.openMovementLogsModal = function (movement) {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/mcc/movements/movementLogsModal.cshtml',
                    controller: 'tenant.views.mcc.movements.movementLogsModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        movementId: function () {
                            return movement.id;
                        }
                    }
                });
            };
            vm.permissions = {

                'edit': (abp.auth.hasPermission('Pages.Tenant.Movements.EnableMovementEditing') && abp.features.isEnabled('CRS.CustomFeatures.EnableMovementEditing')),
                'viewVehicleInformation': abp.auth.hasPermission('Pages.Tenant.Vehicles.View'),
                'log': (abp.auth.hasPermission('Pages.Tenant.Movements.EnableMovementLogs') && abp.features.isEnabled('CRS.CustomFeatures.EnableMovementEditing'))
            };
            vm.getlocalDate = function (date) {
                if (date == null)
                    return "";

                var localTime = moment.utc(date).toDate();
                return moment(localTime).format(vm.dateFormat);
            };
            vm.currencyAndRoundingWithThree = function (value) {
                if (value == null) return null;

                return value.toLocaleString('en', { minimumFractionDigits: 3, maximumFractionDigits: 3 })
            };
            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
                { type: "Hourly", id: 6 },
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
            vm.rounding = function (number) {
                return utilities.round(number, 2);
            }
            vm.calculate = function () {
                if (vm.agreement == null) return 0;

                if (vm.agreement && vm.agreement.charges) {
                    var foundLines = $filter('filter')(vm.agreement.charges, {
                        chargesTypeId: 1
                    }, true);
                    if (foundLines.length == 1) {
                        if (foundLines[0].discountPercent >= 0) {
                            foundLines[0].discountedRate = vm.roundingforView(foundLines[0].rate - (foundLines[0].rate * (foundLines[0].discountPercent / 100)));
                        }
                        //else {
                        //    foundLines[0].discountedRate = 0;
                        //}
                    }
                }

                //if ((vm.agreement.agreementType == 1 || vm.agreement.agreementType == 2) && !vm.advanceChanged && !vm.isEditMod) {
                //    vm.advance.amount = chargesCalculator.calculate(vm.agreement);
                //}
                //else if (vm.agreement.agreementType == 3) {
                //    vm.isReadOnlyAdvanceAmount = false;
                //}

                var calculatedValue = chargesCalculator.calculate(vm.agreement);
                setIsComplimentary();
                return calculatedValue;
            };

            function setIsComplimentary() {
                let isComplimentary = true;
                vm.agreement.charges.forEach(c => {
                    if (c.chargesTypeId === 1) {
                        if (c.rate != undefined && c.rate != 0) {
                            isComplimentary = false;
                        }
                    }
                });
                vm.isComplimentary = isComplimentary;
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

            vm.viewVehicle = function (vehicleId) {
                openViewVehicleModal(vehicleId);
            };

            function openViewVehicleModal(vehicleId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/viewModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.viewModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        vehicleId: function () {
                            return vehicleId;
                        }
                    }
                });
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
            vm.editMovement = function (movementId) {
                openEditMovementModal(movementId, null);
            };
            function openEditMovementModal(movementId, checklist) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/mcc/movements/editModal.cshtml',
                    controller: 'tenant.views.movements.editModal as vm',
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

            vm.showParkingDetail = function () {
                vm.fetchParking().then(function () {
                    openParkingDetailModal();
                }).catch(function (error) {
                    console.error('Error fetching parking data:', error);
                });
            };

            vm.fetchParking = function () {
                return new Promise(function (resolve, reject) {
                    parkingTicketService.getParkingTicket({
                        agreementId: vm.agreement.id,
                        downloadPendingTolls: false
                    }).success(function (result) {
                        vm.parkingData = result;
                        resolve();
                    }).error(function (error) {
                        reject(error);
                    });
                });
            };

            function openParkingDetailModal() {
                var dateIn = moment(vm.agreement.movements[vm.agreement.movements.length - 1].inDetail.dateTime);
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/parkingDetailModal.cshtml',
                    controller: 'tenant.views.crs.agreements.parkingDetailModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        parkingTickets: function () {
                            return vm.parkingData && vm.parkingData.parkingTicket ? vm.parkingData.parkingTicket : [];
                        },
                        dateTimeIn: function () {
                            return dateIn;
                        },
                        agreementId: function () {
                            return vm.agreement.id || null;
                        }
                    }
                });
                modalInstance.result.then(function () {
                    vm.calculate();
                });
            }


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
            function getLogsOnAgreement() {
                vm.loading = true;
                commonAgreementService.getAgreementLogs({ id: agreementId })
                    .success(function (result) {
                        vm.agreementLogs = result;
                    })
                    .finally(function () { vm.loading = false; });
            }

            vm.viewInvoice = function (invoiceId) {
                openViewInvoiceModal(invoiceId);
            };


            vm.getOutStandingBalance = function () {
                if (vm.agreement.customer) {
                    directoryService.getCustomerOutstandingBalance({ id: vm.agreement.customer.id }).success(function (result) {
                        vm.outStandingBalance = result;
                    });
                }
            }

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
            function init() {
                vm.loading = true;

                rentalAgreementSearchService.getAgreementForView({
                    id: agreementId
                }).success(function (result) {
                    vm.agreement = result;
                    getCustomerPicture(vm.agreement.customer.id);
                    if (vm.isMultiCurrencyEnabled) {
                        if (vm.agreement.customer && vm.agreement.customer.currency) {
                            vm.currencyCode = vm.agreement.customer.currency.code;
                        }
                        else {
                            vm.currencyCode = vm.defaultCurrencyCode;
                        }
                    }

                    console.log(vm.agreement.customer.currency);
                    vm.agreement.vehicle.makeAndModel = vm.agreement.vehicle.make + ' ' + vm.agreement.vehicle.model;
                    //vm.agreement.agreementType = 1;

                    if (vm.agreement && vm.agreement.charges) {
                        var foundLines = $filter('filter')(vm.agreement.charges, {
                            chargesTypeId: 1
                        }, true);
                        if (foundLines.length == 1) {
                            if (foundLines[0].discountPercent > 0) {

                                foundLines[0].discountedRate = vm.roundingforView(foundLines[0].rate - (foundLines[0].rate * (foundLines[0].discountPercent / 100)), 2);
                            }
                        }
                    }
                    if (vm.agreement.customer.contactCategory == 1) {
                        vm.isIndividualCustomerRadio = true;
                    }
                    else if (vm.agreement.customer.contactCategory == 2) {
                        vm.isIndividualCustomerRadio = false;
                    }

                    //For Agreement Balance
                    if (vm.isAgreementAndCustomerBalanceInAgreement)
                    {
                        if (vm.agreement != null)
                        {
                            vm.agreementBalance = vm.agreement.totalCharges - vm.agreement.receivedAmount;
                        }
                        if (vm.agreement.customer != null)
                        {
                            vm.getOutStandingBalance();
                        }
                    }

                    vm.totalDaysAndTime();
                    setIsComplimentary();
                }).finally(function () {
                    vm.loading = false;
                });

                if (vm.isExcessKMsInvoiceEnabled) {
                    getExcessKMsOnAgreement();
                }
                if (vm.showExtendedDate) {
                    getLogsOnAgreement();
                }
            }

            init();
        }
    ]);
