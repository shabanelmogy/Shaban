// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:242666-243003
appModule.controller('tenant.views.crs.lease.purchaseOrder.index', ['$scope', '$uibModal', 'abp.services.app.vehicle', 'abp.services.app.directory', 'uiGridConstants', 'abp.services.app.expensePayment',
    function ($scope, $uibModal, vehicleService, directoryService, uiGridConstants, expensePaymentService) {

        var vm = this;
        vm.loading = false;
        vm.dateRangeOptions = app.createDateRangePickerOptions();
        vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
        vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));

        vm.vehicles = [];
        vm.expensePayment = [];
        vm.customers = [];
        vm.filters = {
            voucherNo: null,
            vehicleId: null,
            fromDate: null,
            toDate: null,
            skipCount: 0,
            maxResultCount: app.consts.grid.defaultPageSize,
        }
        vm.dateRangeModel = {
            startDate: moment(moment().format('YYYY-MM-DD')).utc(),
            endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc(),
        };

        vm.permissions = {
            create: abp.auth.hasPermission('Pages.Tenant.ExpensePayments.Addnew'),
            edit: abp.auth.hasPermission('Pages.Tenant.ExpensePayments.Edit'),
            'delete': abp.auth.hasPermission('Pages.Tenant.ExpensePayments.Delete'),
        }

        vm.searchVehicles = function ($select) {
            if ($select.search == "") { vm.vehicles = null; return null; }
            return vehicleService.searchVehicles({ plateNo: $select.search }).then(function (response) {
                vm.vehicles = response.data.items;
            });
        };

        vm.searchContact = function ($select) {
            //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
            return directoryService.search({ keyword: $select.search, contactType: 2 }).then(function (response) {
                vm.customers = response.data.items;
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
            }).result.then(function (customer) {
                if (customer != null) {
                    vm.filters.customer = customer;
                }
            });
        };

        vm.searchVehiclePopup = function openSearchVehicleModal() {
            var modalInstance = $uibModal.open({
                templateUrl: '~/App/tenant/views/crs/vehicles/searchVehicleModal.cshtml',
                controller: 'tenant.views.crs.vehicles.searchVehicleModal as vm',
                backdrop: 'static',
                resolve: {
                    tariffGroup: function () {
                        return null;
                    }
                }
            });

            modalInstance.result.then(function (result) {
                if (result != null) {
                    vm.filters.vehicle = result;

                }
            });
        }

        vm.getExpensePayments = function () {
            vm.loading = true;

            //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
            //if null then get as following
            //fromDate: get local date with time 00:00:00 and then convert to utc
            //toDate: get local date of max time of night and then convert to utc

            vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
            vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

            if (vm.filters.customer != null)
                vm.filters.contact = vm.filters.customer.name;
            if (vm.filters.vehicle != null)
                vm.filters.vehicleId = vm.filters.vehicle.id;

            expensePaymentService.getExpensePayments(vm.filters).success(function (data) {
                vm.gridOptions.totalItems = data.totalCount;
                vm.gridOptions.data = data.items;
            }).finally(function () {
                vm.loading = false;
            });
        };

        vm.getlocalDateTime = function (date) {
            if (date != null) {
                var localTime = moment.utc(date).toDate();
                return moment(localTime).format('YYYY-MM-DD');
            }
            else {
                return "";
            }
        };

        vm.exportToExcel = function () {
            vm.loading = true;

            //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
            //if null then get as following
            //fromDate: get local date with time 00:00:00 and then convert to utc
            //toDate: get local date of max time of night and then convert to utc
            vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
            vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
            if (vm.filters.customer != null)
                vm.filters.contact = vm.filters.customer.name;
            if (vm.filters.vehicle != null)
                vm.filters.vehicleId = vm.filters.vehicle.id;
            expensePaymentService.exportToExcel(vm.filters)
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
                        '      <li><a ng-click="grid.appScope.openViewInquiry(row.entity)">' + app.localize('View') + '</a></li>' +
                        '      <li><a  ng-click="grid.appScope.openEditInquiry(row.entity)">' + app.localize('Edit') + '</a></li>' +
                        '      <li><a  ng-click="grid.appScope.openleaseQuotation(row.entity)">' + app.localize('Quote') + '</a></li>' +
                        //'      <li><a ng-if="grid.appScope.permissions.print" target="_blank" ng-href="/Report#/tenant/printmodal/{{row.entity.id}}" >' + app.localize('Print') + '</a></li>' +
                        //'      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.viewExpensePayment(row.entity)">' + app.localize('Delete') + '</a></li>' +
                        '    </ul>' +
                        '  </div>' +
                        '</div>'
                },

                {
                    name: app.localize('VehicleType'),
                    type: 'number',
                    field: 'voucherNo'
                },
                {
                    name: app.localize('Description'),
                    field: 'contact'
                },
                {
                    name: app.localize('VehicleType'),
                    field: 'contact'
                },

                {
                    name: app.localize('Quantity'),
                    field: 'amount'
                },

                {
                    name: app.localize('UnitPrice'),
                    field: 'amount'
                },

                {
                    name: app.localize('Price'),
                    field: 'amount'
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

                    vm.getExpensePayments();
                });

                gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                    vm.filters.skipCount = (pageNumber - 1) * pageSize;
                    vm.filters.maxResultCount = pageSize;

                    vm.getExpensePayments();
                });
            },
            data: []
        };
        vm.openViewInquiry = function (expensePayment) {
            openCreateOrEditViewInquiry(expensePayment.id);

        }
        openCreateOrEditViewInquiry = function (expenseId) {
            var modalInstance = $uibModal.open({
                templateUrl: '~/App/tenant/views/crs/lease/leaseInquiries/viewLeaseInquiries.cshtml',
                controller: 'tenant.views.crs.lease.leaseInquiries.viewLeaseInquiries as vm',
                backdrop: 'static',
                size: 'lg',

            });

        }
        vm.openEditInquiry = function (expensePayment) {
            openCreateOrEditInquiry(expensePayment.id);

        }
        openCreateOrEditInquiry = function (expenseId) {
            var modalInstance = $uibModal.open({
                templateUrl: '~/App/tenant/views/crs/lease/leaseInquiries/editLeaseInquiries.cshtml',
                controller: 'tenant.views.crs.lease.leaseInquiries.editLeaseInquiries as vm',
                backdrop: 'static',
                size: 'lg',

            });

        }

        vm.openleaseQuotation = function (expensePayment) {
            openCreateOrEditLeaseQuotation(expensePayment.id);

        }
        openCreateOrEditLeaseQuotation = function (expenseId) {
            var modalInstance = $uibModal.open({
                templateUrl: '~/App/tenant/views/crs/lease/leaseQuotationProcessing/viewLeaseQuotations.cshtml',
                controller: 'tenant.views.crs.lease.leaseQuotationProcessing.viewLeaseQuotations as vm',
                backdrop: 'static',
                size: 'lg',

            });
            modalInstance.result.then(function (result) {
                vm.getExpensePayments();
            });
        }


        vm.createLeaseInquiry = function () {
            openCreateOrEditLeaseInquiry(null);
        };

        //openCreateOrEditLeaseInquiry = function (expenseId) {
        //    var modalInstance = $uibModal.open({
        //        templateUrl: '~/App/tenant/views/crs/lease/leaseInquiries/createOrEditModal.cshtml',
        //        controller: 'tenant.views.crs.lease.leaseInquiries.createOrEditModal as vm',
        //        backdrop: 'static',
        //        size: 'lg',
        //        resolve: {
        //            //expenseId: function () {
        //            //    return expenseId;
        //            //}
        //        }
        //    });

        //}


        openCreateOrEditLeaseInquiry = function (expenseId) {
            var modalInstance = $uibModal.open({
                templateUrl: '~/App/tenant/views/crs/lease/purchaseOrder/createOrEditModal.cshtml',
                controller: 'tenant.views.crs.lease.purchaseOrder.createOrEditModal as vm',
                backdrop: 'static',
                size: 'lg',

            });
            modalInstance.result.then(function (result) {
                vm.getExpensePayments();
            });
        }
        vm.editExpensePayment = function (expensePayment) {

            openCreateOrEditLeaseInquiry(expensePayment.id);
        }

        vm.viewExpensePayment = function (expensePayment) {
            openViewExpensePaymentModal(expensePayment.id);

        }
        vm.deleteExpensePayment = function (expensePayment) {
            abp.message.confirm(
                app.localize('DeleteWarningMessage', expensePayment.voucherNo),
                function (isConfirmed) {
                    if (isConfirmed) {
                        expensePaymentService.deleteExpensePayment({
                            id: expensePayment.id
                        }).success(function () {
                            vm.getExpensePayments();
                            abp.notify.success(app.localize('SuccessfullyDeleted'));
                        });
                    }
                }
            );
        };

        vm.enterKeyPress = function (eventOnKeyPress) {
            if (eventOnKeyPress.which === 13) {
                vm.getExpensePayments();
                eventOnKeyPress.preventDefault();
            }
        }

        vm.clearCustomer = function () {
            vm.filters.customer = null;
            vm.filters.customerId = null;
        };

        function init() {
            vm.getExpensePayments();
        }
        init();
    }]);
