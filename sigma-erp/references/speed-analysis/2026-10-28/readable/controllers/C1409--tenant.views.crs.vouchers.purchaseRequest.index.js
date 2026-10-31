// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:383927-384569
appModule.controller('tenant.views.crs.vouchers.purchaseRequest.index', ['abp.services.app.purchaseRequest', '$scope', '$uibModal', 'abp.services.app.directory', 'uiGridConstants', 'appSession', 'abp.services.app.commonLookup', 'abp.services.app.vehicle','utilities',
        function (purchaseRequestService, $scope, $uibModal, directoryService, uiGridConstants, appSession, commonLookupService, vehicleService, utilities) {

            var vm = this;
            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.isSimplePurchaseRequestFormEnabled = utilities.parseBoolean(abp.setting.get("App.Speed.Common.SimplePurchaseRequest"));
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.isFMSEnabled = abp.features.isEnabled("FMS");
            vm.isMultiCurrencyEnabled = abp.features.isEnabled('Core.MultiCurrency');
            vm.isGRNEnabled = abp.features.isEnabled("CRS_Vouchers_GoodsReceiptNotes");
            vm.isGRNEnabled = abp.features.isEnabled("CRS_Vouchers_GoodsReceiptNotes");
            vm.isMultiLevelApprovalEnabled = abp.features.isEnabled("CRS.Approval.PurchaseRequests");
            vm.isApprovedEnabled = abp.features.isEnabled("CRS.Vouchers.Approval.PurchaseRequests");

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
                isClosed: 0,
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
                create: abp.auth.hasPermission('Pages.Tenant.Vouchers.PurchaseRequest.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.Vouchers.PurchaseRequest.Edit'),
                view: abp.auth.hasPermission('Pages.Tenant.Vouchers.PurchaseRequest.View'),
                approved: abp.auth.hasPermission('Pages.Tenant.Vouchers.PurchaseRequest.Approve'),
                unapproved: abp.auth.hasPermission('Pages.Tenant.Vouchers.PurchaseRequest.UnApprove'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Vouchers.PurchaseRequest.Delete'),
                allActionsOnOtherBranch: abp.auth.hasPermission('Pages.Tenant.Vouchers.PurchaseRequest.ViewOtherBranchPurchaseRequests'),
                viewOtherBranch: abp.auth.hasPermission('Pages.Tenant.Vouchers.PurchaseRequest.ViewOtherBranchPurchaseOrders'),
                limitedView: abp.auth.hasPermission('Pages.Tenant.Vouchers.PurchaseRequest.LimitedView')
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

            vm.approvedTypes = [{ id: 2, name: 'Approved' }, { id: 3, name: 'Not Approved' }];

            function getStatuses() {
                vm.statuses = [{ id: 0, name: app.localize("Open") }, { id: 1, name: app.localize("Closed") }];
            };

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
                return vehicleService.searchVehicles({ plateNo: $select.search }).then(function (response) {
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

            function getLocations() {
                vm.loading = true;
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.createPurchaseOrderOnPurcasheRequest = function (po) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/purchaseOrders/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.purchaseOrders.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        options: function () {
                            return {
                                purchaseRequestId: po.id,
                                type: po.voucherSubTypeId,
                                currencyId: vm.isMultiCurrencyEnabled && po.contact && po.contact.currency ? po.contact.currency.id : null,
                                currencyRate: vm.isMultiCurrencyEnabled && po.contact && po.contact.currency ? po.contact.currency.currencyToBaseRate : 0,
                                 
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getPurchaseRequests();
                });
            };

            vm.createBillOnPO = function (purchaseOrder) {
                openCreatePurchaseOrderOnBillModal(purchaseOrder);
            };
            openCreatePurchaseOrderOnBillModal = function (bill) {
                if (bill.voucherSubTypeId == 53)
                    var stockPoId = bill.id
                if (bill.voucherSubTypeId == 53 || bill.voucherSubTypeId == 54)
                    var assetOrStockPoId = bill.id;

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/bills/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.bills.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
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
                    vm.getPurchaseRequests();
                });
            };
            vm.getPurchaseRequests = function () {
                vm.loading = true;
                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
                if (vm.filters.vehicle != null) {
                    vm.filters.vehicleId = vm.filters.vehicle.id;
                }
                purchaseRequestService.getPurchaseRequests(vm.filters).success(function (data) {
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
                purchaseRequestService.exportToExcel(vm.filters)
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
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewPurchaseRequest(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="!grid.appScope.permissions.view && grid.appScope.permissions.limitedView" ng-click="grid.appScope.viewPurchaseRequestInitial(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-show="grid.appScope.isApprovedEnabled && !row.entity.isAuthorized" ng-if="grid.appScope.permissions.edit && grid.appScope.locationPermission(row.entity) && row.entity.status != 4" ng-click="grid.appScope.editPurchaseRequest(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-show="!grid.appScope.isApprovedEnabled" ng-if="grid.appScope.permissions.edit && grid.appScope.locationPermission(row.entity) && row.entity.status != 4" ng-click="grid.appScope.editPurchaseRequest(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-show="grid.appScope.isApprovedEnabled && row.entity.isAuthorized" ng-if="grid.appScope.permissions.create && grid.appScope.locationPermission(row.entity) && !row.entity.isPoCreated && row.entity.status != 4" ng-click="grid.appScope.createPurchaseOrderOnPurcasheRequest(row.entity)">' + app.localize('CreatePo') + '</a></li>' +
                            '      <li><a ng-show="!grid.appScope.isApprovedEnabled" ng-if="grid.appScope.permissions.create && grid.appScope.locationPermission(row.entity) && !row.entity.isPoCreated && row.entity.status != 4" ng-click="grid.appScope.createPurchaseOrderOnPurcasheRequest(row.entity)">' + app.localize('CreatePo') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.permissions.approved && !row.entity.isAuthorized" ng-click="grid.appScope.approvePurchaseRequest(row.entity)">' + app.localize('Approve') + '</a></li>' +
                            '      <li><a ng-if="(grid.appScope.isMultiLevelApprovalEnabled && (!row.entity.approvals || row.entity.approvals.length <= 0)) && grid.appScope.permissions.approved && !row.entity.isAuthorized && row.entity.status != 4" ng-click="grid.appScope.multiLevelApprovePurchaseRequest(row.entity)">' + app.localize('Approve/Reject') + '</a></li>' +
                            '      <li><a ng-if="(!grid.appScope.isMultiLevelApprovalEnabled || (row.entity.approvals && row.entity.approvals.length > 0)) && grid.appScope.permissions.approved && !row.entity.isAuthorized && row.entity.status != 4" ng-click="grid.appScope.approvePurchaseRequest(row.entity)">' + app.localize('Approve') + '</a></li>' +
                            '      <li><a ng-if="(!grid.appScope.isMultiLevelApprovalEnabled || (row.entity.approvals && row.entity.approvals.length > 0)) && grid.appScope.permissions.unapproved && row.entity.isAuthorized" ng-click="grid.appScope.unapprovePurchaseRequest(row.entity)">' + app.localize('UnApprove') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.openprintModal(row.entity.id)">' + app.localize('Print') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.permissions.view" target="_blank" ng-href="/Report#/tenant/printModalPurchaseOrders/{{row.entity.id}}" >' + app.localize('Print Old') + '</a></li>' +
                            '      <li><a ng-show="grid.appScope.isApprovedEnabled && !row.entity.isAuthorized" ng-if="grid.appScope.permissions.delete && grid.appScope.locationPermission(row.entity) && row.entity.status != 4" ng-click="grid.appScope.deletePurchaseRequest(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '      <li><a ng-show="!grid.appScope.isApprovedEnabled" ng-if="grid.appScope.permissions.delete && grid.appScope.locationPermission(row.entity) && row.entity.status != 4" ng-click="grid.appScope.deletePurchaseRequest(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },

                    {
                        name: app.localize('No'),
                        type: 'number',
                        width: 160,
                        field: 'voucherNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.voucherNo}}' + '&nbsp' + '</span>' +
                            ' <span  ng-show="grid.appScope.isApprovedEnabled && !row.entity.isAuthorized && row.entity.status != 4" class="label label-warning">' + app.localize('Not Approved') + '</span>' +
                            ' <span  ng-show="grid.appScope.isApprovedEnabled && row.entity.isAuthorized" class="label label-success">' + app.localize('Approved') + '</span>' +
                            ' <span  ng-show="grid.appScope.isApprovedEnabled && row.entity.status == 4" class="label label-danger">' + app.localize('Rejected') + '</span>' +
                            '<span ng-show="grid.appScope.isApprovedEnabled && (!grid.appScope.isMultiLevelApprovalEnabled || (row.entity.approvals && row.entity.approvals.length > 0))" style="margin-left: 5px;width:10px"><a class="btn btn-circle btn-xs green-haze" style="padding:0px 3px 0px 3px" ng-click="grid.appScope.viewApprovals(row.entity)" title="View Approvals"><i class="fa fa-eye "></i></a></span>' +
                            '<span ng-show="grid.appScope.isMultiLevelApprovalEnabled && (!row.entity.approvals || row.entity.approvals.length <= 0)" style="margin-left: 5px;width:10px"><a class="btn btn-circle btn-xs green-haze" style="padding:0px 3px 0px 3px" ng-click="grid.appScope.viewMultiLevelApprovals(row.entity)" title="View Approvals"><i class="fa fa-eye "></i></a></span>' +
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
                            '<div class=\"ui-grid-cell-contents\"><span ng-if="grid.appScope.isMultiCurrencyEnabled" >{{row.entity.contact.currency.code}} </span>{{grid.appScope.roundingforView(row.entity.amount)}}</div>' +
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


                        vm.getPurchaseRequests();
                    });

                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getPurchaseRequests();
                    });
                },
                data: []
            };

            vm.openprintModal = function (id) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/purchaseRequest/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.vouchers.purchaseRequest.printPreview as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        purchaseRequestId: function () {
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
                            return '~/App/tenant/views/crs/vouchers/purchaseRequest/report.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };

            openCreateOrEditPurchaseRequestModal = function (purchaseRequestId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/purchaseRequest/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.purchaseRequest.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        options: function () {
                            return {
                                purchaseRequestId: purchaseRequestId,
                            }
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getPurchaseRequests();
                });
            }

            openCreateOrEditPurchaseRequestModalInitial = function (purchaseRequestId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/purchaseRequest/createOrEditModalInitial.cshtml',
                    controller: 'tenant.views.crs.vouchers.purchaseRequest.createOrEditModalInitial as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        options: function () {
                            return {
                                purchaseRequestId: purchaseRequestId,
                            }
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getPurchaseRequests();
                });
            }

            openViewPurchaseRequestModal = function (purchaseRequestId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/purchaseRequest/viewModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.purchaseRequest.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        options: function () {
                            return {
                                purchaseRequestId: purchaseRequestId,
                            }
                        }
                    }
                });

            }

            openViewPurchaseRequestModalInitial = function (purchaseRequestId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/purchaseRequest/viewModalInitial.cshtml',
                    controller: 'tenant.views.crs.vouchers.purchaseRequest.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        options: function () {
                            return {
                                purchaseRequestId: purchaseRequestId,
                            }
                        }
                    }
                });

            }
            vm.createPurchaseRequest = function () {
                if (vm.isSimplePurchaseRequestFormEnabled)
                    openCreateOrEditPurchaseRequestModalInitial(null);
                else
                    openCreateOrEditPurchaseRequestModal(null);
            };

            vm.viewPurchaseRequest = function (purchaseRequest) {
                openViewPurchaseRequestModal(purchaseRequest.id);
            };

            vm.viewPurchaseRequestInitial = function (purchaseRequest) {
                openViewPurchaseRequestModalInitial(purchaseRequest.id);
            };

            vm.editPurchaseRequest = function (purchaseRequest) {
                openCreateOrEditPurchaseRequestModal(purchaseRequest.id);
            };

            vm.deletePurchaseRequest = function (purchaseRequest) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', purchaseRequest.voucherNo),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            purchaseRequestService.deletePurchaseRequest({
                                id: purchaseRequest.id
                            }).success(function () {
                                vm.getPurchaseRequests();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.enterKeyPress = function (eventOnKeyPress) {
                if (eventOnKeyPress.which === 13) {
                    vm.getPurchaseRequests();
                    eventOnKeyPress.preventDefault();
                }
            }


            vm.multiLevelApprovePurchaseRequest = function (row) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/approval/approvalModal.cshtml',
                    controller: 'tenant.views.common.approval.approvalModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        approvalId: function () {
                            return row.approvalId;
                        },
                        form: function () {
                            return 3;
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
                    vm.getPurchaseRequests();
                });
            };

            vm.viewMultiLevelApprovals = function (row) {
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
                            return 3;
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
                    vm.getPurchaseRequests();
                });
            };
            vm.unapprovePurchaseRequest = function (purchaseRequest) {
                abp.message.okConfirm(
                    app.localize(''), app.localize('PressOkToUnApprovePurchaseRequest'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            purchaseRequestService.unApprovePurchaseRequest({
                                id: purchaseRequest.id,
                            }).success(function () {
                                vm.getPurchaseRequests();
                                abp.notify.success(app.localize('SuccessfullyUnAuthorizedPurchaseRequest'));
                            });
                        }
                    }
                );
            };

            vm.approvePurchaseRequest = function (purchaseRequest) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/purchaseRequest/approvalModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.purchaseRequest.approvalModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        purchaseRequest: function () {
                            return purchaseRequest;
                        }
                    }
                })
                modalInstance.result.then(function (result) {
                    vm.getPurchaseRequests();
                });
            };

            vm.viewApprovals = function (purchaseRequest) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/purchaseRequest/approvalViewModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.purchaseRequest.approvalModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        purchaseRequest: function () {
                            return purchaseRequest;
                        }
                    }
                })
                modalInstance.result.then(function (result) {
                    vm.getPurchaseRequests();
                });
            };

            function init() {
                getLocations();
                initDate();
                vm.getPurchaseRequests();
                getStatuses();
            }
            init();
        }]);
