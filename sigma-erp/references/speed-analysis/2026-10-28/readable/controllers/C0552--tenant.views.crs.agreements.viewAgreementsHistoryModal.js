// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:149893-150039
appModule.controller('tenant.views.crs.agreements.viewAgreementsHistoryModal', [
        '$scope', '$uibModalInstance', 'uiGridConstants', 'abp.services.app.rentalAgreementSearch', 'ContactId','VehicleId',
        function ($scope, $uibModalInstance, uiGridConstants, rentalAgreementSearchService, ContactId, VehicleId) {

            var vm = this;
            vm.loading = false;

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.getlocalDateTime = function (date) {
                if (date == null)
                    return "";

                var localTime = moment.utc(date).toDate();
                return moment(localTime).format(vm.dateTimeFormat);
            };

            vm.localize = function (input) {
                return app.localize(input);
            };
            vm.filters = {
                contactId: ContactId,
                vehicleId: VehicleId,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
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
                        name: app.localize('AgreementNo'),
                        type: 'number',
                        width:'180',
                        field: 'agreementNo',
                    },
                    {
                        name: app.localize('Customer'),
                        field: 'customer',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" >{{row.entity.customer}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Vehicle'),
                        field: 'vehicle',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.vehicle}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('PermanentVehicle'),
                        field: 'permenantVehicle',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.permenantVehicle}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Driver'),
                        field: 'driver',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" >{{row.entity.driver}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('StartDate'),
                        field: 'startDate',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.startDate)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('EndDate'),
                        field: 'endDate',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.endDate)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Status'),
                        cellTemplate: '<div style="text-align:left;margin-left:5px"">{{row.entity.status}}</div>',
                        field: 'status'
                    },
                    {
                        name: app.localize('Location'),
                        field: 'location',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" >{{row.entity.location}}</div>' +
                            '</div>'
                    }
                ],
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            vm.filters.sorting = "agreementNo desc";
                        } else {
                            vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }

                        vm.getAgreementsHistory();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getAgreementsHistory();
                    });
                },
                data: []
            };         

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getAgreementsHistory = function () {
                vm.loading = true;

                rentalAgreementSearchService.getAgreementsHistory(vm.filters).success(function (data) {
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;                  
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function init() {
                vm.getAgreementsHistory();
            }

            init();
        }
    ]);
