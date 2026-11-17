// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:313514-313915
appModule.controller('tenant.views.crs.vehicles.serviceLog', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.vehicleServiceLog', 'abp.services.app.directory', 'abp.services.app.serviceItem',
        function ($scope, $uibModal, uiGridConstants, vehicleServicelogService, directoryService, serviceItemService) {

            var vm = this;
            vm.allInsurance = false;
            vm.allRegistration = false;
            vm.isRealEstatePropertyEnabled = abp.features.isEnabled('CRS.FleetManagement_ServiceLog');
            vm.vehicleAlertsService = [];
            var todayAsString = moment().format('YYYY-MM-DD hh:mm:ss');
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.filters = {
                plateNo: '',
                statusId: '',
                skipCount: 0,
                enableDateRange: true,
                startDate: null,
                endDate: null,
                workshopId: null,
                workType: null,
                maxResultCount: app.consts.grid.defaultPageSize,
            };
            vm.workTypes = [
                { value: 1, text: "Tyre" },
                { value: 2, text: "Battery" },
                { value: 3, text: "Service" },
                { value: 4, text: "Repair" },
                { value: 30, text: "Other" }
            ];
            vm.workTypeMap = {};
            vm.workTypes.forEach(wt => {
                vm.workTypeMap[wt.value] = wt.text;
            });
            vm.getWorkTypeTextForGrid = function (workTypes) {
                if (!workTypes || !workTypes.length) return "";
                return workTypes
                    .filter(wt => vm.workTypeMap[wt]) // ignore unknown/0
                    .map(wt => vm.workTypeMap[wt])
                    .join(", ");
            };
            vm.getWorkTypeText = function (id) {
                var type = vm.workTypes.find(function (x) {
                    return x.value === id;
                });
                return type ? type.text : "";
            };
            vm.searchContacts = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customers). get customers
                return directoryService.search({ keyword: $select.search, contactType: 3 }).then(function (response) {
                    vm.contacts = response.data.items;
                });
            };
            // extended search using search customer popup
            vm.searchContactPopoup = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return null;
                        },
                        type: function () {
                            return 3;
                        }
                    }
                }).result.then(function (result) {
                    if (result != null) {
                        vm.filters.workshop = result;
                        vm.filters.workshopId = result.id;
                    }
                });
            };

            vm.clearWorkShop = function () {
                vm.filters.workShop = null;
                vm.filters.workShopId = null;
            };
            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc()
            };


            vm.getColumnConcate = function (row) {
                return row.makeAndModel;
            };

            vm.getUrl = function () {
                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
                vm.encodedFilters = encodeURIComponent(JSON.stringify(vm.filters).replace(/\//g, ''));
                return "/Report#/tenant/serviceLogReport/" + vm.encodedFilters;
            };

            vm.plateNoChanged = function () {
                vm.filters.enableDateRange = false;
            };

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.dateRangeModelChanged = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
            };

            vm.gridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
                useExternalPagination: true,
                appScopeProvider: vm,
                enableSorting: true,
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
                            '      <li><a ng-if="row.entity.isHistorical" ng-click="grid.appScope.editServiceLog(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="row.entity.isHistorical" ng-click="grid.appScope.printServiceLog(row.entity)">' + app.localize('Print') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.viewServiceLog(row.entity.id)">' + app.localize('View') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        //name: app.localize('Vehicle'),
                        //field: 'vehicle.plateNo',
                        //width: 150,
                        name: app.localize('Vehicle'),
                        field: 'vehicle.plateNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.vehicle.plateNo}}</div>' +
                            '</div>',
                        width: 150

                    },
                    {
                        //name: app.localize('Vehicle'),
                        //field: 'vehicle.plateNo',
                        //width: 150,
                        name: app.localize('MakeAndModel'),
                        field: 'vehicle.makeAndModel',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getColumnConcate(row.entity)}}</div>' +
                            '</div>',
                        width: 180

                    },
                    {
                        name: app.localize('DueDate'),
                        field: 'dueDate',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.dueDate)}}</div>' +
                            '</div>',
                        width: 150
                    },
                    {
                        name: app.localize('DueKMs'),
                        field: 'dueKMs',
                        width: 100,
                    },
                    {
                        name: app.localize('PerformedDate'),
                        field: 'date',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.date)}}</div>' +
                            '</div>',
                        width: 150
                    },
                    {
                        name: app.localize('PerformedKms'),
                        field: 'kMs',
                        width: 100,
                    },
                    {
                        name: app.localize('PoNo'),
                        field: 'poNo',
                        width: 150,

                    },
                    {
                        name: app.localize('Service'),
                        field: 'service',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.service.name}}' + '</span>' +
                            '</div>',
                        width: 200,
                    },
                    {
                        name: app.localize('Notes'),
                        field: 'notes',
                        width: 250,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.notes}}' + '</span>' +
                            '</div>',
                    },
                    {
                        name: app.localize('ServiceItems'),
                        field: 'serviceItems',
                        width: 450,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span ng-repeat="item in row.entity.serviceItems">' + '{{item.name}}<span ng-if="item.name && $index < row.entity.serviceItems.length-1">, ' + '</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('PerformedItems'),
                        field: 'perFormedItems',
                        width: 450,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span ng-repeat="item in row.entity.perFormedItems">' + '{{item.description}}<span ng-if="item.description && $index < row.entity.perFormedItems.length-1">,</span> ' + '</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Amount'),
                        field: 'amount',
                        width: 100,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span ng-if="row.entity.amount <= 0">' + '{{row.entity.value}}' + '</span>' +
                            ' <span ng-if="row.entity.amount > 0">' + '{{row.entity.amount}}' + '</span>' +
                            '</div>',
                    },
                    {
                        name: 'Work Types',
                        field: 'workTypes',
                        width: 120,
                        cellTemplate: '<div class="ui-grid-cell-contents"> {{ grid.appScope.getWorkTypeTextForGrid(row.entity.workTypes) }} </div>'
                    }
                ],
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            vm.filters.sorting = "id desc";
                        } else {
                            vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }

                        vm.getServiceLog();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getServiceLog();
                    });
                },
                data: []
            };

            vm.createServiceLog = function () {
                openCreateOrEditServiceLogModal(null);
            };
            vm.editServiceLog = function (serviceLog) {
                openCreateOrEditServiceLogModal(serviceLog.id);
            };
            vm.printServiceLog = function (serviceLog) {
                openPrintServiceLogModal(serviceLog.id);
            };
            function openCreateOrEditServiceLogModal(vehicleId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/createOrEditServiceLogModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.createOrEditServiceLogModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        vehicleId: function () {
                            return vehicleId;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getServiceLog();
                });
            }
            function openPrintServiceLogModal(vehicleId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.vehicles.printPreview as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        vehicleId: function () {
                            return vehicleId;
                        }
                    }
                });
            }
            vm.viewService = function (vehicleServiceId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/viewServicesModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.viewServicesModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        vehicleServiceId: function () {
                            return vehicleServiceId;
                        }
                    }
                });
            };
            vm.viewServiceLog = function (vehicleServiceLogId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/viewServicesLogModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.viewServicesLogModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        vehicleServiceLogId: function () {
                            return vehicleServiceLogId;
                        }
                    }
                });
            };

            var getServiceItems = function () {
                vm.loading = true;
                serviceItemService.getServiceItems({}).success(function (data) {
                    vm.serviceItems = data.items;
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
                            return '~/App/tenant/views/crs/vehicles/serviceLogReport.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };

            vm.getServiceLog = function () {
                vm.loading = true;
                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                else {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }

                vehicleServicelogService.getVehicleServiceLogs(vm.filters).success(function (data) {
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });

            };
            function init() {
                vm.getServiceLog();
                getServiceItems();
            }
            init();
        }
    ]);
