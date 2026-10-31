// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:114360-114529
appModule.controller('tenant.views.common.supportRequests.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.customerCareTenant', 'abp.services.app.supportRequest', 'appSession', 'utilities',
        function ($scope, $uibModal, uiGridConstants, customerCareTenantService, supportRequestService, appSession,utilities) {

            var vm = this;
            vm.multilineStringToHTMLWordBreak = (s) => utilities.multilineStringToHTMLWordBreak(s);


            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            
            //vm.filters = {
            //    code: '',
            //    name: '',
            //    skipCount: 0,
            //    maxResultCount: app.consts.grid.defaultPageSize,
            //};
            
            ////not being used as of now
            //vm.permissions = {
            //    view: abp.auth.hasPermission('Pages.Tenant.SupportRequests'),
            //    create: abp.auth.hasPermission('Pages.Tenant.SupportRequests.Addnew'),
            //    edit: abp.auth.hasPermission('Pages.Tenant.SupportRequests.Edit'),
            //    'delete': abp.auth.hasPermission('Pages.Tenant.SupportRequests.Delete'),
            //    allActionsOnOtherBranch: abp.auth.hasPermission('Pages.Tenant.Customers.AllActionsOnOtherBranchCustomers'),
            //};

            vm.getStatus = function (id) {
                if (id == 1)
                    return app.localize("Open");
                else if (id == 2)
                    return app.localize("Closed");
                else return '';
            };

            vm.getPriority = function (priority) {
                if (priority == 3)
                    return app.localize("High");
                else
                    return "";
            };
            
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };
            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('DD-MMM-YY');
                }
                else {
                    return "";
                }
            };
            vm.getSupportRequests = function () {
                vm.loading = true;
                customerCareTenantService.getOpenSupportRequests().success(function (data) {
                    debugger
                    vm.openSupportRequests = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
                
                customerCareTenantService.getClosedSupportRequests(vm.filters).success(function (data) {
                    vm.closedSupportRequests = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function openCreateOrEditSupportRequestModal(id) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/supportRequests/createOrEditModal.cshtml',
                    controller: 'tenant.views.common.supportRequests.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        supportRequestId: function () {
                            return id;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getSupportRequests();
                });
            }



            vm.exportToExcel = function () {
                var tab_text = "<h1>Open Requests</h1>"
                tab_text = tab_text + "<table border='1px'><tr>";
                var tab1 = document.getElementById('openRequests'); // id of first table 
                var tab2 = document.getElementById('closedRequests'); // id of second table 

                for (j = 0 ; j < tab1.rows.length ; j++) {
                    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";
                tab_text = tab_text + "<br/>";
                tab_text = tab_text + "<h1>Closed Requests</h1>";
                tab_text = tab_text + "<table border='1px'><tr>";
                for (j = 0 ; j < tab2.rows.length ; j++) {
                    tab_text = tab_text + tab2.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";
                tab_text = tab_text + "<br/>";
                var ua = window.navigator.userAgent;
                var msie = ua.indexOf("MSIE ");
                if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
                {
                    txtArea1.document.open("txt/html", "replace");
                    txtArea1.document.write('sep=,\r\n' + tab_text);
                    txtArea1.document.close();
                    txtArea1.focus();
                    sa = txtArea1.document.execCommand("SaveAs", true, "report.xls");
                }
                else {
                    sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));
                }
                return (sa);
            }



            vm.openRequestLogModal = function (row) {
                
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/supportRequests/createOrShowRequestLogsModal.cshtml',
                    controller: 'tenant.views.support.supportRequests.createOrShowRequestLogsModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        supportRequest: function () {
                            return row;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getSupportRequests();
                });
            }

            vm.createSupportRequest = function () {
                openCreateOrEditSupportRequestModal(null);
            };

            vm.editSupportRequest = function (supportRequest) {
                   
                openCreateOrEditSupportRequestModal(supportRequest.id);
            };

            vm.getSupportRequests();

        }
    ]);
