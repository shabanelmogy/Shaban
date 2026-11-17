// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:206333-207277
appModule.controller('tenant.views.crs.equipmentSales.agreements.index', [
        '$scope', '$state', '$uibModal', '$window', 'uiGridConstants', 'abp.services.app.chargesSetting', 'abp.services.app.directory', 'utilities',
        'appSession', 'abp.services.app.commonLookup', 'abp.services.app.accessoriesAgreement', 'abp.services.app.agreement', 'abp.services.app.accessoriesAgreementSearch', 'abp.services.app.salesAgreement',
        function ($scope, $state, $uibModal, $window, uiGridConstants, chargesSettingService, directoryService, utilities, appSession, commonLookupService,
            accessoriesAgreementService, agreementService, accessoriesAgreementSearchService, salesAgreementService) {

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
            vm.isSalesAgreementVehicleWiseEnabled = abp.features.isEnabled("CRS.SalesAgreementVehicleWise");
            vm.isSaleOrderEnabled = abp.features.isEnabled("CRS.Vouchers.SaleOrders");
            vm.isVipCustomer = utilities.parseBoolean(abp.setting.get("App.General.IsVipCustomer"));



            vm.statuses = null;
            vm.disableDate = false;
            vm.chargesSettings = [];
            vm.customers = [];
            vm.locations = [];

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
                agreementCategory: 9,
                plateNo: '',
                locationId: '',
                poNo: null,
                saleOrder: null,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };

            //vm.dateRangeModel = {
            //    startDate: todayAsString,
            //    endDate: todayAsString
            //};
            vm.dateRangeModelChanged = function () {
                vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };
            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().add(-29, 'days').startOf('day'),
                    endDate: moment().endOf('day')
                };
            }
            //commented by usmankhalid salesModule
            var SA = 'Pages.Tenant.SalesModule.SalesAgreement.';
            var SAV = 'Pages.Tenant.SalesModule.SalesAgreementVehicleWise.';

            function hasBoth(permission) {
                return abp.auth.hasPermission(SA + permission) ||
                    abp.auth.hasPermission(SAV + permission);
            }

            vm.permissions = {
                view: hasBoth('View'),
                create: hasBoth('AddNew'),
                edit: hasBoth('Edit'),
                approve: hasBoth('Approve'),
                print: hasBoth('Print'),
                generateDownPaymentReceipt: hasBoth('GenerateDownPaymentReceipt'),
                canChangeVehicle: hasBoth('CanChangeVehicle'),
                delete: hasBoth('Delete'),

                soa: abp.auth.hasPermission(SAV + 'SOA'),
                earlySettlement: abp.auth.hasPermission(SAV + 'EarlySettlement'),
                printMasterAgreement: abp.auth.hasPermission(SAV + 'PrintMasterAgreement'),
                restructurePaymentPlan: abp.auth.hasPermission(SAV + 'RestructurePaymentPlan')
            };


            //vm.permissions = {
            //    view: abp.auth.hasPermission('Pages.Tenant.SalesModule.SalesAgreement.View'), //Pages.Tenant.accessories.Agreements
            //    create: abp.auth.hasPermission('Pages.Tenant.SalesModule.SalesAgreement.AddNew'), //abp.auth.hasPermission('Pages.Tenant.Agreements.Addnew'),
            //    edit: abp.auth.hasPermission('Pages.Tenant.SalesModule.SalesAgreement.Edit'), //abp.auth.hasPermission('Pages.Tenant.Agreements.Edit'),
            //    approve: abp.auth.hasPermission('Pages.Tenant.SalesModule.SalesAgreement.Approve'),
            //    print: abp.auth.hasPermission('Pages.Tenant.SalesModule.SalesAgreement.Print'), //abp.auth.hasPermission('Pages.Tenant.Agreements.Addnew'),
            //    generateDownPaymentReceipt: abp.auth.hasPermission('Pages.Tenant.SalesModule.SalesAgreement.GenerateDownPaymentReceipt'), //abp.auth.hasPermission('Pages.Tenant.Agreements.Addnew'),
            //    canChangeVehicle: abp.auth.hasPermission('Pages.Tenant.SalesModule.SalesAgreement.CanChangeVehicle'),
            //    soa: abp.auth.hasPermission('Pages.Tenant.SalesModule.SalesAgreementVehicleWise.SOA'),
            //    earlySettlement: abp.auth.hasPermission('Pages.Tenant.SalesModule.SalesAgreementVehicleWise.EarlySettlement'),
            //    'delete': abp.auth.hasPermission('Pages.Tenant.SalesModule.SalesAgreement.Delete'), //abp.auth.hasPermission('Pages.Tenant.Agreements.Delete'),
            //};

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


            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    return moment(date).format(vm.dateFormat);
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
            vm.getlocalizedString = function (agreementStatus) {

                if (agreementStatus == "Open") {
                    return app.localize("NotApproved");
                }

                if (agreementStatus == "Closed" && vm.isSalesAgreementVehicleWiseEnabled) {
                    return app.localize("Transferred");
                }

                if (agreementStatus == "Approved") {
                    return app.localize("Approved");
                }

                return agreementStatus;
            };
            vm.gridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
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
                            '      <li><a ng-if="grid.appScope.permissions.print" ng-click="grid.appScope.printAgreement(row.entity)">' + app.localize('Print') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.printMasterAgreement && grid.appScope.isSalesAgreementVehicleWiseEnabled" ng-click="grid.appScope.printMasterAgreement(row.entity)">' + app.localize('MasterAgreementPrint') + '</a></li>' +
                            //'      <li><a ng-if="row.entity.status == 1 && grid.appScope.locationPermissionClose(row.entity) && grid.appScope.isDeliveryNotPending(row.entity) " ng-click="grid.appScope.closeAgreement(row.entity)">' + app.localize('CloseAgreement') + '</a></li>' +
                            //'       <li><a ng-if="grid.appScope.permissions.void && row.entity.status != 8" ng-click="grid.appScope.voidAgreement(row.entity)">' + app.localize('VoidAgreement') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.generateDownPaymentReceipt && row.entity.advance > 0 && !row.entity.quotation.isDownPaymentReceipt" ng-click="grid.appScope.createReceipt(row.entity)">' + app.localize('GenerateDownPaymentReceipt') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.canChangeVehicle && row.entity.status == 10" ng-click="grid.appScope.changeVehicle(row.entity)">' + app.localize('ChangeVehicle') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.approve && row.entity.status == 1" ng-click="grid.appScope.approveSalesAgreement(row.entity)">' + app.localize('Approve') + '</a></li>' +
                            '       <li><a ng-if="row.entity.status == 10 && grid.appScope.isSalesAgreementVehicleWiseEnabled" ng-click="grid.appScope.agreementAdditionalCharges(row.entity)">' + app.localize('AdditionalCharges') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.soa && grid.appScope.isSalesAgreementVehicleWiseEnabled && row.entity.status == 10" ng-click="grid.appScope.soaModal(row.entity)">' + app.localize('SOA') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.permissions.earlySettlement && grid.appScope.isSalesAgreementVehicleWiseEnabled && !(row.entity.isSettled) && row.entity.status == 10" ng-click="grid.appScope.earlySettlementModal(row.entity)">' + app.localize('EarlySettlement') + '</a></li>' +
                            '      <li><a ng-if="grid.appScope.isSalesAgreementVehicleWiseEnabled && grid.appScope.permissions.restructurePaymentPlan && !(row.entity.status == 2)" ng-click="grid.appScope.editPaymentPlan(row.entity)">' + app.localize('RestructurePaymentPlan') + '</a></li>' +
                            '      <li><a ng-if="row.entity.status == 1 && grid.appScope.locationPermissionEditDelete(row.entity)" ng-click="grid.appScope.deleteAgreement(row.entity)">' + app.localize('Delete') + '</a></li>' +
                            '      <li><a ng-if="row.entity.status == 10" ng-click="grid.appScope.transferVehicle(row.entity)">' + app.localize('TransferVehicle') + '</a></li>' +
                            //'      <li><a ng-click="grid.appScope.openAgreementLogsModal(row.entity)">' + app.localize('Log') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('AgreementNo'),
                        type: 'number',
                        field: 'agreementNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            ' <span>{{row.entity.agreementNo}}&nbsp</span>' +

                            // Not Approved
                            ' <span ng-show="row.entity.status == 1" class="label label-warning">' +
                            app.localize('Not Approved') +
                            '</span>' +

                            // Approved
                            ' <span ng-show="row.entity.status == 10" class="label label-success">' +
                            app.localize('Approved') +
                            '</span>' +

                            // Transferred
                            ' <span ng-show="grid.appScope.isSalesAgreementVehicleWiseEnabled && row.entity.status == 2" class="label label-info">' +
                            app.localize('Transferred') +
                            '</span>' +

                            // Early Settlement
                            ' <span ng-show="row.entity.isSettled" class="label label-primary">' +
                            app.localize('EarlySettlementShort') +
                            '</span>' +

                            '</div>'
                    },


                    {
                        name: app.localize('Customer'),
                        //width: 134,
                        //type: 'number',
                        field: 'customer.name',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\"><span>{{row.entity.customer.name}}</span></div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('CustomerCode'),
                        field: 'customer.code',
                    },
                    {
                        name: app.localize('Date'),
                        field: 'date',
                        //width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.startDate)}}</div>' +
                            '</div>'

                    },
                    {
                        name: app.localize('Status'),
                        //width: 70,
                        cellTemplate: '<div style="text-align:left;margin-left:5px"">{{grid.appScope.getlocalizedString(row.entity.statusText)}}</div>',
                        //field: 'status'
                    },

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
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                salesAgreementService.exportToExcel(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            //vm.exportToExcel = function () {
            //    var tab_text = "<table border='1px'><tr>";
            //    var textRange;
            //    var j = 0;
            //    var tab1 = document.getElementById('agreementsTable'); // id of table
            //    for (j = 0; j < tab1.rows.length; j++) {

            //        tab_text = tab_text;
            //        tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
            //    }
            //    tab_text = tab_text + "</table>";

            //    var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
            //    var blobUrl = URL.createObjectURL(blob);

            //    var a = document.createElement('a');
            //    a.href = blobUrl;
            //    a.download = 'AgreementsReport.xls';
            //    a.click();

            //};






            //vm.exportToExcel = function () {
            //    vm.loading = true;

            //    //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
            //    //if null then get as following
            //    //fromDate: get local date with time 00:00:00 and then convert to utc
            //    //toDate: get local date of max time of night and then convert to utc

            //    if (vm.filters.enableDateRange) {
            //        vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
            //        vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
            //    }
            //    salesAgreementService.exportToExcel(vm.filters)
            //        .success(function (result) {
            //            app.downloadTempFile(result);
            //        }).finally(function () {
            //            vm.loading = false;
            //        });
            //};
            vm.voidAgreement = function (agreement) {
                abp.message.confirm(
                    app.localize('MovementDeleteWarningMessage', agreement.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            agreementService.voidAgreement({
                                id: agreement.id
                            }).success(function () {
                                vm.getAgreements();
                                abp.notify.success(app.localize('SuccessfullyVoided'));
                            });
                        }
                    }
                );
            };

            vm.approveSalesAgreement = function (agreement) {

                function callApprove() {
                    salesAgreementService.approveAgreement({
                        id: agreement.id
                    }).success(function () {
                        vm.getAgreements();
                        abp.notify.success(app.localize('SuccessfullyApprovedAndInvoiceCreated'));
                    });
                }

                if (vm.isSalesAgreementVehicleWiseEnabled) {

                    salesAgreementService.checkApproveAgreementWarning({
                        id: agreement.id
                    }).success(function (checkResult) {

                        if (checkResult && checkResult.warning) {

                            abp.message.confirm(
                                checkResult.warning,
                                function (isWarningConfirmed) {
                                    if (isWarningConfirmed) {
                                        callApprove();
                                    }
                                }
                            );

                        }
                        else {
                            abp.message.okConfirm(
                                app.localize('Press Ok To Confirm'),
                                function (isConfirmed) {
                                    if (isConfirmed) {


                                        callApprove();

                                    }
                                });
                        }
                    });

                } else {




                    abp.message.okConfirm(
                        app.localize('Press Ok To Confirm'),
                        function (isConfirmed) {
                            if (isConfirmed) {


                                callApprove();

                            }
                        });




                }
            };
            //vm.approveSalesAgreementVehicleWise = function (agreement) {
            //    abp.message.okConfirm(
            //        app.localize('Press Ok To confirm', agreement.name),
            //        function (isConfirmed) {
            //            if (isConfirmed) {
            //                salesAgreementService.approveAgreement({
            //                    id: agreement.id
            //                }).success(function () {
            //                    vm.getAgreements();
            //                    abp.notify.success(app.localize('SuccessfullyApprovedAndInvoiceCreated'));
            //                });
            //            }
            //        }
            //    );
            //};

            vm.createReceipt = function (agreement) {
                if (!agreement || !agreement.id) {
                    return Promise.reject('Invalid agreement object');
                }
                 if (vm.isSalesAgreementVehicleWiseEnabled) {
                    openCreateOrEditReceiptModal(agreement.receiptId, agreement);
                    return Promise.resolve(true);
                }

                return salesAgreementService.isSalesAgreementDownPaymentReceipt(agreement.id)
                    .then(function () {
                        openCreateOrEditReceiptModal(null, agreement);
                        return true;
                    })
                    .catch(function (error) {
                        return Promise.reject(error);
                    });
            };
            function openCreateOrEditReceiptModal(receiptId, agreement) {
                if (agreement) {
                    agreement._calledFromSalesModule = true;
                }
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vouchers/receipts/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.vouchers.receipts.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'xl',
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

            }

            function getStatuses() {
                vm.statuses = [{ id: 1, name: app.localize("NotApproved") }, { id: 10, name: app.localize("Approved") }];
            };


            vm.changeVehicle = function (agreement) {
                openChangeVehicleModal(agreement.id);
            };

            function openChangeVehicleModal(agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/equipmentSales/agreements/changeVehicleModal.cshtml',
                    controller: 'tenant.views.crs.equipmentSales.agreements.changeVehicleModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        agreementId: function () {
                            return agreementId;
                        }
                    }
                });
            }


            function openViewAgreementModal(agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/equipmentSales/agreements/viewModal.cshtml',
                    controller: 'tenant.views.crs.equipmentSales.agreements.viewModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        agreementId: function () {
                            return agreementId;
                        },
                        quotationId: null
                    }
                });
            }

            function openCreateOrEditAgreementModal(agreementId, chargesSettings) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/equipmentSales/agreements/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.equipmentSales.agreements.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        agreementId: function () {
                            return agreementId;
                        },
                        chargesSettings: function () {
                            return chargesSettings;
                        },
                        quotationId: null
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getAgreements();
                });
            }

            function openEditPaymentPlanModal(agreementId, chargesSettings) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/equipmentSales/agreements/editPaymentPlanModal.cshtml',
                    controller: 'tenant.views.crs.equipmentSales.agreements.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        agreementId: function () {
                            return agreementId;
                        },
                        chargesSettings: function () {
                            return chargesSettings;
                        },
                        quotationId: null
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getAgreements();
                });
            }

            vm.isFirebaseInitalized = false;

            function openCloseAgreementModal(agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/accessories/agreements/closeAgreementModal.cshtml',
                    controller: 'tenant.views.crs.accessories.agreements.closeAgreementModal as vm',
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

            vm.report = function () {

                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/equipmentSales/agreements/report.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };

            vm.viewAgreement = function (agreement) {
                openViewAgreementModal(agreement.id);
            };

            vm.createAgreement = function () {
                openCreateOrEditAgreementModal(null, vm.chargesSettings);
            };

            vm.editAgreement = function (agreement) {
                openCreateOrEditAgreementModal(agreement.id, vm.chargesSettings);
            };
            vm.editPaymentPlan = function (agreement) {
                openEditPaymentPlanModal(agreement.id, vm.chargesSettings);
            };

            vm.closeAgreement = function (agreement) {
                if (agreement.hasCustodyMovement)
                    abp.message.info('Agreement Can Not Be Closed As It has Open Custody Movement');
                else
                    openCloseAgreementModal(agreement.id);
            };

            function openTransferVehicleModal(agreementId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/equipmentSales/agreements/transferVehicleModal.cshtml',
                    controller: 'tenant.views.crs.equipmentSales.agreements.transferVehicleModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        agreementId: function () {
                            return agreementId;
                        }
                    }
                });

                modalInstance.result.then(function () {
                    vm.getAgreements();
                });
            }
            vm.transferVehicle = function (agreement) {

                vm.loading = true;

                salesAgreementService.checkTransferVehicleAllowed({
                    id: agreement.id
                }).then(function () {
                    openTransferVehicleModal(agreement.id);
                }).finally(function () {
                    vm.loading = false;
                });

            };
            function getChargesSettings() {
                vm.loading = true;

                chargesSettingService.getChargesSettings({ module: 9 }).success(function (data) {
                    vm.chargesSettings = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.searchCustomers = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customers). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true, includeUnApproved: true }).then(function (response) {
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
                        vm.filters.customerId = customer.id;
                    }
                });
            };
            vm.getAgreements = function () {
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

                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }
                salesAgreementService.getAgreements(vm.filters).success(function (data) {
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
                            salesAgreementService.deleteAgreement({
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
                    templateUrl: '~/App/tenant/views/crs/accessories/agreements/agreementLogsModal.cshtml',
                    controller: 'tenant.views.crs.accessories.agreements.agreementLogsModal as vm',
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

            vm.clearCustomer = function () {
                vm.filters.customer = null;
                vm.filters.customerId = null;
            };

            vm.addReceipt = function (agreement) {
                openCreateOrEditReceiptModal(null, agreement);
            };

            vm.replaceDriver = function (agreement) {
                openReplaceDriverModal(agreement.id);
            };

            function getLocations() {

                commonLookupService.getLocationsActiveAndInActive({}).success(function (data) {
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

            //new print methods
            function openPrintAgreementModal(agreementId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/equipmentSales/agreements/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.equipmentSales.agreements.printPreview as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return agreementId;
                        }
                    }
                });
            }
            vm.printAgreement = function (agreement) {
                openPrintAgreementModal(agreement.id);
            };
            function openPrintMasterAgreementModal(agreementId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/equipmentSales/agreements/printtemplates/printPreviewMaster.cshtml',
                    controller: 'tenant.views.crs.equipmentSales.agreements.printPreviewMaster as vmMain',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return agreementId;
                        }
                    }
                });
            }
            vm.printMasterAgreement = function (agreement) {
                openPrintMasterAgreementModal(agreement.id);
            };
            function openSOAModal(agreementId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/equipmentSales/agreements/soaModal.cshtml',
                    controller: 'tenant.views.crs.equipmentSales.agreements.soaModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return agreementId;
                        }

                    }
                });
            }

            function openAgreementAdditionalChargesModal(agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/equipmentSales/agreements/agreementAdditionalCharges.cshtml',
                    controller: 'tenant.views.crs.equipmentSales.agreements.agreementAdditionalCharges as vm',
                    backdrop: 'static',
                    size: 'xl',
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

            vm.agreementAdditionalCharges = function (agreement) {
                openAgreementAdditionalChargesModal(agreement.id);
            };

            vm.soaModal = function (agreement) {
                openSOAModal(agreement.id);
            };
            function openEarlySettlementModal(agreementId) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/equipmentSales/agreements/earlySettlementModal.cshtml',
                    controller: 'tenant.views.crs.equipmentSales.agreements.earlySettlementModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return agreementId;
                        }

                    }
                });
            }
            vm.earlySettlementModal = function (agreement) {

                if (agreement.isUnpaidUninvoiced) {

                    abp.message.confirm(
                        "Due invoices are pending. Do you want to proceed?",
                        function (isConfirmed) {
                            if (isConfirmed) {
                                openEarlySettlementModal(agreement.id);
                            }
                        }
                    );

                } else {
                    openEarlySettlementModal(agreement.id);
                }
            };

            initializeFilters();
        }
    ]);
