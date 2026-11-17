// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:495938-496067
appModule.controller('tenant.views.workshop.jobs.viewModalRental', [
        '$uibModalInstance', '$uibModal', 'abp.services.app.job', 'jobId', 'abp.services.app.labourActivity',
        function ($uibModalInstance, $uibModal, jobAppService, jobId, labourActivityService) {

            var vm = this;
            vm.loading = false;
            vm.isCustomerWiseDiscountEnabled = abp.features.isEnabled("CRS.CustomFeatures.CustomerWiseDiscount");
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.item = {};

            init();

            function init() {
                getLabourActivities();

                vm.loading = true;
                jobAppService.viewJobForRentalTenant({ id: jobId })
                    .success(function (result) {
                        vm.job = result;

                        angular.forEach(vm.job.jobDetail, function (jobDetail) {
                            angular.forEach(jobDetail.charges, function (jobCharge) {
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
                    templateUrl: '~/App/tenant/views/workshop/jobEstimations/viewModalRental.cshtml',
                    controller: 'tenant.views.workshop.jobEstimations.viewModalRental as vm',
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
