// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:245201-246225
appModule.controller('tenant.views.crs.limousine.quotations.createOrEditModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.vehicleModel', 'abp.services.app.directory', 'abp.services.app.googleMapAPI', '$sce', 'quotationId',
        'abp.services.app.commonLookup', 'abp.services.app.limoTrip', 'abp.services.app.tripType', 'abp.services.app.vehicle', 'utilities', 'abp.services.app.invoice',
        'appSession', 'isRevised', 'abp.services.app.limoQuotation', 'abp.services.app.billingMethod',
        function ($scope, $uibModal, $uibModalInstance, vehicleModelService, directoryService,
            mapService, $sce, quotationId, commonLookupService, tripService, tripTypeService, vehicleService, utilities, invoiceService, appSession, isRevised, limoQuotationService, billingMethodService) {

            var vm = this;
            vm.saving = false;
            vm.reset = false;
            vm.saved = false;
            vm.savedOnce = false;
            vm.isEditMod = quotationId ? true : false;
            vm.isRevised = isRevised;
            vm.revisedQuotationId = quotationId;
            vm.branchTaxPercentage = null;
            var limoQuotationId = quotationId;
            vm.taxCategoryChangeableInTrip = abp.features.isEnabled('CRS.TaxCategoryChangeableInTrip');
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.trip_EnableCustomField1 = utilities.parseBoolean(abp.setting.get("App.General.Trip_EnableCustomField1"));
            vm.trip_EnableCustomField2 = utilities.parseBoolean(abp.setting.get("App.General.Trip_EnableCustomField2"));
            vm.trip_EnableCustomField3 = utilities.parseBoolean(abp.setting.get("App.General.Trip_EnableCustomField3"));
            vm.trip_CustomField1Type = parseInt(abp.setting.get("App.General.Trip_CustomField1Type"));
            vm.trip_CustomField2Type = abp.setting.get("App.General.Trip_CustomField2Type");
            vm.trip_CustomField3Type = abp.setting.get("App.General.Trip_CustomField3Type");
            vm.manualTripNoEnabled = utilities.parseBoolean(abp.setting.get("App.General.ManualTripNoEnabled"));
            vm.flightDetailEnabled = utilities.parseBoolean(abp.setting.get("App.General.FlightDetailEnabled"));
            vm.noOfPersonsEnabled = utilities.parseBoolean(abp.setting.get("App.General.NoOfPersonsEnabled"));
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.enableDriverCommision = utilities.parseBoolean(abp.setting.get("App.General.Limo.EnableDriverCommissionForTrips"));
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.isTaxCodeEnabled = abp.features.isEnabled("CRS.TaxCodes");
            vm.otherGroupsVehiclePermission = abp.auth.hasPermission('Pages.Tenant.Limousine.Trips.CanSelectOtherGroupsVehicleOnDispatchment');
            vm.isAttachVehicleWithAppPermanentlyEnabled = abp.features.isEnabled('CRS.Limousine.AttachVehicleWithAppPermanently');
            vm.isDispatchingThroughChauffeurQueueEnabled = abp.features.isEnabled('CRS.Limousine.DispatchingThroughChauffeurQueue');
            vm.isBranchWiseTaxEnabled = abp.features.isEnabled('CRS.CustomFeatures.TaxBranchwise');
            vm.limoQuotation_ContactPersonName = utilities.parseBoolean(abp.setting.get('App.Speed.Common.LimoQuotation_ContactPersonName'));
            vm.limoQuotation_PaymentMethod = utilities.parseBoolean(abp.setting.get('App.Speed.Common.LimoQuotation_PaymentMethod'));
            vm.limoQuotation_PaymentTerms = utilities.parseBoolean(abp.setting.get('App.Speed.Common.LimoQuotation_PaymentTerms'));
            vm.limoQuotation_PickUpDateTime = utilities.parseBoolean(abp.setting.get('App.Speed.Common.LimoQuotation_PickUpDateTime'));
            vm.limoQuotation_DropOffDateTime = utilities.parseBoolean(abp.setting.get('App.Speed.Common.LimoQuotation_DropOffDateTime'));
            vm.saveAndInvoice = false;
            vm.isFinishedTrip = false;
            vm.paymentMethods = [];
            vm.paymentMethodsUnFiltered = [];
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
            vm.isNoOfTripsInLimoEnabled = utilities.parseBoolean(abp.setting.get("App.General.Limo.NoOfTripsInLimo"));
            vm.quantityAndRateInLimo = utilities.parseBoolean(abp.setting.get("App.General.Limo.QuantityAndRateInLimo"));

            vm.permissions = {
                changeCharges: abp.auth.hasPermission('Pages.Tenant.Limousine.Trips.ChangeCharges'),
                canViewCharges: abp.auth.hasPermission('Pages.Tenant.Limousine.Trips.CanViewCharges'),
                canEnterChangeDriverCommision: abp.auth.hasPermission('Pages.Tenant.Limousine.Trips.CanEnterChangeDriverCommision'),
            };
            vm.filters = {
                name: '',
                makeId: null
            };

            vm.limo = {
                quantity: 1, 
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

            var getContactsByCompanyId = function () {
                return directoryService.getContactsByCompanyId({ id: vm.limo.customer.id }).then(function (response) {
                    vm.contactPersons = response.data;
                });
            };

            vm.customerSelected = function (customer) {
                if (customer != null)
                    vm.limo.customer = customer;
                vm.limo.customerId = vm.limo.customer.id;
                vm.limo.contactPerson = null;
                vm.limo.contactPersonId = null;
                vm.contactPersons = [];
                if (vm.limo.customer.contactCategory == 2) {
                    getContactsByCompanyId();
                }

                vm.limo.tripTypeId = null;
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
                else
                {
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
                calculateCharges();
                sumCharges();
            };
            vm.calculateTotalCharges = function () {
                vm.limo.totalCharges = vm.limo.quantity * vm.limo.amount;
            };
            vm.taxCategoryChanged = function () {

                if (vm.limo.taxCategory == 1) {
                    vm.limo.taxPercent = vm.taxPercent;
                    if (vm.taxCategoryChangeableInTrip) {

                        vm.limo.limoQuotationCharge.forEach(function (quotationCharge) {
                            quotationCharge.tax = (quotationCharge.charges * vm.limo.taxPercent) / 100;
                            vm.limo.tax += quotationCharge.tax;
                        });
                        vm.limo.amount = vm.limo.amount + vm.limo.tax;

                    }                }
                else if (vm.limo.taxCategory == 2 || vm.limo.taxCategory == 3) {
                    vm.limo.taxPercent = 0;
                    vm.limo.amount = vm.limo.amount - vm.limo.tax;
                    vm.limo.tax = 0;
                    vm.limo.limoQuotationCharge.forEach(function (quotationCharge) {
                        quotationCharge.tax = (quotationCharge.charges * vm.limo.taxPercent) / 100;
                    });
                }

            }
            vm.branchTaxCode = function () {
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
                }).result.then(function (customer) {
                    if (customer != null) {
                        vm.limo.customer = customer;
                        vm.limo.customerId = customer.id;
                        if (vm.limo.customer.contactCategory == 2) {
                            getContactsByCompanyId();
                        }
                        vm.customerSelected(customer);

                    }
                    vm.limo.contactPerson = null;
                    vm.limo.contactPersonId = null;
                    vm.contactPersons = [];
                });
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
            vm.paymentTerms = [
                {
                    id: 1, name: app.localize("Advance")
                },
                {
                    id: 2, name: app.localize("Credit")
                },
            ];

            //for sixtPakistan
            vm.taxChargesCategories = [
                {
                    id: 1, name: app.localize("Inclusive")
                },
                {
                    id: 2, name: app.localize("Exclusive")
                },
            ];
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
                return commonLookupService.searchContact({ keyword: $select.search, contactType: 1 }).then(function (response) {
                    vm.drivers = response.data.items;
                });
            };

            var getLocationDetail = function (locationObj) {
                return locationObj.detail ? locationObj.detail : locationObj.title;
            }

            vm.openMapUrl = function () {
                var url = null;

                if (vm.limo.pickupLocation && vm.limo.dropOffLocation)
                    url = "https://www.google.com/maps/dir/?api=1&origin=" + getLocationDetail(vm.limo.pickupLocation) + '&destination=' + getLocationDetail(vm.limo.dropOffLocation) + "&travelmode=driving";
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
                //if ($select.search == "" || !vm.limo.tariffGroupId) {
                if ($select.search == "" || !vm.limo.vehicleGroupId) {
                    vm.vehicles = null; return null;
                }
                vehicleService.searchVehicles({ plateNo: $select.search, vehicleGroupId: vm.otherGroupsVehiclePermission/*tariffGroupId: vm.otherGroupsVehiclePermission && vm.searchOtherGroupsVehicle ? null : vm.limo.tariffGroupId*/ })
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

            vm.searchTariffGroups = function (name = "") {
                vm.loading = true;
                commonLookupService.searchTariffGroup({ id: name }).success(function (data) {
                    vm.tariffGroups = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
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
            vm.isRoundTrip = function () {
                if (vm.limo.pickupLocation != null && vm.limo.dropOffLocation != null)
                    drawMap();
            };
            function drawMap() {
                mapService.getDistanceWithTime({ fromLocationId: vm.limo.pickupLocation.webID, fromLocation: vm.limo.pickupLocation.title, toLocationId: vm.limo.dropOffLocation.webID, toLocation: vm.limo.dropOffLocation.title }).success(function (data) {
                    //  vm.src = data.mapSrc;
                    if (!vm.isFinishedTrip)
                        vm.limo.kms = vm.limo.isRoundTrip ? utilities.round(data.distance * 2, 2) : data.distance;
                    durationInMinutes = vm.limo.isRoundTrip ? data.duration * 2 : data.duration;
                    var startDate = moment(vm.limo.pickupDateTime);
                    //if (!vm.isEditMod)
                    vm.limo.dropOffDateTime = moment(startDate).add(durationInMinutes, 'minutes').toJSON();
                });
            }
            function sumCharges() {

                if (vm.limo.limoQuotationCharge == null) return;

                var totalCharges = 0.0;
                var totalTax = 0.0;

                for (var i = 0; i < vm.limo.limoQuotationCharge.length; i++) {
                    if (vm.limo.limoQuotationCharge[i].charges > 0) {
                        var tax = 0;
                        if (vm.limo.limoQuotationCharge[i].taxable && vm.limo.taxPercent > 0 && !vm.quantityAndRateInLimo) {
                            if (vm.isTaxInclusive) {   // prices are with tax. extract include tax amount which will not be added in 
                                //equation solved from following formula... 
                                //chargesWithoutTax + chargesWithoutTax * (taxPercent/100) = chargesWithTax
                                var chargesWithoutTax = (vm.limo.limoQuotationCharge[i].charges * 100) / (100 + vm.limo.taxPercent);
                                tax = utilities.round(vm.limo.limoQuotationCharge[i].charges - chargesWithoutTax, 2);
                                vm.limo.limoQuotationCharge[i].tax = tax;
                                totalTax += utilities.round(tax, 2);
                            } else {
                                //prices are without tax. calculate tax and include in total
                                tax = utilities.round(vm.limo.limoQuotationCharge[i].charges * vm.limo.taxPercent / 100, 2);
                                vm.limo.limoQuotationCharge[i].tax = tax;
                                totalTax += utilities.round(tax, 2);

                            }
                        }
                        else if (vm.limo.taxPercent > 0 && vm.quantityAndRateInLimo) {
                                if (vm.isTaxInclusive) {
                                    var chargesWithoutTax = (vm.limo.limoQuotationCharge[i].charges * 100) / (100 + vm.limo.taxPercent);
                                    if (vm.limo.limoQuotationCharge[i].taxCategory == 2 || vm.limo.limoQuotationCharge[i].taxCategory == 3) {
                                        tax = 0;
                                    } else {
                                        tax = utilities.round(vm.limo.limoQuotationCharge[i].charges - chargesWithoutTax, 2);
                                    }
                                    vm.limo.limoQuotationCharge[i].tax = tax;
                                    totalTax += utilities.round(tax, 2);
                                } else {
                                    //prices are without tax. calculate tax and include in total
                                    if (vm.limo.limoQuotationCharge[i].taxCategory == 2 || vm.limo.limoQuotationCharge[i].taxCategory == 3) {
                                        tax = 0;
                                    } else {
                                        tax = utilities.round(vm.limo.limoQuotationCharge[i].charges * vm.limo.taxPercent / 100, 2);
                                    }
                                    vm.limo.limoQuotationCharge[i].tax = tax;
                                    totalTax += utilities.round(tax, 2);
                                }
                        }
                        else {
                            vm.limo.limoQuotationCharge[i].tax = 0;
                        }

                        totalCharges += parseFloat(vm.limo.limoQuotationCharge[i].charges);
                    }
                    else {
                        vm.limo.limoQuotationCharge[i].tax = 0;
                    }

                }

                vm.limo.charges = vm.isTaxInclusive ? utilities.round(totalCharges, 2) : (utilities.round(totalCharges, 2) + utilities.round(totalTax, 2)) / 1
                vm.limo.charges = utilities.round(vm.limo.charges, 2);
                vm.limo.tax = utilities.round(totalTax, 2);

            };
            function calculateCharges() {

                if (vm.limo == null) return;
                if (!(vm.limo.customer != null && vm.limo.tripTypeId > 0 && vm.limo.pickupLocation != null && (!vm.requiredDropOffLocation || vm.limo.dropOffLocation != null))) return;

                vm.loading = true;
                vm.limo.customerId = vm.limo.customer.id;

                limoQuotationService.calculateCharges(vm.limo).success(function (result) {
                    //vm.limo.charges = result.charges;

                    vm.limo.limoQuotationCharge = result.tripCharges;
                    //vm.chargesWithtax = vm.isTaxInclusive ? utilities.round(result.charges, 2) : utilities.round(result.charges + result.tax, 2);
                    vm.limo.charges = vm.isTaxInclusive ? utilities.round(result.charges, 2) : utilities.round(result.charges + result.tax, 2);
                    vm.limo.amount = vm.isTaxInclusive ? utilities.round(result.charges, 2) : utilities.round(result.charges + result.tax, 2);
                    vm.limo.totalCharges = vm.limo.quantity * vm.limo.amount;

                    sumCharges();
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.changeCharges = function () {
                if (vm.taxCategoryChangeableInTrip) {

                    vm.limo.limoQuotationCharge
                        .forEach(function (tripCharge) {
                            tripCharge.tax = (tripCharge.charges * vm.limo.taxPercent) / 100;
                        });
                }
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/limousine/quotations/changeChargesModal.cshtml',
                    controller: 'tenant.views.crs.limousine.quotations.changeChargesModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                quotation: vm.limo,
                                viewMode: (vm.limo.isPrepaymentRequired && vm.limo.receiptId)
                            };
                        }
                    }
                });
            };





            function getTariffGroup() {
                vm.loading = true;
                commonLookupService.getLimoTariffGroups({}).success(function (data) {
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
                vm.searchTariffGroups();
                vm.branchTaxCode();
                getTripTypes();
                if(vm.limoQuotation_PaymentMethod)
                {
                    getPaymentMethods();
                }
                var createOrRevise = null;

                if (isRevised)
                    createOrRevise = limoQuotationService.getQuotationForRevision({ id: limoQuotationId });
                else
                    createOrRevise = limoQuotationService.getQuotationForEdit({ id: limoQuotationId });


                createOrRevise.success(function (data) {

                    vm.limo = data;
                    if (vm.quantityAndRateInLimo) {
                        vm.limo.limoQuotationCharge.forEach(function (tripCharge) {
                            if (tripCharge.taxable && tripCharge.taxCategory == 0) {
                                tripCharge.taxCategory = 1;
                            }
                            else if (!tripCharge.taxable && tripCharge.taxCategory == 0) {
                                tripCharge.taxCategory = 2;
                            }
                        });
                    }
                    vm.isFinishedTrip = vm.limo.tripStatus == 4;

                    vm.allowStatusChangeInTripEditing = vm.allowStatusChangeInTripEditing && !vm.limo.isPrepaymentRequired;
                    if (vm.limo.isPrepaymentRequired && !vm.limo.receiptId)
                        vm.prePaymentMsg = 'Prepayment is required however not paid yet.';

                    if (isRevised) {
                        var totalCharge = 0;
                        vm.limo.customer.displayText = vm.limo.customer.name + " " + vm.limo.customer.code;
                        vm.limo.limoQuotationCharge.forEach(function (value) {
                            totalCharge += value.charges;
                        });
                        vm.limo.charges = totalCharge;
                    }
                    if (!isRevised && vm.limo.id <=0)
                        vm.limo.quantity = 1;

                    if (vm.limo.id > 0) {
                        var totalCharge = 0;
                        vm.limo.limoQuotationCharge.forEach(function (value) {
                            totalCharge += value.charges;
                        });
                        vm.limo.charges = totalCharge;
                        vm.limo.customer.displayText = vm.limo.customer.name + " " + vm.limo.customer.code;
                        vm.tripTaxPercent = vm.limo.taxPercent;
                        var startDate = moment(vm.limo.pickupDateTime);
                        var endDate = moment(vm.limo.dropOffDateTime);
                        setIfDropOffLocationRequired();
                    }
                    else if (vm.isBranchWiseTaxEnabled) {
                        vm.taxPercent = vm.limo.taxPercent;
                    }

                    if (vm.limo.noOfPersons == 0)
                        vm.limo.noOfPersons = null;

                   
                    



                }).finally(function () {
                    vm.loading = false;
                });


                /*limoQuotationService.getQuotationForEdit({ id: quotationId }).success(function (data) {
                    vm.limo = data;

                    vm.isFinishedTrip = vm.limo.tripStatus == 4;
                    
                    vm.allowStatusChangeInTripEditing = vm.allowStatusChangeInTripEditing && !vm.limo.isPrepaymentRequired;
                    if (vm.limo.isPrepaymentRequired && !vm.limo.receiptId)
                        vm.prePaymentMsg = 'Prepayment is required however not paid yet.';
                    
                   
                    if (vm.limo.id > 0) {
                        var totalCharge = 0;
                        vm.limo.limoQuotationCharge.forEach(function (value) {
                            totalCharge += value.charges;
                        });
                        vm.limo.charges = totalCharge;
                        vm.limo.customer.displayText = vm.limo.customer.name + " " + vm.limo.customer.code
                        vm.tripTaxPercent = vm.limo.taxPercent;
                        var startDate = moment(vm.limo.pickupDateTime);
                        var endDate = moment(vm.limo.dropOffDateTime);
                        setIfDropOffLocationRequired();
                    }
                    else if (vm.isBranchWiseTaxEnabled) {
                        vm.taxPercent = vm.limo.taxPercent;
                    }

                    if (vm.limo.noOfPersons == 0)
                        vm.limo.noOfPersons = null;

                }).finally(function () {
                    vm.loading = false;
                });*/

            }
            vm.saveAndPrint = function () {
                window.open('/Report#/tenant/printModal/' + vm.limo.id);
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
            /*function otherSaveActivities() {
                vm.saving = true;

                if (!vm.externalVehicle) {
                    vm.limo.supplierCharges = null;
                    vm.limo.supplier = null;
                    vm.limo.supplierId = null;
                }

                if (vm.externalVehicle) {
                    vm.limo.vehicle.modelId = vm.limo.vehicle.model.id;
                }

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
            }*/
            vm.save = function () {
                /*commonLookupService.validateCreditLimitDays({ id: vm.limo.customer.id }).success(function (data) {
                    if (!data.isLimitCrossed) {
                        otherSaveActivities();
                    } else {
                        abp.message.error("Customer's credit limit days are exceeded");
                    }
                });*/

                vm.saving = true;
                var createOrRevise = null;
                if (isRevised)
                    createOrRevise = limoQuotationService.reviseQuotation({ quotation: vm.limo, revisedQuotationId: vm.revisedQuotationId });
                else
                    createOrRevise = limoQuotationService.createOrUpdateQuotation({ quotation: vm.limo });

                createOrRevise.success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            function getPaymentMethods() {
                vm.loading = true;
                billingMethodService.getBillingMethods({ category: null}).success(function (data) {
                    vm.paymentMethods = data.items.filter(i => i.isActive && (i.locationId == null || i.locationId === appSession.user.locationId) && (i.userId == null || i.userId === appSession.user.id));
                    vm.paymentMethodsUnFiltered = angular.copy(vm.paymentMethods); //All billing methods retained for customer changed on second time
                }).finally(function () {
                    vm.loading = false;
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
