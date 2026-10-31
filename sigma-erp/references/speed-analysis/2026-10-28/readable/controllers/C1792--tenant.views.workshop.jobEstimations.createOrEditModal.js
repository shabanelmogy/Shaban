// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:488316-489168
appModule.controller('tenant.views.workshop.jobEstimations.createOrEditModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'jobEstimationId', 'abp.services.app.item', 'abp.services.app.vehicle', 'abp.services.app.directory',
        'abp.services.app.designation', 'abp.services.app.jobEstimation', 'abp.services.app.job', 'abp.services.app.vehicleService', 'abp.services.app.labourActivity', 'abp.services.app.labourTariff', 'utilities', 'appSession', 'abp.services.app.chargesSetting', 'abp.services.app.commonLookup',
        function ($scope, $uibModal, $uibModalInstance, jobEstimationId, itemTypeAppService, vehicleService, directoryService,
            designationAppService, jobEstimationAppService, jobAppService, vehicleServiceAppService, labourActivityService, labourTariffService, utilities, appSession, chargesSettingService, commonLookupService) {

            var vm = this;
            vm.disableBtn = false;
            vm.isCustomerWiseDiscountEnabled = abp.features.isEnabled("CRS.CustomFeatures.CustomerWiseDiscount");
            vm.isWorkshopAndRentalEnabled = abp.features.isEnabled("WORKSHOP") && !abp.features.isEnabled("CRS.Rental");
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.branchTaxPercentage = null;
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.makeItemPriceEditable = utilities.parseBoolean(abp.setting.get("App.Speed.Common.MakeItemPriceEditable"));
            vm.insteadOfItemsSelectionAllowToEnterAnyItemName = utilities.parseBoolean(abp.setting.get("App.Speed.Common.InsteadOfItemsSelectionAllowToEnterAnyItemName"));
            var jobType = abp.setting.get("App.Speed.Common.ShowSelectedJobTypes")
            vm.jobTypes = jobType ? angular.fromJson(jobType) : new Array();
            if (!vm.jobTypes || vm.jobTypes.length <= 0)
                vm.jobTypes = utilities.getJobTypes();
            var selectedChargesTypes = abp.setting.get("App.Speed.Common.ShowSelectedChargesTypes")
            vm.selectedChargesTypes = selectedChargesTypes ? angular.fromJson(selectedChargesTypes) : new Array();
            vm.isChargesTypeWiseLinkingForWorkShopEnabled = abp.features.isEnabled("CRS.CustomFeatures.ChargesTypeWiseLinkingForWorkShop");
            vm.isTaxCodeEnabled = abp.features.isEnabled("CRS.TaxCodes");
            vm.localize = function (input) {
                return app.localize(input);
            };
            //vm.jobTypes = [
            //    { id: 1, name: app.localize("RoutineService") },
            //    { id: 2, name: app.localize("MechanicalService") },
            //    { id: 3, name: app.localize("ElectricalService") },
            //    { id: 4, name: app.localize("DentingAndPainting") },
            //    { id: 5, name: app.localize("AccidentService") },
            //    { id: 6, name: app.localize("ACService") },
            //    { id: 7, name: app.localize("BreakdownService") },
            //    { id: 8, name: app.localize("TyreService") },
            //    { id: 9, name: app.localize("UnitMaintenance") },
            //    { id: 10, name: app.localize("UnitRepair") },
            //    { id: 11, name: app.localize("RegularLubrications") },
            //];
            vm.whoseFault = [
                { id: 1, name: "Client At Fault" },
                { id: 2, name: "Third Party Fault" }
            ];
            vm.insuranceTypes = [
                { id: 1, name: app.localize("ExcessRepair") },
                { id: 2, name: app.localize("FullInsurance") }
            ];

            vm.jobEstimation = {};
            // vm.IsJobTypeDuplicated = false;
            vm.IsJobTypeDuplicated = false;
            vm.addJobDetail = function (jobDetail) {
                jobDetail.push(getEmptyJobDetail());
            };

            vm.addJobCharge = function (charges, type) {
                charges.push(getJobChargeObject(type));
            };


            vm.removeElementFromList = function (list, index) {
                if (list.length > index) {
                    list = list.splice(index, 1);
                }
            };

            vm.jobTypeOnChange = (jobDetail) => {
                jobDetail.charges.forEach(c => c.activity = null);
                vm.getLabourActivitiesSearch(null, jobDetail);
            }

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.searchItems = function ($select) {
                var name = $select.search;
                if (name === '')
                    name = "~";  //to avoid default suggestions 
                if (!vm.jobEstimation.vehicle)
                    return;
                return itemTypeAppService.searchItems({ name: name, modelId: vm.jobEstimation.vehicle.modelId }).then(function (response) {
                    vm.items = response.data.items;
                });
            };
            //vm.validateItemPrice = function (jobDetail) {
            //    var unitPrices = jobDetail.charges.filter(e => !e.unitPrice || e.unitPrice=="0");
            //    if (unitPrices.length > 0) {
            //        vm.disableBtn = true;
            //    }
            //}

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

            vm.customerSelected = function () {

                if ((vm.jobEstimation.customer && vm.jobEstimation.customer.isTaxExempted) || vm.isTaxInclusive)
                    vm.jobEstimation.taxPercent = 0;
             
                vm.jobEstimation.isTaxExempted = vm.jobEstimation.customer.isTaxExempted;
                if (vm.isTaxCodeEnabled && !vm.jobEstimation.customer.isTaxExempted) {
                    vm.jobEstimation.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
                    if (vm.jobEstimation.customer.taxCodeId > 0) {
                        vm.jobEstimation.taxPercent = vm.jobEstimation.customer.taxCode.taxPercent;
                        vm.taxPercent = vm.jobEstimation.taxPercent;
                    }
                    else if (vm.branchTaxPercentage) {
                        vm.jobEstimation.taxPercent = vm.branchTaxPercentage;
                        vm.taxPercent = vm.jobEstimation.taxPercent;
                    }
                }
                vm.jobEstimation.jobDetail.forEach(jd => {
                    jd.charges.forEach(jc => {
                        vm.calculateDiscountOnRow(jc);
                        if (jc.type == 1)
                            vm.calculateItemPrice(jc);
                        else if (jc.type == 2)
                            vm.calculateLabourCharges(jc, jd);
                        vm.calculateJobDetailTotals(jd, jc.type);
                        vm.calculateEstimationTotals();
                    });
                });



            };

            vm.openServiceItemsSelector = function (jobDetail) {
                openPopup(jobDetail);
            };

            function openPopup(jobDetail) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/workshop/serviceItems/serviceItemsSelectorModal.cshtml',
                    controller: 'tenant.views.workshop.serviceItems.serviceItemsSelectorModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        serviceItemsSelectedList: function () {
                            return {
                                items: jobDetail.serviceItems
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    concatNames(jobDetail);
                });
            }

            function concatNames(jobDetail) {
                var serviceItemNameList = "";
                var count = 0;

                var filteredList = jobDetail.serviceItems.filter(e => e.isSelected);
                filteredList.forEach(serviceItem => {
                    count++;
                    serviceItemNameList = serviceItemNameList.concat(serviceItem.name);

                    if (count < filteredList.length) {
                        serviceItemNameList = serviceItemNameList.concat(', ');
                    }
                });

                //angular.forEach(jobDetail.serviceItems, function (serviceItem) {
                //    count++;
                //    serviceItemNameList = serviceItemNameList.concat(serviceItem.name);

                //    if (count < jobDetail.serviceItems.length) {
                //        serviceItemNameList = serviceItemNameList.concat(', ');
                //    }
                //});

                jobDetail.workDetail = serviceItemNameList;
            }

            vm.getServiceItems = function (jobDetail) {
                vm.loading = true;
                vehicleServiceAppService.getVehicleServiceForEdit({ id: jobDetail.serviceId })
                    .success(function (response) {
                        var serviceResult = response;
                        serviceResult.serviceItems.forEach(e => e.isSelected = true);
                        jobDetail.serviceItems = serviceResult.serviceItems;

                        jobDetail.charges = [];
                        serviceResult.serviceParts.forEach(function (e) {

                            vm.addJobCharge(jobDetail.charges, 1);
                            var chargesIndex = jobDetail.charges.length - 1;
                            jobDetail.charges[chargesIndex].item = e.part;
                            jobDetail.charges[chargesIndex].unitPrice = e.part.price;
                            jobDetail.charges[chargesIndex].quantity = e.quantity;
                            jobDetail.charges[chargesIndex].itemId = e.part.id;

                            vm.calculateDiscountOnRow(jobDetail.charges[chargesIndex]);

                            vm.calculateItemPrice(jobDetail.charges[chargesIndex]);
                            vm.calculateJobDetailTotals(jobDetail, 1);
                            vm.calculateEstimationTotals();
                        });
                        //vm.serviceTariffLoaded = false;

                        if (serviceResult.serviceLabourDetails) {
                            serviceResult.serviceLabourDetails.forEach(function (e) {
                                vm.addJobCharge(jobDetail.charges, 2);
                                var chargesIndex = jobDetail.charges.length - 1;
                                jobDetail.charges[chargesIndex].designationId = e.designationId;
                                jobDetail.charges[chargesIndex].cost = e.cost;
                                jobDetail.charges[chargesIndex].quantity = e.minutes;
                                jobDetail.charges[chargesIndex].charges = e.cost - jobDetail.charges[chargesIndex].discount;
                                jobDetail.charges[chargesIndex].serviceTariffLoaded = true;

                                vm.calculateDiscountOnRow(jobDetail.charges[chargesIndex]);

                                vm.calculateLabourCharges(jobDetail.charges[chargesIndex], jobDetail);
                                vm.calculateJobDetailTotals(jobDetail, 2);
                                vm.calculateEstimationTotals();

                            });
                        }
                        if (vm.selectedChargesTypes != null && vm.selectedChargesTypes.length > 0 && vm.isChargesTypeWiseLinkingForWorkShopEnabled) {
                            vm.selectedChargesTypes.forEach(ct => {
                                var chargesTypeId = vm.allChargesSettings.find(e => e.id == ct.id).id;
                                var chargesType = vm.allChargesSettings.find(e => e.id == ct.id);
                                jobDetail.charges.push(getJobChargeObjectForMisc(chargesTypeId, chargesType));

                            });
                        }
                        concatNames(jobDetail);


                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.calculateTax = function (totalCharges) {
                vm.jobEstimation.tax = utilities.round((vm.jobEstimation.taxPercent / 100) * totalCharges, 2);
                vm.jobEstimation.totalCharges += vm.jobEstimation.tax;
            };

            vm.calculateJobEstimationTotals = function () {

                vm.jobEstimation.itemsCharges = 0;
                vm.jobEstimation.labourCharges = 0;
                vm.jobEstimation.miscCharges = 0;
                vm.jobEstimation.totalCharges = 0;

                angular.forEach(vm.jobEstimation.jobDetail, function (jobDetail) {
                    vm.jobEstimation.itemsCharges += jobDetail.itemsCharges;
                    vm.jobEstimation.labourCharges += jobDetail.labourCharges;
                    vm.jobEstimation.miscCharges += jobDetail.miscCharges;
                    vm.jobEstimation.totalCharges += jobDetail.totalCharges;
                });

                vm.calculateTax(vm.jobEstimation.totalCharges);
            };

            vm.searchInsuranceCompany = function ($select) {
                if (!$select.search) return;
                return directoryService.search({ keyword: $select.search, contactType: 2, contactCategory: 2, activeOnly: true }).then(function (response) {
                    vm.insuranceCompanies = response.data.items;
                });
            };
            vm.getServicesByModel = function () {
                vm.loading = true;
                vehicleServiceAppService.getVehicleServicesByModelOrDefault({ id: vm.jobEstimation.vehicle.modelId }).success(function (data) {
                    vm.services = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.calculateDiscountOnRow = function (chargesRow) {

                if (vm.jobEstimation.customer) {
                    var discountPercent = 0;
                    if (vm.jobEstimation.customer.discountPercent)
                        discountPercent = vm.jobEstimation.customer.discountPercent;

                    if (chargesRow.type == 1) //  Item Charges
                        chargesRow.discount = (chargesRow.quantity * chargesRow.unitPrice) * (discountPercent / 100);
                    else if (chargesRow.type == 2) // Labour Charges
                        chargesRow.discount = (chargesRow.cost) * (discountPercent / 100);

                    chargesRow.discount = utilities.round(chargesRow.discount, 2);
                }

            }

            vm.getLabourTariffForJob = function () {
                vm.loading = true;
                labourTariffService.getLabourTariffByVehicleType({ vehicleTypeId: vm.jobEstimation.vehicle.tariffGroupId }).success(function (data) {
                    vm.labourTariffLines = data;
                    if (vm.jobEstimation.jobDetail && vm.jobEstimation.jobDetail.length > 0) {

                        vm.jobEstimation.jobDetail.filter(e => e.jobType != 1).forEach(jd => {
                            if (jd.charges) {
                                jd.charges.filter(e => e.designationId != null).forEach(jc => {
                                    vm.filterTariffLine(jc);
                                });
                            }

                        });

                    }
                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.getLabourTariffForJobEdit = function () {
                vm.loading = true;
                labourTariffService.getLabourTariffByVehicleType({ vehicleTypeId: vm.jobEstimation.vehicle.tariffGroupId }).success(function (data) {
                    vm.labourTariffLines = data;
                    if (vm.jobEstimation.jobDetail && vm.jobEstimation.jobDetail.length > 0) {

                        vm.jobEstimation.jobDetail.filter(e => e.jobType != 1).forEach(jd => {
                            if (!jd.charges) {
                                jd.charges.filter(e => e.designationId != null).forEach(jc => {
                                    vm.filterTariffLine(jc);
                                });
                            }

                        });

                    }
                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.filterTariffLine = function (jobCharge) {
                jobCharge.charges = 0;
                jobCharge.cost = 0;
                jobCharge.ActivitytariffLoaded = false;

                var tariffLine = vm.labourTariffLines ? (vm.labourTariffLines.filter(e => e.designationId === jobCharge.designationId && e.activityId === jobCharge.activityId))[0] : null;
                if (tariffLine) {
                    jobCharge.ActivitytariffLoaded = true;
                    jobCharge.activityId = tariffLine.activityId;
                    jobCharge.designationId = tariffLine.designationId;
                    jobCharge.cost = tariffLine.cost;
                    jobCharge.quantity = tariffLine.minutes;
                    jobCharge.charges = tariffLine.cost - jobCharge.discount;
                }


            };
            vm.calculateItemPrice = function (jobCharge) {

                if (jobCharge.quantity > -1) {
                    jobCharge.charges = jobCharge.unitPrice * jobCharge.quantity;
                }

                if (jobCharge.discount > -1 && jobCharge.discount <= jobCharge.charges) {
                    jobCharge.charges = jobCharge.charges - jobCharge.discount;
                }
            };

            vm.itemSelected = function (item) {
                if (item.lastPurchasePrice < item.price) {
                    abp.message.info(app.localize("Shown price is less than the price this item was purchased with"));
                }
            }
            vm.calculateLabourCharges = function (labour, jobDetail) {
                labour.charges = labour.cost - labour.discount;
                //angular.forEach(vm.designations, function (designation) {
                //    if (designation.id === labour.designationId) {

                //        if (labour.discount > -1 && labour.discount <= labour.charges) {
                //            labour.charges = labour.charges - labour.discount;
                //        }
                //    }
                //});
            };

            vm.calculateJobDetailTotals = function (jobDetail, type) {

                var jobCharges = 0;

                angular.forEach(jobDetail.charges, function (jobCharge) {
                    if (jobCharge.chargesTypeId)
                        jobCharge.type = 3;

                    if (jobCharge.type === type && jobCharge.charges > -1)
                        jobCharges = jobCharges + jobCharge.charges;
                });

                if (type === 1) {
                    jobDetail.itemsCharges = jobCharges;
                }

                if (type === 2) {
                    jobDetail.labourCharges = jobCharges;
                }

                if (type === 3) {
                    jobDetail.miscCharges = jobCharges;
                }

                jobDetail.totalCharges = jobDetailTotalCharges(jobDetail);
            };

            vm.calculateEstimationTotals = function () {
                vm.jobEstimation.itemsCharges = 0;
                vm.jobEstimation.labourCharges = 0;
                vm.jobEstimation.miscCharges = 0;
                vm.jobEstimation.totalCharges = 0;

                angular.forEach(vm.jobEstimation.jobDetail, function (jobDetail) {
                    vm.jobEstimation.itemsCharges += jobDetail.itemsCharges;
                    vm.jobEstimation.labourCharges += jobDetail.labourCharges;
                    vm.jobEstimation.miscCharges += jobDetail.miscCharges;
                    vm.jobEstimation.totalCharges += jobDetail.totalCharges;
                });

                vm.calculateTax(vm.jobEstimation.totalCharges);
            };

            vm.searchVehicles = function ($select) {
                if ($select.search === "") { vm.vehicles = null; return null; }
                return vehicleService.searchVehiclesForWorkshop({ plateNo: $select.search }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };

            vm.searchVehiclePopup = function () {
                openSearchVehicleModal();
            };

            vm.searchCustomers = function ($select) {
                if (!$select.search) return;
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true, includeSalesPerson: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            vm.searchCustomerPopoup = function () {
                openSearchContactModel(null, 2);
            };

            vm.getLabourActivitiesSearch = function ($select, jobDetail) {
                return labourActivityService.getLabourActivitiesSearch({ keyword: $select && $select.search ? $select.search : '', jobType: jobDetail.jobType }).then(function (response) {
                    jobDetail.labourActivities = response.data.items;
                });
            };

            vm.isTypeDuplicated = function () {
                vm.IsJobTypeDuplicated = false;
                if (!vm.jobEstimation.jobDetail || !vm.jobEstimation.jobDetail.length > 0)
                    return;
                var distinctJobTypes = [...new Set(vm.jobEstimation.jobDetail.map(e => e.jobType))];
                vm.IsJobTypeDuplicated = distinctJobTypes.length != vm.jobEstimation.jobDetail.length;
            };
            
            vm.checkTypeDuplication = function (type) {

                var count = 0;
                //  vm.IsJobTypeDuplicated = false;
                if (!vm.jobEstimation.jobDetail.length > 0)
                    return;
                var distinctJobTypes = [...new Set(vm.jobEstimation.jobDetail.map(e => e.jobType))];
                if (distinctJobTypes.length != vm.jobEstimation.jobDetail.length) {
                    abp.message.info('Type already selected.');
                    //   vm.IsJobTypeDuplicated = true;
                }

                //angular.forEach(vm.jobEstimation.jobDetail, function (jobDetail) {
                //    if (jobDetail.jobType === type) {
                //        count++;
                //        if (count > 1) {
                //            abp.message.info('Type already selected.');
                //            vm.IsJobTypeDuplicated = true;
                //        }
                //    }
                //});

            };

            vm.save = function () {

                angular.forEach(vm.jobEstimation.jobDetail, function (jobDetail) {

                    if (jobDetail.jobType !== 1) { // not routine service
                        jobDetail.serviceId = null;
                    }

                    if (jobDetail.jobType === 5 && !jobDetail.insuranceType) { // accidental service and no insurance
                        jobDetail.insuranceCompany = null;
                        jobDetail.insuranceCompanyId = null;
                        jobDetail.claimNo = null;
                    }
                });

                vm.jobEstimation.kMs = vm.jobEstimation.kMs;
                vm.jobEstimation.fuelLevel = vm.jobEstimation.vehicle.fuelLevel;
                vm.jobEstimation.vehicleId = vm.jobEstimation.vehicle.id;
                vm.jobEstimation.customerId = vm.jobEstimation.customer.id;
                vm.jobEstimation.isEstimation = true;
                vm.jobEstimation.locationId = appSession.user.locationId;;
                vm.saving = true;

                jobEstimationAppService.createOrUpdateJobEstimation(vm.jobEstimation)
                    .success(function (result) {
                        vm.saving = false;
                        if (result > 0) {
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            $uibModalInstance.close();
                        } else {
                            abp.message.error(app.localize('Failed'));
                        }
                    })
                    .finally(function () {
                        vm.saving = false;
                    });
            };

            init();
            function getEstimation()
            {
                vm.loading = true;
                vm.isFromJob = null;
                jobAppService.getJobForEdit({ id: jobEstimationId.id })
                    .success(function (result) {
                        vm.jobEstimation = result;
                        vm.jobEstimation.jobId = result.id;
                        vm.jobEstimation.id = null;
                        vm.isEdit = true;
                        vm.isFromJob = true;

                        angular.forEach(vm.jobEstimation.jobDetail, function (jobDetail) {
                            
                            if (jobDetail.service != null) {
                                vm.services = [jobDetail.service];
                            }

                            jobDetail.showAddBtnInEditMode = jobDetail.charges.filter(e => e.type == 1).length == 0;
                            angular.forEach(jobDetail.charges, function (jobCharge) {
                                if (jobCharge.item)
                                    jobCharge.itemName = jobCharge.item.name
                                if (vm.selectedChargesTypes != null && vm.selectedChargesTypes.length > 0 && vm.isChargesTypeWiseLinkingForWorkShopEnabled) {
                                    jobCharge.chargesType = vm.allChargesSettings.find(e => e.id == jobCharge.chargesTypeId);
                                }
                                jobCharge.cost = jobCharge.charges + jobCharge.discount;
                                jobCharge.serviceTariffLoaded = false;

                                jobCharge.discount = utilities.round(jobCharge.discount, 2);
                            });
                        });
                        vm.getLabourTariffForJob();

                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            }
            function getJobChargeObjectForMisc(chargesTypeId, chargesType) {
                return {
                    type: 0,
                    chargesTypeId: chargesTypeId,
                    chargesType: chargesType,
                    item: {},
                    unitprice: 0,
                    quantity: 0,
                    discount: 0,
                    charges: 0,
                    hours: 0,
                    detail: ""
                };
            }
            function getAllChargesSettings() {

                //if (angular.isUndefined(vm.agreementType)) return;
                vm.loading = true;
                chargesSettingService.getChargesTypes().success(function (data) {
                    vm.allChargesSettings = data;
                    console.log(vm.allChargesSettings);
                }).finally(function () {
                    vm.loading = false;
                });
            };
            function init() {

                vm.loading = true;
                getDesignations();
                vm.branchTaxCode();
                //getLabourActivities();
                getVehicleServices();
                getAllChargesSettings();
                jobEstimationAppService.getJobEstimationForEdit({ id: jobEstimationId })
                    .success(function (result) {
                        vm.jobEstimation = result;
                        vm.isEditMode = vm.jobEstimation.id > 1;

                        if (vm.jobEstimation.id < 1) {
                            
                            vm.jobEstimation.taxPercent = vm.taxPercent;
                            vm.jobEstimation.jobDetail[0].charges.push(getJobChargeObject(1)); // 1 : item
                            vm.jobEstimation.jobDetail[0].charges.push(getJobChargeObject(2)); // 2 : labour
                            vm.jobEstimation.jobDetail[0].charges.push(getJobChargeObject(3)); // 3 : mics
                            if (vm.selectedChargesTypes != null && vm.selectedChargesTypes.length > 0 && vm.isChargesTypeWiseLinkingForWorkShopEnabled) {
                                chargesSettingService.getChargesTypes().success((data) => {
                                    vm.selectedChargesTypes.forEach(ct => {
                                        var chargesTypeId = data.find(e => e.id == ct.id).id;
                                        var chargesType = data.find(e => e.id == ct.id);
                                        vm.jobEstimation.jobDetail[0].charges.push(getJobChargeObjectForMisc(chargesTypeId, chargesType));

                                    });
                                });
                                
                            }
                            vm.jobEstimation.jobDetail[0].itemsCharges = 0;
                            vm.jobEstimation.jobDetail[0].labourCharges = 0;
                            vm.jobEstimation.jobDetail[0].miscCharges = 0;
                            vm.jobEstimation.jobDetail[0].totalCharges = 0;
                        }

                        if (vm.isEditMode) {
                            //vm.serviceTariffLoaded = true;
                            angular.forEach(vm.jobEstimation.jobDetail, function (jobDetail) {
                                angular.forEach(jobDetail.charges, function (jobCharge) {
                                    //if (jobCharge.type === 1) //itemCharge
                                    //{
                                    //    //if (jobCharge.item.productUnitOfMeasures && jobCharge.item.productUnitOfMeasures.length > 0) {
                                    //    //    jobCharge.item.unitOfMeasureId = jobCharge.item.productUnitOfMeasures[0].unitOfMeasureId;
                                    //    //    jobCharge.item.unitOfMeasure = jobCharge.item.productUnitOfMeasures[0].unitOfMeasure;
                                    //    //}
                                    //}
                                    //else
                                    if (vm.selectedChargesTypes != null && vm.selectedChargesTypes.length > 0 && vm.isChargesTypeWiseLinkingForWorkShopEnabled) {
                                        chargesSettingService.getChargesTypes().success((data) => {
                                            jobCharge.chargesType = data.find(e => e.id == jobCharge.chargesTypeId);
                                        });
                                    }
                                    if (vm.selectedChargesTypes != null && vm.selectedChargesTypes.length > 0 && vm.isChargesTypeWiseLinkingForWorkShopEnabled) {
                                        jobCharge.chargesType = vm.allChargesSettings.find(e => e.id == jobCharge.chargesTypeId);
                                    }
                                    jobCharge.cost = jobCharge.charges + jobCharge.discount;
                                    jobCharge.serviceTariffLoaded = true;
                                });
                            });
                            vm.getLabourTariffForJobEdit();
                        }
                        
                    })
                    .finally(function () {
                        if (jobEstimationId.id) { getEstimation(); }
                        vm.loading = false;
                    });
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

            function getEmptyJobDetail() {
                if (vm.selectedChargesTypes != null && vm.selectedChargesTypes.length > 0 && vm.isChargesTypeWiseLinkingForWorkShopEnabled) {
                    var charges = [
                        getJobChargeObject(1),
                        getJobChargeObject(2),
                        getJobChargeObject(3)
                    ];
                    vm.selectedChargesTypes.forEach(ct => {
                        var chargesTypeId = vm.allChargesSettings.find(e => e.id == ct.id).id;
                        var chargesType = vm.allChargesSettings.find(e => e.id == ct.id);
                        charges.push(getJobChargeObjectForMisc(chargesTypeId, chargesType));

                    });
                    return {
                        charges: charges,
                        jobType: 0,
                        service: null,
                        serviceId: null,
                        insuranceCompany: null,
                        insuranceCompanyId: null,
                        insuranceType: null,
                        itemsCharges: 0,
                        labourCharges: 0,
                        miscCharges: 0,
                        totalCharges: 0,
                        workDetail: "",
                        claimNo: "",
                        //jobDetailCreationInEdit: true
                    };
                }
                else {
                    return {
                        charges: [getJobChargeObject(1), getJobChargeObject(2), getJobChargeObject(3)],
                        jobType: 0,
                        service: null,
                        serviceId: null,
                        insuranceCompany: null,
                        insuranceCompanyId: null,
                        insuranceType: null,
                        itemsCharges: 0,
                        labourCharges: 0,
                        miscCharges: 0,
                        totalCharges: 0,
                        workDetail: "",
                        claimNo: "",
                        //jobDetailCreationInEdit: true
                    };
                }
            }

            function openSearchVehicleModal() {
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
                        console.log("vm.jobEstimation.vehicle:" + result);
                        vm.jobEstimation.vehicle = result;
                        vm.getSfervicesByModel();
                        vm.getLabourTariffForJob();
                    }
                });
            }

            vm.addExternalWorkshopVehiclePopup = function () {
                openAddExternalWorkshopVehicleModal();
            };

            function openAddExternalWorkshopVehicleModal() {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/addExternalWorkshopVehicle.cshtml',
                    controller: 'tenant.views.crs.vehicles.addExternalWorkshopVehicle as vm',
                    backdrop: 'static',
                    size: 'sm'
                });
                modalInstance.result.then(function (vehicle) {
                    console.log("vm.jobEstimation.vehicle:" + vehicle);
                    vm.jobEstimation.vehicle = vehicle;
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
                        vm.jobEstimation.customer = result;
                        vm.customerSelected();
                    }
                });
            }

            function getDesignations() {
                vm.loading = true;
                designationAppService.getDesignations()
                    .success(function (result) {
                        vm.designations = result.items;
                    })
                    .error(function () {
                        vm.loading = false;
                    })
                    .finally(() => {
                        vm.loading = false;
                    });
            }

            function getVehicleServices() {
                vm.loading = true;
                vehicleServiceAppService.getVehicleServices()
                    .success(function (result) {
                        vm.services = result.items;
                    })
                    .error(function () {
                        vm.loading = false;
                    })
                    .finally(() => {
                        vm.loading = false;
                    });
            }

            function getLabourActivities() {
                vm.loading = true;
                labourActivityService.getLabourActivities()
                    .success(function (result) {
                        vm.labourActivity = result.items;
                        vm.loading = false;

                    })
                    .error(function () {
                        vm.loading = false;
                    });
            }
            function jobDetailTotalCharges(jobDetail) {
                var total = 0;

                if (jobDetail.itemsCharges) {
                    total += jobDetail.itemsCharges;
                }

                if (jobDetail.labourCharges) {
                    total += jobDetail.labourCharges;
                }

                if (jobDetail.miscCharges) {
                    total += jobDetail.miscCharges;
                }

                return total;
            }
        }
    ]);
