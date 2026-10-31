// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:409645-410424
appModule.controller('tenant.views.ers.rental.agreements.index', [
        '$scope', '$uibModal', '$window', 'uiGridConstants', 'abp.services.app.equipmentRentalAgreement', 'abp.services.app.equipmentRentalAgreementSearch',  'abp.services.app.equipmentRentalAgreementExport', 'abp.services.app.chargesSetting', 'abp.services.app.directory', 'utilities', 'appSession', 'abp.services.app.commonLookup', 
        function ($scope, $uibModal, $window, uiGridConstants, equipmentRentalAgreementService, equipmentRentalAgreementSearchService, equipmentRentalAgreementExportService, chargesSettingService, directoryService, utilities, appSession, commonLookupService, ) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });


            vm.loading = false;
            var todayAsString = moment().format('YYYY-MM-DD hh:mm:ss');
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.enableManualAgreementNo = utilities.parseBoolean(abp.setting.get("App.General.EnableManualAgreementNo"));
            vm.isWeeklyMonthlyEnabled = utilities.parseBoolean(abp.setting.get("App.General.WeeklyMonthlyRental"));
            vm.isSaleOrderEnabled = abp.features.isEnabled("CRS.Vouchers.SaleOrders");
            vm.agreementTypes = [
                { type: "Daily", id: 1 },
                { type: "Weekly", id: 2 },
                { type: "Monthly", id: 3 }
            ];

            vm.statuses = null;
            vm.disableDate = false;
            vm.chargesSettings = [];
            vm.customers = [];
            vm.locations = [];
            vm.type = '';
            vm.filters = {
                enableDateRange: true,
                agreementNo: null,
                manualAgreementNo: null,
                agreementType: null,
                status: null,
                startDate: null,
                endDate: null,
                customerId: null,
                salesPerson: null,
                agreementCategory: 1,
                plateNo: '',
                locationId: '',
                poNo: null,
                saleOrder: null,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                vehicleOwnership: null,
                operatorSupplierId: null
            };
            vm.rentalAgreementOwnerships = [
                { key: 'Own', value: 1 },
                { key: 'External', value: 2 }
            ];
            //vm.dateRangeModel = {
            //    startDate: todayAsString,
            //    endDate: todayAsString
            //};
            vm.dateRangeModelChanged = function () {
                vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };
            vm.searchSupplier = function ($select) {
                if (!$select.search) return;
                return directoryService.search({ keyword: $select.search, contactType: 3 }).then(function (response) {
                    vm.suppliers = response.data.items;
                });
            };
            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().add(-29, 'days').startOf('day'),
                    endDate: moment().endOf('day')
                };
            }
            vm.permissions = {
                view: abp.auth.hasPermission('Pages.ERS.Rental.Agreement'),
                create: abp.auth.hasPermission('Pages.ERS.Rental.Agreements.Addnew'),
                edit: abp.auth.hasPermission('Pages.ERS.Rental.Agreements.Edit'),
                replace: abp.auth.hasPermission('Pages.ERS.Rental.Agreements.ReplaceVehicle'),
                print: abp.auth.hasPermission('Pages.ERS.Rental.Agreement'),
                close: abp.auth.hasPermission('Pages.ERS.Rental.Agreements.Close'),
                unclose: abp.auth.hasPermission('Pages.ERS.Rental.Agreements.UnClose'),
                'delete': abp.auth.hasPermission('Pages.ERS.Rental.Agreements.Delete'),
                allActionsOnOtherBranch: abp.auth.hasPermission('Pages.ERS.Rental.Agreements.AllActionsOnOtherBranchAgreements'),
                viewOtherBranch: abp.auth.hasPermission('Pages.ERS.Rental.Agreements.ViewOtherBranchAgreements'),
                addReceipt: abp.auth.hasPermission('Pages.Tenant.Vouchers.Receipts.Addnew')
            };

            vm.isSaleOrderEnable = abp.features.isEnabled("CRS.Vouchers.SaleOrders");
            vm.locationPermissionEditDelete = function (row) {
                if (row.locationId) {
                    if (!vm.permissions.allActionsOnOtherBranch && row.locationId != appSession.user.locationId)
                        return false;
                }
                return true;
            };

            //if delivery pending then don't allow certain actions like Replace Vehicle, Close Agreement, Extent etc.
            vm.isDeliveryNotPending = function (row) {
                if (row.isDeliveryRequired && !row.isVehicleDelivered)
                    return false;

                return true;
            };

            vm.searchUsers = function ($select) {

                return directoryService.search({ keyword: $select.search, contactType: 1 }).then(function (response) {

                    vm.users = response.data.items;
                });
            };

            vm.locationPermissionClose = function (row) {
                if (row.closingLocationId) {
                    if (!vm.permissions.allActionsOnOtherBranch && row.closingLocationId != appSession.user.locationId)
                        return false;
                }
                else if (!vm.permissions.allActionsOnOtherBranch && row.locationId != appSession.user.locationId)
                    return false;
                return true;
            };


            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';


            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };
            vm.statusChanged = function () {

                if (vm.filters.status == 1)
                    vm.filters.enableDateRange = false;
                else
                    vm.filters.enableDateRange = true;

            };

            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('YYYY-MM-DD');
                }
                else {
                    return "";
                }
            };

            vm.getlocalizedString = function (val) {
                return app.localize(val);
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
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize(' ') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewAgreement(row.entity)">' + app.localize('View') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.edit && row.entity.status == 1 && grid.appScope.locationPermissionEditDelete(row.entity)" ng-click="grid.appScope.editAgreement(row.entity)">' + app.localize('Edit') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.features.agreementDocument" ng-click="grid.appScope.openAgreementDocumentsModal(row.entity)">' + app.localize('AgreementDocuments') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.print" ng-click="grid.appScope.printAgreement(row.entity)">' + app.localize('Print') + '</a></li>' +
                            //'      <li><a ng-if="grid.appScope.permissions.addReceipt" ng-click="grid.appScope.addReceipt(row.entity)">' + app.localize('AddReceipt') + '</a></li>' +
                        //'      <li><a ng-if="grid.appScope.permissions.view && row.entity.deposit == 0" ng-click="grid.appScope.createDeposit(row.entity)">' + app.localize('CreateDeposit') + '</a></li>' +
                        '       <li><a ng-if="grid.appScope.permissions.replace && row.entity.status == 1 && grid.appScope.locationPermissionEditDelete(row.entity) && grid.appScope.isDeliveryNotPending(row.entity)" ng-click="grid.appScope.replaceEquipment(row.entity)">' + app.localize('Replace') + ' ' + app.localize('Equipment') + '</a></li>' +
                        '       <li><a ng-if="grid.appScope.permissions.replace && row.entity.status == 1 && grid.appScope.locationPermissionEditDelete(row.entity)" ng-click="grid.appScope.replaceOperator(row.entity)">' + app.localize('Replace') + ' ' + app.localize('Operator') + '</a></li>' +
                          //  '      <li><a ng-if="grid.appScope.isSaleOrderEnable " ng-click="grid.appScope.createOrViewSaleOrders(row.entity)">' + app.localize('SaleOrders') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.close && row.entity.status == 1 && grid.appScope.locationPermissionClose(row.entity) && grid.appScope.isDeliveryNotPending(row.entity) " ng-click="grid.appScope.closeEquipmentRentalAgreement(row.entity)">' + app.localize('CloseAgreement') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.unclose && row.entity.status == 2 && grid.appScope.locationPermissionClose(row.entity)" ng-click="grid.appScope.unCloseAgreement(row.entity)">' + app.localize('UnCloseAgreement') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.delete && row.entity.status == 1 && grid.appScope.locationPermissionEditDelete(row.entity)" ng-click="grid.appScope.deleteAgreement(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '      <li><a ng-click="grid.appScope.openAgreementLogsModal(row.entity)">' + app.localize('Log') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('AgreementNo'),
                        width: 134,
                        type: 'number',
                        field: 'agreementNo',

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
                        name: app.localize('Customer'),
                        field: 'customer.name',
                        width: 180,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.customer.name}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('StartDate'),
                        field: 'startDate',
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.startDate)}}</div>' +
                            '</div>'

                    },
                    {
                        name: app.localize('EndDate'),
                        field: 'endDate',
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.endDate)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Status'),
                        width: 70,
                        cellTemplate: '<div style="text-align:left;margin-left:5px"">{{grid.appScope.getlocalizedString(row.entity.statusText)}}</div>',
                        field: 'status'
                    },
                    {
                        name: app.localize('Location'),
                        field: 'locationId',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" >{{row.entity.location}}</div>' +
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

                        vm.getAgreements();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getAgreements();
                    });
                },
                data: []
            };
            vm.dateRangeCheck = function () {
                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }
            };
            vm.exportToExcel = function () {
                vm.loading = true;

                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc

                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                equipmentRentalAgreementExportService.exportToExcel(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            function getStatuses() {
                vm.statuses = [{ id: 1, name: app.localize("Open") }, { id: 2, name: app.localize("Closed") }];
            };

            vm.report = function () {
                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/ers/rental/agreements/report.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };

            function openPrintAgreementModal(id) {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/tenant/views/ers/rental/agreements/printtemplates/printPreview.cshtml',
                        controller: 'tenant.views.ers.rental.agreements.printTemplates.printPreview as vmMain',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            agreementId: function () {
                                return id;
                            }
                        }
                    });
            }


            vm.printAgreement = function (agreement) {
                openPrintAgreementModal(agreement.id);
            };

            function openViewAgreementModal(agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/ers/rental/agreements/viewModal.cshtml',
                    controller: 'tenant.views.ers.rental.agreements.viewModal as vm',
                    backdrop: 'static',
                    //windowClass: 'app-modal-window',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return agreementId;
                        }
                    }
                });
            }

            vm.createOrViewSaleOrders = function (agreement) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/addOrViewSaleOrder.cshtml',
                    controller: 'tenant.views.crs.agreements.addOrViewSaleOrder as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return agreement.id;
                        },
                        agreementNo: function () {
                            return agreement.agreementNo;
                        },
                        contactId: function () {
                            return agreement.customerId
                        }
                    }
                });
            }

            function openCreateOrEditAgreementModal(agreementId, chargesSettings) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/ers/rental/agreements/createOrEditModal.cshtml',
                    controller: 'tenant.views.ers.rental.agreements.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                agreementId: agreementId,
                                chargesSettings: chargesSettings
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getAgreements();
                });
            }

            vm.isFirebaseInitalized = false;

            function openCloseEquipementRentalAgreementModal(agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/ers/rental/agreements/closeEquipmentAgreementModal.cshtml',
                    controller: 'tenant.views.ers.rental.agreements.closeEquipmentAgreementModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return agreementId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {

                    try {
                        
                        firebase.auth().signOut();
                    } catch (e) { //Not loggedIn or firebase app not initialized...
                        //Do nothing...
                    }

                    vm.getAgreements();
                });
            }

            // Replace Equipment Modal

            function openReplaceEquipmentModal(agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/ers/rental/agreements/replaceEquipmentModal.cshtml',
                    controller: 'tenant.views.ers.rental.agreements.replaceEquipmentModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                agreementId: agreementId,
                                isFirebaseInitalized: vm.isFirebaseInitalized
                            }
                        }
                    }

                });
                modalInstance.result.then(function (result) {
                    vm.getAgreements();
                });
            }


            function openReplaceOperatorModal(agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/ers/rental/agreements/replaceOperatorModal.cshtml',
                    controller: 'tenant.views.ers.rental.agreements.replaceOperatorModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return agreementId
                        }
                    }

                });
                modalInstance.result.then(function (result) {
                    vm.getAgreements();
                });
            }

            function openDeliveryMovementModal(agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/deliveryModal.cshtml',
                    controller: 'tenant.views.crs.agreements.deliveryModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return agreementId;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getAgreements();
                });
            }

            function openCreateDepositModal(agreement) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/deposits/createDeposit.cshtml',
                    controller: 'tenant.views.crs.vouchers.deposits.createDeposit as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                agreement: agreement
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getAgreements();
                });
            };
            function openCreateOrEditReceiptModal(receiptId, agreement) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/receipts/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.receipts.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        receiptId: function () {
                            return receiptId;
                        },

                        agreement: function () {
                            return agreement;
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

                        invoice: null
                    }
                });
                modalInstance.result.then(function (result) {

                });
            }
            vm.viewAgreement = function (agreement) {
                openViewAgreementModal(agreement.id);
            };

            vm.createAgreement = function () {
                openCreateOrEditAgreementModal(null, vm.chargesSettings);
            };

            vm.editAgreement = function (agreement) {
                openCreateOrEditAgreementModal(agreement.id, vm.chargesSettings);
            };

            //vm.printAgreement = function (agreement) {
            //    $window.open('../Agreement/Print/' + agreement.id, '_blank');
            //};

            vm.closeEquipmentRentalAgreement = function (agreement) {
                if (agreement.hasCustodyMovement)
                    abp.message.info('Agreement Can Not Be Closed As It has Open Custody Movement');
                else
                    openCloseEquipementRentalAgreementModal(agreement.id);
            };

            vm.unCloseAgreement = function (agreement) {
                abp.message.confirm(
                    app.localize('UncloseAgreementMessage'), app.localize('PressOkToUncloseAgreement'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            equipmentRentalAgreementService.uncloseAgreement({
                                id: agreement.id
                            }).success(function () {
                                vm.getAgreements();
                                abp.notify.success(app.localize('SuccessfullyUnclosedAgreement'));
                            });
                        }
                    }
                );
            };


            function getChargesSettings() {
                vm.loading = true;

                chargesSettingService.getChargesSettings({ module: 7 }).success(function (data) {
                    vm.chargesSettings = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
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
                            return 2;
                        }
                    }
                }).result.then(function (customer) {
                    if (customer != null) {
                        vm.filters.customer = customer;
                    }
                });
            };
            vm.getAgreements = function () {
                debugger;
                vm.loading = true;

                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc
                //vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                //vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                if (vm.filters.customer != null) {
                    vm.filters.customerId = vm.filters.customer.id;
                }
                if (vm.filters.operatorSupplier != null) {
                    vm.filters.operatorSupplierId = vm.filters.operatorSupplier.id;
                }
                if (vm.filters.salesPerson != null) {
                    vm.filters.salesPersonId = vm.filters.salesPerson.id;
                }

                if (vm.filters.insuranceCompany != null) {
                    vm.filters.insuranceCompanyId = vm.filters.insuranceCompany.id;
                }
                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }
                equipmentRentalAgreementSearchService.getAgreements(vm.filters).success(function (data) {
                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.items;
                    if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null)
                        initDate();
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.deleteAgreement = function (agreement) {
                abp.message.confirm(
                    app.localize('MovementDeleteWarningMessage', agreement.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            equipmentRentalAgreementService.deleteAgreement({
                                id: agreement.id
                            }).success(function () {
                                vm.getAgreements();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

            vm.openAgreementLogsModal = function (agreement) {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/agreementLogsModal.cshtml',
                    controller: 'tenant.views.crs.agreements.agreementLogsModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return agreement.id;
                        },
                        agreementNo: function () {
                            return agreement.agreementNo;
                        }
                    }
                });
            };

            vm.openAgreementDocumentsModal = function (agreement) {
                
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/agreementDocumentsModal.cshtml',
                    controller: 'tenant.views.crs.agreements.agreementDocumentsModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {

                        options: function () {
                            return {
                                agreementId: agreement.id,
                                agreementNo: agreement.agreementNo,
                                ContactCategory: agreement.customer.contactCategory,
                                driverType: agreement.driver.contactType,
                                driverId: agreement.driverId,
                                customerId: agreement.customerId
                            };
                        }
                        
                    }
                });
            };

            vm.clearCustomer = function () {
                vm.filters.customer = null;
                vm.filters.customerId = null;
            };

            vm.clearSalesPerson = function () {
                vm.filters.salesPerson = null;
                vm.filters.salesPersonId = null;
            };



            vm.clearInsuranceCompany = function () {
                vm.filters.insuranceCompany = null;
                vm.filters.insuranceCompanyId = null;
            };

            vm.replaceEquipment = function (agreement) {
                if (agreement.hasCustodyMovement)
                    abp.message.info('Vehicle Can Not Be Replaced As It has Open Custody Movement');
                else
                    openReplaceEquipmentModal(agreement.id);
            };

            vm.replaceOperator = function (agreement) {
                openReplaceOperatorModal(agreement.id);
            };

            vm.addDeliveryMovement = function (agreement) {
                openDeliveryMovementModal(agreement.id);
            };

            vm.addReceipt = function (agreement) {
                openCreateOrEditReceiptModal(null, agreement);
            };
            vm.createDeposit = function (agreement) {
                openCreateDepositModal(agreement);
            };
            function getLocations() {

                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                });
            }
            function initializeFilters() {
                initDate();
                //getAgreementTypes();
                getStatuses();

                //cashe charges settings once to be used while agreement opening/editing
                getChargesSettings();
                vm.getAgreements();
                getLocations();
            }

            //vm.checkingPressedKey = function (keyEvent) {
            //    
            //    if (keyEvent.which == 13) {
            //        keyPress = false;
            //        vm.getAgreements();
            //    }

            //}

            initializeFilters();
        }
    ]);
