// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:395742-396131
appModule.controller('tenant.views.crs.vouchers.saleOrders.index', ['abp.services.app.saleOrder', '$scope', '$uibModal', 'abp.services.app.directory', 'uiGridConstants', 'appSession', 'abp.services.app.commonLookup', 'abp.services.app.vehicle', 'utilities',
    function (saleOrdersService, $scope, $uibModal, directoryService, uiGridConstants, appSession, commonLookupService, vehicleService, utilities) {

        var vm = this;
        vm.loading = false;
        vm.dateRangeOptions = app.createDateRangePickerOptions();
        vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
        vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
        vm.dateFormat = abp.setting.get("App.General.DateFormat");
        vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
        vm.contacts = [];
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
        }
        vm.CurrencyFormate = function (amount) {
            if (amount == null) return null;
            return amount.toLocaleString('en');
        };
        vm.permissions = {
            create: abp.auth.hasPermission('Pages.Tenant.Vouchers.SaleOrders.Addnew'),
            edit: abp.auth.hasPermission('Pages.Tenant.Vouchers.SaleOrders.Edit'),
            view: abp.auth.hasPermission('Pages.Tenant.Vouchers.SaleOrders.View'),
            'delete': abp.auth.hasPermission('Pages.Tenant.Vouchers.SaleOrders.Delete')
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

        vm.searchContacts = function ($select) {
            //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
            return directoryService.search({ keyword: $select.search, contactType: 2 }).then(function (response) {
                vm.contacts = response.data.items;
            });
        };

        vm.roundingforView = function (value) {
            var roundedValue = utilities.roundforView(value, 2);
            return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        };

        vm.clearContact = function () {
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
                        return 2;
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

        function getLocations() {
            vm.loading = true;
            commonLookupService.getLocations({}).success(function (data) {
                vm.locations = data.items;
            }).finally(function () {
                vm.loading = false;
            });
        };

        vm.getSaleOrders = function () {

            vm.loading = true;

            if (!vm.filters.enableDateRange) {
                vm.filters.fromDate = null;
                vm.filters.toDate = null;
            }
            if (vm.filters.vehicle != null) {
                vm.filters.vehicleId = vm.filters.vehicle.id;
            }

            saleOrdersService.getSaleOrders(vm.filters).success(function (data) {
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
            saleOrdersService.exportToExcel(vm.filters)
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
                        '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewSaleOrder(row.entity)">' + app.localize('View') + '</a></li>' +
                        '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editSaleOrder(row.entity)">' + app.localize('Edit') + '</a></li>' +
                        //'      <li><a ng-if="grid.appScope.permissions.create" ng-click="grid.appScope.createBillOnPO(row.entity)">' + app.localize('CreateBill') + '</a></li>' +
                        '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.openprintModal(row.entity.id)">' + app.localize('Print') + '</a></li>' +
                        //'      <li><a ng-if="grid.appScope.permissions.view" target="_blank" ng-href="/Report#/tenant/printModalSaleOrders/{{row.entity.id}}" >' + app.localize('Print Old') + '</a></li>' +
                        '      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteSaleOrder(row.entity)">' + app.localize('Delete') + '</a></li>' +
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
                    name: app.localize('IssueDate'),
                    field: 'date',
                    cellTemplate:
                        '<div class=\"ui-grid-cell\">' +
                        '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.date)}}</div>' +
                        '</div>'
                },
                {
                    name: app.localize('ExpiryDate'),
                    field: 'date',
                    cellTemplate:
                        '<div class=\"ui-grid-cell\">' +
                        '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.toDate)}}</div>' +
                        '</div>'
                },
                {
                    name: app.localize('RefNo'),
                    field: 'refNo'
                },
                {
                    name: app.localize('Customer'),
                    width: 200,
                    field: 'contact.name',
                    cellTemplate:
                        '<div class=\"ui-grid-cell\">' +
                        '<div class=\"ui-grid-cell-contents\"><span>{{row.entity.contact.name}}</span></div>' +
                        '</div>'
                },
                {
                    name: app.localize('CustomerCode'),
                    width: 200,
                    field: 'contact.code',
                    cellTemplate:
                        '<div class=\"ui-grid-cell\">' +
                        '<div class=\"ui-grid-cell-contents\"><span> {{row.entity.contact.code}}</span></div>' +
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


                    vm.getSaleOrders();
                });

                gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                    vm.filters.skipCount = (pageNumber - 1) * pageSize;
                    vm.filters.maxResultCount = pageSize;

                    vm.getSaleOrders();
                });
            },
            data: []
        };

        vm.openprintModal = function (id) {

            var modalInstance = $uibModal.open({
                templateUrl: '~/App/tenant/views/crs/vouchers/saleOrders/printtemplates/printPreview.cshtml',
                controller: 'tenant.views.crs.vouchers.saleOrders.printTemplates.printPreview as vmMain',
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
                size: 'full',
                resolve: {
                    templateUrl: function () {
                        return '~/App/tenant/views/crs/vouchers/saleOrders/report.cshtml';
                    },
                    filters: function () {
                        return vm.filters;
                    }
                }
            });
        };

        openCreateOrEditSaleOrderModal = function (saleOrderId) {
            var modalInstance = $uibModal.open({
                templateUrl: '~/App/tenant/views/crs/vouchers/saleOrders/createOrEditModal.cshtml',
                controller: 'tenant.views.crs.vouchers.saleOrders.createOrEditModal as vm',
                backdrop: 'static',
                size: 'lg',
                resolve: {
                    options: function () {
                        return {
                            saleOrderId: saleOrderId,
                            quotationId: null,
                            type: null
                        };
                    }
                }
            });
            modalInstance.result.then(function (result) {
                vm.getSaleOrders();
            });
        };

        openViewSaleOrderModal = function (saleOrderId) {
            var modalInstance = $uibModal.open({
                templateUrl: '~/App/tenant/views/crs/vouchers/saleOrders/viewModal.cshtml',
                controller: 'tenant.views.crs.vouchers.saleOrders.createOrEditModal as vm',
                backdrop: 'static',
                size: 'lg',
                resolve: {
                    options: function () {
                        return {
                            saleOrderId: saleOrderId,
                            quotationId: null
                        }
                    }
                }
            });

        }
        vm.createSaleOrder = function () {
            openCreateOrEditSaleOrderModal(null);
        };

        vm.viewSaleOrder = function (saleOrder) {
            openViewSaleOrderModal(saleOrder.id);
        };

        vm.editSaleOrder = function (saleOrder) {
            openCreateOrEditSaleOrderModal(saleOrder.id);
        };

        vm.deleteSaleOrder = function (saleOrder) {
            abp.message.confirm(
                app.localize('DeleteWarningMessage', saleOrder.voucherNo),
                function (isConfirmed) {
                    if (isConfirmed) {
                        saleOrdersService.deleteSaleOrder({
                            id: saleOrder.id
                        }).success(function () {
                            vm.getSaleOrders();
                            abp.notify.success(app.localize('SuccessfullyDeleted'));
                        });
                    }
                }
            );
        };

        vm.enterKeyPress = function (eventOnKeyPress) {
            if (eventOnKeyPress.which === 13) {
                vm.getSaleOrders();
                eventOnKeyPress.preventDefault();
            }
        }

        function init() {
            getLocations();
            initDate();
            vm.getSaleOrders();
        }
        init();
    }]);
