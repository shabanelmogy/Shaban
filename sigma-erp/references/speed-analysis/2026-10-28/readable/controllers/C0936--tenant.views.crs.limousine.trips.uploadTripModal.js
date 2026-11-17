// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:254187-254642
appModule.controller('tenant.views.crs.limousine.trips.uploadTripModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'fileName', 'abp.services.app.limoTrip', 'utilities', 'abp.services.app.commonLookup', 'abp.services.app.googleMapAPI', '$filter',
    function ($scope, $uibModal, $uibModalInstance, fileName, tripService, utilities, commonLookupService, mapService, $filter) {

        var vm = this;
        vm.saving = false;
        vm.isEditMod = false;
        vm.dateFormat = abp.setting.get("App.General.DateFormat");
        vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
        vm.cancel = function () {
            $uibModalInstance.close();
        };
        vm.filters = {
            customer: null,
            customerId: null
        }
        vm.getlocalDateTime = function (date) {
            if (date != null) {
                var localTime = moment.utc(date).toDate();
                return moment(localTime).format(vm.dateTimeFormat);
            }
            else {
                return "";
            }
        };
        // on change of Tariff Group
        //vm.tariffGroupChanged = function (row) {
        //    calculateCharges(row);
        //};
        vm.ImportedTrips = false;
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

        function drawLocation(location) {
            mapService.getMap({
                placeId: location.webID,
                PlaceName: location.title
            }).success(function (data) {
                vm.src = data.mapSrc;
            });
        }

        //function drawMap(row) {
        //    mapService.getETA({ fromLocationId: row.pickupLocation.webID, fromLocation: row.pickupLocation.title, toLocationId: row.dropOffLocation.webID, toLocation: row.dropOffLocation.title }).success(function (data) {
        //        row.kms = data.distance;
        //        row.durationInMinutes = data.duration;
        //        var startDate = moment(row.pickupDateTime);
        //        row.dropOffDateTime = moment(startDate).add(row.durationInMinutes, 'minutes').toJSON();
        //        calculateCharges(row);
        //    });
        //}

        //vm.pickupLocationSelected = function (row) {
        //    if (row.pickupLocation != null && row.dropOffLocation != null) {
        //        drawMap(row);

        //    }
        //    else {
        //        calculateCharges(row);
        //    }

        //};
        //vm.dropOffLocationSelected = function (row) {
        //    if (row.pickupLocation != null && row.dropOffLocation != null)
        //        drawMap(row);
        //    else {
        //        calculateCharges(row);
        //    }

        //};
        vm.tripTypeSelected = function (row) {

            setIfDropOffLocationRequired(row);
            ////if dropoff location is not required (i.e not applicable) like hourly trips.
            ////then estimate drop of time based on hours limit for selected trip type
            //if (!row.requiredDropOffLocation) {
            //    row.dropOffLocation = null;
            //    row.dropOffDateTime = moment(row.pickupDateTime).add(limitInMinutes, 'minutes').toJSON();
            //}

            //calculateCharges(row);
        };
        // On The Change Of pickupDateTime
        //date change calls on loading data first time in edit mode. disable calculation if it is first time loading of editing mode

        //var pickupDateTimeLoaded = false;
        //vm.pickupDateTimeChanged = function (row) {
        //    //
        //    //if (pickupDateTimeLoaded) {
        //    // 
        //    row.dropOffDateTime = moment(row.pickupDateTime).add(row.durationInMinutes, 'minutes').toJSON();
        //    if (!row.requiredDropOffLocation)
        //        row.dropOffDateTime = moment(row.pickupDateTime).add(limitInMinutes, 'minutes').toJSON();
        //    // calculateCharges(row);
        //    //}
        //    //else
        //    //    pickupDateTimeLoaded = true;
        //    calculateCharges(row);

        //};

        function setIfDropOffLocationRequired(row) {

            tripType = getTripTypeObj(row.tripTypeId);
            row.requiredDropOffLocation = true;
            if (vm.filters.customer.contactCategory == 2) {
                if (tripType.corporateSetting.limit > 0 && doesExtraHourRateTypeExist(tripType.corporateSetting.rateTypes)) {
                    row.requiredDropOffLocation = false;
                    limitInMinutes = tripType.corporateSetting.limit * 60;
                }
            } else {
                if (tripType.baseSetting.limit > 0 && doesExtraHourRateTypeExist(tripType.baseSetting.rateTypes)) {
                    row.requiredDropOffLocation = false;
                    limitInMinutes = tripType.baseSetting.limit * 60;
                }
            }
        }
        //function calculateCharges(row) {

        //    if (row == null) return;
        //    if (!(vm.filters.customer != null && row.tripTypeId > 0 && row.pickupLocation != null && (!row.requiredDropOffLocation || row.dropOffLocation != null) && row.tariffGroupId > 0)) return;
        //    if (row.pickupDateTime == null || row.dropOffDateTime == null) return;
        //    vm.loading = true;
        //    row.customerId = vm.filters.customer.id;

        //    tripService.calculateCharges(row).success(function (result) {
        //        //row.charges = result.charges;
        //        row.tripCharges = result.tripCharges;
        //        //vm.chargesWithtax = vm.isTaxInclusive ? utilities.round(result.charges, 2) : utilities.round(result.charges + result.tax, 2);
        //        row.charges = vm.isTaxInclusive ? utilities.round(result.charges, 2) : utilities.round(result.charges + result.tax, 2);
        //    }).finally(function () {
        //        vm.loading = false;
        //    });
        //};

        vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));

        // Searching Places Google MapApi
        vm.searchLocations = function ($select) {
            //if (row == null) return null;
            //if (row.tripTypeId == null || row.customer == null) return null;

            //var tariffOnlyLocations = false;
            //var tripType = getTripTypeObj(row.tripTypeId);

            //if (row.customer.contactCategory == 2) {
            //    if (tripType.corporateSetting.locationBased && doesOneTimeRateTypeExist(tripType.corporateSetting.rateTypes))
            //        tariffOnlyLocations = true;
            //} else {
            //    if (tripType.baseSetting.locationBased && doesOneTimeRateTypeExist(tripType.baseSetting.rateTypes))
            //        tariffOnlyLocations = true;
            //}
            //onlyLimoTariffPlaces: tariffOnlyLocations, cusotmerId: row.customer.id
            if (!$select.search) return;
            return commonLookupService.searchLimoPlaces({ keyWord: $select.search }).then(function (response) {
                vm.pickUpLocations = response.data.items;
            });


        };

        vm.tripTypesFilter = function (item) {
            if (!vm.filters.customer)
                return false;
            if (vm.filters.customer.contactCategory == 1 && item.enableBaseSetting == true)
                return true;
            if (vm.filters.customer.contactCategory == 2 && item.enableCorporateSetting == true)
                return true;
            return false;
        };

        vm.searchCustomers = function ($select) {
            //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
            if (!$select.search) return;
            return commonLookupService.searchContact({ keyword: $select.search, contactType: 2 }).then(function (response) {
                vm.customers = response.data.items;
            });
        };
        // extended search using search customer popup
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
                    vm.filters.customer = customer;
                    vm.filters.customerId = customer.id;
                    vm.customerSelected();
                }
            });
        };

        vm.clearCustomer = function () {
            vm.filters.customer = null;
            vm.filters.customerId = null;
        };
        vm.IsCustomerSelected = false;
        vm.customerSelected = function () {

            if (vm.filters.customerId) {
                vm.IsCustomerSelected = true;
                init();

            }
        };
        vm.getlocalDateTime = function (date) {
            if (date != null) {
                var localTime = moment.utc(date).toDate();
                return moment(localTime).format(vm.dateTimeFormat);
            }
            else {
                return "";
            }
        };

        function getTripTypes() {
            commonLookupService.getTripTypes().success(function (data) {
                vm.tripTypes = data.items;
            });
        }
        function getTariffGroups() {
            commonLookupService.getTariffGroups({}).success(function (data) {
                vm.tariffGroups = data.items;
            }).finally(function () {
            });
        };
        //function init() {
        //    vm.loading = true;
        //    tripService.importFromExcel(fileName, vm.filters.customer)
        //    .success(function (result) {
        //        vm.data = result;
        //        vm.data.forEach(function (row) {
        //            if (!row.tripType)
        //                row.tripTypeId = null;
        //            else if (!vm.tripTypesFilter(row.tripType)) {
        //                row.tripTypeId = null;
        //            }
        //            if (row.tripTypeId != null) {
        //                vm.tripTypeSelected(row);
        //            }

        //            //if (row.pickupLocation != null)
        //            //    vm.pickupLocationSelected(row);

        //        });
        //        getTripTypes();
        //        getTariffGroups();
        //        abp.message.success(app.localize('ImportedSuccessfully'));

        //    })
        //    .error(function (response) {
        //        abp.message.error(response.error);
        //    })
        //    .finally(function () {
        //        vm.importing = false;
        //        vm.loading = false;
        //    });
        //}
        //getTripTypes();
        vm.save = function () {
            vm.saving = true;
            tripService.updateCharges({
                trip: vm.trip,
            }).success(function () {
                abp.notify.info(app.localize('SavedSuccessfully'));
                $uibModalInstance.close();
            }).finally(function () {
                vm.saving = false;
            });
        }

        //vm.generateImportedTrips = function () {
        //    vm.saving = true;
        //    vm.data.forEach(function (value) {
        //        value.dropOffLocationId = null;
        //    });
        //    //GenerateImportedTrips
        //    tripService.generateImportedTrips({ trips: vm.data })
        //    .success(function (data) {
        //        vm.ImportedTrips = true;
        //        //$scope.$apply();
        //        vm.generatedTrips = data;

        //        angular.forEach(vm.generatedTrips, function (generatedTrip) {

        //            var foundLines = $filter('filter')(vm.data, {
        //                srNo: generatedTrip.srNo,
        //            }, true);

        //            if (foundLines.length) {
        //                foundLines[0].tripId = generatedTrip.tripId;
        //                foundLines[0].tripNo = generatedTrip.tripNo;
        //                foundLines[0].error = generatedTrip.error;
        //                foundLines[0].notesDuplicate = generatedTrip.notesDuplicate;
        //            }
        //        });
        //        vm.saving = false;
        //    }).finally(function () {
        //        vm.saving = false;
        //    })
        //};

        function init() {
            vm.loading = true;
            tripService.importFromExcel(fileName)
            .success(function (result) {
                vm.data = result;
                         vm.data.forEach(function (row) {
                    //if (!row.tripType)
                    //    row.tripTypeId = null;
                    //else if (!vm.tripTypesFilter(row.tripType)) {
                    //    row.tripTypeId = null;
                    //}
                    //if (row.tripTypeId != null) {
                    //    vm.tripTypeSelected(row);
                    //}

                    //if (row.pickupLocation != null)
                    //    vm.pickupLocationSelected(row);

                });
                getTariffGroups();
                //abp.message.success(app.localize('ImportedSuccessfully'));

            })
            .error(function (response) {
                abp.message.error(response.error);
            })
            .finally(function () {
                vm.importing = false;
                vm.loading = false;
            });
        }
        init();

        var pageNo = 1;
        var pageSize = 10;

        vm.ImportedTrips = false;
        vm.totalGeneratedTrips = 0;
        vm.duplicateTrips = 0;
        vm.errorTrips = 0;
        vm.totalTrips = 0;

        vm.generateImportedTrips = function () {
            
            var tripsToImport = [];
            var startIndex = 1 + ((pageNo - 1) * pageSize);
            var endIndex = pageNo * pageSize;

            if (endIndex > vm.data.length) {
                endIndex = vm.data.length;
            }

            var i = 1;
            for (i = startIndex; i <= endIndex; i++) {
                tripsToImport.push(vm.data[i - 1]);
            }


            if (tripsToImport.length == 0) {
                vm.saving = false;
                vm.ImportedTrips = true;
                vm.duplicateTrips = vm.totalTrips - vm.totalGeneratedTrips - vm.errorTrips;
                return;
            }

            vm.saving = true;
            tripService.generateImportedTrips({ trips: tripsToImport })
            //openingBalanceService.generateImportedOpeningBalances({ openingBalances: tripsToImport })
                .success(function (data) {
                    vm.generatedTrips = data;
                    vm.totalTrips += data.length;
                    vm.errorTrips += (data.length - $filter('filter')(data, {
                        error: null
                    }, true).length);

                    vm.totalGeneratedTrips += ($filter('filter')(data, {
                        error: null,
                        notesDuplicate: null,
                    }, true).length);

                    
                    //vm.duplicateTrips = vm.totalTrips - vm.errorTrips - vm.totalTrips;
                    angular.forEach(vm.generatedTrips, function (generatedTrip) {

                        var foundLines = $filter('filter')(vm.data, {
                            srNo: generatedTrip.srNo,
                        }, true);
                        if (foundLines.length) {
                            foundLines[0].error = generatedTrip.error;
                            foundLines[0].notesDuplicate = generatedTrip.notesDuplicate;
                            foundLines[0].isGenerated = generatedTrip.isGenerated;
                            foundLines[0].tripNo = generatedTrip.tripNo;
                        }
                    });

                    pageNo += 1;

                    if (vm.generatedTrips.length > 0)
                        vm.generateImportedTrips();
                    else {
                       
                        vm.saving = false;
                        vm.ImportedTrips = true;
                        vm.duplicateTrips = vm.totalTrips - vm.totalGeneratedTrips - vm.errorTrips;
                    }

                }).error(function (response) {
                    abp.message.error(response.error);
                    vm.saving = false;

                }).finally(function () {
                });
        };
    }
    ]);
