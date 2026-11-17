// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:380995-381677
appModule.controller('tenant.views.crs.vouchers.purchaseOrders.index', ['abp.services.app.purchaseOrder', '$scope', '$uibModal', 'abp.services.app.directory', 'uiGridConstants', 'appSession', 'abp.services.app.commonLookup', 'abp.services.app.vehicle', 'utilities',
        function (purchaseOrdersService, $scope, $uibModal, directoryService, uiGridConstants, appSession, commonLookupService, vehicleService, utilities) {

            var vm = this;
            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.isCreateMultipleBillsOnPurchaseOrderEnabled = abp.setting.get("App.General.CreateMultipleBillsOnPurchaseOrder");
            vm.doNotAllowDiscount = utilities.parseBoolean(abp.setting.get("App.Speed.Common.DoNotAllowDiscountInPO"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');
            vm.isFMSEnabled = abp.features.isEnabled("FMS");
            vm.isApprovedEnabled = abp.features.isEnabled("CRS.Vouchers.Approval.PurchaseOrders");
            vm.isExportToExcelDetailedEnabled = abp.features.isEnabled("CRS.Vouchers.PurchaseOrders.ExportToExcelDetailed");
            vm.isGRNEnabled = abp.features.isEnabled("CRS_Vouchers_GoodsReceiptNotes");
            vm.isApprovedEnabled = abp.features.isEnabled("CRS.Vouchers.Approval.PurchaseOrders");
            vm.isGenerateBillsForPOsEnabled = abp.features.isEnabled('CRS.CustomFeatures.GenerateBillsForPOs');
            vm.isAlmasoodER = appSession.tenant.tenancyName.toLowerCase() == 'almasaooder';
            vm.showOnlyDueInvoices = abp.setting.getBoolean("App.Speed.Common.ShowOnlyDueInvoices");


            vm.suppliers = [];
            vm.filters = {
                enableDateRange: true,
                voucherNo: null,
                vehicleId: null,
                refNo: null,
                fromDate: null,
                toDate: null,
                locationId: null,
                contactId: null,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                //billCreated: null,
                billStatus: null,
                paginate: true,
                dueDateRange: false

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
                approved: abp.auth.hasPermission('Pages.Tenant.Vouchers.PurchaseOrders.Approve'),
                canApprovedOther: abp.auth.hasPermission('Pages.Tenant.Vouchers.PurchaseOrders.CanApproveOtherPurchaseOrders'),
                reject: abp.auth.hasPermission('Pages.Tenant.Vouchers.PurchaseOrders.Reject'),
                exportToExcel: abp.auth.hasPermission('Pages.Tenant.Vouchers.PurchaseOrders.ExportToExcel'),
                unApprove: abp.auth.hasPermission('Pages.Tenant.Vouchers.PurchaseOrders.UnApprove'),
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


            vm.allBranchPermission = function (row) {
                if (row.locationId) {
                    if (vm.permissions.approved && !vm.permissions.canApprovedOther && (row.locationId === appSession.user.locationId)) {
                        return true;
                    }
                    if (vm.permissions.canApprovedOther && !vm.permissions.approved && ((row.locationId != appSession.user.locationId) || (row.locationId === appSession.user.locationId))) {
                        return true;
                    }
                    if (vm.permissions.canApprovedOther && vm.permissions.approved && ((row.locationId != appSession.user.locationId) || (row.locationId === appSession.user.locationId))) {
                        return true;
                    }

                }
                return false;
            };

            vm.approvedTypes = [{ id: 2, name: 'Approved' }, { id: 3, name: 'Not Approved' }, { id: 4, name: 'Rejected' }];
            vm.billStatus = [{ id: 2, name: 'Billed' }, { id: 3, name: 'Not Billed' }];

            vm.searchAdditionalDriverPopoup = function () {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/fms/vehicleAssignments/searchOrganizationContactModal.cshtml',
                    controller: 'tenant.views.fms.vehicleAssignments.searchOrganizationContactModal as vm',
                    backdrop: 'static',
                    size: 'lg'
                });

                modalInstance.result.then(function (requestedBy) {
                    vm.filters.requestedBy = requestedBy;
                    vm.filters.requestedById = requestedBy.id;
                });
            };

            vm.searchSupplier = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 3, }).then(function (response) {
                    vm.suppliers = response.data.items;
                });
            };

            vm.clearSupplier = function () {
                vm.filters.supplier = null;
                vm.filters.contact = null;
                vm.filters.contactId = null;
            };
            vm.clearVehicle = function () {
                vm.filters.vehicle = null;
                vm.filters.vehicleId = null;
            };
            vm.searchVehicles = function ($select) {
                if ($select.search == "") { vm.vehicles = null; return null; }
                return vehicleService.searchVehicles({ plateNo: $select.search, includeDefleeted: true }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
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
                }).result.then(function (supplier) {
                    if (supplier != null) {
                        vm.filters.supplier = supplier;
                        vm.filters.contactId = supplier.id;
                    }
                });
            };

            vm.isPrintEnabled = function (voucher) {
                return utilities.canPrintVoucher(voucher);
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

            vm.createGrnOnPo = function (stockPo) {
                var currencyRate = null;
                if (vm.isMultiCurrencyEnabled) {
                    if (stockPo.customerCurrency)
                        currencyRate = stockPo.customerCurrency.currencyToBaseRate;
                }
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/stock/grns/createOrEditModal.cshtml',
                    controller: 'tenant.views.stock.grns.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        options: function () {
                            return {
                                stockPoId: stockPo.id,
                                type: stockPo.voucherSubTypeId,
                                currencyId: vm.isMultiCurrencyEnabled ? stockPo.contact.currencyId : null,
                                currencyRate: currencyRate

                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getPurchaseOrders();
                });
            };

            vm.createBillOnPO = function (purchaseOrder) {
                openCreatePurchaseOrderOnBillModal(purchaseOrder);
            };
            openCreatePurchaseOrderOnBillModal = function (bill) {
                if (bill.voucherSubTypeId == 39)
                    var stockPoId = bill.id
                if (bill.voucherSubTypeId == 39 || bill.voucherSubTypeId == 40)
                    var assetOrStockPoId = bill.id;

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/bills/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.bills.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'full',
                  /*  size: 'xl',*/
                    resolve: {
                        options: function () {
                            return {
                                purchaseOrder: bill,
                                billId: null,
                                stockPoId: stockPoId,
                                assetOrStockPoId: assetOrStockPoId
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getPurchaseOrders();
                });
            };
            vm.getPurchaseOrders = function () {

                vm.loading = true;

                //vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                //vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                //if (vm.filters.supplier != null)
                //    vm.filters.contact = vm.filters.supplier.name;
                //if (vm.filters.vehicle != null)
                //    vm.filters.vehicleId = vm.filters.vehicle.id;


                //if (vm.isApprovedEnabled) {
                //    vm.approveAllEnableBotton = vm.filters.approvedType == 3 ? true : false;
                //}
                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
                if (vm.filters.vehicle != null) {
                    vm.filters.vehicleId = vm.filters.vehicle.id;
                }
                //if (!vm.isApprovedEnabled) {
                //    vm.filters.approvedType = null;
                //    vm.filters.approvedById = null;
                //    vm.filters.createdById = null;
                //}
                purchaseOrdersService.getPurchaseOrders(vm.filters).success(function (data) {
                    if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null)
                        initDate();
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;


                }).finally(function () {
                    vm.loading = false;
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
                purchaseOrdersService.exportToExcel(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };
            vm.exportToExcelDetailed = function () {
                vm.loading = true;
                purchaseOrdersService.exportToExcelDetailed(vm.filters)
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
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewPurchaseOrder(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-show="grid.appScope.isApprovedEnabled && !row.entity.isAuthorized && row.entity.status!=4" ng-if="grid.appScope.permissions.edit && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.editPurchaseOrder(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-show="!grid.appScope.isApprovedEnabled" ng-if="grid.appScope.permissions.edit && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.editPurchaseOrder(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-show="grid.appScope.isApprovedEnabled && row.entity.isAuthorized && row.entity.status!=4" ng-if="grid.appScope.permissions.create && grid.appScope.locationPermission(row.entity) && (!row.entity.isBillCreated||grid.appScope.isAlmasoodER) && (row.entity.voucherSubTypeId==38 || !grid.appScope.isGRNEnabled) " ng-click="grid.appScope.createBillOnPO(row.entity)">' + app.localize('CreateBill') + '</a></li>' +
                            '      <li><a ng-show="!grid.appScope.isApprovedEnabled" ng-if="grid.appScope.permissions.create && grid.appScope.locationPermission(row.entity) && (!row.entity.isBillCreated||grid.appScope.isAlmasoodER) && (row.entity.voucherSubTypeId==38 || !grid.appScope.isGRNEnabled) " ng-click="grid.appScope.createBillOnPO(row.entity)">' + app.localize('CreateBill') + '</a></li>' +
                            '      <li><a ng-show="grid.appScope.isApprovedEnabled && row.entity.isAuthorized && row.entity.status!=4" ng-if="grid.appScope.isGRNEnabled && grid.appScope.permissions.create && grid.appScope.locationPermission(row.entity) && !row.entity.isClosed && (row.entity.voucherSubTypeId==39 || row.entity.voucherSubTypeId==40 || row.entity.voucherSubTypeId==100) " ng-click="grid.appScope.createGrnOnPo(row.entity)">' + app.localize('CreateGRN') + '</a></li>' +
                            '      <li><a ng-show="!grid.appScope.isApprovedEnabled" ng-if="grid.appScope.isGRNEnabled && grid.appScope.permissions.create && grid.appScope.locationPermission(row.entity) && !row.entity.isClosed && (row.entity.voucherSubTypeId==39 || row.entity.voucherSubTypeId==40 || row.entity.voucherSubTypeId==100) " ng-click="grid.appScope.createGrnOnPo(row.entity)">' + app.localize('CreateGRN') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.allBranchPermission(row.entity) && !row.entity.isAuthorized && row.entity.status!=4" ng-click="grid.appScope.approvePurchaseOrder(row.entity)">' + app.localize('Approve') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.unApprove && row.entity.isAuthorized && row.entity.status!=4" ng-click="grid.appScope.unApprovePurchaseOrder(row.entity)">' + app.localize('UnApprove') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.reject && !row.entity.isAuthorized && row.entity.status!=4" ng-click="grid.appScope.rejectPurchaseOrder(row.entity)">' + app.localize('Reject') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.view && grid.appScope.isPrintEnabled(row.entity)" ng-click="grid.appScope.openprintModal(row.entity.id)">' + app.localize('Print') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.permissions.view" target="_blank" ng-href="/Report#/tenant/printModalPurchaseOrders/{{row.entity.id}}" >' + app.localize('Print Old') + '</a></li>' +
                            '      <li><a ng-show="grid.appScope.isApprovedEnabled && !row.entity.isAuthorized && row.entity.status!=4" ng-if="grid.appScope.permissions.delete && grid.appScope.locationPermission(row.entity) " ng-click="grid.appScope.deletePurchaseOrder(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '      <li><a ng-show="!grid.appScope.isApprovedEnabled" ng-if="grid.appScope.permissions.delete && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.deletePurchaseOrder(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },

                    {
                        name: app.localize('No'),
                        type: 'number',
                        field: 'voucherNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.voucherNo}}' + '&nbsp' + '</span>' +
                            ' <span  ng-show="grid.appScope.isApprovedEnabled && !row.entity.isAuthorized && row.entity.status!=4" class="label label-warning">' + app.localize('Not Approved') + '</span>' +
                            ' <span  ng-show="grid.appScope.isApprovedEnabled && !row.entity.isAuthorized && row.entity.status==4" class="label label-danger">' + app.localize('Rejected') + '</span>' +
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
                        name: app.localize('RequestedBy'),
                        field: 'requestedBy.name',
                        visible: vm.isFMSEnabled
                    },
                    {
                        name: app.localize('MasterAgreementNo'),
                        field: 'masterAgreement.agreementNo',
                    },
                    {
                        name: app.localize('Notes'),
                        field: 'notes',
                    },
                    {
                        name: app.localize('TotalAmount'),
                        type: 'number',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.roundingforView(row.entity.amount + row.entity.discount)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Discount'),
                        field: 'discount',
                        visible: !vm.doNotAllowDiscount,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.roundingforView(row.entity.discount)}}</div>' +
                            '</div>'

                    },
                    {
                        name: app.localize('NetAmount'),
                        field: 'amount',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\"><span ng-if="grid.appScope.isMultiCurrencyEnabled" >{{row.entity.customerCurrency.code}} </span>{{grid.appScope.roundingforView(row.entity.amount)}}</div>' +
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


                        vm.getPurchaseOrders();
                    });

                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getPurchaseOrders();
                    });
                },
                data: []
            };

            vm.openprintModal = function (id) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/purchaseOrders/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.vouchers.deposits.purchaseOrders.printPreview as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        purchaseOrderId: function () {
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
                    size: 'xl',
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

            vm.generateBillsOnPOs = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/purchaseOrders/generateBills.cshtml',
                    controller: 'tenant.views.crs.vouchers.purchaseOrders.generateBills as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
                modalInstance.result.then(function () {
                    vm.filters.billStatus = null;
                    vm.filters.paginate = true;
                });
            };

            openCreateOrEditPurchaseOrderModal = function (purchaseOrderId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/purchaseOrders/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.purchaseOrders.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    //resolve: {
                    //    purchaseOrderId: function () {
                    //        return purchaseOrderId;
                    //    }
                    //}
                    resolve: {
                        options: function () {
                            return {
                                purchaseOrderId: purchaseOrderId,
                            }
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getPurchaseOrders();
                });
            }

            openViewPurchaseOrderModal = function (purchaseOrderId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/purchaseOrders/viewModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.purchaseOrders.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    //resolve: {
                    //    purchaseOrderId: function () {
                    //        return purchaseOrderId;
                    //    }
                    //}
                    resolve: {
                        options: function () {
                            return {
                                purchaseOrderId: purchaseOrderId,
                            }
                        }
                    }
                });

            }
            vm.createPurchaseOrder = function () {
                openCreateOrEditPurchaseOrderModal(null);
            };

            vm.viewPurchaseOrder = function (purchaseOrder) {
                openViewPurchaseOrderModal(purchaseOrder.id);
            };

            vm.editPurchaseOrder = function (purchaseOrder) {
                openCreateOrEditPurchaseOrderModal(purchaseOrder.id);
            };

            vm.deletePurchaseOrder = function (purchaseOrder) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', purchaseOrder.voucherNo),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            purchaseOrdersService.deletePurchaseOrder({
                                id: purchaseOrder.id
                            }).success(function () {
                                vm.getPurchaseOrders();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.enterKeyPress = function (eventOnKeyPress) {
                if (eventOnKeyPress.which === 13) {
                    vm.getPurchaseOrders();
                    eventOnKeyPress.preventDefault();
                }
            }


            vm.approvePurchaseOrder = function (purchaseOrder) {
                abp.message.okConfirm(
                    //app.localize('OpenAgreementForBookingMessage', 'Press Ok To Open Agreement'),
                    app.localize(''), app.localize('Press Ok To Approve Purchase Order'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            purchaseOrdersService.approvePurchaseOrder({
                                id: purchaseOrder.id,
                            }).success(function () {
                                vm.getPurchaseOrders();
                                abp.notify.success(app.localize('SuccessfullyAuthorizePurchaseOrder'));
                            });
                        }
                    }
                );
            };

            vm.unApprovePurchaseOrder = function (purchaseOrder) {
                abp.message.okConfirm(
                    //app.localize('OpenAgreementForBookingMessage', 'Press Ok To Open Agreement'),
                    app.localize(''), app.localize('Press Ok To  UnApprove Purchase Order'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            purchaseOrdersService.unApprovePurchaseOrder({
                                id: purchaseOrder.id,
                            }).success(function () {
                                vm.getPurchaseOrders();
                                abp.notify.success(app.localize('SuccessfullyUnAuthorizePurchaseOrder'));
                            });
                        }
                    }
                );
            };

            vm.rejectPurchaseOrder = function (purchaseOrder) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/common/rejectReason.cshtml',
                    controller: 'tenant.views.crs.vouchers.common.rejectReason as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        message: function () {
                            return app.localize('DoYouWantToRejectThis{0}', "Purchase Order?");
                        },
                        title: function () {
                            return app.localize('PurchaseOrder');
                        }



                    }
                });
                modalInstance.result.then(function (result) {
                    purchaseOrder.rejectionReason = result;
                    rejectpurchaseOrdersRequest(purchaseOrder);
                });
                //abp.message.confirm(
                //    //app.localize('OpenAgreementForBookingMessage', 'Press Ok To Open Agreement'),
                //    app.localize(''), app.localize('Press Ok To Reject Purchase Order'),
                //    function (isConfirmed) {
                //        if (isConfirmed) {
                //            purchaseOrdersService.rejectPurchaseOrder({
                //                id: purchaseOrder.id,
                //            }).success(function () {
                //                vm.getPurchaseOrders();
                //                abp.notify.success(app.localize('SuccessfullyRejectPurchaseOrder'));
                //            });
                //        }
                //    }
                //);
            };

            function rejectpurchaseOrdersRequest(purchaseOrder) {
                var input = {};
                input.id = purchaseOrder.id;
                input.rejectionReason = purchaseOrder.rejectionReason;
                purchaseOrdersService.rejectPurchaseOrder(input)
                    .success(function () {
                        vm.getPurchaseOrders();
                        abp.notify.success(app.localize('SuccessfullyRejectPurchaseOrder'));
                    });
            }

            function init() {
                getLocationsActiveAndInActive();
                initDate();
                vm.getPurchaseOrders();
            }
            init();
        }]);
