// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:77513-77787
appModule.controller('host.views.reports.milestone.index', [
        '$scope', '$uibModal','abp.services.app.milestone', 'utilities', 'abp.services.app.currency', 'abp.services.app.businessDivision', 'abp.services.app.tenant',
        function ($scope, $uibModal, milestoneService, utilities, currencyService, businessDivisionService, tenantAppService) {
            var vm = this;

           
            vm.loading = false;
            vm.report = [];
            

            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));

            vm.businessName = utilities.divisionName();

            vm.filters = {
                business: null,
                fromDate: null,
                toDate: null,
                enableDateRange: false,
                paymentStatus: null,
                invoiceStatus: null,
                invoiceType: null,
                CurrencyId: 0,
                dateType:1
            };

            vm.permissions = {
                prStatus: abp.auth.hasPermission('Pages.CBS.Projects.Milestones.Status'),
                prInvoiceStatus: abp.auth.hasPermission('Pages.CBS.Projects.Milestones.InvoiceStatus'),
                prPaymentStatus: abp.auth.hasPermission('Pages.CBS.Projects.Milestones.PaymentStatus'),
                crStatus: abp.auth.hasPermission('Pages.CBS.ChangeRequests.Milestones.Status'),
                crInvoiceStatus: abp.auth.hasPermission('Pages.CBS.ChangeRequests.Milestones.InvoiceStatus'),
                crPaymentStatus: abp.auth.hasPermission('Pages.CBS.ChangeRequests.Milestones.PaymentStatus')

            };


            vm.getbusinessDivisions = function () {
                vm.loading = true;
                businessDivisionService.getBusinessDivisions().success(function (data) {
                    vm.businessDivisions = data.items
                }).finally(function () {
                    vm.loading = false;
                });
            }
            vm.filters.selectedStatuses = [];
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

            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc(),
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
                    vm.milestoneReport();
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
                    vm.milestoneReport();
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
                    vm.milestoneReport();
                });
            }
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getlocalDateTime = function (date) {
                
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('DD-MMM-YY');
                }
                else {
                    return "";
                }
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
            vm.getInvoiceStatus = function (id) {
                if (id == 1) {
                    return "Not-Invoiced";
                }
                else if (id == 2) {
                    return "Invoiced";
                }

            }
            vm.getPaymentStatus = function (id) {
                if (id == 1) {
                    return "Pending";
                }
                else if (id == 2) {
                    return "Received";
                }

            }
            vm.statuses = [
                { id: 1, name: "Open" },
                { id: 3, name: "Delivered" },
                { id: 2, name: "Complete" }
            ];
            vm.searchTenants = function ($select) {
                if ($select.search == "")
                    return null;
                tenantAppService.searchTenants({ filter: $select.search }).then(function (response) {
                    vm.tenants = response.data.items;
                });
            };

            vm.invoiceStatuses = [
                { id: 1, name: "Not-Invoiced" },
                { id: 2, name: "Invoiced" }
            ];

            vm.paymentStatuses = [
                { id: 1, name: "Pending" },
                { id: 2, name: "Received" }
            ];

            vm.invoiceTypes = [
                { id: 2, name: "Change Request" },
                { id: 3, name: "Project" }
            ];

            vm.getBusinessName = function (id) {
                if (id == 1) {
                    return "Karzansoft (UAE)";
                }
                else if (id == 2) {
                    return "D3 (USA)";
                }
                else if (id == 3) {
                    return "D1 (UAE)";
                }
                else if (id == 4) {
                    return "D2 (UK)";
                }
            }

            vm.milestoneReport = function () {
                vm.loading = true;
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                else {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
                milestoneService.getMilestoneReport(vm.filters).success(function (result) {
                    vm.report = result;
                    //var groupedData = vm.report.reduce(function (acc, report) {
                    //    if (report.supportRequest.customCurrency != null) {

                    //        var currencyCode = report.supportRequest.customCurrency.code;
                    //        if (!acc[currencyCode]) {
                    //            acc[currencyCode] = { currencyCode: currencyCode, totalAmount: 0 };
                    //        }
                    //        acc[currencyCode].totalAmount += ((report.amount * report.supportRequest.vatPercent / 100) + report.amount);
                    //        return acc;
                    //    }
                    //    return acc;
                    //}, {});

                    //vm.groupAmount = Object.values(groupedData);
                    vm.loading = false;

                });
            }

            vm.exportToExcel = function () {
                vm.loading = true;
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                else {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
                milestoneService.exportToExcel(vm.filters).success(function (result) {
                    app.downloadTempFile(result);
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.getCurrenciesList = function () {
                vm.loading = true;
                currencyService.getCurrencies().success(function (data) {
                    vm.currencies = data.items
                }).finally(function () {
                    vm.loading = false;
                });
            }
            vm.getbusinessDivisions();
            vm.getCurrenciesList();
            vm.milestoneReport();
        }
    ]);
