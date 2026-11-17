// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:186251-186706
appModule.controller('tenant.views.crs.coupons.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.coupon', 'abp.services.app.luckyDraw', 'abp.services.app.directory', 'abp.services.app.qRLabel', 'utilities',
        function ($scope, $uibModal, uiGridConstants, couponService, luckyDrawAppService, directoryService, qrlabelService, utilities) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.statuses = [{ id: true, name: 'Yes' }, { id: false, name: 'No' }];

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
            // Searching Customer
            vm.searchCustomers = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, activeOnly: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            vm.clearCustomer = function () {
                vm.filters.customerId = null;
                vm.filters.customer = null;
            };
            vm.getlocalDate = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.getDateLuckyDraw = function (row) {
                if (!row.startDate)
                    return "";
                else
                    return '(' + vm.getlocalDate(row.startDate) + "-" + vm.getlocalDate(row.endDate) + ')';
            };
            vm.couponTypes = [{ id: 1, name: 'Prepaid' }, { id: 2, name: 'Shopping' }];
            vm.getCouponType = function (id) {
                if (id == 1) {
                    return 'Prepaid'
                } else if (id == 2) {
                    return 'Shopping'
                }
                else {
                    return null;
                }
            };
            vm.loading = false;
            vm.filters = {
                enableDateRange: false,
                couponNo: '',
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };

            vm.features = {
                couponsAndLuckyDraw: abp.features.isEnabled('CRS.CouponsAndLuckyDraw')
            };
            vm.permissions = {
                view: abp.auth.hasPermission('Pages.Tenant.CouponsAndLuckyDraw'),
                create: abp.auth.hasPermission('Pages.Tenant.CouponsAndLuckyDraw.Create'),
                addWinner: abp.auth.hasPermission('Pages.Tenant.CouponsAndLuckyDraw.AddWinner'),
                import: abp.auth.hasPermission('Pages.Tenant.CouponsAndLuckyDraw.Import'),
                redeem: abp.auth.hasPermission('Pages.Tenant.CouponsAndLuckyDraw.Redeem')
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
                        //width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewCoupon(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.addWinner && !row.entity.isWinner" ng-click="grid.appScope.addWinnerCoupon(row.entity)">' + app.localize('AddWinner') + '</a></li>' +
                            //'      <li><a ng-if="(grid.appScope.permissions.edit || grid.appScope.permissions.limitedEdit) && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.editPerson(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.features.rental || grid.appScope.features.lease || grid.appScope.features.chauffeur" ng-click="grid.appScope.viewAgreementsHistoryModal(row.entity)">' + app.localize('ViewAgreementsHistory') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.permissions.delete && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.deletePerson(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('CouponNo'),
                        field: 'couponNo'
                    },
                    {
                        name: app.localize('Type'),
                        field: 'type',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getCouponType(row.entity.type)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('RefId'),
                        field: 'refId'
                    },
                    {
                        name: app.localize('RefNo'),
                        field: 'refNo'
                    },
                    {
                        name: app.localize('Customer'),
                        width: 250,
                        field: 'customer.name'
                    },
                    {
                        name: app.localize('Amount'),
                        field: 'amount'
                    },
                    {
                        name: app.localize('Redeemed'),
                        field: 'amount',
                        cellTemplate: '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.rounding(row.entity.alreadyRedeemed)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Balance'),
                        field: 'amount',
                        cellTemplate: '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.rounding(row.entity.amount - row.entity.alreadyRedeemed)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('IsRedeemed'),
                        field: 'isRedeemed',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\"><span ng-if="row.entity.type==1&&row.entity.isRedeemed" class="label label-success">Yes</span><span ng-if="row.entity.type==1&&!row.entity.isRedeemed" class="label label-danger">No</span><span ng-if="row.entity.type==2" class="label label-info">NA</span></div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('IsWinner'),
                        field: 'isWinner',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\"><span ng-if="row.entity.isWinner" class="label label-success">Yes</span><span ng-if="!row.entity.isWinner" class="label label-danger" >No</span></div>' +
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

                        vm.getCoupons();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getCoupons();
                    });
                },
                data: []
            };
            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };
            vm.ids = [];

            vm.getCoupons = function () {
                vm.loading = true;
                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }

                couponService.getCoupons(vm.filters).success(function (data) {
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                    vm.ids = [];
                    angular.forEach(data.items, function (coupon) {
                        vm.ids.push(coupon.id);
                    });
                    vm.printIds = {
                        ids: vm.ids
                    };
                    if (!vm.dateRangeModel || (!vm.dateRangeModel.endDate === null && !vm.dateRangeModel.startDate === null))
                        initDate();
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.getAllCoupons = function (filters) {
                vm.loading = true;
                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }

                couponService.getAllCoupons(vm.filters).success(function (data) {
                    angular.forEach(data, function (coupon) {
                        vm.ids.push(coupon.id);
                    });
                    vm.printIds = {
                        ids: vm.ids
                    };
                    if (!vm.dateRangeModel || (!vm.dateRangeModel.endDate === null && !vm.dateRangeModel.startDate === null))
                        initDate();
                }).finally(function () {
                    vm.loading = false;
                    vm.printModel(filters);
                });
            };

            //vm.exportToExcel = function () {
            //    vm.loading = true;
            //    couponService.exportToExcelTenant(vm.filters).success(function (result) {
            //        app.downloadTempFile(result);
            //    }).finally(function () {
            //        vm.loading = false;
            //    });
            //};
            //function openCreateOrEditCouponModal(couponId) {
            //    var modalInstance = $uibModal.open({
            //        templateUrl: '~/App/tenant/views/crs/coupons/createOrEditModal.cshtml',
            //        controller: 'tenant.views.crs.coupons.createOrEditModal as vm',
            //        backdrop: 'static',
            //        size: 'lg',
            //        resolve: {
            //            couponId: function () {
            //                return couponId;
            //            }
            //        }
            //    });
            function openCouponsImportModal() {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/coupons/couponsImport.cshtml',
                    controller: 'tenant.views.crs.coupons.couponsImport as vm',
                    backdrop: 'static',
                    size: 'lg'
                });
                modalInstance.result.then(function (result) {
                    vm.getCoupons();
                });
            }
            function openCouponViewModal(couponId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/coupons/couponViewModal.cshtml',
                    controller: 'tenant.views.crs.coupons.couponViewModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        couponId: function () {
                            return couponId;
                        }
                    }
                });

                //    modalInstance.result.then(function (result) {
                //        vm.getCoupons();
                //    });
            }

            function openAddNewCouponModal(id) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/coupons/createOrEditCouponModel.cshtml',
                    controller: 'tenant.views.crs.coupons.createOrEditCouponModel as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return id;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getCoupons();
                });

                //    modalInstance.result.then(function (result) {
                //        vm.getCoupons();
                //    });
            }


            function openAddWinnerCouponModal(couponId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/coupons/addWinnerCoupon.cshtml',
                    controller: 'tenant.views.crs.coupons.addWinnerCoupon as vm',
                    backdrop: 'static',
                    size: 'sm',
                    resolve: {
                        couponId: function () {
                            return couponId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getCoupons();
                });

                //    modalInstance.result.then(function (result) {
                //        vm.getCoupons();
                //    });
            }

            vm.searchLuckyDraws = function ($select) {
                return luckyDrawAppService.search({ keyword: $select.search, activeOnly: true }).then(function (response) {
                    vm.luckyDraws = response.data;
                });
            };

            vm.clearLuckyDraw = function () {
                vm.filters.luckyDrawId = null;
                vm.filters.luckyDraw = null;
            };

            vm.importCoupons = function () {
                openCouponsImportModal();
            };

            //vm.createCoupon = function () {
            //    openCreateOrEditCouponModal(null);
            //};

            //vm.editCoupon = function (coupon) {
            //    openCreateOrEditCouponModal(coupon.id);
            //};
            vm.viewCoupon = function (coupon) {
                openCouponViewModal(coupon.id);
            };
            vm.addWinnerCoupon = function (coupon) {
                openAddWinnerCouponModal(coupon.id);
            };
            vm.addNewCoupon = function () {
                openAddNewCouponModal(null);
            };


            vm.deleteCoupon = function (coupon) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            couponService.deleteCoupon({
                                id: coupon.id
                            }).success(function () {
                                vm.getCoupons();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.searchCorporateDrivers = function ($select) {

                //contactType: 6 (corporateDriver)
                return directoryService.search({ keyword: $select.search, contactType: 6, activeOnly: true }).then(function (response) {
                    vm.corporateDrivers = response.data.items;
                });
            };

            vm.clearCorporateDriver = function () {
                vm.filters.corporateDriver = null;
                vm.filters.couponId = null;
            };

            vm.openprintModal = function (filters) {
                vm.ids = [];
                vm.getAllCoupons(filters);
            };
            vm.printModel = function (filters) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/coupons/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.coupons.printTemplates.printPreview as vmMain',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        filters: function () {
                            return filters;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getAllCoupons(result);
                });
            }

            vm.redeemCoupons = function () {
                openRedeemCouponsModal();
            };
            function openRedeemCouponsModal() {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/coupons/allocationForCoupon.cshtml',
                    controller: 'tenant.views.crs.coupons.allocationForCoupon as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                       
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getCoupons();
                });
            }

            function init() {
                vm.getCoupons();
                vm.searchLuckyDraws('');
            }
            init();

        }
    ]);
