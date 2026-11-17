// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:170149-170263
appModule.controller('tenant.views.crs.billing.index',
        ['$scope', 'abp.services.app.billing', 'abp.services.app.customerCareTenant', '$uibModal',
            function ($scope, billingService, customerCareTenantService, $uibModal) {

                var vm = this;
                vm.loading = false;
                vm.openInvoicesTotalAmount = 0;
                vm.outstandingInvoices = [];
                vm.filters = {
                    invoiceType: null
                };
                vm.filteredOutstandingInvoices = function () {
                    vm.outstandingInvoices = vm.openInvoices;
                    if (vm.invoiceType==1)
                        vm.outstandingInvoices = vm.openInvoices.filter(f => f.subscriptionId>0);
                    else if (vm.invoiceType == 2)
                        vm.outstandingInvoices = vm.openInvoices.filter(f => f.changeRequestId>0);
                    else if (vm.invoiceType == 3)
                        vm.outstandingInvoices = vm.openInvoices.filter(f => f.projectId>0);
                    vm.openInvoicesTotalAmount = 0;
                    vm.outstandingInvoices.forEach(e => {
                        vm.openInvoicesTotalAmount += e.totalAmount;
                    });
                };
                
                vm.getOpenInvoices = function () {
                    vm.loading = true;
                    customerCareTenantService.openInvoices(vm.filters).success(function (result) {
                        vm.openInvoices = result;
                        vm.outstandingInvoices = vm.openInvoices;
                        if (vm.invoiceType == 1)
                            vm.outstandingInvoices = vm.openInvoices.filter(f => f.subscriptionId > 0);
                        else if (vm.invoiceType == 2)
                            vm.outstandingInvoices = vm.openInvoices.filter(f => f.changeRequestId > 0);
                        else if (vm.invoiceType == 3)
                            vm.outstandingInvoices = vm.openInvoices.filter(f => f.projectId > 0);
                        vm.openInvoicesTotalAmount = 0;
                        vm.outstandingInvoices.forEach(e => {
                            vm.openInvoicesTotalAmount += e.totalAmount;
                        });
                    }).finally(function () {
                        vm.loading = false;
                    });
                };

                vm.invoiceTypes = [
                    { id: 1, name: "Subscription" },
                    { id: 2, name: "Change Request" },
                    { id: 3, name: "Project" }
                ];

                vm.getCloseInvoices = function () {
                    vm.loading = true;
                    customerCareTenantService.closeInvoices().success(function (result) {
                        vm.closeInvoices = result;
                        
                    }).finally(function () {
                        vm.loading = false;
                    });
                };

                vm.print = function (row) {

                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/crs/billing/invoicePrintTemplate.cshtml',
                        controller: 'tenant.views.crs.billing.invoicePrintTemplate as vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            filters: function () {
                                return row.id;
                            }
                        }
                    });

                    modalInstance.result.then(function (result) {
                        init();
                    });
                };

                vm.invoiceStatus = function (code) {
                    if (code === 1)
                        return "Open";
                    else if (code === 2)
                        return "Cleared";
                    else
                        return "None";
                    
                };

                vm.paymentDetail = function (row) {

                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/crs/billing/paymentDetailModal.cshtml',
                        controller: 'tenant.views.crs.billing.paymentDetailModal as vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            voucherId: function () {
                                return row.id;
                            },
                            invoiceDetail: function () {
                                    return row.voucherNo;
                            },
                        }
                    });
                };

                function init() {
                    vm.getOpenInvoices();
                    vm.getCloseInvoices();
                }
                init();
            }
        ]);
