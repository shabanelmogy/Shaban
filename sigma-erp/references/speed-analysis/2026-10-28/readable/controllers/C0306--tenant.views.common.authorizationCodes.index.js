// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:85209-85496
appModule.controller('tenant.views.common.authorizationCodes.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.authorizationCode', 'abp.services.app.commonLookup', 'abp.services.app.directory', 'abp.services.app.user',
        function ($scope, $uibModal, uiGridConstants, authorizationCodeService, commonLookupService, directoryService, userService) {

            var vm = this;
            var todayAsString = moment().format('YYYY-MM-DD hh:mm:ss');
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.filters = {
                code: '',
                createdBy: '',
                createdById: '',
                usedById: '',
                usedBy: '',
                startDate: null,
                endDate: null,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize
            };

            vm.permissions = {
                ViewOtherUserCodes: abp.auth.hasPermission('Pages.Tenant.AuthCode.ViewOtherUserCodes'),
                create: abp.auth.hasPermission('Pages.Tenant.AuthCode.Addnew'),
                delete: abp.auth.hasPermission('Pages.Tenant.AuthCode.Delete')
            };


            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.viewAuthorizationCode = function (authorizationCode) {

                openViewAuthorizationCodeModal(authorizationCode.id);
            };

            function openViewAuthorizationCodeModal(authorizationCodeId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/authorizationCodes/viewAuthCodeModal.cshtml',
                    controller: 'tenant.views.common.authorizationCodes.viewAuthCodeModal as vm',
                    backdrop: 'static',
            
                    resolve: {
                        authorizationCodeId: function () {
                            return authorizationCodeId;
                        }
                    }
                });
            }

            vm.searchUsers = function ($select) {

                return userService.searchUsers({ keyword: $select.search }).then(function (response) {
                    vm.users = response.data.items;

                });
            };

            //vm.dateRangeModelChanged = function () {
            //    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
            //    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
            //};

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
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.getlocalTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(' HH:mm:ss');
                }
                else {
                    return "";
                }
            };


            vm.dateRangeModel = {
                startDate: moment().startOf('day'),
                endDate: moment().endOf('day')
            };


            vm.clearUsedBy = function () {
                vm.filters.usedBy = null;
                vm.filters.usedById = null;
            };


            vm.clearCreatedBy = function () {
                vm.filters.createdBy = null;
                vm.filters.createdById = null;
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
                            '      <li><a  ng-click="grid.appScope.viewAuthorizationCode(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="vm.permissions.delete" ng-click="grid.appScope.deleteAuthorizationCode(row.entity)" ng-hide="row.entity.isUsed">' + app.localize('Delete') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.usageLogsAuthorizationCode(row.entity)">' + app.localize('UsageLogs') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },

                    {
                        name: app.localize('Code'),
                        field: 'code',

                    },
                    {
                        name: app.localize('MaxDiscount%'),
                        field: 'newLimitValue'
                    },

                    {
                         name: app.localize('CreationTime'),
                         field: 'creationTime',
                         width: 150,
                         cellTemplate:
                        '<div class=\"ui-grid-cell\">' +
                        '{{grid.appScope.getlocalDateTime(row.entity.creationTime)}}' +
                        '</div>'
                     },
                     {
                         name: app.localize('CreatedFor'),
                         field: 'createdForUser.name'
                     },

                     {
                         name: app.localize('Status'),
                         field: 'status',
                         cellTemplate:
                          '<div class=\"ui-grid-cell\">' +

                            ' <span class="label label-success" style="margin:4px;background-color:#44B6AE">' + '{{row.entity.status}}' + '</span>' +
                         //' <span class="label label-success" style="margin:4px;background-color:#26C281" ng-show="row.entity.status== New">' + '{{row.entity.status}}' + '</span>' +
                         //' <span class="label label-success" style="margin:4px;background-color:#F4D03F" ng-show="row.entity.status== Expired">' + '{{row.entity.status}}' + '</span>' +
                         //' <span class="label label-success" style="margin:4px;background-color:#44B6AE" ng-show="row.entity.status== Used">' + '{{row.entity.status}}' + '</span>' +
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

                        vm.getAuthorizationCode();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getAuthorizationCode();
                    });
                },
                data: []
            };


            vm.getAuthorizationCode = function () {
                vm.loading = true;

                if (vm.filters.createdBy != null) {
                    vm.filters.createdById = vm.filters.createdBy.id;

                }

                if (vm.filters.usedBy != null) {
                    vm.filters.usedById = vm.filters.usedBy.id;

                }
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                authorizationCodeService.getAuthorizationCodes(vm.filters).success(function (data) {
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function openCreateOrEditAuthorizationCodeModal(authorizationCodeId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/authorizationCodes/createOrEditModal.cshtml',
                    controller: 'tenant.views.common.authorizationCodes.createOrEditModal as vm',
                    backdrop: 'static',
                    resolve: {
                        authorizationCodeId: function () {
                            return authorizationCodeId;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getAuthorizationCode();
                });
            }

            vm.createAuthorizationCode = function () {
                openCreateOrEditAuthorizationCodeModal(null);
            };

            vm.deleteAuthorizationCode = function (authorizationCode) {

                abp.message.confirm(
                    app.localize('DeleteWarningMessage', ''),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            authorizationCodeService.deleteAuthorizationCode({
                                id: authorizationCode.id
                            }).success(function () {
                                vm.getAuthorizationCode();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.usageLogsAuthorizationCode = function (authorizationCode) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/authorizationCodes/usageLogsAuthorizationCodeModal.cshtml',
                    controller: 'tenant.views.common.authorizationCodes.usageLogsAuthorizationCodeModal as vm',
                    backdrop: 'static',
                    resolve: {
                        authorizationCode: function () {
                            return authorizationCode;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getAuthorizationCode();
                });
            };

            vm.getAuthorizationCode();

        }
    ]);
