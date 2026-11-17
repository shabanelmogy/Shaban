// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:247098-247377
appModule.controller('tenant.views.crs.limousine.tariff.index', [
        '$scope', 'abp.services.app.directory', '$uibModal', '$filter', 'abp.services.app.tripType', 'abp.services.app.limoTariff', 'abp.services.app.tariffGroup', 'abp.services.app.commonLookup',
        function ($scope, directoryService, $uibModal, $filter, tripTypeService, limoTariffService, tariffGroupService, commonLookupService) {
            var vm = this;
            vm.loading = false;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.geoLocations = [];
            vm.customer = null;
            vm.tariffGroups = [];
            vm.tripTypes = [];
            vm.tariffLinesBase = [];
            vm.tariffLinesCorporate = [];

            var tariffGroupsLoaded = false;
            var tripTypesLoaded = false;
            var baseTariffLoaded = false;
            var corporateTariffLoaded = false;

            // Searching Places Google MapApi
            vm.searchLocations = function ($select) {
                if ($select.search == '') return null;
                return commonLookupService.searchLimoPlaces({ keyWord: $select.search }).then(function (response) {
                    vm.geoLocations = response.data.items;
                });
            };

            vm.searchCustomers = function ($select) {
                if ($select.search == '') return null;
                //whereas contactType: 1 (staff) and contactType: 2 (customers). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2 }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            // On the Selection Of Customer
            vm.onCustomerSelect = function () {
                getCorporateTariff();
            };

            // extended search using search customer popup
            vm.searchCustomerPopoup = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return 2;
                        },
                        type: function () {
                            return 2;
                        }
                    }
                }).result.then(function (result) {
                    if (result != null) {
                        vm.customer = result;
                        vm.onCustomerSelect();
                    }
                });
            };

            function getCorporateTariff() {
                vm.loading = true;
                corporateTariffLoaded = false;

                limoTariffService.
                    getCorporateTariffForEdit({ customerId: vm.customer.id }).success(function (data) {
                        vm.tariffLinesCorporate = data.items;
                        corporateTariffLoaded = true;
                        initCorporateTariff();
                    }).finally(function () {
                        vm.loading = false;
                    });
            }

            vm.addTariffLine = function (tariffType, tripType) {
                
                var foundLines = [];
                var location1 = null;

                if (tariffType == 1) {
                    foundLines = $filter('filter')(vm.tariffLinesBase, {
                        tariffType: tariffType,
                        tripTypeId: tripType.id
                    }, true);

                    location1 = null;
                    if (foundLines.length > 0) {
                        location1 = foundLines[foundLines.length - 1].location1;
                    }

                    angular.forEach(vm.tariffGroups, function (tariffGroup) {
                        angular.forEach(tripType.baseSetting.rateTypes, function (rateType) {
                            vm.tariffLinesBase.push({ id: null, tariffType: tariffType, tripTypeId: tripType.id, tariffGroupId: tariffGroup.id, order: 1, customerId: null, location1Id: null, location2Id: null, rateTypeId: rateType.id, rate: null, tariffGroup: tariffGroup, location1: location1, location2: null, rateType: rateType });
                        });
                    });

                } else { //corporate

                    foundLines = $filter('filter')(vm.tariffLinesCorporate, {
                        tariffType: tariffType,
                        tripTypeId: tripType.id
                    }, true);

                    location1 = null;
                    if (foundLines.length > 0) {
                        location1 = foundLines[foundLines.length - 1].location1;
                    }

                    angular.forEach(vm.tariffGroups, function (tariffGroup) {
                        angular.forEach(tripType.corporateSetting.rateTypes, function (rateType) {
                            vm.tariffLinesCorporate.push({ id: null, tariffType: tariffType, tripTypeId: tripType.id, tariffGroupId: tariffGroup.id, order: 1, customerId: vm.customer?.id, location1Id: null, location2Id: null, rateTypeId: rateType.id, rate: null, tariffGroup: tariffGroup, location1: location1, location2: null, rateType: rateType });
                        });
                    });
                }

            };


            vm.removeTariffLine = function (tariffType, tariffLine) {
                var index = 0;

                if (tariffType == 1) {
                    index = vm.tariffLinesBase.indexOf(tariffLine);
                    vm.tariffLinesBase.splice(index, 1);
                }
                else { //corporate
                    index = vm.tariffLinesCorporate.indexOf(tariffLine);
                    vm.tariffLinesCorporate.splice(index, 1);
                }

            };

            vm.tariffLocation1Selected = function (tariffType, tariffLine) {
                var tariffLines = tariffType == 1 ? vm.tariffLinesBase : vm.tariffLinesCorporate;

                var foundLines = $filter('filter')(tariffLines, {
                    location1: null,
                    tariffType: tariffType,
                    tripTypeId: tariffLine.tripTypeId
                }, true);

                angular.forEach(foundLines, function (line) {
                    line.location1 = tariffLine.location1;
                });
            };

            vm.tariffLocation2Selected = function (tariffType, tariffLine) {
                var tariffLines = tariffType == 1 ? vm.tariffLinesBase : vm.tariffLinesCorporate;

                var foundLines = $filter('filter')(tariffLines, {
                    location2: null,
                    tariffType: tariffType,
                    tripTypeId: tariffLine.tripTypeId
                }, true);

                angular.forEach(foundLines, function (line) {
                    line.location2 = tariffLine.location2;
                });
            };

            function initBaseTariff() {

                if (tariffGroupsLoaded && tripTypesLoaded && baseTariffLoaded) {

                    angular.forEach(vm.tripTypes, function (tripType) {

                        if (tripType.enableBaseSetting) {

                            angular.forEach(vm.tariffGroups, function (tariffGroup) {
                                angular.forEach(tripType.baseSetting.rateTypes, function (rateType) {
                                    var foundLines = $filter('filter')(vm.tariffLinesBase, {
                                        tripTypeId: tripType.id,
                                        tariffGroupId: tariffGroup.id,
                                        rateTypeId: rateType.id
                                    }, true);

                                    if (foundLines.length == 0) {
                                        vm.tariffLinesBase.push({ id: null, tariffType: 1, tripTypeId: tripType.id, tariffGroupId: tariffGroup.id, order: 1, customerId: null, location1Id: null, location2Id: null, rateTypeId: rateType.id, rate: null, tariffGroup: tariffGroup, location1: null, location2: null, rateType: rateType });
                                    }
                                });
                            });
                        }

                    });
                }
            }

            // Initailizing Corporate Tariff

            function initCorporateTariff() {
                if (tariffGroupsLoaded && tripTypesLoaded && corporateTariffLoaded) {

                    angular.forEach(vm.tripTypes, function (tripType) {

                        if (tripType.enableCorporateSetting) {

                            angular.forEach(vm.tariffGroups, function (tariffGroup) {
                                angular.forEach(tripType.corporateSetting.rateTypes, function (rateType) {
                                    var foundLines = $filter('filter')(vm.tariffLinesCorporate, {
                                        tripTypeId: tripType.id,
                                        tariffGroupId: tariffGroup.id,
                                        rateTypeId: rateType.id
                                    }, true);

                                    if (foundLines.length == 0) {
                                        vm.tariffLinesCorporate.push({ id: null, tariffType: 2, tripTypeId: tripType.id, tariffGroupId: tariffGroup.id, order: 1, customerId: vm.customer.id, location1Id: null, location2Id: null, rateTypeId: rateType.id, rate: null, tariffGroup: tariffGroup, location1: null, location2: null, rateType: rateType });
                                    }
                                });
                            });
                        }

                    });
                }
            }

            function getBaseTariff() {
                vm.loading = true;
                baseTariffLoaded = false;

                limoTariffService.getBaseTariffForEdit().success(function (data) {
                    vm.tariffLinesBase = data.items;
                    baseTariffLoaded = true;
                    initBaseTariff(); //will work on if baseTariffLoaded & tariffGroupsLoaded & tripTypesLoaded
                }).finally(function () {
                    vm.loading = false;
                });
            }

            function init() {

                getBaseTariff();

                tariffGroupService.getTariffGroup({ doNotPaginate:true}).success(function (data) {
                    vm.tariffGroups = data.items;
                    tariffGroupsLoaded = true;
                    initBaseTariff(); //will work on if baseTariffLoaded & tariffGroupsLoaded & tripTypesLoaded
                });

                tripTypeService.getTripTypes().success(function (data) {
                    vm.tripTypes = data.items;
                    tripTypesLoaded = true;
                    initBaseTariff(); //will work on if baseTariffLoaded & tariffGroupsLoaded & tripTypesLoaded
                });
            }

            init();

            vm.saveBaseTariffLine = function () {
                vm.saving = true;
                limoTariffService.createOrUpdateBaseTariff(
                    {
                        LimoTariffLines: vm.tariffLinesBase
                    }).success(function (data) {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        getBaseTariff();
                    }).finally(function () {
                        vm.saving = false;
                    });
            };

            vm.saveCorporateTariffLine = function () {
                vm.saving = true;
                limoTariffService.createOrUpdateCorporateTariff(
                    {
                        customerId: vm.customer.id,
                        LimoTariffLines: vm.tariffLinesCorporate
                    }).success(function (data) {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        getCorporateTariff();
                    }).finally(function () {
                        vm.saving = false;
                    });
            };
        }
    ]);
