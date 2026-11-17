// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:160696-161265
appModule.controller('tenant.views.crs.assets.assets.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.asset', 'abp.services.app.fiscalYear', 'utilities', 'abp.services.app.commonLookup',
        function ($scope, $uibModal, uiGridConstants, assetService, fiscalYearService, utilities, lookupService) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.isAssetDisposalApprovalEnabled = abp.features.isEnabled("CRS.Vouchers.Approval.AssetDisposal");

            var fiscalYear = null;

            vm.filters = {
                enableDateRange: true,
                assetTypeId: null,
                tariffGroupId: null,
                assetNo: null,
                Title: null,
                locationId: null,
                fromDate: null,
                toDate: null,
                status: null,
                skipCount: 0,
                dateTimeType: 1,
                maxResultCount: app.consts.grid.defaultPageSize,
            };
            function getStatuses() {
                vm.statuses = [{ id: 0, name: app.localize("Active") }, { id: 1, name: app.localize("Disposed") }];
            };
            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.Assets.Assets.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.Assets.Assets.Edit'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Assets.Assets.Delete'),
                'view': abp.auth.hasPermission('Pages.Tenant.Assets.Assets'),
                'dispose': abp.auth.hasPermission('Pages.Tenant.Assets.Assets.Dispose'),
                'disposalApproval': abp.auth.hasPermission('Pages.Tenant.Assets.DisposalApproval'),
                'disposalRejection': abp.auth.hasPermission('Pages.Tenant.Assets.DisposalRejection'),
            };

            vm.hasEstimateOrSetAssetPrice = abp.setting.getBoolean('App.General.EstimateOrSetAssetPrice');

            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };
            function getLocations() {
                lookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
            };
            vm.getLocationName = function() {
                if (!vm.locations || !vm.filters.locationId)
                    return null;
                angular.forEach(vm.locations, function (value, key) {
                    if (value.id == vm.filters.locationId) {
                        vm.locationName = value.name;
                        return;
                    }
                });
            };
            vm.getLocationNameTwo = function (id) {
                var loc = vm.locations.find(x => x.id === id);
                return loc ? loc.name : '';
            };

            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().add(-29, 'days').startOf('day'),
                    endDate: moment().endOf('day')
                };
            }
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

            function getTariffGroups() {
                lookupService.getTariffGroups({}).success(function (data) {
                    vm.tariffGroups = data.items;
                });
            };

            vm.rounding = function (value) {
                return utilities.round(value, 2);
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
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewAsset(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit && !row.entity.isDisposed && !row.entity.isDisposalApprovalPending" ng-click="grid.appScope.editAsset(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.printAssetPrintModal(row.entity.id)">' + app.localize('Print') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.hasEstimateOrSetAssetPrice && !row.entity.isDisposalApprovalPending" ng-click="grid.appScope.assetSalePriceModal(row.entity.id)">' + app.localize('AssetSalePrice') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete && !row.entity.isDisposalApprovalPending" ng-click="grid.appScope.deleteAsset(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.dispose && !row.entity.isDisposed && !row.entity.isDisposalApprovalPending" ng-click="grid.appScope.disposeAsset(row.entity)">' + app.localize('Dispose') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.disposalApproval && row.entity.isDisposalApprovalPending" ng-click="grid.appScope.approveDisposal(row.entity)">' + app.localize('ApproveDisposal') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.disposalRejection && row.entity.isDisposalApprovalPending" ng-click="grid.appScope.rejectDisposal(row.entity)">' + app.localize('RejectDisposal') + '</a></li>' +
                            // '      <li><a ng-if="grid.appScope.permissions.disposalApproval && row.entity.isDisposalApprovalPending" ng-click="grid.appScope.rejectDisposal(row.entity)">' + app.localize('RejectDisposal') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },

                    {
                        name: app.localize('AssetNo'),
                        type: 'number',
                        field: 'assetNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.assetNo}}' + '&nbsp' + '</span>' +
                            ' <span  ng-show="row.entity.isDisposed" class="label label-default" style="background-color: pink;">' + app.localize('Disposed') + '</span>' +
                            ' <span  ng-show="row.entity.isDisposalApprovalPending" class="label label-warning">' + app.localize('ApprovalPending') + '</span>' +
                            '<span ng-show="grid.appScope.isAssetDisposalApprovalEnabled && row.entity.approval.approvalLines && row.entity.approval.approvalLines.length >= 0" style="margin-left: 5px;width:10px"><a class="btn btn-circle btn-xs green-haze" style="padding:0px 3px 0px 3px" ng-click="grid.appScope.viewApprovals(row.entity)" title="View Approvals"><i class="fa fa-eye "></i></a></span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Type'),
                        field: 'assetType.name'
                    },
                    {
                        name: app.localize('Title'),
                        field: 'title'
                    },
                    {
                        name: app.localize('ChassisNo'),
                        field: 'chassisNo'
                    },
                    {
                        name: app.localize('Cost'),
                        type: 'number',
                        field: 'purchseCost',
                        width: 100,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.CurrencyFormate(row.entity.purchseCost)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('PurchaseDate'),
                        field: 'purchaseDate',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.purchaseDate)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('ResidualValue'),
                        //type: 'number',
                        field: 'residualValue',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.CurrencyFormate(row.entity.residualValue)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Life'),
                        field: 'assetLifeInYears',
                        width: 90,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.rounding(row.entity.assetLifeInYears)}}</div>' +
                            '</div>'

                    },
                    {
                        name: app.localize('Location'),
                        field: 'locationName',
                        width: 90,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getLocationNameTwo(row.entity.locationId)}}</div>' +
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

                        vm.getAssets();
                    });

                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getAssets();
                    });
                },
                data: []
            };

            vm.printAssetPrintModal = function (assetId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/assets/assets/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.assets.assets.printtemplates.printPreview as vmMain',
                    backdrop: 'static',
                    //windowClass: 'app-modal-window',
                    size: 'lg',
                    resolve: {
                        assetId: function () {
                            return assetId;
                        }
                    }
                });
            };

            vm.assetSalePriceModal = function (assetId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/assets/assets/salePriceModal.cshtml',
                    controller: 'tenant.views.crs.assets.assets.salePriceModal as vm',
                    backdrop: 'static',
                    //windowClass: 'app-modal-window',
                    size: 'lg',
                    resolve: {
                        assetId: function () {
                            return assetId;
                        }
                    }
                });
            };



            vm.report = function () {
                vm.dateRangeCheck();
                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/assets/assets/report.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };
            vm.exportToExcel = function () {
                vm.loading = true;

                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc
                //vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                //vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                vm.dateRangeCheck();
                assetService.exportToExcelThroughView(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            function openCreateOrEditAssetModal(assetId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/assets/assets/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.assets.assets.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        assetId: function () {
                            return assetId;
                        },
                        fiscalYear: function () {
                            return fiscalYear;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getAssets();
                });
            }


            vm.rejectDisposal = function (asset) {
                if (!asset || !asset.id) {
                    abp.notify.error(app.localize('AssetNotFound'));
                    return;
                }

                abp.message.confirm(
                    app.localize('AreYouSureYouWantToRejectThisDisposal'),
                    app.localize('AreYouSure'),
                    function (isConfirmed) {
                        if (isConfirmed) {

                            assetService.rejectDisposal({
                                id: asset.id
                            }).success(function () {
                                vm.getAssets();
                                abp.notify.success(app.localize('SuccessfullyRejected'));
                            });

                        }
                    }
                );
            };
            vm.approveDisposal = function (asset) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/assets/assets/disposalApprovalModal.cshtml',
                    controller: 'tenant.views.crs.assets.assets.disposalApprovalModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        assetId: function () {
                            return asset.id;
                        },
                        approvalId: function () {
                            return asset.approvalId;
                        },
                        form: function () {
                            return 8;
                        },
                        disposeLimited: function () {
                            return false;
                        },
                        options: {}
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getAssets();
                });
            };


            vm.viewApprovals = function (row) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/approval/approvalViewModal.cshtml',
                    controller: 'tenant.views.common.approval.approvalViewModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        approvalId: function () {
                            return row.approvalId;
                        },
                        form: function () {
                            return 8;
                        },
                        recordId: function () {
                            return row.id;
                        },
                        formValue: function () {
                            return row;
                        }
                    }
                })
                modalInstance.result.then(function (result) {
                    vm.getAssets();
                });
            };

            function openDisposeAssetModal(assetId) {


                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/assets/assets/disposeAsset.cshtml',
                    controller: 'tenant.views.crs.assets.assets.disposeAsset as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        assetId: function () {
                            return assetId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getAssets();
                });
            }


            function openViewAssetModal(assetId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/assets/assets/viewModal.cshtml',
                    controller: 'tenant.views.crs.assets.assets.viewModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        assetId: function () {
                            return assetId;
                        }

                    }
                });
            }

            vm.createAsset = function () {
                if (fiscalYear)
                    openCreateOrEditAssetModal(null);
                else
                    abp.message.info("Define Fiscal Year First");
            };

            vm.viewAsset = function (asset) {
                openViewAssetModal(asset.id);
            };

            vm.editAsset = function (asset) {
                if (fiscalYear)
                    openCreateOrEditAssetModal(asset.id);
                else
                    abp.message.info("Define Fiscal Year First");
            };
            vm.disposeAsset = function (asset) {
                if (asset.isPermanentAttachment) {
                    abp.message.info("Can not dispose this Asset as it is already attached with another Asset.");
                }
                else {
                    openDisposeAssetModal(asset.id);
                }
            };

            vm.deleteAsset = function (asset) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', asset.assetNo),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            assetService.deleteAsset({
                                id: asset.id
                            }).success(function () {
                                vm.getAssets();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            }).error(function (data) {
                                if (data) {
                                    setTimeout(() => abp.message.info(data.message), 300);
                                }

                            });;
                        }
                    }
                );
            };

            function getAssetType() {
                vm.loading = true;
                assetService.getAssetType({}).success(function (data) {
                    vm.assetTypes = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function disposeApprovedAsset(assetId) {
                vm.loading = true;
                assetService.approveDisposal({ id: assetId }).success(function (data) {
                    vm.getAssets();

                }).finally(function () {
                    vm.loading = false;
                    abp.notify.info('Asset Disposed Successfully');
                });
            };


            vm.searchAssets = function ($select) {
                if (!$select.search) return;

                assetService.search({ keyword: $select.search, category: 1 }).success(function (data) {
                    vm.assets = data.items;
                });
            };

            vm.clearParentAsset = function () {
                vm.filters.parentAssetId = null;
                vm.filters.parentAsset = null;
            };



            vm.dateRangeModelChanged = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };


            vm.getAssets = function () {
                vm.loading = true;
                vm.dateRangeCheck();

                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc

                assetService.getAssets(vm.filters).success(function (data) {
                    if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null)
                        initDate();
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;

                    fiscalYearService.getFirstFiscalYear().success(function (data) {
                        fiscalYear = data
                    }).finally(function () { vm.loading = false; })
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.enterKeyPress = function (eventOnKeyPress) {
                if (eventOnKeyPress.which === 13) {
                    vm.getAssets();
                    eventOnKeyPress.preventDefault();
                }
            }

            function init() {
                initDate();
                getAssetType();
                getTariffGroups();
                getLocations();
                vm.getAssets();
                getStatuses();
            }
            init();
        }
    ]);
