// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:455429-455665
appModule.controller('tenant.views.tms.parking.dataSharingMapping.index', [
        'utilities', '$scope', '$uibModal', 'uiGridConstants', '$stateParams', 'abp.services.app.dataSharingMapping',
        function (utilities, $scope, $uibModal, uiGridConstants, $stateParams, dataSharingMappingService) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.isEnableApplicableDate = abp.setting.get("App.DarbVehiclePlateNoMapped.EnableApplicableDate") === "True";

            vm.hasImportMappingsPermission = abp.auth.hasPermission("Pages.TMS.Tolls.ImportMappings") || abp.auth.hasPermission("Pages.TMS.Tolls.EDarb.ImportMappings");

            vm.loading = false;
            vm.filters = {
                code: '',
                name: '',
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize
            };


            vm.getDataType = function () {
                vm.filters.dataType = $stateParams.dataType;
                if ($stateParams.dataType == 1)
                    return app.localize('E-Salik') + app.localize('Tolls');
                if ($stateParams.dataType == 2)
                    return app.localize('Fines');
                if ($stateParams.dataType == 3)
                    return app.localize('E-Darb') + app.localize('Tolls');
                if ($stateParams.dataType == 8)
                    return app.localize('E-Parking');
            };

            vm.fields = [];
            function getFields() {
                vm.fields.push("PlateNo_Mapped");
                vm.fields.push("State_Mapped");
                vm.fields.push("PlateCode_Mapped");
                vm.fields.push("Description_Mapped");
                vm.fields.push("Location_Mapped");
                vm.fields.push("Authority_Mapped");
                //vm.fields.push("Vehicle No");
            }

            vm.statuses = [];
            function getStatuses() {
                vm.statuses.push("Mapped");
                vm.statuses.push("Un-Mapped");
            }

            vm.gridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                useExternalPagination: true,
                appScopeProvider: vm,
                enableSorting: true,
                columnDefs: [
                    {
                        name: app.localize('Actions'),
                        enableSorting: false,
                        width: '10%',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a  ng-click="grid.appScope.openCreateOrEditDataSharingMappingModal(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a  ng-click="grid.appScope.deleteMapping(row.entity.id)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Input') + ' ' + app.localize('Value'),
                        field: 'inputValue'
                    },
                    {
                        name: app.localize('Output') + ' ' + app.localize('Value'),
                        field: 'outputValue'
                    },
                    {
                        name: 'State',
                        field: 'parentValue'
                    },
                    {
                        name: 'ApplicableDate',
                        field: 'date',
                        minWidth: 150,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getDateFormat(row.entity.applicableDate)}}</div>' +
                            '</div>'
                    }

                ],
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            vm.filters.sorting = "inputValue desc";
                        } else {
                            vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }

                        vm.getMappings();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getMappings();
                    });
                },
                data: []
            };

            vm.getDateFormat = function (date) {
                if (date !== null) {
                    return moment.utc(date).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.openCreateOrEditDataSharingMappingModal = function (mapping) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/tms/e-parking/dataSharingMapping/createOrEditModal.cshtml',
                    controller: 'tenant.views.tms.parking.dataSharingMapping.createOrEditModal as vm',
                    backdrop: 'static',
                    size: '450',
                    resolve: {
                        mapping: function () {
                            if (mapping != null) {
                                return mapping;
                            }
                            else {
                                return { id: null, dataType: vm.filters.dataType, field: vm.filters.field };
                            }
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getMappings();
                });
            };

            vm.openImportModal = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/tms/common/dataImportModal.cshtml',
                    controller: 'tenant.views.tms.common.dataImportModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        dataType: $stateParams.dataType
                    }
                });

                modalInstance.closed.then(function (result) {
                    vm.getMappings();
                });
            };

            vm.deleteMapping = function (id) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', ''),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            dataSharingMappingService.deleteMapping({
                                id: id
                            }).success(function () {
                                vm.getMappings();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.getlocalDateTime = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            function hideOrShowStateColumn() {
                var pos = vm.gridOptions.columnDefs.map(function (e) { return e.name; }).indexOf('State');
                if (vm.filters.field == "PlateCode_Mapped") {
                    vm.gridOptions.columnDefs[pos].visible = true;
                } else {
                    vm.gridOptions.columnDefs[pos].visible = false;
                }
            }

            function hideOrShowApplicableDateColumn() {
                var pos = vm.gridOptions.columnDefs.map(function (e) { return e.name; }).indexOf('ApplicableDate');
                if (vm.filters.field === "PlateNo_Mapped" && vm.isEnableApplicableDate && vm.filters.dataType === 3) {
                    vm.gridOptions.columnDefs[pos].visible = true;
                } else {
                    vm.gridOptions.columnDefs[pos].visible = false;
                }
            }

            vm.getMappings = function () {
                hideOrShowApplicableDateColumn();
                hideOrShowStateColumn();
                if (vm.filters.field) {
                    vm.loading = true;
                    dataSharingMappingService.getMappings(vm.filters).success(function (data) {
                        vm.gridOptions.totalItems = data.totalCount;
                        vm.gridOptions.data = data.items;
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
                else {
                    vm.gridOptions.totalItems = 0;
                    vm.gridOptions.data = [];
                }
            }
            hideOrShowApplicableDateColumn();
            hideOrShowStateColumn();
            vm.getDataType();
            getFields();
            getStatuses();
            //vm.getMappings();
        }
    ]);
