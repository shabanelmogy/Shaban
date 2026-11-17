// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:76300-76534
appModule.controller('host.views.reports.crs.index', [
        '$scope', '$uibModal','utilities', 'abp.services.app.currency', 'abp.services.app.businessDivision', 'abp.services.app.tenant', 'abp.services.app.customizationHost',
        function ($scope, $uibModal, utilities, currencyService, businessDivisionService, tenantAppService, customizationService) {
            var vm = this;


            vm.loading = false;
            vm.report = [];
            vm.dateRangeModel = {};

            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));

            vm.applyFilter = function () {
                vm.filters.pendingInvoice = false;
                vm.filters.deliveredPendingInvoice = false;

                if (vm.filters.invoiceFilter === "PendingInvoice") {
                    vm.filters.pendingInvoice = true;
                } else if (vm.filters.invoiceFilter === "DeliveredPendingInvoice") {
                    vm.filters.deliveredPendingInvoice = true;
                }
            }

            vm.filters = {
                fromDate: null,
                toDate: null,
                enableDateRange: true
            };

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
            vm.getInvoiced = function (row) {
                row.invoicedAmount = 0;
                row.milestones.forEach(x => {
                    if (x.invoiceStatus == 2)
                        row.invoicedAmount += x.amount;
                });
                return row.invoicedAmount.toFixed(2);
            }


            vm.getbusinessDivisions = function () {
                vm.loading = true;
                businessDivisionService.getBusinessDivisions().success(function (data) {
                    vm.businessDivisions = data.items
                }).finally(function () {
                    vm.loading = false;
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

            
           
            vm.searchTenants = function ($select) {
                if ($select.search == "")
                    return null;
                tenantAppService.searchTenants({ filter: $select.search }).then(function (response) {
                    vm.tenants = response.data.items;
                });
            };
            setTimeout(function () {
                var startDateModel = moment().add(-29, 'days').startOf('day');
                var endDateModel = moment().endOf('day')
                vm.dateRangeModel = {
                    startDate: startDateModel,
                    endDate: endDateModel
                };
            }, 200);

            vm.crsReport = function () {
                vm.loading = true;
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                else {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
                customizationService.getCRsReport(vm.filters).success(function (result) {
                    vm.report = result;
                    var groupedData = vm.report.reduce(function (acc, report) {
                        if (report.customCurrency != null) {

                            var currencyCode = report.customCurrency.code;
                            if (!acc[currencyCode]) {
                                acc[currencyCode] = { currencyCode: currencyCode, totalAmount: 0, invoicedAmount: 0, unInvoicedAmount: 0 };
                            }
                            acc[currencyCode].totalAmount += ((vm.convertCurrency(report) * report.vatPercent / 100) + vm.convertCurrency(report));
                            report.milestones.forEach(x => {
                                if (x.invoiceStatus == 1) {

                                    acc[currencyCode].unInvoicedAmount += x.amount;
                                }
                                else if (x.invoiceStatus == 2) {
                                    acc[currencyCode].invoicedAmount += x.amount;

                                }
                            });
                            return acc;
                        }
                        return acc;
                    }, {});

                    vm.groupAmount = Object.values(groupedData);
                    vm.loading = false;

                });
            }
            vm.UpdateChangeRequest = function (id) {
                openCreateOrUpdateHostChangeRequestModal(id);
            };
            function openCreateOrUpdateHostChangeRequestModal(id) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/customization/createOrUpdateChangeRequestModal.cshtml',
                    controller: 'host.views.customization.createOrUpdateChangeRequestModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        changeRequestId: function () {
                            return id;
                        },
                        project: function () {
                            return null;
                        },
                        tasksToMove: function () {
                            return null;
                        },
                        isCRFromProjectDashboard: function () {
                            return false;
                        },
                        isCRFromNewPoints: function () {
                            return false;
                        },
                        isGapFromScope: function () {
                            return false;
                        },
                        gapTaskFromScope: function () {
                            return null;
                        },
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.crsReport();
                });
            }
            
            vm.convertCurrency = function (row) {
                if (row.customCurrencyId > 0)
                    return (row.cost * vm.currencies.find(obj => obj.id === row.customCurrencyId).currencyToBaseRate) - row.discount;
                else
                    return 0;
            };
            vm.getCurrencies = function () {
                vm.loading = true;
                currencyService.getCurrencies().success(function (data) {
                    vm.currencies = data.items;

                }).finally(function () {
                    vm.loading = false;
                });
            }
            vm.getCurrencies();
            vm.getbusinessDivisions();
            //vm.crsReport();
        }
    ]);
