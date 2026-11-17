// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:412644-413425
appModule.controller('tenant.views.externalLogin.bookings.createOrEditModal', [
        '$scope', '$uibModal', 'utilities', '$uibModalInstance', 'bookingId', 'abp.services.app.vehicle', 'abp.services.app.directory', 'chargesSettings', 'abp.services.app.tariffLocation',
        'abp.services.app.commonLookup', 'abp.services.app.externalBooking', 'abp.services.app.tariff', 'tariffHelper', 'chargesCalculator', 'appSession', '$filter', 'abp.services.app.tariffCard',
        function ($scope, $uibModal, utilities, $uibModalInstance, bookingId, vehicleService, directoryService, chargesSettings, tariffLocationService, lookupService, externalBookingService,
            tariffService, tariffHelper, chargesCalculator, appSession, $filter, tariffCardService) {

            var vm = this;
            vm.isSixt = appSession.tenant.tenancyName.toLowerCase() == 'sixtqatar';
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.isTaxOptional = utilities.parseBoolean(abp.setting.get("App.General.IsTaxOptional"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.enableManualBookingNo = utilities.parseBoolean(abp.setting.get("App.General.EnableManualBookingNo"));
            vm.isEmailEnabled = true;// abp.features.isEnabled("Notifications.EmailBooking"),
            vm.taxAccepted = false;
            vm.isWeeklyMonthlyEnabled = utilities.parseBoolean(abp.setting.get("App.General.WeeklyMonthlyRental"));
            vm.allActionOnOtherBranchBookings = abp.auth.hasPermission('Pages.Tenant.Bookings.AllActionsOnOtherBranchBookings');
            vm.loading = false;
            vm.isTariffCardExplicitSelection = utilities.parseBoolean(abp.setting.get("App.General.TariffCardExplicitSelection"));
            vm.isTariffCardEnable = abp.features.isEnabled("CRS.Tariff.TariffCards");
            vm.advance = {};
            vm.chargesSettings = chargesSettings;
            vm.isEditMod = bookingId ? true : false;
            vm.reset = false;
            vm.saved = false;
            vm.savedOnce = false;
            vm.vehicles = [];
            vm.customers = [];
            var isValid = true;
            var errorMessage = {};
            vm.drivers = [];
            vm.tariffCards = [];
            vm.tariffCard = null;
            vm.isIndividualCustomerRadio = true;
            vm.discountCodeId = null;
            var isTariffEnabled = abp.features.isEnabled("CRS.Tariff");
            vm.isUserWiseDiscountEnable = abp.features.isEnabled("CRS.UserWiseDiscount");
            vm.discountAuthCode = null;
            vm.agreementTypes = [
                { type: "Daily", id: 1 },
                { type: "Weekly", id: 2 },
                { type: "Monthly", id: 3 }
            ];
            vm.searchGoogleLocations = function ($select) {
                if ($select.search == "") { vm.vehicles = null; return null; }
                lookupService.searchGooglePlaces({ keyWord: $select.search }).then(function (response) {
                    vm.geoLocations = response.data.items;
                });
            };
            vm.rounding = function (value) {
                if (!value) return;
                return utilities.round(value, 2);
            };
            vm.otherPickUpLocationChanged = function () {
                if (vm.otherPickUpLocation)
                    vm.agreement.locationId = null;
                else
                    vm.agreement.pickupLocation = null;
            };
            vm.otherDropoffLocationChanged = function () {
                if (vm.otherDropoffLocation)
                    vm.agreement.closingLocationId = null;
                else
                    vm.agreement.dropoffLocation = null;
            };
            var rateTypes = {
                perDay: { id: 1, name: '/Day' },
                perWeek: { id: 2, name: '/Week' },
                perMonth: { id: 3, name: '/Month' },
            };
            vm.localize = function (input) {
                return app.localize(input);
            };

            // Vehicle Search
            vm.searchVehicles = function ($select) {
                if ($select.search == "") { vm.vehicles = null; return null; }
                return vehicleService.searchVehicles({ plateNo: $select.search, tariffGroupId: vm.agreement.tariffGroupId, source: 'booking' }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };


            vm.driverSelected = function () {
                if (isTariffEnabled && !vm.isEditMod)
                    tariffHelper.applyTariff(vm.agreement);
            };


            //vm.searchDrivers = function ($select) {
            //    //whereas contactCategory: 1 (person). get all persons which includes staff as well
            //    return directoryService.search({ keyword: $select.search, contactCategory: 1 }).then(function (response) {
            //        vm.drivers = response.data.items;
            //    });
            //};

            vm.commonDriverSearch = function (contactCategoryId, contactTypeId) {
                vm.searchDrivers = function ($select) {
                    if (!$select.search) return;
                    //whereas contactCategory: 1 (person). get all persons which includes staff as well
                    return directoryService.search({ keyword: $select.search, contactCategory: contactCategoryId, contactType: contactTypeId }).then(function (response) {
                        vm.drivers = response.data.items;
                    });
                };
            }

            //vm.searchDriverPopoup = function () {
            //    var modalInstance = openSearchContactModel(1, null);

            //    modalInstance.result.then(function (result) {
            //        if (result != null)
            //            vm.agreement.driver = result;
            //    });
            //};


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

            vm.changeStatusReceiptCreation = function () {
                if (vm.advance.amount > 0)
                    vm.showAdvancePopupOnSave = true;
                else
                    vm.showAdvancePopupOnSave = false;
            };

            //vm.searchVehiclePopup = function () {
            //    openSearchVehicleModal(vm.agreement.tariffGroup);
            //};

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
                if (isTariffEnabled)
                    tariffHelper.applyTariff(vm.agreement);
            };


            //function openSearchVehicleModal(tariffGroup) {

            //    var modalInstance = $uibModal.open({
            //        templateUrl: '~/App/tenant/views/crs/vehicles/searchVehicleModal.cshtml',
            //        controller: 'tenant.views.crs.vehicles.searchVehicleModal as vm',
            //        backdrop: 'static',
            //        size: 'lg',
            //        resolve: {
            //            options: function () {
            //                return {
            //                    fromDateTime: moment(vm.agreement.startDate ? vm.agreement.startDate : moment().startOf('day')).utc(),
            //                    toDateTime: moment(vm.agreement.endDate ? vm.agreement.endDate : moment().endOf('day')).utc(),
            //                    tariffGroup: tariffGroup,
            //                    statusId: null,
            //                    selectable: true,
            //                    source: 'booking'
            //                };
            //            }
            //        }

            //    });
            //    modalInstance.result.then(function (result) {
            //        if (result != null) {
            //            vm.agreement.vehicle = result;
            //            vm.agreement.tariffGroup = result.tariffGroup;

            //            var make = vm.agreement.vehicle.model.make == null ? vm.agreement.vehicle.make : vm.agreement.vehicle.model.make;
            //            var model = vm.agreement.vehicle.model.name == null ? vm.agreement.vehicle.model : vm.agreement.vehicle.model.name;

            //            //  vm.vehicleMakeAndModel = vm.agreement.vehicle.model.make + " " + vm.agreement.vehicle.model.name;
            //            vm.vehicleMakeAndModel = make + " " + model;
            //            var groupId = vm.agreement.tariffGroup == null ? null : vm.agreement.tariffGroup.id;
            //            if (groupId == null) groupId = -1;
            //            if (isTariffEnabled) {
            //                //load and apply tariff
            //                tariffHelper.loadTariff(groupId, function () {
            //                    tariffHelper.applyTariff(vm.agreement);
            //                });
            //            }
            //        }
            //    });
            //}

            //date change calls on loading data first time in edit mode. disable tariff loading if it is first time loading of editing mode
            var startDateLoaded = false;
            vm.startDateChanged = function () {
                if ((vm.isEditMod && startDateLoaded && endDateLoaded) || !vm.isEditMod) {
                    if (isTariffEnabled)
                        tariffHelper.applyTariff(vm.agreement);
                }
                else
                    startDateLoaded = true;
            };

            var endDateLoaded = false;
            vm.endDateChanged = function () {

                if ((vm.isEditMod && startDateLoaded && endDateLoaded) || !vm.isEditMod) {
                    if (isTariffEnabled)
                        tariffHelper.applyTariff(vm.agreement);
                }
                else
                    endDateLoaded = true;
            };

            vm.calculate = function () {
                if (vm.agreement && vm.agreement.charges) {
                    var foundLines = $filter('filter')(vm.agreement.charges, {
                        chargesTypeId: 1
                    }, true);
                    if (foundLines.length == 1) {
                        if (foundLines[0].discountPercent > 0) {
                            foundLines[0].discountedRate = foundLines[0].rate - (foundLines[0].rate * (foundLines[0].discountPercent / 100));
                        }
                    }
                }
                return chargesCalculator.calculate(vm.agreement);
            };

            vm.tariffGroupSelected = function () {
                vm.agreement.vehicle = null;
                var groupId = vm.agreement.tariffGroup.id;
                vm.agreement.tariffGroupId = groupId;
                if (groupId == null) groupId = -1;

                if (isTariffEnabled) {
                    //load and apply tariff
                    tariffHelper.loadTariff(groupId, vm.agreement.agreementCategory, function () {
                        tariffHelper.applyTariff(vm.agreement);
                    }, vm.tariffCard);
                }
            };

            vm.tariffOptionSelected = function (chargesRow, tariffLine) {
                chargesRow.included = tariffLine.included;
                chargesRow.rate = tariffLine.rate;
                chargesRow.excessRate = tariffLine.excessRate;
                chargesRow.limit = tariffLine.limit;
            };
            vm.disableRate = function (chargesRow) {
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

            // search from dropdown
            vm.searchCustomers = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            //  extended search using search customer popup
            vm.searchCustomerPopoup = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return null;
                        },
                        type: function () {
                            return 2;
                        }
                    }
                }).result.then(function (result) {
                    if (result != null) {
                        vm.onCustomerSelect(result);
                    }
                });
            };


            vm.searchDrivers = function ($select) {
                //whereas contactCategory: 1 (person). get all persons which includes staff as well
                return directoryService.search({ keyword: $select.search, contactCategory: 1 }).then(function (response) {
                    vm.drivers = response.data.items;
                });
            };

            vm.vehicleSelected = function () {
                vm.agreement.movements[0].outDetail.fuelLevel = vm.agreement.vehicle.fuelLevel;
                vm.agreement.movements[0].outDetail.km = vm.agreement.vehicle.kMs;
            };

            //vm.getTariffCards = function () {
            //    vm.loading = true;
            //    tariffCardService.getTariffCards({}).success(function (data) {
            //        vm.tariffCards = data.items;
            //        vm.tariffCards.unshift({ id: null, name: app.localize("DefaultTariff") });
            //    }).finally(function () {
            //        vm.loading = false;
            //    });
            //};
            vm.getTariffCards = function () {

                tariffCardService.getTariffCards({}).success(function (data) {
                    vm.tariffCards = data.items;
                    vm.tariffCards.unshift({ id: null, name: app.localize("DefaultTariff") });
                }).finally(function () {

                });
            };

            vm.tariffCardSelected = function () {
                if (isTariffEnabled)
                    tariffHelper.applyTariff(vm.agreement);
            }

            vm.onCustomerSelect = function (customer) {
                vm.advance = {};
                vm.agreement.customer = customer;
                vm.agreement.driver = vm.agreement.customer;

                if (vm.agreement.customer.contactCategory == 1) {
                    vm.driverSelected();
                    vm.isIndividualCustomerRadio = true;
                    vm.agreement.driverType = 1;
                    vm.individualCustomerRadioSelected();
                }
                if (vm.agreement.customer.contactCategory == 2) {
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
                if (isTariffEnabled)
                    tariffHelper.applyTariff(vm.agreement);
            };

            vm.individualCustomerRadioSelected = function () {
                //individual
                if (vm.agreement.customer.contactCategory == 1) {
                    if (vm.agreement.driverType == 1) {
                        vm.agreement.driver = null;
                        vm.commonDriverSearch(1, null);
                        if (vm.agreement.customer != null) {
                            vm.agreement.driver = vm.agreement.customer;
                            vm.driverSelected();
                        }
                    }
                    else if (vm.agreement.driverType == 2) {
                        vm.agreement.driver = null;
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
            }

            //vm.onVehicleSelect = function (vehicle) {
            //    vm.vehicleMakeAndModel = vehicle.make + " " + vehicle.model;
            //};

            // Validating CreateOrUpdateAgreement 
            function validate() {
                if (vm.agreement.endDate != null) {
                    if (moment(vm.agreement.startDate) > moment(vm.agreement.endDate)) {
                        abp.message.info("DropOff Date Can Not Less Than PickUp Date");
                        vm.isValid = false;
                    }
                }

                //if (vm.advance && vm.advance.amount) {
                //    if (chargesCalculator.calculate(vm.agreement) < vm.advance.amount) {
                //        abp.message.info("Advance is more than Total Charge.");
                //        vm.isValid = false;
                //    }
                //}
            }

            vm.save = function () {
                vm.isValid = true;
                vm.saving = true;
                if (vm.agreement.customer)
                    vm.agreement.customerId = vm.agreement.customer.id;
                vm.agreement.IsBooking = true;
                vm.agreement.tariffGroupId = vm.agreement.tariffGroup.id;

                if (vm.agreement.vehicle != null)
                    vm.agreement.vehicleId = vm.agreement.vehicle.id;

                vm.agreement.tariffCardId = vm.tariffCard;

                validate();

                if (vm.isValid === true) {
                    //if (vm.showAdvancePopupOnSave /*&& vm.isEditMod == false*/) {
                    //    var modalInstance = $uibModal.open({
                    //        templateUrl: '~/App/tenant/views/crs/bookings/bookingAdvance.cshtml',
                    //        controller: 'tenant.views.crs.bookings.bookingAdvance as vm',
                    //        backdrop: 'static',
                    //        size: 'lg',
                    //        resolve: {
                    //            options: function () {
                    //                return {
                    //                    agreement: vm.agreement,
                    //                    advance: vm.advance,
                    //                    totalAmount: vm.calculate()
                    //                };
                    //            }
                    //        }
                    //    });
                    //    modalInstance.result.then(function (result) {
                    //        var contineSaving = result.save;
                    //        if (contineSaving == true) {
                    //            vm.saving = result.save; //saving cacelled on popup
                    //            save();
                    //        } else {
                    //            vm.saving = false;
                    //        }
                    //    });

                    //} else {
                    save();
                    //}
                } else {
                    vm.saving = false;
                }

            };

            function save() {
                vm.reset = true;
                vm.saved = true;
                vm.savedOnce = true;

                externalBookingService.createOrUpdateBooking({
                    booking: vm.agreement,
                    advance: vm.advance,
                    discountAuthCodeId: vm.discountAuthCode == null ? null : vm.discountAuthCode.id
                }).success(function (result) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    vm.agreement.agreementNo = result.agreementNo;
                    vm.agreement.id = result.id;
                    if (vm.isEditMod)
                        $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            }

            //  Loading Charges 
            function loadChargesFromSettings() {
                //if new agreement then load charges detail from settings
                if (vm.isEditMod == false) {
                    vm.agreement.charges.length = 0;    //clear charges list

                    //navigation charges settings and add charges rows in agreement charges list
                    for (var i = 0; i < vm.chargesSettings.length; i++) {
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
                            }
                        );
                    }
                }
            }

            //function openApplyDiscountModal(chargesRow) {
            //    var modalInstance = $uibModal.open({
            //        templateUrl: '~/App/tenant/views/crs/discountCodes/applyDiscountModal.cshtml',
            //        controller: 'tenant.views.crs.discountCodes.applyDiscountModal as vm',
            //        backdrop: 'static',
            //        resolve: {
            //            options: function () {
            //                return {
            //                    chargesRow: chargesRow,
            //                    discountAuthCode: vm.discountAuthCode
            //                };
            //            }
            //        }
            //    });
            //    modalInstance.result.then(function (result) {
            //        vm.discountAuthCode = result.discountAuthCode;
            //        chargesRow.discountPercent = result.chargesRow.discountPercent;
            //        chargesRow.discountedRate = result.chargesRow.discountedRate;
            //        chargesRow.rate = chargesRow.discountedRate > chargesRow.rate ? chargesRow.discountedRate : chargesRow.rate;
            //    });
            //}

            //vm.applyDiscount = function (chargesRow) {
            //    openApplyDiscountModal(chargesRow);
            //};

            vm.cancel = function () {
                if (vm.savedOnce)
                    $uibModalInstance.close();
                else
                    $uibModalInstance.dismiss();
            };

            vm.getTariffLocations = function () {
                {

                    tariffLocationService.getTariffLocations({}).success(function (data) {
                        vm.tariffLocations = data.items;
                    }).finally(function () {

                    });
                }
            };

            vm.getTariffGroups = function () {

                lookupService.getTariffGroups({})
                    .success(function (result) {
                        vm.tariffGroups = result.items;
                    }).finally(function () {

                    });
            };

            // includedChanged New
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

            //vm.showTaxCollectionReport = function () {
            //    $uibModal.open({
            //        templateUrl: '~/App/tenant/views/crs/taxCollections/index.cshtml',
            //        controller: 'tenant.views.crs.taxCollections.index as vm',
            //        backdrop: 'static'
            //    }).result.then(function (result) {
            //        if (result != null) {
            //            vm.onCustomerSelect(result);
            //        }
            //    });
            //};
            function getLocations() {


                lookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                }).finally(function () {

                });
            }

            vm.totalDaysAndTime = function () {
                var startDate = moment(vm.agreement.startDate, "DD/MM/YYYY hh:mm");
                var endDate = moment(vm.agreement.endDate, "DD/MM/YYYY hh:mm");

                if (startDate.isValid() && endDate.isValid()) {

                    var duration = moment.duration(moment(endDate.format("LLLL")).diff(moment(startDate.format("LLLL"))));
                    // vm.totalDays = duration.days();
                    vm.totalDays = moment(endDate.format("LLLL")).diff(moment(startDate.format("LLLL")), 'days');
                    vm.remainingHrs = utilities.round(duration.hours() + (duration.minutes() / 60), 2);



                    //var duration = moment.duration(moment(endDate.format("LLLL")).diff(moment(startDate.format("LLLL"))));
                    //vm.totalDays = duration.days();
                    //vm.remainingHrs = utilities.round(duration.hours() + (duration.minutes() / 60), 2);


                    //vm.totalDays = moment(endDate.format("LLLL")).diff(moment(startDate.format("LLLL")), 'days');
                    //var totalHrs = moment(endDate.format("LLLL")).diff(moment(startDate.format("LLLL")), 'hours');
                    //vm.remainingHrs = totalHrs - (vm.totalDays * 24);
                }
                else {
                    var startDate = moment(vm.agreement.startDate);
                    var endDate = moment(vm.agreement.endDate);

                    if (startDate.isValid() && endDate.isValid()) {
                        vm.totalDays = moment(endDate.format("LLLL")).diff(moment(startDate.format("LLLL")), 'days');
                        var totalHrs = moment(endDate.format("LLLL")).diff(moment(startDate.format("LLLL")), 'hours');
                        vm.remainingHrs = totalHrs - (vm.totalDays * 24);
                    }

                }
            };

            function init() {
                vm.loading = true;
                getLocations();
                // getting TariffLocations
                vm.getTariffLocations();
                vm.getTariffGroups();
                externalBookingService.getBookingWithAdvanceForEdit({
                    id: bookingId
                }).success(function (result) {
                    vm.agreement = result.booking;
                    vm.tariffCard = vm.agreement.tariffCardId;
                    vm.advance = result.advance;
                    //vm.agreement.movements[0].outDetail.km = 2;
                    if (vm.agreement.id > 0) {
                        if (vm.agreement.vehicle)
                            vm.vehicleMakeAndModel = vm.agreement.vehicle.make + " " + vm.agreement.vehicle.model.name;

                        vm.agreementTaxPercent = vm.agreement.taxPercent;
                        vm.otherPickUpLocation = vm.agreement.pickupLocation != null ? true : false;
                        vm.otherDropoffLocation = vm.agreement.dropoffLocation != null ? true : false;
                        //  vm.agreement.driver =
                        //    vm.agreement.customer;
                        if (vm.agreement && vm.agreement.charges) {
                            var foundLines = $filter('filter')(vm.agreement.charges, {
                                chargesTypeId: 1
                            }, true);
                            if (foundLines.length == 1) {
                                if (foundLines[0].discountPercent > 0) {
                                    foundLines[0].discountedRate = foundLines[0].rate - (foundLines[0].rate * (foundLines[0].discountPercent / 100));
                                }
                            }
                        }
                        //in edit mod load tariff for vehicle. which will be used if some parameter is changed like dates etc.
                        var groupId = vm.agreement.tariffGroup.id;
                        if (groupId == null) groupId = -1;

                        if (isTariffEnabled) {
                            //load tariff
                            tariffHelper.loadTariff(groupId, function () {
                                //don't apply
                            });
                        }
                        if (vm.agreement.customer.contactCategory == 1) {
                            vm.isIndividualCustomerRadio = true;
                        }
                        else if (vm.agreement.customer.contactCategory == 2) {
                            vm.isIndividualCustomerRadio = false;
                        }
                    } else {

                        vm.agreement.startDate = moment(moment().format('YYYY-MM-DD HH:mm')).utc();
                        vm.agreement.endDate = moment(moment().add(1, 'days').format('YYYY-MM-DD HH:mm')).utc();
                        vm.agreement.locationId = appSession.user.locationId;
                        vm.agreement.closingLocationId = appSession.user.locationId;
                        loadChargesFromSettings();
                        vm.onCustomerSelect(vm.agreement.customer)
                    }

                    vm.totalDaysAndTime();
                    vm.taxAccepted = vm.agreement.taxPercent > 0 ? true : false;
                }).finally(function () {
                    vm.loading = false;
                });


            }
            //vm.sendBookingEmail = function (booking) {
            //    vm.emailing = true;
            //    externalBookingService.sendBookingEmail({
            //        id: vm.agreement.id,
            //    }).success(function () {
            //        abp.notify.success(app.localize('SuccessfullySendEmail'));
            //    }).finally(function () {
            //        vm.emailing = false;
            //    });
            //};

            //vm.printBooking = function () {
            //    window.open('/Report#/tenant/printModalBooking/' + vm.agreement.id);
            //};
            //if (abp.auth.hasPermission('Pages.Tenant.TariffCards')) {
            vm.getTariffCards();
            //}
            vm.resetFields = function () {
                vm.reset = false;
                vm.saved = false;
                init();
            };
            init();
        }
    ]);
