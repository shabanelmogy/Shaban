// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:229400-230307
appModule.controller('tenant.views.crs.lease.agreements.extendAgreementModal', [
        '$scope', '$filter', 'utilities', '$uibModal', '$uibModalInstance', 'uiGridConstants', 'chargesCalculator', 'tariffHelper', 'options', 'abp.services.app.directory', '$rootScope', 'abp.services.app.leaseAgreement', 'abp.services.app.agreementSaleOrder', 'abp.services.app.accident', '$timeout',
        function ($scope, $filter, utilities, $uibModal, $uibModalInstance, uiGridConstants, chargesCalculator, tariffHelper, options, directoryService, $rootScope, leaseAgreementService, agreementSaleOrderService, accidentService, $timeout) {

            var vm = this;
            var agreementId = options.agreementId;
            var chargesLines = options.chargesLines;
            vm.canChangeRates = abp.auth.hasPermission('Pages.Tenant.Lease.Agreements.Edit.CanChangeRates');
            vm.canEditMonth = abp.auth.hasPermission('Pages.Tenant.Lease.Agreements.MonthChange');
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.isTaxOptional = utilities.parseBoolean(abp.setting.get("App.General.IsTaxOptional"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.manualAgreementNo = utilities.parseBoolean(abp.setting.get("App.General.ManualAgreementNo"));
            vm.enableManualAgreementNo = utilities.parseBoolean(abp.setting.get("App.General.EnableManualAgreementNo"));
            vm.enableAdditionalNotes = utilities.parseBoolean(abp.setting.get("App.General.EnableAdditionalNotes"));
            vm.isWeeklyMonthlyEnabled = utilities.parseBoolean(abp.setting.get("App.General.WeeklyMonthlyRental"));
            vm.isDepositsEnable = abp.features.isEnabled("CRS.Vouchers.Deposits");
            var isTariffEnabled = abp.features.isEnabled("CRS.Tariff");
            vm.isSaleOrderEnabled = abp.features.isEnabled("CRS.Vouchers.SaleOrders");
            vm.isUserWiseDiscountEnable = abp.features.isEnabled("CRS.UserWiseDiscount");
            vm.isAdvancePaymentRequired = utilities.parseBoolean(abp.setting.get("App.General.IsAdvancePaymentRequired"));
            vm.isDeliveryMovementEnable = abp.features.isEnabled("CRS.DeliveryAndCollectionMovements");
            vm.isVipCustomer = utilities.parseBoolean(abp.setting.get("App.General.IsVipCustomer"));
            vm.canChangeKMOut = abp.auth.hasPermission('Pages.Tenant.Lease.Agreements.CanChangeKMOut');
            vm.canChangeFuelOut = abp.auth.hasPermission('Pages.Tenant.Lease.Agreements.CanChangeFuelOut');
            vm.isMultiCurrencyEnabled = abp.features.isEnabled("Core.MultiCurrency");
            vm.isCreateLeaseAgreementByWizardEnabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.IsCreateLeaseAgreementByWizardEnabled"));
            vm.extend = abp.auth.hasPermission('Pages.Tenant.Agreements.ExtendCutShort');
            vm.taxAccepted = false;
            vm.showAdvancePopupOnSave = false;
            vm.showDepositPopupOnSave = false;
            vm.loading = false;
            vm.canOpenAgreementWithoutSaleOrder = abp.auth.hasPermission('Pages.Tenant.Lease.Agreements.CanOpenAgreementWithoutSaleOrderLease');
            vm.canChangeLeaseClauses = abp.auth.hasPermission('Pages.Tenant.Lease.Agreements.CanChangeLeaseClauses');
            vm.discountAuthCode = null;
            var enableFutureAgreementCheckOuts = utilities.parseBoolean(abp.setting.get("App.Speed.Common.EnableFutureAgreementCheckOuts"));
            var doNotIncludeReplacementVehicle = utilities.parseBoolean(abp.setting.get("App.Speed.Common.DoNotIncludeReplacementVehicles"));
            var notLoadTariff = false;
            vm.chargesSettings = options.chargesSettings;
            vm.isUserWiseDiscountEnable = abp.features.isEnabled("CRS.UserWiseDiscount");
            vm.isDepositsEnable = abp.features.isEnabled("CRS.Vouchers.Deposits");
            vm.action = options.action;
            vm.alerts = abp.auth.hasPermission('Pages.Tenant.Vehicles.Alerts');
            vm.vehicles = [];
            vm.customers = [];
            vm.drivers = [];
            var isValid = true;
            var errorMessage = {};
            var agreementCategory = 2; //Lease
            vm.isIndividualCustomerRadio = true;
            vm.isTotalDaysAndHrs = false;
            vm.endDatePickerOptions = {};
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

            vm.isInitialized = false;
            $timeout(function () {
                vm.isInitialized = true;
            }, 100);
            $scope.$watch(
                function () {
                    return vm.endDatePickerOptions;
                },
                function (newVal) {
                    if (!newVal || !newVal.maxDate) return;

                    app.waitUntilElementIsReady('[name="inDetail_dateTime"]', function () {

                        var $el = $('[name="inDetail_dateTime"]');

                        if ($el.data('DateTimePicker')) {
                            $el.data('DateTimePicker').minDate(newVal.minDate);
                            $el.data('DateTimePicker').maxDate(newVal.maxDate);
                        }
                    });
                },
                true
            );

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
                    //chargesRow.rate = chargesRow.discountedRate > chargesRow.rate ? chargesRow.discountedRate : chargesRow.rate;
                });
            }

            vm.applyDiscount = function (chargesRow) {

                openApplyDiscountModal(chargesRow);
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
            vm.totalDaysAndTime = function () {
                if (!vm.isInitialized || !$scope.vm.noOfMonthsManualEdit || !$scope.vm.endDateManualEdit || !$scope.vm.totalTimeManualEdit) return;

                var startDate = moment(vm.agreement.movements[0].outDetail.dateTime, "DD-MM-YYYY hh:mm");
                var endDate = moment(vm.agreement.endDate, "DD-MM-YYYY hh:mm");
                if (startDate.isValid() && endDate.isValid()) {
                    vm.isTotalDaysAndHrs = true;
                    var duration = moment.duration(moment(endDate.format("LLLL")).diff(moment(startDate.format("LLLL"))));
                    vm.totalDays = moment(endDate.format("LLLL")).diff(moment(startDate.format("LLLL")), 'days');
                    vm.remainingHrs = utilities.round(duration.hours() + (duration.minutes() / 60), 2);
                }
                else {
                    vm.isTotalDaysAndHrs = false;
                }
            };
            vm.noOfMonthsChange = function () {
                if (!vm.isInitialized || !$scope.vm.noOfMonthsManualEdit || !$scope.vm.totalTimeManualEdit) return;

                if (vm.agreement.movements[0].outDetail.dateTime) {
                    vm.agreement.endDate = moment(vm.agreement.movements[0].outDetail.dateTime).add(vm.agreement.noOfMonths, 'M');
                    //vm.endDateChanged();
                    vm.calculate();
                }
            };

            function allFuelLevels() {
                vm.allFuelLevels = utilities.allFuelLevels();
            };
            vm.localize = function (input) {
                return app.localize(input);
            };

            vm.localizeChargesType = function (chargesRow) {
                if (chargesRow.chargesTypeId == 2 && chargesRow.excessRate == 0 && chargesRow.accepted)
                    return app.localize("SCDW");
                return app.localize(chargesRow.chargesType.name);
            };

            vm.driverChargesPopoup = function () {
                var modalInstance = openDriverChargesModel();
                modalInstance.result.then(function (result) {
                    if (result != null)
                        vm.agreement.charges = result;
                });
            };
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
            //date change calls on loading data first time in edit mode. disable tariff loading if it is first time loading of editing mode
            var startDateLoaded = false;
            vm.startDateChanged = function () {
                if (!vm.isInitialized || !$scope.vm.startDateManualEdit) return;
                if (vm.agreement.noOfMonths)
                    vm.agreement.endDate = moment(vm.agreement.movements[0].outDetail.dateTime).add(vm.agreement.noOfMonths, 'M');
                if (!vm.isEditMod) {
                    if (isTariffEnabled && !notLoadTariff)
                        tariffHelper.applyTariff(vm.agreement);
                }
                else
                    startDateLoaded = true;
            };
            vm.searchAdditionalDrivers = function ($select) {
                if (!$select.search) return;
                return directoryService.searchPersonStaffCustomer({ keyword: $select.search }).then(function (response) {
                    vm.additionaldrivers = response.data.items;
                });
            };

            var endDateLoaded = false;
            vm.endDateChanged = function () {
                if (!vm.isInitialized || !$scope.vm.endDateManualEdit || !$scope.vm.totalTimeManualEdit) return;

                if (vm.agreement.movements && vm.agreement.movements[0].outDetail.dateTime && vm.agreement.endDate) {
                    var startDate = moment(vm.agreement.movements[0].outDetail.dateTime, "DD-MM-YYYY hh:mm");
                    var endDate = moment(vm.agreement.endDate, "DD-MM-YYYY hh:mm");

                    if (startDate.isValid() && endDate.isValid()) {
                        var monthsDiff = endDate.diff(startDate, 'months', true);
                        vm.agreement.noOfMonths = Math.round(monthsDiff);
                        vm.calculate();
                    }
                }

                if (!vm.isEditMod) {
                    if (isTariffEnabled && !notLoadTariff)
                        tariffHelper.applyTariff(vm.agreement);
                }
                else {
                    endDateLoaded = true;
                }
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
            vm.searchDrivers = function ($select) {
                if (!$select.search) return;
                //whereas contactCategory: 1 (person). get all persons which includes staff as well
                return directoryService.search({ keyword: $select.search, contactCategory: 1 }).then(function (response) {
                    vm.drivers = response.data.items;
                });
            };

            vm.searchDriverPopoup = function () {
                //var modalInstance = openSearchContactModel(1, null);

                var type = null;
                if (vm.agreement.driverType == 2) type = 1;
                if (vm.agreement.driverType == 3) type = 6;
                var modalInstance = openSearchContactModel(1, type, (vm.agreement.customer.contactCategory == 2 && vm.agreement.driverType == 3));

                modalInstance.result.then(function (result) {
                    if (result != null)
                        vm.agreement.driver = result;
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
                vm.agreement.movements[0].outDetail.makeAndModel = vm.agreement.vehicle.make + ' ' + vm.agreement.vehicle.model;

                var groupId = vm.agreement.vehicle.tariffGroupId;
                if (groupId == null) groupId = -1;

                if (isTariffEnabled && !vm.isEditMod && !notLoadTariff) {
                    //load and apply tariff
                    tariffHelper.loadTariff(groupId, agreementCategory, function () {
                        tariffHelper.applyTariff(vm.agreement);
                    });
                }
            };

            vm.customerSelected = function () {
                getCustomerPicture(vm.agreement.customer.id);

                //if contact (i.e individual person)
                if (vm.agreement.customer.contactCategory == 1) {
                    vm.agreement.driver = vm.agreement.customer;
                    vm.driverSelected();
                    vm.isIndividualCustomerRadio = true;
                    vm.agreement.driverType = 1;
                    vm.individualCustomerRadioSelected();
                }
                if (vm.agreement.customer.contactCategory == 2) {
                    //  vm.isCompany = true;
                    vm.isIndividualCustomerRadio = false;
                    vm.agreement.driverType = 3;
                    vm.individualCustomerRadioSelected();
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
                vm.agreement.salesPersonId = vm.agreement.customer.salesPerson != null ? vm.agreement.customer.salesPerson.id : null;


                vm.agreement.saleOrder = null;
                vm.agreement.saleOrderId = null;
            };


            vm.searchSaleOrders = function ($select) {
                if (!$select.search) return;
                return agreementSaleOrderService.searchSaleOrdersForAgreement({ keyword: $select.search, contactId: vm.agreement.customer.id }).then(function (response) {
                    vm.saleOrders = response.data.items;
                });
            };


            vm.commonDriverSearch = function (contactCategoryId, contactTypeId) {
                vm.searchDrivers = function ($select) {
                    if (!$select.search) return;
                    //whereas contactCategory: 1 (person). get all persons which includes staff as well
                    return directoryService.search({ keyword: $select.search, contactCategory: contactCategoryId, contactType: contactTypeId }).then(function (response) {
                        vm.drivers = response.data.items;
                    });
                };
            }



            vm.individualCustomerRadioSelected = function () {
                //individual
                if (vm.agreement.customer.contactCategory == 1) {
                    if (vm.agreement.driverType == 1) {
                        vm.agreement.driver = null;
                        //vm.searchDrivers = function ($select) {
                        //    if (!$select.search) return;
                        //    //whereas contactCategory: 1 (person). get all persons which includes staff as well
                        //    return directoryService.search({ keyword: $select.search, contactCategory: 1 }).then(function (response) {
                        //        vm.drivers = response.data.items;
                        //    });
                        //};
                        vm.commonDriverSearch(1, null);
                        if (vm.agreement.customer != null) {
                            vm.agreement.driver = vm.agreement.customer;
                            vm.driverSelected();
                        }
                    }
                    else if (vm.agreement.driverType == 2) {
                        vm.agreement.driver = null;
                        //vm.searchDrivers = function ($select) {
                        //    if (!$select.search) return;
                        //    //whereas contactCategory: 1 (person), contactType: 1 (staff)
                        //    return directoryService.search({ keyword: $select.search, contactCategory: 1, contactType:1 }).then(function (response) {
                        //        vm.drivers = response.data.items;
                        //    });
                        //};

                        vm.commonDriverSearch(1, 1);
                    }
                    else if (vm.agreement.driverType == 4) {
                        vm.agreement.driver = null;
                        vm.searchDrivers = function ($select) {
                            if (!$select.search) return;
                            //whereas contactCategory: 1 (person), Exclude staff 
                            return directoryService.search({ keyword: $select.search, contactCategory: 1 }).then(function (response) {
                                var staffExcludedData = response.data.items.filter(e => e.contactType != 1);
                                vm.drivers = staffExcludedData;
                            });
                        };
                    }
                }
                // company
                else if (vm.agreement.customer.contactCategory == 2) {
                    if (vm.agreement.driverType == 3) {
                        vm.agreement.driver = null;
                        vm.searchDrivers = function ($select) {
                            if (!$select.search) return;
                            //whereas contactCategory: 2 (company), contactType: 1 (staff)
                            return directoryService.searchForCompany({ keyword: $select.search, companyId: vm.agreement.customer.id }).then(function (response) {
                                vm.drivers = response.data;
                            });
                        };
                    }
                    else if (vm.agreement.driverType == 2) {

                        vm.agreement.driver = null;
                        //vm.searchDrivers = function ($select) {
                        //    if (!$select.search) return;
                        //    //whereas contactCategory: 2 (company), contactType: 1 (staff)
                        //    return directoryService.search({ keyword: $select.search, contactCategory: 1, contactType: 1 }).then(function (response) {
                        //        vm.drivers = response.data.items;
                        //    });
                        //};
                        vm.commonDriverSearch(1, 1);
                    }

                    else if (vm.agreement.driverType == 4) {
                        vm.agreement.driver = null;
                        vm.searchDrivers = function ($select) {
                            if (!$select.search) return;
                            //whereas contactCategory: 2 (company), Exclude staff 
                            return directoryService.search({ keyword: $select.search, contactCategory: 1 }).then(function (response) {
                                var staffExcludedData = response.data.items.filter(e => e.contactType != 1);
                                vm.drivers = staffExcludedData;
                            });
                        };
                    }
                }
            };


            vm.driverSelected = function () {
                if (isTariffEnabled && !vm.isEditMod && !notLoadTariff)
                    tariffHelper.applyTariff(vm.agreement);
                vm.loading = true;
                vm.multipleAccidentsDriver = false;
                accidentService.checkRepeatedAccidentsOnDriver({ id: vm.agreement.driver.id })
                    .success(function (result) {
                        if (result)
                            vm.multipleAccidentsDriver = true;
                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            };

            vm.additionalDriverSelected = function () {
                if (isTariffEnabled && !vm.isEditMod && !notLoadTariff)
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
                                tariffGroup: vm.vehicleType,
                                tariffGroupId: vm.vehicleType != null ? vm.vehicleType.id : null,
                                modelId: vm.vehicleModelId,
                                model: vm.vehicleModel,
                                statusId: 'IDL',
                                subStatuses: [1, 7],
                                source: 'openagreement',
                                selectable: true,
                                doNotIncludeReplacementVehicle: doNotIncludeReplacementVehicle
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

            //function openSearchContactModel(category, type) {
            //    return $uibModal.open({
            //        templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
            //        controller: 'tenant.views.crs.contacts.searchContactModal as vm',
            //        backdrop: 'static',
            //        resolve: {
            //            category: function () {
            //                return category;
            //            },
            //            type: function () {
            //                return type;
            //            }
            //        }
            //    });
            //}

            function openSearchContactModel(category, type, isOnlyCorporate = false) {
                var companyIdToForward = vm.agreement.customer ? vm.agreement.customer.id : null;

                return $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactOptionModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactOptionModal as vm',
                    backdrop: 'static',
                    resolve: {
                        options: function () {
                            return {
                                category: category,
                                type: type,
                                isOnlyCorporate: isOnlyCorporate,
                                companyId: companyIdToForward
                            }
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
                if (vm.agreement.movements[0].outDetail.dateTime > moment().endOf('day') && !enableFutureAgreementCheckOuts) {
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

            //function openAgreementAdvanceAndDepositModel() {
            //  
            //    vm.saving = true;
            //    var modalInstance = $uibModal.open({
            //        templateUrl: '~/App/tenant/views/crs/agreements/agreementAdvanceAndDeposit.cshtml',
            //        controller: 'tenant.views.crs.agreements.agreementAdvanceAndDeposit as vm',
            //        backdrop: 'static',
            //        //size: 'sm',
            //        resolve: {
            //            options: function () {
            //                return {
            //                    agreement: agreement,
            //                    advance: receipt,
            //                    securityDeposit: securityDeposit,
            //                };
            //            }
            //        }
            //    });
            //    modalInstance.result.then(function (result) {
            //      
            //        //If result.save that came from $uibModal in agreementAdvanceAndDeposit.js is true, loading will be shown on save button.
            //        vm.saving = result.save;
            //        if (result.save) {
            //            vm.agreement.advance = result.advance;
            //            vm.agreement.securityDeposit = result.securityDeposit;
            //            saveAgreementWithReceipt();
            //        }

            //    });
            //}

            vm.save = function () {
                vm.saving = true;
                validate();

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
                            if (vm.deposit.voucherSubTypeId != 11) // all types except pre authorization
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

                if (vm.preTermValid() && vm.isCreateLeaseAgreementByWizardEnabled) {
                    abp.message.info(app.localize(errorMessage + 'Pre-Termination row should have valid data.'));
                    vm.saving = false;
                } else {
                    if (isValid) {
                        //update ids for selected records
                        vm.agreement.vehicleId = vm.agreement.vehicle.id;
                        vm.agreement.customerId = vm.agreement.customer.id;
                        vm.agreement.driverId = vm.agreement.driver.id;
                        if (vm.deposit)
                            vm.agreement.deposit = vm.deposit.amount;
                        if (vm.advance)
                            vm.agreement.advance = vm.advance.amount;
                        if (vm.agreement.customer.contactCategory != 2)
                            vm.agreement.poNo = null;

                        if (vm.agreement.additionalDriver != null)
                            vm.agreement.additionalDriverId = vm.agreement.additionalDriver.id;

                        if (vm.agreement.salesPerson != null)
                            vm.agreement.salesPersonId = vm.agreement.salesPerson.id;
                        else
                            vm.agreement.salesPersonId = null;

                        if (!vm.agreement.customer.contactCategory == 2 && !vm.isSaleOrderEnabled) {
                            vm.agreement.saleOrderId = null;
                        }

                        leaseAgreementService.createOrUpdateLeaseAgreement({
                            agreement: vm.agreement,
                            advance: vm.advance,
                            deposit: vm.deposit,
                            discountAuthCodeId: vm.discountAuthCode == null ? null : vm.discountAuthCode.id,
                        }).success(function (result) {
                            abp.notify.info(app.localize('SavedSuccessfully'));

                            $uibModalInstance.close(result);
                        }).finally(function () {
                            vm.saving = false;
                        });
                    } else {
                        abp.message.info(app.localize(errorMessage));
                        vm.saving = false;
                    }
                }
            }

            vm.cancel = function () {
                $uibModalInstance.dismiss();
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
                        var chargesRow = {
                            agreementId: null,
                            order: vm.chargesSettings[i].order,
                            chargesTypeId: vm.chargesSettings[i].chargesTypeId,
                            rateTypeId: vm.chargesSettings[i].rateTypeId,
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
                        };

                        if (chargesLines && chargesLines.length > 0) {
                            if (chargesLines.some(e => e.chargesTypeId == chargesRow.chargesTypeId)) {
                                var filteredRow = chargesLines.filter(e => e.chargesTypeId == chargesRow.chargesTypeId)[0];
                                chargesRow.rate = utilities.round(filteredRow.rate, 2);
                                chargesRow.limit = filteredRow.limit;
                                chargesRow.excessRate = filteredRow.excessRate;
                                chargesRow.included = filteredRow.included;
                                chargesRow.accepted = filteredRow.accepted;
                                if (chargesRow.rate > 0) {
                                    chargesRow.accepted = true;
                                }

                            }
                        }

                        vm.agreement.charges.push(chargesRow);
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

            vm.calculate = function () {
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

            function init() {
                allFuelLevels();
                vm.loading = true;
                leaseAgreementService.getLeaseAgreementWithAdvanceAndDepositForEdit({
                    id: agreementId
                }).success(function (result) {
                    vm.agreement = result.agreement;
                    if (vm.agreement.customer)
                        getCustomerPicture(vm.agreement.customer.id);

                    if (vm.isMultiCurrencyEnabled && vm.agreement.customer)
                        vm.agreement.customer.currency = vm.agreement.customer.currency.code;
                    if (vm.agreement.vehicle != null) {
                        vm.agreement.movements[vm.agreement.movements.length - 1].outDetail.makeAndModel = vm.agreement.vehicle.make + ' ' + vm.agreement.vehicle.model.name;
                    }
                    vm.advance = result.advance;
                    vm.deposit = result.deposit;

                    if (vm.isCreateLeaseAgreementByWizardEnabled && !(vm.agreement.preTerminationRules && vm.agreement.preTerminationRules.length))
                        vm.addPreTerminationRuleRow();

                    if (vm.agreement.id > 0) {
                        vm.isEditMod = true;
                        vm.agreementTaxPercent = vm.agreement.taxPercent;
                        vm.agreement.endDate = utilities.jsonUtcDateToLocalMoment(vm.agreement.endDate);
                        vm.endDatePickerOptions = app.createAgreementExtendDatePickerOptions(
                            vm.agreement.endDate
                        );
                        vm.agreement.noOfMonths = vm.agreement.endDate.diff(moment(vm.agreement.movements[0].outDetail.dateTime), 'months');
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
                        if (vm.deposit.voucherSubTypeId && vm.deposit.voucherSubTypeId != 11) // all types except pre authorization
                        {
                            var td = moment(vm.deposit.toDate);
                            var duration = moment.duration(td.diff(vm.deposit.fromDate));
                            vm.deposit.holdForDays = duration.asDays();
                        }


                        if (vm.agreement.customer.contactCategory == 1) {
                            vm.isIndividualCustomerRadio = true;
                        }
                        else if (vm.agreement.customer.contactCategory == 2) {
                            vm.isIndividualCustomerRadio = false;
                        }
                    } else {
                        vm.agreement.agreementNo = null;
                        vm.isEditMod = false;
                        vm.agreement.driverType = 1;
                    }

                    loadChargesFromSettings();
                    vm.taxAccepted = vm.agreement.taxPercent > 0 ? true : false;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.preTermValid = function () {
                if (vm.agreement.preTerminationRules.length) {
                    var row = vm.agreement.preTerminationRules[0];
                    if (row &&
                        row.fromMonth &&
                        row.toMonth &&
                        row.type > 0 &&
                        row.penalityValue > 0)
                        return false;
                    else
                        return true;
                } else
                    return true;
            }

            init();
        }
    ]);
