// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:467012-467446
appModule.controller('tenant.views.stock.purchaseReturns.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.invoice', 'abp.services.app.directory', 'abp.services.app.purchaseReturn', 'appSession', 'abp.services.app.commonLookup', 'utilities',
        function ($scope, $uibModal, uiGridConstants, invoiceService, directoryService, purchaseReturnService, appSession, commonLookupService, utilities) {
            var vm = this;
            vm.loading = false;
            vm.isAccountsEnable = abp.features.isEnabled("CRS.Accounts");
            vm.isApprovedEnabled = abp.features.isEnabled("CRS.Vouchers.Approval.PurchaseReturns");
            vm.isStockFeatureEnabled = abp.features.isEnabled("STOCK");
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.isJournalEnabled = abp.auth.hasPermission('Pages.Tenant.Accounts.Journal');
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.approvedTypes = [{ id: 2, name: 'Approved' }, { id: 3, name: 'Not Approved' }];
            vm.approveAllEnableBotton = false;
            vm.filters = {
                enableDateRange: true,
                name: "",
                voucherNo: null,
                supplierId: null,
                fromDate: null,
                toDate: null,
                amount: null,
                jobNo: null,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };
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
            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.Vouchers.PurchaseReturns.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.Vouchers.PurchaseReturns.Edit'),
                approved: abp.auth.hasPermission('Pages.Tenant.Vouchers.PurchaseReturns.Approve'),
                delete: abp.auth.hasPermission('Pages.Tenant.Vouchers.PurchaseReturns.Delete'),
                view: abp.auth.hasPermission('Pages.Tenant.Vouchers.PurchaseReturns.View')
               // 'print': abp.auth.hasPermission('Pages.Tenant.Vouchers.PurchaseReturns.Print'),
                //allActionsOnOtherBranch: abp.auth.hasPermission('Pages.Tenant.Vouchers.PurchaseReturns.AllActionsOnOtherBranchPurchaseReturns'),
                //viewOtherBranch: abp.auth.hasPermission('Pages.Tenant.Vouchers.PurchaseReturns.ViewOtherBranchPurchaseReturns'),
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


            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.locationPermission = function (row) {
                if (row.locationId) {
                    if (!vm.permissions.allActionsOnOtherBranch && row.locationId != appSession.user.locationId)
                        return false;
                }

                return true;
            };
            vm.searchSupplier = function ($select) {

                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, activeOnly: true, contactType: 3 }).then(function (response) {
                    vm.suppliers = response.data.items;
                });
            };
            // extended search using search customer popup
            vm.searchSupplierPopoup = function () {
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
                }).result.then(function (supplier) {
                    if (supplier != null) {
                        vm.filters.supplier = supplier;
                        vm.filters.contactId = supplier.id;
                    }
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

            // Opening  View PurchaseReturn Modal 

            function openViewPurchaseReturnModal(purchaseReturnId) {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/stock/purchaseReturns/viewModal.cshtml',
                    controller: 'tenant.views.stock.purchaseReturns.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        purchaseReturnId: function () {
                            return purchaseReturnId;
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
                            return '~/App/tenant/views/stock/purchaseReturns/report.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };

            // Opening CreateOrEdit PurchaseReturn Modal
            function openCreateOrEditPurchaseReturnModal(purchaseReturnId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/Stock/PurchaseReturns/createOrEditModal.cshtml',
                    controller: 'tenant.views.stock.purchaseReturns.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        purchaseReturnId: function () {
                            return purchaseReturnId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getPurchaseReturns();
                });
            }

            vm.createPurchaseReturn = function () {
                openCreateOrEditPurchaseReturnModal(null, null);
            };

            vm.editPurchaseReturn = function (purchaseReturn) {
                    openCreateOrEditPurchaseReturnModal(purchaseReturn.id, null);
            };

            vm.viewPurchaseReturn = function (purchaseReturn) {
                    openViewPurchaseReturnModal(purchaseReturn.id, null);
            };

            vm.exportToExcel = function () {
                vm.loading = true;
                //vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                //vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                purchaseReturnService.exportToExcel(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };


            vm.approveAllMethod = function () {
                vm.ids = [];
                angular.forEach(vm.gridOptions.data, function (purchaseReturn) {
                    if (!purchaseReturn.isAuthorized) {
                        vm.ids.push(purchaseReturn.id);
                    }
                });
                purchaseReturnService.approvePurchaseReturns(vm.ids).success(function () {
                    vm.getPurchaseReturns();
                    abp.notify.success(app.localize('SuccessfullyAuthorizePurchaseReturn'));
                });
            };

            vm.deletePurchaseReturn = function (purchaseReturn) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', purchaseReturn.voucherNo),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            purchaseReturnService.deletePurchaseReturn({
                                id: purchaseReturn.id
                            }).success(function () {
                                vm.getPurchaseReturns();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.clearSupplier = function () {
                vm.filters.supplier = null;
                vm.filters.supplierId = null;
                vm.filters.contact = null;
                vm.filters.contactId = null;
            };
            function getLocations() {

                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
            };
            vm.getPurchaseReturns = function () {
                vm.loading = true;


                if (vm.isApprovedEnabled) {
                    vm.approveAllEnableBotton = vm.filters.approvedType == 3 ? true : false;
                }
                //vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                //vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                //if (!vm.filters.enableDateRange) {
                //    vm.filters.fromDate = null;
                //    vm.filters.toDate = null;
                //}
                if (!vm.isApprovedEnabled) {
                    vm.filters.approvedType = null;
                    vm.filters.approvedById = null;
                    vm.filters.createdById = null;
                }
                purchaseReturnService.getPurchaseReturns(vm.filters).success(function (data) {
                    if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null)
                        initDate();
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });

            };

            vm.enterKeyPress = function (eventOnKeyPress) {
                if (eventOnKeyPress.which === 13) {
                    vm.getPurchaseReturns();
                    eventOnKeyPress.preventDefault();
                }
            }

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
                        '      <li><a ng-click="grid.appScope.viewPurchaseReturn(row.entity)">' + app.localize('View') + '</a></li>' +
                        '      <li><a ng-show="grid.appScope.isApprovedEnabled && !row.entity.isAuthorized" ng-if="grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.editPurchaseReturn(row.entity)">' + app.localize('Edit') + '</a></li>' +
                        '      <li><a ng-show="!grid.appScope.isApprovedEnabled" ng-if="grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.editPurchaseReturn(row.entity)">' + app.localize('Edit') + '</a></li>' +
                        '      <li><a ng-click="grid.appScope.openprintModal(row.entity.id)">' + app.localize('Print') + '</a></li>' +
                        //'      <li><a ng-if="grid.appScope.permissions.view" target="_blank" ng-href="/Report#/tenant/printModalDebitNote/{{row.entity.id}}" >' + app.localize('Print Old') + '</a></li>' +
                        '      <li><a ng-if="grid.appScope.permissions.approved && !row.entity.isAuthorized" ng-click="grid.appScope.approvePurchaseReturn(row.entity)">' + app.localize('Approve') + '</a></li>' +
                        '      <li><a ng-show="grid.appScope.isApprovedEnabled && !row.entity.isAuthorized" ng-if="grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.deletePurchaseReturn(row.entity)">' + app.localize('Delete') + '</a></li>' +
                        //'      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.openprintModal(row.entity.id)">' + app.localize('Print') + '</a></li>' +
                            '      <li><a ng-show="!grid.appScope.isApprovedEnabled" ng-if="grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.deletePurchaseReturn(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '      <li><a ng-if="row.entity.isAuthorized && grid.appScope.isJournalEnabled" ng-click="grid.appScope.openJournalViewModal(row.entity)">' + app.localize('Journal') + '</a></li>' +
                        '    </ul>' +
                        '  </div>' +
                        '</div>'
                    },

                    {
                        name: app.localize('PurchaseReturnNo'),
                        type: 'number',
                        field: 'voucherNo',
                        width: 250,
                        cellTemplate:
                        '<div class=\"ui-grid-cell-contents\">' +
                        ' <span >' + '{{row.entity.voucherNo}}' + '&nbsp' + '</span>' +
                        ' <span  ng-show="grid.appScope.isApprovedEnabled && !row.entity.isAuthorized" class="label label-warning">' + app.localize('Not Approved') + '</span>' +
                        ' <span  ng-show="grid.appScope.isApprovedEnabled && row.entity.isAuthorized" class="label label-success">' + app.localize('Approved') + '</span>' +
                        '</div>'
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
                        name: app.localize('Contact'),
                        field: 'contact.name'
                    },
                    {
                        name: app.localize('ContactCode'),
                        field: 'contact.code'
                    },
                    {
                        name: app.localize('Detail'),
                        field: 'notes'
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

                        vm.getPurchaseReturns();
                    });

                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getPurchaseReturns();
                    });
                },
                data: []
            };

            vm.openprintModal = function (id) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/stock/purchaseReturns/printTemplates/printPreview.cshtml',
                    controller: 'tenant.views.stock.purchaseReturns.printTemplates.printPreview as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        purchaseReturnId: function () {
                            return id;
                        }
                    }
                });
            };

            vm.approvePurchaseReturn = function (purchaseReturn) {
                abp.message.okConfirm(
                    //app.localize('OpenAgreementForBookingMessage', 'Press Ok To Open Agreement'),
                    app.localize(''), app.localize('Press Ok To Approve PurchaseReturn'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            purchaseReturnService.approvePurchaseReturn({
                                id: purchaseReturn.id,
                            }).success(function () {
                                vm.getPurchaseReturns();
                                abp.notify.success(app.localize('SuccessfullyAuthorizePurchaseReturn'));
                            });
                        }
                    }
                );
            };

            vm.openJournalViewModal = function (purchaseReturn) {
                openJournalViewModal(purchaseReturn);
            }

            openJournalViewModal = function (purchaseReturn) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/accounting/journal/viewModal.cshtml',
                    controller: 'tenant.views.crs.accounting.journal.viewModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        voucherId: function () {
                            return purchaseReturn.id;
                        },
                        voucherNo: function () {
                            return purchaseReturn.voucherNo;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getPurchaseReturns();
                });
            }

            function init() {
                initDate();
                getLocations();
                vm.getPurchaseReturns();
            }
            init();
        }]);
