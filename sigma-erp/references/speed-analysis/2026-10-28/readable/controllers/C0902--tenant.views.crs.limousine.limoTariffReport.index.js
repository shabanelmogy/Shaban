// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:244536-244656
appModule.controller('tenant.views.crs.limousine.limoTariffReport.index', [
        '$scope', 'abp.services.app.directory', '$uibModal', 'abp.services.app.tripType', 'abp.services.app.limoTariff', 'abp.services.app.tariffGroup','appSession',
        function ($scope, directoryService, $uibModal, tripTypeService, limoTariffService, tariffGroupService, appSession) {
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
            vm.fileName = appSession.tenant.tenancyName.toLowerCase() + '-' + 'header.png';
            vm.tenantName = appSession.tenant.name;
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
                if (vm.customer != null) {
                    vm.loading = true;
                    corporateTariffLoaded = false;
                    limoTariffService.getCorporateTariffForEdit({ customerId: vm.customer.id }).success(function (data) {
                        vm.tariffLinesCorporate = data.items;
                        corporateTariffLoaded = true;
                        initCorporateTariff();
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
                else {
                    vm.tariffLinesCorporate = null;
                }
            }

           
         
            // Initailizing Corporate Tariff

            function initCorporateTariff() {
                if (tariffGroupsLoaded && tripTypesLoaded && corporateTariffLoaded) {

                    vm.filteredTripTypes = [];

                    vm.tripTypes.filter(row => row.corporateSetting.locationBased).forEach(e => {
                        //tripTypeId
                        if (vm.tariffLinesCorporate.some(tl => tl.tripTypeId == e.id && (tl.location1 || tl.location2)))
                            vm.filteredTripTypes.push(e);
                    });

                    vm.tripTypes.filter(row => !row.corporateSetting.locationBased).forEach(e => {
                        //tripTypeId
                        if (vm.tariffLinesCorporate.some(tl => tl.tripTypeId == e.id && tl.rate>0))
                            vm.filteredTripTypes.push(e);
                    });

                    
                }
            }

            vm.clearCustomer = function() {
              //  vm.customer.id = null;
                vm.customer = null;
                vm.tariffLinesCorporate = null;
            }
            function init() {

                
                tariffGroupService.getTariffGroup({ doNotPaginate:true}).success(function (data) {
                    vm.tariffGroups = data.items;
                    tariffGroupsLoaded = true;
                   
                });

                tripTypeService.getTripTypes().success(function (data) {
                    vm.tripTypes = data.items;
                    tripTypesLoaded = true;
                   
                });
            }

            init();

           
        }
    ]);
