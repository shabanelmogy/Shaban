// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:413790-414589
appModule.controller('tenant.views.externalLogin.limoBookings.createOrEditModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.directory', 'abp.services.app.googleMapAPI', '$sce', 'tripId',
        'abp.services.app.commonLookup', 'abp.services.app.externalLimoTrip', 'abp.services.app.tripType', 'abp.services.app.vehicle', 'options', 'utilities', 'abp.services.app.invoice', 'appSession',
        function ($scope, $uibModal, $uibModalInstance, directoryService,
            mapService, $sce, tripId, commonLookupService, externalLimoTripService, tripTypeService, vehicleService, options, utilities, invoiceService, appSession) {

            var vm = this;
            vm.saving = false;
            vm.reset = false;
            vm.saved = false;
            vm.savedOnce = false;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.trip_EnableCustomField1 = utilities.parseBoolean(abp.setting.get("App.General.Trip_EnableCustomField1"));
            vm.trip_EnableCustomField2 = utilities.parseBoolean(abp.setting.get("App.General.Trip_EnableCustomField2"));
            vm.trip_EnableCustomField3 = utilities.parseBoolean(abp.setting.get("App.General.Trip_EnableCustomField3"));
            vm.trip_CustomField1Type = parseInt(abp.setting.get("App.General.Trip_CustomField1Type"));
            vm.trip_CustomField2Type = abp.setting.get("App.General.Trip_CustomField2Type");
            vm.trip_CustomField3Type = abp.setting.get("App.General.Trip_CustomField3Type");
            //vm.manualTripNoEnabled = utilities.parseBoolean(abp.setting.get("App.General.ManualTripNoEnabled"));
            vm.flightDetailEnabled = utilities.parseBoolean(abp.setting.get("App.General.FlightDetailEnabled"));
            vm.noOfPersonsEnabled = utilities.parseBoolean(abp.setting.get("App.General.NoOfPersonsEnabled"));
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.enableDriverCommision = utilities.parseBoolean(abp.setting.get("App.General.Limo.EnableDriverCommissionForTrips"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.otherGroupsVehiclePermission = abp.auth.hasPermission('Pages.Tenant.Limousine.Trips.CanSelectOtherGroupsVehicleOnDispatchment');
            vm.isAttachVehicleWithAppPermanentlyEnabled = abp.features.isEnabled('CRS.Limousine.AttachVehicleWithAppPermanently');
            vm.isDispatchingThroughChauffeurQueueEnabled = abp.features.isEnabled('CRS.Limousine.DispatchingThroughChauffeurQueue');
            vm.isBranchWiseTaxEnabled = abp.features.isEnabled('CRS.CustomFeatures.TaxBranchwise');
            vm.saveAndInvoice = false;
            vm.isFinishedTrip = false;
            vm.isEditMod = tripId ? true : false;
            vm.customers = [];
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
            vm.perDayTripsLimit = abp.setting.get("App.General.WarnIfNoOfTripsExceedInDay");
            vm.perHourTripsLimit = abp.setting.get("App.General.WarnIfNoOfTripsExceedInAnHour");

            vm.permissions = {
                changeCharges: abp.auth.hasPermission('Pages.Tenant.Limousine.Trips.ChangeCharges'),
                canViewCharges: abp.auth.hasPermission('Pages.Tenant.Limousine.Trips.CanViewCharges'),
                canEnterChangeDriverCommision: abp.auth.hasPermission('Pages.Tenant.Limousine.Trips.CanEnterChangeDriverCommision'),
            };
            vm.tripStatuses = [
                { id: 1, name: app.localize("New") },
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
                return '';
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

            vm.vehicleSelected = function () {
                getStaffShiftByVehicleOrDriver({ vehicleId: vm.limo.vehicle.id });
            };
            vm.driverSelected = function () {
                getStaffShiftByVehicleOrDriver({ staffId: vm.limo.driver.id });
            };

            vm.trustSrc = function (src) {
                if (src)
                    return $sce.trustAsResourceUrl(src);
            };

            function getStaffShiftByVehicleOrDriver(input) {
                if (vm.isAttachVehicleWithAppPermanentlyEnabled) {
                    externalLimoTripService.getStaffShiftByVehicleOrDriver(input).success(function (result) {
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

            vm.customerSelected = function (customer) {
                if (customer != null)
                    vm.limo.customer = customer;
                vm.limo.customerId = vm.limo.customer.id;
                vm.limo.tripTypeId = null;
                if (vm.isEditMod && vm.tripTaxPercent > 0) {
                    vm.limo.taxPercent = vm.limo.customer.isTaxExempted ? 0 : vm.tripTaxPercent;
                    vm.limo.isTaxExempted = vm.limo.customer.isTaxExempted;
                }
                else {
                    vm.limo.taxPercent = vm.limo.customer.isTaxExempted ? 0 : vm.taxPercent;
                    vm.limo.isTaxExempted = vm.limo.customer.isTaxExempted;
                }
                calculateCharges();
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
                                fromDateTime: moment(vm.limo.pickupDateTime ? vm.limo.pickupDateTime : moment().startOf('day')).utc(),
                                toDateTime: moment(vm.limo.dropOffDateTime ? vm.limo.dropOffDateTime : moment().endOf('day')).utc(),
                                //tariffGroup: vm.searchOtherGroupsVehicle ? null : vm.tariffGroup,
                                //tariffGroupId: vm.searchOtherGroupsVehicle ? null : vm.tariffGroupId,
                                tariffGroupId: vm.otherGroupsVehiclePermission && vm.searchOtherGroupsVehicle ? null : vm.limo.tariffGroupId,
                                statusId: 'IDL',
                                //subStatuses: [1, 7], //1: Available, 7: Ready to go
                                // source: 'openagreement',
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
                    vm.limo.dropOffDateTime = moment(vm.limo.pickupDateTime).add(limitInMinutes, 'minutes').toJSON();
                }

                calculateCharges();
            };

            function setIfDropOffLocationRequired() {
                tripType = getTripTypeObj(vm.limo.tripTypeId);
                vm.requiredDropOffLocation = true;
                if (vm.limo.customer.contactCategory == 2) {
                    if (tripType.corporateSetting.limit > 0 && doesExtraHourRateTypeExist(tripType.corporateSetting.rateTypes)) {
                        vm.requiredDropOffLocation = false;
                        limitInMinutes = tripType.corporateSetting.limit * 60;
                    }
                } else {
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
            vm.pickupDateTimeChanged = function () {
                if (vm.isFinishedTrip) return;

                //if ((vm.isEditMod && pickupDateTimeLoaded) || !vm.isEditMod) {
                if (!vm.isEditMod) {
                    vm.limo.dropOffDateTime = moment(vm.limo.pickupDateTime).add(durationInMinutes, 'minutes').toJSON();
                    if (!vm.requiredDropOffLocation)
                        vm.limo.dropOffDateTime = moment(vm.limo.pickupDateTime).add(limitInMinutes, 'minutes').toJSON();
                    calculateCharges();
                }
                else
                    pickupDateTimeLoaded = true;
            };


            vm.dropOffDateTimeChanged = function () {

                calculateCharges();
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
                return commonLookupService.searchContact({ keyword: $select.search, contactType: 2, activeOnly: true }).then(function (response) {
                    vm.customers = response.data.items;
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
                //whereas contactCategory: 1 (person). get all persons which includes staff as well
                var showActiveDriversOnly = utilities.parseBoolean(abp.setting.get("App.General.Limo.ShowActiveDriversOnlyInLimoGrid"));
                return commonLookupService.searchContact({ keyword: $select.search, contactType: 1, activeOnly: showActiveDriversOnly }).then(function (response) {
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
                vehicleService.searchVehicles({ plateNo: $select.search, statusId: 'IDL', tariffGroupId: vm.otherGroupsVehiclePermission && vm.searchOtherGroupsVehicle ? null : vm.limo.tariffGroupId })
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

            //function drawLocation(location) {
            //    mapService.getMap({
            //        placeId: location.webID,
            //        PlaceName: location.title
            //    }).success(function (data) {
            //        //  vm.src = data.mapSrc;
            //    });
            //}

            function drawMap() {
                mapService.getDistanceWithTime({ fromLocationId: vm.limo.pickupLocation.webID, fromLocation: vm.limo.pickupLocation.title, toLocationId: vm.limo.dropOffLocation.webID, toLocation: vm.limo.dropOffLocation.title }).success(function (data) {
                    //  vm.src = data.mapSrc;
                    if (!vm.isFinishedTrip)
                        vm.limo.kms = data.distance;
                    durationInMinutes = data.duration;
                    var startDate = moment(vm.limo.pickupDateTime);
                    if (!vm.isEditMod)
                        vm.limo.dropOffDateTime = moment(startDate).add(durationInMinutes, 'minutes').toJSON();
                });
            }
            function sumCharges() {
                if (vm.limo.tripCharges == null) return;

                var totalCharges = 0.0;
                var totalTax = 0.0;

                for (var i = 0; i < vm.limo.tripCharges.length; i++) {
                    if (vm.limo.tripCharges[i].charges > 0) {
                        var tax = 0;
                        if (vm.limo.tripCharges[i].taxable && vm.limo.taxPercent > 0) {
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

            };
            function calculateCharges() {

                if (vm.limo == null) return;
                if (!(vm.limo.customer != null && vm.limo.tripTypeId > 0 && vm.limo.pickupLocation != null && (!vm.requiredDropOffLocation || vm.limo.dropOffLocation != null) && vm.limo.tariffGroupId > 0)) return;

                vm.loading = true;
                vm.limo.customerId = vm.limo.customer.id;

                externalLimoTripService.calculateCharges(vm.limo).success(function (result) {
                    //vm.limo.charges = result.charges;
                    vm.limo.tripCharges = result.tripCharges;
                    //vm.chargesWithtax = vm.isTaxInclusive ? utilities.round(result.charges, 2) : utilities.round(result.charges + result.tax, 2);
                    vm.limo.charges = vm.isTaxInclusive ? utilities.round(result.charges, 2) : utilities.round(result.charges + result.tax, 2);
                    sumCharges();
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.changeCharges = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/limousine/trips/changeChargesModal.cshtml',
                    controller: 'tenant.views.crs.limousine.trips.changeChargesModal as vm',
                    backdrop: 'static',
                    resolve: {
                        options: function () {
                            return {
                                trip: vm.limo,
                                //viewMode: (vm.limo.isPrepaymentRequired && vm.limo.receiptId)
                                viewMode: true
                            };
                        }
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

            function init() {
                vm.loading = true;
                getTariffGroup();
                getTripTypes();
                externalLimoTripService.getTripForEdit({ id: tripId }).success(function (data) {
                    vm.limo = data;
                    vm.isFinishedTrip = vm.limo.tripStatus == 4;
                    vm.disableCustomer = options.isCustomerLogin && options.contact ? true : false;
                    vm.allowStatusChangeInTripEditing = vm.allowStatusChangeInTripEditing && !vm.limo.isPrepaymentRequired;
                    if (vm.limo.isPrepaymentRequired && !vm.limo.receiptId)
                        vm.prePaymentMsg = 'Prepayment is required however not paid yet.';
                    if (vm.limo.driver && vm.limo.vehicle)
                        vm.externalVehicle = vm.limo.driver.contactType == 4 && (vm.limo.vehicle.ownership == 4 || vm.limo.vehicle.ownership == 2);
                    if (options.isCustomerLogin && options.contact)
                        vm.limo.customer = options.contact;
                    if (vm.limo.id > 0) {

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

                }).finally(function () {
                    vm.loading = false;
                });

            }
            vm.saveAndPrint = function () {
                window.open('/Report#/tenant/printModalLimoBookings/' + vm.limo.id);
            };

            vm.checkNoOfTrips = function () {
                vm.loading = true;
                externalLimoTripService.getPerDayAndHourTripCount({ fromDate: vm.limo.pickupDateTime })
                    .success(function (result) {
                        var tripsCount = result;
                        vm.loading = false;
                        var showWarning = false;
                        var warningMessage = "";
                        if ((tripsCount.perHourTrips + 1) > vm.perHourTripsLimit) {
                            showWarning = true;
                            warningMessage = app.localize("TripHourlyLimitWarningMessage", vm.perHourTripsLimit);
                        }
                        else if ((tripsCount.perDayTrips + 1) > vm.perDayTripsLimit){
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

                if (!vm.externalVehicle) {
                    vm.limo.supplierCharges = null;
                    vm.limo.supplier = null;
                    vm.limo.supplierId = null;
                }

                vm.limo.isCustomerLogIn = vm.disableCustomer;
                externalLimoTripService.createOrUpdateTrip({
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
                            amountInWords: utilities.toWords(vm.limo.charges)
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
                init();
            };

            init();
        }
    ]);
