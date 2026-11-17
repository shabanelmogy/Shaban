// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:499231-499448
appModule.controller('tenant.views.workshop.workshopVehicles.viewModal', [
        '$state','$stateParams','$scope','$window', '$uibModalInstance', '$uibModal', 'uiGridConstants', 'abp.services.app.vehicle', 'abp.services.app.registrationState', 'abp.services.app.vehicleModel', 'abp.services.app.location',
        '$q', 'vehicleId', 'abp.services.app.commonLookup', 'utilities', 'appSession',
        function ($state, $stateParams, $scope,$window,$uibModalInstance, $uibModal, uiGridConstants, vehicleService, stateService, vehicleModelService, locationService, $q, vehicleId, lookupService, utilities, appSession) {
            var vm = this;
            vm.saving = false;
            vm.states = null;
            vm.models = null;
            vm.locations = null;
            vm.fuelLevels = null;
            vm.tenantName = appSession.tenant.name;
            vm.vehicle_EnableCustomField1 = utilities.parseBoolean(abp.setting.get("App.General.Vehicle_EnableCustomField1"));
            vm.vehicle_EnableCustomField2 = utilities.parseBoolean(abp.setting.get("App.General.Vehicle_EnableCustomField2"));
            vm.vehicle_EnableCustomField3 = utilities.parseBoolean(abp.setting.get("App.General.Vehicle_EnableCustomField3"));
            vm.vehicle_EnableCustomAlert1Date = utilities.parseBoolean(abp.setting.get("App.General.Vehicle_CustomAlert1"));
            vm.vehicle_EnableCustomAlert2Date = utilities.parseBoolean(abp.setting.get("App.General.Vehicle_CustomAlert2"));
            vm.isCostCenterEnabled = abp.features.isEnabled("Core.CostCenters");
            vm.selectedModel = null;
            vm.modelSearchText = null;
            vm.locations = [];
            vm.allactionsonotherbranch = abp.auth.hasPermission('Pages.Tenant.Vehicles.AllActionsOnOtherBranchVehicles');
            vm.isFuelDataEnabled = abp.features.isEnabled('FuelDataMangement'); 
            vm.documentImages = [];
            vm.fileName = appSession.tenant.tenancyName.toLowerCase() + '-' + 'header.png';
            vm.filters = {
                name: '',
                makeId: null
            };

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.getlocalDateTime = function (date) {
                if (date == null)
                    return "";

                var localTime = moment.utc(date).toDate();
                return moment(localTime).format(vm.dateTimeFormat);
            };

            vm.getVehicleExternalType = function (type) {
                if (type == 3)
                    return 'Eppco Fuel Tag 1';
                else if (type == 4)
                    return 'Eppco Fuel Tag 2';
            };

            vm.getCostCenterGroup = function (id) {
                if (id == 1)
                    return app.localize("CostCenterGroup1");
                else if (id == 2)
                    return app.localize("CostCenterGroup2");

            };

            vm.getFuelLevel = function (value) {
                return utilities.getFuelLevel(value);
            };

            vm.openPrintModal = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/printDocumentModel.cshtml',
                    controller: 'tenant.views.crs.vehicles.printDocumentModel as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        vehicleId: function () {
                            return vehicleId;
                        }
                    }
                });
            };


            vm.searchModel = function ($select) {
                vm.filters.name = $select.search;
                if (vm.filters.name == '')
                    vm.filters.name = "~";  //to avoid default suggestions 

                return vehicleModelService.searchVehicleModelsNew(vm.filters).then(function (response) {
                    vm.models = response.data.items;
                });
            };
            vm.getMovementStatus = function (status) {
                if (status == true)
                    return "Completed";
                else
                    return "Open";

            }
            //vm.viewMovementLogs = function () {
            //    $stateParams.plateNo = vm.vehicle.plateNo;
            //    var url = $state.href('tenant.mcc_movements', $stateParams);
            //    $window.open(url, '_blank');
            //}

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
            // TariffGroup Loading
            vm.searchTariffGroups = function ($select) {
                if ($select.search == "") {
                    vm.tariffGroups = null;
                    return null;
                }
                return tariffGroupService.getTariffGroups({ title: $select.search }).then(function (response) {
                    vm.tariffGroups = response.data.items;
                });
            };

            vm.checkOwnership = checkOwnership;
            vm.isOwnOwnership = false;
            function checkOwnership(ownership) {
                if (ownership && ownership.value === 1) {
                    vm.isOwnOwnership = true;
                }
                else {
                    vm.isOwnOwnership = false;
                }
            }

            function getLocations() {

                lookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;


                });
            }

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function mapEnums() {
                if (vm.vehicle.vehicleType == 1)
                    vm.vehicle.vehicleType = 'Rental';
                else if (vm.vehicle.vehicleType == 2)
                    vm.vehicle.vehicleType = 'Lease';
                else if (vm.vehicle.vehicleType == 3)
                    vm.vehicle.vehicleType = 'Replacement';
                else if (vm.vehicle.vehicleType == 4)
                    vm.vehicle.vehicleType = 'Limousine';
                else if (vm.vehicle.vehicleType == 5)
                    vm.vehicle.vehicleType = 'Workshop';
                else
                    vm.vehicle.vehicleType = '';

                if (vm.vehicle.ownership == 1)
                    vm.vehicle.ownership = 'Own';
                else if (vm.vehicle.ownership == 2)
                    vm.vehicle.ownership = 'External';
                else if (vm.vehicle.ownership == 3)
                    vm.vehicle.ownership = 'Buy Back';
                else
                    vm.vehicle.ownership = '';
            }

            function imageGalleryObject() {
                var detail = new Object();
                detail.thumb = "";
                detail.img = "";
                detail.description = "";
                return detail;
            }
            function getMovements(vehicleId) {
                vehicleService.getVehicleMovements(vehicleId).success(function (movement) {
                    vm.vehicle.movements = movement;
                });
            };
            function init() {
                vm.loading = true;
                getLocations();

                vehicleService.getVehicleForViewForWorkshop({
                    id: vehicleId
                }).success(function (result) {
                    
                    vm.vehicle = result;
                    checkOwnership({ value: vm.vehicle.ownership });
                    mapEnums();
                    getMovements(vehicleId);
                    //load document images gallery
                    vm.documentImages = [];

                    for (var i = 0; i < vm.vehicle.documentImages.length; i++) {
                        var img = vm.vehicle.documentImages[i];

                        var imageDetail = imageGalleryObject();
                        imageDetail.thumb = img.imageURL;
                        imageDetail.img = img.imageURL;
                        imageDetail.description = '';
                        vm.documentImages.push(imageDetail);
                    }

                    vm.loading = false;
                });
            }

            init();
        }
    ]);
