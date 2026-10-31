// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:494704-495336
appModule.controller('tenant.views.workshop.jobs.listModal', [
        '$scope', '$uibModalInstance', 'uiGridConstants', '$uibModal', 'abp.services.app.leaseAgreement', 'abp.services.app.leaseAgreementExport', 'abp.services.app.job', 'abp.services.app.leaseAgreementSearch', 'options',
        function ($scope, $uibModalInstance, uiGridConstants, $uibModal, leaseAgreementService, leaseAgreementExportService, jobAppService, leaseAgreementSearchService, options) {

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

            vm.customers = [];
            vm.isEREnabled = abp.features.isEnabled("ERS");
            vm.statuses = [{ id: 1, name: app.localize("Open") }, { id: 2, name: app.localize("Closed") }, { id: 3, name: app.localize("Canceled") }];
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

            vm.createOrEditJob = function (jobId) {
                openCreateOrEditJobModal({ jobId: jobId });
            };

            vm.createLubricationJob = function () {
                openCreateOrEditLubricationJobModal();
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

            function openCreateOrEditLubricationJobModal() {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/workshop/jobs/createOrEditLubricationJobModal.cshtml',
                    controller: 'tenant.views.workshop.Jobs.createOrEditLubricationJobModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        options: function () {
                            return "";
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getJobs();
                });
            }

            vm.getJobs = function () {
                
                vm.loading = true;

                jobAppService.getJobsSummaryFilter(vm.filters)
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

            vm.exportToExcel = function () {
                vm.loading = true;
                if (vm.filters.jobNo) {
                    vm.filters.plateNo = null;
                    vm.filters.customer = null;
                    vm.filters.status = null;
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                    vm.filters.estimationNo = null;
                    vm.filters.workOrderNo = null;
                }

                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
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
                            return '~/App/tenant/views/workshop/jobs/report.cshtml';
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
                            '      <li><a ng-click="grid.appScope.openJobViewModel(row.entity.id)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.createOrEditJob(row.entity.id)" ng-if="row.entity.status == 1">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.openprintModal(row.entity.id)">' + app.localize('Print') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.openprintModalGatePass(row.entity.id)">' + app.localize('PrintGatePass') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.jobTime(row.entity.id,row.entity.status)">' + app.localize('LabourJobTime') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.close(row.entity.id)" ng-if="row.entity.status == 1">' + app.localize('CloseJob') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.cancelJob(row.entity)" ng-if="row.entity.status == 1">' + app.localize('CancelJob') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.deleteJob(row.entity)" ng-if="row.entity.status == 1">' + app.localize('Delete') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.openVehicleQualityCheckModal(row.entity)" ng-if="row.entity.status == 1">' + app.localize('VehicleQualityCheckReport') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.openJobLogModal(row.entity)">' + app.localize('Log') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.editPurchaseOrderModel(row.entity)" ng-if="row.entity.status == 2">' + app.localize('EditPurchaseOrder') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('JobNo'),
                        field: 'jobNo',
                        // minWidth: 85,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.jobNo}}' + '&nbsp' + '</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('EstimationNo'),
                        field: 'estimation.jobNo',
                        //minWidth: 135,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.estimation.jobNo}}' + '&nbsp' + '</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Vehicle'),
                        field: 'Vehicle',
                        minWidth: 225,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.vehicle.plateNo}}, {{row.entity.vehicle.model.make.name}} {{row.entity.vehicle.model.name}}' + '&nbsp' + '</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Customer'),
                        field: 'customer',
                        // minWidth: 275,
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
                        // minWidth: 130,
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
                        name: app.localize('CompletionDateTime'),
                        field: 'completionDateTime',
                        minWidth: 150,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{grid.appScope.getlocalDateTime(row.entity.completionDateTime)}}' + '&nbsp' + '</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Status'),
                        field: 'status',
                        // minWidth: 30,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{grid.appScope.getStatusString(row.entity.status)}}' + '&nbsp' + '</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Location'),
                        field: 'location',
                        //minWidth: 30,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.location.name}}' + '&nbsp' + '</span>' +
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
                else if (status === 3) {
                    return app.localize('Canceled');
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

            vm.cancelJob = function (job) {
                abp.message.confirm(
                    app.localize('CancelWarningMessages', ''),
                    function (isConfirmed) {

                        if (isConfirmed) {
                            vm.loading = true;
                            jobAppService.cancelJob({ id: job.id })
                                .success(function (data) {
                                    abp.notify.info(app.localize('RecordCancled.'));
                                    vm.getJobs();
                                }).finally(function () {
                                    vm.loading = false;
                                });
                        }

                    }
                );
            };

            vm.editPurchaseOrderModel = (job) => {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/workshop/jobs/editPurchaseOrderModel.cshtml',
                    controller: 'tenant.views.workshop.jobs.editPurchaseOrderModel as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        job: function () {
                            return job;
                        }
                    }
                });

                modalInstance.result.then(function (result) {

                });
            }
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


            vm.openprintModalGatePass = function (jobId) {
                vm.loading = true;
                jobAppService.validateGatePass({ id: jobId })
                    .success(function () {
                        var modalInstance = $uibModal.open({
                            templateUrl: '~/App/tenant/views/workshop/jobs/gatePassModal.cshtml',
                            controller: 'tenant.views.workshop.jobs.gatePassModal as vm',
                            backdrop: 'static',
                            size: 'lg',
                            resolve: {
                                jobId: function () {
                                    return jobId;
                                }
                            }
                        });
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.openJobViewModel = function (id) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/workshop/jobs/viewModal.cshtml',
                    controller: 'tenant.views.workshop.jobs.viewModal as vm',
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
            function init() {
                vm.filters.status = 1;
                vm.filters.enableDateRange = false;
                console.log(vm.filters);
               // getAllLocations()
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
