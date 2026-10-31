// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:236982-237398
appModule.controller('tenant.views.crs.lease.leaseInquiries.index', ['$scope', '$uibModal', 'abp.services.app.vehicle', 'abp.services.app.directory',
        'uiGridConstants', 'abp.services.app.leaseInquiry',
    function ($scope, $uibModal, vehicleService, directoryService, uiGridConstants, leaseInquiryService) {
        var vm = this;
        vm.loading = false;
        vm.isLeaseInquiryStagePermission = abp.auth.hasPermission('Pages.Tenant.Lease.Inquiry.Stage');
        vm.dateRangeOptions = app.createDateRangePickerOptions();
        vm.dateRangeOptions.max = moment().add(3, 'year').format('YYYY-MM-DD');
        vm.dateRangeOptions.maxDate = moment().add(3, 'year').format('YYYY-MM-DD');
        vm.dateFormat = abp.setting.get("App.General.DateFormat");
        vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
        vm.vehicles = [];
        vm.customers = [];
        vm.filters = {
            inquiryNo: null,
            fromDate: null,
            toDate: null,
            customer: null,
            pagination: false,
            skipCount: 0,
            leaseInquiryStage: 0,
            maxResultCount: app.consts.grid.defaultPageSize,
        }
        vm.dateRangeModel = {
            startDate: moment(moment().format('YYYY-MM-DD')).utc(),
            endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc(),
        };
        vm.leaseInquiryStage = [
            { key: 'New', value: 0 },
            { key: 'Cold', value: 1 },
            { key: 'Hot', value: 2 }
        ];
        vm.getlocalizedString = function (leaseInquiryStage) {

            if (leaseInquiryStage == 0)
                return app.localize('New');

            else if (leaseInquiryStage == 1)
                return app.localize('Cold');

            else if (leaseInquiryStage == 2)
                return app.localize('Hot');
            return '';
        };
        vm.dateRangeCheck = function () {

            if (vm.filters.enableDateRange) {
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format(abp.setting.get("App.General.DateFormat"))).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format(abp.setting.get("App.General.DateFormat"))).add(1, 'days').add(-1, 'milliseconds').utc();
            }
            if (!vm.filters.enableDateRange) {
                vm.filters.fromDate = null;
                vm.filters.toDate = null;
            }
        };

        vm.searchContact = function ($select) {
            //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
            return directoryService.search({ keyword: $select.search, contactType: 2, includeUnApproved: true }).then(function (response) {
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

        vm.getLeaseInquiry = function () {
            vm.loading = true;

            //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
            //if null then get as following
            //fromDate: get local date with time 00:00:00 and then convert to utc
            //toDate: get local date of max time of night and then convert to utc

            //vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
            //vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
            vm.dateRangeCheck();
            if (vm.filters.customer != null)
                vm.filters.customerId = vm.filters.customer.id;

            leaseInquiryService.getLeaseInquiries(vm.filters).success(function (data) {
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

        vm.exportToExcel = function () {
            vm.loading = true;

            //vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
            //vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

            vm.dateRangeCheck();

            if (vm.filters.customer != null)
                vm.filters.customerId = vm.filters.customer.id;

            leaseInquiryService.exportToExcel(vm.filters)
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
                        '      <li><a ng-click="grid.appScope.openViewInquiry(row.entity.id)">' + app.localize('View') + '</a></li>' +
                        '      <li><a  ng-click="grid.appScope.openEditInquiry(row.entity.id)">' + app.localize('Edit') + '</a></li>' +
                        '      <li><a  ng-click="grid.appScope.deleteLeaseInquiry(row.entity.id)">' + app.localize('Delete') + '</a></li>' +
                        '      <li><a ng-if="!row.entity.isQuotationCreated" ng-click="grid.appScope.openleaseQuotation(row.entity)">' + app.localize('Quote') + '</a></li>' +
                        '      <li><a ng-click="grid.appScope.openLeaseInquiryLog(row.entity)">' + app.localize('Logs') + '</a></li>' +
                        '      <li><a ng-if="grid.appScope.isLeaseInquiryStagePermission" ng-click="grid.appScope.openLeaseInquiryStage(row.entity)">' + app.localize('ChangeStage') + '</a></li>' +
                        '    </ul>' +
                        '  </div>' +
                        '</div>'
                },

                {
                    name: app.localize('No'),
                    field: 'inquiryNo',
                    cellTemplate:
                        '<div class=\"ui-grid-cell\">' +
                        '<div class=\"ui-grid-cell-contents\">{{row.entity.inquiryNo}}</div>' +
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
                    name: app.localize('Customer'),
                    field: 'customer',
                    cellTemplate:
                        '<div class=\"ui-grid-cell\">' +
                        '<div class=\"ui-grid-cell-contents\">{{row.entity.customer.name}}</div>' +
                        '</div>'
                },
                {
                    name: app.localize('Code'),
                    field: 'customer.code',
                },

                {
                    name: app.localize('SalePerson'),
                    field: 'salePerson',
                    cellTemplate:
                        '<div class=\"ui-grid-cell\">' +
                        '<div class=\"ui-grid-cell-contents\">{{row.entity.salePerson.name}}</div>' +
                        '</div>'
                }
                ,

                {
                    name: app.localize('Stage'),
                    field: 'stageleaseInquiryStage',
                    cellTemplate:
                        '<div class=\"ui-grid-cell\">' +
                        '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalizedString(row.entity.leaseInquiryStage)}}</div>' +
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

                    vm.getLeaseInquiry();
                });

                gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                    vm.filters.skipCount = (pageNumber - 1) * pageSize;
                    vm.filters.maxResultCount = pageSize;

                    vm.getLeaseInquiry();
                });
            },
            data: []
        };

        vm.deleteLeaseInquiry = function (inquiryId) {
            abp.message.confirm(
                   app.localize('DeleteWarningMessage', location.name),
                   function (isConfirmed) {
                       if (isConfirmed) {
                           leaseInquiryService.deleteLeaseInquiry({
                               id: inquiryId
                           }).
                           success(function () {
                               vm.getLeaseInquiry();
                               abp.notify.success(app.localize('SuccessfullyDeleted'));
                           });
                       }
                   }
               );
        }
        vm.openViewInquiry = function (inquiryId) {
            openCreateOrEditViewInquiry(inquiryId);

        }
        openCreateOrEditViewInquiry = function (inquiryId) {
            var modalInstance = $uibModal.open({
                templateUrl: '~/App/tenant/views/crs/lease/leaseInquiries/viewLeaseInquiries.cshtml',
                controller: 'tenant.views.crs.lease.leaseInquiries.createOrEditModal as vm',
                backdrop: 'static',
                size: 'xl',
                resolve: {
                    inquiryId: function () {
                        return inquiryId;
                    }
                }
            });

        }

        vm.openEditInquiry = function (inquiryId) {
            openCreateOrEditLeaseInquiry(inquiryId);
        }

        vm.openleaseQuotation = function (inquiry) {
            openCreateOrEditLeaseQuotation(inquiry.id);
        }

        vm.openLeaseInquiryStage = function (inquiry) {
            openLeaseInquiryStage(inquiry);
        }

        vm.openLeaseInquiryLog = function (inquiry) {
            openLeaseInquiryLog(inquiry);
        }

        openLeaseInquiryStage = function (inquiry) {
            var modalInstance = $uibModal.open({
                templateUrl: '~/App/tenant/views/crs/lease/leaseInquiries/changeLeaseInquiryStage.cshtml',
                controller: 'tenant.views.crs.lease.leaseInquiries.changeLeaseInquiryStage as vm',
                backdrop: 'static',
                resolve: {
                    inquiryId: function () {
                        return inquiry.id;
                    },
                    leaseInquiryNo: function () {
                        return inquiry.inquiryNo;
                    },
                    leaseInquiryStage: function () {
                        return inquiry.leaseInquiryStage;
                    }
                }
            });
            modalInstance.result.then(function (result) {
                vm.getLeaseInquiry();
            });
        }

        openLeaseInquiryLog = function (inquiry) {
            
            var modalInstance = $uibModal.open({
                templateUrl: '~/App/tenant/views/crs/lease/leaseInquiries/leaseInquiryLogs.cshtml',
                controller: 'tenant.views.crs.lease.leaseInquiries.leaseInquiryLogs as vm',
                backdrop: 'static',
                size: 'lg',
                resolve: {
                    inquiryId: function () {
                        return inquiry.id;
                    },
                    leaseInquiryNo: function () {
                        return inquiry.inquiryNo;
                    }
                }
            });
            modalInstance.result.then(function (result) {
                vm.getLeaseInquiry();
            });
        }

        openCreateOrEditLeaseQuotation = function (inquiryId) {
            var modalInstance = $uibModal.open({
                templateUrl: '~/App/tenant/views/crs/lease/leaseQuotations/createOrEditQuotationModal.cshtml',
                controller: 'tenant.views.crs.lease.leaseQuotations.createOrEditQuotationModal as vm',
                backdrop: 'static',
                size: 'xl',
                resolve: {
                    inquiryId: function () {
                        return inquiryId;
                    },
                    leaseQuotationId: null,
                    isRevised: null
                }
            });
            modalInstance.result.then(function (result) {
                vm.getLeaseInquiry();
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


        openCreateOrEditLeaseInquiry = function (inquiryId) {
            var modalInstance = $uibModal.open({
                templateUrl: '~/App/tenant/views/crs/lease/leaseInquiries/createOrEditModal.cshtml',
                controller: 'tenant.views.crs.lease.leaseInquiries.createOrEditModal as vm',
                backdrop: 'static',
                size: 'xl',
                resolve: {
                    inquiryId: function () {
                        return inquiryId;
                    }
                }
            });
            modalInstance.result.then(function (result) {
                vm.getLeaseInquiry();
            });
        }
        vm.deleteExpensePayment = function (expensePayment) {
            abp.message.confirm(
                app.localize('DeleteWarningMessage', expensePayment.voucherNo),
                function (isConfirmed) {
                    if (isConfirmed) {
                        expensePaymentService.deleteExpensePayment({
                            id: expensePayment.id
                        }).success(function () {
                            vm.getLeaseInquiry();
                            abp.notify.success(app.localize('SuccessfullyDeleted'));
                        });
                    }
                }
            );
        };

        vm.enterKeyPress = function (eventOnKeyPress) {
            if (eventOnKeyPress.which === 13) {
                vm.getLeaseInquiry();
                eventOnKeyPress.preventDefault();
            }
        }

        vm.clearCustomer = function () {
            vm.filters.customer = null;
            vm.filters.customerId = null;
        };

        function init() {
            vm.getLeaseInquiry();
        }
        init();
    }]);
