// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:490396-490543
appModule.controller('tenant.views.workshop.jobEstimations.printModal', [
        '$scope', 'appSession', '$stateParams', 'abp.services.app.jobEstimation', '$sce',
        function ($scope, appSession, $stateParams, jobEstimationAppService, sce) {

            var vm = this;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.tenantName = appSession.tenant.name;
            vm.fileName = appSession.tenant.tenancyName.toLowerCase() + '-' + 'header.png';
            vm.currency = abp.setting.get("App.General.CurrencyCode");
            vm.loading = false;
            vm.userName = appSession.user.name;
            vm.jobEstimationAr = sce.trustAsHtml(app.localize('jobEstimationAr'));
            vm.jobEstimationTextEng = sce.trustAsHtml(app.localize('jobEstimationTextEng'));
            //if pop-up print
            if ($scope.$parent != null) {
                if (!isNaN($scope.$parent.vmMain.jobEstimationId))
                    jobEstimationId = $scope.$parent.vmMain.jobEstimationId;
            }

            //if through url print
            if (jobEstimationId == 0 && !isNaN($stateParams.query)) {
                jobEstimationId = $stateParams.query;
            }

            var jobChargeType = {
                item: 1,
                labour: 2,
                misc: 3
            }


            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };


            vm.currencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };


            vm.item = {};
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
            init();
            vm.getlocalDateTime = function (date, format) {
                if (date != null) {
                    if (format == null) format = vm.dateTimeFormat;

                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(format);
                } else {
                    return "";
                }
            };

            vm.getUserName = function (userId) {
                commonLookupService.getUser({
                    id: userId
                }).success(function (result) {
                    vm.userName = result.name + ' ' + result.surname;
                });
            };

            vm.getDate = function (date) {
                var localTime = moment.utc(date).toDate();
                return moment(localTime).format(vm.dateFormat);
            };

            function init() {
                vm.loading = true;
                jobEstimationAppService.getJobEstimationForPrint({ id: jobEstimationId })
                    .success(function (result) {
                        vm.jobEstimation = result;
                        vm.jobEstimation.jobDetail.forEach(function (row) {
                            var charges = [];
                            if (row.charges.some(e => e.type == 1)) // 1 item
                                charges.push(...row.charges.filter(e => e.type == jobChargeType.item).map(m => m));
                            if (row.charges.some(e => e.type == 2)) // 2 labour
                                charges.push(...row.charges.filter(e => e.type == jobChargeType.labour).map(m => m));
                            if (row.charges.some(e => e.type == 3)) // 3 Misc
                                charges.push(...row.charges.filter(e => e.type == jobChargeType.misc).map(m => m));
                            row.charges = charges;
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
                else if (jobType === 17) {
                    return "Car Wash";
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
