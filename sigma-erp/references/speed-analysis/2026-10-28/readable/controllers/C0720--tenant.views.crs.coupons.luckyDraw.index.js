// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:186828-187098
appModule.controller('tenant.views.crs.coupons.luckyDraw.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.luckyDraw', 'abp.services.app.vehicle', 'appSession', 'abp.services.app.commonLookup', 'utilities', 'abp.services.app.directory',
        function ($scope, $uibModal, uiGridConstants, luckyDrawService, vehicleService, appSession, lookupService, utilities, directoryService) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.isActiveStatus = [{ id: true, name: 'Active' }, { id: false, name: 'InActive' }];
            var todayAsString = moment().format('YYYY-MM-DD hh:mm:ss');
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat;

            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().add(-29, 'days').startOf('day'),
                    endDate: moment().endOf('day')
                };
            }

            vm.dateRangeModelChanged = function () {
                vm.filters.startDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.endDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };

            vm.dateRangeCheck = dateRangeCheck;
            function dateRangeCheck() {
                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }
            }
            vm.getlocalDate = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };
            vm.getStatus = function (row) {
                if (row == true) {
                    
                    return 'Active'
                } else if (row == false)
                {
                    return 'InActive'
                }
                else {
                    return null;
                }
            };


            vm.filters = {
                enableDateRange: false,
                
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                isActive: true
            };


            

            
            

            vm.localize = function (text) {
                return app.localize(text);
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
                        width: "4%",
                        enableSorting: false,
                        cellTemplate:
                            //grid.appScope.permissions.onfleet &&
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a  ng-click="grid.appScope.viewLuckyDrawRecord(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a  ng-click="grid.appScope.editLuckyDrawRecord(row.entity.id)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a  ng-click="grid.appScope.deleteLuckyDraw(row.entity)">' + app.localize('Delete') + '</a></li>' +
                   
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Name'),
                        //width: "10%",
                        field: 'name'
                    },
                    {
                        name: app.localize('StartDate'),
                        field: 'startDate',
                        //width: "10%",
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDate(row.entity.startDate)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('EndDate'),
                        field: 'endDate',
                        //width: "10%",
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDate(row.entity.endDate)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Detail'),
                        //width: "10%",
                        field: 'detail'
                    },
                    {
                        
                        name: app.localize('Status'),
                        field: 'isActive',
                        //width: "10%",
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getStatus(row.entity.isActive)}}</div>' +
                            '</div>'
                    }
                    
                ],
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            vm.filters.sorting = null;
                        } else {
                            vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }
                        vm.getLuckyDraws();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getLuckyDraws();
                    });
                },
                data: []
            };

            

            vm.getLuckyDraws = function () {
                vm.loading = true;


                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                


                luckyDrawService.getLuckyDraws(vm.filters).success(function (data) {

                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                    if (!vm.dateRangeModel || (!vm.dateRangeModel.endDate === null && !vm.dateRangeModel.startDate === null))
                        initDate();

                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.viewLuckyDrawRecord = function (luckyDraw) {
                openviewLuckyDrawRecordModal(luckyDraw.id);
            };

            function openviewLuckyDrawRecordModal(luckyDrawId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/coupons/luckyDraw/viewModal.cshtml',
                    controller: 'tenant.views.crs.coupons.luckyDraw.viewModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        luckyDrawId: function () {
                            return luckyDrawId;
                        }
                    }
                });
            }

            

            function openEditLuckyDrawRecordModal(luckyDrawId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/coupons/luckyDraw/createOrEditModel.cshtml',
                    controller: 'tenant.views.crs.coupons.luckyDraw.createOrEditModel as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        luckyDrawId: function () {
                            return luckyDrawId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getLuckyDraws();
                });
            }


            
            vm.addLuckyDrawRecord = function () {
                openEditLuckyDrawRecordModal(null);
            };

            vm.editLuckyDrawRecord = function (luckyDraw) {
                
                openEditLuckyDrawRecordModal(luckyDraw);
            };

            vm.deleteLuckyDraw = function (luckyDraw) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', luckyDraw.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            luckyDrawService.deleteLuckyDraw({
                                id: luckyDraw.id
                            }).success(function () {
                                vm.getLuckyDraws();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };


            function init() {
                initDate();
                vm.getLuckyDraws();
            }

            init();
        }
    ]);
