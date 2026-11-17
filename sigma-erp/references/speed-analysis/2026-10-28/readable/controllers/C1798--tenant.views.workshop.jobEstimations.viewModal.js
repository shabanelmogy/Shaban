// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:490631-490791
appModule.controller('tenant.views.workshop.jobEstimations.viewModal', [
        '$uibModalInstance', 'abp.services.app.jobEstimation', 'jobEstimationId', 'utilities', 'abp.services.app.labourActivity', 'abp.services.app.labourTariff', 'abp.services.app.chargesSetting',
        function ($uibModalInstance, jobEstimationAppService, jobEstimationId, utilities, labourActivityService, labourTariffService, chargesSettingService) {

            var vm = this;
            vm.loading = false;

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            vm.localize = function (input) {
                return app.localize(input);
            };
            vm.item = {};
            vm.insteadOfItemsSelectionAllowToEnterAnyItemName = utilities.parseBoolean(abp.setting.get("App.Speed.Common.InsteadOfItemsSelectionAllowToEnterAnyItemName"));
            vm.isCustomerWiseDiscountEnabled = abp.features.isEnabled("CRS.CustomFeatures.CustomerWiseDiscount");
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            var selectedChargesTypes = abp.setting.get("App.Speed.Common.ShowSelectedChargesTypes")
            vm.selectedChargesTypes = selectedChargesTypes ? angular.fromJson(selectedChargesTypes) : new Array();
            vm.isChargesTypeWiseLinkingForWorkShopEnabled = abp.features.isEnabled("CRS.CustomFeatures.ChargesTypeWiseLinkingForWorkShop");
            vm.getlocalDateTime = function (date) {
                if (date == null)
                    return "";

                var localTime = moment.utc(date).toDate();
                return moment(localTime).format(vm.dateTimeFormat);
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

            init();
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
                getAllChargesSettings();
                vm.loading = true;
                jobEstimationAppService.getJobEstimationForEdit({ id: jobEstimationId })
                    .success(function (result) {
                        vm.jobEstimation = result;

                        angular.forEach(vm.jobEstimation.jobDetail, function (jobDetail) {
                            angular.forEach(jobDetail.charges, function (jobCharge) {
                                if (vm.selectedChargesTypes != null && vm.selectedChargesTypes.length > 0 && vm.isChargesTypeWiseLinkingForWorkShopEnabled) {
                                    chargesSettingService.getChargesTypes().success((data) => {
                                        jobCharge.chargesType = data.find(e => e.id == jobCharge.chargesTypeId);
                                    });
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

                    }).finally(function () {
                        vm.loading = false;
                    });
            }

            vm.getJobTypeName = function (jobType) {
                if (jobType === 1) {
                    return "Routine Service";
                }
                else if (jobType === 2) {
                    return "Mechanical Service";
                }
                else if (jobType === 3) {
                    return "Electrical Service";
                }
                else if (jobType === 4) {
                    return "Denting & Painting";
                }
                else if (jobType === 5) {
                    return "Accident Service";
                }
                else if (jobType === 6) {
                    return "AC Service";
                }
                else if (jobType === 7) {
                    return "Breakdown Service";
                }
                else if (jobType === 8) {
                    return "Tyre Service";
                }
                else if (jobType === 9) {
                    return "Unit Maintenance";
                }
                else if (jobType === 10) {
                    return "Unit Repair";
                }
                else if (jobType === 11) {
                    return "Regular Lubrications";
                }
                else if (jobType === 12) {
                    return "Body Shop";
                }
                else if (jobType === 13) {
                    return "Inspection Job";
                }
                else if (jobType === 14) {
                    return "Make Ready For Sale/Rent";
                }
                else if (jobType === 15) {
                    return "Polishing";
                }
                else if (jobType === 17) {
                    return "Car Wash";
                }
                else if (jobType === 16) {
                    return "Others";
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
        }
    ]);
