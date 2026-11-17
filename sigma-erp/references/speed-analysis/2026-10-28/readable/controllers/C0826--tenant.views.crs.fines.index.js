// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:222826-223394
appModule.controller('tenant.views.crs.fines.index', ['$uibModal', '$scope', 'abp.services.app.trafficFine', 'uiGridConstants', 'abp.services.app.vehicle', 'abp.services.app.trafficFile', 'abp.services.app.invoiceSearch', 'abp.services.app.receiptSearch','utilities',
        function ($uibModal, $scope, trafficFineAppService, uiGridConstants, vehicleService, trafficFileService, invoiceSearchService, receiptSearchService, utilities)
        {
            var vm = this;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.isImportTrafficFinesEnabled = abp.features.isEnabled("CRS.CustomFeatures.ImportTrafficFines");
            vm.isFineInvoiceForNrmEnabled = abp.features.isEnabled("CRS.CustomFeatures.FineInvoiceForNrm");

            vm.captchaTxt = "";
            vm.trafficFile = "1040048071";

            vm.downloaderReq = {
                tenantId: abp.session.tenantId,
                trafficFileIds: []
            };

            vm.go = function ()
            {
                var event = new CustomEvent('starDownloadingEvent', {
                    detail: JSON.stringify(vm.downloaderReq)
                });
                event.initEvent('starDownloadingEvent');
                document.dispatchEvent(event);
            };

            vm.sendCaptcha = function ()
            {
                var event = new CustomEvent('sendCaptchaAndDownloadEvent', { detail: vm.captchaTxt });
                event.initEvent('sendCaptchaAndDownloadEvent');
                document.dispatchEvent(event);
            };

            vm.initFineDownloader = function ()
            {
                trafficFileService.getTrafficFiles()
                    .then(function (response)
                    {
                        vm.downloaderReq.trafficFileIds = response.data.items;
                    });
            };



            vm.filters = {
                enableDateRange: true,
                fineNo: null,
                vehicleId: null,
                fromDate: null,
                toDate: null,
                amount: null,
                dateType: 1,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };
            vm.CurrencyFormate = function (amount)
            {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };
            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.permissions = {
                create: abp.auth.hasPermission('Pages.Tenant.TrafficFines.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.TrafficFines.Edit'),
                'delete': abp.auth.hasPermission('Pages.Tenant.TrafficFines.Delete'),
                importTrafficFinesEnable: abp.auth.hasPermission('Pages.Tenant.TrafficFines.ImportTrafficFines'),
                //'view': abp.auth.hasPermission('Pages.Tenant.Receipts.View'),

            };
            vm.openTrafficFinesModal = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/fines/importTrafficFines.cshtml',
                    controller: 'tenant.views.crs.fines.importTrafficFines as vm',
                    backdrop: 'static',
                    size: 'full',


                });
            };

            vm.importTrafficFines = function () {
                vm.openTrafficFinesModal();
            };
            vm.dateRangeCheck = function ()
            {
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
            };
            vm.getTrafficFines = function ()
            {
                vm.loading = true;
                trafficFineAppService.getTrafficFines().success(function (data)
                {
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                }).finally(function ()
                {
                    vm.loading = false;
                });
            };


            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            function initDate()
            {
                vm.dateRangeModel = {
                    startDate: moment().add(-29, 'days').startOf('day'),
                    endDate: moment().endOf('day')
                };
            }
            //vm.dateRangeModel = {
            //    startDate: moment(moment().format('YYYY-MM-DD')).utc(),
            //    endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc(),
            //};

            vm.searchVehicles = function ($select)
            {
                if ($select.search == "") { vm.vehicles = null; return null; }
                return vehicleService.searchVehicles({ plateNo: $select.search }).then(function (response)
                {
                    vm.vehicles = response.data.items;
                });
            };

            vm.clearVehicle = function ()
            {
                vm.filters.vehicle = null;
                vm.filters.vehicleId = null;
            };

            vm.localize = function (input)
            {
                if (input == null)
                    return "";
                return app.localize(input);
            };

            function getMovementType(movementTypeId)
            {
                if (movementTypeId == 1)
                    return vm.localize("Agreement");
                if (movementTypeId == 2)
                    return vm.localize("StaffMove");
                if (movementTypeId == 3)
                    return vm.localize("Garage");
                if (movementTypeId == 4)
                    return vm.localize("Delivery");
                if (movementTypeId == 5)
                    return vm.localize("Collection");
            }

            function getFineInfo(fine)
            {
                if (fine.agreementId != null && fine.invoiceId == null)
                    return "Not Charged";
                if (fine.agreementId != null && fine.invoiceId != null)
                    return "Charged";
                return "";
            }

            vm.getTrafficFines = function ()
            {

                vm.loading = true;
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (vm.filters.vehicle != null) {
                    vm.filters.vehicleId = vm.filters.vehicle.id;
                }

                //if (!vm.filters.enableDateRange) {
                //    vm.filters.fromDate = null;
                //    vm.filters.toDate = null;
                //}

                trafficFineAppService.getTrafficFines(vm.filters).success(function (data)
                {
                    if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null)
                        initDate();
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                    angular.forEach(vm.gridOptions.data, function (row)
                    {
                        row.getMovementDetail = function ()
                        {
                            if (this.movement != null) {
                                if (this.movement.movementTypeId == 1) {
                                    return getMovementType(this.movement.movementTypeId) + ": " + this.movement.refNo + " "; //+ " " + "(" + getFineInfo(this) + ")";
                                }
                                else {
                                    return getMovementType(this.movement.movementTypeId) + ": " + this.movement.id + " ";
                                }
                            };
                        };
                    });
                }).finally(function ()
                {
                    vm.loading = false;
                });
            };

            vm.createInvoiceFromFines = function (trafficFine)
            {
                openInvoiceFromFinesModal(trafficFine);
            };

            vm.createReceiptFromInvoice = function (invoiceId, dueAmount, fine)
            {
                invoiceSearchService.getInvoiceForView({ id: invoiceId }).success(
                    function (result)
                    {
                        var invoice = result;
                        if (invoice != null) {
                            invoice.createFromFines = true;
                            invoice.dueAmount = invoice.amount;
                            var modalInstance = $uibModal.open({
                                templateUrl: '~/App/tenant/views/crs/vouchers/receipts/createOrEditModal.cshtml',
                                controller: 'tenant.views.crs.vouchers.receipts.createOrEditModal as vm',
                                backdrop: 'static',
                                size: 'xl',
                                resolve: {
                                    invoice: function ()
                                    {
                                        return invoice;
                                    },

                                    quotationId: function () {
                                        return null;
                                    },
                                    customer: function () {
                                        return null;
                                    },

                                    downPayment: function () {
                                        return null;
                                    },
                                    receiptId: null,
                                    agreement: null,
                                }
                            });
                            modalInstance.result.then(function (result)
                            {
                                //we are doing so that we can update the receipt no of fine

                                //receiptSearchService.getReceiptForEdit({
                                //    id: result
                                //}).success(function (result) {
                                //    vm.receipt = result;
                                //    if (result != null)
                                fine.receiptNo = result;    //result contains the receipt id which we are updating in the receipt no 

                                trafficFineAppService.createOrUpdateTrafficFine({ trafficFine: fine }).success(function ()
                                {
                                    vm.getAccidents();
                                }).finally(function ()
                                {
                                    vm.saving = false;
                                });
                                //});
                            });
                        }
                    }).finally(function ()
                    {
                        vm.loading = false;
                    });

            };

            function openInvoiceFromFinesModal(trafficFine)
            {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/fines/createInvoiceFromFines.cshtml',
                    controller: 'tenant.views.crs.fines.createInvoiceFromFines as vm',
                    //backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        fine: function ()
                        {
                            return trafficFine;
                        }
                    }
                });

                modalInstance.result.then(function (result)
                {
                    vm.getTrafficFines();
                });
            }

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.getlocalDateTime = function (date)
            {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
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
                            '      <li><a ng-if="grid.appScope.permissions.edit" ng-click="grid.appScope.viewTrafficFine(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit && !row.entity.invoiceId" ng-click="grid.appScope.editTrafficFine(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.openPrintModal(row.entity.id)">' + app.localize('Print') + '</a></li>' +
                            //'      <li><a target="_blank" ng-href="/Report#/tenant/printModalFineReport/{{row.entity.id}}">' + app.localize('Print Old') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit && !row.entity.invoiceId && row.entity.agreementId" ng-click="grid.appScope.chargeTrafficFine(row.entity)">' + `${app.localize("Charge")} (${app.localize("CreateInvoiceAndReceipt")})` + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit && ((!row.entity.invoiceId && row.entity.agreementId) || (!row.entity.invoiceId && row.entity.movement && row.entity.movement.movementTypeId == 2 && grid.appScope.isFineInvoiceForNrmEnabled))" ng-click="grid.appScope.createInvoiceFromFines(row.entity)">' + app.localize('CreateInvoice') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit && row.entity.invoiceId &&row.entity.amount>0 && !row.entity.receiptNo && row.entity.agreementId" ng-click="grid.appScope.createReceiptFromInvoice(row.entity.invoiceId,row.entity.amount,row.entity)">' + app.localize('CreateReceipt') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete && !row.entity.invoiceId" ng-click="grid.appScope.deleteTrafficFine(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },

                    {
                        name: app.localize('FineNo'),
                        width: 200,
                        field: 'fineNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.fineNo}}' + '</span>' +
                            //' <span ng-show="row.entity.agreementId && !row.entity.invoiceId" class="label label-danger">' + app.localize('NotCharge') + '</span>' +
                            //'<span ng-show="row.entity.agreementId && row.entity.invoiceId" class="label label-success">' + app.localize('Charged') + '</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Vehicle'),
                        type: 'number',
                        width: 150,
                        field: 'vehicle.plateNo'
                    },
                    {
                        name: app.localize('Date'),
                        width: 130,
                        field: 'date',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.fineDateTime)}}</div>' +
                            '</div>'
                    },

                    //{
                    //    name: app.localize('Description'),
                    //    width: 230,
                    //    field: 'fineDescription'
                    //},
                    {
                        name: app.localize('Amount'),
                        width: 140,
                        field: 'amount',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.roundingforView(row.entity.amount)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('MovementDetail'),
                        width: 250,
                        field: 'getMovementDetail()',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.getMovementDetail()}}' + '&nbsp' + '</span>' +
                            ' <span  ng-show="row.entity.agreementId && !row.entity.invoiceId" class="label label-danger">' + app.localize('NotCharged') + '</span>' +
                            ' <span  ng-show="!row.entity.agreementId && !row.entity.invoiceId && row.entity.movement && row.entity.movement.movementTypeId == 2 && grid.appScope.isFineInvoiceForNrmEnabled" class="label label-danger">' + app.localize('NotCharged') + '</span>' +
                            //'<span  ng-show="row.entity.agreementId && row.entity.invoiceId" class="label label-success pull-right">' + app.localize('Charged') + '</span>' +
                            '</div>'
                    },
                ],

                onRegisterApi: function (gridApi)
                {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns)
                    {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            vm.filters.sorting = null;
                        } else {
                            vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }

                        vm.getTrafficFines();
                    });

                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize)
                    {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getTrafficFines();
                    });
                },
                data: []
            };

            vm.openPrintModal = function (id)
            {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/reports/finesReport/printTemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.reports.finesReport.printtemplates.printPreview as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        fineId: function ()
                        {
                            return id;
                        }
                    }
                });
            };

            vm.exportToExcel = function ()
            {
                vm.loading = true;

                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                trafficFineAppService.exportToExcel(vm.filters)
                    .success(function (result)
                    {
                        app.downloadTempFile(result);
                    }).finally(function ()
                    {
                        vm.loading = false;
                    });
            };

            function openCreateOrEditTrafficFineModal(trafficFineId)
            {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/fines/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.fines.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        trafficFineId: function ()
                        {
                            return trafficFineId;
                        }
                    }
                });
                modalInstance.result.then(function (result)
                {
                    vm.getTrafficFines();
                });
            }

            function openChargeTrafficFineModal(trafficFine)
            {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/receipts/chargeTrafficFineModal.cshtml',
                    controller: 'tenant.views.crs.receipts.vouchers.chargeTrafficFineModal as vm',
                    //backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        fine: function ()
                        {
                            return trafficFine;
                        }
                    }
                });
                modalInstance.result.then(function (result)
                {
                    vm.getTrafficFines();
                });
            }

            function openViewTrafficFineModal(trafficFineId)
            {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/fines/viewModal.cshtml',
                    controller: 'tenant.views.crs.fines.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        trafficFineId: function ()
                        {
                            return trafficFineId;
                        }
                    }
                });

            }

            vm.viewTrafficFine = function (trafficFine)
            {
                openViewTrafficFineModal(trafficFine.id);
            }
            vm.createTrafficFine = function ()
            {
                openCreateOrEditTrafficFineModal(null);
            };

            vm.editTrafficFine = function (trafficFine)
            {
                openCreateOrEditTrafficFineModal(trafficFine.id);
            };

            vm.chargeTrafficFine = function (trafficFine)
            {
                openChargeTrafficFineModal(trafficFine);
            };

            vm.deleteTrafficFine = function (trafficFine)
            {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage', trafficFine.fineNo),
                    function (isConfirmed)
                    {
                        if (isConfirmed) {
                            trafficFineAppService.deleteTrafficFine({
                                id: trafficFine.id
                            }).success(function ()
                            {
                                vm.getTrafficFines();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            function init()
            {
                initDate();
                vm.getTrafficFines();
            }
            init();
        }]);
