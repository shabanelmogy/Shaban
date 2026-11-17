// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:248577-250176
appModule.controller('tenant.views.crs.limousine.trips.createOrEditModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.vehicleModel', 'abp.services.app.directory', 'abp.services.app.googleMapAPI', '$sce', 'tripId',
        'abp.services.app.commonLookup', 'abp.services.app.limoTrip', 'abp.services.app.tripType', 'abp.services.app.vehicle', 'options', 'utilities', 'abp.services.app.invoice', 'appSession', 'abp.services.app.limoQuotation',
        function ($scope, $uibModal, $uibModalInstance, vehicleModelService, directoryService,
            mapService, $sce, tripId, commonLookupService, tripService, tripTypeService, vehicleService, options, utilities, invoiceService, appSession, limoQuotationService) {

            var vm = this;
            vm.saving = false;
            vm.reset = false;
            vm.saved = false;
            vm.savedOnce = false;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.dropoffDateTime = null;
            vm.pickupDateTime = null;
            vm.taxCategoryChangeableInTrip = abp.features.isEnabled('CRS.TaxCategoryChangeableInTrip');
            vm.isLimoDiscountEnabled = utilities.parseBoolean(abp.setting.get("App.General.Limo.LimoDiscount"));
            vm.limoCustomField = utilities.parseBoolean(abp.setting.get("App.General.Limo.LimoCustomField"));
            vm.limoCustomField1 = utilities.parseBoolean(abp.setting.get("App.General.Limo.LimoCustomField1"));
            vm.trip_EnableCustomField1 = utilities.parseBoolean(abp.setting.get("App.General.Trip_EnableCustomField1"));
            vm.selectOnlyAvailableVehicleInLimoTrip = utilities.parseBoolean(abp.setting.get("App.General.Limo.SelectOnlyAvaialableVehicleInLimoTrip"));
            vm.trip_EnableCustomField2 = utilities.parseBoolean(abp.setting.get("App.General.Trip_EnableCustomField2"));
            vm.trip_EnableCustomField3 = utilities.parseBoolean(abp.setting.get("App.General.Trip_EnableCustomField3"));
            vm.limoPickUpAddress = utilities.parseBoolean(abp.setting.get("App.General.Limo.PickUpAddress"));
            vm.limoDropOffAddress = utilities.parseBoolean(abp.setting.get("App.General.Limo.DropOffAddress"));
            vm.isOutOfCityPickUpLocation = utilities.parseBoolean(abp.setting.get("App.General.Limo.IsOutOfCityPickUpLocation"));
            vm.isOutOfCityDropOffLocation = utilities.parseBoolean(abp.setting.get("App.General.Limo.IsOutOfCityDropOffLocation"));
            vm.manualPickUpAndDropOffDateTime = utilities.parseBoolean(abp.setting.get("App.General.Limo.ManualPickUpAndDropOffDateTime"));
            vm.trip_CustomField1Type = parseInt(abp.setting.get("App.General.Trip_CustomField1Type"));
            vm.trip_CustomField2Type = abp.setting.get("App.General.Trip_CustomField2Type");
            vm.trip_CustomField3Type = abp.setting.get("App.General.Trip_CustomField3Type");
            vm.branchTaxPercentage = null;
            vm.whileDispatchingTripAllowOnlySelect = parseInt(abp.setting.get("App.General.Trip_WhileDispatchingTripAllowOnlySelect"));
            vm.manualTripNoEnabled = utilities.parseBoolean(abp.setting.get("App.General.ManualTripNoEnabled"));
            vm.additionalDriverWithTrip = utilities.parseBoolean(abp.setting.get("App.General.AdditionalDriverWithTrip"));
            vm.flightDetailEnabled = utilities.parseBoolean(abp.setting.get("App.General.FlightDetailEnabled"));
            vm.makeDropOffLocationVesibleIfPossible = utilities.parseBoolean(abp.setting.get("App.General.Limo.MakeDropOffLocationOptionalIfPossible"));
            vm.noOfPersonsEnabled = utilities.parseBoolean(abp.setting.get("App.General.NoOfPersonsEnabled"));
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.enableDriverCommision = utilities.parseBoolean(abp.setting.get("App.General.Limo.EnableDriverCommissionForTrips"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.otherGroupsVehiclePermission = abp.auth.hasPermission('Pages.Tenant.Limousine.Trips.CanSelectOtherGroupsVehicleOnDispatchment');
            vm.isAttachVehicleWithAppPermanentlyEnabled = abp.features.isEnabled('CRS.Limousine.AttachVehicleWithAppPermanently');
            vm.isInvoiceToEnabled = abp.features.isEnabled('CRS.Limousine.InvoiceTo');
            vm.isDispatchingThroughChauffeurQueueEnabled = abp.features.isEnabled('CRS.Limousine.DispatchingThroughChauffeurQueue');
            vm.isBranchWiseTaxEnabled = abp.features.isEnabled('CRS.CustomFeatures.TaxBranchwise');
            vm.documentsForLimousine = abp.features.isEnabled("CRS.CustomFeatures.DocumentsForLimousine");
            vm.isTaxCodeEnabled = abp.features.isEnabled("CRS.TaxCodes");
            vm.isAssigningStepForLimoTripBeforeDispatch = utilities.parseBoolean(abp.setting.get("App.General.Limo.AssigningStepForLimoTripBeforeDispatch"));
            vm.separateDateAndTime = utilities.parseBoolean(abp.setting.get("App.General.Limo.SeparateDateAndTime"));
            vm.sendEmailToContactPersonOnTripCreation = utilities.parseBoolean(abp.setting.get("App.General.Limo.SendEmailToContactPersonOnTripCreation"));
            vm.dontRecalculateChargesOnTripFinish = utilities.parseBoolean(abp.setting.get("App.General.DontRecalculateChargesOnTripFinish"));
            vm.isMulticurrencyEnabled = abp.features.isEnabled("Core.MultiCurrency");
            vm.saveAndInvoice = false;
            vm.isInvoiceTo = false;
            vm.isFinishedTrip = false;
            vm.isEditMod = tripId ? true : false;
            vm.customers = [];
            vm.invoiceTo = [];
            vm.documents = [];
            vm.disableCustomer = false;
            vm.requiredDropOffLocation = true;
            vm.trip = null;
            vm.saveAndPrint = false;
            var tripType = null;
            var limitInMinutes = 0;
            var durationInMinutes = 0;
            vm.chargesWithtax = 0;
            vm.trackMileage = utilities.parseBoolean(abp.setting.get("App.General.Trip_TrackMileage"));
            vm.allowStatusChangeInTripEditing = utilities.parseBoolean(abp.setting.get("App.General.Limo.AllowStatusChangeInTripEditing"));
            vm.allowTaxEditingInLimoTrip = utilities.parseBoolean(abp.setting.get("App.General.Limo.AllowTaxEditingInLimoTrip"));
            // vm.allowTaxEditingInLimoTrip = true;
            vm.perDayTripsLimit = abp.setting.get("App.General.WarnIfNoOfTripsExceedInDay");
            vm.perHourTripsLimit = abp.setting.get("App.General.WarnIfNoOfTripsExceedInAnHour");
            vm.quantityAndRateInLimo = utilities.parseBoolean(abp.setting.get("App.General.Limo.QuantityAndRateInLimo"));
            vm.isLimoEnabled = abp.features.isEnabled("CRS.Limo");
            vm.showActiveDriversOnlyInLimoGrid = utilities.parseBoolean(abp.setting.get("App.General.Limo.ShowActiveDriversOnlyInLimoGrid"));

            vm.rounding = function (amount) {
                return utilities.round(amount, 2);
            };
            vm.permissions = {
                changeCharges: abp.auth.hasPermission('Pages.Tenant.Limousine.Trips.ChangeCharges'),
                canViewCharges: abp.auth.hasPermission('Pages.Tenant.Limousine.Trips.CanViewCharges'),
                canEnterChangeDriverCommision: abp.auth.hasPermission('Pages.Tenant.Limousine.Trips.CanEnterChangeDriverCommision'),
                create: abp.auth.hasPermission('Pages.Tenant.Vouchers.Invoices.Addnew'),
            };
            vm.filters = {
                name: '',
                makeId: null
            };
            vm.taxCategories = [
                {
                    id: 1, name: app.localize("Standard")
                },
                {
                    id: 2, name: app.localize("TaxExempted")
                },
                {
                    id: 3, name: app.localize("ZeroRated")
                },

            ];


            vm.tripStatuses = [
                {
                    id: 1, name: app.localize("New")
                },
                {
                    id: 2, name: app.localize("Dispatched")
                },
                {
                    id: 3, name: app.localize("Started")
                },
                {
                    id: 4, name: app.localize("Finished")
                },
                {
                    id: 5, name: app.localize("Canceled")
                },
                {
                    id: 6, name: app.localize("NoShow")
                },

            ];
            vm.tripStatusesT = [
                {
                    id: 1, name: app.localize("New")
                },
                {
                    id: 2, name: app.localize("Dispatched")
                },
                {
                    id: 3, name: app.localize("Started")
                },
                {
                    id: 4, name: app.localize("Finished")
                },
                {
                    id: 5, name: app.localize("Canceled")
                },
                {
                    id: 6, name: app.localize("NoShow")
                },
                {
                    id: 10, name: app.localize("Tentative")
                },

            ];

            //if (utilities.parseBoolean(abp.setting.get("App.General.Limo.TentativeStepForLimoTripBeforeDispatch")))
            //    vm.tripStatuses.push({
            //        id: 10, name: app.localize("Tentative")
            //    });

            if (parseInt(abp.setting.get("App.General.Trip_DriverMobileAppAcceptOrReject")) == 1)
                vm.tripStatuses.push({
                    id: 7, name: app.localize("DriverAccepted")
                });
            else if (parseInt(abp.setting.get("App.General.Trip_DriverMobileAppAcceptOrReject")) == 2)
                vm.tripStatuses.push({
                    id: 8, name: app.localize("DriverRejected")
                });

            vm.getTripStatus = function (status) {
                if (status == 1)
                    return app.localize("New");
                if (status == 2)
                    return app.localize("Dispatched");
                if (status == 3)
                    return app.localize("Started");
                if (status == 4)
                    return app.localize("Finished");
                if (status == 5)
                    return app.localize("Canceled");
                if (status == 6)
                    return app.localize("NoShow");
                if (status == 10)
                    return app.localize("Tentative");
                return '';
            };
            vm.searchModel = function ($select) {
                vm.filters.name = $select.search;
                if (vm.filters.name === '')
                    vm.filters.name = "~";  //to avoid default suggestions 

                return vehicleModelService.searchVehicleModelsNew(vm.filters).then(function (response) {
                    vm.models = response.data.items;
                });
            };

            vm.externalVehicleSelected = function () {
                vm.limo.vehicleId = null;
                vm.limo.vehicle = null;
                vm.limo.driver = null;
                vm.limo.driverId = null;
                if (vm.externalVehicle) {
                    vm.limo.vehicle = {
                        ownership: 4
                    };
                    vm.limo.driver = {
                        contactType: 4
                    };
                }

            };

            vm.onKMsChange = function () {
                if (vm.trackMileage == true) {
                    vm.limo.kms = vm.limo.endingKms - vm.limo.startingKms;
                }
                if (!vm.limo.invoiceId) {
                    calculateCharges();
                }
            };

            vm.vehicleSelected = function () {
                getStaffShiftByVehicleOrDriver({ vehicleId: vm.limo.vehicle.id });
            };
            vm.driverSelected = function () {
                getStaffShiftByVehicleOrDriver({ staffId: vm.limo.driver.id });
            };

            vm.searchAdditionalDrivers = function ($select) {
                if (!$select.search) return;
                return directoryService.searchPersonStaffCustomer({ keyword: $select.search, activeOnly: true }).then(function (response) {
                    vm.additionaldrivers = response.data.items;
                });
            };

            vm.searchAdditionalDriverPopoup = function () {
                var modalInstance = openSearchContactModel(1, 2, false);

                modalInstance.result.then(function (result) {
                    if (result != null)
                        vm.limo.additionalDriver = result;
                });
            };

            function openSearchContactModel(category, type, isOnlyCorporate) {
                var companyIdToForward = vm.limo.customer ? vm.limo.customer.id : null;

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
                                companyId: companyIdToForward,
                                activeOnly: true
                            }
                        }
                    }
                });
            }

            vm.trustSrc = function (src) {
                if (src)
                    return $sce.trustAsResourceUrl(src);
            };


            function getStaffShiftByVehicleOrDriver(input) {
                if (vm.isAttachVehicleWithAppPermanentlyEnabled) {
                    tripService.getStaffShiftByVehicleOrDriver(input).success(function (result) {
                        if (result) {
                            vm.limo.driver = result.driver;
                            vm.limo.driverId = result.driver.id;
                            vm.limo.vehicle = result.vehicle;
                            vm.limo.vehicleId = result.vehicle.id;
                            if (result.vehicle.tariffGroup) {
                                vm.limo.tariffGroup = result.vehicle.tariffGroup;
                                vm.limo.tariffGroupId = result.vehicle.tariffGroup.id;
                                calculateCharges();
                            }
                        }
                    });
                }
            }

            vm.branchTaxCode = function () {
                if (!vm.isEditMod) {
                    var userLocationId = appSession.user.locationId;
                    if (userLocationId) {
                        commonLookupService.getLocationById({ id: userLocationId })
                            .success(function (data) {
                                var userLocation = data;
                                if (userLocation.taxCode) {
                                    vm.branchTaxPercentage = userLocation.taxCode.taxPercent;
                                }
                            })
                    }
                }

            }

            vm.customerSelected = function (customer) {
                if (customer != null)
                    vm.limo.customer = customer;
                vm.limo.customerId = vm.limo.customer.id;
                vm.limo.tripTypeId = null;

                // Load contact categories if the customer is a company
                if (vm.limo.customer.contactCategory == 2) {
                    vm.loadContactPerson(vm.limo.customer.id);
                }
                if (!vm.limo.invoiceTo) {
                    if (vm.isEditMod && vm.tripTaxPercent > 0) {
                        vm.limo.taxPercent = vm.limo.customer.isTaxExempted ? 0 : vm.tripTaxPercent;
                        vm.limo.isTaxExempted = vm.limo.customer.isTaxExempted;
                        if (vm.isTaxCodeEnabled && !vm.limo.customer.isTaxExempted) {
                            if (vm.limo.customer.taxCodeId > 0) {
                                vm.limo.taxPercent = vm.limo.customer.taxCode.taxPercent;
                            }
                            else {
                                if (vm.branchTaxPercentage)
                                    vm.limo.taxPercent = vm.branchTaxPercentage;
                            }
                        }
                    }
                    else {
                        vm.limo.taxPercent = vm.limo.customer.isTaxExempted ? 0 : vm.taxPercent;
                        vm.limo.isTaxExempted = vm.limo.customer.isTaxExempted;
                        if (vm.isTaxCodeEnabled && !vm.limo.customer.isTaxExempted) {
                            if (vm.limo.customer.taxCodeId > 0) {
                                vm.limo.taxPercent = vm.limo.customer.taxCode.taxPercent;
                            }
                            else {
                                if (vm.branchTaxPercentage)
                                    vm.limo.taxPercent = vm.branchTaxPercentage;
                            }
                        }
                    }
                }
                calculateCharges();

            };
            // Load contact categories if the selected customer is a company
            vm.loadContactPerson = function (companyId) {
                tripService.getContactPersonsByCustomer(companyId).then(function (response) {
                    vm.contactPersons = response.data.items;
                });
            };
            vm.loadContactPersonForEdit = function (companyId) {
                tripService.getContactPersonsByCustomer(companyId).then(function (response) {
                    vm.contactPersons = response.data.items;
                    var contactMap = {};
                    for (var i = 0; i < vm.contactPersons.length; i++) {
                        contactMap[vm.contactPersons[i].id] = vm.contactPersons[i];
                    }
                    if (Array.isArray(vm.contactPersonName)) {
                        vm.contactPersonName = vm.contactPersonName
                            .map(contactId => contactMap[contactId] || null)  // Map contactId to contact object
                            .filter(contact => contact !== null);  // Remove null values
                    }
                });
            };

            vm.invoiceSelected = function (customer) {
                if (customer != null)
                    vm.limo.invoiceTo = customer;

                vm.limo.invoiceToId = vm.limo.invoiceTo.id;
                if (vm.isEditMod && vm.tripTaxPercent > 0) {
                    vm.limo.taxPercent = vm.limo.customer.isTaxExempted ? 0 : vm.tripTaxPercent;
                    vm.limo.isTaxExempted = vm.limo.customer.isTaxExempted;
                    if (vm.limo.invoiceTo) {
                        vm.limo.taxPercent = vm.limo.invoiceTo.isTaxExempted ? 0 : vm.tripTaxPercent;
                        vm.limo.isTaxExempted = vm.limo.invoiceTo.isTaxExempted;
                        if (vm.isTaxCodeEnabled && !vm.limo.invoiceTo.isTaxExempted) {
                            if (vm.limo.invoiceTo.taxCodeId > 0) {
                                vm.limo.taxPercent = vm.limo.invoiceTo.taxCode.taxPercent;
                            }
                            else {
                                if (vm.branchTaxPercentage)
                                    vm.limo.taxPercent = vm.branchTaxPercentage;
                            }
                        }
                    }
                }
                else {
                    vm.limo.taxPercent = vm.limo.invoiceTo.isTaxExempted ? 0 : vm.taxPercent;
                    vm.limo.isTaxExempted = vm.limo.invoiceTo.isTaxExempted;
                    if (vm.isTaxCodeEnabled && !vm.limo.invoiceTo.isTaxExempted) {
                        if (vm.limo.invoiceTo.taxCodeId > 0) {
                            vm.limo.taxPercent = vm.limo.invoiceTo.taxCode.taxPercent;
                        }
                        else {
                            if (vm.branchTaxPercentage)
                                vm.limo.taxPercent = vm.branchTaxPercentage;
                        }
                    }
                }
                calculateCharges();
            };
            vm.removeDriver = function () {
                vm.limo.driver = null;
                vm.limo.driverId = null;
            };

            vm.clearAdditionalDriver = function () {
                vm.limo.additionalDriver = null;
                vm.limo.additionalDriverId = null;
            };

            function getTripTypeObj(id) {
                if (!vm.tripTypes) return null;

                for (var i = 0; i < vm.tripTypes.length; i++) {
                    if (id == vm.tripTypes[i].id)
                        return vm.tripTypes[i];
                }
            }

            function doesOneTimeRateTypeExist(rateTypes) {
                if (rateTypes.length < 1)
                    return false;
                else {
                    for (var i = 0; i < rateTypes.length; i++) {
                        if (rateTypes[i].id == 6) // 6 = one time rate type
                            return true;
                    }
                }
                return false;
            }

            vm.searchVehiclePopup = function () {
                if (vm.selectOnlyAvailableVehicleInLimoTrip) {
                    openSearchVehicleModalForAllVehicles();
                }
                else {
                    openSearchVehicleModal();
                }
            };

            function openSearchVehicleModalForAllVehicles() {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/searchVehicleModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.searchVehicleModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                fromDateTime: moment(vm.limo.pickupDateTime ? vm.limo.pickupDateTime : moment().startOf('day')).utc(),
                                toDateTime: moment(vm.limo.dropOffDateTime ? vm.limo.dropOffDateTime : moment().endOf('day')).utc(),
                                //tariffGroup: vm.searchOtherGroupsVehicle ? null : vm.tariffGroup,
                                //tariffGroupId: vm.searchOtherGroupsVehicle ? null : vm.tariffGroupId,
                                tariffGroupId: vm.otherGroupsVehiclePermission && vm.searchOtherGroupsVehicle ? null : vm.limo.tariffGroupId,
                                statusId: 'IDL',
                                subStatuses: [1, 7], //1: Available, 7: Ready to go
                                source: 'openagreement',
                                isSearchFromLimo: true,
                                selectable: true
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    if (result != null) {
                        vm.limo.vehicle = result;
                        vm.limo.vehicleId = vm.limo.vehicle.id
                        vm.vehicleSelected();
                    }
                });
            }
            function openSearchVehicleModal() {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/searchVehicleModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.searchVehicleModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                fromDateTime: moment(vm.limo.pickupDateTime ? vm.limo.pickupDateTime : moment().startOf('day')).utc(),
                                toDateTime: moment(vm.limo.dropOffDateTime ? vm.limo.dropOffDateTime : moment().endOf('day')).utc(),
                                //tariffGroup: vm.searchOtherGroupsVehicle ? null : vm.tariffGroup,
                                //tariffGroupId: vm.searchOtherGroupsVehicle ? null : vm.tariffGroupId,
                                tariffGroupId: vm.otherGroupsVehiclePermission && vm.searchOtherGroupsVehicle ? null : vm.limo.tariffGroupId,
                                //statusId: 'IDL',
                                //subStatuses: [1, 7], //1: Available, 7: Ready to go
                                // source: 'openagreement',
                                isSearchFromLimo: true,
                                allSelectable: true
                            };
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    if (result != null) {
                        vm.limo.vehicle = result;
                        vm.limo.vehicleId = vm.limo.vehicle.id
                        vm.vehicleSelected();
                    }
                });
            }

            vm.selectChauffeurPopup = function () {
                openSelectChauffeurModal();
            };
            function openSelectChauffeurModal() {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/limousine/trips/selectChauffeurModal.cshtml',
                    controller: 'tenant.views.crs.limousine.trips.selectChauffeurModal as vm',
                    backdrop: 'static',
                    size: 'lg',

                });

                modalInstance.result.then(function (result) {
                    if (result != null) {
                        vm.limo.driver = result;
                        vm.limo.driverId = result.id;
                        vm.limo.driverForcedSelectionReason = result.selectedReason != null ? result.selectedReason : null;
                        getStaffShiftByVehicleOrDriver({ staffId: vm.limo.driver.id });
                    }
                });
            }

            function doesExtraHourRateTypeExist(rateTypes) {
                if (rateTypes.length < 1)
                    return false;
                else {
                    for (var i = 0; i < rateTypes.length; i++) {
                        if (rateTypes[i].id == 10) // 10 = Extra Hour rate type
                            return true;
                    }
                }
                return false;
            }

            vm.tripTypeSelected = function () {

                setIfDropOffLocationRequired();

                //if dropoff location is not required (i.e not applicable) like hourly trips.
                //then estimate drop of time based on hours limit for selected trip type
                if (!vm.requiredDropOffLocation) {
                    vm.limo.dropOffLocation = null;
                    if (vm.manualPickUpAndDropOffDateTime) {
                        vm.limo.dropOffDateTime = null;
                    }
                    else {
                        vm.limo.dropOffDateTime = moment(vm.limo.pickupDateTime).add(limitInMinutes, 'minutes').toJSON();
                    }
                }

                calculateCharges();
            };

            function setIfDropOffLocationRequired() {
                tripType = getTripTypeObj(vm.limo.tripTypeId);
                vm.requiredDropOffLocation = true;
                if (vm.limo.customer.contactCategory == 2) {
                    if (tripType.corporateSetting.locationBased && vm.makeDropOffLocationVesibleIfPossible) {
                        vm.isDropOffLocationRequired = true;
                    }
                    else {
                        if (vm.makeDropOffLocationVesibleIfPossible) {
                            vm.isDropOffLocationRequired = false;
                        }
                        else {
                            vm.isDropOffLocationRequired = true;
                        }
                    }
                    if (tripType.corporateSetting.limit > 0 && doesExtraHourRateTypeExist(tripType.corporateSetting.rateTypes)) {
                        vm.requiredDropOffLocation = false;
                        limitInMinutes = tripType.corporateSetting.limit * 60;

                    }
                } else {
                    if (tripType.baseSetting.locationBased && vm.makeDropOffLocationVesibleIfPossible) {
                        vm.isDropOffLocationRequired = true;
                    }
                    else {
                        if (vm.makeDropOffLocationVesibleIfPossible) {
                            vm.isDropOffLocationRequired = false;
                        }
                        else {
                            vm.isDropOffLocationRequired = true;
                        }
                    }
                    if (tripType.baseSetting.limit > 0 && doesExtraHourRateTypeExist(tripType.baseSetting.rateTypes)) {
                        vm.requiredDropOffLocation = false;
                        limitInMinutes = tripType.baseSetting.limit * 60;
                    }
                }
            }

            vm.tripTypesFilter = function (item) {
                if (vm.limo == null)
                    return '';
                if (!vm.limo.customer)
                    return '';
                if (vm.limo.customer.contactCategory == 1 && item.enableBaseSetting == true)
                    return true;
                if (vm.limo.customer.contactCategory == 2 && item.enableCorporateSetting == true)
                    return true;
                return '';
            };

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    //vm.dateTimeFormat
                    //return moment(localTime).format('YYYY-MM-DD HH:mm:ss');
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };
            vm.getlocalTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('HH:mm');
                }
                else {
                    return "";
                }
            };
            // On The Change Of pickupDateTime
            //date change calls on loading data first time in edit mode. disable calculation if it is first time loading of editing mode
            var pickupDateTimeLoaded = false;
            var dateTimeFormat = '@(SettingManager.GetSettingValue("App.General.DateFormat")) HH:mm';

            vm.pickupDateTimeChanged = function () {
                if (vm.isFinishedTrip) return;

                if (!vm.isEditMod) {

                    var pickup = moment(vm.limo.pickupDateTime, dateTimeFormat, true);

                    if (!pickup.isValid()) {
                        return;
                    }

                    if (vm.manualPickUpAndDropOffDateTime) {
                        vm.limo.dropOffDateTime = null;
                    } else {
                        vm.limo.dropOffDateTime = pickup
                            .clone()
                            .add(durationInMinutes, 'minutes')
                            .toDate();
                    }

                    if (!vm.requiredDropOffLocation) {
                        if (vm.manualPickUpAndDropOffDateTime) {
                            vm.limo.dropOffDateTime = null;
                        } else {
                            vm.limo.dropOffDateTime = pickup
                                .clone()
                                .add(limitInMinutes, 'minutes')
                                .toDate();
                        }
                    }

                    calculateCharges();
                } else {
                    pickupDateTimeLoaded = true;
                }
            };

            vm.dropOffDateTimeChanged = function () {
                if (vm.limo.id > 0 && vm.showCalCharges) {
                    vm.showCalCharges = false;
                } else {
                    calculateCharges();
                }
            };

            // Swapping Locations
            vm.swapLocations = function () {
                var location = vm.limo.pickupLocation;
                var locationTo = vm.limo.dropOffLocation;
                vm.limo.dropOffLocation = location;
                vm.limo.pickupLocation = locationTo;
                // drawMap();

                // calculateCharges();
            };

            vm.cancel = function () {
                //vm.savedOnce
                if (vm.savedOnce)
                    $uibModalInstance.close();
                else
                    $uibModalInstance.dismiss();

            };

            vm.searchCustomers = function ($select) {
                if (!$select.search) return;
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true }).then(function (response) {
                    vm.customers = response.data.items;
                    vm.invoiceTo = response.data.items;
                });
            };

            vm.searchSuppliers = function ($select) {
                if (!$select.search) return;
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return commonLookupService.searchContact({ keyword: $select.search, contactType: 3 }).then(function (response) {
                    vm.suppliers = response.data.items;
                });
            };

            vm.searchCustomLookup = function ($select, lookup) {

                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return commonLookupService.searchCustomLookups({ keyword: $select.search, lookup: lookup }).then(function (response) {
                    vm.customLookups = response.data.items;
                });
            };

            vm.searchDrivers = function ($select) {
                if (!vm.whileDispatchingTripAllowOnlySelect > 0)
                    vm.whileDispatchingTripAllowOnlySelect = null;

                //whereas contactCategory: 1 (person). get all persons which includes staff as well
                return directoryService.searchStaff({ keyword: $select.search, designationId: vm.whileDispatchingTripAllowOnlySelect, activeOnly: vm.showActiveDriversOnlyInLimoGrid }).then(function (response) {
                    vm.drivers = response.data.items;
                });
            };

            var getLocationDetail = function (locationObj) {
                return locationObj.detail ? locationObj.detail : locationObj.title;
            }

            vm.openMapUrl = function () {
                var url = null;

                if (vm.limo.pickupLocation && vm.limo.dropOffLocation)
                    url = "https://www.google.com/maps/dir/?api=1&origin=" + getLocationDetail(vm.limo.pickupLocation) + '&destination=' + getLocationDetail(vm.limo.dropOffLocation);
                else if (vm.limo.pickupLocation || vm.limo.dropOffLocation) {
                    var location = vm.limo.pickupLocation ? vm.limo.pickupLocation : vm.limo.dropOffLocation;
                    url = url = "https://maps.google.com/?q=" + getLocationDetail(location);
                }

                if (url)
                    window.open(url);

            };


            // Searching Places Google MapApi
            vm.searchLocations = function ($select) {
                if (vm.limo == null) return null;
                if (vm.limo.tripTypeId == null || vm.limo.customer == null) return null;

                var tariffOnlyLocations = false;
                var tripType = getTripTypeObj(vm.limo.tripTypeId);
                var customerId = vm.limo.customer.id;

                if (vm.limo.customer.contactCategory == 2) {
                    if (tripType.corporateSetting.locationBased && doesOneTimeRateTypeExist(tripType.corporateSetting.rateTypes))
                        tariffOnlyLocations = true;
                } else { //if individual customer and trip type is based on location
                    if (tripType.baseSetting.locationBased && doesOneTimeRateTypeExist(tripType.baseSetting.rateTypes)) {
                        tariffOnlyLocations = true;
                        customerId = null;
                    }

                }

                return commonLookupService.searchLimoPlaces({ keyWord: $select.search, onlyLimoTariffPlaces: tariffOnlyLocations, cusotmerId: customerId }).then(function (response) {
                    vm.pickUpLocations = response.data.items;
                });


            };

            vm.searchVehicles = function ($select) {
                if ($select.search == "" || !vm.limo.tariffGroupId) {
                    vm.vehicles = null; return null;
                }
                vehicleService.searchVehicles({ plateNo: $select.search, tariffGroupId: vm.otherGroupsVehiclePermission && vm.searchOtherGroupsVehicle ? null : vm.limo.tariffGroupId, isSearchFromLimo: true })
                    .then(function (response) {
                        vm.vehicles = response.data.items;
                    });
            };

            //vm.searchVehicles = function ($select) {
            //    if ($select.search == "") { vm.vehicles = null; return null; }
            //    return vehicleService.searchVehicles({ plateNo: $select.search, statusId: 'IDL', tariffGroupId: vm.otherGroupsVehiclePermission && vm.searchOtherGroupsVehicle ? null : vm.trip.tariffGroupId }).then(function (response) {
            //        vm.vehicles = response.data.items;
            //    });
            //};

            // on change of Tariff Group
            vm.tariffGroupChanged = function () {
                if (!vm.isFinishedTrip) {
                    vm.limo.vehicle = null;
                    vm.limo.vehicleId = null;
                    calculateCharges();
                    if (vm.externalVehicle) {
                        vm.limo.vehicle = {
                            ownership: 4
                        };
                    }
                }

            };

            vm.pickupLocationSelected = function () {
                if (vm.limo.pickupLocation != null && vm.limo.dropOffLocation != null) {
                    drawMap();
                    calculateCharges();
                }
                //else
                //    drawLocation(vm.limo.pickupLocation);
            };

            vm.dropOffLocationSelected = function () {

                if (vm.limo.pickupLocation != null && vm.limo.dropOffLocation != null)
                    drawMap();
                //else
                //    drawLocation(vm.limo.dropOffLocation);

                calculateCharges();
            };

            vm.uploadDocument = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/limousine/trips/uploadDocumentsModal.cshtml',
                    controller: 'tenant.views.crs.limousine.trips.uploadDocumentsModal as vm',
                    backdrop: 'static'
                });

                modalInstance.result.then(function (result) {
                    if (!vm.documents) {
                        vm.documents = [];
                    }
                    vm.documents.push(result);
                });
            };

            vm.getOriginalName = function (doc) {
                var originalName = doc.name.replace("_" + doc.guid, "");
                return originalName;
            };

            vm.removeDocument = function (obj) {
                var index = vm.documents.indexOf(obj);
                vm.documents.splice(index, 1);
            };

            //function drawLocation(location) {
            //    mapService.getMap({
            //        placeId: location.webID,
            //        PlaceName: location.title
            //    }).success(function (data) {
            //        //  vm.src = data.mapSrc;
            //    });
            //}

            function drawMap() {
                //for debug
                //vm.limo.kms = 5;
                //durationInMinutes = 10;
                //return;
                mapService.getDistanceWithTime({ fromLocationId: vm.limo.pickupLocation.webID, fromLocation: vm.limo.pickupLocation.title, toLocationId: vm.limo.dropOffLocation.webID, toLocation: vm.limo.dropOffLocation.title }).success(function (data) {
                    //  vm.src = data.mapSrc;
                    if (!vm.isFinishedTrip)
                        vm.limo.kms = data.distance;
                    durationInMinutes = data.duration;
                    var startDate = moment(vm.limo.pickupDateTime);
                    if (!vm.isEditMod)
                        if (vm.manualPickUpAndDropOffDateTime) {
                            vm.limo.dropOffDateTime = null;
                        }
                        else {
                            vm.limo.dropOffDateTime = moment(startDate).add(durationInMinutes, 'minutes').toJSON();
                        }
                });
            }


            function sumCharges() {
                if (!vm.allowTaxEditingInLimoTrip) {
                    if (vm.limo.tripCharges == null) return;

                    var totalCharges = 0.0;
                    var totalTax = 0.0;

                    for (var i = 0; i < vm.limo.tripCharges.length; i++) {
                        if (vm.limo.tripCharges[i].charges > 0) {
                            var tax = 0;
                            if (vm.limo.tripCharges[i].taxable && vm.limo.taxPercent > 0 && !vm.quantityAndRateInLimo) {
                                if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 
                                    //equation solved from following formula... 
                                    //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
                                    var chargesWithoutTax = (vm.limo.tripCharges[i].charges * 100) / (100 + vm.limo.taxPercent);
                                    tax = utilities.round(vm.limo.tripCharges[i].charges - chargesWithoutTax, 2);
                                    vm.limo.tripCharges[i].tax = tax;
                                    totalTax += utilities.round(tax, 2);
                                } else {
                                    //prices are without tax. calculate tax and include in total
                                    tax = utilities.round(vm.limo.tripCharges[i].charges * vm.limo.taxPercent / 100, 2);
                                    vm.limo.tripCharges[i].tax = tax;
                                    totalTax += utilities.round(tax, 2);

                                }
                            }
                            else if (vm.limo.taxPercent > 0 && vm.quantityAndRateInLimo) {
                                if (vm.isTaxInclusive) {
                                    var chargesWithoutTax = (vm.limo.tripCharges[i].charges * 100) / (100 + vm.limo.taxPercent);
                                    if (vm.limo.tripCharges[i].taxCategory == 2 || vm.limo.tripCharges[i].taxCategory == 3) {
                                        tax = 0;
                                        vm.limo.tripCharges[i].taxable = false;
                                    } else {
                                        tax = utilities.round(vm.limo.tripCharges[i].charges - chargesWithoutTax, 2);
                                        vm.limo.tripCharges[i].taxable = true;
                                    }
                                    vm.limo.tripCharges[i].tax = tax;
                                    totalTax += utilities.round(tax, 2);
                                } else {
                                    //prices are without tax. calculate tax and include in total
                                    if (vm.limo.tripCharges[i].taxCategory == 2 || vm.limo.tripCharges[i].taxCategory == 3) {
                                        tax = 0;
                                        vm.limo.tripCharges[i].taxable = false;
                                    } else {
                                        tax = utilities.round(vm.limo.tripCharges[i].charges * vm.limo.taxPercent / 100, 2);
                                        vm.limo.tripCharges[i].taxable = true;
                                    }
                                    vm.limo.tripCharges[i].tax = tax;
                                    totalTax += utilities.round(tax, 2);

                                }
                            }
                            else {
                                vm.limo.tripCharges[i].tax = 0;
                            }

                            totalCharges += parseFloat(vm.limo.tripCharges[i].charges);
                        }
                        else {
                            vm.limo.tripCharges[i].tax = 0;
                        }

                    }

                    vm.limo.charges = vm.isTaxInclusive ? utilities.round(totalCharges, 2) : (utilities.round(totalCharges, 2) + utilities.round(totalTax, 2)) / 1
                    vm.limo.charges = utilities.round(vm.limo.charges, 2);
                    vm.limo.tax = utilities.round(totalTax, 2);
                }
            };


            function calculateCharges() {

                if (vm.limo == null) return;
                if (!(vm.limo.customer != null && vm.limo.tripTypeId > 0 && vm.limo.pickupLocation != null && (!vm.requiredDropOffLocation || vm.limo.dropOffLocation != null) && vm.limo.tariffGroupId > 0)) return;

                vm.loading = true;
                vm.limo.customerId = vm.limo.customer.id;

                tripService.calculateCharges(vm.limo).success(function (result) {
                    //vm.limo.charges = result.charges;
                    vm.limo.tripCharges = result.tripCharges;
                    vm.limo.tax = result.tax;
                    //vm.chargesWithtax = vm.isTaxInclusive ? utilities.round(result.charges, 2) : utilities.round(result.charges + result.tax, 2);
                    vm.limo.charges = vm.isTaxInclusive ? utilities.round(result.charges, 2) : utilities.round(result.charges + result.tax, 2);
                    if (vm.limo.id > 0 && vm.isLimoDiscountEnabled) {
                        vm.limo.charges = utilities.round(result.charges + result.tax)
                    }
                    sumCharges();
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.taxCategoryChanged = function () {

                if (vm.limo.taxCategory == 1) {
                    vm.limo.taxPercent = vm.taxPercent;
                    vm.limo.charges = vm.limo.charges - vm.limo.tax;
                    vm.limo.tax = 0;
                    vm.limo.tripCharges.forEach(function (tripCharge) {
                        tripCharge.tax = (tripCharge.charges * vm.limo.taxPercent) / 100;
                        vm.limo.tax += tripCharge.tax;
                    });
                    vm.limo.charges = vm.limo.charges + vm.limo.tax;
                }
                else if (vm.limo.taxCategory == 2 || vm.limo.taxCategory == 3) {
                    vm.limo.taxPercent = 0;
                    vm.limo.charges = vm.limo.charges - vm.limo.tax;
                    vm.limo.tax = 0;

                    vm.limo.tripCharges.forEach(function (tripCharge) {
                        tripCharge.tax = (tripCharge.charges * vm.limo.taxPercent) / 100;
                    });
                }

            }

            vm.emptyDropOffTime = function () {
                // Clear the model value
                vm.limo.dropOffTime = null;


                // Manually trigger Angular's digest cycle
                if (!$scope.$$phase) {
                    $scope.$apply();
                }

                // Reset the datetimepicker plugin (if applicable)
                var inputElement = document.querySelector('input[ng-model="vm.limo.dropOffTime"]');
                if (inputElement) {
                    // Clear the input value
                    inputElement.value = '';

                    // Trigger the input event to notify Angular
                    angular.element(inputElement).triggerHandler('input');

                    // If the datetimepicker plugin has a method to reset, call it
                    if (angular.element(inputElement).data('datetimepicker')) {
                        angular.element(inputElement).datetimepicker('clear');
                    }
                }

            };



            vm.emptyPickUpTime = function () {
                // Clear the model value
                vm.limo.pickupTime = null;
                vm.limo.tripStatus = 10;

                // Manually trigger Angular's digest cycle
                if (!$scope.$$phase) {
                    $scope.$apply();
                }

                // Reset the datetimepicker plugin (if applicable)
                var inputElement = document.querySelector('input[ng-model="vm.limo.pickupTime"]');
                if (inputElement) {
                    // Clear the input value
                    inputElement.value = '';

                    // Trigger the input event to notify Angular
                    angular.element(inputElement).triggerHandler('input');

                    // If the datetimepicker plugin has a method to reset, call it
                    if (angular.element(inputElement).data('datetimepicker')) {
                        angular.element(inputElement).datetimepicker('clear');
                    }
                }

            };
            vm.clearIfPlaceholder = function () {
                if (vm.limo) {
                    if (vm.limo.pickupTime) {
                        if (vm.limo.id > 0) {
                            if (vm.originalTripStatus == 10) {
                                vm.limo.tripStatus = 1;
                            } else {
                                vm.limo.tripStatus = vm.originalTripStatus;
                            }
                        } else {
                            vm.limo.tripStatus = 1;
                        }
                    }
                }
            };

            vm.changeCharges = function () {
                if (vm.isLimoDiscountEnabled) {
                    var isDiscountAdded = vm.limo.tripCharges.some(charge => charge.chargesTypeId === 22);
                    var limoFareCharges = vm.limo.tripCharges.find(charge => charge.chargesTypeId === 24);
                    var isDiscountTaxable = limoFareCharges.taxable;
                    if (!isDiscountAdded) {
                        var discountCharges = {
                            charges: 0,
                            tax: 0,
                            taxable: isDiscountTaxable,
                            chargesType: {
                                id: 22,
                                name: "(Discount)",
                            },
                            chargesTypeId: 22,
                            module: 3,
                            quantity: 0,
                            rate: 0
                        }
                        vm.limo.tripCharges.push(discountCharges);
                    }

                }
                if (vm.taxCategoryChangeableInTrip) {

                    vm.limo.tripCharges.forEach(function (tripCharge) {
                        tripCharge.tax = (tripCharge.charges * vm.limo.taxPercent) / 100;
                    });
                }


                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/limousine/trips/changeChargesModal.cshtml',
                    controller: 'tenant.views.crs.limousine.trips.changeChargesModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        options: function () {
                            return {
                                trip: vm.limo,
                                viewMode: (vm.limo.isPrepaymentRequired && vm.limo.receiptId),
                                customerTaxRule: vm.limo.customer ? vm.limo.customer.taxRule : null
                            };
                        }
                    }
                });
            };

            vm.searchInvoicePopoup = function () {
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
                        vm.invoiceSelected(result);
                    }
                });
            };


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
                        vm.customerSelected(result);
                    }
                });
            };

            function getTariffGroup() {
                vm.loading = true;
                commonLookupService.getTariffGroups({}).success(function (data) {
                    vm.tariffGroups = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function getTripTypes() {
                commonLookupService.getTripTypes().success(function (data) {
                    vm.tripTypes = data.items;
                });
            }
            if (options.quotationId) {

            }
            function getLimoQuotation() {

                limoQuotationService.getQuotationForEdit({ id: options.quotationId }).success(function (data) {
                    vm.limoQuotation = data;
                    if (options.quotationId && vm.limoQuotation.id > 0) {

                        //var tripCharges = vm.limo.tripCharges
                        vm.limo = vm.limoQuotation;
                        vm.tripTaxPercent = vm.limoQuotation.taxPercent;
                        vm.limo.charges = vm.limoQuotation.amount;
                        vm.limo.chargesWithoutDiscount = vm.limoQuotation.amount;
                        vm.limo.chargesWithDiscount = vm.limoQuotation.amount;
                        vm.limo.tax = vm.limoQuotation.tax;
                        vm.limo.isRoundTrip = vm.limoQuotation.isRoundTrip;
                        vm.limo.customerId = vm.limoQuotation.customerId;
                        vm.limo.customer = vm.limoQuotation.customer;
                        vm.limo.tripCharges = vm.limoQuotation.limoQuotationCharge;
                        vm.limo.customer = vm.limoQuotation.customer;
                        vm.limo.customer.displayText = vm.limo.customer.name + " " + vm.limo.customer.code;
                        /*vm.limo.customer.displayText = vm.limoQuotation.customer.name + " " + vm.limoQuotation.customer.code;
                        vm.limo.pickupLocation = vm.limoQuotation.pickupLocation;
                        vm.limo.pickupLocationId = vm.limoQuotation.pickupLocationId;
                        vm.limo.dropOffLocation = vm.limoQuotation.dropOffLocation;
                        vm.limo.dropOffLocationId = vm.limoQuotation.dropOffLocationId;
                        vm.limo.tripTypeId = vm.limoQuotation.tripTypeId;
                        vm.limo.tripType = vm.limoQuotation.tripType;
                        vm.limo.vehicleGroup = vm.limoQuotation.vehicleGroup;
                        vm.limo.vehicleGroupId = vm.limoQuotation.vehicleGroupIds;
                        vm.limo.notes = vm.limoQuotation.notes;*/
                        vm.limo.id = 0;
                        vm.limo.pickupDateTime = vm.pickupDateTime;
                        vm.limo.dropOffDateTime = vm.dropoffDateTime;
                        vm.limo.limoQuotationId = options.quotationId;
                        setIfDropOffLocationRequired();
                    }
                });
            }

            function init() {
                vm.loading = true;
                getTariffGroup();
                getTripTypes();
                vm.branchTaxCode();
                vm.showCalCharges = true;
                // Add assign option in status array at second index
                if (vm.isAssigningStepForLimoTripBeforeDispatch) {
                    vm.tripStatuses.splice(1, 0, {
                        id: 9, name: app.localize("Assigned")
                    });
                }
                tripService.getTripForEdit({ id: tripId }).success(function (data) {
                    vm.limo = data;
                    if (vm.sendEmailToContactPersonOnTripCreation) {
                        if (vm.isEditMod) {
                            vm.loadContactPersonForEdit(vm.limo.customerId);
                            if (vm.limo.emailToContactPerson) {
                                vm.contactPersonName = angular.copy(vm.limo.emailToContactPerson);
                                vm.contactPersonName = angular.fromJson(vm.contactPersonName);

                            }
                            else {
                                vm.contactPersonName = "";
                            }
                        }
                    }
                    vm.originalTripStatus = angular.copy(vm.limo.tripStatus);
                    if (!vm.limo.id) {
                        vm.limo.discount = 0;
                        vm.limo.chargesWithDiscount = 0;
                        if (vm.manualPickUpAndDropOffDateTime) {
                            vm.limo.dropOffDateTime = null;
                            vm.limo.pickupDateTime = null;
                        }

                        if (vm.separateDateAndTime) {
                            vm.limo.tripStatus = 10;
                        }
                    }
                    if (vm.quantityAndRateInLimo) {
                        vm.limo.tripCharges.forEach(function (tripCharge) {
                            if (tripCharge.taxable && tripCharge.taxCategory == 0) {
                                tripCharge.taxCategory = 1;
                            }
                            else if (!tripCharge.taxable && tripCharge.taxCategory == 0) {
                                tripCharge.taxCategory = 2;
                            }
                        });
                    }
                    if (!vm.separateDateAndTime) {
                        vm.pickupDateTime = vm.limo.pickupDateTime;
                        vm.dropoffDateTime = vm.limo.dropOffDateTime;
                    }
                    else {
                        if (vm.limo.pickupDateTime) {
                            // Parse the pickupDateTime as UTC
                            const pickupDateObj = moment.utc(vm.limo.pickupDateTime, 'YYYY-MM-DD HH:mm:ss');
                            vm.limo.pickupDate = pickupDateObj;

                            if (vm.limo.tripStatus == 10) {
                                vm.limo.pickupTime = null;
                            } else {
                                vm.limo.pickupTime = pickupDateObj;
                            }
                        }

                        if (vm.limo.dropOffDateTime) {
                            // Parse the dropOffDateTime as UTC
                            const dropOffDateObj = moment.utc(vm.limo.dropOffDateTime, 'YYYY-MM-DD HH:mm:ss');
                            vm.limo.dropOffDate = dropOffDateObj;

                            if (vm.limo.tripStatus == 10) {
                                vm.limo.dropOffTime = null;
                            } else {
                                vm.limo.dropOffTime = dropOffDateObj;
                            }
                        }
                    }

                    vm.isFinishedTrip = vm.limo.tripStatus == 4;
                    vm.disableCustomer = options.isCustomerLogin && options.contact ? true : false;
                    vm.allowStatusChangeInTripEditing = vm.allowStatusChangeInTripEditing && !vm.limo.isPrepaymentRequired;
                    if (vm.limo.isPrepaymentRequired && !vm.limo.receiptId)
                        vm.prePaymentMsg = 'Prepayment is required however not paid yet.';
                    if (vm.limo.driver && vm.limo.vehicle)
                        vm.externalVehicle = vm.limo.driver.contactType == 4 && (vm.limo.vehicle.ownership == 4 || vm.limo.vehicle.ownership == 2);
                    if (options.isCustomerLogin && options.contact) {
                        vm.limo.customer = options.contact;
                        vm.limo.isCorporateUser = true;
                    }
                    if (vm.limo.id > 0) {
                        if (vm.isLimoDiscountEnabled) {
                            if (vm.limo.discount)
                                vm.limo.chargesWithDiscount = vm.limo.charges + parseFloat(vm.limo.discount);
                            else
                                vm.limo.chargesWithDiscount = vm.limo.charges;
                            var discountCharge = vm.limo.tripCharges.find(e => e.chargesTypeId == 22);
                            if (discountCharge) {
                                discountCharge.chargesType.name = '(' + discountCharge.chargesType.name + ')'
                            }
                        }
                        vm.documents = vm.limo.documents;
                        vm.tripTaxPercent = vm.limo.taxPercent;
                        var startDate = moment(vm.limo.pickupDateTime);
                        var endDate = moment(vm.limo.dropOffDateTime);
                        setIfDropOffLocationRequired();
                        //var durationInMinutes = endDate.diff(startDate, 'minutes');
                        //if (vm.limo.dropOffLocation != null)
                        //    drawMap();
                        //else
                        //    drawLocation(vm.limo.pickupLocation);
                    }
                    else if (vm.isBranchWiseTaxEnabled) {
                        vm.taxPercent = vm.limo.taxPercent;
                    }

                    if (vm.limo.noOfPersons == 0)
                        vm.limo.noOfPersons = null;
                    if (options.quotationId) {
                        getLimoQuotation();
                    }
                }).finally(function () {

                    vm.loading = false;
                    //if (options.quotationId) {
                    //    limoQuotationService.getQuotationForEdit({ id: options.quotationId }).success(function (data) {
                    //        vm.limoQuotation = data;

                    //        if (vm.limoQuotation) {
                    //            // Apply limo quotation data
                    //            vm.limo = vm.limoQuotation;
                    //            vm.tripTaxPercent = vm.limoQuotation.taxPercent;
                    //            vm.limo.charges = vm.limoQuotation.amount;
                    //            vm.limo.tax = vm.limoQuotation.tax;
                    //            vm.limo.isRoundTrip = vm.limoQuotation.isRoundTrip;
                    //            vm.limo.customerId = vm.limoQuotation.customerId;
                    //            vm.limo.customer = vm.limoQuotation.customer;
                    //            vm.limo.customer.displayText = vm.limo.customer.name + " " + vm.limo.customer.code;
                    //            vm.limo.tripCharges = vm.limoQuotation.limoQuotationCharge;
                    //            vm.limo.id = 0;
                    //            vm.limo.limoQuotationId = options.quotationId;
                    //            setIfDropOffLocationRequired();
                    //        }
                    //    }).finally(function () {
                    //        vm.loading = false;
                    //    });
                    //} else {
                    //    vm.loading = false;
                    //}
                });

            }
            vm.saveAndPrint = function () {
                window.open('/Report#/tenant/printModalTrip/' + vm.limo.id);
            };

            vm.checkNoOfTrips = function () {
                vm.loading = true;
                tripService.getPerDayAndHourTripCount({ fromDate: vm.limo.pickupDateTime })
                    .success(function (result) {
                        var tripsCount = result;
                        vm.loading = false;
                        var showWarning = false;
                        var warningMessage = "";
                        if ((tripsCount.perHourTrips + 1) > vm.perHourTripsLimit) {
                            showWarning = true;
                            warningMessage = app.localize("TripHourlyLimitWarningMessage", vm.perHourTripsLimit);
                        }
                        else if ((tripsCount.perDayTrips + 1) > vm.perDayTripsLimit) {
                            showWarning = true;
                            warningMessage = app.localize("TripDailyLimitWarningMessage", vm.perDayTripsLimit);
                        }
                        if (showWarning) {
                            abp.message.confirm(
                                warningMessage,
                                function (isConfirmed) {
                                    if (isConfirmed)
                                        vm.save();
                                }
                            );
                        }
                        else {
                            vm.save();
                        }

                    }).finally(function () {

                    });
            }

            vm.saveTrip = function () {

                if (vm.perDayTripsLimit > 0 || vm.perHourTripsLimit > 0) {
                    vm.checkNoOfTrips();
                }
                else {

                    vm.save();
                }

            };

            vm.save = function () {
                vm.saving = true;

                //if (vm.perDayTripsLimit > 0 || vm.perHourTripsLimit > 0) {
                //    vm.proceedSaving = false;
                //    vm.checkNoOfTrips();
                //    if (!vm.proceedSaving) {
                //        return;
                //    }
                //}
                //if (vm.trip.contact) {
                //    vm.trip.contactId = vm.trip.contact.id;
                //}
                if (vm.sendEmailToContactPersonOnTripCreation) {
                    vm.limo.emailToContactPerson = vm.contactPersonName
                        ? angular.toJson(vm.contactPersonName.map(contact => contact.id))  // Map contact objects to IDs
                        : "";
                }
                if (!vm.externalVehicle) {
                    vm.limo.supplierCharges = null;
                    vm.limo.supplier = null;
                    vm.limo.supplierId = null;
                }
                if (vm.separateDateAndTime) {
                    if (vm.limo.pickupTime) {
                        const pickupTime = moment(vm.limo.pickupTime, 'HH:mm').toDate();

                        const pickupHours = pickupTime.getHours();
                        const pickupMinutes = pickupTime.getMinutes();
                        const formattedPickupDate = moment(vm.limo.pickupDate).format('YYYY-MM-DD');
                        const pickupDateTimeString = `${formattedPickupDate} ${pickupHours}:${pickupMinutes}`;

                        vm.limo.pickupDateTime = moment(pickupDateTimeString, 'YYYY-MM-DD HH:mm')
                            .utc()
                            .toDate(); // Removed .format() and kept .toDate()
                    } else {
                        const formattedPickupDate = moment(vm.limo.pickupDate).format('YYYY-MM-DD');
                        const dynamicPickupTime = moment().startOf('day').format('HH:mm');
                        const pickupDateTimeString = `${formattedPickupDate} ${dynamicPickupTime}`;

                        vm.limo.pickupDateTime = moment(pickupDateTimeString, 'YYYY-MM-DD HH:mm')
                            .utc()
                            .toDate(); // Removed .format() and kept .toDate()
                    }

                    // Handle drop-off time
                    if (vm.limo.dropOffTime) {
                        const dropOffTime = moment(vm.limo.dropOffTime, 'HH:mm').toDate();

                        const dropOffHours = dropOffTime.getHours();
                        const dropOffMinutes = dropOffTime.getMinutes();
                        const formattedDropOffDate = moment(vm.limo.dropOffDate).format('YYYY-MM-DD');
                        const dropOffDateTimeString = `${formattedDropOffDate} ${dropOffHours}:${dropOffMinutes}`;

                        vm.limo.dropOffDateTime = moment(dropOffDateTimeString, 'YYYY-MM-DD HH:mm')
                            .utc()
                            .toDate(); // Removed .format() and kept .toDate()
                    } else {
                        const formattedDropOffDate = moment(vm.limo.dropOffDate).format('YYYY-MM-DD');
                        const dynamicDropOffTime = moment().startOf('day').format('HH:mm');
                        const dropOffDateTimeString = `${formattedDropOffDate} ${dynamicDropOffTime}`;

                        vm.limo.dropOffDateTime = moment(dropOffDateTimeString, 'YYYY-MM-DD HH:mm')
                            .utc()
                            .toDate(); // Removed .format() and kept .toDate()
                    }
                }
                if (vm.manualPickUpAndDropOffDateTime) {
                    if (!vm.limo.dropOffDateTime) {
                        vm.saving = false;
                        return abp.message.error('Dropoff datetime is required');
                    }
                }
                if (vm.externalVehicle) {
                    vm.limo.vehicle.modelId = vm.limo.vehicle.model.id;
                }

                if (vm.limo.additionalDriver != null)
                    vm.limo.additionalDriverId = vm.limo.additionalDriver.id;
                else
                    vm.limo.additionalDriverId = null;

                vm.limo.documents = vm.documents;
                vm.limo.isCustomerLogIn = vm.disableCustomer;

                tripService.createOrUpdateTrip({
                    trip: vm.limo,
                }).success(function (result) {
                    vm.reset = true;
                    vm.saved = true;
                    vm.savedOnce = true;
                    vm.limo.id = result.id;
                    vm.limo.tripNo = result.tripNo;
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    if (vm.saveAndInvoice) {
                        var invoicesToGenerate = [];
                        //invoicesToGenerate.push({
                        //    id: vm.limo.id,
                        //    tripNo: vm.limo.tripNo,
                        //    customerId: vm.limo.customerId,
                        //    pickupDateTime: vm.limo.pickupDateTime,
                        //    driverId: vm.limo.driverId,
                        //    vehicleId: vm.limo.vehicleId,
                        //    charges: vm.limo.charges,
                        //    taxPercent: vm.limo.taxPercent,
                        //    tax: vm.limo.tax,
                        //    locationId: result.locationId,
                        //    notes: vm.limo.notes,
                        //    tripCharges: vm.limo.tripCharges,
                        //});
                        vm.invoice = {
                            date: moment().utc(),
                            fromDate: moment().utc(),
                            toDate: moment().utc(),
                            contact: vm.limo.customer,
                            contactId: vm.limo.customerId,
                            voucherSubTypeId: 2,
                            amount: vm.limo.charges,
                            tax: vm.limo.tax,
                            taxPercent: vm.limo.taxPercent,
                            customField2: vm.limo.customField2,
                            customField3: vm.limo.customField3,
                            amountInWords: utilities.toWords(vm.limo.charges),
                            currencyId : (vm.isMulticurrencyEnabled && vm.limo.customer.currencyId != null)
                                ? vm.limo.customer.currencyId
                                : null,
                            currencyRate : (vm.isMulticurrencyEnabled
                                && vm.limo.customer.currency != null)
                                ? vm.limo.customer.currency.currencyToBaseRate
                                : 0,

                        };
                        invoicesToGenerate.push(vm.limo);
                        invoiceService.createOrUpdateInvoice({ invoice: vm.invoice, module: 3, trips: invoicesToGenerate }).success(function (result) {
                            vm.generatedInvoices = result;
                            var modalInstance = $uibModal.open({
                                templateUrl: '~/App/tenant/views/crs/vouchers/invoices/createOrEditLimoModal.cshtml',
                                controller: 'tenant.views.crs.vouchers.invoices.createOrEditLimoModal as vm',
                                backdrop: 'static',
                                size: 'xl',
                                resolve: {
                                    invoiceId: function () {
                                        return vm.generatedInvoices;
                                    }
                                }
                            });

                        }).finally(function () {
                        });



                    }
                    //if (vm.saveAndPrint)
                    //    saveAndPrint(vm.limo.id);
                    if (vm.isEditMod)
                        $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            vm.resetFields = function () {
                vm.reset = false;
                vm.saved = false;
                //vm.limo.invoice = null;
                //vm.limo.isInvoiceTo = false;
                vm.documents = [];
                init();
            };

            init();
        }
    ]);
