// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:369706-370106
appModule.controller('tenant.views.crs.vouchers.loanAmortization.index', ['$scope', '$uibModal', 'abp.services.app.vehicle', 'abp.services.app.directory', 'uiGridConstants', 'abp.services.app.loanAmortization', 'appSession', 'abp.services.app.commonLookup', 'utilities',
        function ($scope, $uibModal, vehicleService, directoryService, uiGridConstants, LoanAmortizationAppService, appSession, commonLookupService, utilities) {
            var vm = this;
            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.isSageX3Enabled = abp.features.isEnabled('Core.SagX3Integration');
            vm.isAccountsEnabled = abp.features.isEnabled('CRS.Accounts');
            vm.isApprovedEnabled = abp.features.isEnabled("CRS.Vouchers.Approval.JVs");
            vm.approvedTypes = [{ id: 2, name: 'Approved' }, { id: 3, name: 'Not Approved' }];
            vm.approveAllEnableBotton = false;
            vm.postingGroups = [];
           

            vm.filters = {
                enableDateRange: true,
                voucherNo: null,
                fromDate: null,
                toDate: null,
                skipCount: 0,
                amount: null,
                maxResultCount: app.consts.grid.defaultPageSize,
            }
            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().add(-29, 'days').startOf('day'),
                    endDate: moment().endOf('day')
                };
            }
            vm.dateRangeModelChanged = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };
            vm.locationPermission = function (row) {
                if (row.locationId) {
                    if (!vm.permissions.allActionsOnOtherBranch && row.locationId != appSession.user.locationId)
                        return false;
                }

                return true;
            };
            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.Vouchers.LoanAmortization.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.Vouchers.LoanAmortization.Edit'),
                view: abp.auth.hasPermission('Pages.Tenant.Vouchers.LoanAmortization.View'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Vouchers.LoanAmortization.Delete'),
            };
            vm.locationPermission = function (row) {
                if (row.locationId) {
                    if (!vm.permissions.allActionsOnOtherBranch && row.locationId != appSession.user.locationId)
                        return false;
                }
                return true;
            };
            vm.allBranchPermission = function (row) {
                if (row.locationId) {
                    if (vm.permissions.approved && !vm.permissions.canApprovedOther && row.locationId === appSession.user.locationId) {
                        return true;
                    }
                    if (vm.permissions.canApprovedOther) {
                        return true;
                    }

                }
                return false;
            };
            vm.approveAllMethod = function () {
                vm.ids = [];
                angular.forEach(vm.gridOptions.data, function (receipts) {
                    if (!jvs.isAuthorized) {
                        vm.ids.push(receipts.id);
                    }
                });
                LoanAmortizationAppService.approvejVs(vm.ids).success(function () {
                    vm.getLoanAmortization();
                    abp.notify.success(app.localize('SuccessfullyAuthorizeJV'));
                });
            };
          
            vm.dateRangeCheck = function () {

                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
            };

            vm.getLoanAmortization = function () {
                vm.loading = true;

                if (vm.filters.supplier != null)
                    vm.filters.contact = vm.filters.supplier.name;
                if (vm.filters.vehicle != null)
                    vm.filters.vehicleId = vm.filters.vehicle.id;

                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
                if (vm.isApprovedEnabled) {
                    vm.approveAllEnableBotton = vm.filters.approvedType == 3 ? true : false;
                }

                if (!vm.isApprovedEnabled) {
                    vm.filters.approvedType = null;
                    vm.filters.approvedById = null;
                    vm.filters.createdById = null;
                }
                LoanAmortizationAppService.getLoanAmortization(vm.filters).success(function (data) {
                    if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null)
                        initDate();
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            function getLocationsActiveAndInActive() {
                commonLookupService.getLocationsActiveAndInActive({}).success(function (data) {
                    vm.locations = data.items;
                });
            };
            vm.exportToExcel = function () {
                vm.loading = true;
                if (vm.filters.supplier != null)
                    vm.filters.contact = vm.filters.supplier.name;
                if (vm.filters.vehicle != null)
                    vm.filters.vehicleId = vm.filters.vehicle.id;
                LoanAmortizationAppService.exportToExcel(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };
            vm.exportToExcelDetailed = function () {
                vm.loading = true;
                if (vm.filters.supplier != null)
                    vm.filters.contact = vm.filters.supplier.name;
                if (vm.filters.vehicle != null)
                    vm.filters.vehicleId = vm.filters.vehicle.id;
                LoanAmortizationAppService.exportToExcelDetailed(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
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
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a  ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewLoanAmortization(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a  ng-click="grid.appScope.editLoanAmortization(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a  ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteLoanAmortization(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.permissions.view && row.entity.status != 5" ng-click="grid.appScope.openprintModal(row.entity.id)">' + app.localize('Print') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.allBranchPermission(row.entity) && !row.entity.isAuthorized && row.entity.status!=4" ng-click="grid.appScope.approveJVs(row.entity)">' + app.localize('Approve') + '</a></li>' +
                            '    <li><a ng-if="grid.appScope.permissions.unapproved && row.entity.isAuthorized" ng-click="grid.appScope.unapproveJV(row.entity)">' + app.localize('UnApprove') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },

                    {
                        name: app.localize('No'),
                        field: 'voucherNo',
                        type: 'number',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.voucherNo}}' + '&nbsp' + '</span>' +
                            ' <span  ng-show="row.entity.voucherSubTypeId==27" class="label label-warning">' + app.localize('SalikMonthEndPosting') + '</span>' +
                            ' <span  ng-show="row.entity.voucherSubTypeId==28" class="label label-success">' + app.localize('FineMonthEndPosting') + '</span>' +
                            ' <span  ng-show="grid.appScope.isApprovedEnabled && !row.entity.isAuthorized  && row.entity.status!=4" class="label label-warning">' + app.localize('Not Approved') + '</span>' +
                            ' <span  ng-show="grid.appScope.isApprovedEnabled && row.entity.isAuthorized" class="label label-success">' + app.localize('Approved') + '</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('SageX3No'),
                        visible: vm.isSageX3Enabled,
                        field: 'externalCode'
                    },
                    {
                        name: app.localize('Date'),
                        field: 'date',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.date)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Amount'),
                        field: 'amount',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.roundingforView(row.entity.amount)}}</div>' +
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
                        vm.getLoanAmortization();
                    });

                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;
                        vm.getLoanAmortization();
                    });
                },
                data: []
            };

            openCreateOrEditLoanAmortizationModal = function (LoanAmortizationId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/loanAmortization/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.loanAmortization.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        LoanAmortizationId: function () {
                            return LoanAmortizationId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getLoanAmortization();
                });
            }

            vm.openprintModal = function (id) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/loanAmortization/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.vouchers.loanAmortization.printTemplates.printPreview as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        LoanAmortizationId: function () {
                            return id;
                        }
                    }
                });
            };

            openViewloanAmortizationModal = function (LoanAmortizationId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/loanAmortization/viewModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.loanAmortization.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        LoanAmortizationId: function () {
                            return LoanAmortizationId;
                        }
                    }
                });

            }
            vm.report = function () {
                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/vouchers/jvs/report.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };

            vm.createLoanAmortization = function () {
                openCreateOrEditLoanAmortizationModal(null);
            };

            vm.salikVoucherDetails = function (JV) {
                opensalikVoucherDetailsModal(JV);
            };

            vm.editLoanAmortization = function (LoanAmortization) {
                openCreateOrEditLoanAmortizationModal(LoanAmortization.id);
            };

            vm.viewLoanAmortization = function (LoanAmortization) {
                openViewloanAmortizationModal(LoanAmortization.id);

            }
            vm.deleteLoanAmortization = function (LoanAmortization) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', LoanAmortization.voucherNo),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            LoanAmortizationAppService.deleteLoanAmortization({
                                id: LoanAmortization.id
                            }).success(function () {
                                vm.getLoanAmortization();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

          
            vm.enterKeyPress = function (eventOnKeyPress) {
                if (eventOnKeyPress.which === 13) {
                    vm.getLoanAmortization();
                    eventOnKeyPress.preventDefault();
                }
            }
            vm.approveJVs = function (jvs) {
                abp.message.okConfirm(
                    app.localize(''), app.localize('PressOkToApproveJVs'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            LoanAmortizationAppService.approveJV({
                                id: jvs.id,
                            }).success(function () {
                                vm.getLoanAmortization();
                                abp.notify.success(app.localize('SuccessfullyAuthorizedJVs'));
                            });
                        }
                    }
                );
            };

            vm.unapproveJV = function (jvs) {
                abp.message.okConfirm(
                    app.localize(''), app.localize('PressOkToUnApproveJV'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            LoanAmortizationAppService.unApproveJV({
                                id: jvs.id,
                            }).success(function () {
                                vm.getLoanAmortization();
                                abp.notify.success(app.localize('SuccessfullyUnAuthorizedJV'));
                            });
                        }
                    }
                );
            };

            function init() {
                getLocationsActiveAndInActive();
                initDate();
                vm.dateRangeModelChanged();
                vm.getLoanAmortization();
            }
            init();
        }]);
