// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:495340-495523
appModule.controller('tenant.views.workshop.Jobs.printModal', [
        '$scope', 'appSession', '$stateParams', 'abp.services.app.job', 'abp.services.app.commonLookup', '$sce', 'utilities',
        function ($scope, appSession, $stateParams, jobAppService, commonLookupService, sce, utilities ) {

            var vm = this;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.tenantName = appSession.tenant.name;
            vm.tenantId = appSession.tenant.id;
            vm.userName = appSession.user.name;
            vm.fileName = appSession.tenant.tenancyName.toLowerCase() + '-' + 'header.png';
            vm.currency = abp.setting.get("App.General.CurrencyCode");
            vm.jobEstimationAr = sce.trustAsHtml(app.localize('jobEstimationAr'));
            vm.jobTextEng = sce.trustAsHtml(app.localize('jobTextEng'));
            vm.jobTextAr = sce.trustAsHtml(app.localize('jobTextAr'));
            vm.showLastJobDetailOnJobPrint = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowLastJobDetailOnJobPrint"));
            vm.loading = false;
            var jobChargeType = {
                item: 1,
                labour: 2,
                misc: 3
            }
            //if pop-up print
            if ($scope.$parent != null) {
                if (!isNaN($scope.$parent.vmMain.jobId))
                    jobId = $scope.$parent.vmMain.jobId;
            }

            //if through url print
            if (jobId == 0 && !isNaN($stateParams.query)) {
                jobId = $stateParams.query;
            }



            vm.currencyAndRounding = function (value) {
                if (value == null) return null;

                return value.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

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
            vm.getCreatedUserName = function (userId) {
                commonLookupService.getUser({
                    id: userId
                }).success(function (result) {
                    vm.createduserName = result.name + ' ' + result.surname;
                });
            };

            vm.getDate = function (date) {
                var localTime = moment.utc(date).toDate();
                return moment(localTime).format(vm.dateFormat);
            };

            function init() {
                vm.loading = true;
                jobAppService.getJobForPrint({ id: jobId })
                    .success(function (result) {
                        vm.job = result;
                        vm.getCreatedUserName(vm.job.creatorUserId);
                        vm.job.jobDetail.forEach(function (row) {
                            var charges = [];
                            if (row.charges.some(e => e.type == 1)) // 1 item
                                charges.push(...row.charges.filter(e => e.type == jobChargeType.item).map(m => m));
                            if (row.charges.some(e => e.type == 2)) // 2 labour
                                charges.push(...row.charges.filter(e => e.type == jobChargeType.labour).map(m => m));
                            if (row.charges.some(e => e.type == 3)) // 3 Misc
                                charges.push(...row.charges.filter(e => e.type == jobChargeType.misc).map(m => m));
                            row.charges = charges;
                        });
                        if (vm.showLastJobDetailOnJobPrint) {
                            jobAppService.getLastJobDetailForPrint({ id: jobId })
                                .success(function (lastJob) {
                                    vm.lastjob = lastJob;
                                });
                        }
                    }).finally(function () {
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
                else if (jobType === 17) {
                    return app.localize("CarWash");
                }
                else if (jobType === 16) {
                    return app.localize("Others");
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

            init();
        }
    ]);
