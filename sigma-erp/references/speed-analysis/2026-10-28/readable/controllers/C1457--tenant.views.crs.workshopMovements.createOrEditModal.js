// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:398474-398953
appModule.controller('tenant.views.crs.workshopMovements.createOrEditModal', [
        '$uibModal', '$uibModalInstance', 'utilities', 'abp.services.app.vehicle', 'abp.services.app.directory', 'options', 'abp.services.app.vehicleAlerts', 'abp.services.app.workshopMovement', 'abp.services.app.commonLookup', 'abp.services.app.vehicleService', '$filter', 'abp.services.app.purchaseOrder', 'abp.services.app.vehicleAlerts',
        function ($uibModal, $uibModalInstance, utilities, vehicleService, directoryService, options, vehicleAlertsService, workshopMovementService, commonLookupService, vehicleServiceService, $filter, purchaseOrdersService, vehicleAlertAppService) {

            var vm = this;
            vm.loading = false;
            vm.poMandatoryForWorkshopMovement = utilities.parseBoolean(abp.setting.get("App.General.PoMandatoryForWorkshopMovement"));
            vm.notesMandatoryForWorkshopMovement = utilities.parseBoolean(abp.setting.get("App.General.NotesMandatoryForWorkshopMovement"));
            vm.locationDetailsInMovements = utilities.parseBoolean(abp.setting.get("App.Speed.Common.LocationDetailsInMovements"));
            vm.canChangeKMOut = abp.auth.hasPermission('Pages.Tenant.WorkshopMovements.CanChangeKMOut');
            vm.canChangeFuelOut = abp.auth.hasPermission('Pages.Tenant.WorkshopMovements.CanChangeFuelOut');
            vm.vehicleRegistrationExpiryPopupOnAgreementSaving = utilities.parseBoolean(abp.setting.get("App.General.VehicleRegistrationExpiryPopupOnAgreementSaving"));
            vm.documents = [];
            vm.allowWorkshopPO = utilities.parseBoolean(abp.setting.get("App.General.AllowWorkshopPO"));
            vm.isWorkshopPO = false;
            vm.documentsForJournal = abp.features.isEnabled("CRS.CustomFeatures.DocumentsForWorkshopMovements");
            vm.allowMomentsForSaleVehicle = utilities.parseBoolean(abp.setting.get("App.Speed.Common.AllowMomentsForSaleVehicle"));
            vm.isMovementSubtypeMaintenance = false;
            vm.vehicles = [];
            vm.customers = [];
            vm.drivers = [];
            vm.suppliers = [];
            //vm.documentImages = [];
            function allFuelLevels() {
                vm.allFuelLevels = utilities.allFuelLevels();
            };
            vm.workshopMovementTypes = [
                { id: 1, name: 'Maintenance' }, { id: 2, name: 'Repair' }, { id: 3, name: 'Accident Repair' }, { id: 10, name: 'Inspection' }, { id: 14, name: 'Breakdown' }
            ];

            vm.movementSubTypeChanged = function () {
                if (vm.workshopMovement.movementSubType == 1) {  //maintenance
                    vm.isMovementSubtypeMaintenance = true;
                    getDueServices(true);
                } else {
                    vm.workshopMovement.serviceLog.serviceId = null;
                }
            };
            //vm.openUploadDocument = function () {
            //    var modalInstance = $uibModal.open({
            //        templateUrl: '~/App/tenant/views/common/documents/uploadImageModal.cshtml',
            //        controller: 'tenant.views.common.documents.uploadImageModal as vm',
            //        backdrop: 'static',
            //        resolve: {
            //            options: function () {
            //                return null;
            //            }
            //        }
            //    });

            //    modalInstance.result.then(function (result) {
            //        var img = {
            //            guid: result.guid,
            //            url: result.url,
            //            path: '',
            //            documentType: 5
            //        };
            //        vm.workshopMovement.documents.push(img);
            //        var imageDetail = imageGalleryObject();
            //        imageDetail.thumb = result.urlWithToken;
            //        imageDetail.img = result.urlWithToken;
            //        imageDetail.description = '';
            //        vm.documentImages.push(imageDetail);
            //    });
            //};

            vm.uploadDocument = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/workshopMovements/uploadDocumentsModal.cshtml',
                    controller: 'tenant.views.crs.workshopMovements.uploadDocumentsModal as vm',
                    backdrop: 'static'

                });
                modalInstance.result.then(function (result) {
                    vm.documents.push(result);
                });
            };
            vm.removeDocument = function (obj) {
                var index = vm.documents.indexOf(obj);
                vm.documents.splice(index, 1);
            };
            vm.getOriginalName = function (doc) {
                var originalName = doc.name.replace("_" + doc.guid, "");
                return originalName;
            };
            function imageGalleryObject() {
                var detail = new Object();
                detail.thumb = "";
                detail.img = "";
                detail.description = "";
                return detail;
            }
            function getDueServices(getServiceAlert) {
                if (getServiceAlert == null) getServiceAlert = false;

                vm.loading = true;
                vehicleServiceService.getVehicleServicesByModelOrDefault({ id: vm.workshopMovement.vehicle.modelId }).success(function (servicesData) {
                    //vm.dueServices = servicesData.items;
                    if (getServiceAlert) {
                        vehicleAlertAppService.getServiceAlerts({ vehicleId: vm.workshopMovement.vehicle.id }).success(function (result) {
                            vm.serviceAlerts = result.items;
                            if (vm.serviceAlerts.length > 0 && servicesData.items.length > 0) {
                                vm.workshopMovement.serviceLog.serviceId = vm.serviceAlerts[0].dueService.id;
                                vm.workshopMovement.serviceLog.dueDate = vm.serviceAlerts[0].dueDate;
                                vm.workshopMovement.serviceLog.dueKms = vm.serviceAlerts[0].dueKms;
                                vm.workshopMovement.serviceLog.dueReason = vm.serviceAlerts[0].dueReason;

                                vm.dueService = vm.serviceAlerts[0].dueService;

                                fillDueServices(servicesData.items);
                            }
                        }).finally(function () {
                            vm.loading = false;
                        });
                    } else {

                        fillDueServices(servicesData.items);
                    }

                }).finally(function () {
                    if (!getServiceAlert)
                        vm.loading = false;
                });
            }

            function fillDueServices(servicesList) {

                if (vm.dueService != null) {
                    vm.dueServices = [];
                    angular.forEach(servicesList, function (service) {


                        if (service.dueOnKMs >= vm.dueService.dueOnKMs && service.dueOnMonths >= vm.dueService.dueOnMonths)
                            vm.dueServices.push(service);
                    });
                } else {
                    vm.dueServices = servicesList;
                }
            }

            function getServiceAlerts() {
                vehicleAlertAppService.getServiceAlerts({ vehicleId: vm.workshopMovement.vehicle.id }).success(function (data) {
                    vm.serviceAlerts = data;
                });
            }

            vm.addPurchaseOrder = function () {
                var services = null;
                if (vm.workshopMovement.serviceLog) {
                    services = $filter('filter')(vm.dueServices, {
                        id: vm.workshopMovement.serviceLog.serviceId,
                    }, true);
                }

                var serviceItems = services != null && services.length > 0 ? services[0].serviceItems : [];
                if (vm.allowWorkshopPO) {
                    vm.isWorkshopPO = true;
                }
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/purchaseOrders/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.purchaseOrders.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        options: function () {
                            return {
                                purchaseOrderId: null,
                                serviceItems: serviceItems,
                                vehicle: vm.workshopMovement.vehicle,
                                contact: vm.workshopMovement.contact,
                                isWorkshopPO: vm.isWorkshopPO,
                                isMovementSubtypeMaintenance: vm.isMovementSubtypeMaintenance
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.workshopMovement.refNo = result;
                    vm.purchaseOrder = [];
                    vm.purchaseOrder.push(result);
                    //vm.getPurchaseOrders();
                });
            };

            vm.localize = function (input) {
                return app.localize(input);
            };

            vm.searchVehicles = function ($select) {
                if ($select.search == "") { vm.vehicles = null; return null; }
                if (vm.allowMomentsForSaleVehicle) {
                    return vehicleService.searchVehicles({ plateNo: $select.search, statusId: 'IDL', subStatuses: [1, 6, 8, 7], source: 'openworkshopmovement', isGetSaleVehicle: true}).then(function (response) {
                        vm.vehicles = response.data.items;
                    });
                }
                else {
                    return vehicleService.searchVehicles({ plateNo: $select.search, statusId: 'IDL', subStatuses: [1, 6, 8, 7], source: 'openworkshopmovement' }).then(function (response) {
                        vm.vehicles = response.data.items;
                    });
                }
            };

            vm.searchDriver = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 1 }).then(function (response) {
                    vm.drivers = response.data.items;
                });
            };

            vm.updatePurchaseOrder = function () {
                return vm.workshopMovement.refNo = null;
            };


            vm.searchDriverPopoup = function () {
                var modalInstance = openSearchContactModel(null, 1);

                modalInstance.result.then(function (driver) {
                    if (driver != null) {
                        vm.workshopMovement.outDetail_Driver = driver;
                    }
                });
            };

            vm.searchSupplierPopoup = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return null;
                        },
                        type: function () {
                            return 3;
                        }
                    }
                }).result.then(function (supplier) {
                    if (supplier != null) {
                        vm.workshopMovement.contact = supplier;
                    }
                });
            };

            vm.vehicleSelected = function () {
                vm.workshopMovement.outDetail.fuelLevel = vm.workshopMovement.vehicle.fuelLevel;
                vm.workshopMovement.outDetail.km = vm.workshopMovement.vehicle.kMs;
                vm.workshopMovement.inDetail_LocationId = vm.workshopMovement.vehicle.locationId;

                if (vm.workshopMovement.movementSubType == 1) { //maintenance
                    getDueServices(true);
                }
            };

            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
            }

            vm.searchVehiclePopup = function () {
                openSearchVehicleModal();
            };

            vm.searchSupplier = function ($select) {
                return directoryService.search({ keyword: $select.search, contactType: 3 }).then(function (response) {
                    vm.suppliers = response.data.items;
                });
            };

            vm.searchPurchaseOrder = function ($select) {
                if (vm.workshopMovement == null) return null;
                if (vm.workshopMovement.contact == null) return null;
                if (vm.workshopMovement.contact.id == null) return null;

                var supplierId = vm.workshopMovement.contact.id;

                return commonLookupService.searchVouchers({ voucherNo: $select.search, type: 12, contactId: supplierId }).then(function (response) {
                    vm.purchaseOrder = response.data.items;
                });
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
                                //vm.workshopMovement.inDetail.dateTime ? vm.workshopMovement.inDetail.dateTime :
                                fromDateTime: moment(vm.workshopMovement.outDetail.dateTime ? vm.workshopMovement.outDetail.dateTime : moment().startOf('day')).utc(),
                                toDateTime: moment(moment().endOf('day')).utc(),
                                tariffGroup: null,
                                statusId: 'IDL',
                                //subStatus: 1,
                                subStatuses: [1, 6, 7, 8],
                                source: 'openworkshopmovement',
                                selectable: true
                            };
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    if (result != null) {
                        vm.workshopMovement.vehicle = result;
                        vm.vehicleSelected();
                    }
                });
            }

            function openSearchContactModel(category, type) {
                return $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return category;
                        },
                        type: function () {
                            return type;
                        }
                    }
                });
            }

            vm.save = function () {
                vm.saving = true;

                //update ids for selected records
                vm.workshopMovement.vehicleId = vm.workshopMovement.vehicle.id;
                vm.workshopMovement.contactId = vm.workshopMovement.contact.id;
                vm.workshopMovement.outDetail_DriverId = vm.workshopMovement.outDetail_Driver.id;
                vm.workshopMovement.documents = vm.documents;
                if (vm.workshopMovement.refNo)
                    vm.workshopMovement.refNo = vm.workshopMovement.refNo.voucherNo;

                if (vm.locations.length == 1)
                    vm.workshopMovement.inDetail_LocationId = vm.locations[0].id;

                if (vm.vehicleRegistrationExpiryPopupOnAgreementSaving) {
                    if (vm.workshopMovement.vehicle.nextRegistrationDate) {
                        vm.currentDate = new Date();
                        vm.formattedNextRegistrationDate = new Date(vm.workshopMovement.vehicle.nextRegistrationDate)
                        var timeDifference = vm.formattedNextRegistrationDate.getTime() - vm.currentDate.getTime();
                        var daysRemaining = Math.ceil(timeDifference / (1000 * 3600 * 24));

                        if (daysRemaining < 0) {
                            abp.message.confirm(
                                'Registration is Expired.',
                                'Do you want to continue?',
                                function (isConfirmed) {
                                    if (isConfirmed) {
                                        getDueServiceNew();
                                    }
                                }
                            );
                        }
                        else {
                            getDueServiceNew();
                        }
                        vm.saving = false;
                    }
                    else {
                        getDueServiceNew();
                    }
                }
                else {
                    vm.workshopMovement.documents = vm.documents;
                    workshopMovementService.createOrUpdateWorkshopMovement({
                        workshopMovement: vm.workshopMovement,
                    }).success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    }).finally(function () {
                        vm.saving = false;
                    });
                }


            };

            function createOrUpdateWorkshopMovement() {
                vm.workshopMovement.documents = vm.documents;
                workshopMovementService.createOrUpdateWorkshopMovement({
                  
                    workshopMovement: vm.workshopMovement,
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            }

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            async function getDueServiceNew() {
                const vehicleService = await vehicleAlertsService.getServiceAlertForVehicle(vm.workshopMovement.vehicle);
                vm.vehicleAlertsRegistration = vehicleService.data.items;
                if (vm.vehicleAlertsRegistration.length > 0) {
                    var message = vm.vehicleAlertsRegistration[0].dueService.name + ', Due Kms:' + ' ' + vm.vehicleAlertsRegistration[0].dueKms + ', Reason:' + ' ' + vm.vehicleAlertsRegistration[0].dueReason;
                    abp.message.confirm(
                        message,
                        'Do you want to continue?',
                        function (isConfirmed) {
                            if (isConfirmed) {
                                vm.saving = true;
                                createOrUpdateWorkshopMovement();
                            }

                        }
                    );
                }
                else {
                    vm.saving = true;
                    createOrUpdateWorkshopMovement();
                }

            }

            function init() {
                vm.loading = true;
                allFuelLevels();
                getLocations();
                workshopMovementService.getWorkshopMovementForEdit({ id: options.workshopMovementId }
                ).success(function (result) {

                    vm.workshopMovement = result;
              /*      vm.workshopMovement.documents = vm.workshopMovement.documents ? vm.workshopMovement.documents : [];*/
                    if (options.workshopMovementId) {
                        vm.documents = vm.workshopMovement.documents;
                        //vm.workshopMovement.documents.forEach(function (value) {
                        //    var imageDetail = imageGalleryObject();

                        //    imageDetail.thumb = value.url;
                        //    imageDetail.img = value.url;
                        //    imageDetail.description = '';
                        //    vm.documentImages.push(imageDetail);
                        //});
                    }
                    if (options.fromAlerts) {
                        vm.workshopMovement.movementSubType = 1;

                        vm.workshopMovement.vehicle = options.vehicle;
                        vm.workshopMovement.outDetail.fuelLevel = vm.workshopMovement.vehicle.fuelLevel;
                        vm.workshopMovement.outDetail.km = vm.workshopMovement.vehicle.kMs;
                        vm.workshopMovement.inDetail_LocationId = vm.workshopMovement.vehicle.locationId;

                        vm.workshopMovement.serviceLog.serviceId = options.serviceId;
                        vm.workshopMovement.serviceLog.dueDate = options.dueDate;
                        vm.workshopMovement.serviceLog.dueKms = options.dueKms;
                        vm.workshopMovement.serviceLog.dueReason = options.dueReason;

                        vm.dueService = options.dueService;

                        getDueServices(false);
                    }
                    if (options.workshopMovementId)
                        getDueServices(false);

                    //To show proper saved value in refNo, we have to convert it in object having value in voucherNo
                    if (vm.workshopMovement.refNo)
                        vm.workshopMovement.refNo = { voucherNo: vm.workshopMovement.refNo };
                    if (vm.workshopMovement.movementSubType == 1) {
                        vm.isMovementSubtypeMaintenance = true;
                    }
                }).finally(function () {
                    vm.loading = false;
                });
            }

            init();
        }
    ]);
