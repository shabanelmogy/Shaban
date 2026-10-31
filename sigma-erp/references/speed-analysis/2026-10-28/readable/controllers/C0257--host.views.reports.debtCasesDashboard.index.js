// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:77285-77510
appModule.controller('host.views.reports.debtCasesDashboard.index', [
        '$scope', '$uibModal', 'abp.services.app.user', 'abp.services.app.case', 'abp.services.app.directory', 'abp.services.app.tenant',
        function ($scope, $uibModal, userService, caseService, directoryService, tenantService) {

            var vm = this;
            vm.loading = false;
            vm.count = null;
            vm.allowDateRange = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));

            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc(),
            };
            vm.cases = [];
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.permissions = {
                view: abp.auth.hasPermission('Pages.Tenants.Report.DebtCases'),
                create: abp.auth.hasPermission('Pages.Tenants.Report.DebtCases.AddNew'),
                edit: abp.auth.hasPermission('Pages.Tenants.Report.DebtCases.Edit'),
                'delete': abp.auth.hasPermission('Pages.Tenants.Report.DebtCases.Delete'),
            };
            vm.statuses = [
                { id: 1, name: 'Open' },
                { id: 2, name: 'Closed' },
            ];

            vm.filters = {
                status: 1
            };

            vm.getDealStatus = function (status) {
                if (!status)
                    return '';
                if (status == 1)
                    return 'Open';
                if (status == 2)
                    return 'Closed';
            };


            vm.searchCompanies = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, contactCategory: 2 }).then(function (response) {
                    vm.companies = response.data.items;
                });
            };
            vm.searchTenants = function ($select) {
                if ($select.search == "")
                    return null;
                tenantService.searchTenants({ filter: $select.search }).then(function (response) {
                    vm.tenants = response.data.items;
                });
            };
            vm.searchCaseNos = function ($select) {
                if ($select.search == "")
                    return null;
                caseService.searchCases({ caseNo: $select.search }).then(function (response) {
                    vm.caseNos = response.data.items;
                });
            };

            


            vm.clearCompany = function () {
                vm.filters.companyId = null;
                vm.filters.company = null;
            };
            vm.clearTenant = function () {
                vm.filters.tenantId = null;
                vm.filters.tenant = null;
            };
            vm.clearCaseNo = function () {
                vm.filters.caseId = null;
                vm.filters.case = null;
            };

            vm.createCase = function () {
                openCreateOrEditCaseModal(null);
            };
            vm.viewCase = function (cases) {
                openViewCaseModal(cases.id);
            };

            vm.editCase = function (cases) {
                openCreateOrEditCaseModal(cases.id);
            };
            vm.searchAssignedUsers = function ($select) {
                if (!$select.search)
                    return null;
                userService.searchAssignedToUsers({ keyword: $select.search }).then(function (response) {
                    vm.assignedToUserNames = response.data.items;
                });
            };
            vm.clearAssignedTo = function () {
                vm.filters.assignedToUserId = null;
                vm.filters.assignedToUser = null;
            };
            vm.getCasesForDashBoard = function () {
                vm.loading = true;
            
                if (vm.allowDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                else {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
                caseService.getCasesForDashBoard(vm.filters).success(function (data) {
                    vm.cases = data.items;
                    vm.count = data.totalCount;
                }).finally(function () {
                    vm.loading = false;
                });
            };

           /* $scope.$watch('vm.filters.assignedToUser', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    vm.getCasesForDashBoard();
                }
            });*/

            $scope.$watch('vm.filters.isDueDate', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    vm.getCasesForDashBoard();
                }
            });
            function openViewCaseModal(caseId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/reports/debtCases/viewModal.cshtml',
                    controller: 'host.views.reports.debtCases.viewModal as vm',
                    backdrop: 'static',
                    resolve: {
                        caseId: function () {
                            return caseId;
                        }

                    },

                    size: 'lg'
                });

            }
            vm.closeCase = function (caseObj) {
                 var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/reports/debtCases/closeCaseModal.cshtml',
                    controller: 'host.views.reports.debtCases.closeCaseModal as vm',
                    backdrop: 'static',
                    resolve: {
                        caseId: function () {
                            return caseObj;
                        }
                    },
                    size: 'md'
                });

                modalInstance.result.then(function () {
                    vm.getCasesForDashBoard();
                });
            };
            vm.deleteCase = function (deal) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            caseService.deleteCase({
                                id: deal.id
                            }).success(function () {
                                vm.getCasesForDashBoard();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };
            function openCreateOrEditCaseModal(caseId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/reports/debtCases/createOrEditCaseModal.cshtml',
                    controller: 'host.views.reports.debtCases.createOrEditCaseModal as vm',
                    backdrop: 'static',
                    resolve: {
                        caseId: function () {
                            return caseId;
                        }
                    },
                    size: 'lg'
                });

                modalInstance.result.then(function (result) {
                    vm.getCasesForDashBoard();
                });
            }

            vm.caseLogsModal = function (row) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/reports/debtCases/caseDetailLogModal.cshtml',
                    controller: 'host.views.reports.debtCases.caseDetailLogModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        caseObj: function () {
                            return row;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getCasesForDashBoard();
                });
            };


            function init() {
                vm.getCasesForDashBoard();
            }
            init();

        }
    ]);
