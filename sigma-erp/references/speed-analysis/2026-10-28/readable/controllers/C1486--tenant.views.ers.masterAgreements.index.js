// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:405465-405873
appModule.controller('tenant.views.ers.masterAgreements.index', ['$scope', '$uibModal', 'abp.services.app.directory', 'uiGridConstants', 'abp.services.app.quotation', 'abp.services.app.masterAgreement', 'abp.services.app.commonLookup',
        function ($scope, $uibModal, directoryService, uiGridConstants, quotationService, masterAgreementService, lookupService) {

            var vm = this;
            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.isSaleOrderEnabled = abp.features.isEnabled("CRS.Vouchers.SaleOrders");
            vm.vehicles = [];
            vm.customers = [];
            vm.statuses = [];

            vm.filters = {
                enableDateRange: true,
                customerId: null,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                approvedType: null,
                locationId: null,
            };
            vm.approvedTypes = [{ id: 2, name: 'Approved' }, { id: 3, name: 'Not Approved' }];
            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc(),
            };
            vm.enterKeyPress = function (eventOnKeyPress) {
                if (eventOnKeyPress.which === 13) {
                    vm.getmasterAgreements();
                    eventOnKeyPress.preventDefault();
                }
            }
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
            vm.permissions = {
                detail: abp.auth.hasPermission('Pages.Tenant.ERS.MasterAgreements.Detail'),
                approve: abp.auth.hasPermission('Pages.Tenant.ERS.MasterAgreements.Approve'),
                print: abp.auth.hasPermission('Pages.Tenant.ERS.MasterAgreements.Print'),
                saleOrders: abp.auth.hasPermission('Pages.Tenant.ERS.MasterAgreements.SaleOrders'),
                'delete': abp.auth.hasPermission('Pages.Tenant.ERS.MasterAgreements.Delete'),
            };


            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.searchContact = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            vm.getAgreementType = function (id) {
                if (id == 1)
                    return "Daily"
                if (id == 2)
                    return "Weekly"
                if (id == 3)
                    return "Monthly"
                if (id == 4)
                    return "Lease"
                if (id == 5)
                    return "LeaseToOwn"
            }

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
                        vm.filters.customerId = customer.id;
                    }
                });
            };



            vm.openprintModal = function (id) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/ers/masterAgreements/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.ers.masterAgreements.printTemplates.printPreview as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        masterAgreementId: function () {
                            return id;
                        }
                    }
                });
            };


            vm.getMasterAgreements = function () {
                vm.loading = true;
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
                masterAgreementService.getMasterAgreements(vm.filters).success(function (data) {
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });

            };

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';


            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
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

                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
                masterAgreementService.exportToExcel(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
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
                            return '~/App/tenant/views/ers/masterAgreements/report.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
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
                          //  '      <li><a ng-click="grid.appScope.viewMasterAgreement(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.detail" ng-click="grid.appScope.masterAgreementModal(row.entity)">' + app.localize('Detail') + '</a></li>' +
                            '      <li><a ng-if="!row.entity.isApproved && grid.appScope.permissions.approve" ng-click="grid.appScope.approveMasterAgreement(row.entity)">' + app.localize('Approve') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.print" ng-click="grid.appScope.openprintModal(row.entity.id)">' + app.localize('Print') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.saleOrders" ng-click="grid.appScope.createOrViewSaleOrders(row.entity)" ng-hide="row.entity.status == 8">' + app.localize('SaleOrders') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete" ng-click="grid.appScope.deleteMasterAgreement(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('AgreementNo'),
                        field: 'agreementNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.agreementNo}}' + '&nbsp' + '</span>' +
                            ' <span  ng-show="!row.entity.isApproved" class="label label-warning">' + app.localize('Not Approved') + '</span>' +
                            ' <span  ng-show="row.entity.isApproved" class="label label-success">' + app.localize('Approved') + '</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Date'),
                        field: 'date',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDate(row.entity.date)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Customer'),
                        field: 'quotation.customer.name'
                    },
                    {
                        name: app.localize('CustomerCode'),
                        field: 'quotation.customer.code'
                    },
                    {
                        name: app.localize('Quotation'),
                        field: 'quotation.quotationNo'
                    },
                    {
                        name: app.localize('QuotationType'),
                        field: 'quotation.type',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getAgreementType(row.entity.quotation.type)}}</div>' +
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

                        vm.getMasterAgreements();
                    });

                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;
                        vm.getMasterAgreements();
                    });
                },
                data: []
            };

            
            vm.approveMasterAgreement = function (agreement) {
                abp.message.confirm(
                    app.localize('Press Ok To Approve Master Agreement', agreement.agreementNo),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;
                            masterAgreementService.approveMasterAgreement({
                                id: agreement.id
                            }).success(function () {
                                vm.getMasterAgreements();
                                abp.notify.success(app.localize('SuccessfullyApproved'));
                            }).finally(function () {
                                vm.loading = false;
                            });
                        }
                    }
                );
            };


            openViewAgreementModal = function (agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/ers/masterAgreements/viewModal.cshtml',
                    controller: 'tenant.views.ers.masterAgreements.viewModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        agreementId: function () {
                            return agreementId;
                        },

                    }

                });

            }
            vm.createOrViewSaleOrders = function (agreement) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/ers/masterAgreements/addOrViewSaleOrder.cshtml',
                    controller: 'tenant.views.ers.masterAgreements.addOrViewSaleOrder as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        masterAgreementId: function () {
                            return agreement.id;
                        },
                        agreementNo: function () {
                            return agreement.agreementNo;
                        },
                        contactId: function () {
                            return agreement.quotation.customerId;
                        }
                    }
                });
            }

            openMasterAgreementModal = function (agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/ers/masterAgreements/masterAgreementModal.cshtml',
                    controller: 'tenant.views.ers.masterAgreements.masterAgreementModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        agreementId: function () {
                            return agreementId;
                        },
                    }
                });
            };

            vm.createQuotation = function () {
                openCreateOrEditQuotation(null);
            };

            vm.editQuotation = function (Quotation) {
                openCreateOrEditQuotation(Quotation.id);
            };

            vm.viewMasterAgreement = function (agreement) {
                openViewAgreementModal(agreement.id);
            };

            vm.masterAgreementModal = function (agreement) {
                openMasterAgreementModal(agreement.id);
            };

            vm.deleteMasterAgreement = function (masterAgreement) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            masterAgreementService.deleteMasterAgreement({
                                id: masterAgreement.id
                            }).success(function () {
                                vm.getMasterAgreements();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                                }).error(function (data) {
                                    if (data) {
                                        setTimeout(() => abp.message.error(data.message), 300);
                                    }

                                });
                        }
                    }
                );
            };

            vm.enterKeyPress = function (eventOnKeyPress) {
                if (eventOnKeyPress.which === 13) {
                    vm.getMasterAgreements();
                    eventOnKeyPress.preventDefault();
                }
            }

            vm.clearCustomer = function () {
                vm.filters.customer = null;
                vm.filters.customerId = null;
            };


            function init() {
                vm.getMasterAgreements();
                lookupService.getLocations()
                    .success(r => {
                        vm.locations = r.items;
                    });
            }
            init();
        }]);
