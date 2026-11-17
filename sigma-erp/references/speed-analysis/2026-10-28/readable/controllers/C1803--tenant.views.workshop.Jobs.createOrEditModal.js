// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:492212-493390
appModule.controller('tenant.views.workshop.Jobs.createOrEditModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.item', 'abp.services.app.vehicle', 'abp.services.app.directory',
        'abp.services.app.designation', 'options', 'abp.services.app.job', 'abp.services.app.vehicleService', 'abp.services.app.jobEstimation',
        'abp.services.app.labourActivity', 'abp.services.app.labourTariff', 'abp.services.app.workOrder', 'abp.services.app.jobCategory', 'abp.services.app.tenantSettings', 'utilities', 'abp.services.app.chargesSetting', 'abp.services.app.bill', 'abp.services.app.commonLookup', 'appSession',
        function ($scope, $uibModal, $uibModalInstance, itemTypeAppService, vehicleService,
            directoryService, designationAppService, options, jobAppService, vehicleServiceAppService,
            jobEstimationAppService, labourActivityService, labourTariffService, workOrderService, jobCategoryService, tenantSettingsService, utilities, chargesSettingService, billService, commonLookupService, appSession) {

            var vm = this;

            var kmsLimit = 1000;
            var timesLimit = 14; // in days

            vm.showServiceAlert = false;
            vm.isStockEnabled = abp.features.isEnabled("STOCK");
            vm.isAssetsEnabled = abp.features.isEnabled("CRS.Accounts.Assets");
            vm.isWorkshopEnabled = abp.features.isEnabled("WORKSHOP");
            vm.branchTaxPercentage = null;
            vm.isAccountsEnabled = abp.features.isEnabled("CRS.Accounts");
            vm.isCostCenterEnabled = abp.features.isEnabled("Core.CostCenters");
            vm.isFMSEnabled = abp.features.isEnabled("FMS");
            vm.addMasterAgreementInVouchers = abp.features.isEnabled("CRS.CustomFeatures.MasterAgreementInVouchers");
            vm.isCustomerWiseDiscountEnabled = abp.features.isEnabled("CRS.CustomFeatures.CustomerWiseDiscount");
            vm.customerDiscountPercent = null;
            vm.isTaxCodeEnabled = abp.features.isEnabled("CRS.TaxCodes");
            vm.isCostCenter2Enabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.IsCostCenterGroup2Enabled"));
            vm.grnAsFinancialVoucher = utilities.parseBoolean(abp.setting.get("App.General.GrnAsFinancialVoucher"));
            vm.isCustomFieldOneIsMandotoryInBill = utilities.parseBoolean(abp.setting.get("App.General.IsCustomFieldOneIsMandotoryInBill"));
            vm.autoCalculateAmountInWords = abp.setting.get("App.General.AutoCalculateAmountInWords");
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.itemPricePercentage = parseFloat(abp.setting.get("App.Speed.Common.ItemPricePercentage"));
            //vm.taxPercent = isNaN(vm.taxPercent) ? 0 : vm.taxPercent;
            vm.isTaxInclusive = utilities.parseBoolean(abp.setting.get("App.General.TaxInclusive"));
            vm.miscWithZero = utilities.parseBoolean(abp.setting.get("App.Speed.Common.IsMiscellaneousJobCardValueZero"));
            vm.duplicateChassisNumberAlertOnJobCard = utilities.parseBoolean(abp.setting.get("App.Speed.Common.DuplicateChassisNumberAlertOnJobCard"));
            vm.makeItemPriceEditable = utilities.parseBoolean(abp.setting.get("App.Speed.Common.MakeItemPriceEditable"));
            vm.isAllowEditJobType = utilities.parseBoolean(abp.setting.get("App.Speed.Common.AllowEditJobType"));
            vm.externalWorkShopChargesInJC = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ExternalWorkshopChargesInJC"));
            vm.enableJobCategory = utilities.parseBoolean(abp.setting.get("App.Speed.Common.AddCategoriesInJob"));
            var jobType = abp.setting.get("App.Speed.Common.ShowSelectedJobTypes")
            vm.jobTypes = jobType ? angular.fromJson(jobType) : new Array();
            if (!vm.jobTypes || vm.jobTypes.length <= 0)
                vm.jobTypes = utilities.getJobTypes();
            var selectedChargesTypes = abp.setting.get("App.Speed.Common.ShowSelectedChargesTypes")
            vm.selectedChargesTypes = selectedChargesTypes ? angular.fromJson(selectedChargesTypes) : new Array();
            vm.isChargesTypeWiseLinkingForWorkShopEnabled = abp.features.isEnabled("CRS.CustomFeatures.ChargesTypeWiseLinkingForWorkShop");
            vm.localize = function (input) {
                return app.localize(input);
            };
            vm.isEdit = false;
            vm.isFromWorkOrder = false;
            var additionalInfoObj = {};
            vm.whoseFault = [
                { id: 1, name: "Client At Fault" },
                { id: 2, name: "Third Party Fault" }
            ];

            vm.insuranceTypes = [
                { id: 1, name: app.localize("ExcessRepair") },
                { id: 2, name: app.localize("FullInsurance") }
            ];

            vm.isWorkshopAndRentalEnabled = abp.features.isEnabled("WORKSHOP") && !abp.features.isEnabled("CRS.Rental");

            vm.job = {};
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
                if (!vm.job.vehicle)
                    return;
                return itemTypeAppService.searchItems({ name: name, modelId: vm.job.vehicle.modelId }).then(function (response) {
                    vm.items = response.data.items;
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


            vm.jobAdditionFields = {
                field1: false,
                field2: false,
                field3: false,
            };

            vm.getAdditionalFields = function () {
                vm.loading = true;
                tenantSettingsService.getDocumentSetting("AdvanceSettings.FormAndFields.Job").success(function (data) {
                    if (data && data.additionalFields && data.additionalFields.length) {
                        vm.jobAdditionFields.field1 = data.additionalFields.find(x => x.name == "JobAdditionalField1").isEnabled;
                        vm.jobAdditionFields.field2 = data.additionalFields.find(x => x.name == "JobAdditionalField2").isEnabled;
                        vm.jobAdditionFields.field3 = data.additionalFields.find(x => x.name == "JobAdditionalField3").isEnabled;
                    }

                }).finally(function () {
                    vm.loading = false;
                });
            };

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
                vm.job.taxPercent = vm.taxPercent;
                if (vm.isTaxCodeEnabled && !vm.job.customer.isTaxExempted) {
                    if (vm.job.customer.taxCodeId > 0) {
                        vm.job.taxPercent = vm.job.customer.taxCode.taxPercent;
                    }
                    else {
                        if (vm.branchTaxPercentage)
                            vm.job.taxPercent = vm.branchTaxPercentage;
                    }
                }
                if ((vm.job.customer && vm.job.customer.isTaxExempted) || vm.isTaxInclusive)
                    vm.job.taxPercent = 0;
                vm.job.isTaxExempted = vm.job.customer.isTaxExempted;
                vm.job.jobDetail.forEach(jd => {
                    jd.charges.forEach(jc => {
                        vm.calculateDiscountOnRow(jc);
                        if (jc.type === 1)
                            vm.calculateItemPrice(jc);
                        else if (jc.type === 2)
                            vm.calculateLabourCharges(jc, jd);
                        vm.calculateJobDetailTotals(jd, jc.type);
                        vm.calculateJobTotals();
                    });
                });
                vm.job.salesPerson = vm.job.customer.salesPerson;
                vm.job.salesPersonId = vm.job.customer.salesPerson != null ? vm.job.customer.salesPerson.id : null;

                /* vm.searchStaff();*/


            };

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

            vm.calculateItemPrice = function (jobCharge) {
                if (jobCharge.quantity > -1) {
                    jobCharge.charges = jobCharge.unitPrice * jobCharge.quantity;
                }

                if (jobCharge.discount > -1 && jobCharge.discount <= jobCharge.charges) {
                    jobCharge.charges = jobCharge.charges - jobCharge.discount;
                }
            };

            vm.calculateLabourCharges = function (labour, jobDetail) {

                labour.charges = labour.cost - labour.discount;
                //if (labour.quantity > -1) {
                //    labour.charges = labour.unitPrice * labour.quantity;
                //}

                //if (labour.discount > -1 && labour.discount <= labour.charges) {
                //    labour.charges = labour.charges - labour.discount;
                //}

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
                if (type === 4) {
                    jobDetail.externalWorkCharges = jobCharges;
                }

                jobDetail.totalCharges = jobDetailTotalCharges(jobDetail);
                vm.calculateTax();
            };

            vm.calculateTax = function () {
                //vm.job.taxPercent = vm.job.taxPercent ? vm.job.taxPercent : vm.taxPercent;
                console.log(vm.job.taxPercent);
                var totalCharges = utilities.round(vm.job.totalCharges, 2);
                vm.job.tax = utilities.round((vm.job.taxPercent / 100) * totalCharges, 2);
                vm.job.totalCharges = utilities.round(vm.job.totalCharges + vm.job.tax, 2);
            };

            vm.calculateJobTotals = function () {

                vm.job.itemsCharges = 0;
                vm.job.labourCharges = 0;
                vm.job.miscCharges = 0;
                vm.job.externalWorkCharges = 0;
                vm.job.totalCharges = 0;

                angular.forEach(vm.job.jobDetail, function (jobDetail) {
                    vm.job.itemsCharges += jobDetail.itemsCharges;
                    vm.job.labourCharges += jobDetail.labourCharges;
                    vm.job.miscCharges += jobDetail.miscCharges;
                    vm.job.externalWorkCharges += jobDetail.externalWorkCharges;
                    vm.job.totalCharges += jobDetail.totalCharges;
                });
                vm.job.itemsCharges = utilities.round(vm.job.itemsCharges, 2);
                vm.job.labourCharges = utilities.round(vm.job.labourCharges, 2);
                vm.job.miscCharges = utilities.round(vm.job.miscCharges, 2);
                vm.job.externalWorkCharges = utilities.round(vm.job.externalWorkCharges, 2);
                vm.job.totalCharges = utilities.round(vm.job.totalCharges, 2);
                vm.calculateTax();
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
                return directoryService.search({ keyword: $select.search, contactType: 2, includeSalesPerson: true, activeOnly: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };
            vm.searchSalesPerson = function ($select) {
                if (!$select.search) return;
                return directoryService.search({ keyword: $select.search, contactType: 1 }).then(function (response) {
                    vm.staffList = response.data.items;
                });
            };

            vm.round = function (number) {
                return utilities.round(number, 2);
            }

            vm.calculateDiscountOnRow = function (chargesRow) {

                if (vm.job.customer) {
                    var discountPercent = 0;
                    if (vm.job.customer.discountPercent)
                        discountPercent = vm.job.customer.discountPercent;

                    if (chargesRow.type === 1) //  Item Charges
                        chargesRow.discount = (chargesRow.quantity * chargesRow.unitPrice) * (discountPercent / 100);
                    else if (chargesRow.type === 2) // Labour Charges
                        chargesRow.discount = (chargesRow.cost) * (discountPercent / 100);

                    chargesRow.discount = utilities.round(chargesRow.discount, 2);
                }

            }

            vm.getServiceItems = function (jobDetail) {
                vm.loading = true;
                vehicleServiceAppService.getVehicleServiceForEdit({ id: jobDetail.serviceId })
                    .success(function (response) {
                        var serviceResult = response;
                        serviceResult.serviceItems.forEach(e => e.isSelected = true);

                        if (options.workOrderId && additionalInfoObj.Type === 1) {
                            serviceResult.serviceItems.forEach(e => {
                                e.isSelected = false;
                                if (additionalInfoObj.ServieItems.some(sr => sr.toLowerCase() === e.name.toLowerCase())) {
                                    e.isSelected = true;
                                }
                            });

                            additionalInfoObj.ServieItems.forEach(si => {
                                if (!serviceResult.serviceItems.some(sr => sr.name.toLowerCase() === si.toLowerCase())) {
                                    serviceResult.serviceItems.push({ isSelected: true, name: si, isMissing: true })
                                }
                            });

                        }


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
                            vm.calculateJobTotals();
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
                                vm.calculateJobTotals();

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

            vm.searchInsuranceCompany = function ($select) {
                if (!$select.search) return;
                return directoryService.search({ keyword: $select.search, contactType: 2, contactCategory: 2, activeOnly: true }).then(function (response) {
                    vm.insuranceCompanies = response.data.items;
                });
            };

            vm.getServicesByModel = function () {
                vm.loading = true;
                vehicleServiceAppService.getVehicleServicesByModelOrDefault({ id: vm.job.vehicle.modelId }).success(function (data) {
                    vm.services = data.items;
                    if (options.workOrderId) {
                        createEmptyJobChargeRow();
                        vm.getLabourTariffForJob();
                    }

                    //if (options.workOrderId) {
                    //    serviceName = serviceName
                    //    vm.services=
                    //}
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.getServicesByVehicleId = function (id) {
                vm.loading = true;
                jobAppService.getVehicleServices({ id: id }).success(function (data) {
                    vm.vehicleservices = data.items;
                    vm.showHideServiceAlert();
                }).finally(function () {
                    vm.loading = false;
                });
            }
            vm.getLabourTariffForJob = function () {
                vm.loading = true;
                labourTariffService.getLabourTariffByVehicleType({ vehicleTypeId: vm.job.vehicle.tariffGroupId }).success(function (data) {
                    vm.labourTariffLines = data;
                    if (vm.job.jobDetail && vm.job.jobDetail.length > 0) {

                        vm.job.jobDetail.filter(e => e.jobType !== 1).forEach(jd => {
                            if (jd.charges) {
                                jd.charges.filter(e => e.designationId !== null).forEach(jc => {
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
                if (!jobCharge.id) {
                    jobCharge.charges = 0;
                    jobCharge.cost = 0;
                    jobCharge.tariffLoaded = false;
                }
                else {
                    jobCharge.tariffLoaded = false;
                    jobCharge.serviceTariffLoaded = false;
                }

                var tariffLine = vm.labourTariffLines ? (vm.labourTariffLines.filter(e => e.designationId === jobCharge.designationId && e.activityId === jobCharge.activityId))[0] : null;
                if (tariffLine) {
                    jobCharge.tariffLoaded = true;
                    jobCharge.activityId = tariffLine.activityId;
                    jobCharge.designationId = tariffLine.designationId;
                    jobCharge.cost = tariffLine.cost;
                    jobCharge.quantity = tariffLine.minutes;
                    jobCharge.charges = tariffLine.cost - jobCharge.discount;
                    jobCharge.serviceTariffLoaded = false;
                }


            };
            function getJobCategory() {
                vm.loading = true;
                jobCategoryService.getJobCategory().success(function (data) {
                    vm.jobCategories = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.searchCustomerPopoup = function () {
                openSearchContactModel(null, 2);
            };

            vm.searchStaff = function ($select, designationId) {
                if (!$select.search || !designationId) return;
                return directoryService.searchStaff({ keyword: $select.search, designationId: designationId }).then(function (response) {
                    vm.staff = response.data.items;
                });
            };
            vm.getLabourActivitiesSearch = function ($select, jobDetail) {
                return labourActivityService.getLabourActivitiesSearch({ keyword: $select && $select.search ? $select.search : '', jobType: jobDetail.jobType }).then(function (response) {
                    jobDetail.labourActivities = response.data.items;
                });
            };

            vm.isTypeDuplicated = function () {
                vm.IsJobTypeDuplicated = false;
                if (!vm.job.jobDetail || !vm.job.jobDetail.length > 0)
                    return;
                var distinctJobTypes = [...new Set(vm.job.jobDetail.map(e => e.jobType))];
                vm.IsJobTypeDuplicated = distinctJobTypes.length !== vm.job.jobDetail.length;
            };

            vm.showHideServiceAlert = function () {
                vm.showServiceAlert = false;

                if (!(vm.vehicleservices && vm.vehicleservices.length > 0))
                    return;

                var dueService = vm.vehicleservices[0];

                if (dueService.dueKms && ((vm.job.kMs > dueService.dueKms) || ((dueService.dueKms - vm.job.kMs) > kmsLimit)))
                    return;
                else if (dueService.dueDate && (moment().add(timesLimit, 'd') < moment(dueService.dueDate)))
                    return;

                vm.showServiceAlert = !vm.job.jobDetail.some(e => e.jobType == 1); // check if routine type exists

            };

            vm.checkTypeDuplication = function (type) {

                var count = 0;
                vm.IsJobTypeDuplicated = false;

                angular.forEach(vm.job.jobDetail, function (jobDetail) {
                    if (jobDetail.jobType === type) {
                        count++;
                        if (count > 1) {
                            abp.message.info('Type already selected.');
                            vm.IsJobTypeDuplicated = true;
                        }
                    }
                });
                vm.showHideServiceAlert();
            };
            vm.checkChassisNo = function () {
                if (vm.duplicateChassisNumberAlertOnJobCard) {
                    jobAppService.checkDuplicateChassisNo(vm.job.vehicle.chassisNo)
                        .then(function (response) {
                            if (response.data) {
                                if (!vm.isEdit || vm.originalChassisNo !== vm.job.vehicle.chassisNo) {
                                    abp.message.confirm(
                                        app.localize('DuplicateChassisNumber'),
                                        app.localize('DoYouWantToProceed'),
                                        function (isConfirmed) {
                                            if (isConfirmed) {
                                                vm.save();
                                            }
                                        }
                                    );
                                } else {
                                    vm.save();
                                }
                            } else {
                                vm.save();
                            }
                        });
                }
                else {
                    vm.save();
                }
            };
            vm.save = function () {
                vm.saving = true;
                angular.forEach(vm.job.jobDetail, function (jobDetail) {

                    if (jobDetail.jobType !== 1) { // not routine service
                        jobDetail.serviceId = null;
                    }

                    if (jobDetail.jobType === 5 && !jobDetail.insuranceType) { // accidental service and no insurance
                        jobDetail.insuranceCompany = null;
                        jobDetail.insuranceCompanyId = null;
                        jobDetail.claimNo = null;
                    }
                });

                if (vm.job.salesPerson != null)
                    vm.job.salesPersonId = vm.job.salesPerson.id;
                else
                    vm.job.salesPersonId = null;

                vm.job.kMs = vm.job.kMs;
                vm.job.fuelLevel = vm.job.vehicle.fuelLevel;
                vm.job.vehicleId = vm.job.vehicle.id;
                vm.job.customerId = vm.job.customer.id;
                vm.job.isEstimation = false;

                jobAppService.createOrUpdateJob(vm.job)
                    .success(function (result) {
                        vm.saving = false;
                        if (result > 0) {
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            $uibModalInstance.close({ jobId: result });
                        } else {
                            abp.message.error(app.localize('Failed'));
                        }
                    })
                    .finally(function () {
                        vm.saving = false;
                    });
            };

            init();

            function createEmptyJobChargeRow() {

                if (!vm.job.jobDetail) {
                    vm.job.jobDetail = [];
                    vm.addJobDetail(vm.job.jobDetail);
                }
                //if (vm.selectedChargesTypes != null && vm.selectedChargesTypes.length > 0)
                //{
                //    vm.selectedChargesTypes.forEach(ct => {
                //        var chargesTypeId = vm.allChargesSettings.find(e => e.id == ct.id).id;
                //        var chargesType = vm.allChargesSettings.find(e => e.id == ct.id);
                //        vm.job.jobDetail[0].charges.push(getJobChargeObjectForMisc(chargesTypeId, chargesType));
                //    });
                //}
                if (additionalInfoObj.Type === 1)
                    vm.job.jobDetail[0].jobType = 1;
                else if (additionalInfoObj.Type === 3)
                    vm.job.jobDetail[0].jobType = 5;
                else
                    vm.job.jobDetail[0].jobType = 2;

                if (additionalInfoObj.Type === 1) {
                    serviceNameWithoutSpace = additionalInfoObj.ServiceName.replace(/\s/g, '').toLowerCase();
                    var checkIfExists = vm.services.some(e => e.name.replace(/\s/g, '').toLowerCase() === serviceNameWithoutSpace);
                    var serviceId = null;
                    if (checkIfExists)
                        serviceId = vm.services.filter(e => e.name.replace(/\s/g, '').toLowerCase() === serviceNameWithoutSpace)[0].id;

                    if (serviceId) {
                        vm.job.jobDetail[0].serviceId = serviceId;
                        vm.getServiceItems(vm.job.jobDetail[0]);
                    }
                }

                //vm.job.jobDetail[0].charges.push(getJobChargeObject(1)); // 1 : item
                //vm.job.jobDetail[0].charges.push(getJobChargeObject(2)); // 2 : labour
                //vm.job.jobDetail[0].charges.push(getJobChargeObject(3)); // 3 : mics

                vm.job.jobDetail[0].itemsCharges = 0;
                vm.job.jobDetail[0].labourCharges = 0;
                vm.job.jobDetail[0].miscCharges = 0;
                vm.job.jobDetail[0].externalWorkCharges = 0;
                vm.job.jobDetail[0].totalCharges = 0;
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
                getDesignations();
                getVehicleServices();
                getJobCategory();
                vm.branchTaxCode();
                //getLabourActivities();
                //vm.getLabourActivitiesSearch(null, null);
                vm.getAdditionalFields();
                getAllChargesSettings();
                //create job from workOrder
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

                            //if (vm.selectedChargesTypes != null && vm.selectedChargesTypes.length > 0) {
                            //    vm.job.jobDetail.charges = [];
                            //    vm.selectedChargesTypes.forEach(ct => {
                            //        var chargesTypeId = vm.allChargesSettings.find(e => e.id == ct.id).id;
                            //        var chargesType = vm.allChargesSettings.find(e => e.id == ct.id);
                            //        vm.job.jobDetail[0].charges.push(getJobChargeObjectForMisc(chargesTypeId, chargesType));
                            //    });
                            //}
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

                            //if (vm.selectedChargesTypes != null && vm.selectedChargesTypes.length > 0) {
                            //    vm.selectedChargesTypes.forEach(ct => {
                            //        var chargesTypeId = vm.allChargesSettings.find(e => e.id == ct.id).id;
                            //        var chargesType = vm.allChargesSettings.find(e => e.id == ct.id);
                            //        vm.job.jobDetail[0].charges.push(getJobChargeObjectForMisc(chargesTypeId, chargesType));
                            //    });
                            //}
                            angular.forEach(vm.job.jobDetail, function (jobDetail) {
                                angular.forEach(jobDetail.charges, function (jobCharge) {
                                    //if (jobCharge.type === 1) //itemCharge
                                    //{
                                    //    if (jobCharge.item.productUnitOfMeasures && jobCharge.item.productUnitOfMeasures.length > 0) {
                                    //        jobCharge.item.unitOfMeasureId = jobCharge.item.productUnitOfMeasures[0].unitOfMeasureId;
                                    //        jobCharge.item.unitOfMeasure = jobCharge.item.productUnitOfMeasures[0].unitOfMeasure;
                                    //    }
                                    //}
                                    //else
                                    if (vm.selectedChargesTypes != null && vm.selectedChargesTypes.length > 0 && vm.isChargesTypeWiseLinkingForWorkShopEnabled) {
                                        jobCharge.chargesType = vm.allChargesSettings.find(e => e.id == jobCharge.chargesTypeId);
                                    }
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

                                if (vm.selectedChargesTypes != null && vm.selectedChargesTypes.length > 0 && vm.isChargesTypeWiseLinkingForWorkShopEnabled) {
                                    vm.selectedChargesTypes.forEach(ct => {
                                        var chargesTypeId = vm.allChargesSettings.find(e => e.id == ct.id).id;
                                        var chargesType = vm.allChargesSettings.find(e => e.id == ct.id);
                                        vm.job.jobDetail[0].charges.push(getJobChargeObjectForMisc(chargesTypeId, chargesType));
                                    });
                                }
                                vm.job.taxPercent = vm.taxPercent;
                                vm.job.jobDetail[0].charges.push(getJobChargeObject(1)); // 1 : item
                                vm.job.jobDetail[0].charges.push(getJobChargeObject(2)); // 2 : labour
                                vm.job.jobDetail[0].charges.push(getJobChargeObject(3)); // 3 : mics

                                vm.job.jobDetail[0].itemsCharges = 0;
                                vm.job.jobDetail[0].labourCharges = 0;
                                vm.job.jobDetail[0].miscCharges = 0;
                                vm.job.jobDetail[0].externalWorkCharges = 0;
                                vm.job.jobDetail[0].totalCharges = 0;


                            }
                            else {
                                vm.isEdit = true;
                                if (vm.isEdit) {
                                    vm.originalChassisNo = vm.job.vehicle.chassisNo; // Store the original chassis number
                                }
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
                                    debugger
                                    angular.forEach(jobDetail.charges, function (jobCharge) {
                                        //if (jobCharge.type === 1) //itemCharge
                                        //{
                                        //    if (jobCharge.item.productUnitOfMeasures && jobCharge.item.productUnitOfMeasures.length > 0) {
                                        //        jobCharge.item.unitOfMeasureId = jobCharge.item.productUnitOfMeasures[0].unitOfMeasureId;
                                        //        jobCharge.item.unitOfMeasure = jobCharge.item.productUnitOfMeasures[0].unitOfMeasure;
                                        //    }
                                        //}
                                        //else
                                        if (vm.selectedChargesTypes != null && vm.selectedChargesTypes.length > 0 && vm.isChargesTypeWiseLinkingForWorkShopEnabled) {
                                            jobCharge.chargesType = vm.allChargesSettings.find(e => e.id == jobCharge.chargesTypeId);
                                        }
                                        jobCharge.cost = jobCharge.charges + jobCharge.discount;
                                        //if (jobCharge.item)
                                        //    vm.calculateItemPrice(jobCharge);
                                        jobCharge.serviceTariffLoaded = false;

                                        jobCharge.discount = utilities.round(jobCharge.discount, 2);
                                    });
                                });
                                vm.getLabourTariffForJob();

                            }
                            if (vm.job.id > 0) {
                                billService.getBillForEdit({ id: vm.job.billId }).success(
                                    function (result) {

                                        vm.job.bill = result;

                                    }).finally(function () {
                                        vm.loading = false;
                                    });
                            }
                        })
                        .finally(function () {
                            vm.loading = false;
                        });
                }

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
                        externalWorkCharges: 0,
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
                        externalWorkCharges: 0,
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
                        vm.job.vehicle = result;
                        vm.job.kMs = vm.job.vehicle.kMs;
                    }
                });
            }


            vm.addExternalWorkshopVehiclePopup = function () {
                openAddExternalWorkshopVehicleModal();
                //if (abp.features.isEnabled("WORKSHOP") && !abp.features.isEnabled("CRS.Rental"))
                //    openVehicleModal();
                //else
                //openAddExternalWorkshopVehicleModal();
            };

            function openVehicleModal() {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        vehicleId: function () {
                            return null;
                        }
                    }
                });
                modalInstance.result.then(function (vehicle) {
                    vm.job.vehicle = vehicle;
                    vm.getServicesByModel();
                    vm.getLabourTariffForJob();

                });
            }

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

            function getDesignations() {
                //vm.loading = true;
                designationAppService.getDesignations()
                    .success(function (result) {
                        vm.designations = result.items;
                    })
                    .error(function () {
                        vm.loading = false;
                    }).finally(function () {
                        //vm.loading = false;
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
                        vm.job.customer = result;
                        vm.customerSelected();
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

            function getVehicleServices() {
                //vm.loading = true;
                vehicleServiceAppService.getVehicleServices()
                    .success(function (result) {
                        vm.services = result.items;
                    })
                    .error(function () {
                        vm.loading = false;
                    }).finally(function () {
                        //vm.loading = false;
                    });
            }

            function getLabourActivities() {
                //vm.loading = true;
                labourActivityService.getLabourActivities()
                    .success(function (result) {
                        vm.labourActivity = result.items;
                        vm.loading = false;

                    })
                    .error(function () {
                        vm.loading = false;
                    }).finally(function () {
                        //vm.loading = false;
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
                if (jobDetail.externalWorkCharges) {
                    total += jobDetail.externalWorkCharges;
                }



                return total;
            }
        }
    ]);
