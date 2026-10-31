// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:497114-497773
appModule.controller('tenant.views.workshop.workOrders.index', ['abp.services.app.workOrder', '$scope', '$uibModal', 'abp.services.app.directory', 'uiGridConstants', 'appSession', 'abp.services.app.commonLookup', 'abp.services.app.vehicle','abp.services.app.user','utilities',
        function (workOrderService, $scope, $uibModal, directoryService, uiGridConstants, appSession, commonLookupService, vehicleService,userService, utilities) {

            var vm = this;
            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.isFMSEnabled = abp.features.isEnabled("FMS");
            vm.isApprovedEnabled = abp.features.isEnabled("CRS.Vouchers.Approval.WorkOrders");
            vm.isAllBranchUser = appSession.user.branchAccess == 3;

            vm.customers = [];
            vm.filters = {
                enableDateRange: false,
                voucherNo: null,
                vehicleId: null,
                refNo: null,
                fromDate: null,
                toDate: null,
                locationId: appSession.user.locationId,
                contactId: null,
                skipCount: 0,
                status: 1,
                acceptanceStatus: 1,
                maxResultCount: app.consts.grid.defaultPageSize,
            }
            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };
            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.Vouchers.WorkOrders.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.Vouchers.WorkOrders.Edit'),
                view: abp.auth.hasPermission('Pages.Tenant.Vouchers.WorkOrders.View'),
                approved: abp.auth.hasPermission('Pages.Tenant.Vouchers.WorkOrders.Approve'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Vouchers.WorkOrders.Delete'),
                allActionsOnOtherBranch: abp.auth.hasPermission('Pages.Tenant.Vouchers.WorkOrders.AllActionsOnOtherBranchWorkOrders'),

                viewOtherBranch: abp.auth.hasPermission('Pages.Tenant.Vouchers.WorkOrders.ViewOtherBranchWorkOrders'),
            };
            vm.statuses = [{ id: 1, name: app.localize("Open") }, { id: 2, name: app.localize("Closed") }];
            vm.getStatusString = function (status) {
                if (status === 1) {
                    return app.localize('Open');
                }
                else if (status === 2) {
                    return app.localize('Closed');
                }
            };
            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
            vm.AcceptanceStatus = [{ id: false, name: app.localize("NotAccepted") }, { id: true, name: app.localize("Accepted") }];
            //vm.getAcceptanceStatusString = function (status) {
            //    if (status === 1)
            //    {
            //        return app.localize('');
            //    }
            //    else if (status === 2) {
            //        return app.localize('NotAccepted');
            //    }
            //    else if (status === 3) {
            //        return app.localize('Accepted');
            //    }
                
            //};

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

            vm.searchCustomers = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            vm.clearCustomer = function () {
                vm.filters.customer = null;
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
                }).result.then(function (customer) {
                    if (customer != null) {
                        vm.filters.customer = customer;
                        vm.filters.contactId = customer.id;
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
            vm.getAuthorizedStatus = function (data) {
                if (data == true) {
                    return app.localize('Accepted');
                }
                else if (data == false) {
                    return app.localize('NotAccepted');;
                }
                else {
                    return '';
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
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/stock/grns/createOrEditModal.cshtml',
                    controller: 'tenant.views.stock.grns.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        options: function () {
                            return {
                                stockPoId: stockPo.id
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getWorkOrders();
                });
            };

            vm.createBillOnPO = function (workOrder) {
                openCreateWorkOrderOnBillModal(workOrder);
            };
            openCreateWorkOrderOnBillModal = function (bill) {
                if (bill.voucherSubTypeId == 39)
                    var stockPoId = bill.id

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/bills/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.bills.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                workOrder: bill,
                                billId: null,
                                stockPoId: stockPoId
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getWorkOrders();
                });
            };
            vm.getWorkOrders = function () {

                vm.loading = true;

                //vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                //vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                //if (vm.filters.customer != null)
                //    vm.filters.contact = vm.filters.customer.name;
                //if (vm.filters.vehicle != null)
                //    vm.filters.vehicleId = vm.filters.vehicle.id;
                //

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
                workOrderService.getWorkOrders(vm.filters).success(function (data) {
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
                workOrderService.exportToExcel(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.getGridVehicle = function (workOrder) {
                if (workOrder) {
                    var gridVehicle = null;
                    gridVehicle = workOrder.voucherLines.find(v => v.vehicle);
                    if (gridVehicle)  return gridVehicle.vehicle.plateNo + ' (' + gridVehicle.vehicle.model.make.name + ' ' + gridVehicle.vehicle.model.name + ')';
                }
            };

            vm.getStatus = function (status) {
                if (status == 2)
                    return "Closed";
                return "Open";
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
                            '      <li><a  ng-click="grid.appScope.viewWorkOrder(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="row.entity.status!=2 && row.entity.status!=4 && !row.entity.isAuthorized" ng-click="grid.appScope.editWorkOrder(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="!row.entity.isAuthorized && row.entity.status!=4" ng-click="grid.appScope.acceptWorkOrder(row.entity)">' + app.localize('Accept') + '</a></li>' +
                            '      <li><a ng-if="row.entity.status!=2 && row.entity.status!=4 && !row.entity.isAuthorized" ng-click="grid.appScope.rejectWorkOrder(row.entity)">' + app.localize('Reject') + '</a></li>' +
                            '      <li><a ng-if="row.entity.status!=2 && row.entity.isAuthorized &&row.entity.status!=4" ng-click="grid.appScope.createJob(row.entity.id)" >' + app.localize('CreateJob') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.openprintModal(row.entity.id)">' + app.localize('Print') + '</a></li>' +
                            '      <li><a ng-if="row.entity.status!=2" ng-click="grid.appScope.deleteWorkOrder(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            
                                                                                               
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
                            '<span ng-if="row.entity.isAuthorized == true" class="label label-success">Accepted</span>' +
                            '<span ng-if="row.entity.isAuthorized == false &&row.entity.status != 4" class="label label-danger">Not Accepted</span>' +
                            '<span ng-if="row.entity.status == 4 && row.entity.isAuthorized == false" class="label label-danger">Rejected</span>' +
                            //' <span  ng-show="grid.appScope.isApprovedEnabled && !row.entity.isAuthorized" class="label label-warning">' + app.localize('Not Approved') + '</span>' +
                            //' <span  ng-show="grid.appScope.isApprovedEnabled && row.entity.isAuthorized" class="label label-success">' + app.localize('Approved') + '</span>' +
                            '</div>'
                    },
                    //{
                    //    name: app.localize('Authorized'),
                    //    field: 'isAuthorized',
                    //    cellTemplate:
                    //        '<div class=\"ui-grid-cell\">' +
                    //        '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getAuthorizedStatus(row.entity.isAuthorized)}}</div>' +
                    //        '</div>'
                    //},
                    
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
                        field: 'contact.name',
                        width: 200,
                    },
                    {
                        name: app.localize('CustomerCode'),
                        field: 'contact.code',
                        width: 100,
                    },
                    {
                        name: app.localize('Location'),
                        field: 'location',
                        minWidth: 30,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.location.name}}' + '&nbsp' + '</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Vehicle'),
                        field: 'location',
                        minWidth: 185,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{grid.appScope.getGridVehicle(row.entity)}}' + '&nbsp' + '</span>' +
                            '</div>'
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
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.roundingforView(row.entity.amount)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Status'),
                        field: 'status',
                        minWidth: 8,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{grid.appScope.getStatus(row.entity.status)}}' + '&nbsp' + '</span>' +
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


                        vm.getWorkOrders();
                    });

                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getWorkOrders();
                    });
                },
                data: []
            };

            vm.openprintModal = function (id) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/workshop/WorkOrders/printTemplates/printPreview.cshtml',
                    controller: 'tenant.views.workshop.WorkOrders.printTemplates.printPreview as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        workOrderId: function () {
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
                            return '~/App/tenant/views/workShop/workOrders/report.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };

            openCreateOrEditWorkOrderModal = function (workOrderId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/workShop/WorkOrders/createOrEditModal.cshtml',
                    controller: 'tenant.views.workshop.workOrders.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    //resolve: {
                    //    workOrderId: function () {
                    //        return workOrderId;
                    //    }
                    //}
                    resolve: {
                        options: function () {
                            return {
                                workOrderId: workOrderId,
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getWorkOrders();
                });
            }

            openViewWorkOrderModal = function (workOrderId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/workshop/workOrders/viewModal.cshtml',
                    controller: 'tenant.views.workshop.workOrders.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    //resolve: {
                    //    workOrderId: function () {
                    //        return workOrderId;
                    //    }
                    //}
                    resolve: {
                        options: function () {
                            return {
                                workOrderId: workOrderId,
                            };
                        }
                    }
                });

            }
            vm.createWorkOrder = function () {
                openCreateOrEditWorkOrderModal(null);
            };

            vm.viewWorkOrder = function (workOrder) {
                openViewWorkOrderModal(workOrder.id);
            };

            vm.editWorkOrder = function (workOrder) {
                openCreateOrEditWorkOrderModal(workOrder.id);
            };

            vm.deleteWorkOrder = function (workOrder) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', workOrder.voucherNo),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            workOrderService.deleteWorkOrder({
                                id: workOrder.id
                            }).success(function () {
                                vm.getWorkOrders();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };
            vm.acceptWorkOrder = function (workOrder) {
                abp.message.confirm(
                    app.localize('ApproveMessage', workOrder.voucherNo),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            workOrderService.acceptWorkOrder({
                                id: workOrder.id
                            }).success(function () {
                                vm.getWorkOrders();
                                abp.notify.success(app.localize('SuccessfullyApproved'));
                            });
                        }
                    }
                );
            };
            vm.rejectWorkOrder = function (workOrder) {
                abp.message.confirm(
                    app.localize('RejectMessage', workOrder.voucherNo),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            workOrderService.rejectWorkOrder({
                                id: workOrder.id
                            }).success(function () {
                                vm.getWorkOrders();
                                abp.notify.success(app.localize('SuccessfullyApproved'));
                            });
                        }
                    }
                );
            };

            vm.createJob = function (workOrderId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/workshop/jobs/createOrEditModal.cshtml',
                    controller: 'tenant.views.workshop.Jobs.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        options: function () {
                            return { workOrderId: workOrderId };
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getWorkOrders();
                });
            };

            vm.enterKeyPress = function (eventOnKeyPress) {
                if (eventOnKeyPress.which === 13) {
                    vm.getWorkOrders();
                    eventOnKeyPress.preventDefault();
                }
            }


            vm.approveWorkOrder = function (workOrder) {
                abp.message.okConfirm(
                    //app.localize('OpenAgreementForBookingMessage', 'Press Ok To Open Agreement'),
                    app.localize(''), app.localize('Press Ok To Approve Purchase Order'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            workOrderService.approveWorkOrder({
                                id: workOrder.id,
                            }).success(function () {
                                vm.getWorkOrders();
                                abp.notify.success(app.localize('SuccessfullyAuthorizeWorkOrder'));
                            });
                        }
                    }
                );
            };
            function getSelectiveBranches() {
                userService.getSelectedBranchIdsByUserId(appSession.user.id).success(function (result) {
                    let selectedBranchIds = result;
                    let selectedBranchs = vm.locations.filter(x => selectedBranchIds.indexOf(x.id) > -1);
                    vm.locations = selectedBranchs;
                    vm.filters.locationId = vm.locations.find(location => location.id === appSession.user.locationId).id;
                });
            }

            function getAllLocations() {

                commonLookupService.getLocationsActiveAndInActive({}).success(function (data) {
                    vm.locations = data.items;
                    if (appSession.user.branchAccess == 2)
                        getSelectiveBranches();
                    else if (appSession.user.branchAccess == 1) {
                        vm.filters.locationId = appSession.user.locationId;
                        vm.locations = vm.locations.filter(e => e.id == vm.filters.locationId);
                    }
                });
            }
            function init() {
                getAllLocations()
                initDate();
                vm.getWorkOrders();
            }
            init();
        }]);
