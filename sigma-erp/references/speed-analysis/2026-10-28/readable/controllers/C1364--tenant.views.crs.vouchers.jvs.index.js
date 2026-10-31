// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:367535-368233
appModule.controller('tenant.views.crs.vouchers.jvs.index', ['$scope', '$uibModal', 'abp.services.app.vehicle', 'abp.services.app.directory', 'uiGridConstants', 'abp.services.app.jV', 'appSession', 'abp.services.app.commonLookup', 'utilities', 'abp.services.app.depreciationSummary',
        function ($scope, $uibModal, vehicleService, directoryService, uiGridConstants, JVService, appSession, commonLookupService, utilities, depreciationSummaryService) {
            var vm = this;
            vm.loading = false;
            vm.showJobNo = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.vehicles = [];
            vm.suppliers = [];
            vm.isSalikMonthEndPostingEnabled = abp.features.isEnabled("CRS.Tolls.SalikMonthEndPosting");
            vm.isFineMonthEndPostingEnabled = abp.features.isEnabled("CRS.Fines.FineMonthEndPosting");
            vm.isDarbMonthEndPostingEnabled = abp.features.isEnabled("CRS.Tolls.DarbMonthEndPosting");
            vm.isSageX3Enabled = abp.features.isEnabled('Core.SagX3Integration');
            vm.isAccountsEnabled = abp.features.isEnabled('CRS.Accounts');
            vm.isCustomDisposal = abp.features.isEnabled("CRS.CustomFeatures.CustomDisposalInAsset");
            vm.isVoidingEnabled = abp.features.isEnabled("CRS.Vouchers.Voiding.JVs");
            vm.isJournalEnabled = abp.auth.hasPermission('Pages.Tenant.Accounts.Journal');
            vm.isApprovedEnabled = abp.features.isEnabled("CRS.Vouchers.Approval.JVs");
            vm.approvedTypes = [{ id: 2, name: 'Approved' }, { id: 3, name: 'Not Approved' }];
            vm.voucherSubTypes = [{ id: 50, name: 'JV Provision' }, { id: 66, name: 'Job Expense JV' }, { id: 68, name: 'Stock Sale Expense JV' }];
            vm.approveAllEnableBotton = false;
            vm.postingGroups = [];
            if (vm.isFineMonthEndPostingEnabled)
                vm.postingGroups.push({ id: 28, name: 'Fine Month End Posting' });

            if (vm.isSalikMonthEndPostingEnabled)
                vm.postingGroups.push({ id: 27, name: 'Salik Month End Posting' });
            if (vm.isDarbMonthEndPostingEnabled)
                vm.postingGroups.push({ id: 64, name: 'Darb Month End Posting' });

            vm.filters = {
                enableDateRange: true,
                voucherNo: null,
                vehicleId: null,
                fromDate: null,
                toDate: null,
                skipCount: 0,
                amount: null,
                jobNo: null,
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

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.Vouchers.JVs.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.Vouchers.JVs.Edit'),
                view: abp.auth.hasPermission('Pages.Tenant.Vouchers.JVs.View'),
                'delete': abp.auth.hasPermission('Pages.Tenant.Vouchers.JVs.Delete'),
                void: vm.isVoidingEnabled ? abp.auth.hasPermission('Pages.Tenant.Vouchers.JVs.Void') : false,
                'print': abp.auth.hasPermission('Pages.Tenant.Vouchers.JVs.Print'),
                allActionsOnOtherBranch: abp.auth.hasPermission('Pages.Tenant.Vouchers.JVs.AllActionsOnOtherBranchJVs'),
                editAllocation: abp.auth.hasPermission('Pages.Tenant.Vouchers.JVs.EditAllocation'),
                viewOtherBranch: abp.auth.hasPermission('Pages.Tenant.Vouchers.JVs.ViewOtherBranchJVs'),
                canApprovedOther: abp.auth.hasPermission('Pages.Tenant.Vouchers.JVs.CanApproveOtherBranchJVs'),
                approved: abp.auth.hasPermission('Pages.Tenant.Vouchers.JVs.Approve'),
                unapproved: abp.auth.hasPermission('Pages.Tenant.Vouchers.JVs.UnApprove'),
                cloneJV: abp.auth.hasPermission('Pages.Tenant.Vouchers.JVs.CloneJV'),
            };
            vm.locationPermission = function (row) {
                if (row.locationId) {
                    if (!vm.permissions.allActionsOnOtherBranch && row.locationId != appSession.user.locationId)
                        return false;
                }
                return true;
            };
            vm.allBranchPermission = function (row) {
                if (row.locationId) {
                    if (vm.permissions.approved && !vm.permissions.canApprovedOther && row.locationId === appSession.user.locationId) {
                        return true;
                    }
                    if (vm.permissions.canApprovedOther) {
                        return true;
                    }

                }
                return false;
            };

            vm.getAssetSearch = function ($select) {
                if ($select.search == "") return;
                depreciationSummaryService.getAssetSearch({ title: $select.search, isDisposed: true }).success(function (data) {
                    vm.assets = data.items;
                }).finally(function () {

                });
            };


            vm.approveAllMethod = function () {
                vm.ids = [];
                angular.forEach(vm.gridOptions.data, function (receipts) {
                    if (!jvs.isAuthorized) {
                        vm.ids.push(receipts.id);
                    }
                });
                JVService.approvejVs(vm.ids).success(function () {
                    vm.getJVs();
                    abp.notify.success(app.localize('SuccessfullyAuthorizeJV'));
                });
            };
            vm.onVoucherSubTypeChange = function () {
                if (vm.filters.voucherSubTypeId == 66) {
                    vm.showJobNo = true;
                }
                else {
                    vm.showJobNo = false;
                }
                vm.filters.jobNo = null;
            };

            vm.getVoucherSubTypeById = function (voucherSubTypeId) {
                if (voucherSubTypeId == 66) return app.localize("JobExpenseJV");
                else if (voucherSubTypeId == 50) return app.localize("JVProvision");
                else if (voucherSubTypeId == 68) return app.localize("StockSaleExpenseJV");
                else return "JV";
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

            vm.searchVehicles = function ($select) {
                if ($select.search == "") { vm.vehicles = null; return null; }
                return vehicleService.searchVehicles({ plateNo: $select.search }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };

            vm.searchSupplier = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, contactCategory: 2 }).then(function (response) {
                    vm.suppliers = response.data.items;
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
                            return 2;
                        },
                        type: function () {
                            return 2;
                        }
                    }
                }).result.then(function (supplier) {
                    if (supplier != null) {
                        vm.filters.supplier = supplier;
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
            vm.getJVs = function () {
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

                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
                if (vm.isApprovedEnabled) {
                    vm.approveAllEnableBotton = vm.filters.approvedType == 3 ? true : false;
                }

                if (!vm.isApprovedEnabled) {
                    vm.filters.approvedType = null;
                    vm.filters.approvedById = null;
                    vm.filters.createdById = null;
                }
                JVService.getJVs(vm.filters).success(function (data) {
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

            function getLocationsActiveAndInActive() {
                commonLookupService.getLocationsActiveAndInActive({}).success(function (data) {
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
                JVService.exportToExcel(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };
            vm.exportToExcelDetailed = function () {
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
                JVService.exportToExcelDetailed(vm.filters)
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
                            '      <li><a  ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewJV(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a  ng-if="grid.appScope.isApprovedEnabled && grid.appScope.permissions.edit && !row.entity.isAuthorized &&row.entity.voucherSubTypeId!=68&& grid.appScope.locationPermission(row.entity) && row.entity.status != 5" ng-click="grid.appScope.editJV(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a  ng-if="!grid.appScope.isApprovedEnabled && grid.appScope.permissions.edit &&row.entity.voucherSubTypeId!=68&& grid.appScope.locationPermission(row.entity) && row.entity.status != 5" ng-click="grid.appScope.editJV(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a  ng-if="grid.appScope.permissions.editAllocation && grid.appScope.locationPermission(row.entity) && row.entity.status != 5" ng-click="grid.appScope.allocateJV(row.entity)">' + app.localize('Allocation') + '</a></li>' +
                            '      <li><a  ng-if="grid.appScope.isApprovedEnabled && grid.appScope.permissions.delete && !row.entity.isAuthorized && row.entity.voucherSubTypeId!=68 && grid.appScope.locationPermission(row.entity) && row.entity.status != 5" ng-click="grid.appScope.deleteJV(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '      <li><a  ng-if="!grid.appScope.isApprovedEnabled && grid.appScope.permissions.delete &&  row.entity.voucherSubTypeId!=68 && grid.appScope.locationPermission(row.entity) && row.entity.status != 5" ng-click="grid.appScope.deleteJV(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.void && row.entity.isAuthorized  &&row.entity.voucherSubTypeId!=68&& row.entity.status != 5 && grid.appScope.isAccountsEnabled" ng-click="grid.appScope.voidJV(row.entity)">' + app.localize('Void') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.view && row.entity.status != 5" ng-click="grid.appScope.openprintModal(row.entity.id)">' + app.localize('Print') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.permissions.view" target="_blank" ng-href="/Report#/tenant/printModalJv/{{row.entity.id}}" >' + app.localize('Print Old') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.allBranchPermission(row.entity) && !row.entity.isAuthorized && row.entity.status!=4" ng-click="grid.appScope.approveJVs(row.entity)">' + app.localize('Approve') + '</a></li>' +
                            '    <li><a ng-if="grid.appScope.permissions.unapproved && row.entity.isAuthorized" ng-click="grid.appScope.unapproveJV(row.entity)">' + app.localize('UnApprove') + '</a></li>' +
                            '      <li><a  ng-if="grid.appScope.permissions.edit && grid.appScope.locationPermission(row.entity) && (row.entity.voucherSubTypeId==27 || row.entity.voucherSubTypeId==64 )" ng-click="grid.appScope.salikVoucherDetails(row.entity)">' + app.localize('SalikDetails') + '</a></li>' +
                            '      <li><a  ng-if="grid.appScope.permissions.view && row.entity.voucherSubTypeId==28" ng-click="grid.appScope.fineDetails(row.entity)">' + app.localize('Fine') + ' ' + app.localize('Detail') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.isJournalEnabled && row.entity.isAuthorized" ng-click="grid.appScope.openJournalViewModal(row.entity)">' + app.localize('Journal') + '</a></li>' +
                            '      <li><a  ng-if="grid.appScope.permissions.cloneJV" ng-click="grid.appScope.cloneJV(row.entity)">' + app.localize('CloneJV') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },

                    {
                        name: app.localize('No'),
                        field: 'voucherNo',
                        type: 'number',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.voucherNo}}' + '&nbsp' + '</span>' +
                            ' <span  ng-show="row.entity.voucherSubTypeId==27" class="label label-warning">' + app.localize('SalikMonthEndPosting') + '</span>' +
                            ' <span  ng-show="row.entity.voucherSubTypeId==28" class="label label-success">' + app.localize('FineMonthEndPosting') + '</span>' +
                            ' <span  ng-show="grid.appScope.isApprovedEnabled && !row.entity.isAuthorized  && row.entity.status!=4" class="label label-warning">' + app.localize('Not Approved') + '</span>' +
                            ' <span  ng-show="grid.appScope.isApprovedEnabled && row.entity.isAuthorized" class="label label-success">' + app.localize('Approved') + '</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('SageX3No'),
                        visible: vm.isSageX3Enabled,
                        field: 'externalCode'
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
                        name: app.localize('VoucherSubType'),
                        field: 'voucherSubType',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getVoucherSubTypeById(row.entity.voucherSubTypeId)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('JobNo'),
                        field: 'jobNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.job.jobNo}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Amount'),
                        field: 'amount',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.roundingforView(row.entity.amount)}}</div>' +
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

            openCreateOrEditJVModal = function (JVId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/jvs/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.jvs.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        JVId: function () {
                            return JVId;
                        },
                        IsClone: function () {
                            return false;
                        },
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getJVs();
                });
            }

            openCreateOrEditCloneJVModal = function (JVId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/jvs/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.jvs.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        JVId: function () {
                            return JVId;
                        },
                        IsClone: function () {
                            return true;
                        },
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getJVs();
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

            openViewJVModal = function (JVId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/jvs/viewModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.jvs.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        JVId: function () {
                            return JVId;
                        },
                        IsClone: function () {
                            return false;
                        },
                    }
                });

            }

            openAllocateJvModal = function (JVId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/jvs/allocateJvModalForSelect.cshtml',
                    controller: 'tenant.views.crs.vouchers.jvs.allocateJvModalForSelect as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        JVId: function () {
                            return JVId;
                        }
                    }
                });

            }

            openFineDetailsModel = function (JV) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/jvs/fineDetailsModel.cshtml',
                    controller: 'tenant.views.crs.vouchers.jvs.fineDetailsModel as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        JV: function () {
                            return JV;
                        }
                    }
                });

            }


            opensalikVoucherDetailsModal = function (JV) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/jvs/tollsDetailModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.jvs.tollsDetailModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        JV: function () {
                            return JV;
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

            vm.createJV = function () {
                openCreateOrEditJVModal(null);
            };

            vm.salikVoucherDetails = function (JV) {
                opensalikVoucherDetailsModal(JV);
            };

            vm.editJV = function (JV) {
                openCreateOrEditJVModal(JV.id);
            };
            vm.cloneJV = function (JV) {
                openCreateOrEditCloneJVModal(JV.id);
            };

            vm.viewJV = function (JV) {
                openViewJVModal(JV.id);

            }

            vm.fineDetails = function (JV) {
                openFineDetailsModel(JV);
            };

            vm.deleteJV = function (JV) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', JV.voucherNo),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            JVService.deleteJV({
                                id: JV.id
                            }).success(function () {
                                vm.getJVs();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.voidJV = function (JV) {
                abp.message.confirm(
                    app.localize('VoidWarningMessage', JV.voucherNo),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;
                            JVService.voidJV({
                                id: JV.id
                            }).success(function () {
                                vm.getJVs();
                                abp.notify.success(app.localize('SuccessfullyVoided'));
                            }).error(function (data) {
                                if (data) {
                                    setTimeout(() => abp.message.info(data.message), 300);
                                }

                            }).finally(function () { vm.loading = false; });
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

            vm.clearSupplier = function () {
                vm.filters.supplier = null;
                vm.filters.contact = null;
            };

            vm.clearAsset = function () {
                vm.filters.assetId = null;
                vm.filters.asset = null;
            };

            vm.openJournalViewModal = function (JV) {
                openJournalViewModal(JV);
            }

            openJournalViewModal = function (JV) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/accounting/journal/viewModal.cshtml',
                    controller: 'tenant.views.crs.accounting.journal.viewModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        voucherId: function () {
                            return JV.id;
                        },
                        voucherNo: function () {
                            return JV.voucherNo;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getJVs();
                });
            }

            vm.approveJVs = function (jvs) {
                abp.message.okConfirm(
                    app.localize(''), app.localize('PressOkToApproveJVs'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            JVService.approveJV({
                                id: jvs.id,
                            }).success(function () {
                                vm.getJVs();
                                abp.notify.success(app.localize('SuccessfullyAuthorizedJVs'));
                            });
                        }
                    }
                );
            };

            vm.unapproveJV = function (jvs) {
                abp.message.okConfirm(
                    app.localize(''), app.localize('PressOkToUnApproveJV'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            JVService.unApproveJV({
                                id: jvs.id,
                            }).success(function () {
                                vm.getJVs();
                                abp.notify.success(app.localize('SuccessfullyUnAuthorizedJV'));
                            });
                        }
                    }
                );
            };

            function init() {
                getLocationsActiveAndInActive();
                initDate();
                vm.dateRangeModelChanged();
                vm.getJVs();
                /* vm.getVoucherSubTypeById();*/
            }
            init();
        }]);
