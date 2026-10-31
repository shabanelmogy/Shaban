// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:463491-464039
appModule.controller('tenant.views.stock.grns.index', ['$scope', '$uibModal', 'abp.services.app.directory', 'uiGridConstants', 'appSession', 'abp.services.app.commonLookup', 'abp.services.app.grn','utilities',
        function ($scope, $uibModal, directoryService, uiGridConstants, appSession, commonLookupService, grnService, utilities) {

            var vm = this;
            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');
            vm.isFMSEnabled = abp.features.isEnabled("FMS");
            vm.grnAsFinancialVoucher = utilities.parseBoolean(abp.setting.get("App.General.GrnAsFinancialVoucher"));
            vm.isJournalEnabled = abp.auth.hasPermission('Pages.Tenant.Accounts.Journal');
            vm.suppliers = [];
            vm.filters = {
                enableDateRange: true,
                voucherNo: null,
                parentVoucherId: null,
                refNo2: null,
                fromDate: null,
                toDate: null,
                locationId: null,
                contactId: null,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            }
            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.Vouchers.PurchaseOrders.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.Vouchers.PurchaseOrders.Edit'),
                view: abp.auth.hasPermission('Pages.Tenant.Vouchers.PurchaseOrders.View'),
                void: abp.auth.hasPermission('Pages.Tenant.Vouchers.PurchaseOrders.Void'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Vouchers.PurchaseOrders.Delete'),
                allActionsOnOtherBranch: abp.auth.hasPermission('Pages.Tenant.Vouchers.PurchaseOrders.AllActionsOnOtherBranchPurchaseOrders'),

                viewOtherBranch: abp.auth.hasPermission('Pages.Tenant.Vouchers.PurchaseOrders.ViewOtherBranchPurchaseOrders'),
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
            vm.getStatus = function (id) {
                return utilities.getVoucherStatuses(id);
            };
            function getStatuses() {
                vm.statuses = [{ id: 1, name: app.localize("Open") }, { id: 2, name: app.localize("Closed") }, { id: 5, name: app.localize("Voided") }
                ];
            };
            vm.searchSupplier = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 3 }).then(function (response) {
                    vm.suppliers = response.data.items;
                });
            };

            vm.clearSupplier = function () {
                vm.filters.contact = null;
                vm.filters.contactId = null;
            };

            // extended search using search contact popup
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
                }).result.then(function (contact) {
                    if (contact != null) {
                        vm.filters.contact = contact;
                        vm.filters.contactId = contact.id;
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

            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().add(-29, 'days').startOf('day'),
                    endDate: moment().endOf('day')
                };
            }

            function getLocationsActiveAndInActive() {
                vm.loading = true;
                commonLookupService.getLocationsActiveAndInActive({}).success(function (data) {
                    vm.locations = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.getGrns = function () {

                vm.loading = true;

                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
                grnService.getGrns(vm.filters).success(function (data) {
                    if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null)
                        initDate();
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;

                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.getBills = function () {
                vm.loading = true;
                if (vm.isApprovedEnabled) {
                    vm.approveAllEnableBotton = vm.filters.approvedType == 3 ? true : false;
                }
                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc

                //vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                //vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                if (vm.filters.supplier != null)
                    vm.filters.contact = vm.filters.supplier.name;
                if (vm.filters.vehicle != null)
                    vm.filters.vehicleId = vm.filters.vehicle.id;

                //if (!vm.filters.enableDateRange) {
                //    vm.filters.fromDate = null;
                //    vm.filters.toDate = null;
                //}
                if (!vm.isApprovedEnabled) {
                    vm.filters.approvedType = null;
                    vm.filters.approvedById = null;
                    vm.filters.createdById = null;
                }
                billService.getBills(vm.filters).success(function (data) {
                    if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null)
                        initDate();
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                    vm.gridOptions.data.forEach(function (value) {
                        value.printObj = {
                            id: value.id,
                            printHeader: vm.filters.printingWithoutLogo
                        };
                    });
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.voidGrn = function (grn) {
                if (grn.voucherSubTypeId == 49 && !grn.isNonFinancialVoucher) {
                    abp.message.confirm(
                        app.localize('AssetVoidWarningMessage', grn.voucherNo),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                vm.loading = true;
                                grnService.voidGrn({
                                    id: grn.id
                                }).success(function () {
                                    vm.getGrns();
                                    abp.notify.success(app.localize('SuccessfullyVoided'));
                                }).error(function (data) {
                                    if (data) {
                                        setTimeout(() => abp.message.info(data.message), 300);
                                    }

                                }).finally(function () { vm.loading = false; });
                            }
                        }
                    );
                }
                else {
                    abp.message.confirm(
                        app.localize('VoidWarningMessage', grn.voucherNo),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                vm.loading = true;
                                grnService.voidGrn({
                                    id: grn.id
                                }).success(function () {
                                    vm.getGrns();
                                    abp.notify.success(app.localize('SuccessfullyVoided'));
                                }).error(function (data) {
                                    if (data) {
                                        setTimeout(() => abp.message.info(data.message), 300);
                                    }

                                }).finally(function () { vm.loading = false; });
                            }
                        }
                    );
                }
                
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
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewGrn(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="!grid.appScope.grnAsFinancialVoucher && row.entity.status != 5  && !row.entity.isBillCreated" ng-click="grid.appScope.createBill(row.entity)">' + app.localize('CreateBill') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit && row.entity.status != 5  && grid.appScope.locationPermission(row.entity) && (row.entity.voucherSubTypeId!=49 || row.entity.voucherSubTypeId!=101)" ng-click="grid.appScope.editGrn(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.view " ng-click="grid.appScope.openprintModal(row.entity.id)">' + app.localize('Print') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete && row.entity.status != 5  && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.deleteGrn(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.void && row.entity.status != 5  && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.voidGrn(row.entity)">' + app.localize('Void') + '</a></li>' +
                            /*'      <li><a ng-if="grid.appScope.permissions.void && row.entity.isAuthorized && row.entity.voucherSubTypeId != 61 && row.entity.voucherSubTypeId != 62 && row.entity.voucherStatus != 5 && grid.appScope.isAccountsEnabled" ng-click="grid.appScope.voidGrn(row.entity)">' + app.localize('Void') + '</a></li>' +*/
                            '      <li><a ng-if="grid.appScope.isJournalEnabled" ng-click="grid.appScope.openJournalViewModal(row.entity)">' + app.localize('Journal') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('No'),
                        type: 'number',
                        field: 'voucherNo'
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
                        name: app.localize('LPONo'),
                        type: 'number',
                        field: 'parentVoucher.voucherNo'
                    },
                    {
                        name: app.localize('BillNo'),
                        type: 'number',
                        field: 'refNo'
                    },
                    {
                        name: app.localize('SupplierBillNo'),
                        type: 'number',
                        field: 'refNo2'
                    },
                    {
                        name: app.localize('Supplier'),
                        field: 'contact.name',
                        width: 150,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\"><span ng-if="row.entity.customer.hasCard" class="label label-warning">CC</span>{{row.entity.contact.name}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('SupplierCode'),
                        field: 'contact.name',
                        width: 150,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\"><span ng-if="row.entity.customer.hasCard" class="label label-warning">CC</span>{{row.entity.contact.code}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('NetAmount'),
                        field: 'amount',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\"><span ng-if=\"grid.appScope.isMultiCurrencyEnabled&&row.entity.currency\">{{row.entity.currency.code}}</span> {{grid.appScope.roundingforView(row.entity.amount)}}</div>' +
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


                        vm.getGrns();
                    });

                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getGrns();
                    });
                },
                data: []
            };



            vm.createBill = function (grn) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/bills/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.bills.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        options: function () {
                            return {
                                grnId: grn.id,
                                currencyId: vm.isMultiCurrencyEnabled ? grn.contact.currencyId : null,
                                currencyRate: vm.isMultiCurrencyEnabled ? grn.contact.currencyToBaseRate : null
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getGrns();
                });
            };



            vm.openprintModal = function (id) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/stock/grns/printTemplates/printPreview.cshtml',
                    controller: 'tenant.views.stock.grns.printPreview as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        grnId: function () {
                            return id;
                        }
                    }
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
                            return '~/App/tenant/views/crs/vouchers/purchaseOrders/report.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };


            vm.taxReport = function () {
                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/stock/grns/taxReport.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };

            function openCreateOrEditGrnModal(Id) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/stock/grns/createOrEditModal.cshtml',
                    controller: 'tenant.views.stock.grns.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        options: function () {
                            return {
                                grnId: Id,
                            };
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getGrns();
                });
            }

            function openViewGrnModal(Id) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/stock/grns/viewModal.cshtml',
                    controller: 'tenant.views.stock.grns.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        options: function () {
                            return {
                                grnId: Id,
                            };
                        }
                    }
                });

            }

            vm.createGrn = function () {

                openCreateOrEditGrnModal(null);
            };

            vm.editGrn = function (grn) {
                openCreateOrEditGrnModal(grn.id);
            };

            vm.exportToExcel = function () {
                vm.loading = true;
                grnService.exportToExcel(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };


            vm.viewGrn = function (grn) {
                openViewGrnModal(grn.id);
            };
            
            vm.deleteGrn = function (grn) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', grn.voucherNo),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            grnService.deleteGrn({
                                id: grn.id
                            }).success(function () {
                                vm.getGrns();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
                vm.getGrns();
            };

            vm.enterKeyPress = function (eventOnKeyPress) {
                if (eventOnKeyPress.which === 13) {
                    vm.getGrns();
                    eventOnKeyPress.preventDefault();
                }
            }

            vm.openJournalViewModal = function (grn) {
                openJournalViewModal(grn);
            }

            openJournalViewModal = function (grn) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/accounting/journal/viewModal.cshtml',
                    controller: 'tenant.views.crs.accounting.journal.viewModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        voucherId: function () {
                            return grn.id;
                        },
                        voucherNo: function () {
                            return grn.voucherNo;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getGrns();
                });
            }

            function init() {
                getLocationsActiveAndInActive();
                initDate();
                vm.getGrns();
                getStatuses();
            }
            init();
        }]);
