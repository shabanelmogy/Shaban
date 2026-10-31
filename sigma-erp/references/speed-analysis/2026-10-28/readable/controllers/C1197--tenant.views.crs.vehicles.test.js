// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:314737-315259
appModule.controller('tenant.views.crs.vehicles.test', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.job', 'abp.services.app.directory', 'abp.services.app.vehicle',
        function ($scope, $uibModal, uiGridConstants, jobAppService, directoryService, vehicleService) {

            var vm = this;
            vm.filters = {
                filter: '',
                sorting: '',
                vehicleId: null,
                enableDateRange: true,
                status: null,
                ownership: null,
                startDate: null,
                endDate: null,
                customer: null,
                plateNo: '',
                jobNo: '',
                estimationNo: '',
                jobType: null,
                workOrderNo: '',
                maxResultCount: app.consts.grid.defaultPageSize,
            };
            vm.disabledBtn = true;
            vm.customers = [];
            vm.statuses = [{ id: 1, name: app.localize("Open") }, { id: 2, name: app.localize("Closed") }];
            vm.ownership = [{ id: 1, name: app.localize("Own") }, { id: 2, name: app.localize("External") }];
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.dateRangeModel = {
                startDate: moment().add(-29, 'days').startOf('day'),
                endDate: moment().endOf('day')
            };

            vm.jobTypes = [
                { id: 1, name: app.localize("RoutineService") },
                { id: 2, name: app.localize("MechanicalService") },
                { id: 3, name: app.localize("ElectricalService") },
                { id: 4, name: app.localize("DentingAndPainting") },
                { id: 5, name: app.localize("AccidentService") },
                { id: 6, name: app.localize("ACService") },
                { id: 7, name: app.localize("BreakdownService") },
                { id: 8, name: app.localize("TyreService") }
            ];

            vm.createOrEditJob = function (jobId) {
                openCreateOrEditJobModal({ jobId: jobId });
            };

            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));

            vm.dateRangeCheck = function () {

                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }

                if (!vm.filters.enableDateRange) {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }
                if (vm.filters.vehicle != null) {
                    vm.filters.vehicleId = vm.filters.vehicle.id;
                }
            };

            vm.dateRangeModelChanged = function () {
                vm.filters.startDate = vm.dateRangeModel.startDate ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.endDate = vm.dateRangeModel.endDate ? vm.dateRangeModel.endDate : moment().endOf('day');
                if (vm.filters.startDate && vm.filters.endDate)
                    vm.disabledBtn = false;
                else
                    vm.disabledBtn = true;
            };

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

            function openCreateOrEditJobModal(options) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/workshop/jobs/createOrEditModal.cshtml',
                    controller: 'tenant.views.workshop.Jobs.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        options: function () {
                            return options;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getJobs();
                });
            }

            vm.getJobs = function () {

                if (vm.filters.jobNo) {
                    vm.filters.plateNo = null;
                    vm.filters.customer = null;
                    vm.filters.status = null;
                    //vm.filters.startDate = null;
                    //vm.filters.endDate = null;
                    vm.filters.estimationNo = null;
                    vm.filters.workOrderNo = null;
                    vm.filters.vehicleId = null;
                }

                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }

                if (vm.filters.customer) {
                    vm.filters.customerId = vm.filters.customer.id;
                }

                vm.loading = true;

                jobAppService.getJobsForRentalTenant(vm.filters)
                    .success(function (data) {
                        if (data) {
                            vm.gridOptions.totalItems = data.totalCount;
                            vm.gridOptions.data = data.items;
                            if (!vm.dateRangeModel.startDate && !vm.dateRangeModel.endDate)
                                initDate();
                        }
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.getCloesedJob = function () {

                vm.loading = true;


                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
                if (vm.filters.vehicle != null) {
                    vm.filters.vehicleId = vm.filters.vehicle.id;
                }


                jobAppService.getJobsForRentalTenant(vm.filters).success(function (data) {
                    if (!vm.dateRangeModel.startDate && !vm.dateRangeModel.endDate)
                        initDate();
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;

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
                    //vm.filters.startDate = null;
                    //vm.filters.endDate = null;
                    vm.filters.estimationNo = null;
                    vm.filters.workOrderNo = null;
                    vm.filters.vehicleId = null;

                }

                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }

                if (vm.filters.customer) {
                    vm.filters.customerId = vm.filters.customer.id;
                }

                jobAppService.exportToExcel(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.report = function () {
                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        //vehicleId: vm.filters.vehicle.id,
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/vehicles/vehicleRepairHistoryReport.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };

            vm.clearCustomer = function () {
                vm.filters.customer = null;
                vm.filters.customerId = null;
            };
            vm.clearVehicle = function () {
                vm.filters.vehicle = null;
                vm.filters.vehicleId = null;
                vm.disabledBtn = true;
            };
            vm.searchVehicles = function ($select) {
                if ($select.search == "") { vm.vehicles = null; return null; }
                return vehicleService.searchVehicles({ plateNo: $select.search }).then(function (response) {
                    vm.vehicles = response.data.items;
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
                        width: 60,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i>' + ' ' + '<span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-click="grid.appScope.openJobViewModel(row.entity.id)">' + app.localize('View') + '</a></li>' +

                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('JobNo'),
                        field: 'jobNo',
                        minWidth: 85,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.jobNo}}' + '&nbsp' + '</span>' +
                            '</div>'
                    },

                    {
                        name: app.localize('Vehicle'),
                        field: 'Vehicle',
                        minWidth: 90,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.vehicle.plateNo}}' + '&nbsp' + '</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Customer'),
                        field: 'customer',
                        minWidth: 275,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.customer.name}}' + '&nbsp' + '</span>' +
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
                        minWidth: 30,
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
                        vm.getJobs();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getJobs();
                    });
                },
                data: []
            };

            vm.getStatusString = function (status) {
                if (status === 1) {
                    return app.localize('Open');
                }
                else if (status === 2) {
                    return app.localize('Closed');
                }
            };

            vm.deleteJob = function (job) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', ''),
                    function (isConfirmed) {

                        if (isConfirmed) {
                            vm.loading = true;
                            jobAppService.deleteJob({ id: job.id })
                                .success(function (data) {
                                    abp.notify.info(app.localize('RecordDeleted.'));
                                    vm.getJobs();
                                }).finally(function () {
                                    vm.loading = false;
                                });
                        }

                    }
                );
            };

            vm.openprintModal = function (jobId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/workshop/Jobs/printTemplates/printPreview.cshtml',
                    controller: 'tenant.views.workshop.Jobs.printTemplates.printPreview as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        jobId: function () {
                            return jobId;
                        }
                    }
                });
            };

            vm.openJobViewModel = function (id) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/workshop/jobs/viewModalRental.cshtml',
                    controller: 'tenant.views.workshop.jobs.viewModalRental as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        jobId: function () {
                            return id;
                        }
                    }
                });
            };

            vm.openJobLogModal = function (job) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/workshop/jobEstimations/jobLogModal.cshtml',
                    controller: 'tenant.views.workshop.jobEstimations.jobLogModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                jobId: job.id,
                                jobNo: job.jobNo
                            };
                        }
                    }
                });
            };


            vm.openVehicleQualityCheckModal = function (job) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/workshop/jobs/vehicleQualityCheckModal.cshtml',
                    controller: 'tenant.views.workshop.jobs.vehicleQualityCheckModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        jobId: function () {
                            return job.id;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    init();
                });
            };

            vm.close = function (id) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/workshop/jobs/jobClosingModal.cshtml',
                    controller: 'tenant.views.workshop.jobs.jobClosingModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        jobId: function () {
                            return id;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getJobs();
                });
            };

            vm.jobTime = function (id, status) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/workshop/jobs/jobTimeModal.cshtml',
                    controller: 'tenant.views.workshop.jobs.jobTimeModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        job: function () {
                            return {
                                jobId: id,
                                jobStatus: status
                            }
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getJobs();
                });
            }



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

            function init() {

                vm.disabledBtn = true;
                vm.getJobs();
            }

            function closeJob(id) {
                jobAppService.closeJob({ id: id })
                    .success(function (data) {
                        abp.notify.info(app.localize('jobClosed.'));
                        vm.getJobs();
                    }).finally(function () {
                        vm.loading = false;
                    });
            }

            init();
        }

    ]);
