// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:51518-51741
appModule.controller('host.views.cbs.subscriptionInvoices.projectMilestonesModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.subscriptionInvoices', 'abp.services.app.tenant', 'utilities', 'abp.services.app.businessDivision',
        function ($scope, $uibModal, $uibModalInstance, subscriptionInvoicesService, tenantAppService, utilities, businessDivisionService) {

            var vm = this;
            vm.all = false;
            vm.genBtn = true;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            

            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));

            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc(),
            };

            vm.filters = {
                tenantId: null,
                fromDate: null,
                toDate: null,
                projectNo: null
                
            };

            vm.permissions = {
                edit: abp.auth.hasPermission('Pages.CBS.Projects.Milestones.Edit'),
                status: abp.auth.hasPermission('Pages.CBS.Projects.Milestones.Status'),
                invoiceStatus: abp.auth.hasPermission('Pages.CBS.Projects.Milestones.InvoiceStatus'),
                paymentStatus: abp.auth.hasPermission('Pages.CBS.Projects.Milestones.PaymentStatus')
            };

            vm.updateStatus = function (row) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/customization/milestoneStatusModal.cshtml',
                    controller: 'host.views.customization.milestoneStatusModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        milestone: function () {
                            return row;
                        },
                        workspaceId: null
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getProjectsMilestones();
                });
            }
            vm.updateInvoiceStatus = function (row) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/customization/milestoneInvoiceStatusModal.cshtml',
                    controller: 'host.views.customization.milestoneInvoiceStatusModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        milestone: function () {
                            return row;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getProjectsMilestones();
                });
            }
            vm.updatePaymentStatus = function (row) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/customization/milestonePaymentStatusModal.cshtml',
                    controller: 'host.views.customization.milestonePaymentStatusModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        milestone: function () {
                            return row;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getProjectsMilestones();
                });
            }
            vm.generateInvoice = function (row) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/projectsDashboard/generateInvoiceModal.cshtml',
                    controller: 'host.views.cbs.projectsDashboard.generateInvoiceModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        milestone: function () {
                            return row;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    row.invoiceNo = result.invoiceNo;
                    row.amount = result.amount;
                    row.invoiceStatus = 2;
                });
            }

            vm.dateRangeCheck = function () {

                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format(abp.setting.get("App.General.DateFormat"))).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format(abp.setting.get("App.General.DateFormat"))).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                else {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
            };

            vm.dateRangeModelChange = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };

            

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var dateObject = new Date(date);
                    return dateObject.toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
                }
                else {
                    return "";
                }
            };

            vm.searchTenants = function ($select) {
                if ($select.search == "")
                    return null;
                tenantAppService.searchTenants({ filter: $select.search }).then(function (response) {
                    vm.tenants = response.data.items;
                });
            };

            
            vm.getProjectsMilestones= function () {
                vm.loading = true;
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                else {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }

                subscriptionInvoicesService.getProjectsMilestones(vm.filters)
                    .success(function (result) {

                        if (result != null) {

                            vm.milestones = result;
                        }
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            
            vm.getMilestoneStatus = function (id) {
                if (id == 1) {
                    return "Open";
                }
                else if (id == 2) {
                    return "Complete";
                }
                else if (id == 3) {
                    return "Delivered";
                }

            }
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('DD-MMM-YY');
                }
                else {
                    return "";
                }
            };

            vm.getPaymentMilestoneStatus = function (id) {
                if (id == 1) {
                    return "Pending";
                }
                else if (id == 2) {
                    return "Received";
                }

            }

            vm.getInvoiceStatus = function (id) {
                if (id == 1) {
                    return "Not-Invoiced";
                }
                else if (id == 2) {
                    return "Invoiced";
                }

            }
            //vm.getbusinessDivisions();
            //vm.getInvoicesDueToGenerate();
            //vm.getProjectsMilestones();
        }
    ]);
