// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:489842-490392
appModule.controller('tenant.views.workshop.jobEstimations.listModal', [
        '$scope', '$uibModalInstance', 'uiGridConstants', '$uibModal', 'abp.services.app.leaseAgreement', 'abp.services.app.leaseAgreementExport', 'abp.services.app.job', 'abp.services.app.jobEstimation', 'abp.services.app.leaseAgreementSearch', 'options',
        function ($scope, $uibModalInstance, uiGridConstants, $uibModal, leaseAgreementService, leaseAgreementExportService, jobAppService, jobEstimationAppService, leaseAgreementSearchService, options) {

            var vm = this;
            vm.date = moment();
            vm.isDashboard2Enabled = abp.features.isEnabled("CRS.AgreementsDashboard2");
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));

            vm.filters = {
                enableDateRange: true,
                days0To2: options.days0To2,
                days3To5: options.days3To5,
                days6To8: options.days6To8,
                days9To10: options.days9To10,
                daysMoreThen10: options.daysMoreThen10,
                total: options.total,
                locationId: options.locationId,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };
            vm.searchUsers = function ($select) {
                if ($select.search == "")
                    return null;
                commonLookupService.searchUsers({ keyword: $select.search }).then(function (response) {
                    vm.users = response.data.items;
                });
            };

            vm.approvedTypes = [{ id: 1, name: 'Approved' }, { id: 0, name: 'Not Approved' }];

            vm.customers = [];
            vm.statuses = [
                { id: 1, name: app.localize("Open") },
                { id: 2, name: app.localize("Closed") },
                { id: 4, name: app.localize("Rejected") },
            ];
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.dateRangeModel = {
                startDate: moment().add(-29, 'days').startOf('day'),
                endDate: moment().endOf('day')
            };

            vm.createJobEstimation = function (jobEstimationId) {
                openCreateOrEditJobEstimationModal(jobEstimationId);
            };

            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));

            vm.dateRangeCheck = function () {
                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }
            };

            vm.dateRangeModelChanged = function () {
                vm.filters.startDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.endDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };

            vm.jobTypes = [
                { id: 1, name: app.localize("RoutineService") },
                { id: 2, name: app.localize("MechanicalService") },
                { id: 3, name: app.localize("ElectricalService") },
                { id: 4, name: app.localize("DentingAndPainting") },
                { id: 5, name: app.localize("AccidentService") },
                { id: 6, name: app.localize("ACService") },
                { id: 7, name: app.localize("BreakdownService") },
                { id: 8, name: app.localize("TyreService") },
                { id: 9, name: app.localize("UnitMaintenance") },
                { id: 10, name: app.localize("UnitRepair") },
                { id: 11, name: app.localize("RegularLubrications") },
                { id: 12, name: app.localize('BodyShop') },
                { id: 13, name: app.localize('InspectionJob') },
                { id: 14, name: app.localize('MakeReadyForSaleOrRent') },
                { id: 15, name: app.localize('Polishing') },
                { id: 16, name: app.localize('Others') }
            ];

            vm.searchCustomers = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customers). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            // extended search using search customer popup
            vm.searchCustomerPopoup = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return null;
                        },
                        type: function () {
                            return 1;
                        }
                    }
                }).result.then(function (customer) {
                    if (customer !== null) {
                        vm.filters.customer = customer;
                    }
                });
            };

            vm.openprintModal = function (jobEstimationId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/workshop/jobEstimations/printTemplates/printPreview.cshtml',
                    controller: 'tenant.views.workshop.jobEstimations.printTemplates.printPreview as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        jobEstimationId: function () {
                            return jobEstimationId;
                        }
                    }
                });
            };

            vm.clearCustomer = function () {
                vm.filters.customer = null;
                vm.filters.customerId = null;
            };

            function openCreateOrEditJobEstimationModal(jobEstimationId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/workshop/jobEstimations/createOrEditModal.cshtml',
                    controller: 'tenant.views.workshop.jobEstimations.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        jobEstimationId: function () {
                            return jobEstimationId;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getJobEstimations();
                });
            }

            vm.getJobEstimations = function () {

                if (vm.filters.jobNo) {
                    vm.filters.plateNo = null;
                    vm.filters.customer = null;
                    vm.filters.status = null;
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }

                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }

                if (vm.filters.customer) {
                    vm.filters.customerId = vm.filters.customer.id;
                }

                vm.loading = true;

                jobEstimationAppService.getJobEstimations(vm.filters)
                    .success(function (data) {
                        vm.gridOptions.totalItems = data.totalCount;
                        vm.gridOptions.data = data.items;
                        if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null)
                            initDate();
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.exportToExcel = function () {
                vm.loading = true;
                if (vm.filters.jobNo) {
                    vm.filters.plateNo = null;
                    vm.filters.customer = null;
                    vm.filters.status = null;
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }

                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }

                if (vm.filters.customer) {
                    vm.filters.customerId = vm.filters.customer.id;
                }

                jobEstimationAppService.exportToExcel(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.report = function () {
                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/workshop/jobEstimations/report.cshtml';
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
                        name: app.localize(' '),
                        enableSorting: false,
                        width: 55,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown " uib-dropdown="" dropdown-append-to-body>' +
                            //'    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize(' ') + ' <span class="caret"></span></button>' +
                            //btn btn-outline btn-circle btn-sm btn-primary blue
                            '<a class="btn btn-xs btn-primary blue fa fa-cog" href="" data-toggle="dropdown" data-hover="dropdown" data-close-others="true"> ' +
                            ' <i class="fa fa-angle-down"></i></a>' +
                            '    <ul class="dropdown-menu">' +
                            '      <li><a ng-click="grid.appScope.openJobEstimationsViesModel(row.entity.id)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.createJobEstimation(row.entity.id)" ng-if="row.entity.status == 1 && row.entity.isApproved == 0">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.openprintModal(row.entity.id)" ng-if="row.entity.status != 4">' + app.localize('Print') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.createJob(row.entity.id)" ng-if="row.entity.status == 1 && row.entity.isApproved == 1">' + app.localize('CreateJob') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.deleteJobEstimation(row.entity)"  ng-if="row.entity.status == 1 && row.entity.isApproved == 0">' + app.localize('Delete') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.approveJobEstimation(row.entity.id)" ng-if="grid.appScope.isApprovalAllowed && row.entity.status == 1 && row.entity.isApproved == 0">' + app.localize('Approve') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.rejectJobEstimation(row.entity.id)" ng-if="grid.appScope.isRejectionAllowed && row.entity.status == 1 && row.entity.isApproved == 0">' + app.localize('RejectEstimation') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.openJobLogModal(row.entity)">' + app.localize('Log') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('EstimationNo'),
                        field: 'jobNo',
                        minWidth: 170,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.jobNo}}' + '&nbsp' + '</span>' +
                            ' <span  ng-show="!row.entity.isApproved&& row.entity.status!=4" class="label label-warning">' + app.localize('Not Approved') + '</span>' +
                            ' <span  ng-show="!row.entity.isApproved && row.entity.status==4" class="label label-danger">' + app.localize('Rejected') + '</span>' +
                            ' <span  ng-show="row.entity.isApproved" class="label label-success">' + app.localize('Approved') + '</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Vehicle'),
                        field: 'Vehicle',
                        minWidth: 60,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.vehicle.plateNo}}' + '&nbsp' + '</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Customer'),
                        field: 'customer',
                        minWidth: 300,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.customer.name}}' + '&nbsp' + '</span>' +
                            '</div>'
                    },
                    {

                        name: app.localize('CreatorUserName'),
                        field: 'creatorUserName',
                        // minWidth: 275,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.creatorUserName}}' + '&nbsp' + '</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('TotalCharges'),
                        field: 'totalCharges',
                        minWidth: 130,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.totalCharges}}' + '&nbsp' + '</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('DateTime'),
                        field: 'datetime',
                        minWidth: 150,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{grid.appScope.getlocalDateTime(row.entity.jobDateTime)}}' + '&nbsp' + '</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Status'),
                        field: 'status',
                        minWidth: 8,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{grid.appScope.getStatusString(row.entity.status)}}' + '&nbsp' + '</span>' +
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
                        vm.getJobEstimations();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getJobEstimations();
                    });
                },
                data: []
            };

            vm.deleteJobEstimation = function (jobestimation) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', ''),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;
                            jobEstimationAppService.deleteJobEstimation({ id: jobestimation.id })
                                .success(function (data) {
                                    abp.notify.info(app.localize('RecordDeleted.'));
                                    vm.getJobEstimations();
                                }).finally(function () {
                                    vm.loading = false;
                                });
                        }
                    }
                );
            };


            vm.rejectJobEstimation = function (jobestimation) {
                abp.message.confirm(
                    app.localize('RejectEstimationMessages'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;
                            jobEstimationAppService.rejectJobEstimation({ id: jobestimation })
                                .success(function (data) {
                                    abp.notify.info(app.localize('RecordRejected'));
                                    vm.getJobEstimations();
                                }).finally(function () {
                                    vm.loading = false;
                                });
                        }
                    }
                );
            };

            vm.getStatusString = function (status) {
                if (status === 1) {
                    return app.localize('Open');
                }
                else if (status === 2) {
                    return app.localize('Closed');
                }
                else if (status === 4) {
                    return app.localize('Rejected')
                }

            };

            vm.openJobEstimationsViesModel = function (id) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/workshop/jobEstimations/viewModal.cshtml',
                    controller: 'tenant.views.workshop.jobEstimations.viewModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        jobEstimationId: function () {
                            return id;
                        }
                    }
                });
            };

            vm.createJob = function (estimationId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/workshop/jobs/createOrEditModal.cshtml',
                    controller: 'tenant.views.workshop.Jobs.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        options: function () {
                            return { jobEstimationId: estimationId };
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    if (result.jobId > 0) {
                        vm.closeEstimation(estimationId);
                    }
                });
            };

            vm.openJobLogModal = function (estimation) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/workshop/jobEstimations/jobLogModal.cshtml',
                    controller: 'tenant.views.workshop.jobEstimations.jobLogModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                jobId: estimation.id,
                                jobNo: estimation.jobNo
                            };
                        }
                    }
                });
            };

            vm.approveJobEstimation = function (id) {
                abp.message.okConfirm(
                    //app.localize('OpenAgreementForBookingMessage', 'Press Ok To Open Agreement'),
                    app.localize(''), app.localize('Press Ok To Approve This Job Estimation'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            jobEstimationAppService.approveJobEstimation({
                                id: id,
                            }).success(function () {
                                vm.getJobEstimations();
                                abp.notify.success(app.localize('SuccessfullyApprovedJobEstimation'));
                            });
                        }
                    }
                );
            };

            vm.closeEstimation = function (id) {
                jobEstimationAppService.closeEstimation(id)
                    .success(function (data) {
                        vm.getJobEstimations();
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.getlocalDateTime = function (date) {
                if (date) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
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
            function getSelectiveBranches() {
                userService.getSelectedBranchIdsByUserId(appSession.user.id).success(function (result) {
                    let selectedBranchIds = result;
                    let selectedBranchs = vm.locations.filter(x => selectedBranchIds.indexOf(x.id) > -1);
                    vm.locations = selectedBranchs;
                    vm.filters.locationId = vm.locations.find(location => location.id === appSession.user.locationId).id;
                });
            }

            function getAllLocations() {

                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                    if (appSession.user.branchAccess == 2)
                        getSelectiveBranches();
                    else if (appSession.user.branchAccess == 1) {
                        vm.filters.locationId = appSession.user.locationId;
                        vm.locations = vm.locations.filter(e => e.id == vm.filters.locationId);
                    }
                });
            }
            vm.getJobEstimations = function () {

                vm.loading = true;

                jobEstimationAppService.getJobEstimationsUnApprovedFilter(vm.filters)
                    .success(function (data) {
                        vm.gridOptions.totalItems = data.totalCount;
                        vm.gridOptions.data = data.items;
                        if (!vm.dateRangeModel.startDate && !vm.dateRangeModel.endDate)
                            initDate();
                    }).finally(function () {
                        vm.loading = false;
                    });
            };
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                //getAllLocations();
                //initDate();
                vm.getJobEstimations();
            }

            init();
           
        }
    ]);
