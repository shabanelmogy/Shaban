// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:436332-436461
appModule.controller('tenant.views.hrm.attendanceRegularization.index', [
        '$scope', '$uibModal', 'abp.services.app.attendanceRegularization', 'uiGridConstants',
        function ($scope, $uibModal, regularizationService, uiGridConstants) {

            var vm = this;
            vm.loading = false;

            vm.permissions = {
                view: abp.auth.hasPermission('Pages.HRM.AttendanceRegularization.View'),
                approve: abp.auth.hasPermission('Pages.HRM.AttendanceRegularization.Approve')
            };

            vm.filters = {
                monthYear: new Date(),
                status: '0',
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize
            };

            vm.getAll = function () {
                vm.loading = true;
                var m = moment(vm.filters.monthYear);
                regularizationService.getAll({
                    month: m.month() + 1,
                    year: m.year(),
                    status: vm.filters.status !== '' ? parseInt(vm.filters.status) : null,
                    skipCount: vm.filters.skipCount,
                    maxResultCount: vm.filters.maxResultCount
                }).success(function (data) {
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.approve = function (row) {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/hrm/attendanceRegularization/approveModal.cshtml',
                    controller: 'tenant.views.hrm.attendanceRegularization.approveModal as vm',
                    backdrop: 'static',
                    size: 'sm',
                    resolve: {
                        regularization: function () { return row; },
                        action: function () { return 'approve'; }
                    }
                }).result.then(function () { vm.getAll(); });
            };

            vm.reject = function (row) {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/hrm/attendanceRegularization/approveModal.cshtml',
                    controller: 'tenant.views.hrm.attendanceRegularization.approveModal as vm',
                    backdrop: 'static',
                    size: 'sm',
                    resolve: {
                        regularization: function () { return row; },
                        action: function () { return 'reject'; }
                    }
                }).result.then(function () { vm.getAll(); });
            };

            vm.getStatusLabel = function (status) {
                if (status === 0) return '<span class="label label-warning">Pending</span>';
                if (status === 1) return '<span class="label label-success">Approved</span>';
                if (status === 2) return '<span class="label label-danger">Rejected</span>';
                return '';
            };

            vm.getlocalDate = function (date) {
                if (!date) return '';
                return moment.utc(date).local().format(abp.setting.get('App.General.DateFormat') || 'DD/MM/YYYY');
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
                        name: ' ',
                        enableSorting: false,
                        width: 80,
                        cellTemplate:
                            '<div class="ui-grid-cell-contents">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" ng-if="grid.appScope.permissions.approve && row.entity.status === 0"><i class="fa fa-cog"></i> <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-click="grid.appScope.approve(row.entity)">' + app.localize('Approve') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.reject(row.entity)">' + app.localize('Reject') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    { name: app.localize('Staff'), field: 'staffName' },
                    {
                        name: app.localize('Date'),
                        field: 'attendanceDate',
                        cellTemplate: '<div class="ui-grid-cell-contents">{{grid.appScope.getlocalDate(row.entity.attendanceDate)}}</div>'
                    },
                    { name: app.localize('Reason'), field: 'reason' },
                    {
                        name: app.localize('Status'),
                        field: 'status',
                        cellTemplate: '<div class="ui-grid-cell-contents" ng-bind-html="grid.appScope.getStatusLabel(row.entity.status)"></div>'
                    },
                    { name: app.localize('Note'), field: 'approvalNote' },
                    {
                        name: app.localize('RequestDate'),
                        field: 'creationTime',
                        cellTemplate: '<div class="ui-grid-cell-contents">{{grid.appScope.getlocalDate(row.entity.creationTime)}}</div>'
                    }
                ],
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;
                        vm.getAll();
                    });
                },
                data: []
            };

            vm.getAll();
        }
    ]);
