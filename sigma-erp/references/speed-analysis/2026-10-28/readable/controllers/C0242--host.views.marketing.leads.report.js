// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:75365-75713
appModule.controller('host.views.marketing.leads.report', [
        '$scope', 'abp.services.app.lead', 'utilities', 'abp.services.app.user',
        function ($scope, leadService, utilities, userService) {

            var vm = this;
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.filters = null;

            if ($scope.$parent !== null) {
                if ($scope.$parent.vmMain !== null)
                    vm.filters = $scope.$parent.vmMain.filters;
            }

            

            vm.allStatuses = [{ id: 1, name: 'Due' },
            { id: 2, name: 'Processed' },
            { id: 3, name: 'Converted' },
            { id: 4, name: 'Not Suitable' },
            { id: 10, name: 'New' },
            { id: 11, name: 'Suitable' },
            { id: 12, name: 'Not Suitable' },
            { id: 20, name: 'New' },
            { id: 21, name: 'Dull' },
            { id: 22, name: 'Rejected' },
            { id: 23, name: 'Not Suitable' },
            //{ id: 30, name: 'New' },
            { id: 31, name: 'Active' },
            { id: 32, name: 'Hot' },
            { id: 33, name: 'Final' },
            { id: 34, name: 'Closed' }];
            vm.statuses = [];

            vm.stages = [{ id: 1, name: 'Prospect' },
            { id: 2, name: 'Lead' },
            { id: 3, name: 'Deal' }];

            function getStatuses(row) {
                var stage = row.stage;

                if (stage === 0 || stage === null || stage === undefined) {
                    row.statuses = null;
                }
                else if (stage === 1) {
                    row.statuses = vm.allStatuses.filter(f => f.id >= 10 && f.id < 20);//prospect
                }
                else if (stage === 2) {
                    row.statuses = vm.allStatuses.filter(f => f.id >= 20 && f.id < 30);//Lead
                }
                else if (stage === 3) {
                    row.statuses = vm.allStatuses.filter(f => f.id >= 30 && f.id < 40);//Deal
                }
            }
            vm.stageChange = function (row) {
                getStatuses(row);
            };

            vm.totalValueChange = function (row) {
                row.totalValue = (parseFloat(vm.calculatedValue(row)) * 12) + parseFloat(row.setupCharges);
            };

            vm.calculatedValue = function (row) {
                if (row.subscriptionType == 2) {
                    return row.subscriptionCharges;
                }
                else {
                    return 0;
                }
            };

            if (vm.filters === null)
                vm.filters = $stateParams.filters;

            vm.getStageName = function (stage) {
                if (stage === 1) {
                    return 'Prospect';
                }
                else if (stage === 2) {
                    return 'Lead';
                }
                else if (stage === 3) {
                    return 'Deal';
                }
                else {
                    return '';
                }
            };
            vm.getStageNameForGroupBy = function (stage) {
                if (stage === 3) {
                    return 'Deals';
                }
                else if (stage === 2) {
                    return 'Leads';
                }
                else if (stage === 1) {
                    return 'Prospects';
                }
                else {
                    return '';
                }
            };
            vm.getStatusName = function (id) {
                if (id === 1) {
                    return "Due";
                }
                else if (id === 2) {
                    return "Processed";
                }
                else if (id === 3) {
                    return "Converted";
                }
                else if (id === 4) {
                    return "Not Suitable";
                }
                else if (id === 10) {
                    return "New";
                }
                else if (id === 11) {
                    return "Suitable";
                }
                else if (id === 12) {
                    return "Not Suitable";
                }
                else if (id === 20) {
                    return "New";
                }
                else if (id === 21) {
                    return "Dull Deal";
                }
                else if (id === 22) {
                    return "Rejected Sale";
                }
                else if (id === 23) {
                    return "Not Suitable";
                }
                else if (id === 30) {
                    return "New";
                }
                else if (id === 31) {
                    return "Active";
                }
                else if (id === 32) {
                    return "Hot";
                }
                else if (id === 33) {
                    return "Final";
                }
                else if (id === 34) {
                    return "Closed";
                }

            };
            vm.getVerifyStatusesName = function (value) {
                if (value == false) {
                    return "No";
                }
                else if (value == true) {
                    return "Yes";
                } else {
                    return null;
                }
            };

            vm.rowSaved = function (row, list) {
                
                if (row.salesPersonUser)
                    row.salesPersonUserId = row.salesPersonUser.id;
                const input = {
                    lead: row
                };
                leadService.updateLeadInline(input).success(function (result) {
                    if (row.status != 0 && list != undefined) {
                        var index = list.statusList.findIndex(function (obj) {
                            return obj.id === row.id;
                        });

                        // If the object is found, remove it from the array
                        if (index !== -1) {
                            list.statusList.splice(index, 1);
                        }
                        var specificStage =vm.leads.find(function (obj) {
                            return obj.stage === row.stage;
                        });
                        if (specificStage == undefined) {
                            vm.leads.push({ stage: row.stage, stageList: [{ status: row.status, statusList: [row], totalSetupCharges: row.setupCharges, totalSubscriptionCharges: row.subscriptionCharges, subscriptionType: row.subscriptionType }]});
                        }
                        else {

                            var specificStatus = specificStage.stageList.find(function (obj) {
                                return obj.status === row.status;
                            });
                            if (specificStatus == undefined) {
                                specificStage.stageList.push({ status: row.status, statusList: [row], totalSetupCharges: row.setupCharges, totalSubscriptionCharges: row.subscriptionCharges, subscriptionType: row.subscriptionType });
                            }
                            else {

                                specificStatus.statusList.push(row);
                                vm.totalSetupPerStatusValue(specificStatus);
                                vm.totalSubscriptionPerStatusValue(specificStatus);
                            }
                        }
                        vm.totalSetupPerStatusValue(list);
                        vm.totalSubscriptionPerStatusValue(list);
                        row.isEnabledStatus = false;
                    }

                });
            };

            vm.saveAssigned = function (task) {
                clearInterval(myInterval);
                    task.salesPerson = task.salesPersonUser.name;
                    task.isEnabled = false;
                vm.rowSaved(task);
                    
            };

            var myInterval = null;

            var tempRow = {};
            vm.assignUser = function (task) {

                task.isEnabled = true;
                setTimeout(function () {
                    $("#uiSelect_" + task.id + " span")[0].click();
                    tempRow = task;
                }, 100);
                    myInterval = setInterval(vm.focsOut,1);
            }

            vm.focsOut = function () {
                // Focus logic here
                $("#uiSelect_" + tempRow.id ).focusout(function () {
                    clearInterval(myInterval);
                    setTimeout(function () {
                        tempRow.isEnabled = false;
                    }, 225);

                });
            };

            vm.focusStage = function (task) {

                setTimeout(function () {
                    $("#uiSelectStage_" + task.id).focus().click();
                }, 100);
            }

            vm.focusStatus = function (task) {

                setTimeout(function () {
                    $("#uiSelectStatus_" + task.id).focus().click();
                }, 100);
            }
           



            
            

            vm.getLeadForReport = function () {
                vm.loading = true;
                leadService.getLeadsForReport(vm.filters).success(function (result) {
                    vm.leads = result;
                    
                }).finally(function () {
                    vm.loading = false;
                });
            };
           
            vm.totalPerStatusValue = function (List) {
                var totalPerStatusValue = 0;
                for (var i in List) {
                    totalPerStatusValue += List[i].totalValue;
                    }
                return totalPerStatusValue;
            }

            vm.totalSetupPerStatusValue = function (List) {
                var totalSetupPerStatusValue = 0;
                for (var i in List.statusList) {
                        totalSetupPerStatusValue += parseFloat(List.statusList[i].setupCharges);
                }
                List.totalSetupCharges = parseFloat(totalSetupPerStatusValue);
                //$scope.$apply();
            }

            vm.totalSubscriptionPerStatusValue = function (List) {
                var totalSubscriptionPerStatusValue = 0;
                for (var i in List.statusList) {
                    totalSubscriptionPerStatusValue += parseFloat(List.statusList[i].subscriptionCharges);
                }
                List.totalSubscriptionCharges = parseFloat(totalSubscriptionPerStatusValue);
            }

            vm.totalStatusCount = function (List) {
                var totalCount = 0;
                for (var i in List) {
                    totalCount += List[i].statusList.length;
                }
                return totalCount;
            }

            vm.totalSetupCharges = function (List) {
                var totalSetupCharges = 0;
                for (var i in List) {
                    totalSetupCharges += List[i].totalSetupCharges;
                }
                return totalSetupCharges;
            }

            vm.totalSubscriptionCharges = function (List) {
                var totalSubscriptionCharges = 0;
                for (var i in List) {
                    totalSubscriptionCharges += List[i].totalSubscriptionCharges;
                }
                return totalSubscriptionCharges;
            }


            vm.searchUsers = function ($select) {
                if ($select.search == "")
                    return null;
                userService.searchUsers({ keyword: $select.search }).then(function (response) {
                    vm.users = response.data.items;
                });
            };

            vm.totalValue = function (List) {
                var totalValue = 0;
                for (var i in List) {
                    for (var j in List[i].statusList) {
                        totalValue += List[i].statusList[j].totalValue;
                    }
                }
                return totalValue;
            }
          
            function init() {
                vm.getLeadForReport();
            }
            init();
        }
    ]);
