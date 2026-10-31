// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:66925-67162
appModule.controller('host.views.crm.proposal.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.proposal','abp.services.app.commonLookup', 'abp.services.app.directory',
        function ($scope, $uibModal, uiGridConstants, proposalService, commonLookupService, directoryService) {
            var vm = this;
            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc()
            };

            vm.filters = {
                enableDateRange:true,
                proposalNo: '',
                editionId: null,
                companyId: null,
                firstDateSearch: false,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };


            vm.permissions = {
                view: abp.auth.hasPermission('Pages.CRM.Proposal.TechnicalPuposal'),
                create: abp.auth.hasPermission('Pages.CRM.Proposal.TechnicalPuposal.AddNew'),
                edit: abp.auth.hasPermission('Pages.CRM.Proposal.TechnicalPuposal.Edit'),
                'delete': abp.auth.hasPermission('Pages.CRM.Proposal.TechnicalPuposal.Delete')
            };


            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.createProposal = function () {
                openCreateOrEditProposalModal(null);
            };





            function openCreateOrEditProposalModal(proposalId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/crm/proposal/createOrEditProposalModal.cshtml',
                    controller: 'host.views.crm.proposal.createOrEditProposalModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        proposalId: function () {
                            return proposalId;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getProposals();
                });
            }

            vm.searchCompanies = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, contactCategory: 2 }).then(function (response) {
                    vm.companies = response.data.items;
                });
            };



            vm.clearCompany = function () {
                vm.filters.companyId = null;
                vm.filters.company = null;
            };


            vm.getEditionValue = function (item) {
                return parseInt(item.value);
            };

            function getEditions() {
                vm.loading = true;
                commonLookupService.getEditionsForCombobox({}).success(function (result) {
                    vm.editions = result.items;
                }).finally(function () {
                    vm.loading = false;
                });
            }

            vm.getLocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('DD-MMM-YY');
                }
                else {
                    return "";
                }
            };
            vm.dateRangeCheck = function () {

                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format(abp.setting.get("App.General.DateFormat"))).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format(abp.setting.get("App.General.DateFormat"))).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
            };
            vm.gridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
                useExternalPagination: true,
                appScopeProvider: vm,
                columnDefs: [
                    {
                        name: app.localize('Actions'),
                        enableSorting: false,
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewProposal(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editProposal(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteProposal(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.view" target="_blank" href="/Report#/host/printModalProposal/{{row.entity.id}}" >' + app.localize('Print') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: 'Proposal No',
                        field: 'proposalNo'
                    },
                    {
                        name: 'Date',
                        field: 'proposalDate',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getLocalDate(row.entity.proposalDate)}}</div>' +
                            '</div>'
                    },
                    {
                        name: 'Company',
                        field: 'company.name'
                    },
                ],
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            vm.filters.sorting = null;
                        } else {
                            vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }
                        vm.getProposals();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;
                        vm.getProposals();
                    });
                },
                data: []
            };

            vm.editProposal = function (proposal) {
                openCreateOrEditProposalModal(proposal.id);
            };
            vm.viewProposal = function (proposal) {
                openViewProposalModal(proposal.id);
            };



            function openViewProposalModal(proposalId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/crm/proposal/viewModel.cshtml',
                    controller: 'host.views.crm.proposal.viewModel as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        proposalId: function () {
                            return proposalId;
                        }
                    }
                });
            }
            vm.dateRangeModelChange = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };
            vm.deleteProposal = function (proposal) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            proposalService.deleteproposal({ id: proposal.id }).success(function () {
                                vm.getProposals();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };



            vm.getProposals = function () {
                vm.loading = true;
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
                proposalService.getProposals(vm.filters).success(function (data) {
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };
            function init() {
                getEditions();
                vm.getProposals();
            }

            init();
        }
    ]);
