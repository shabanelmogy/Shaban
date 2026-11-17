// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:306954-307838
appModule.controller('tenant.views.crs.vehicles.createOrEditModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.vehicle', 'vehicleId', 'abp.services.app.registrationState', 'abp.services.app.vehicleModel', 'abp.services.app.location', '$q', 'abp.services.app.commonLookup', 'abp.services.app.costCenter', 'appSession', 'utilities', 'abp.services.app.uaeFine', 'abp.services.app.vehicleInvestorsLog', 'abp.services.app.sourceCode',
        function ($scope, $uibModal, $uibModalInstance, vehicleService, vehicleId, stateService, vehicleModelService, locationService, $q, lookupService, costCenterService, appSession, utilities, finesService, vehicleInvestorService, sourceCodeService) {

            var vm = this;
            vm.saving = false;
            vm.states = null;
            vm.models = null;
            vm.allactionsonotherbranch = abp.auth.hasPermission('Pages.Tenant.Vehicles.AllActionsOnOtherBranchVehicles');
            vm.canChangeFleetType = abp.auth.hasPermission('Pages.Tenant.Vehicles.CanChangeFleetType');
            vm.canChangeOwnership = abp.auth.hasPermission('Pages.Tenant.Vehicles.CanChangeOwnership');
            vm.fuelTankCapacity = utilities.parseBoolean(abp.setting.get('App.Speed.Common.FuelTankCapacity'));
            vm.vehicle_EnableCustomField1 = utilities.parseBoolean(abp.setting.get("App.General.Vehicle_EnableCustomField1"));
            vm.vehicle_EnableCustomField2 = utilities.parseBoolean(abp.setting.get("App.General.Vehicle_EnableCustomField2"));
            vm.vehicle_EnableCustomField3 = utilities.parseBoolean(abp.setting.get("App.General.Vehicle_EnableCustomField3"));
            vm.vehicle_EnableCustomAlert1Date = utilities.parseBoolean(abp.setting.get("App.General.Vehicle_CustomAlert1"));
            vm.vehicle_EnableCustomAlert2Date = utilities.parseBoolean(abp.setting.get("App.General.Vehicle_CustomAlert2"));
            vm.isInsuranceDateRequired = utilities.parseBoolean(abp.setting.get("App.Speed.Common.InsuranceDates"));
            vm.isInvestorEnabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.Investor"));
            vm.isMortgageEnabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.Mortgage"));
            vm.purchasePrice = utilities.parseBoolean(abp.setting.get("App.Speed.Common.PurchasePrice"));
            vm.isLeaseToOwnEnabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.LeaseToOwn"));
            vm.showTransportVehiclesOnlyInTransportAgreements = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowTransportVehiclesOnlyInTransportAgreements"));

            vm.separateMakeAndModelInFleet = utilities.parseBoolean(abp.setting.get("App.Speed.Common.SeparateMakeAndModelInFleet"));
            vm.vehicleLocation = utilities.parseBoolean(abp.setting.get('App.General.Vehicle.Location'));
            vm.vehicleYear = utilities.parseBoolean(abp.setting.get('App.General.VehicleYear'));
            vm.vehicleChassisNo = utilities.parseBoolean(abp.setting.get('App.General.Vehicle.ChassisNo'));
            vm.vehicleEngineNo = utilities.parseBoolean(abp.setting.get('App.General.Vehicle.EngineNo'));
            vm.vehicleEngineCapacity = utilities.parseBoolean(abp.setting.get('App.General.Vehicle.EngineCapacity'));
            vm.vehicleKMs = utilities.parseBoolean(abp.setting.get('App.General.Vehicle.KMs'));
            vm.vehicleInteriorColor = utilities.parseBoolean(abp.setting.get('App.General.Vehicle.InteriorColor'));
            vm.vehicleExteriorColor = utilities.parseBoolean(abp.setting.get('App.General.Vehicle.ExteriorColor'));
            vm.vehicleETag = utilities.parseBoolean(abp.setting.get('App.General.Vehicle.ETag'));
            vm.vehicleACRISSCode = utilities.parseBoolean(abp.setting.get('App.General.Vehicle.ACRISSCode'));
            vm.vehicleType = utilities.parseBoolean(abp.setting.get('App.General.Vehicle.VehicleType'));
            vm.vehicleFleetType = utilities.parseBoolean(abp.setting.get('App.General.Vehicle.FleetType'));
            vm.vehicleOwnership = utilities.parseBoolean(abp.setting.get('App.General.Vehicle.Ownership'));
            vm.vehicleReturnDate = utilities.parseBoolean(abp.setting.get('App.General.Vehicle.ReturnDate'));
            vm.vehiclePurchaseDate = utilities.parseBoolean(abp.setting.get('App.General.Vehicle.PurchaseDate'));
            vm.vehicleRegistrationDate = utilities.parseBoolean(abp.setting.get('App.General.Vehicle.RegistrationDate'));
            vm.vehicleNextRegistrationDate = utilities.parseBoolean(abp.setting.get('App.General.Vehicle.NextRegistrationDate'));
            vm.vehicleInsurancePolicyNumber = utilities.parseBoolean(abp.setting.get('App.General.Vehicle.InsurancePolicyNumber'));
            vm.vehicleWarrantyInKms = utilities.parseBoolean(abp.setting.get('App.General.Vehicle.WarrantyInKms'));
            vm.vehicleWarrantyInMonths = utilities.parseBoolean(abp.setting.get('App.General.Vehicle.WarrantyInMonths'));
            vm.vehicleCustomField1 = utilities.parseBoolean(abp.setting.get('App.General.Vehicle.VehicleCustomField1'));
            vm.vehicleCustomField2 = utilities.parseBoolean(abp.setting.get('App.General.Vehicle.VehicleCustomField2'));
            vm.vehicleCustomField3 = utilities.parseBoolean(abp.setting.get('App.General.Vehicle.VehicleCustomField3'));
            vm.vehicleNextVehicleCustomAlert1 = utilities.parseBoolean(abp.setting.get('App.General.Vehicle.NextVehicleCustomAlert1'));
            vm.vehicleNextVehicleCustomAlert2 = utilities.parseBoolean(abp.setting.get('App.General.Vehicle.NextVehicleCustomAlert2'));
            vm.vehicleNotes = utilities.parseBoolean(abp.setting.get('App.General.Vehicle.VehicleNotes'));
            vm.isCostCenterEnabled = abp.features.isEnabled("Core.CostCenters");
            vm.trafficFileId = [];
            vm.requiredExternalVehicleOwner = utilities.parseBoolean(abp.setting.get('App.Speed.Common.RequiredExternalVehicleOwner'));
            vm.additionalExternalVehicleOwner = utilities.parseBoolean(abp.setting.get('App.Speed.Common.AdditionalExternalVehicleOwner'));
            vm.isMondatoryTrafficFileId = utilities.parseBoolean(abp.setting.get('App.Speed.Common.RequiredTrafficFileIdForOwnVehicle'));
            vm.showOnlyFewerDetail = utilities.parseBoolean(abp.setting.get('App.Speed.Common.ShowOnlyFewerDetailForVehicle'));
            vm.allowFusionMapping = abp.auth.hasPermission('Pages.Administration.Tenant.Integration.Fusion.Mappings');
            vm.isFuelDataEnabled = abp.features.isEnabled('FuelDataMangement');
            vm.showCodeNextToPlateNumberSetting = utilities.parseBoolean(abp.setting.get('App.Speed.Common.ShowCodeNextToPlateNumber'));
            vm.isSourceCodesEnabled = abp.features.isEnabled('CRS.Vehicles.SourceCodes');
            vm.sourceCodesPermission = abp.auth.hasPermission('Pages.Tenant.SourceCodes');
            vm.showMortgageInVehicle = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowMortgageInVehicle"));
            vm.showTransportVehiclesOnlyInTransportAgreements = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowTransportVehiclesOnlyInTransportAgreements"));

            vm.fuelLevels = null;
            vm.isEditMod = false;
            vm.selectedModel = null;
            vm.modelSearchText = null;
            vm.HideKms = false;
            vm.locations = [];
            vm.externalIds = [];
            vm.warranties = [];
            vm.editMode = true;
            vm.documentImages = [];
            vm.documentImagesDocs = {
                imageDocs: [],
                gallaryImages: []
            };
            vm.costCenters = [];
            vm.investor = [];
            vm.contactOwner = [];
            vm.filters = {
                name: '',
                makeId: null
            };
            vm.permissions = {
                editNextRegistrationDate: abp.auth.hasPermission('Pages.Tenant.Vehicles.AllowEditNextRegistrationDate'),
                editNextInsuranceDate: abp.auth.hasPermission('Pages.Tenant.Vehicles.AllowEditNextInsuranceDate')
            };
            //vm.inActiveTariffGroupChanged = function () {

            //};
            vm.plateCodes = [
                { id: 'A', name: 'A' },
                { id: 'B', name: 'B' },
                { id: 'C', name: 'C' },
                { id: 'D', name: 'D' },
                { id: 'E', name: 'E' },
                { id: 'F', name: 'F' },
                { id: 'G', name: 'G' },
                { id: 'H', name: 'H' },
                { id: 'I', name: 'I' },
                { id: 'J', name: 'J' },
                { id: 'K', name: 'K' },
                { id: 'L', name: 'L' },
                { id: 'M', name: 'M' },
                { id: 'N', name: 'N' },
                { id: 'O', name: 'O' },
                { id: 'P', name: 'P' },
                { id: 'Q', name: 'Q' },
                { id: 'R', name: 'R' },
                { id: 'S', name: 'S' },
                { id: 'T', name: 'T' },
                { id: 'U', name: 'U' },
                { id: 'V', name: 'V' },
                { id: 'W', name: 'W' },
                { id: 'X', name: 'X' },
                { id: 'Y', name: 'Y' },
                { id: 'Z', name: 'Z' },
                { id: 'AA', name: 'AA' },
                { id: 'BB', name: 'BB' },
                { id: 'CC', name: 'CC' },
                { id: 'DD', name: 'DD' },
                { id: 'EE', name: 'EE' },
                { id: 'FF', name: 'FF' },
                { id: 'ابيض', name: 'ابيض' },
            ];

            vm.vehicleExternalIdTypes = [
                {
                    id: 3,
                    name: 'Eppco Fuel Tag 1'
                },
                {
                    id: 4,
                    name: 'Eppco Fuel Tag 2'
                },

            ];

            vm.removeImage = function (fileToRemove) {
                vm.vehicle.documentImages = vm.vehicle.documentImages.filter(function (file) {
                    return file.name !== fileToRemove.name;
                });
                vm.documentImagesDocs.gallaryImages = vm.documentImagesDocs.gallaryImages.filter(function (file) {
                    return file !== fileToRemove;
                });
            };

            if (vm.allowFusionMapping) {
                let fusionExternalIdTypes = [
                    {
                        id: 100,
                        name: 'Fusion Rev Product Code'
                    }
                ];
                if (vm.vehicleExternalIdTypes) {
                    vm.vehicleExternalIdTypes = vm.vehicleExternalIdTypes.concat(fusionExternalIdTypes);
                } else {
                    vm.vehicleExternalIdTypes = fusionExternalIdTypes;
                }
            }
            vm.vehicleWarrantyTypes = [
                {
                    id: 1,
                    name: 'Overall warranty'
                },
                {
                    id: 2,
                    name: 'Engine warranty'
                },
                {
                    id: 3,
                    name: 'Service warranty'
                }
            ];
            vm.warrantyPeriod = [
                {
                    id: 1,
                    name: 'Month'
                },
                {
                    id: 2,
                    name: 'Date'
                },
            ];
            vm.warrantyPeriodSelection = function (id) {

                if (id != 2)
                    return id;
            };
            vm.getCostCenterGroup = function (id) {
                if (id == 1)
                    return app.localize("CostCenterGroup1");
                else if (id == 2)
                    return app.localize("CostCenterGroup2");

            };

            function externalIdObject() {
                var Obj = new Object();
                Obj.externalId = null;
                Obj.type = null;

                return Obj;
            }

            function warrantyObject() {
                var obj = new Object();
                obj.warrantyType = null;
                obj.kms = null;
                obj.months = null;
                obj.date = null;
                obj.notes = null;
                obj.warrantyPeriod = 1;
                return obj;
            }

            vm.removeRow = function (obj) {
                var index = vm.externalIds.indexOf(obj);
                if (index > -1) {
                    vm.externalIds.splice(index, 1);
                }
            };

            vm.addRow = function () {
                vm.externalIds.push(externalIdObject());
            };

            vm.isVehicleExternalType = (obj) => {
                if (vm.externalIds.filter(x => x.type === obj.type).length < 2) {
                    let vehicleExternalIdType = vm.vehicleExternalIdTypes.filter(x => x.id > 99).find(x => x.id === obj.type);
                    return vehicleExternalIdType ? true : false;
                }
                return false;
            }

            function setRequiredExternalIds() {
                vm.vehicleExternalIdTypesvehicleExternalIdTypes.filter(x => x.id > 99).forEach(x => {
                    let eid = vm.externalIds.find(y => y.type === x.id);
                    if (!eid) {
                        vm.externalIds.push({ type: x.id });
                    }
                });
            }

            vm.removewarrantyRow = function (obj) {
                var index = vm.warranties.indexOf(obj);
                vm.warranties.splice(index, 1);
            };

            vm.addwarrantyRow = function () {
                vm.warranties.push(warrantyObject());
            };

            //vm.searchModel = function ($select) {
            //    vm.filters.name = $select.search;
            //    if (vm.filters.name == '')
            //        vm.filters.name = "~";  //to avoid default suggestions

            //    return vehicleModelService.searchVehicleModelsNew(vm.filters).then(function (response) {
            //        vm.models = response.data.items;
            //    });
            //};

            vm.searchMake = function ($select) {
                vm.filters.name = $select.search;
                if (vm.filters.name === '')
                    vm.filters.name = "~";  //to avoid default suggestions 

                return vehicleModelService.searchVehicleMakes(vm.filters).then(function (response) {
                    vm.makes = response.data.items;
                });
            };

            vm.searchModel = function ($select, makeId) {
                vm.filters.name = $select.search;
                if (vm.filters.name === '')
                    vm.filters.name = "~";  //to avoid default suggestions
                vm.filters.makeId = makeId;

                vehicleModelService.searchVehicleModelsNew(vm.filters).then(function (response) {
                    vm.models = response.data.items;
                });

            };

            vm.searchOwner = function ($select) {

                return lookupService.searchContact({ keyword: $select.search }).then(function (response) {
                    vm.contactOwner = response.data.items;
                });
            };



            /*vm.searchVehicleModels = function () {
                vm.filters.name = vm.modelSearchText;
                var deferred = $q.defer();
                vehicleModelService.searchVehicleModels(vm.filters).then(function (response) {
                    
                    vm.models = response.data.items;
                    deferred.resolve(response.data.items);
                });
                return deferred.promise;
            };
*/
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            //function getStates() {
            //    vm.loading = true;
            //    stateService.getRegistrationStates({}).success(function (data) {
            //        vm.states = data.items;
            //    }).finally(function () {
            //        vm.loading = false;
            //    });
            //}; 
            /*
            
                        function getVehicleModels() {
                            vm.loading = true;
                            vehicleModelService.searchVehicleModels(vm.filters).success(function (data) {
                                vm.models = data.items;
                            }).finally(function () {
                                vm.loading = false;
                            });
                        };
            */

            function getLocations() {
                lookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
            }

            //function fillFuelLevels() {
            //    vm.fuelLevels = [
            //        {
            //            levelPercent: 0.0,
            //            levelDisplayName: '0/8'
            //        },
            //        {
            //            levelPercent: 12.5,
            //            levelDisplayName: '1/8'
            //        },
            //        {
            //            levelPercent: 25.0,
            //            levelDisplayName: '2/8'
            //        },
            //        {
            //            levelPercent: 37.5,
            //            levelDisplayName: '3/8'
            //        },
            //        {
            //            levelPercent: 50.0,
            //            levelDisplayName: '4/8'
            //        },
            //        {
            //            levelPercent: 62.5,
            //            levelDisplayName: '5/8'
            //        },
            //        {
            //            levelPercent: 75.0,
            //            levelDisplayName: '6/8'
            //        },
            //        {
            //            levelPercent: 87.5,
            //            levelDisplayName: '7/8'
            //        },
            //        {
            //            levelPercent: 100.0,
            //            levelDisplayName: '8/8'
            //        }

            //    ];
            //};

            vm.vehicleInsuranceDateAdd = function () {
                if (!vm.vehicle.id) {
                    vm.vehicle.nextInsuranceDate = moment(vm.vehicle.insuranceDate, "DD-MM-YYYY").add(13, 'month');
                }
            }


            vm.vehicleRegistrationDateAdd = function () {

                if (!vm.vehicle.id) {

                    vm.vehicle.nextRegistrationDate = moment(vm.vehicle.registrationDate, "DD-MM-YYYY").add(12, 'month');
                }
            }

            vm.createMake = function () {
                openCreateOrEditMakeModal(null);
            };

            function openCreateOrEditMakeModal(makeId) {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/makes/createOrEditModal.cshtml',
                    controller: 'tenant.views.common.makes.createOrEditModal as vm',
                    backdrop: 'static',
                    resolve: {
                        makeId: function () {
                            return makeId;
                        }
                    }
                });
            }

            function openCreateOrEditVehicleModelModal(vehicleModelId) {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/vehiclemodels/createOrEditModal.cshtml',
                    controller: 'tenant.views.common.vehiclemodels.createOrEditModal as vm',
                    backdrop: 'static',
                    resolve: {
                        vehicleModelId: function () {
                            return vehicleModelId;
                        }
                    }
                });
            }

            vm.createVehicleModel = function () {
                openCreateOrEditVehicleModelModal(null);
            };

            vm.locationPermission = function (row) {

                if (!vm.permissions.allActionsOnOtherBranch && row.locationId != appSession.user.locationId) {
                    vm.disable = false;
                    return false;
                }

                return true;
            };
            vm.getTeriffGroups = function () {
                //vm.loading = true;
                if (vm.vehicle) {
                    if (vm.vehicle.tariffGroup) {
                        lookupService.getTariffGroups({ inActive: vm.vehicle.tariffGroup.inActive }).success(function (data) {
                            vm.tariffGroups = data.items;
                        });
                    }
                } else {
                    lookupService.getTariffGroups({ inActive: false }).success(function (data) {
                        vm.tariffGroups = data.items;
                    });
                }
            };
            vm.getSourceCode = function () {
                if (vm.sourceCodesPermission) {
                    sourceCodeService.getSourceCodes({}).success(function (data) {
                        vm.sourceCodes = data.items;
                    });
                }
            };
            vm.getCostCenters = function () {
                costCenterService.searchCostCenters({ includeInActive: false, group: 1 }).success(function (data) {
                    vm.costCenters = data.items;
                });
            };

            vm.vehicleTypes = [];
            //    { key: 'Rental', value: 1 },
            //    { key: 'Lease', value: 2 },
            //    { key: 'Replacement', value: 3 },
            //    { key: 'Limousine', value: 4 }
            //];
            function populateVehicleTypes() {
                isRentalEnabled = abp.features.isEnabled("CRS.Rental");
                isLeaseEnabled = abp.features.isEnabled("CRS.Lease");
                isLimoEnabled = abp.features.isEnabled("CRS.Limo");
                //---------------------------------------------------------------------
                //---------------------------------------------------------------------
                if (isRentalEnabled) vm.vehicleTypes.push({ key: app.localize('RentalFleetType'), value: 1 });
                if (isLeaseEnabled) vm.vehicleTypes.push({ key: app.localize('LeaseFleetType'), value: 2 });
                if (isRentalEnabled || isLeaseEnabled)
                    vm.vehicleTypes.push({ key: app.localize('ReplacementFleetType'), value: 3 });
                if (isLimoEnabled) vm.vehicleTypes.push({ key: app.localize('LimousineFleetType'), value: 4 });
                vm.vehicleTypes.push({ key: app.localize('StaffFleetType'), value: 6 });
                if (vm.showTransportVehiclesOnlyInTransportAgreements) vm.vehicleTypes.push({ key: app.localize('TransportationFleetType'), value: 7 });
            }

            vm.vehicleOwnerships = [
                { key: 'Owned', value: 1 },
                { key: 'External', value: 2 },
                { key: 'Buy Back', value: 3 }

            ];

            vm.vehicleChassisTypes = [
                { key: " ", value: 0 },
                { key: app.localize('LongWheelBase'), value: 1 },
                { key: app.localize('ShortWheelBase'), value: 2 },
                { key: app.localize('OtherChassisNo'), value: 3 }

            ];

            vm.GetTypeOrOwnership = function () {

                //Vehicle Type
                angular.forEach(vm.vehicleTypes, function (obj) {
                    if (!parseInt(vm.vehicle.vehicleType)) return;
                    if (obj.value == vm.vehicle.vehicleType) {
                        vm.vehicle.vehicleType = obj;
                        return;
                    }
                    if (vm.vehicleTypes.indexOf(obj) == vm.vehicleTypes.length - 1) {
                        vm.vehicle.vehicleType = '';
                    }
                });

                //Ownership
                angular.forEach(vm.vehicleOwnerships, function (obj) {
                    if (!parseInt(vm.vehicle.ownership)) return;
                    if (obj.value == vm.vehicle.ownership) {
                        vm.vehicle.ownership = obj;
                        return;
                    }
                    if (vm.vehicleOwnerships.indexOf(obj) == vm.vehicleOwnerships.length - 1)
                        vm.vehicle.ownership = '';
                });
            };

            vm.openUploadDocument = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/documents/uploadImageModal.cshtml',
                    controller: 'tenant.views.common.documents.uploadImageModal as vm',
                    backdrop: 'static',
                    resolve: {
                        options: function () {
                            return null;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    var img = {
                        guid: result.guid,
                        url: result.url,
                        path: ''
                    };

                    vm.vehicle.documentImages.push(img);

                    var imageDetail = imageGalleryObject();
                    imageDetail.thumb = result.urlWithToken;
                    imageDetail.img = result.urlWithToken;
                    imageDetail.description = '';

                    vm.documentImages.push(imageDetail);
                });
            };

            vm.save = function () {
                vm.saving = true;
                vm.vehicle.modelId = vm.vehicle.model.id;
                vm.vehicle.externalIds = vm.externalIds;
                vm.vehicle.warranties = vm.warranties;

                if (vm.vehicle.sourceCode != null)
                    vm.vehicle.sourceCodeId = vm.vehicle.sourceCode.id;
                if (vm.vehicle.plateCode != null)
                    vm.vehicle.plateCode = vm.vehicle.plateCode.name;

                if (vm.vehicle.tariffGroup != null)
                    vm.vehicle.tariffGroupId = vm.vehicle.tariffGroup.id;

                if (vm.vehicle.vehicleType != null)
                    vm.vehicle.vehicleType = vm.vehicle.vehicleType.value;

                if (vm.vehicle.ownership && vm.vehicle.ownership.value == 1 && vm.vehicle.ownership.value == 7)
                    vm.vehicle.returnDate = null;

                if (vm.vehicle.ownership != null)
                    vm.vehicle.ownership = vm.vehicle.ownership.value;

                if (!vm.allactionsonotherbranch == true)
                    vm.vehicle.locationId = appSession.user.locationId;

                if (vm.separateMakeAndModelInFleet)
                    vm.vehicle.model.make = vm.vehicle.make;

                vm.vehicle.vehicleDocuments = vm.documentImagesDocs.imageDocs;

                vehicleService.createOrUpdateVehicle({
                    vehicle: vm.vehicle,
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };

            function imageGalleryObject() {
                var detail = new Object();
                detail.thumb = "";
                detail.img = "";
                detail.description = "";
                return detail;
            }

            vm.removeDocuments = function () {
                vm.vehicle.documentImages = [];
                vm.documentImagesDocs.imageDocs = [];
                vm.documentImagesDocs.gallaryImages = [];

            }


            vm.openUploadDocumentModel = function () {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/documents/uploadImageModal.cshtml',
                    controller: 'tenant.views.common.documents.uploadDocumentModal as vm',
                    backdrop: 'static',
                    resolve: {
                        options: function () {
                            return {
                                identityDocument: null
                            };
                        }
                    }

                });
                modalInstance.result.then(function (result) {
                    //if (!vm.isDocument(result)) {
                    //    abp.message.warn(app.localize('Documents_Warn_FileType'));
                    //} else {
                    var imageDetail = imageGalleryObject();
                    imageDetail.thumb = result.urlWithToken;
                    imageDetail.img = result.urlWithToken;
                    imageDetail.description = result.name;
                    imageDetail.name = result.name;
                    imageDetail.url = result.url;
                    imageDetail.guid = result.guid;
                    imageDetail.ImageURL = result.url;
                    imageDetail.ImagePath = result.name;

                    var nameParts = result.name.split('_');
                    var baseName = nameParts[0];
                    var extension = result.name.substring(result.name.lastIndexOf('.') + 1);
                    imageDetail.displayName = baseName + ' (' + extension + ')';

                    vm.vehicle.documentImages.push(imageDetail);

                    if (vm.documentImagesDocs.gallaryImages === undefined)
                        vm.documentImagesDocs.gallaryImages = [];

                    if (vm.documentImagesDocs.imageDocs === undefined)
                        vm.documentImagesDocs.imageDocs = [];

                    if (vm.isDocument(imageDetail)) {
                        vm.documentImagesDocs.imageDocs.push(imageDetail);
                    }
                    else {
                        vm.documentImagesDocs.gallaryImages.push(imageDetail);
                    }
                    //}
                });
            };

            vm.removeDocument = function (fileToRemove) {
                vm.vehicle.documentImages = vm.vehicle.documentImages.filter(function (file) {
                    return file.name !== fileToRemove.name;
                });
                vm.documentImagesDocs.imageDocs = vm.documentImagesDocs.imageDocs.filter(function (file) {
                    return file !== fileToRemove;
                });
            };


            vm.isDocument = function (i) {
                let isimg = i && i.name && (i.name.toLowerCase().endsWith('.png') ||
                    i.name.toLowerCase().endsWith('.jpeg') ||
                    i.name.toLowerCase().endsWith('.jpg')) ||
                    i.name.toLowerCase().endsWith('.jfif');
                return !isimg;
            };

            vm.isDocumentSepr = function (i) {
                if (i && i.name) {
                    if (i.name.toLowerCase().endsWith('.png') ||
                        i.name.toLowerCase().endsWith('.jpeg') ||
                        i.name.toLowerCase().endsWith('.jpg') ||
                        i.name.toLowerCase().endsWith('.jfif'))
                    {
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            };

            function getFiltersData() {
                finesService.getFiltersData().success(function (data) {
                    angular.forEach(data.trafficFileId, function (value, key) {
                        vm.trafficFileId.push({ name: value.name, id: value.id, state: value.state });
                    });
                });
            }

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

            vm.getInsuranceCompanies = function ($select) {
                vm.filters.name = $select.search;
                if (vm.filters.name === '')
                    vm.filters.name = "~";  //to avoid default suggestions 

                return vehicleService.getInsuranceCompanies(vm.filters).then(function (response) {
                    vm.insuranceCompanies = response.data.items;
                });
            };
            vm.getPlateNo = function () {
                vm.vehicle.plateNo = '';
                var code = '';
                var source_Code = '';
                if (vm.vehicle.plateCode) {
                    code = vm.vehicle.plateCode.name;
                } else {
                    code = '';
                }
                if (vm.vehicle.sourceCode) {
                    if (vm.vehicle.sourceCode.code) {
                        source_Code = vm.vehicle.sourceCode.code;
                    } else {
                        source_Code = '';
                    }
                } else {
                    source_Code = '';
                }
                if (!vm.vehicle.plateNoNumeric) {
                    vm.vehicle.plateNoNumeric = '';
                }

                if (source_Code) {
                    vm.vehicle.plateNo = vm.vehicle.plateNoNumeric + '-' + source_Code + '-' + code;
                } else {
                    vm.vehicle.plateNo = vm.vehicle.plateNoNumeric + '-' + code;
                }
            }
            function init() {
                vm.loading = true;
                vm.getAdvanceSettings();
                getLocations();
                vm.getTeriffGroups();
                vm.getSourceCode();
                getFiltersData();
                if (vm.isMortgageEnabled) {
                    vm.vehicleOwnerships.push({ key: 'Mortgage', value: 8 })
                }
                if (vm.isLeaseToOwnEnabled) {
                    vm.vehicleOwnerships.push({ key: 'LeaseToOwn', value: 9 })
                }
                vehicleService.getVehicleForEdit({
                    id: vehicleId

                }).success(function (result) {
                    vm.loading = false;
                    if (vehicleId > 0) {
                        vm.HideKms = true;
                        vm.editMode = false;

                        //checkOwnership({ value: result.ownership });
                    }

                    vm.vehicle = result;

                    populateVehicleTypes(); // make vehilce type array on module enabled basis.

                    if (vm.vehicle.id > 0) {
                        vm.GetTypeOrOwnership();
                        vm.isEditMod = true;
                        vm.externalIds = result.externalIds;
                        vm.warranties = result.warranties;
                        //load document images gallery

                        //vm.documentImagesDocs = [];
                        if (vm.vehicle.plateCode) {
                            vm.vehicle.plateCode = vm.plateCodes.find(function (code) {
                                return code.id === vm.vehicle.plateCode;
                            });
                        }

                        if (vm.separateMakeAndModelInFleet) {
                            vm.vehicle.make = vm.vehicle.model.make;
                        }
                        vm.documentImages = [];
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

                            var nameParts = imageDetail.name.split('_');
                            var baseName = nameParts[0];
                            var extension = imageDetail.name.substring(imageDetail.name.lastIndexOf('.') + 1);
                            imageDetail.displayName = baseName + ' (' + extension + ')';

                            if (vm.isDocumentSepr(imageDetail))
                                vm.documentImagesDocs.imageDocs.push(imageDetail);
                            else {
                                vm.documentImagesDocs.gallaryImages.push(imageDetail);
                                //vm.documentImages.push(imageDetail);
                            }
                            vm.documentImages.push(imageDetail);
                        }
                        //if (vm.vehicle.supplierId > 0) {
                        // lookupService.searchContact({ contactId: vm.vehicle.supplierId}).then(function (response) {
                        // vm.contactOwner = response.data.items;
                        //   vm.supplier = vm.contactOwner[0];
                        //});
                        // }
                        vm.insuranceCompanies = [{
                            id: vm.vehicle.insuranceCompanyId,
                            name: vm.vehicle.insuranceCompany.name
                        }];
                    } else {
                        vm.vehicle.vehicleType = vm.vehicleTypes[0]; //Select first 
                        vm.isEditMod = false;
                        vm.vehicle.ownership = vm.vehicleOwnerships[0];
                        //vm.vehicle.chassisType = vm.vehicleChassisTypes[0];
                        setRequiredExternalIds();
                    }
                });
            }

            init();
        }
    ]);
