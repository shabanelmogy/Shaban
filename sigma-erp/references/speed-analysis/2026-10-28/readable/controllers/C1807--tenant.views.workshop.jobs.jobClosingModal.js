// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:494340-494485
appModule.controller('tenant.views.workshop.jobs.jobClosingModal', [
        '$uibModalInstance', 'abp.services.app.job', 'jobId','utilities',
        function ($uibModalInstance, jobAppService, jobId, utilities) {

            var vm = this;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.taxPercent = parseFloat(abp.setting.get("App.General.TaxPercentage"));
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.saving = false;
            vm.isEditMod = false;
            vm.insuranceCompanySumTax = 0;
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            vm.jobLog = {
                jobId: jobId,
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
                vm.sumInsuranceCompanyAmount();
                vm.sumInsuranceTax();
            };



            function init() {
                vm.loading = true;
                jobAppService.getJobForClosing({ id: jobId }).success(function (result) {
                    vm.job = result;
                    vm.jobOriginal = angular.copy(result);
                    vm.sumInsuranceCompanyAmount();
                    vm.sumInsuranceTax();
                    vm.sumCustomerTax();
                }).finally(function () {
                    vm.loading = false;
                });
            }
            init();
            vm.save = function () {
                vm.saving = true;
                jobAppService.closeJob(vm.job).success(function (result) {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };
            vm.sumCustomerAmount = function () {
                vm.customerAmountSum = 0;
                vm.insuranceCompanyAmountSum = 0;
                vm.job.jobDetail.forEach(function (jd) {
                    vm.customerAmountSum += jd.customerItemsAmount + jd.customerLabourAmount + jd.customerMiscAmount;
                    vm.insuranceCompanyAmountSum += jd.insuranceCompanyItemsAmount + jd.insuranceCompanyLabourAmount + jd.insuranceCompanyMiscAmount;
                });
            }

            vm.sumInsuranceCompanyAmount = function () {
                var insuranceSum = 0;
                vm.job.jobDetail.forEach(e => {
                    insuranceSum += e.insuranceCompanyItemsAmount + e.insuranceCompanyLabourAmount + e.insuranceCompanyMiscAmount;
                })
                
                vm.insuranceCompanySum = insuranceSum;
                vm.sumCustomerTax();
            }

            vm.sumInsuranceTax = function () {
                var insuranceTaxSum = 0;
                vm.job.jobDetail.forEach(e => {
                    if (e.insuranceCompany)
                    {
                        if (!e.insuranceCompany.isTaxExempted) {
                            insuranceSum = e.insuranceCompanyItemsAmount + e.insuranceCompanyLabourAmount + e.insuranceCompanyMiscAmount;
                            insuranceTaxSum += utilities.round((vm.taxPercent / 100) * insuranceSum, 2);
                        }
                    }
                    
                    
                })
                if (vm.job.customer.isTaxExempted)
                {
                    vm.job.tax = insuranceTaxSum;
                    vm.job.totalCharges = vm.jobOriginal.totalCharges + vm.job.tax;
                }
                
                vm.insuranceCompanySumTax = insuranceTaxSum;
                vm.sumCustomerTax();
            }
            vm.sumCustomerTax = function () {
                var customerSum = vm.jobOriginal.totalCharges - vm.jobOriginal.tax - vm.insuranceCompanySum;

                var customerTax = utilities.round((vm.jobOriginal.taxPercent / 100) * customerSum, 2);
                if (!vm.job.customer.isTaxExempted) {
                    if (vm.job.totalCharges) {
                        vm.job.totalCharges = vm.job.totalCharges - vm.job.tax;
                        vm.job.tax = customerTax + vm.insuranceCompanySumTax;
                        vm.job.totalCharges = vm.job.totalCharges + vm.job.tax;
                    }
                    
                }

            }

        }]);
