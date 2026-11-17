// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:407688-408282
appModule.controller('tenant.views.ers.quotations.index', ['$scope', '$uibModal', 'abp.services.app.directory', 'uiGridConstants', 'abp.services.app.quotation', 'abp.services.app.commonLookup',
        function ($scope, $uibModal, directoryService, uiGridConstants, quotationService, lookupService) {

            var vm = this;
            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            //vm.canEditApprovedQuotation = abp.auth.hasPermission('Pages.Tenant.ERS.Quotations.EditApprovedQuotation');

            vm.vehicles = [];
            vm.customers = [];
            vm.statuses = [];

            var quotationStatuses = {
                Pending: 1,
                Approved: 2,
                Rejected: 3,
                Revised: 4
            };

            vm.filters = {
                enableDateRange: true,
                customerId: null,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                locationId: null,
            };
            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc(),
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
            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.ERS.Quotations.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.ERS.Quotations.Edit'),
                'delete': abp.auth.hasPermission('Pages.Tenant.ERS.Quotations.Delete'),
                view: abp.auth.hasPermission('Pages.Tenant.ERS.Quotations.View'),
                internallyApprove: abp.auth.hasPermission('Pages.Tenant.ERS.Quotations.InternallyApprove'),
                internallyReject: abp.auth.hasPermission('Pages.Tenant.ERS.Quotations.InternallyReject'),
                approveByCustomer: abp.auth.hasPermission('Pages.Tenant.ERS.Quotations.ApproveByCustomer'),
                rejectByCustomer: abp.auth.hasPermission('Pages.Tenant.ERS.Quotations.RejectByCustomer'),
                revise: abp.auth.hasPermission('Pages.Tenant.ERS.Quotations.Revise'),
                print: abp.auth.hasPermission('Pages.Tenant.ERS.Quotations.Print'),
                createPO: abp.auth.hasPermission('Pages.Tenant.ERS.Quotations.CreatePO'),
                createMasterAgreement: abp.auth.hasPermission('Pages.Tenant.ERS.Quotations.CreateMasterAgreement'),
                canEditApprovedQuotation: abp.auth.hasPermission('Pages.Tenant.ERS.Quotations.EditApprovedQuotation')
            };


            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };


            vm.quotationTypes = [
                { type: app.localize("Daily"), id: 1 },
                { type: app.localize("Weekly"), id: 2 },
                { type: app.localize("Monthly"), id: 3 },
                { type: app.localize("Lease"), id: 4 },
                { type: app.localize("LeaseToOwn"), id: 5 }
            ];

            vm.getQuotationType = function (id) {
                if (id == 1)
                    return app.localize("Daily");
                if (id == 2)
                    return app.localize("Weekly");
                if (id == 3)
                    return app.localize("Monthly");
                if (id == 4)
                    return app.localize("Lease");
                if (id == 5)
                    return app.localize("LeaseToOwn");
            }

            vm.getStatus = function (code) {
                if (code === 1)
                    return "Pending";
                else if (code === 2)
                    return "Approved";
                else if (code === 3)
                    return "Rejected";
                else if (code === 4)
                    return "Revised";
                else
                    return "Pending";
            };

            //vm.getCustomerApprovalStatus = function (code) {
            //    if (code === 1)
            //        return "Pending";
            //    else if (code === 2)
            //        return "Customer Approved";
            //    else if (code === 3)
            //        return "Customer Rejected";
            //    else
            //        return "Pending";
            //};

            function getStatuses() {
                vm.statuses = [{ id: 1, name: "Pending" }, { id: 2, name: "Approved" }, { id: 3, name: "Rejected" }];
            };

            //function getCustomerStatuses() {
            //    vm.statuses = [{ id: 1, name: "Pending" }, { id: 2, name: "Customer Approved" }, { id: 3, name: "Customer Rejected" }];
            //};

            vm.searchContact = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true }).then(function (response) {
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
                        vm.filters.customerId = customer.id;
                    }
                });
            };

            vm.getQuotations = function () {
                vm.loading = true;
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
                debugger
                quotationService.getQuotations(vm.filters).success(function (data) {
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
                quotationService.exportToExcel(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.openprintModal = function (id) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/ers/quotation/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.ers.quotation.printTemplates.printPreview as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        quotationId: function () {
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
                            return '~/App/tenant/views/ers/quotation/report.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };

            vm.canPrint = function (entity) {
                return entity.status == quotationStatuses.Approved && entity.customerStatus != quotationStatuses.Rejected && entity.customerStatus != quotationStatuses.Revised ? true : false;
            }


            vm.canCreateMasterAgreementAndPO = function (entity) {
                // var status = false;
                if (entity.status == quotationStatuses.Approved && entity.customerStatus == quotationStatuses.Approved)
                    return true;

                return false;
            }

            vm.canRevise = function (entity) {

                if (entity.status == quotationStatuses.Approved && entity.customerStatus == quotationStatuses.Pending)
                    return true;
                
                return false;
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
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewQuotation(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="row.entity.status == 1 && grid.appScope.permissions.internallyApprove" ng-click="grid.appScope.approveQuotation(row.entity)">' + app.localize('InternallyApprove') + '</a></li>' +
                            '      <li><a ng-if="row.entity.status !== 2 && row.entity.status !== 3 && grid.appScope.permissions.internallyReject" ng-click="grid.appScope.rejectQuotation(row.entity)">' + app.localize('InternallyReject') + '</a></li>' +
                            '      <li><a ng-if="row.entity.status == 2 && row.entity.customerStatus == 1 && grid.appScope.permissions.approveByCustomer" ng-click="grid.appScope.approveQuotationByCustomer(row.entity)">' + app.localize('ApproveByCustomer') + '</a></li>' +
                            '      <li><a ng-if="row.entity.status == 2 && row.entity.customerStatus == 1 && grid.appScope.permissions.rejectByCustomer" ng-click="grid.appScope.rejectQuotationByCustomer(row.entity)">' + app.localize('RejectByCustomer') + '</a></li>' +
                            '      <li><a ng-if="(row.entity.status == 1 || (row.entity.status == 2  && row.entity.customerStatus != 4 && grid.appScope.permissions.canEditApprovedQuotation && !row.entity.masterAgreementCreated)) && grid.appScope.permissions.edit" ng-click="grid.appScope.editQuotation(row.entity,false)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="row.entity.status == 1 && grid.appScope.permissions.delete" ng-click="grid.appScope.deleteQuotation(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.canRevise(row.entity) && grid.appScope.permissions.revise" ng-click="grid.appScope.editQuotation(row.entity,true)">' + app.localize('Revise') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.canPrint(row.entity) && grid.appScope.permissions.print" ng-click="grid.appScope.openprintModal(row.entity.id)">' + app.localize('Print') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.canCreateMasterAgreementAndPO(row.entity) && !row.entity.purchaseOrdersCreated && grid.appScope.permissions.createPO" ng-click="grid.appScope.createPOQuotation(row.entity)">' + app.localize('CreatePO') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.canCreateMasterAgreementAndPO(row.entity) && !row.entity.masterAgreementCreated && grid.appScope.permissions.createMasterAgreement" ng-click="grid.appScope.createMasterAgreement(row.entity)">' + app.localize('CreateMasterAgreement') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('No'),
                        field: 'quotationNo'
                    },
                    {
                        name: app.localize('Type'),
                        field: 'quotationType',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getQuotationType(row.entity.type)}}</div>' +
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
                        name: app.localize('Contact'),
                        field: 'customer.name'
                    },
                    {
                        name: app.localize('Code'),
                        field: 'customer.code'
                    },
                    {
                        name: app.localize('InternalApproval'),
                        field: 'status',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            //'<div class=\"ui-grid-cell-contents\">{{grid.appScope.getStatus(row.entity.status)}}</div>' +
                            '<span class="pull-right label label-success" style="background-color:#A9A9A9;font-size:11px;margin:7px" ng-show="row.entity.status === 1">{{ grid.appScope.getStatus(row.entity.status) }}</span>' +
                            '<span class="pull-right label label-success" style="background-color:#26C281;font-size:11px;margin:7px" ng-show="row.entity.status === 2">{{ grid.appScope.getStatus(row.entity.status) }}</span>' +
                            '<span class="pull-right label label-success" style="background-color:#E43A45;font-size:11px;margin:7px" ng-show="row.entity.status === 3">{{ grid.appScope.getStatus(row.entity.status) }}</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('CustomerApproval'),
                        field: 'customerStatus',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            //'<div class=\"ui-grid-cell-contents\">{{grid.appScope.getStatus(row.entity.status)}}</div>' +
                            '<span class="pull-right label label-success" style="background-color:#A9A9A9;font-size:11px;margin:7px" ng-show="row.entity.customerStatus === 1">{{ grid.appScope.getStatus(row.entity.customerStatus) }}</span>' +
                            '<span class="pull-right label label-success" style="background-color:#26C281;font-size:11px;margin:7px" ng-show="row.entity.customerStatus === 2">{{ grid.appScope.getStatus(row.entity.customerStatus) }}</span>' +
                            '<span class="pull-right label label-success" style="background-color:#E43A45;font-size:11px;margin:7px" ng-show="row.entity.customerStatus === 3">{{ grid.appScope.getStatus(row.entity.customerStatus) }}</span>' +
                            '<span class="pull-right label label-success" style="background-color:#FFD433;font-size:11px;margin:7px" ng-show="row.entity.customerStatus === 4">{{ grid.appScope.getStatus(row.entity.customerStatus) }}</span>' +
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

                        vm.getQuotations();
                    });

                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;
                        vm.getQuotations();
                    });
                },
                data: []
            };

            //vm.quotationPrintModal = function (quotationId) {

            //    var modalInstance = $uibModal.open({
            //        templateUrl: '~/App/tenant/views/ers/quotation/printtemplates/printPreview.cshtml',
            //        controller: 'tenant.views.ers.quotation.printtemplates.printPreview as vmMain',
            //        backdrop: 'static',
            //        //windowClass: 'app-modal-window',
            //        size: 'lg',
            //        resolve: {
            //            quotationId: function () {
            //                return quotationId;
            //            }
            //        }
            //    });
            //};

            openCreateOrEditQuotation = function (quotationId, isRevised) {
                var qid = quotationId;
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/ers/quotation/createOrEditModal.cshtml',
                    controller: 'tenant.views.ers.quotation.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        quotationId: function () {
                            return quotationId;
                        },
                        isRevised: isRevised
                    }
                });
                modalInstance.result.then(function (result) {
                    //if (isRevised) {
                    //    quotationService.reviseQuotationByCustomer({
                    //        id: qid
                    //    }).success(function () {
                    //        abp.notify.success(app.localize('SuccessfullyRejected'));
                    //    });
                    //}
                    vm.getQuotations();
                });
            }

            vm.createPOQuotation = function (leaseQuotationId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/purchaseOrders/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.purchaseOrders.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        options: function () {
                            return {
                                leaseQuotationId: leaseQuotationId.id
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getQuotations();
                });
            };

            vm.createMasterAgreement = function (quotation) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/ers/masterAgreements/createOrEditModal.cshtml',
                    controller: 'tenant.views.ers.masterAgreements.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        options: function () {
                            return {
                                quotationId: quotation.id,
                                quotationNo: quotation.quotationNo,
                                date: quotation.date
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getQuotations();
                });
            };


            openViewQuotationModal = function (quotationId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/ers/quotation/viewModal.cshtml',
                    controller: 'tenant.views.ers.quotation.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        quotationId: function () {
                            return quotationId;
                        },
                        isRevised: false

                    }

                });

            }

            vm.createQuotation = function () {
                openCreateOrEditQuotation(null, false);
            };

            vm.editQuotation = function (Quotation, isRevised) {
                openCreateOrEditQuotation(Quotation.id, isRevised);
            };

            vm.viewQuotation = function (quotation) {
                openViewQuotationModal(quotation.id);
            };

            vm.deleteQuotation = function (quotation) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', quotation.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;
                            quotationService.deleteQuotation({
                                id: quotation.id
                            }).success(function () {
                                vm.getQuotations();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                                }).finally(function () {
                                    vm.loading = false;
                                });
                        }
                    }
                );
            };

            vm.approveQuotation = function (quotation) {
                abp.message.confirm(
                    app.localize('Press Ok To Approve Quotation', quotation.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;
                            quotationService.approveQuotation({
                                id: quotation.id
                            }).success(function () {
                                vm.getQuotations();
                                abp.notify.success(app.localize('SuccessfullyApproved'));
                            }).finally(function () {
                                vm.loading = false;
                            });
                        }
                    }
                );
            };

            vm.rejectQuotation = function (quotation) {
                abp.message.confirm(
                    app.localize('Press Ok To Reject Quotation', quotation.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            quotationService.rejectQuotation({
                                id: quotation.id
                            }).success(function () {
                                vm.getQuotations();
                                abp.notify.success(app.localize('SuccessfullyRejected'));
                            });
                        }
                    }
                );
            };

            vm.approveQuotationByCustomer = function (quotation) {
                abp.message.confirm(
                    app.localize('Press Ok To Approve Quotation', quotation.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;
                            quotationService.approveQuotationByCustomer({
                                id: quotation.id
                            }).success(function () {
                                vm.getQuotations();
                                abp.notify.success(app.localize('SuccessfullyApproved'));
                            }).finally(function () {
                                vm.loading = false;
                            });
                        }
                    }
                );
            };

            vm.rejectQuotationByCustomer = function (quotation) {
                abp.message.confirm(
                    app.localize('Press Ok To Reject Quotation', quotation.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            quotationService.rejectQuotationByCustomer({
                                id: quotation.id
                            }).success(function () {
                                vm.getQuotations();
                                abp.notify.success(app.localize('SuccessfullyRejected'));
                            });
                        }
                    }
                );
            };


            vm.enterKeyPress = function (eventOnKeyPress) {
                if (eventOnKeyPress.which === 13) {
                    vm.getQuotations();
                    eventOnKeyPress.preventDefault();
                }
            }

            vm.clearCustomer = function () {
                vm.filters.customer = null;
                vm.filters.customerId = null;
            };


            function init() {
                lookupService.getLocations()
                    .success(r => {
                        vm.locations = r.items;
                    });
                vm.getQuotations();
                getStatuses();
            }
            init();
        }]);
