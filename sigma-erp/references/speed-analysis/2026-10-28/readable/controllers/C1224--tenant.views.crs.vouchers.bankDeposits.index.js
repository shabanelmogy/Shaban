// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:320212-320453
appModule.controller('tenant.views.crs.vouchers.bankDeposits.index', ['$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.bankDeposit', 'utilities',
    function ($scope, $uibModal, uiGridConstants, bankDepositService, utilities) {

        var vm = this;
        vm.loading = false;
        vm.dateRangeOptions = app.createDateRangePickerOptions();
        vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
        vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
        vm.dateFormat = abp.setting.get("App.General.DateFormat");
        vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
        vm.CurrencyFormate = function (amount) {
            if (amount == null) return null;
            return amount.toLocaleString('en');
        };
        vm.filters = {
            fromDate: null,
            toDate: null,
            skipCount: 0,
            maxResultCount: app.consts.grid.defaultPageSize,
        }
        function initDate() {
            vm.dateRangeModel = {
                startDate: moment().add(-29, 'days').startOf('day'),
                endDate: moment().endOf('day')
            };
        }
        //vm.dateRangeModel = {
        //    startDate: moment(moment().format('YYYY-MM-DD')).utc(),
        //    endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc(),
        //};

        vm.permissions = {
            create: abp.auth.hasPermission('Pages.Tenant.Vouchers.BankDeposits.Addnew'),
            edit: abp.auth.hasPermission('Pages.Tenant.Vouchers.BankDeposits.Edit'),
            view: abp.auth.hasPermission('Pages.Tenant.Vouchers.BankDeposits.View'),
            'delete': abp.auth.hasPermission('Pages.Tenant.Vouchers.BankDeposits.Delete'),
        };

        vm.getBankDeposits = function () {
            vm.loading = true;

            //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
            //if null then get as following
            //fromDate: get local date with time 00:00:00 and then convert to utc
            //toDate: get local date of max time of night and then convert to utc
            
            vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
            vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

            bankDepositService.getBankDeposits(vm.filters).success(function (data) {
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

        vm.roundingforView = function (value) {
            var roundedValue = utilities.roundforView(value, 2);
            return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        };


        //vm.exportToExcel = function () {
        //    vm.loading = true;

        //    //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
        //    //if null then get as following
        //    //fromDate: get local date with time 00:00:00 and then convert to utc
        //    //toDate: get local date of max time of night and then convert to utc
        //    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
        //    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
        //    if (vm.filters.supplier != null)
        //        vm.filters.contact = vm.filters.supplier.name;
        //    if (vm.filters.vehicle != null)
        //        vm.filters.vehicleId = vm.filters.vehicle.id;
        //    bankDepositService.exportToExcel(vm.filters)
        //        .success(function (result) {
        //            app.downloadTempFile(result);
        //        }).finally(function () {
        //            vm.loading = false;
        //        });
        //};

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
                        '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewBankDeposit(row.entity)">' + app.localize('View') + '</a></li>' +
                        '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.editBankDeposit(row.entity)">' + app.localize('Edit') + '</a></li>' +
                        '      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteBankDeposit(row.entity)">' + app.localize('Delete') + '</a></li>' +
                        '    </ul>' +
                        '  </div>' +
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
                    name: app.localize('Amount'),
                    field: 'amount',
                    cellTemplate:
                        '<div class=\"ui-grid-cell\">' +
                        '<div class=\"ui-grid-cell-contents\">{{grid.appScope.roundingforView(row.entity.amount)}}</div>' +
                        '</div>'
                },

                {
                    name: app.localize('Notes'),
                    field: 'notes'
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

                    vm.getBankDeposits();
                });

                gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                    vm.filters.skipCount = (pageNumber - 1) * pageSize;
                    vm.filters.maxResultCount = pageSize;

                    vm.getBankDeposits();
                });
            },
            data: []
        };

        openCreateOrEditbankDepositModal = function (bankDepositId) {
            var modalInstance = $uibModal.open({
                templateUrl: '~/App/tenant/views/crs/vouchers/bankDeposits/createOrEditModal.cshtml',
                controller: 'tenant.views.crs.vouchers.bankDeposits.createOrEditModal as vm',
                backdrop: 'static',
                size: 'md',
                resolve: {
                    bankDepositId: function () {
                        return bankDepositId;
                    }
                }
            });
            modalInstance.result.then(function (result) {
                vm.getBankDeposits();
            });
        }

        openViewbankDepositModal = function (bankDepositId) {
            var modalInstance = $uibModal.open({
                templateUrl: '~/App/tenant/views/crs/vouchers/bankDeposits/viewModal.cshtml',
                controller: 'tenant.views.crs.vouchers.bankDeposits.viewModal as vm',
                backdrop: 'static',
                size: 'md',
                resolve: {
                    bankDepositId: function () {
                        return bankDepositId;
                    }
                }
            });

        }
        vm.createBankDeposit = function () {
            openCreateOrEditbankDepositModal(null);
        };

        vm.editBankDeposit = function (bankDeposit) {
            openCreateOrEditbankDepositModal(bankDeposit.id);
        }

        vm.viewBankDeposit = function (bankDeposit) {
            openViewbankDepositModal(bankDeposit.id);

        }
        vm.deleteBankDeposit = function (bankDeposit) {
            abp.message.confirm(
                app.localize('DeleteWarningMessage', bankDeposit.voucherNo),
                function (isConfirmed) {
                    if (isConfirmed) {
                        bankDepositService.deleteBankDeposit({
                            id: bankDeposit.id
                        }).success(function () {
                            vm.getBankDeposits();
                            abp.notify.success(app.localize('SuccessfullyDeleted'));
                        });
                    }
                }
            );
        };

        vm.enterKeyPress = function (eventOnKeyPress) {
            if (eventOnKeyPress.which === 13) {
                vm.getBankDeposits();
                eventOnKeyPress.preventDefault();
            }
        }

        vm.clearSupplier = function () {
            vm.filters.supplier = null;
            vm.filters.contact = null;
            vm.filters.contactId = null;
        };

        function init() {
            initDate();
            vm.getBankDeposits();
        }
        init();
    }]);
