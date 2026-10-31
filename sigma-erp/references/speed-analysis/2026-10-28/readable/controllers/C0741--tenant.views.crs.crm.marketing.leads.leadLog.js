// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:192500-192658
appModule.controller('tenant.views.crs.crm.marketing.leads.leadLog', [
        '$scope', '$uibModal', '$uibModalInstance', 'lead', 'abp.services.app.cRMLead',
        function ($scope, $uibModal, $uibModalInstance, lead, leadService) {

            var vm = this;
            vm.lead = lead;
            var loadLeads = false;

            function getleadLogs() {
                vm.loading = true;
                leadService.getCRMLeadLogs({ id: vm.lead.id }).success(function (result) {
                    vm.leadLogs = result.items;
                }).finally(function () {
                    vm.loading = false;
                });
            }
            vm.getStageName = function (stage) {
                console.log("stage");
                console.log(stage);

                if (stage === 1) {
                    return 'Prospect';
                }
                else if (stage === 2) {
                    return 'Lead';
                }
                else if (stage === 3) {
                    return 'Deal';
                }
                else if (stage === 4) {
                    return 'Inquiry';
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
                    return "Dull";
                }
                else if (id === 22) {
                    return "Rejected";
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
                else if (id === 40) {
                    return "New";
                }
                else if (id === 41) {
                    return "Processed";
                }
            };


            //vm.getLeadStatuses = function (status) {
            //    if (status == 1)
            //        return 'Due';
            //    else if (status == 2)
            //        return 'Processed';
            //    else if (status == 3)
            //        return 'Converted';
            //    else if (status == 4)
            //        return 'Not Suitable';
            //};

            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('DD-MMM-YY HH:mm');
                }
                else {
                    return "";
                }
            };
            vm.getlocalDate2 = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('DD-MMM-YY');
                }
                else {
                    return "";
                }
            };

            vm.addLeadLog = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/crm/marketing/leads/createLeadLogModal.cshtml',
                    controller: 'tenant.views.crs.crm.marketing.leads.createLeadLogModal as vm',
                    backdrop: 'static',
                    resolve: {
                        lead: function () {
                            loadLeads = true;
                            return vm.lead;
                        },
                        logs: function () {
                            return null;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.lead = result;
                    getleadLogs();
                });
            };

            vm.cancel = function () {
                if (loadLeads)
                    $uibModalInstance.close();
                else
                    $uibModalInstance.dismiss();
            };

            function init() {
                getleadLogs();
            }
            init();
        }
    ]);
