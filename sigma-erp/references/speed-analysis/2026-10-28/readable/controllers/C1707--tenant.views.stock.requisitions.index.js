// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:469982-470335
appModule.controller('tenant.views.stock.requisitions.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.itemRequisition', 'abp.services.app.job',
        function ($scope, $uibModal, uiGridConstants, itemRequisitionService, jobAppService) {

            var vm = this;

            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");

            vm.loading = false;
            vm.filters = {
                enableDateRange: true,
                fromDate: null,
                toDate: null,
                status: null,
                voucherNo: null,
                jobId: null,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };

            vm.dateRangeModelChanged = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };
            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().add(-29, 'days').startOf('day'),
                    endDate: moment().endOf('day')
                };
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
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.getJobType = function (id) {
                if (id == 1)
                    return "Routine Service";
                if (id == 2)
                    return "Mechnical Service";
                if (id == 3)
                    return "Electrical Service";
                if (id == 4)
                    return "Denting And Painting";
                if (id == 5)
                    return "Accident Service";
                if (id == 6)
                    return "AC Service";
                if (id == 7)
                    return "Breakdown Service";
                if (id == 8)
                    return "Tyre Service";
                if (id == 9)
                    return "Unit Maintenance";
                if (id == 10)
                    return "Unit Repair";
                if (id == 11)
                    return "Regular Lubrications";
            };

            vm.getStatus = function (status) {
                if (status == 2)
                    return "Closed";
                return "Open";
            }

            function getStatuses() {
                vm.statuses = [
                    { id: 1, name: app.localize("Open") },
                    { id: 2, name: app.localize("Closed") },
                ];
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
                        '      <li><a ng-click="grid.appScope.openViewModal(row.entity.id)">' + app.localize('View') + '</a></li>' +
                        '      <li><a ng-if="row.entity.job.status == 1 && row.entity.status!=2" ng-click="grid.appScope.openCreateOrEditModel(row.entity.id)">' + app.localize('Edit') + '</a></li>' +
                        '      <li><a ng-if="row.entity.job.status == 1 && row.entity.status!=2 && row.entity.isPRCreated != 1" ng-click="grid.appScope.openCreateOrEditPurchaseRequestModal(row.entity.id)">' + app.localize('CreatePR') + '</a></li>' +
                        '      <li><a ng-click="grid.appScope.openprintModal(row.entity.id)">' + app.localize('Print') + '</a></li>' +
                        '      <li><a ng-if="row.entity.job.status == 1 && row.entity.status!=2" ng-click="grid.appScope.issueItems(row.entity)">' + app.localize('IssueItems') + '</a></li>' +
                        '      <li><a ng-if="row.entity.job.status == 1 && row.entity.status!=2" ng-click="grid.appScope.deleteItem(row.entity)">' + app.localize('Delete') + '</a></li>' +
                        '    </ul>' +
                        '  </div>' +
                        '</div>'
                    },
                    {
                        name: app.localize('ItemRequisitions') + " " + app.localize('No'),
                        field: 'voucherNo',
                        minWidth: 100
                    },
                    {
                        name: app.localize('Date'),
                        field: 'date',
                        minWidth: 100,
                        cellTemplate:
                        '<div class=\"ui-grid-cell\">' +
                        '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.date)}}</div>' +
                        '</div>'
                    },
                    {
                        name: app.localize('Job'),
                        field: 'jobId',
                        minWidth: 160,
                        cellTemplate:
                        '<div class=\"ui-grid-cell\">' +
                        '<div class=\"ui-grid-cell-contents\" >{{row.entity.job.jobNo}} ({{grid.appScope.getJobType(row.entity.jobDetail.jobType)}})</div>' +
                        '</div>'
                    },
                    {
                        name: app.localize('Status'),
                        field: 'status',
                        cellTemplate:
                        '<div class=\"ui-grid-cell\">' +
                        '<div class=\"ui-grid-cell-contents\" >{{grid.appScope.getStatus(row.entity.status)}}</div>' +
                        '</div>'
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
                        vm.getItemRequisitions();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getItemRequisitions();
                    });
                },
                data: []
            };

            vm.openCreateOrEditPurchaseRequestModal = function (itemRequistionId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/purchaseRequest/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.purchaseRequest.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        options: function () {
                            return {
                                itemRequistionId: itemRequistionId,
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getItemRequisitions();
                });
            };

            vm.openCreateOrEditModel = function (requisitionId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/stock/requisitions/createOrEditModal.cshtml',
                    controller: 'tenant.views.stock.requisitions.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        requisitionId: function () {
                            return requisitionId;
                        },
                        options: function () {
                            return null;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getItemRequisitions();
                });
            };

            vm.openViewModal = function (requisitionId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/stock/requisitions/viewModal.cshtml',
                    controller: 'tenant.views.stock.requisitions.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        requisitionId: function () {
                            return requisitionId;
                        },
                        options: function () {
                            return null;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getItemRequisitions();
                });
            };
            vm.openprintModal = function (id) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/stock/requisitions/printTemplates/printPreview.cshtml',
                    controller: 'tenant.views.stock.requisitions.printPreview as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        requisitionId: function () {
                            return id;
                        }
                    }
                });
            };
            vm.issueItems = function (itemReq) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/stock/itemIssues/createOrEditModal.cshtml',
                    controller: 'tenant.views.stock.itemIssues.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return { itemReqId: itemReq.id, id: null };
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getItemRequisitions();
                });
            };

            vm.searchJobs = function ($select) {
                if ($select.search == "") { vm.jobs = null; return null; }
                return jobAppService.searchJobs({ jobNo: $select.search }).then(function (response) {
                    vm.jobs = response.data;
                });
            };
            vm.clearJob = function () {
                vm.filters.job = null;
                vm.filters.jobId = null;
            };
            vm.deleteItem = function (item) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', item.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;
                            itemRequisitionService.deleteItemRequisition({ id: item.id })
                                .success(function (result) {
                                    abp.notify.info(app.localize('DeletedSuccessfully'));
                                    vm.getItemRequisitions();
                                }).error(function (result) {
                                    abp.notify.error(app.localize('Error'));
                                }).finally(function () {
                                    vm.loading = false;
                                });
                        }
                    }
                );
            };

            vm.getItemRequisitions = function () {
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                vm.loading = true;
                itemRequisitionService.getItemRequisitions(vm.filters)
                    .success(function (data) {
                        if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null)
                            initDate();

                        vm.gridOptions.totalItems = data.totalCount;
                        vm.gridOptions.data = data.items;
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.exportToExcel = function () {
                vm.loading = true;
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                itemRequisitionService.exportToExcel(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.report = function () {
                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/stock/requisitions/report.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };
            function init() {
                initDate();
                vm.getItemRequisitions();
                getStatuses();
            }

            init();

        }
    ]);
