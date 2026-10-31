// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:87907-88122
appModule.controller('tenant.views.common.customization.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.customization','abp.services.app.customerCareTenant', 'appSession',
        function ($scope, $uibModal, uiGridConstants, customizationService, customerCareTenantService, appSession) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;

            vm.getStatus = function (id) {
                if (id == 1)
                    return app.localize("New");
                else if (id == 2)
                    return app.localize("Closed");
                else if (id == 3)
                    return app.localize("Cancelled");
                else if (id == 4)
                    return app.localize("OnHold");
                else if (id == 5)
                    return "Estimation Pending";
                else if (id == 6)
                    return "Estimated, Customer Confirmation Pending";
                else if (id == 7)
                    return "Customer Confirmed, Finance Approval Pending";
                else if (id == 8)
                    return "Finance Approved";
                else if (id == 9)
                    return "In-Progress";
                else if (id == 10)
                    return "Scope Sent";
                else if (id == 11)
                    return "Scope Approved";
                else if (id == 12)
                    return "Quotation Sent";
                else if (id == 13)
                    return "Quotation Approved";
                else if (id == 14)
                    return "On Approval";
                else if (id == 15)
                    return "Delivered";
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
                customerCareTenantService.getOpenCustomizations().success(function (data) {
                    vm.openSupportRequests = data.items;
                }).finally(function () {
                    vm.loading = false;
                });

                customerCareTenantService.getRecentClosedCustomization().success(function (data) {
                    vm.closedSupportRequests = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };
            vm.viewChangeRequest = function (id) {
                viewChangeRequestModal(id);
            };
            function viewChangeRequestModal(id) {
                debugger
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/customization/viewChangeRequestModal.cshtml',
                    controller: 'tenant.views.common.customization.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'xl',
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
            vm.openCustomizationConfirmModal = function (row) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/customization/confirmCustomizationModal.cshtml',
                    controller: 'tenant.views.customization.confirmCustomizationModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        customization: function () {
                            return row;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getSupportRequests();
                });
            }




            vm.exportToExcel = function () {
                var tab_text = "<h1>Open Customizations</h1>"
                tab_text = tab_text + "<table border='1px'><tr>";
                var tab1 = document.getElementById('openCustomizations'); // id of table 
                var tab2 = document.getElementById('closedCustomizations'); // id of table 
                for (j = 0 ; j < tab1.rows.length ; j++) {
                    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";
                tab_text = tab_text + "<br/>";
                tab_text = tab_text + "<h1>Closed Customization</h1>";
                tab_text = tab_text + "<table border='1px'><tr>";
                for (j = 0 ; j < tab2.rows.length ; j++) {
                    tab_text = tab_text;
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



            vm.openCustomizationLogModal = function (row) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/customization/createOrShowCustomizationLogsModal.cshtml',
                    controller: 'tenant.views.customization.createOrShowCustomizationLogsModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        customization: function () {
                            return row;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getSupportRequests();
                });
            }

            function openCreateOrEditCustomizationModal(id) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/customization/createOrEditModal.cshtml',
                    controller: 'tenant.views.common.customization.createOrEditModal as vm',
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


            vm.createCustomization = function () {
                openCreateOrEditCustomizationModal(null);
            };

            vm.editSupportRequest = function (supportRequest) {

                openCreateOrEditCustomizationModal(supportRequest.id);
            };

            vm.getSupportRequests();

        }
    ]);
