// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:235330-235765
appModule.controller('tenant.views.crs.lease.agreements.viewModal', [
        'utilities', '$uibModalInstance', '$uibModal', 'agreementId', 'abp.services.app.leaseAgreementSearch', 'abp.services.app.directory', 'abp.services.app.commonAgreement', 'abp.services.app.parkingTicket', 'abp.services.app.leaseClause', '$filter',
        function (utilities, $uibModalInstance, $uibModal, agreementId, leaseAgreementSearchService, directoryService, commonAgreementService, parkingTicketService, leaseClauseService, $filter) {

            var vm = this;
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.isTaxOptional = utilities.parseBoolean(abp.setting.get("App.General.IsTaxOptional"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.isCRSAllowLeaseCalculationOnDailyBasisEnabled = abp.features.isEnabled("CRS.CustomFeatures.AllowLeaseCalculationOnDailyBasis");
            vm.manualAgreementNo = utilities.parseBoolean(abp.setting.get("App.General.ManualAgreementNo"));
            vm.enableAdditionalNotes = utilities.parseBoolean(abp.setting.get("App.General.EnableAdditionalNotes"));
            vm.enableManualAgreementNo = utilities.parseBoolean(abp.setting.get("App.General.EnableManualAgreementNo"));
            vm.isWeeklyMonthlyEnabled = utilities.parseBoolean(abp.setting.get("App.General.WeeklyMonthlyRental"));
            vm.isAdditionalChargesEnabled = abp.features.isEnabled("CRS.Lease.AgreementAdditionalCharges");
            vm.isUserWiseDiscountEnable = abp.features.isEnabled("CRS.UserWiseDiscount");
            vm.editCloseMovement = abp.features.isEnabled("MCC.EditCloseMovement");
            vm.isDeliveryMovementEnable = abp.features.isEnabled("CRS.DeliveryAndCollectionMovements");
            vm.isSaleOrderEnabled = abp.features.isEnabled("CRS.Vouchers.SaleOrders");
            vm.isTaxOnSalikOrFineForTaxExemptedCustomers = utilities.parseBoolean(abp.setting.get("App.General.TaxOnSalikOrFineForTaxExemptedCustomers"));
            vm.isIndividualCustomerRadio = true;
            vm.isSeparateInvoiceStartDateForAgreement = abp.features.isEnabled("CRS.CustomFeatures.SeparateInvoiceStartDateForAgreement");
            vm.isExcessKMsInvoiceEnabled = abp.features.isEnabled("Core.ExcessKMsCharging");
            vm.isLeaseToOwnEnabled = abp.features.isEnabled("CRS.Lease.LeaseToOwn");
            vm.loading = false;
            vm.locations = [];
            vm.parkingData = null;
            vm.showExtendedDate = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowExtendedDateInLeaseAgreement"));

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

            vm.permissions = {

                'edit': (abp.auth.hasPermission('Pages.Tenant.Movements.EnableMovementEditing') && abp.features.isEnabled('CRS.CustomFeatures.EnableMovementEditing')),
                'log': (abp.auth.hasPermission('Pages.Tenant.Movements.EnableMovementLogs') && abp.features.isEnabled('CRS.CustomFeatures.EnableMovementEditing'))
            };

            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.localize = function (input) {
                return app.localize(input);
            };

            vm.localizeChargesType = function (chargesRow) {
                if (chargesRow.chargesTypeId == 2 && chargesRow.excessRate == 0 && chargesRow.accepted)
                    return app.localize("SCDW");
                return app.localize(chargesRow.chargesType.name);
            };
            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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

                { type: "Lease", id: 4 },
                { type: "LeaseToOwn", id: 5 },
            ];

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

            var rateTypes = {
                perDay: { id: 1, name: '/Day' },
                perWeek: { id: 2, name: '/Week' },
                perMonth: { id: 3, name: '/Month' },
            };

            vm.agreementProvisionItems = [
                { id: 1, name: app.localize('Battery') },
                { id: 2, name: app.localize('Tyres') }
            ];

            vm.agreementProvisionTypes = [
                { id: 1, name: app.localize('KMs') },
                { id: 2, name: app.localize('Months') }
            ];

            vm.agreementPreTerminationTypes = [
                { id: 1, name: app.localize('Fixed') },
                { id: 2, name: app.localize('PercentageOfRemainingPeriod') },
                { id: 3, name: app.localize('NoOfMonths') },
            ];

            vm.getFuelLevel = function (value) {
                return utilities.getFuelLevel(value);
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

            vm.viewContact = function (ContactId) {
                if (vm.agreement.customer.contactCategory == 1)
                    openCustomerViewModal(ContactId);
                if (vm.agreement.customer.contactCategory == 2)
                    openCompanyViewModal(ContactId);
            };

            vm.openMileageInfoModal = function (mileageCharges) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/lease/agreements/mileageChargesInfoModal.cshtml',
                    controller: 'tenant.views.crs.lease.agreements.mileageChargesInfoModal as vm',
                    backdrop: 'static',
                    size: 'sm',
                    resolve: {
                        mileageCharges: function () {
                            return mileageCharges;
                        },
                    }
                });
            }

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
                        downloadPendingTolls: false, showAllForClosed: true
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

            vm.getClauses = function (row, id) {
                vm.loading = true;
                leaseClauseService.getClausesForEdit({
                    id: id
                }).success(function (data) {
                    row.leaseClauses = data.clauses;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function getLeaseClauseTypes() {
                vm.loading = true;
                leaseClauseService.getLeaseClauseTypes({}).success(function (data) {
                    vm.leaseClauseTypes = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
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
            function getLogsOnAgreement() {
                vm.loading = true;
                commonAgreementService.getAgreementLogs({ id: agreementId })
                    .success(function (result) {
                        vm.agreementLogs = result;
                    })
                    .finally(function () { vm.loading = false; });
            }
            function init() {
                vm.loading = true;
                leaseAgreementSearchService.getLeaseAgreementForView({
                    id: agreementId
                }).success(function (result) {
                    vm.agreement = result;
                    getCustomerPicture(vm.agreement.customer.id);
                    vm.agreement.customer.currency = vm.agreement.customer.currency ? vm.agreement.customer.currency.code : null;
                    vm.agreement.vehicle.makeAndModel = vm.agreement.vehicle.make + ' ' + vm.agreement.vehicle.model.name;
                    vm.agreement.provisions = !vm.agreement.provisions ? [] : vm.agreement.provisions;
                    vm.agreement.preTerminationRules = !vm.agreement.preTerminationRules ? [] : vm.agreement.preTerminationRules;
                    vm.agreement.clauses = !vm.agreement.clauses ? [] : vm.agreement.clauses;
                    vm.agreement.endDate = utilities.jsonUtcDateToLocalMoment(vm.agreement.endDate);
                    //vm.agreement.noOfMonths = vm.agreement.endDate.diff(moment(vm.agreement.movements[0].outDetail.dateTime), 'months');
                    vm.agreement.additionalCharges.forEach(row => {
                        if (row.rateTypeId == 3) {
                            row.toDate = moment(row.date).add(row.units, 'M');
                        }
                    });
                    vm.agreement.clauses.forEach(function (row) {
                        vm.getClauses(row, row.clause.clauseTypeId);
                    });
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
                    getLeaseClauseTypes();
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
