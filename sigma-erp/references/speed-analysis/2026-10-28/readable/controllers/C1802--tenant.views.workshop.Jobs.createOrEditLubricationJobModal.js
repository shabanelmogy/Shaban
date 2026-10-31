// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:491783-492208
appModule.controller('tenant.views.workshop.Jobs.createOrEditLubricationJobModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.item', 'abp.services.app.vehicle', 'abp.services.app.directory',
        'abp.services.app.designation', 'options', 'abp.services.app.job', 'abp.services.app.vehicleService', 'abp.services.app.jobEstimation',
        'abp.services.app.labourActivity', 'abp.services.app.labourTariff', 'abp.services.app.workOrder', 'utilities',
        function ($scope, $uibModal, $uibModalInstance, itemTypeAppService, vehicleService,
            directoryService, designationAppService, options, jobAppService, vehicleServiceAppService,
            jobEstimationAppService, labourActivityService, labourTariffService, workOrderService, utilities) {

            var vm = this;

            var kmsLimit = 1000;
            vm.isValidForm = false;
            var timesLimit = 14; // in days
            vm.newVehicles = [];
            vm.showServiceAlert = false;
            vm.isCustomerWiseDiscountEnabled = abp.features.isEnabled("CRS.CustomFeatures.CustomerWiseDiscount");
            vm.customerDiscountPercent = null;
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.makeItemPriceEditable = utilities.parseBoolean(abp.setting.get("App.Speed.Common.MakeItemPriceEditable"));
           // vm.jobTypes = angular.fromJson(abp.setting.get("App.Speed.Common.ShowSelectedJobTypes"));
            if (!vm.jobTypes || vm.jobTypes.length <= 0)
                vm.jobTypes = utilities.getJobTypes();
            vm.isEdit = false;
            vm.isFromWorkOrder = false;
            var additionalInfoObj = {};

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.searchItems = function ($select) {
                var name = $select.search;
                if (name === '')
                    name = "~";  //to avoid default suggestions 
                var validateVehicleArr = vm.newVehicles.some(x => !x.plateNo || x.plateNo == 0);
                if (!vm.newVehicles || validateVehicleArr)
                    return;
                return itemTypeAppService.searchItems({ name: name/*, modelId: vm.job.vehicle.modelId */ }).then(function (response) {
                    vm.items = response.data.items.filter(x => x.itemType.category == 2);
                });
            };

            vm.openServiceItemsSelector = function (jobDetail) {
                openPopup(jobDetail);

            };
            vm.customerSelected = function () {

                //vm.job.taxPercent = vm.taxPercent;
                //if ((vm.job.customer && vm.job.customer.isTaxExempted) || vm.isTaxInclusive)
                //    vm.job.taxPercent = 0;
                //vm.job.isTaxExempted = vm.job.customer.isTaxExempted;
                //vm.job.jobDetail.forEach(jd => {
                //    jd.charges.forEach(jc => {
                //        vm.calculateDiscountOnRow(jc);
                //        if (jc.type === 1)
                //            vm.calculateItemPrice(jc);
                //        else if (jc.type === 2)
                //            vm.calculateLabourCharges(jc, jd);
                //        vm.calculateJobDetailTotals(jd, jc.type);
                //        vm.calculateJobTotals();
                //    });
                //});



            };
            vm.searchVehicles = function ($select) {
                if ($select.search === "") { vm.vehicles = null; return null; }
                return vehicleService.searchVehiclesForWorkshop({ plateNo: $select.search }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };

            vm.searchVehiclePopup = function (index) {
                openSearchVehicleModal(index);
            };

            vm.searchCustomers = function ($select) {
                if (!$select.search) return;
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };
            vm.round = function (number) {
                return utilities.round(number, 2);
            }


            vm.searchCustomerPopoup = function () {
                openSearchContactModel(null, 2);
            };


            vm.save = function () {
                vm.saving = true;
                vm.job = { jobDate: vm.jobDate, customerId: vm.customer.id, lubrications: vm.newVehicles }
                jobAppService.createOrUpdateLubricationJob(vm.job)
                    .success(function (result) {
                        vm.saving = false;
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    })
                    .finally(function () {
                        vm.saving = false;
                    });
            };

            init();

            function init() {
                if (options.workOrderId) {
                    vm.loading = true;
                    workOrderService.getWorkOrderForEdit({ id: options.workOrderId }).success(
                        function (result) {
                            vm.isFromWorkOrder = true;
                            vm.job.id = null;
                            vm.job.jobDateTime = moment();// result.date;
                            vm.job.isEstimation = false;
                            vm.job.vehicleId = result.voucherLines[0].vehicleId;
                            vm.job.vehicle = result.voucherLines[0].vehicle;
                            vm.job.kMs = vm.job.vehicle.kMs;
                            vm.job.customerId = result.contactId;
                            vm.job.customer = result.contact;
                            vm.job.customerId = result.contact.id;
                            vm.job.workOrderRefNo = result.voucherNo;
                            vm.job.locationId = result.locationId;
                            additionalInfoObj = JSON.parse(result.additionalInfo);
                            //createEmptyJobChargeRow();
                            vm.getServicesByModel();
                        }
                    ).finally(function () {
                        vm.loading = false;
                    });
                }
                //create job from estimation
                else if (options.jobEstimationId) {

                    vm.loading = true;
                    jobEstimationAppService.getJobEstimationForEdit({ id: options.jobEstimationId })
                        .success(function (result) {
                            vm.job = result;

                            vm.job.estimationId = vm.job.id;
                            vm.job.id = null;
                            vm.job.isEstimation = false;

                            angular.forEach(vm.job.jobDetail, function (jobDetail) {
                                angular.forEach(jobDetail.charges, function (jobCharge) {
                                    jobCharge.cost = jobCharge.charges + jobCharge.discount;

                                });
                            });

                            vm.getLabourTariffForJob();

                        })
                        .finally(function () {
                            vm.loading = false;
                        });
                }
                else if (options.jobId || options.isCreate) {

                    vm.loading = true;
                    jobAppService.getJobForEdit({ id: options.jobId })
                        .success(function (result) {
                            vm.job = result;

                            if (vm.job.id < 1) {
                                vm.job.taxPercent = vm.taxPercent;
                                vm.job.jobDetail[0].charges.push(getJobChargeObject(1)); // 1 : item
                                vm.job.jobDetail[0].charges.push(getJobChargeObject(2)); // 2 : labour
                                vm.job.jobDetail[0].charges.push(getJobChargeObject(3)); // 3 : mics

                                vm.job.jobDetail[0].itemsCharges = 0;
                                vm.job.jobDetail[0].labourCharges = 0;
                                vm.job.jobDetail[0].miscCharges = 0;
                                vm.job.jobDetail[0].totalCharges = 0;
                            } else {
                                vm.isEdit = true;

                                angular.forEach(vm.job.jobDetail, function (jobDetail) {
                                    //var tempDetail = jobDetail;
                                    //if (jobDetail.jobType === 1) {
                                    //    vm.getServiceItems(tempDetail);
                                    //    angular.forEach(jobDetail.charges, function (jc) {
                                    //        angular.forEach(tempDetail.charges, function (tjc) {
                                    //            if (jc === tjc)
                                    //                jc.serviceTariffLoaded = true;
                                    //        });
                                    //    });
                                    //   // jobDetail.charges = tempCharges;
                                    //}
                                    if (jobDetail.service != null) {
                                        vm.services = [jobDetail.service];
                                    }

                                    jobDetail.showAddBtnInEditMode = jobDetail.charges.filter(e => e.type == 1).length == 0;
                                    angular.forEach(jobDetail.charges, function (jobCharge) {
                                        //if (jobCharge.type === 1) //itemCharge
                                        //{
                                        //    if (jobCharge.item.productUnitOfMeasures && jobCharge.item.productUnitOfMeasures.length > 0) {
                                        //        jobCharge.item.unitOfMeasureId = jobCharge.item.productUnitOfMeasures[0].unitOfMeasureId;
                                        //        jobCharge.item.unitOfMeasure = jobCharge.item.productUnitOfMeasures[0].unitOfMeasure;
                                        //    }
                                        //}
                                        //else
                                        jobCharge.cost = jobCharge.charges + jobCharge.discount;
                                        jobCharge.serviceTariffLoaded = false;

                                        jobCharge.discount = utilities.round(jobCharge.discount, 2);
                                    });
                                });
                                vm.getLabourTariffForJob();
                            }
                        })
                        .finally(function () {
                            vm.loading = false;
                        });
                }

            }
            function openSearchVehicleModal(index) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/searchVehicleModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.searchVehicleModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                allSelectable: true,
                                isWorkShop: true
                            };
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    if (result !== null) {
                        vm.newVehicles[index] = result;
                    }
                });
            }


            vm.addVehicle = function () {
                vm.newVehicles.push(getVehicleObject());
            };

            vm.newItems = [];
            vm.addNewItem = function () {
                vm.newItems.push(getJobChargeObject(1));
            };


            vm.addJobCharge = function (charges, type) {
                charges.push(getJobChargeObject(type));
            };

            vm.removeElementFromList = function (list, index) {
                if (list.length > index) {
                    list = list.splice(index, 1);
                }
            };

            function getVehicleObject() {
                return {
                    make: '',
                    model: '',
                    kMs: '',
                    plateNo: '',
                    vehicleId: 0,
                    quantity: 1,
                    itemId : 0

                };
            }
            vm.selectedVehicle = function (vehicle, index) {
                vm.newVehicles[index].vehicleId = vehicle.id;
                vm.newVehicles[index].plateNo = vehicle.plateNo;
                vm.newVehicles[index].model = vehicle.model;
                vm.newVehicles[index].make = vehicle.make;
                vm.newVehicles[index].kMs = vehicle.kMs;
            }
            function getJobChargeObject(type) {
                return {
                    type: type,
                    item: {},
                    unitprice: 0,
                    quantity: 1,
                    discount: 0,
                    charges: 0,
                    hours: 0,
                    detail: ""
                };
            }

            vm.addExternalWorkshopVehiclePopup = function () {
                openAddExternalWorkshopVehicleModal();
                //if (abp.features.isEnabled("WORKSHOP") && !abp.features.isEnabled("CRS.Rental"))
                //    openVehicleModal();
                //else
                //openAddExternalWorkshopVehicleModal();
            };


            function openAddExternalWorkshopVehicleModal() {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/addExternalWorkshopVehicle.cshtml',
                    controller: 'tenant.views.crs.vehicles.addExternalWorkshopVehicle as vm',
                    backdrop: 'static',
                    size: 'sm'
                });
                modalInstance.result.then(function (vehicle) {
                    vm.job.vehicle = vehicle;
                    vm.getServicesByModel();
                    vm.getLabourTariffForJob();

                });
            }
            function openSearchContactModel(category, type) {
                var modalInstance = $uibModal.open({
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

                modalInstance.result.then(function (result) {
                    if (result !== null) {
                        vm.customer = result;
                        //vm.customerSelected();
                    }
                });
            }

            vm.openItemRequisition = function (jobDetail) {
                var jobTemp = angular.copy(jobDetail);
                jobTemp.jobNo = vm.job.jobNo;
                jobTemp.modelId = vm.job.vehicle.model.id;
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/stock/requisitions/createOrEditModal.cshtml',
                    controller: 'tenant.views.stock.requisitions.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        requisitionId: function () {
                            return null;
                        },
                        options: function () {
                            return jobTemp;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    init();
                });
            }

            vm.openItemReturn = function (jobDetail) {
                var jobTemp = angular.copy(jobDetail);
                jobTemp.jobNo = vm.job.jobNo;
                jobTemp.modelId = vm.job.vehicle.model.id;
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/stock/itemReturns/createOrEditModal.cshtml',
                    controller: 'tenant.views.stock.itemReturns.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        returnId: function () {
                            return null;
                        },
                        options: function () {
                            return jobTemp;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    init();
                });
            }

            vm.openItemIssue = function (jobDetail) {
                var jobTemp = angular.copy(jobDetail);
                jobTemp.jobNo = vm.job.jobNo;
                jobTemp.modelId = vm.job.vehicle.model.id;
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/stock/itemIssues/createOrEditModal.cshtml',
                    controller: 'tenant.views.stock.itemIssues.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return { jobDetail: jobTemp };
                        }

                    }
                });

                modalInstance.result.then(function (result) {
                    init();
                });
            }

            vm.validateForm = function () {
                var validateVehicleArr = !vm.newVehicles || vm.newVehicles.length == 0 || vm.newVehicles.some(x => !x.plateNo || x.plateNo == 0 || x.itemId == 0 || !x.quantity > 0 || !x.lubricationDate);
                
                if (validateVehicleArr)
                    vm.isValidForm = false;
                else
                    vm.isValidForm = true;
            }
        }
    ]);
