// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:317616-317917
appModule.controller('tenant.views.crs.vehicles.snagReport.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.serviceItem', 'abp.services.app.snagReport', 'abp.services.app.vehicle',
        function ($scope, $uibModal, uiGridConstants, serviceItemService, snagReportService, vehicleService) {
            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.vehicles = [];

            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

          

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

            vm.dateRangeModelChanged = function () {
                vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };


            vm.dateRangeCheck = function () {
                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }
            };

            vm.filters = {
                enableDateRange: true,
                snagNo: '',
                vehicleId: null,
                vehicle: null,
                status: null,
                startDate: null,
                endDate: null,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize
            };

            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().add(-29, 'days').startOf('day'),
                    endDate: moment().endOf('day')
                };
            }


            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.SnagReport.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.SnagReport.Edit'),
                'delete': abp.auth.hasPermission('Pages.Tenant.SnagReport.Delete')
            };


            vm.statuses = [     
                { id: 1, name: app.localize('New') },
                { id: 2, name: app.localize('In-Progress') },
                { id: 3, name: app.localize('Closed') }
            ];


            vm.getStatuses = function (status) {
                if (status == 1)
                    return app.localize("New");
                if (status == 2)
                    return app.localize("In-Progress");
                if (status == 3)
                    return app.localize("Closed");
                return '';
            };


            vm.searchVehicles = function ($select) {
                if ($select.search == "") { vm.vehicles = null; return null; }
                return vehicleService.searchVehicles({ plateNo: $select.search }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };

            vm.clearVehicle = function () {
                vm.filters.vehicle = null;
                vm.getSnagReport();
            };


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
                            '      <li><a  ng-click="grid.appScope.viewSnagModal(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li ng-if="row.entity.status != 3"><a  ng-click="grid.appScope.editSnagReport(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li ng-if="row.entity.status != 3"><a  ng-click="grid.appScope.changeStatus(row.entity)">' + app.localize('Change-Status') + '</a></li>' +
                            '      <li><a  ng-click="grid.appScope.deleteSnagReport(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('SnagNo'),
                        field: 'snagNo'
                    },
                    {
                        name: app.localize('Vehicle'),
                        field: 'vehicle.plateNo'
                    },
                    {
                        name: app.localize('Reason'),
                        field: 'reason'
                    },
                    {
                        name: app.localize('DueDate'),
                        field: 'dueDate',
                        width: 130,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDate(row.entity.dueDate)}}</div>' +
                            '</div>'

                    },
                    {
                        name: app.localize('Description'),
                        field: 'description'
                    },
                    {
                        name: app.localize('Status'),
                        width: 130,
                        cellTemplate: '<div class="ui-grid-cell-contents">{{grid.appScope.getStatuses(row.entity.status)}}</div>',
                        field: 'status'
                    }
                ],
                data: []
            };


            vm.getSnagReport = function () {
                vm.loading = true;
                snagReportService.getSnagReport({
                    snagNo: vm.filters.snagNo,
                    vehicle: vm.filters.vehicle ? vm.filters.vehicle.plateNo : null,
                    status: vm.filters.status ? vm.filters.status.id : null,
                    startDate: vm.filters.enableDateRange ? vm.filters.startDate : null,   
                    endDate: vm.filters.enableDateRange ? vm.filters.endDate : null,
                    skipCount: vm.filters.skipCount,
                    maxResultCount: vm.filters.maxResultCount,
                    sorting: vm.gridOptions.sorting  
                }).success(function (result) {
                    vm.gridOptions.data = result.items;
                    vm.gridOptions.totalItems = result.totalCount;
                    if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null)
                        initDate();
                }).finally(function () {
                    vm.loading = false;
                });
            };


            vm.createSnag = function () {
                openCreateOrEditSnagModal(null);
            };

            vm.editSnagReport = function (snagReport) {
                openCreateOrEditSnagModal(snagReport.id);
            };

            function openCreateOrEditSnagModal(snagReportId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/snagReport/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.snagReport.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        snagReportId: function () {
                            return snagReportId;
                        },
                        isViewModal: function () {
                            return false;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getSnagReport();
                });
            }


            vm.viewSnagModal = function (snagReport) {

                openViewSnagModalModal(snagReport.id);
            };

            function openViewSnagModalModal(snagReportId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/snagReport/viewModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.snagReport.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        snagReportId: function () {
                            return snagReportId;
                        },
                        isViewModal: function () {
                            return true;
                        }
                    }
                });
            }

            vm.deleteSnagReport = function (snagReport) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', snagReport.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            snagReportService.deleteSnagReport({
                                id: snagReport.id
                            }).success(function () {
                                vm.getSnagReport();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.changeStatus = function (snagReport) {
                var nextStatus, fromLabel, toLabel;

                if (snagReport.status === 1) {
                    nextStatus = 2;
                    fromLabel = app.localize('New');
                    toLabel = app.localize('In-Progress');
                } else if (snagReport.status === 2) {
                    nextStatus = 3;
                    fromLabel = app.localize('In-Progress');
                    toLabel = app.localize('Closed');
                } else {
                    return;
                }

                abp.message.confirm(
                    app.localize('Change Status Confirm Message', fromLabel, toLabel),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            var updatedSnagReport = angular.copy(snagReport);
                            updatedSnagReport.status = nextStatus;

                            snagReportService.createOrUpdateSnagReport({
                                snagReport: updatedSnagReport
                            }).success(function () {
                                vm.getSnagReport();
                                abp.notify.success(app.localize('Successfully Changed'));
                            });
                        }
                    }
                );
            };
            vm.getSnagReport();
            vm.getStatuses();
        }
    ]);
