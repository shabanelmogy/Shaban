// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:191064-191205
appModule.controller('tenant.views.crs.crm.marketing.leads.createLeadLogModal',
        [
            '$scope', '$uibModal', '$uibModalInstance', 'lead','logs', 'abp.services.app.cRMLead',
            function ($scope, $uibModal, $uibModalInstance, lead, logs, leadService) {
                var vm = this;
                vm.lead = lead;
                vm.logs = logs;

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

                if (vm.logs != null) {
                    vm.leadLog = {
                        stage: vm.logs.stage,
                        leadStatus: vm.logs.leadStatus,
                        notes: vm.logs.notes,
                        nextFollowupDate: vm.logs.nextFollowupDate,
                        LogId:vm.logs.id
                    };
                }
                else
                {
                    vm.leadLog = { stage: lead.stage, leadStatus: lead.status };
                }


                vm.stages = [
                    //{ id: 1, name: 'Prospect' },
                    { id: 2, name: 'Lead' },
                    { id: 3, name: 'Deal' }];

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
                function getStatuses() {
                    var stage = vm.leadLog.stage;
                    if (stage === 0 || stage === null || stage == undefined) {
                        vm.statuses = vm.allStatuses.filter(f => f.id < 10);//old data
                    }
                    else if (stage === 1) {
                        vm.statuses = vm.allStatuses.filter(f => f.id >= 10 && f.id < 20);//prospect
                    }
                    else if (stage === 2) {
                        vm.statuses = vm.allStatuses.filter(f => f.id >= 20 && f.id < 30);//Lead
                    }
                    else if (stage === 3) {
                        vm.statuses = vm.allStatuses.filter(f => f.id >= 30 && f.id < 40);//Deal
                    }
                }

                vm.cancel = function () {
                    $uibModalInstance.dismiss();
                };

                vm.stageChange = function()
                {
                    getStatuses();
                }
                vm.save = function () {
                    vm.saving = true;
                    vm.leadLog.cRMLeadId = vm.lead.id;
                    vm.leadLog.nextFollowupDate = moment(vm.leadLog.nextFollowupDate).startOf('day').utc();
                    leadService.createCRMLeadLog(vm.leadLog).success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        lead.stage = vm.leadLog.stage;
                        lead.status = vm.leadLog.leadStatus;
                        $uibModalInstance.close(lead);
                        
                    }).finally(function () {
                        vm.saving = false;
                    });
                };

                vm.cancel = function () {
                    $uibModalInstance.close(lead);
                };
                getStatuses();
            }
        ]);
