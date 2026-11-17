// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:379024-379459
appModule.controller('tenant.views.crs.vouchers.provisions.index', ['$scope', '$uibModal', 'abp.services.app.vehicle', 'abp.services.app.directory', 'uiGridConstants', 'abp.services.app.provision', 'appSession', 'abp.services.app.commonLookup',
        function ($scope, $uibModal, vehicleService, directoryService, uiGridConstants, provisionService, appSession, commonLookupService) {

            var vm = this;
            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.vehicles = [];
            vm.suppliers = [];
            vm.isSalikMonthEndPostingEnabled = abp.features.isEnabled("CRS.Tolls.SalikMonthEndPosting");
            vm.isFineMonthEndPostingEnabled = abp.features.isEnabled("CRS.Fines.FineMonthEndPosting");
            vm.filters = {
                enableDateRange: true,
                voucherNo: null,
                vehicleId: null,
                fromDate: null,
                toDate: null,
                skipCount: 0,
                salikMonthEndPosting: false,
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
            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.Vouchers.JVs.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.Vouchers.JVs.Edit'),
                view: abp.auth.hasPermission('Pages.Tenant.Vouchers.JVs.View'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Vouchers.JVs.Delete'),
                'print': abp.auth.hasPermission('Pages.Tenant.Vouchers.JVs.Print'),
                allActionsOnOtherBranch: abp.auth.hasPermission('Pages.Tenant.Vouchers.JVs.AllActionsOnOtherBranchJVs'),
                viewOtherBranch: abp.auth.hasPermission('Pages.Tenant.Vouchers.JVs.ViewOtherBranchJVs'),

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


            vm.statuses = [
                { value: false, name: app.localize("No") },
                { value: true, name: app.localize("Yes") },
            ];


            vm.searchContacts = function ($select) {

                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, activeOnly: true }).then(function (response) {
                    vm.contacts = response.data.items;
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
                            return null;
                        }
                    }
                }).result.then(function (contact) {
                    if (contact != null) {
                        vm.filters.contact = contact;
                        vm.filters.contactId = contact.id;
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

            vm.getProvisions = function () {
                vm.loading = true;

                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc

                //vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                //vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();


                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }

                provisionService.getProvisions(vm.filters).success(function (data) {
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

            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
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
                if (vm.filters.supplier != null)
                    vm.filters.contact = vm.filters.supplier.name;
                if (vm.filters.vehicle != null)
                    vm.filters.vehicleId = vm.filters.vehicle.id;
                provisionService.exportToExcel(vm.filters)
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
                            '      <li><a  ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewProvision(row.entity)">' + app.localize('View') + '</a></li>' +
                            //'      <li><a  ng-if="grid.appScope.permissions.edit && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.editJV(row.entity)">' + app.localize('Edit') + '</a></li>' +
                           // '      <li><a  ng-if="grid.appScope.permissions.edit && grid.appScope.locationPermission(row.entity)" ng-click="grid.appScope.allocateJV(row.entity)">' + app.localize('Allocation') + '</a></li>' +
                            '      <li><a  ng-click="grid.appScope.viewTransactionsModal(row.entity)">' + app.localize('Transactions') + '</a></li>' +
                            '      <li><a  ng-click="grid.appScope.deleteProvision(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.openprintModal(row.entity.id)">' + app.localize('Print') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },

                    {
                        name: app.localize('No'),
                        type: 'number',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.provisionNo}}' + '&nbsp' + '</span>' +
                            //' <span  ng-show="row.entity.voucherSubTypeId==27" class="label label-warning">' + app.localize('SalikMonthEndPosting') + '</span>' +
                            //' <span  ng-show="row.entity.voucherSubTypeId==28" class="label label-success">' + app.localize('FineMonthEndPosting') + '</span>' +
                            '</div>'
                    },

                    {
                        name: app.localize('EntryDate'),
                        field: 'entryDate',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.entryDate)}}</div>' +
                            '</div>'
                    },

                    {
                        name: app.localize('Title'),
                        field: 'title',
                    },
                    {
                        name: app.localize('dayOfMonth'),
                        field: 'dayOfMonth',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" ng-if="row.entity.dayOfMonth < 28">{{row.entity.dayOfMonth}}</div>' +
                            '<div class=\"ui-grid-cell-contents\" ng-if="row.entity.dayOfMonth > 27">End Of Month</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('NoOfMonths'),
                        field: 'noOfMonths',
                    },
                    {
                        name: app.localize('IsCompleted'),
                        field: 'isComplete',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span  ng-show="!row.entity.isComplete" class="label label-warning">' + app.localize('No') + '</span>' +
                            ' <span  ng-show="row.entity.isComplete" class="label label-success">' + app.localize('Yes') + '</span>' +
                            '</div>'
                    },

                ],
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            vm.filters.sorting = null;
                        } else {
                            vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }

                        vm.getJVs();
                    });

                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getJVs();
                    });
                },
                data: []
            };

            openCreateOrEditProvisionModal = function (provisionId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/provisions/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.provisions.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        provisionId: function () {
                            return provisionId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getProvisions();
                });
            }

            vm.openprintModal = function (id) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/jvs/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.vouchers.jvs.printTemplates.printPreview as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        JVId: function () {
                            return id;
                        }
                    }
                });
            };

            openViewProvisionModal = function (provisionId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/provisions/viewModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.provisions.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        provisionId: function () {
                            return provisionId;
                        }
                    }
                });

            };

            openTransactionsModal = function (provision) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/provisions/transactionsModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.provisions.transactionsModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        provision: function () {
                            return provision;
                        }
                    }
                });

            };

            openAllocateJvModal = function (JVId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/jvs/allocateJvModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.jvs.allocateJvModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        JVId: function () {
                            return JVId;
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

            vm.createProvision = function () {
                openCreateOrEditProvisionModal(null);
            };

            vm.editProvision = function (provision) {
                openCreateOrEditProvisionModal(provision.id);
            };

            vm.viewProvision = function (provision) {
                openViewProvisionModal(provision.id);
            };
            
            vm.viewTransactionsModal = function (provision) {
                openTransactionsModal(provision);
            };

            vm.deleteProvision = function (provision) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', provision.provisionNo),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            provisionService.deleteProvision({
                                id: provision.id
                            }).success(function () {
                                vm.getProvisions();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.allocateJV = function (row) {
                openAllocateJvModal(row.id);
            };
            vm.enterKeyPress = function (eventOnKeyPress) {
                if (eventOnKeyPress.which === 13) {
                    vm.getJVs();
                    eventOnKeyPress.preventDefault();
                }
            }

            vm.clearContact = function () {
                vm.filters.contact = null;
                vm.filters.contactId = null;
            };

            function init() {
                getLocations();
                initDate();
                vm.dateRangeModelChanged();
                vm.getProvisions();
            }
            init();
        }]);
