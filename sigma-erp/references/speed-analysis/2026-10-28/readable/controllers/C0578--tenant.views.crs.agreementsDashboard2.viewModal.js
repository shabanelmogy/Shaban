// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:158189-158934
appModule.controller('tenant.views.crs.agreementsDashboard2.viewModal', [
        'utilities', '$uibModalInstance', '$uibModal', 'abp.services.app.toll', 'abp.services.app.invoice', 'chargesCalculator', 'abp.services.app.rentalAgreementSearch', 'abp.services.app.directory', 'abp.services.app.commonAgreement', '$filter', 'options',
        function (utilities, $uibModalInstance, $uibModal, tollService, invoiceService, chargesCalculator, rentalAgreementSearchService, directoryService, commonAgreementService, $filter, options) {

            var vm = this;
            var agreementId = options.agreement.id;
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
            vm.showLimitedFields = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowLimitedFieldsForAgreementsInAgreementDashboard"));
            vm.isTariffCardEnable = abp.features.isEnabled("CRS.Tariff.TariffCards");
            vm.isDeliveryMovementEnable = abp.features.isEnabled("CRS.DeliveryAndCollectionMovements");
            vm.IsInsuranceCompanyAndClaimNoRequired = utilities.parseBoolean(abp.setting.get("App.General.IsInsuranceCompanyAndClaimNoRequired"));
            vm.isSaleOrderEnabled = abp.features.isEnabled("CRS.Vouchers.SaleOrders");
            vm.isTotalDaysAndHrs = false;
            vm.invoiceBasedOnAgreedRent = utilities.parseBoolean(abp.setting.get("App.General.InvoiceBasedOnAgreedRent"));
            vm.showParkingChargesInAgreementDashboard = utilities.parseBoolean(abp.setting.get("App.Speed.AgreementDashboardTwo.ShowParkingChargesInAgreementDashboard"));
            vm.isTaxOnSalikOrFineForTaxExemptedCustomers = utilities.parseBoolean(abp.setting.get("App.General.TaxOnSalikOrFineForTaxExemptedCustomers"));
            vm.isRentalQuotationEnabled = abp.features.isEnabled("CRS.Rental.Quotations");
            vm.isExcessKMsInvoiceEnabled = abp.features.isEnabled("Core.ExcessKMsCharging");
            vm.isIndividualCustomerRadio = true;
            vm.loading = false;
            vm.locations = [];
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.isSaleOriginEnabled = abp.features.isEnabled("CRS.CustomFeatures.SaleOrigin");
            vm.isAddMultipleDepositsOnAgreement = abp.features.isEnabled("CRS.CustomFeatures.AddMultipleDepositsOnAgreement");

            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.filters = {

                enableDateRange: true,
                agreementNo: null
            };
            vm.getlocalDateTime = function (date) {
                if (date == null)
                    return "";

                var localTime = moment.utc(date).toDate();
                return moment(localTime).format(vm.dateTimeFormat);
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

            vm.openViewSingleDepositModal = function (depositId, agreement) {

                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/deposits/viewModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.deposits.viewModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        depositId: function () {
                            return depositId;
                        },
                        agreement: function () {
                            return agreement;
                        },
                        deposit: function () {
                            return null;
                        }
                    }
                });
            };
            vm.getAgreements = function () {
                vm.busy = true;

                commonAgreementService.getOpenAgreementsForAgreementsDashboard2({ agreementNo: vm.agreement.agreementNo }).success(function (data) {
                    vm.totalDataCount = data.totalCount;
                    //vm.amortizationData = data.items;
                    data.agreementsList.forEach(function (value) {

                        vm.agreement = value;
                        getMileageDiff();
                        getCustomerPicture(vm.agreement.customer.id);

                        vm.agreement.vehicle.makeAndModel = vm.agreement.vehicle.model.make.name + ' ' + vm.agreement.vehicle.model.name;
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
                        if (vm.agreement.customer.contactCategory == 1) {
                            vm.isIndividualCustomerRadio = true;
                        }
                        else if (vm.agreement.customer.contactCategory == 2) {
                            vm.isIndividualCustomerRadio = false;
                        }
                        vm.totalDaysAndTime();

                        if (vm.isExcessKMsInvoiceEnabled) {
                            getExcessKMsOnAgreement();
                        }
                        if (vm.calculateAndShowAgreementChargesTillNow && value.status == 1) {
                            vm.calculate(value);
                        }




                        value.rentalCharges = 0;
                        value.reversedCharges = 0;
                        value.reversedAdditionalCharges = 0;
                        value.reversedChargesWithoutTDF = 0;
                        value.reversedChargesOfTolls = 0;
                        value.reversedChargesOfDarbs = 0;
                        value.reversedChargesOfParkings = 0;
                        value.reversedChargesOfFines = 0;
                        value.receivedCharges = 0;
                        value.receivedAdditionalCharges = 0;
                        value.receivedChargesWithoutTDF = 0;
                        value.receivedChargesOfTolls = 0;
                        value.receivedChargesOfDarbs = 0;
                        value.receivedChargesOfParkings = 0;
                        value.receivedChargesOfFines = 0;
                        value.darbInvoice = 0;
                        value.tollInvoice = 0;
                        value.finesInvoice = 0;
                        value.parkingsInvoice = 0;
                        value.invoicedTax = 0;
                        value.chargesInvoiceTotal = 0;
                        value.agreementDiscount = 0;
                        value.sumInvoiceTDFCharges = 0;






                        angular.forEach(value.charges, function (item, key) {
                            angular.forEach(value.additionalAgreementChargesList, function (addi, key) {
                                if (addi.chargesTypeId == item.chargesTypeId) {
                                    if (addi.rate) {

                                        if (addi.chargesTypeId == 7 || addi.chargesTypeId == 33) {
                                            value.tollsCharges = value.tollsCharges + addi.rate;
                                            value.totalTax = value.totalTax + addi.tax;
                                        }
                                        if (addi.chargesTypeId == 8 || addi.chargesTypeId == 34) {
                                            value.finesCharges = value.finesCharges + addi.rate;
                                            value.totalTax = value.totalTax + addi.tax;

                                        }
                                        if (addi.chargesTypeId == 73 || addi.chargesTypeId == 74) {
                                            value.darbCharges = value.darbCharges + addi.rate;
                                            value.totalTax = value.totalTax + addi.tax;

                                        }
                                        if (addi.chargesTypeId == 39 || addi.chargesTypeId == 77) {
                                            value.parkingsCharges = value.parkingsCharges + addi.rate;
                                            value.totalTax = value.totalTax + addi.tax;

                                        } else {
                                            item.charges = item.charges + addi.rate;
                                            item.tax = item.tax + addi.tax;
                                        }



                                    }

                                }


                            });




                            if (
                                !(item.chargesTypeId == 73 ||
                                    item.chargesTypeId == 74 ||
                                    item.chargesTypeId == 7 ||
                                    item.chargesTypeId == 8 ||
                                    item.chargesTypeId == 33 ||
                                    //item.chargesTypeId == 28 ||
                                    item.chargesTypeId == 34 ||
                                    item.chargesTypeId == 39 ||
                                    item.chargesTypeId == 77
                                )) {
                                value.rentalCharges = value.rentalCharges + item.charges;
                                value.reversedCharges = value.reversedCharges + item.reversed;
                                value.receivedCharges = value.receivedCharges + item.received;
                                if (item.taxable)
                                    value.totalTax = value.totalTax + item.tax;
                                value.invoicedTax = value.invoicedTax + item.invoicedTax;
                                value.chargesInvoiceTotal = value.chargesInvoiceTotal + item.invoiced;
                                value.reversedChargesWithoutTDF = value.reversedChargesWithoutTDF + item.reversed;
                                value.receivedChargesWithoutTDF = value.receivedChargesWithoutTDF + item.received;
                            } else {//toll darb salik invoice sum
                                value.sumInvoiceTDFCharges = value.sumInvoiceTDFCharges + item.invoiced;
                                value.invoicedTax = value.invoicedTax + item.invoicedTax;
                                if (item.chargesTypeId == 33 || item.chargesTypeId == 7) {
                                    value.tollInvoice = value.tollInvoice + item.invoiced;
                                    value.reversedChargesOfTolls = value.reversedChargesOfTolls + item.reversed; // credit notes
                                    value.receivedChargesOfTolls = value.receivedChargesOfTolls + item.received; // receipts
                                }
                                if (item.chargesTypeId == 34 || item.chargesTypeId == 8) {
                                    value.finesInvoice = value.finesInvoice + item.invoiced;
                                    value.reversedChargesOfFines = value.reversedChargesOfFines + item.reversed; // credit notes
                                    value.receivedChargesOfFines = value.receivedChargesOfFines + item.received; // receipts
                                }
                                if (item.chargesTypeId == 73 || item.chargesTypeId == 74) {
                                    value.darbInvoice = value.darbInvoice + item.invoiced;
                                    value.reversedChargesOfDarbs = value.reversedChargesOfDarbs + item.reversed; // credit notes
                                    value.receivedChargesOfDarbs = value.receivedChargesOfDarbs + item.received; // receipts
                                }
                                if (item.chargesTypeId == 39 || item.chargesTypeId == 77) {
                                    value.parkingsInvoice = value.parkingsInvoice + item.invoiced;
                                    value.reversedChargesOfParkings = value.reversedChargesOfParkings + item.reversed; // credit notes
                                    value.receivedChargesOfParkings = value.receivedChargesOfParkings + item.received; // receipts
                                }
                                //if (item.chargesTypeId == 28) {
                                //    value.receivedAdditionalCharges = value.receivedAdditionalCharges + item.received; // receipts
                                //    value.reversedAdditionalCharges = value.reversedAdditionalCharges + item.reversed; // credit notes
                                //}

                            }



                        });
                        value.sumInvoiceTDFCharges = value.sumInvoiceTDFCharges + value.chargesInvoiceTotal;
                        if (value.discount) {
                            value.agreementDiscount = value.discount * -1;
                        }

                        value.totalTax = value.additionalTax + value.totalTax;
                        value.sum = value.additional + value.agreementDiscount + value.rentalCharges + value.tollsCharges + value.finesCharges + value.parkingsCharges + value.darbCharges + value.totalTax;
                        value.due = ((value.sum - value.receivedTotal) - (value.reversed + value.reversedTax));
                        value.invoicedTax = utilities.round(value.invoicedTax, 2) - value.reversedTax;
                        value.totalTax = utilities.round(value.totalTax, 2);
                        value.agreementDiscount = utilities.round(value.agreementDiscount, 2);
                        value.rentalCharges = utilities.round(value.rentalCharges, 2);
                        value.tollsCharges = utilities.round(value.tollsCharges, 2);
                        value.parkingsCharges = utilities.round(value.parkingsCharges, 2);
                        value.finesCharges = utilities.round(value.finesCharges, 2);
                        value.sum = utilities.round(value.sum, 2);
                        value.additional = utilities.round(value.additional, 2);
                        value.received = utilities.round(value.received, 2);
                        value.receivedTotal = utilities.round(value.receivedTotal, 2);
                        value.refundTotal = utilities.round(value.refundTotal, 2);

                        value.due = utilities.round(value.due, 2);
                        value.deposit = utilities.round(value.deposit, 2);
                        value.dueDeposit = utilities.round(value.dueDeposit, 2);
                        value.darbCharges = utilities.round(value.darbCharges, 2);
                        vm.agreement = value;

                    });



                }).finally(function () {
                    vm.busy = false;

                });
            };



            vm.openForViewReceivedDetails = function (agreement) {
                vm.filters.agreementForReceviced = agreement;


                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/agreementsDashboard2/viewReceivedDetails.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };
            vm.showTollsDetail = function (agreementId) {
                vm.filters.agreementId = agreementId;


                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/agreementsDashboard2/tollsDetailModal.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }

                });
            };
            vm.showFinesDetail = function (agreementId) {
                vm.filters.agreementId = agreementId;


                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/agreementsDashboard2/finesDetailModal.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }

                });
            };

            vm.showParkingsDetail = function (agreementId) {
                vm.filters.agreementId = agreementId;

                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/agreementsDashboard2/parkingDetailModal.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }

                });
            };
            vm.showDarbDetail = function (agreementId) {
                vm.filters.agreementId = agreementId;


                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/agreementsDashboard2/darbsDetailModal.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }

                });
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
                { type: "Monthly", id: 3 },
                { type: "Lease", id: 4 }
            ];

            var rateTypes = {
                perDay: { id: 1, name: '/Day' },
                perWeek: { id: 2, name: '/Week' },
                perMonth: { id: 3, name: '/Month' },
            };

            vm.getFuelLevel = function (value) {
                return utilities.getFuelLevel(value);
            };
            vm.openViewDepositModal = function (agreement) {
                vm.filters.agreementForReceviced = agreement;


                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/agreementsDashboard2/viewDeposits.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getAgreements();
                });
            };
            vm.plusClicked = {
                toll: false,
                darb: false,
                fine: false,
                parking: false
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

            function getMileageDiff() {
                if (vm.agreement.status == 2) {
                    vm.totalMileage == 0;
                    for (var row = 0; row < vm.agreement.movements.length; row++) {
                        vm.totalMileage = (vm.agreement.movements[row].inDetail.km - vm.agreement.movements[row].outDetail.km);

                    };
                };

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
            vm.generateFineInvoice = function () {
                abp.message.confirm(
                    app.localize('InvoiceCreateMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;
                            invoiceService.generatFineInvoiceByAgreementId({ AgreementId: vm.agreement.id })
                                .success(function (result) {
                                    vm.plusClicked.fine = true;
                                    vm.getAgreements();
                                    abp.notify.success(app.localize('SuccessfullyInvoiced'));

                                })
                                .finally(function () {


                                    vm.loading = false;
                                });

                        }
                    }
                );

            };
            vm.generateParkingInvoice = function () {
                abp.message.confirm(
                    app.localize('InvoiceCreateMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;
                            invoiceService.generatParkingInvoiceByAgreementId({ AgreementId: vm.agreement.id })
                                .success(function (result) {
                                    vm.plusClicked.parking = true;
                                    vm.getAgreements();
                                    abp.notify.success(app.localize('SuccessfullyInvoiced'));

                                })
                                .finally(function () {


                                    vm.loading = false;
                                });

                        }
                    }
                );

            };
            vm.generateTollInvoice = function () {
                abp.message.confirm(
                    app.localize('InvoiceCreateMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;
                            invoiceService.generatTollInvoiceByAgreementId({
                                agreementId: vm.agreement.id, downloadPendingTolls: false, server: 1, showAllForClosed: true
                            }).success(function (result) {

                                vm.plusClicked.toll = true;
                                vm.getAgreements();
                                abp.notify.success(app.localize('SuccessfullyInvoiced'));
                            }).finally(function () {
                                vm.loading = false;
                            });



                        }
                    }
                );

            };

            vm.generateDarbInvoice = function () {
                abp.message.confirm(
                    app.localize('InvoiceCreateMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {

                            invoiceService.generatTollInvoiceByAgreementId({
                                agreementId: vm.agreement.id, downloadPendingTolls: false, server: 2, showAllForClosed: true
                            }).success(function (result) {
                                vm.plusClicked.darb = true;
                                vm.getAgreements();
                                abp.notify.success(app.localize('SuccessfullyInvoiced'));
                            }).finally(function () {
                                vm.loading = false;
                            });

                        }
                    }
                );

            };





            vm.viewMovement = function (movementId) {
                openViewMovementModal(movementId, null);
            };
            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };


            vm.cancel = function () {

                $uibModalInstance.close(vm.agreement);

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
            function init() {
                vm.plusClicked = { toll: false, darb: false, fine: false, parking: false };
                vm.agreement = options.agreement;
                vm.getAgreements();
            }

            init();
        }
    ]);
