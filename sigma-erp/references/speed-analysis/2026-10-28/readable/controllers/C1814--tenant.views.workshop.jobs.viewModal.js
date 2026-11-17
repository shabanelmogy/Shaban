// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:495717-495934
appModule.controller('tenant.views.workshop.jobs.viewModal', [
        '$uibModalInstance', '$uibModal',  'abp.services.app.job', 'jobId',  'abp.services.app.labourActivity', 'abp.services.app.tenantSettings', 'utilities', 'abp.services.app.chargesSetting', 'abp.services.app.bill',
        function ($uibModalInstance, $uibModal,  jobAppService, jobId,  labourActivityService, tenantSettingsService, utilities, chargesSettingService, billService) {

            var vm = this;
            vm.loading = false;
            vm.isCustomerWiseDiscountEnabled = abp.features.isEnabled("CRS.CustomFeatures.CustomerWiseDiscount");
            vm.isStockEnabled = abp.features.isEnabled("STOCK");
            vm.isAssetsEnabled = abp.features.isEnabled("CRS.Accounts.Assets");
            vm.isWorkshopEnabled = abp.features.isEnabled("WORKSHOP");
            vm.isAccountsEnabled = abp.features.isEnabled("CRS.Accounts");
            vm.isCostCenterEnabled = abp.features.isEnabled("Core.CostCenters");
            vm.externalWorkShopChargesInJC = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ExternalWorkshopChargesInJC"));
            vm.isFMSEnabled = abp.features.isEnabled("FMS");
            vm.addMasterAgreementInVouchers = abp.features.isEnabled("CRS.CustomFeatures.MasterAgreementInVouchers");
            vm.isCostCenter2Enabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.IsCostCenterGroup2Enabled"));
            vm.grnAsFinancialVoucher = utilities.parseBoolean(abp.setting.get("App.General.GrnAsFinancialVoucher"));
            vm.isCustomFieldOneIsMandotoryInBill = utilities.parseBoolean(abp.setting.get("App.General.IsCustomFieldOneIsMandotoryInBill"));
            vm.autoCalculateAmountInWords = abp.setting.get("App.General.AutoCalculateAmountInWords");
            vm.enableJobCategory = utilities.parseBoolean(abp.setting.get("App.Speed.Common.AddCategoriesInJob"));
            var selectedChargesTypes = abp.setting.get("App.Speed.Common.ShowSelectedChargesTypes")
            vm.selectedChargesTypes = selectedChargesTypes ? angular.fromJson(selectedChargesTypes) : new Array();
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.getlocalDateTime = function (date) {
                if (date == null)
                    return "";

                var localTime = moment.utc(date).toDate();
                return moment(localTime).format(vm.dateTimeFormat);
            };

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

            vm.item = {};

            init();
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
                
                getLabourActivities();
                vm.getAdditionalFields();
                getAllChargesSettings();
                vm.loading = true;
                jobAppService.getJobForEdit({ id: jobId })
                    .success(function (result) {
                        vm.job = result;

                        angular.forEach(vm.job.jobDetail, function (jobDetail) {
                            angular.forEach(jobDetail.charges, function (jobCharge) {
                                if (vm.selectedChargesTypes != null && vm.selectedChargesTypes.length > 0) {
                                    jobCharge.chargesType = vm.allChargesSettings.find(e => e.id == jobCharge.chargesTypeId);
                                }
                                if (jobCharge.type === 1) //itemCharge
                                {
                                    if (jobCharge.item.productUnitOfMeasures && jobCharge.item.productUnitOfMeasures.length > 0) {
                                        jobCharge.item.unitOfMeasureId = jobCharge.item.productUnitOfMeasures[0].unitOfMeasureId;
                                        jobCharge.item.unitOfMeasure = jobCharge.item.productUnitOfMeasures[0].unitOfMeasure;
                                        jobCharge.cost = jobCharge.charges + jobCharge.discount;
                                    }
                                }
                                else
                                    jobCharge.cost = jobCharge.charges + jobCharge.discount;

                            });
                        });
                        if (vm.job.id > 0) {
                            billService.getBillForEdit({ id: vm.job.billId }).success(
                                function (result) {

                                    vm.job.bill = result;

                                }).finally(function () {
                                    vm.loading = false;
                                });
                        }
                    }).finally(function () {
                        vm.loading = false;
                    });
            }


            vm.getFaultValue = function (id) {
                if (id == 1) {
                    return "Client At Fault";
                }
                else if (id == 2) {
                    return "Third Party Fault";
                }
                else {
                    return "";
                }
            };

            function getLabourActivities() {
                vm.loading = true;
                labourActivityService.getLabourActivities()
                    .success(function (result) {
                        vm.labourActivities = result.items;
                        vm.loading = false;

                    })
                    .error(function () {
                        vm.loading = false;
                    });
            }


            vm.getJobTypeName = function (jobType) {
                if (jobType === 1) {
                    return app.localize("RoutineService");
                }
                else if (jobType === 2) {
                    return app.localize("MechanicalService");
                }
                else if (jobType === 3) {
                    return app.localize("ElectricalService");
                }
                else if (jobType === 4) {
                    return app.localize("DentingAndPainting");
                }
                else if (jobType === 5) {
                    return app.localize("AccidentService");
                }
                else if (jobType === 6) {
                    return app.localize("ACService");
                }
                else if (jobType === 7) {
                    return app.localize("BreakdownService");
                }
                else if (jobType === 8) {
                    return app.localize("TyreService");
                }
                else if (jobType === 9) {
                    return app.localize("UnitMaintenance");
                }
                else if (jobType === 10) {
                    return app.localize("UnitRepair");
                }
                else if (jobType === 11) {
                    return app.localize("RegularLubrications");
                }
                else if (jobType === 12) {
                    return app.localize("BodyShop");
                }
                else if (jobType === 13) {
                    return app.localize("InspectionJob");
                }
                else if (jobType === 14) {
                    return app.localize("MakeReadyForSaleOrRent");
                }
                else if (jobType === 15) {
                    return app.localize("Polishing");
                }
                else if (jobType === 16) {
                    return app.localize("Others");
                }
                else if (jobType === 17) {
                    return app.localize("CarWash");
                }
            };

            vm.getInsuranceTypeName = function (type) {
                if (type === 1) {
                    return "Excess Repair";
                }
                else if (type === 2) {
                    return "Full Insurance";
                }
            };

            vm.viewRelatedEstimation = function (estimationId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/workshop/jobEstimations/viewModal.cshtml',
                    controller: 'tenant.views.workshop.jobEstimations.viewModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        jobEstimationId: function () {
                            return estimationId;
                        }
                    }
                });
            }
        }
    ]);
