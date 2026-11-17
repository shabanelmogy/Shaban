// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:424213-425968
appModule.controller('tenant.views.externalVehiclesControlPanel.rental.agreements.index', [
        '$scope', '$uibModal', '$window', 'uiGridConstants', 'abp.services.app.commonLookup', 'abp.services.app.agreement', 'abp.services.app.externalRentalAgreementSearch', 'abp.services.app.rentalAgreementExport', 'abp.services.app.chargesSetting', 'abp.services.app.directory', 'utilities', 'appSession', 'abp.services.app.commonLookup', 'abp.services.app.saleOrigin', 'abp.services.app.agreementGroup', '$rootScope', 'abp.services.app.customerProject', 'abp.services.app.agreementSMS', 'abp.services.app.user',
        function ($scope, $uibModal, $window, uiGridConstants, lookupService, agreementService, externalRentalAgreementSearchService, rentalAgreementExportService, chargesSettingService, directoryService, utilities, appSession, commonLookupService, saleOriginService, agreementGroupService, $rootScope, customerProjectService, agreementSMSService, userService) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });


            vm.loading = false;
            var todayAsString = moment().format('YYYY-MM-DD hh:mm:ss');
            vm.dateRangeOptions = app.createDateRangePickerOptions();           
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.isAgreementAndCustomerBalanceInAgreement = utilities.parseBoolean(abp.setting.get("App.Speed.Common.AgreementAndCustomerBalanceInAgreementView"));

            vm.advancedFiltersAreShown = false;
            vm.skipCount = 0;

            vm.contactOwner = [];
            vm.searchOwner = function ($select) {

                return lookupService.searchContact({ keyword: $select.search }).then(function (response) {
                    vm.contactOwner = response.data.items;
                });
            };
            vm.agreementTypes = [
                { type: "Daily", id: 1 },
                { type: "Weekly", id: 2 },
                { type: "Monthly", id: 3 }
            ];
            if (vm.isHourlyEnabled)
                vm.agreementTypes.push({ type: "Hourly", id: 6 });

            vm.getContactType = function (type) {

                if (type == 1)
                    return app.localize('Individual');

                else if (type == 2)
                    return app.localize('Company');
                return '';
            };
            vm.getVehicleType = function (id) {
                if (id == 1)
                    return app.localize("Rental")
                if (id == 2)
                    return app.localize("Lease")
                if (id == 3)
                    return app.localize("Replacement")
                if (id == 4)
                    return app.localize("Limousine")
                if (id == 5)
                    return app.localize("Workshop")
                if (id == 6)
                    return app.localize("Staff")
                else
                    return "";
            };
            vm.statuses = null;
            vm.disableDate = false;
            vm.chargesSettings = [];
            vm.customers = [];
            vm.locations = [];
            vm.type = '';
            vm.complimentaryOptions = [
                { key: 'All', value: null },
                { key: 'Complimentary', value: true },
                { key: 'Non Complimentary', value: false }
            ];
            vm.filters = {
                enableDateRange: true,
                agreementNo: null,
                masterAgreementNo: null,
                manualAgreementNo: null,
                agreementType: null,
                status: null,
                vehicleCheckedInButAgreementDueToClose: false,
                extendedAgreement: false,
                startDate: null,
                endDate: null,
                customerId: null,
                vehicleOwnerId: null,
                projectName: null,
                salesPerson: null,
                insuranceCompany: null,
                agreementCategory: 1,
                permanentVehicle: false,
                plateNo: '',
                pickupLocation: '',
                insuranceClaimNo: '',
                locationId: '',
                poNo: null,
                saleOrder: null,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                vehicleOwnership: null,
                saleOrigin: null,
                agreementGroup: null,
                agreementGroupId: null,
                projectId: null,
                printingWithoutLogo: false,
                createdBy: '',
                createdById: '',
            };


            vm.resetFilters = function () {
                vm.filters.agreementNo = null;
                vm.filters.masterAgreementNo = null;
                vm.filters.manualAgreementNo = null;
                vm.filters.agreementType = null;
                vm.filters.selectedStatus = null;
                vm.filters.status = null;
                vm.filters.startDate = moment(moment().format('YYYY-MM-DD'));
                vm.filters.endDate = moment(moment().format('YYYY-MM-DD'));
                vm.filters.customer = null;
                vm.filters.customerId = null;
                vm.filters.vehicleOwnerId = null;
                vm.filters.salesPerson = null;
                vm.filters.insuranceCompany = null;
                vm.filters.permanentVehicle = false;
                vm.filters.plateNo = "";
                vm.filters.pickupLocation = "";
                vm.filters.insuranceClaimNo = "";
                vm.filters.locationId = "";
                vm.filters.poNo = null;
                vm.filters.saleOrder = null;
                skipCount: 0,
                    vm.filters.vehicleOwnership = null;
                vm.filters.saleOrigin = null;
                vm.filters.project = null;
                vm.filters.isOverDueClosing = null;
                vm.selectComplimentaryOption = null;
                vm.filters.isComplimentary = null;
                vm.filters.vehicleCheckedInButAgreementDueToClose = null;
                vm.filters.extendedAgreement = null;
                vm.filters.createdBy = null;
                vm.filters.createdById = null;
            }


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
            function initDate() {
                vm.dateRangeModel = {
                    startDate: moment().startOf('day'),
                    endDate: moment().endOf('day')
                };
            }
            vm.permissions = {
                view: abp.auth.hasPermission('Pages.ExternalVehiclesControlPanel.Agreements.View'),       
                //exportToExcelDetailed: abp.auth.hasPermission('Pages.Tenant.Agreements.ExportToExcelDetailed')
            };

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

            vm.searchUsersWithDesignation = function () {

                return directoryService.searchSalesPerson().then(function (response) {

                    vm.userList = response.data.items;
                });
            };

            vm.searchSaleOrigin = function ($select) {
                if (!$select.search) return;
                return saleOriginService.getSaleOrigins({ keyword: $select.search }).then(function (response) {
                    vm.saleOrigins = response.data.items;
                });
            };

            vm.searchAgreementGroup = function () {

                return agreementGroupService.getAgreementGroups().then(function (response) {
                    vm.agreementGroups = response.data.items;
                });
            };

            vm.searchSupplierContact = function ($select) {
                // Only contact Suppliers=3 is required
                return directoryService.searchByContactGroup({ keyword: $select.search, contactType: 3 }).then(function (response) {
                    vm.suppliers = response.data.items;
                });
            };

            vm.searchProjects = function ($select) {
                if (!$select.search) return;
                return customerProjectService.getCustomerProject({ keyword: $select.search }).then(function (response) {
                    vm.projects = response.data.items;
                });
            };

            vm.onChangeComplimentary = () => {
                if (vm.selectComplimentaryOption) {
                    vm.filters.isComplimentary = vm.selectComplimentaryOption.value;
                }
            }

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

                vm.filters.status = vm.filters.selectedStatus;
                if (vm.filters.status) {
                    if (vm.filters.status == 9) {
                        vm.filters.status = 2;
                        vm.filters.isPreClosed = true;
                    }
                    else
                        vm.filters.isPreClosed = false;
                }
                else {
                    vm.filters.isPreClosed = false;
                }

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
            vm.features = {
                agreementDocument: abp.features.isEnabled("CRS.Rental.Agreements.AgreementDocuments")
            };
            vm.getlocalizedString = function (agreementStatus) {
                return app.localize(agreementStatus);
            };
            vm.gridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
                enablePagination: true,
                enableSorting: true,
                useExternalSorting: true,
                enableColumnResizing: true,
                appScopeProvider: vm,
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (sortColumns.length === 0) {
                            return;
                        }

                        let sortColumn = sortColumns[0].field;
                        let sortDirection = sortColumns[0].sort.direction;

                        // Sort the entire dataset (assuming `data` is the full dataset)
                        let fullData = angular.copy(grid.appScope.gridOptions.data); // Create a copy of the data to sort

                        fullData.sort(function (a, b) {
                            let aValue = a[sortColumn];
                            let bValue = b[sortColumn];

                            // Check if both values are numbers
                            let aIsNumber = !isNaN(aValue) && !isNaN(parseFloat(aValue));
                            let bIsNumber = !isNaN(bValue) && !isNaN(parseFloat(bValue));

                            // Numeric comparison if both are numbers
                            if (aIsNumber && bIsNumber) {
                                return sortDirection === 'desc' ? bValue - aValue : aValue - bValue;
                            }

                            // String comparison for other cases
                            aValue = (aValue || '').toString();
                            bValue = (bValue || '').toString();

                            let comparisonResult = aValue.localeCompare(bValue, undefined, { sensitivity: 'base' });
                            return sortDirection === 'desc' ? -comparisonResult : comparisonResult;
                        });

                        grid.appScope.gridOptions.data = fullData;
                        grid.appScope.gridApi.pagination.seek(1);
                    });






                    //$scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                    //    if (sortColumns.length === 0) {
                    //        return;
                    //    }

                    //    let sortColumn = sortColumns[0].field;
                    //    let sortDirection = sortColumns[0].sort.direction;
                    //    let isNumber = sortColumns[0].colDef.type === 'number';
                    //    grid.appScope.gridOptions.data.sort(function (a, b) {
                    //        if (isNumber) {
                    //            let aNumber = isNaN(a[sortColumn]) ? parseFloat(a[sortColumn].replace(',', '')) : a[sortColumn];
                    //            let bNumber = isNaN(b[sortColumn]) ? parseFloat(b[sortColumn].replace(',', '')) : b[sortColumn];

                    //            if (sortDirection === 'desc') {
                    //                return bNumber - aNumber;
                    //            }
                    //            else {
                    //                return aNumber - bNumber;
                    //            }
                    //        } else {
                    //            let v1 = a[sortColumn];
                    //            let v2 = b[sortColumn];
                    //            if (sortDirection === 'desc') {
                    //                if (v1 > v2) {
                    //                    return -1;
                    //                } else if (v1 < v2) {
                    //                    return 1;
                    //                }
                    //                return 0;
                    //            }
                    //            else {
                    //                if (v1 > v2) {
                    //                    return 1;
                    //                } else if (v1 < v2) {
                    //                    return -1;
                    //                }
                    //                return 0;
                    //            }
                    //        }
                    //    });
                    //});
                },
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
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('AgreementNo'),
                        width: 134,
                        field: 'agreementNo',
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.agreementNo}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Type'),
                        width: 70,
                        cellTemplate: '<div style="text-align:left;margin-left:5px"">{{grid.appScope.getlocalizedString(row.entity.agreementTypeName)}}</div>',
                        field: 'agreementTypeName'
                    },
                    {
                        name: app.localize('VehicleType'),
                        field: 'vehicleType',
                        width: 90,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.tariffGroupTitle}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Vehicle'),
                        field: 'plateNo',
                        width: 80,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.plateNo}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('MakeAndModel'),
                        field: 'makeAndModel',
                        width: 150,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.makeAndModel}}</div>' +
                            '</div>'
                    },                    
                    {
                        name: app.localize('Notes'),
                        field: 'notes',
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.notes}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('CustomerType'),
                        field: 'customerCategory',
                        width: 90,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.customerCategory}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Customer'),
                        field: 'customer',
                        width: 150,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" ng-style="{\'color\': row.entity.isBlackListed ? \'red\' : \'inherit\'}"><span ng-if="grid.appScope.isOnlinePaymentsEnabled && row.entity.hasCard" class="label label-warning">CC</span>{{row.entity.customer}}</div>' +
                            '</div>'
                    },

                    {
                        name: app.localize('CustomerCode'),
                        field: 'customerCode',
                        width: 150,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.customerCode}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('ContactNo'),
                        field: 'contactNo',
                        width: 100,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\"' +
                            '<div class=\"ui-grid-cell-contents\" ng-if="grid.appScope.contactCategory== Individual">{{row.entity.mobileNo}}</div>' +
                            '<div class=\"ui-grid-cell-contents\" ng-if="grid.appScope.contactCategory== Company">{{row.entity.contactNo}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Driver'),
                        visible: !vm.disableKMInOut,
                        field: 'driver',
                        width: 110,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" >{{row.entity.driver}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('DriverNationality'),
                        visible: !vm.disableKMInOut,
                        field: 'driverNationality',
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" >{{row.entity.driverNationality}}</div>' +
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
                        name: app.localize('ExtendedDate'),
                        visible: vm.showExtendedDate,
                        field: 'extendedToDate',
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" >{{grid.appScope.getlocalDateTime(row.entity.extendedToDate)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Status'),
                        width: 90,
                        cellTemplate: '<div style="text-align:left;margin-left:5px""><span ng-if="row.entity.isPreClosed">Pre-</span>{{grid.appScope.getlocalizedString(row.entity.statusName)}}</div>',
                        field: 'status'
                    },
                    {
                        name: app.localize('Rate'),
                        field: 'rate',
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.rate}} {{row.entity.rateTypeName}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('TaxableAmount'),
                        visible: !vm.isAgreementAndCustomerBalanceInAgreement,
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.rounding(row.entity.totalCharges - row.entity.tax)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('VAT'),
                        field: 'tax',
                        visible: !vm.isAgreementAndCustomerBalanceInAgreement,
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.rounding(row.entity.tax)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('TotalAmount'),
                        visible: !vm.isAgreementAndCustomerBalanceInAgreement,
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.rounding(row.entity.totalCharges)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Location'),
                        field: 'locationId',
                        width: 80,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\" >{{row.entity.location}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('SalePerson'),
                        field: 'salePerson',
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.agreementSalesPerson}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('SaleOrigin'),
                        field: 'saleOrigin',
                        visible: vm.isSaleOriginEnabled,
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.saleOrigin}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('CreatedBy'),
                        field: 'createdBy',
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{row.entity.createdBy}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('TotalCharges'),
                        field: 'totalCharges',
                        visible: vm.isAgreementAndCustomerBalanceInAgreement,
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.rounding(row.entity.totalCharges)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('ReceivedAmount'),
                        field: 'receivedAmount',
                        visible: vm.isAgreementAndCustomerBalanceInAgreement,
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.rounding(row.entity.receivedAmount)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('RABalance'),
                        field: 'agreementBalance',
                        visible: vm.isAgreementAndCustomerBalanceInAgreement,
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.rounding(row.entity.agreementBalance)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('Deposit'),
                        field: 'deposit',
                        visible: vm.isAgreementAndCustomerBalanceInAgreement,
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.rounding(row.entity.deposit)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('DepositDue'),
                        field: 'depositDue',
                        visible: vm.isAgreementAndCustomerBalanceInAgreement,
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.rounding(row.entity.depositDue)}}</div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('CustomerBalance'),
                        field: 'customerBalance',
                        visible: vm.isAgreementAndCustomerBalanceInAgreement,
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell\">' +
                            '<div class=\"ui-grid-cell-contents\">{{grid.appScope.rounding(row.entity.customerBalance)}}</div>' +
                            '</div>'
                    }


                ],
                //onRegisterApi: function (gridApi) {
                //    $scope.gridApi = gridApi;
                //    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                //        if (!sortColumns.length || !sortColumns[0].field) {
                //            vm.filters.sorting = "agreementNo desc";
                //        } else {
                //            vm.filters.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                //        }

                //        vm.getAgreements();
                //    });
                //    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                //        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                //        vm.filters.maxResultCount = pageSize;

                //        vm.getAgreements();
                //    });
                //},
                data: []
            };
            vm.whatsAppSMSOpen = function (whatsapp) {
                abp.message.okConfirm(
                    '', app.localize('Press Ok To SMS'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            agreementSMSService.sendAgreementOpenWhatsAppSMSManual({
                                id: whatsapp.id,
                            }).success(function (result) {
                                if (result === true)
                                    abp.notify.success("SMS Sent Successfully");
                            });
                        }
                    }
                );
            };
            vm.whatsAppSMSClose = function (whatsapp) {
                abp.message.okConfirm(
                    '', app.localize('Press Ok To SMS'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            agreementSMSService.sendAgreementCloseWhatsAppSMSManual({
                                id: whatsapp.id,
                            }).success(function (result) {
                                if (result === true)
                                    abp.notify.success("SMS Sent Successfully");
                            });
                        }
                    }
                );
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

                if (vm.filters.selectedStatus && vm.filters.selectedStatus != 1)
                    vm.filters.isOverDueClosing = false;

                rentalAgreementExportService.exportToExcelNormalView(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.emailLinkToCharge = (entity) => {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/payments/emailLinkToCharge.cshtml',
                    controller: 'tenant.views.common.payments.emailLinkToCharge as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        data: () => {
                            return {
                                source: 'agreement',
                                sourceInfo: entity,
                                agreementId: entity.id,
                                agreementNo: entity.agreementNo,
                                customerId: entity.customerId,
                                customerName: entity.customer.name,
                                customerEmail: entity.customer.email
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {

                });
            }
            /*         vm.sentOpeningEmail = function (agreementId) {
                         abp.message.okConfirm(
                             '', app.localize('Press Ok To Email'),
                             function (isConfirmed) {
                                 if (isConfirmed) {
                                     agreementService.sentOpeningEmail({
                                         id: agreementId,
                                     }).success(function () {
                                         abp.notify.success('Successfully Sent Email');
                                     });
                                 }
                             }
                         );
                     };*/
            vm.manuallySendOpeningAgreementEmail = function (agreementId) {
                abp.message.okConfirm(
                    '', app.localize('Press Ok To Email'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            agreementService.manuallySendOpeningAgreementEmail({
                                id: agreementId,
                            }).success(function () {
                                abp.notify.success('Successfully Sent Email');
                            });
                        }
                    }
                );
            };
            vm.manuallySendClosingAgreementEmail = function (agreementId) {
                abp.message.okConfirm(
                    '', app.localize('Press Ok To Email'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            agreementService.manuallySendClosingAgreementEmail({
                                id: agreementId,
                            }).success(function () {
                                abp.notify.success('Successfully Sent Email');
                            });
                        }
                    }
                );
            };

            vm.openSilentPaymentModal = (agreement) => {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/payments/silentPayment.cshtml',
                    controller: 'tenant.views.common.payments.silentPayment as vm',
                    backdrop: 'static',
                    size: 'sm',
                    resolve: {
                        data: () => {
                            return {
                                agreementId: agreement.id,
                                customerId: agreement.customerId,
                                source: 'agreement'
                            }
                        }
                    }
                });
                modalInstance.result.then(result => {

                });
            }

            vm.exportToExcelDetailed = function () {
                vm.loading = true;

                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc

                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                rentalAgreementExportService.exportToExcelView(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };
            function isContractClosed(agreement) {

                if (agreement.status == 1) return true;
                else return false;
            }

            //function getAgreementTypes() {
            //    vm.agreementTypes = [{ id: 1, name: "Daily" }, { id: 2, name: "Weekly" }, { id: 3, name: "Monthly" }];
            //};
            function getStatuses() {
                vm.statuses = [
                    { id: 1, name: app.localize("Open") }
                ];
                if (abp.features.isEnabled("CRS.CustomFeatures.PreCloseAgreement"))
                    vm.statuses.push({ name: "Pre-Closed", id: 9 });
                vm.statuses.push({ id: 2, name: app.localize("Closed") });
                vm.statuses.push({ id: 8, name: app.localize("Voided") });

            };

            vm.report = function () {
                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }

                if (vm.filters.selectedStatus && vm.filters.selectedStatus != 1)
                    vm.filters.isOverDueClosing = false;

                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/externalVehiclesControlPanel/rental/agreements/report.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };

            function openPrintAgreementModal(agreement) {

                sessionStorage['printConfig'] = JSON.stringify({ printHeader: !vm.filters.printingWithoutLogo });

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/printtemplates/printPreview.cshtml',
                    controller: 'tenant.views.crs.agreements.printPreview as vmMain',
                    backdrop: 'static',
                    //windowClass: 'app-modal-window',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return agreement.id;
                        }
                    }
                });
            }


            vm.printAgreement = function (agreement) {
                openPrintAgreementModal(agreement);
            };


            vm.editSalesPerson = function (agreement) {
                openEditSalesPersonModal(agreement.id);
            };


            function openEditSalesPersonModal(agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/editSalesPersonModal.cshtml',
                    controller: 'tenant.views.crs.agreements.editSalesPersonModal as vm',
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

            function openViewAgreementModal(agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/externalVehiclesControlPanel/rental/agreements/viewModal.cshtml',
                    controller: 'tenant.views.externalVehiclesControlPanel.rental.agreements.viewModal as vm',
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
            function openAgreementAdditionalChargesModal(agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/agreementAdditionalCharges.cshtml',
                    controller: 'tenant.views.crs.agreements.agreementAdditionalCharges as vm',
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

            //function openPrintAgreementModal(agreementId) {
            //    var modalInstance = $uibModal.open({
            //        templateUrl: '~/App/tenant/views/crs/agreements/viewModal.cshtml',
            //        controller: 'tenant.views.crs.agreements.viewModal as vm',
            //        backdrop: 'static',
            //        //windowClass: 'app-modal-window',
            //        size: 'lg',
            //        resolve: {
            //            agreementId: function () {
            //                return agreementId;
            //            }
            //        }
            //    });
            //}

            vm.agreementAdditionalCharges = function (agreement) {
                openAgreementAdditionalChargesModal(agreement.id);
            };

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

            function openBillingHistoryModal(agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/billingHistoryModal.cshtml',
                    controller: 'tenant.views.crs.agreements.billingHistoryModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return agreementId;
                        }
                    }
                });
            }

            function openCreateOrEditAgreementModal(agreementId, chargesSettings) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.agreements.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return agreementId;
                        },
                        chargesSettings: function () {
                            return chargesSettings;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getAgreements();
                });
            }

            vm.changeDeliveryDate = (agreement) => {
                openChangeDeliveryDateModal(agreement);
            }

            function openChangeDeliveryDateModal(agreement) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/changeDeliveryDateModal.cshtml',
                    controller: 'tenant.views.crs.agreements.changeDeliveryDateModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return agreement.id;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getAgreements();
                });
            }

            vm.isFirebaseInitalized = false;
            isCouponsAndLuckyDrawEnabled = abp.features.isEnabled('CRS.CouponsAndLuckyDraw');
            createCouponsPermission = abp.auth.hasPermission('Pages.Tenant.CouponsAndLuckyDraw.Create');

            function openCloseAgreementModal(agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/closeAgreementModal.cshtml',
                    controller: 'tenant.views.crs.agreements.closeAgreementModal as vm',
                    backdrop: 'static',
                    keyboard: false,
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
                    if (isCouponsAndLuckyDrawEnabled && createCouponsPermission && result) {
                        opencreateOrEditShoppingCouponModel(result);
                    }
                    else
                        vm.getAgreements();

                });
            }

            function openPreCloseAgreementModal(agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/preCloseAgreementModal.cshtml',
                    controller: 'tenant.views.crs.agreements.preCloseAgreementModal as vm',
                    backdrop: 'static',
                    keyboard: false,
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
                    if (isCouponsAndLuckyDrawEnabled && createCouponsPermission && result) {
                        opencreateOrEditShoppingCouponModel(result);
                    }
                    else
                        vm.getAgreements();

                });
            }

            function opencreateOrEditShoppingCouponModel(agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/coupons/createOrEditCouponModel.cshtml',
                    controller: 'tenant.views.crs.coupons.createOrEditCouponModel as vm',
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
                    vm.loading = false;
                });
            }

            // Replace Vehicle Modal

            function openReplaceVehicleModal(agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/replaceVehicleModal.cshtml',
                    controller: 'tenant.views.crs.agreements.replaceVehicleModal as vm',
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

            function openReplaceDriverModal(agreementId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/replaceDriverModal.cshtml',
                    controller: 'tenant.views.crs.agreements.replaceDriverModal as vm',
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

            // ExtendCutShortModal
            function openExtendCutShortModal(input) {
                //Actions  1.Extend 2.Cutshort
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/extendCutShortAgreementModal.cshtml',
                    controller: 'tenant.views.crs.agreements.extendCutShortAgreementModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                agreementId: input.agreementId,
                                action: input.action,
                                chargesSettings: vm.chargesSettings
                            };
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getAgreements();
                });
            }

            // Upgrade Agreement Modal
            function openUpgradeAgreementModal(agreementId, chargesSettings) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/upgradeAgreementModal.cshtml',
                    controller: 'tenant.views.crs.agreements.upgradeAgreementModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return agreementId;
                        },
                        chargesSettings: function () {
                            return chargesSettings;
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

            vm.viewBillingHistory = function (agreement) {
                openBillingHistoryModal(agreement.id);
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

            vm.closeAgreement = function (agreement) {
                if (agreement.hasCustodyMovement)
                    abp.message.info('Agreement Can Not Be Closed As It has Open Custody Movement');
                else
                    openCloseAgreementModal(agreement.id);
            };

            vm.preCloseAgreement = function (agreement) {
                if (agreement.hasCustodyMovement)
                    abp.message.info('Agreement Can Not Be PreClosed As It has Open Custody Movement');
                else
                    openPreCloseAgreementModal(agreement.id);
            };
            vm.rounding = function (number) {
                return utilities.round(number, 2);
            }

            // UpGrade Agreement Code
            vm.upgradeAgreement = function (agreemnt) {
                openUpgradeAgreementModal(agreemnt.id, vm.chargesSettings);
            }

            vm.unCloseAgreement = function (agreement) {
                abp.message.confirm(
                    app.localize('UncloseAgreementMessage'), app.localize('PressOkToUncloseAgreement'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            agreementService.uncloseAgreement({
                                id: agreement.id
                            }).success(function () {
                                vm.getAgreements();
                                abp.notify.success(app.localize('SuccessfullyUnclosedAgreement'));
                            });
                        }
                    }
                );
            };
            vm.searchCreatedBy = function ($select) {
                return userService.searchUsers({ keyword: $select.search }).then(function (response) {
                    vm.usersCreated = response.data.items;
                });
                //vm.users = [];
            };

            function getChargesSettings() {
                vm.loading = true;

                chargesSettingService.getChargesSettings({ module: 1 }).success(function (data) {
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

            vm.searchvehicleOwners = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customers). get customers
                return directoryService.search({ keyword: $select.search, contactType: null, activeOnly: true }).then(function (response) {
                    vm.vehicleOwners = response.data.items;
                });
            };

            vm.searchvehicleOwnersPopoup = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return null;
                        },
                        type: function () {
                            return null;
                        }
                    }
                }).result.then(function (customer) {
                    if (customer != null) {
                        vm.filters.vehicleOwner = customer;
                    }
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
                vm.loading = true;
                vm.disableSaveButton = true;

                if (vm.skipCount == 0)
                    vm.agreements = [];
                vm.filters.skipCount = vm.skipCount;
                if (vm.filters.customer != null) {
                    vm.filters.customerId = vm.filters.customer.id;
                }
                if (vm.filters.vehicleOwner != null) {
                    vm.filters.vehicleOwnerId = vm.filters.vehicleOwner.id;
                }

                if (vm.filters.vehicleOwnership != 2) {
                    vm.filters.vehicleOwnerId = null;
                    vm.filters.vehicleOwner = null;;
                }
                if (vm.filters.salesPerson != null) {
                    vm.filters.salesPersonId = vm.filters.salesPerson.id;
                }
                if (vm.filters.salesPerson == null) {
                    vm.filters.salesPersonId = null;
                }
                if (vm.filters.saleOrigin != null) {
                    vm.filters.saleOriginId = vm.filters.saleOrigin.id;
                }
                if (vm.filters.projectName != null) {
                    vm.filters.projectId = vm.filters.projectName.id;
                }
                //if (vm.filters.agreementGroup != null) {
                //    vm.filters.agreementGroupId = vm.filters.agreementGroup.id;
                //}

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
                if (vm.filters.createdBy != null) {
                    vm.filters.creatorUserId = vm.filters.createdBy.id;

                }

                if (vm.filters.selectedStatus && vm.filters.selectedStatus != 1)
                    vm.filters.isOverDueClosing = false;

                externalRentalAgreementSearchService.agreementsGridView(vm.filters).success(function (data) {
                    vm.totalDataCount = data.totalCount;
                    vm.totalPages = vm.totalDataCount < vm.pageSize ? 1 : Math.ceil(vm.totalDataCount / vm.pageSize);
                    vm.data = data;
                    if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null)
                        initDate();
                    vm.paginate(1);

                    vm.gridOptions.totalItems = data.totalCount;
                    vm.gridOptions.data = data.agreements;
                    vm.gridOptions.data.forEach(function (value) {
                        value.printObj = {
                            id: value.id,
                            printHeader: !vm.filters.printingWithoutLogo
                        };
                    });
                })
                    .finally(() => {
                        vm.loading = false;
                        vm.disableSaveButton = false;
                    });
            };
            vm.pageSize = 100;
            vm.pageSizes = [10, 20, 50, 100];
            vm.currentPage = 0;
            vm.isNextPage = true;
            vm.isPreviousPage = true;
            vm.isPaging = false;

            vm.onPageSizeChange = () => {
                vm.totalPages = vm.totalDataCount < vm.pageSize ? 1 : Math.ceil(vm.totalDataCount / vm.pageSize);
                vm.paginate(1);
            }

            vm.paginate = (currentPage) => {
                vm.currentPage = currentPage;
                vm.isNextPage = vm.currentPage < vm.totalPages;
                vm.isPreviousPage = vm.currentPage > 1;
                vm.isPaging = true;
                vm.paginateAgreements = vm.data.agreements.slice((vm.currentPage - 1) * vm.pageSize, vm.currentPage * vm.pageSize);
                vm.isPaging = false;
            }

            vm.deleteAgreement = function (agreement) {
                abp.message.confirm(
                    app.localize('MovementDeleteWarningMessage', agreement.name),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            agreementService.deleteAgreement({
                                id: agreement.id
                            }).success(function () {
                                vm.getAgreements();
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                            });
                        }
                    }
                );
            };

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
                    templateUrl: '~/App/tenant/views/crs/agreements/agreementDocumentsModalU.cshtml',
                    controller: 'tenant.views.crs.agreements.agreementDocumentsModalU as vm',
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

            vm.openAgreementDiscountsModal = function (agreement) {

                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/agreementDiscountsPeriodWiseModal.cshtml',
                    controller: 'tenant.views.crs.agreements.agreementDiscountsPeriodWiseModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {

                        options: function () {
                            return {
                                agreementId: agreement.id,
                                agreementNo: agreement.agreementNo,
                                agreementStatus: agreement.status
                            };
                        }

                    }
                });
            };

            vm.openPaymentInstructionsModal = function (agreement) {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/paymentInstructionsModal.cshtml',
                    controller: 'tenant.views.crs.agreements.paymentInstructionsModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        agreementId: function () {
                            return agreement.id;
                        }
                    }
                });
            };

            vm.clearCustomer = function () {
                vm.filters.customer = null;
                vm.filters.customerId = null;
            };
            vm.clearUser = function () {
                vm.filters.createdBy = null;
                vm.filters.createdById = null;
            };
            vm.clearVehicleOwner = function () {
                vm.filters.vehicleOwner = null;
                vm.filters.vehicleOwnerId = null;
            };

            vm.clearSalesPerson = function () {
                vm.filters.salesPerson = null;
                vm.filters.salesPersonId = null;
            };

            vm.clearSaleOrigin = function () {
                vm.filters.saleOrigin = null;
                vm.filters.saleOriginId = null;
            };

            vm.clearProject = function () {
                vm.filters.projectName = null;
                vm.filters.projectId = null;
            };

            vm.clearAgreementGroups = function () {
                vm.filters.agreementGroup = null;
                vm.filters.agreementGroupId = null;
            };

            vm.clearInsuranceCompany = function () {
                vm.filters.insuranceCompany = null;
                vm.filters.insuranceCompanyId = null;
            };

            vm.replaceVehicle = function (agreement) {
                if (agreement.hasCustodyMovement)
                    abp.message.info('Vehicle Can Not Be Replaced As It has Open Custody Movement');
                else
                    openReplaceVehicleModal(agreement.id);
            };
            vm.replaceDriver = function (agreement) {
                openReplaceDriverModal(agreement.id);
            };

            vm.addDeliveryMovement = function (agreement) {
                openDeliveryMovementModal(agreement.id);
            };

            vm.extendAgreement = function (agreementId) {
                openExtendCutShortModal({ agreementId: agreementId, action: 1 });
            }
            vm.cutShortAgreement = function (agreementId) {
                openExtendCutShortModal({
                    agreementId: agreementId, action: 2
                });
            }
            vm.addReceipt = function (agreement) {
                openCreateOrEditReceiptModal(null, agreement);
            };
            vm.createDeposit = function (agreement) {
                openCreateDepositModal(agreement);
            };
            function getLocationsActiveAndInActive() {

                commonLookupService.getLocationsActiveAndInActive({}).success(function (data) {
                    vm.locations = data.items;
                });
            }
            function initializeFilters() {
                initDate();
                //getAgreementTypes();
                getStatuses();
                if (vm.isAgreementGroups) {
                    vm.searchAgreementGroup();
                }

                //cashe charges settings once to be used while agreement opening/editing
                getChargesSettings();
                vm.searchUsersWithDesignation();
                vm.getAgreements();
               /* getLocationsActiveAndInActive();*/
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
