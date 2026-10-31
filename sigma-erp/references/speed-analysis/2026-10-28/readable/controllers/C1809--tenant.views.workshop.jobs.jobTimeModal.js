// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:494584-494701
appModule.controller('tenant.views.workshop.jobs.jobTimeModal', [
        '$uibModal', '$uibModalInstance', 'abp.services.app.job', 'abp.services.app.labourTariff','job',
        function ($uibModal, $uibModalInstance, jobAppService, labourTariffService, job) {

            var vm = this;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.saving = false;
            vm.isEditMod = false;
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            vm.jobLog = {
                jobId: job.jobId,
                detail: ''
            }

            vm.jobTypes = [
                { id: 1, name: app.localize("RoutineService") },
                { id: 2, name: app.localize("MechanicalService") },
                { id: 3, name: app.localize("ElectricalService") },
                { id: 4, name: app.localize("DentingAndPainting") },
                { id: 5, name: app.localize("AccidentService") },
                { id: 6, name: app.localize("ACService") },
                { id: 7, name: app.localize("BreakdownService") },
                { id: 8, name: app.localize("TyreService") },
                { id: 9, name: app.localize("UnitMaintenance") },
                { id: 10, name: app.localize("UnitRepair") },
                { id: 11, name: app.localize("RegularLubrications") },
            ];

            vm.insuranceTypes = [
                { id: 1, name: app.localize("ExcessRepair") },
                { id: 2, name: app.localize("FullInsurance") }
            ];

            vm.getJobType = function (type) {
                var jobType = vm.jobTypes.filter(e => e.id == type)[0].name;
                return jobType;
            };

            vm.getInsuranceType = function (type) {
                var insuranceType = vm.insuranceTypes.filter(e => e.id == type)[0].name;
                return insuranceType;
            };

            vm.getlocalDateTime = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.damageChargesChanged = function (jd) {
                jd.insuranceCompanyItemsAmount = jd.itemsCharges - jd.excessToDamage - jd.excessFromParts;
            };

            vm.openjobLogModal = function (id) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/workshop/jobs/jobLogModal.cshtml',
                    controller: 'tenant.views.workshop.jobs.jobLogModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        jobCharge: function () {
                            return {
                                jobChargeId: id,
                                jobStatus: job.jobStatus,
                                jobNo: vm.jobTime.jobNo
                            }
                        }
                    }
                });
                modalInstance.result.then(
                    function (result) {
                        getjobTime();
                    });
            };
            
            vm.getEstimation = function (designationId, activityId) {
                if (vm.labourTariffLines.length > 0 && vm.labourTariffLines.filter(x => x.designationId == designationId && x.activityId == activityId).length > 0)
                {

                    return vm.labourTariffLines.filter(x => x.designationId == designationId && x.activityId == activityId)[0].minutes;

                } else
                {
                    return 0;
                }
            }
            function getLabourTariffForJob() {
                vm.loading = true;
                labourTariffService.getLabourTariffByVehicleType({}).success(function (data) {
                    vm.labourTariffLines = data;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function getjobTime () {
                vm.loading = true;
                jobAppService.getJobTime({ id: job.jobId }).success(function (result) {
                    vm.jobTime = result;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            function init() {
                getjobTime();
                getLabourTariffForJob();
            }
            init();

        }]);
