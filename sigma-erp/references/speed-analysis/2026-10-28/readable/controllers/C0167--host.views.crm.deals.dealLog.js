// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:63449-63630
appModule.controller('host.views.crm.deals.dealLog', [
        '$scope', '$uibModal', '$uibModalInstance', 'deal', 'abp.services.app.deal', 'uiGridConstants', 'abp.services.app.lead',
        function ($scope, $uibModal, $uibModalInstance, deal, dealService, uiGridConstants, leadService) {
            var vm = this;
            vm.saving = false;
            var loadDeals = false;
            vm.canReopenClosedDeal= abp.auth.hasPermission('Pages.CRM.ReopenClosedDeal');

            vm.filters = {
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                //    contactId: contactId
            };
            vm.deal = deal;
            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('MMMM Do YYYY, h: mm: ss a');
                }
                else {
                    return "";
                }
            };
            vm.getlocalDate2 = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('MMMM Do YYYY');
                }
                else {
                    return "";
                }
            };
            vm.viewTenantActivity = function () {
                openTenantActivityModal();
            };
            //vm.getDealStages = function (stages) {
            //    if (stages === 1)
            //        return 'New';
            //    else if (stages === 2)
            //        return 'Average';
            //    else if (stages === 3)
            //        return 'Hot';
            //    else if (stages === 4)
            //        return 'Final';
            //    else
            //        return '';
            //};
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
            function getTenantInfo() {
                if (vm.deal.linkedTenant) {
                    return vm.getTenantInfo= vm.deal.linkedTenant.name + ' (' + vm.deal.linkedTenant.tenancyName + ')';
                }
                return null;
            };

            function openTenantActivityModal() { 
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/crm/deals/tenantActivityModal.cshtml',
                    controller: 'host.views.crm.tenants.tenantActivityModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        tenantId: function () {
                            return vm.deal.linkedTenantId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getDeals();
                });
            }

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
            function openCreateDealLogModal() {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/marketing/leads/createLeadLogModal.cshtml',
                    controller: 'host.views.marketing.leads.createLeadLogModal as vm',
                    backdrop: 'static',
                    resolve: {
                        lead: function () {
                            return vm.deal;
                        },
                        logs: function () {
                            return vm.dealLogs[0];
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    loadDeals = true;
                    getDealLogs();
                });
            }
            vm.addDealLog = function () {
                openCreateDealLogModal(null);
            };
            vm.cancel = function () {
                if (loadDeals)
                    $uibModalInstance.close();
                else
                    $uibModalInstance.dismiss();
            };
            function getDealLogs() {
                vm.loading = true;
                leadService.getLeadLogs({ id: vm.deal.id }).success(function (result) {
                    vm.dealLogs = result.items;
                }).finally(function () {
                    vm.loading = false;
                });
            }
            function init() {
                getDealLogs();
                getTenantInfo();
            }
            init();
        }
    ]);
