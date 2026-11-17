// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:399078-399607
appModule.controller('tenant.views.workshopMovements.index', [
        '$scope', '$state', '$uibModal','utilities', 'uiGridConstants', 'abp.services.app.directory', 'abp.services.app.workshopMovement', 'appSession', 'FileUploader',
        function ($scope, $state, $uibModal, utilities, uiGridConstants, directoryService, workshopMovementService, appSession, fileUploader) {

            var vm = this;
            vm.isEnableCompletion = abp.features.isEnabled("CRS.CustomFeatures.LinkCrsToWorkShop.CreateBillInCRSOnJobClosing");
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.showDriverMinutesInMovements = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowDriverMinutesInMovements"));

            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.suppliers = [];

            vm.filters = {
                enableDateRange: true,
                plateNo: '',
                skipCount: 0,
                movementTypeId: 3,
                IsCompleted: '',
                maxResultCount: app.consts.grid.defaultPageSize,
                contactId: null,
                isJobCompleted: false
            };

            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc()
            };

            vm.permissions = {
                view: abp.auth.hasPermission('Pages.Tenant.WorkshopMovements'),
                create: abp.auth.hasPermission('Pages.Tenant.WorkshopMovements.Addnew'),
                edit: abp.auth.hasPermission('Pages.Tenant.WorkshopMovements.Edit'),
                close: abp.auth.hasPermission('Pages.Tenant.WorkshopMovements.Close'),
                exportToExcel: abp.auth.hasPermission('Pages.Tenant.WorkshopMovements.Export'),
                'delete': abp.auth.hasPermission('Pages.Tenant.WorkshopMovements.Delete'),
                allActionsOnOtherBranch: abp.auth.hasPermission('Pages.Tenant.WorkshopMovements.AllActionsOnOtherBranchWorkshopMovements'),
            };
            vm.isWhatsAppSmsWorkshopMovementManualEnabled = abp.features.isEnabled("Notifications.WhatsAppSmsWorkshopMovementManual");
            vm.isWorkShopMovementEmailManualEnabled = abp.features.isEnabled("Notifications.WorkShopMovementEmailManual");

            vm.locationPermissionClose = function (row) {
                if (row.inDetail_LocationId) {
                    if (!vm.permissions.allActionsOnOtherBranch && row.inDetail_LocationId != appSession.user.locationId)
                        return false;
                }

                return true;
            };

            vm.locationPermissionEditDelete = function (row) {
                if (row.outDetail_LocationId) {
                    if (!vm.permissions.allActionsOnOtherBranch && row.outDetail_LocationId != appSession.user.locationId)
                        return false;
                }

                return true;
            };
            vm.statusChanged = function () {
                if (vm.filters.IsCompleted == "false") {
                    vm.filters.enableDateRange = false;
                }
                else
                    vm.filters.enableDateRange = true;
                vm.dateRangeCheck();

            };
            vm.completionCheck = function () {
                if (vm.filters.IsCompleted == "false") {
                    vm.filters.enableDateRange = false;
                }
                else
                    vm.filters.enableDateRange = true;
                vm.dateRangeCheck();

            };
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm:ss';
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.getlocalizedString = function (agreementStatus) {
                return app.localize(agreementStatus);
            };

            vm.searchSupplier = function ($select) {
                return directoryService.search({ keyword: $select.search, contactType: 3 }).then(function (response) {
                    vm.suppliers = response.data.items;
                });
            };

            vm.clearSupplier = function () {
                vm.filters.contact = null;
                vm.filters.contactId = null;
            };

            // extended search using search customer popup
            vm.searchSupplierPopoup = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return null;
                        },
                        type: function () {
                            return 3;
                        }
                    }
                }).result.then(function (supplier) {
                    if (supplier != null) {
                        vm.filters.contact = supplier;
                        vm.filters.contactId = supplier.id;
                    }
                });
            };

            vm.getWorkshopMovements = function () {
                vm.loading = true;
                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                }

                if (vm.filters.contact != null) {
                    vm.filters.contactId = vm.filters.contact.id;
                }

                workshopMovementService.getWorkshopMovements(vm.filters).success(function (data) {
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.getDriverMinutes = function (row) {
                if (!row ||
                    !row.outDetail ||
                    !row.inDetail ||
                    !row.outDetail.dateTime ||
                    !row.inDetail.dateTime) {
                    return '';
                }

                var outTime = moment(row.outDetail.dateTime);
                var inTime = moment(row.inDetail.dateTime);

                var minutes = inTime.diff(outTime, 'minutes');

                return minutes >= 0 ? minutes : '';
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
                            '  <div class="btn-group dropdown " uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewWorkshopMovement(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit && !row.entity.isComplete && grid.appScope.locationPermissionEditDelete(row.entity)" ng-click="grid.appScope.editWorkshopMovement(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.checkCard(row.entity)">' + app.localize('Print') + '</a></li>' +
                            //'      <li><a target="_blank" ng-href="/Report#/tenant/checkcard/{{row.entity.id}}" >' + app.localize('Print Old') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.close && !row.entity.isComplete && grid.appScope.locationPermissionClose(row.entity)" ng-click="grid.appScope.closeWorkshopMovement(row.entity)">' + app.localize('Close') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete && !row.entity.isComplete && grid.appScope.locationPermissionEditDelete(row.entity)" ng-click="grid.appScope.deleteWorkshopMovement(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '       <li><a ng-if="grid.appScope.isWhatsAppSmsWorkshopMovementManualEnabled" ng-click="grid.appScope.whatsAppSMS(row.entity)">' + app.localize('WhatsAppSMS') + '</a></li>' +
                            '       <li><a ng-if="grid.appScope.isWorkShopMovementEmailManualEnabled" ng-click="grid.appScope.sendEmail(row.entity)">' + app.localize('SendEmail') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('No'),
                        type: 'number',
                        field: 'id',

                    },
                    {
                        name: app.localize('Vehicle'),
                        field: 'vehicleId',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.vehicle.plateNo}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('MakeAndModel'),
                        field: 'makeAndModel',
                        width: 180,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.vehicle.make + " " + row.entity.vehicle.model.name}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Workshop'),
                        field: 'contact.name',
                        width: 230,

                    },
                    {
                        name: app.localize('WorkshopCode'),
                        field: 'contact.code',
                        width: 230,

                    },
                    {
                        name: app.localize('DateOut'),
                        field: 'outDetail.dateTime',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDate(row.entity.outDetail.dateTime)}}</div>' +
                            '</div>'

                    },
                    {
                        name: app.localize('DateIn'),
                        field: 'inDetail.dateTime',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDate(row.entity.inDetail.dateTime)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('DriverMinutes'),
                        width: 140,
                        enableSorting: false,
                        visible: vm.showDriverMinutesInMovements,
                        cellTemplate:
                            '<div class="ui-grid-cell">' +
                            '<div class="ui-grid-cell-contents">' +
                            '<span ng-if="row.entity.isComplete">' +
                            '{{grid.appScope.getDriverMinutes(row.entity)}}' +
                            '</span>' +
                            '</div>' +
                            '</div>'
                    }

                ],
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            vm.filters.sorting = "agreementNo desc";
                        } else {
                            vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }

                        vm.getWorkshopMovements();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getWorkshopMovements();
                    });
                },
                data: []
            };
            vm.sendEmail = function (email) {
                abp.message.okConfirm(
                    '', app.localize('Press Ok To Send Email'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            workshopMovementService.sendWorkShopMovementEmailManual({
                                id: email.id,
                            }).success(function (result) {
                                if (result === true)
                                    abp.notify.success("Email Sent Successfully");
                            });
                        }
                    }
                );
            };
            vm.whatsAppSMS = function (whatsapp) {
                abp.message.okConfirm(
                    '', app.localize('Press Ok To SMS'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            workshopMovementService.sendWorkshopMovementWhatsAppSMSManual({
                                id: whatsapp.id,
                            }).success(function (result) {
                                if (result === true)
                                    abp.notify.success("SMS Sent Successfully");
                            });
                        }
                    }
                );
            };
            vm.checkCard = function (movement) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/mcc/movements/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.movements.printTemplates.printPreview as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        movementId: function () {
                            return movement.id;
                        }
                    }
                });
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
            vm.exportToExcel = function () {
                vm.loading = true;
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                workshopMovementService.exportToExcelWorkshopMovements(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.workshopMovementTypes = [
                { id: 1, name: 'Maintenance' }, { id: 2, name: 'Repair' }, { id: 3, name: 'Accident Repair' }, { id: 10, name: 'Inspection' }, { id: 14, name: 'Breakdown' }
            ];

            function openCreateOrEditWorkshopMovementModal(workshopMovementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/workshopMovements/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.workshopMovements.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        options: function () {
                            return {
                                workshopMovementId: workshopMovementId,

                            }
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getWorkshopMovements();
                });
            }


            // Close Workshop Movement Modal 
            function opencloseWorkshopMovementModal(workshopMovementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/workshopMovements/closeModal.cshtml',
                    controller: 'tenant.views.crs.workshopMovements.closeModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        workshopMovementId: function () {
                            return workshopMovementId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getWorkshopMovements();
                });
            }

            function openViewWorkshopMovementModal(workshopMovementId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/workshopMovements/viewModal.cshtml',
                    controller: 'tenant.views.crs.workshopMovements.viewModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        workshopMovementId: function () {
                            return workshopMovementId;
                        }
                    }

                });
                modalInstance.result.then(function (result) {
                    vm.getWorkshopMovements();
                });
            }

            vm.createWorkshopMovement = function () {
                openCreateOrEditWorkshopMovementModal(null);
            };

            vm.editWorkshopMovement = function (workshopMovement) {
                openCreateOrEditWorkshopMovementModal(workshopMovement.id);
            };

            vm.closeWorkshopMovement = function (workshopMovement) {
                opencloseWorkshopMovementModal(workshopMovement.id);
            };

            vm.viewWorkshopMovement = function (workshopMovement) {
                openViewWorkshopMovementModal(workshopMovement.id);
            };

            vm.deleteWorkshopMovement = function (workshopMovement) {
                abp.message.confirm(
                    app.localize('MovementDeleteWarningMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            workshopMovementService.deleteWorkshopMovement({
                                id: workshopMovement.id
                            }).success(function () {
                                vm.getWorkshopMovements();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            function initializeFilters() {
                vm.getWorkshopMovements();
            }
            initializeFilters();

            // Import Workshop Movements Code
            vm.uploader = new fileUploader({
                url: abp.appPath + 'Document/UploadTempFile',
                queueLimit: 1,
                autoUpload: true,
                removeAfterUpload: true,
                filters: [{
                    name: 'filter',
                    fn: function (item, options) {
                        //File type check
                        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                        if ('|vnd.openxmlformats-officedocument.spreadsheetml.sheet|'.indexOf(type) === -1) {
                            abp.message.warn(app.localize('UploadFile_Warn_FileType'));
                            return false;
                        }

                        //File size check
                        if (item.size > 5242880 * 5) //5MB
                        {
                            abp.message.warn(app.localize('Document_Warn_SizeLimit'));
                            return false;
                        }

                        return true;
                    }
                }]
            });

            vm.uploader.onSuccessItem = function (fileItem, response, status, headers) {
                vm.importing = true;
                if (response) {
                    var fileName = response.result.fileName;
                    vm.importing = false;
                    openImportWorkShopMovementModel(fileName);
                }
                else {
                    abp.message.error(response.error.message);
                }
            };
            vm.uploader.onErrorItem = function (response, error, errorMessage) {
                vm.loading = true;
                if (response.isError) {
                    abp.message.error("Error in File Uploading");
                }

            };

            function openImportWorkShopMovementModel(fileName) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/workshopMovements/importWorkShopMovementModel.cshtml',
                    controller: 'tenant.views.crs.workshopMovements.importWorkShopMovementModel as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        fileName: function () {
                            return fileName;
                        },

                    }
                });
                modalInstance.result.then(function () {
                    // initSupplierOpeningBalance();
                    vm.importing = false;
                });
            }
        }
    ]);
