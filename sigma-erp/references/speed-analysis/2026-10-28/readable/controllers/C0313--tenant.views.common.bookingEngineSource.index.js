// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:86000-86142
appModule.controller('tenant.views.common.bookingEngineSource.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.bookingEngineSource',
        function ($scope, $uibModal, uiGridConstants, bookingEngineService) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.filters = {
                bookingEngineSource: []  
            };


            vm.loading = false;

            vm.permissions = {
                view: abp.auth.hasPermission('Pages.Tenant.BookingEngineSource.View'),
                create: abp.auth.hasPermission('Pages.Tenant.BookingEngineSource.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.BookingEngineSource.Edit'),
                'delete': abp.auth.hasPermission('Pages.Tenant.BookingEngineSource.Delete'),
            }
            vm.gridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
                appScopeProvider: vm,
                enableSorting: false,
                columnDefs: [
                    {
                        name: app.localize('Actions'),
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewBookingEngineSource(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editBookingEngineSource(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete ng-click="grid.appScope.deleteBookingEngineSource(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },

                    {
                        name: app.localize('Name'),
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<span style="margin:4px">' + '{{row.entity.name}}' + '</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Code'),
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<span style="margin:4px">' + '{{row.entity.code}}' + '<\span>'
                            + '</div>'
                    },
                    
                ],
                data: []
            };

            vm.getBookingEngineSource = function () {
                vm.loading = true;
                bookingEngineService.getBookingEngineSource(vm.filters).success(function (data) {
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function openCreateOrEditBookingEngineSourceModal(bookingId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/bookingEngineSource/createOrEditModal.cshtml',
                    controller: 'tenant.views.common.bookingEngineSource.createOrEditModal as vm',
                    backdrop: 'static',
                    resolve: {
                        bookingId: function () {
                            return bookingId;
                        },
                        bookingEngineSource: function () {
                            return vm.filters.bookingEngineSource;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getBookingEngineSource();
                });
            }

            function openViewBookingEngineSourceModal(bookingSourceId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/bookingEngineSource/viewModal.cshtml',
                    controller: 'tenant.views.common.bookingEngineSource.viewModal as vm',
                    backdrop: 'static',
                    resolve: {
                        bookingSourceId: function () {
                            return bookingSourceId;
                        }
                    }
                });


            }

            vm.createBookingEngineSource = function () {
                openCreateOrEditBookingEngineSourceModal(null);
            };

            vm.editBookingEngineSource = function (bookingEngineSource) {
                openCreateOrEditBookingEngineSourceModal(bookingEngineSource.id);
            };

            vm.viewBookingEngineSource= function (bookingEngineSource) {
                openViewBookingEngineSourceModal(bookingEngineSource.id);
            };

            vm.deleteBookingEngineSource = function (bookingEngineSource) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', bookingEngineSource.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            bookingEngineService.deleteBookingEngineSource({
                                id: bookingEngineSource.id
                            }).success(function () {
                                vm.getBookingEngineSource();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            function init() {
                vm.getBookingEngineSource();
            }
            init();
        }
    ]);
