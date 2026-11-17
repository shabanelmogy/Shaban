// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:212823-213184
appModule.controller('tenant.views.crs.equipmentSales.equipments.viewModal', [
        '$state', '$stateParams', '$scope', '$window', '$uibModalInstance', '$uibModal', 'uiGridConstants', 'abp.services.app.vehicle', 'abp.services.app.vehicleAttachment', 'abp.services.app.registrationState', 'abp.services.app.vehicleModel', 'abp.services.app.location',
        '$q', 'vehicleId', 'abp.services.app.commonLookup', 'utilities', 'appSession',
        function ($state, $stateParams, $scope, $window, $uibModalInstance, $uibModal, uiGridConstants, vehicleService, vehicleAttachmentService, stateService, vehicleModelService, locationService, $q, vehicleId, lookupService, utilities, appSession) {
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
            vm.separateMakeAndModelInFleet = utilities.parseBoolean(abp.setting.get("App.Speed.Common.SeparateMakeAndModelInFleet"));
            vm.selectedModel = null;
            vm.modelSearchText = null;
            vm.locations = [];
            vm.allactionsonotherbranch = abp.auth.hasPermission('Pages.Tenant.Vehicles.AllActionsOnOtherBranchVehicles');
            vm.isFuelDataEnabled = abp.features.isEnabled('FuelDataMangement');
            vm.isVehicleAttachmentsFeatureEnabled = abp.features.isEnabled('CRS.Vehicles.Attachments');
            vm.requiredExternalVehicleOwner = utilities.parseBoolean(abp.setting.get('App.Speed.Common.RequiredExternalVehicleOwner'));
            vm.additionalExternalVehicleOwner = utilities.parseBoolean(abp.setting.get('App.Speed.Common.AdditionalExternalVehicleOwner'));
            vm.showOnlyFewerDetail = utilities.parseBoolean(abp.setting.get('App.Speed.Common.ShowOnlyFewerDetailForVehicle'));
            vm.isInvestorEnabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.Investor"));
            vm.operationVehicleShowInSalesModule = utilities.parseBoolean(abp.setting.get("App.Speed.Common.OperationVehicleShowInSalesModule"));

            vm.documentImagesDocs = {
                imageDocs: [],
                gallaryImages: []
            };
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
                else if (type == 100)
                    return 'Fusion Rev Product Code';
            };

            vm.getChassisType = function (type) {
                if (type == 0)
                    return '';
                else if (type == 1)
                    return app.localize('LongWheelBase');
                else if (type == 2)
                    return app.localize('ShortWheelBase');
                else
                    return type;
            };

            vm.getVehicleWarrantyType = function (type) {
                if (type == 1)
                    return 'Overall warranty';
                else if (type == 2)
                    return 'Engine warranty';
                else if (type == 3)
                    return 'Service warranty';
            };
            vm.getWarrantyPeriod = function (type) {
                if (type == 1)
                    return 'Month';
                else if (type == 2)
                    return 'Date';
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
                    vm.vehicle.vehicleType = app.localize('RentalFleetType');
                else if (vm.vehicle.vehicleType == 2)
                    vm.vehicle.vehicleType = app.localize('LeaseFleetType');
                else if (vm.vehicle.vehicleType == 3)
                    vm.vehicle.vehicleType = app.localize('ReplacementFleetType');
                else if (vm.vehicle.vehicleType == 4)
                    vm.vehicle.vehicleType = app.localize('LimousineFleetType');
                else
                    vm.vehicle.vehicleType = '';

                if (vm.vehicle.ownership == 1)
                    vm.vehicle.ownership = 'Own';
                else if (vm.vehicle.ownership == 2)
                    vm.vehicle.ownership = 'External';
                else if (vm.vehicle.ownership == 3)
                    vm.vehicle.ownership = 'Buy Back';
                else if (vm.vehicle.ownership == 7)
                    vm.vehicle.ownership = 'Investor';
                else if (vm.vehicle.ownership == 8)
                    vm.vehicle.ownership = 'Mortgage';
                else if (vm.vehicle.ownership == 9)
                    vm.vehicle.ownership = 'Lease To Own';
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

            vm.vehicleChassisTypes = [
                { key: " ", value: 0 },
                { key: app.localize('LongWheelBase'), value: 1 },
                { key: app.localize('ShortWheelBase'), value: 2 }
            ];

            vm.isAdditionalFieldsEnabled = function (field) {
                if (!vm.additionalFields || vm.additionalFields.length < 1) return false;
                var row = vm.additionalFields.filter(e => e.name === field)[0];
                if (row) if (row.isEnabled) return true; else return false; else return false;
            };

            vm.isFieldMondatory = function (field) {
                if (!vm.mondatoryFields || vm.mondatoryFields.length < 1) return false;
                var row = vm.mondatoryFields.filter(e => e.name === field)[0];
                if (row) if (row.isRequired) return true; else return false; else {
                    row = utilities.advanceSettingMondatoryFieldscompanyCustomer().filter(e => e.name === field)[0];
                    if (row) if (row.isRequired) return true; else return false; else return false;
                }
            };

            vm.typeOfFeild = function (field) {
                if (!vm.additionalFields || vm.additionalFields.length < 1) return false;
                var row = vm.additionalFields.filter(e => e.name === field)[0];
                return row.value;
            };

            vm.getAdvanceSettings = function () {
                vehicleService.getAdvanceSettings().success(function (data) {
                    if (data.name) {
                        vm.indentityDocuments = data.documents;
                        vm.mondatoryFields = data.mondatoryFields;
                        vm.additionalFields = data.additionalFields;
                        vm.mandatoryDesignations = data.mandatoryDesignations;
                    }
                    else {
                        vm.indentityDocuments = utilities.advanceSettingEnumscompanyCustomer();
                    }
                    if (vm.company && vm.indentityDocuments) {
                        showReqIdentityDocumentsRow();
                    }
                    if (vm.company && vm.mandatoryDesignations) {
                        showReqMandatoryDesignationsRow();
                    }

                }).finally(function () {
                    //vm.loading = false;
                });
            };

            function getVehicleAttachments(vehicleId) {

                vehicleAttachmentService.getVehicleAttachmentsByVehicle({ id: vehicleId })
                    .success(function (result) {
                        vm.vehicleAttachments = result;
                    });
            }
            vm.isDocument = function (i) {
                let isimg = i && i.name && (i.name.toLowerCase().endsWith('.png') ||
                    i.name.toLowerCase().endsWith('.jpeg') ||
                    i.name.toLowerCase().endsWith('.jpg'));
                return !isimg;
            };
            vm.isDocumentSepr = function (i) {
                if (i && i.name) {
                    if (i.name.toLowerCase().endsWith('.png') ||
                        i.name.toLowerCase().endsWith('.jpeg') ||
                        i.name.toLowerCase().endsWith('.jpg')) {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            };
            function init() {
                vm.loading = true;
                vm.getAdvanceSettings();
                getLocations();

                vehicleService.getVehicleForView({
                    id: vehicleId
                }).success(function (result) {

                    vm.vehicle = result;
                    checkOwnership({ value: vm.vehicle.ownership });
                    mapEnums();
                    getMovements(vehicleId);
                    //load document images gallery
                    vm.documentImages = [];

                    //if (vm.vehicle.insuranceCompany !== null)
                    //    vm.insuranceCompanies = [{
                    //        id: vm.vehicle.insuranceCompanyId,
                    //        name: vm.vehicle.insuranceCompany.name
                    //    }];

                    for (var i = 0; i < vm.vehicle.documentImages.length; i++) {
                        var img = vm.vehicle.documentImages[i];

                        var imageDetail = imageGalleryObject();
                        imageDetail.thumb = img.imageURL;
                        imageDetail.img = img.imageURL;
                        imageDetail.description = img.description;
                        imageDetail.url = img.url;
                        imageDetail.name = img.name;
                        imageDetail.guid = img.guid;
                        imageDetail.ImageURL = img.url;
                        imageDetail.ImagePath = img.name;

                        if (vm.isDocumentSepr(imageDetail))
                            vm.documentImagesDocs.imageDocs.push(imageDetail);
                        else {
                            vm.documentImagesDocs.gallaryImages.push(imageDetail);
                            //vm.documentImages.push(imageDetail);
                        }
                        vm.documentImages.push(imageDetail);
                    }
                    if (vm.vehicle.supplierId && vm.vehicle.supplierId > 0) {
                        vm.isExternal = true;
                    }
                    if (vm.isVehicleAttachmentsFeatureEnabled)
                        getVehicleAttachments(vehicleId);
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
