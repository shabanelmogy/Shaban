// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:65337-65496
appModule.controller('host.views.crm.marketingAndSalesTraffic.inquiryLog', [
        '$scope', '$uibModal', '$uibModalInstance','inquiryId', 'abp.services.app.inquiry',
        function ($scope, $uibModal, $uibModalInstance, inquiryId, inquiryService) {

            var vm = this;
            vm.inquiryId = inquiryId;
            //var loadLeads = false;

            function getleadLogs() {
                vm.loading = true;
                inquiryService.getInquiryLogs({ id: inquiryId }).success(function (result) {
                    vm.inquiryLog = result.items;
                }).finally(function () {
                    vm.loading = false;
                });
            }
             
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

            vm.addInquiryLog = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/crm/marketingAndSalesTraffic/createInquiryLogModal.cshtml',
                    controller: 'host.views.crm.marketingAndSalesTraffic.createInquiryLogModal as vm',
                    backdrop: 'static',
                    resolve: {
                        inquiryId: function () {
                            return vm.inquiryId;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.lead = result;
                    getleadLogs();
                });
            };

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

            //vm.addLeadLog = function () {
            //    var modalInstance = $uibModal.open({
            //        templateUrl: '~/App/host/views/marketing/leads/createLeadLogModal.cshtml',
            //        controller: 'host.views.marketing.leads.createLeadLogModal as vm',
            //        backdrop: 'static',
            //        resolve: {
            //            lead: function () {
            //                loadLeads = true;
            //                return vm.lead;
            //            },
            //            logs: function () {
            //                return null;
            //            }
            //        }
            //    });

            //    modalInstance.result.then(function (result) {
            //        vm.lead = result;
            //        getleadLogs();
            //    });
            //};

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                getleadLogs();
            }
            init();
        }
    ]);
