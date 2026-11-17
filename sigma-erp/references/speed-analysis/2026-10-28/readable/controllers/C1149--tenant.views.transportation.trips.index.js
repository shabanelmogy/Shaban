// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:300399-300762
appModule.controller('tenant.views.transportation.trips.index', [
        '$scope', '$state', '$uibModal', '$window', 'uiGridConstants','abp.services.app.directory', 'utilities', 'appSession','abp.services.app.transTrip',
    function ($scope, $state, $uibModal, $window, uiGridConstants,directoryService, utilities, appSession, transTripService) {

        var vm = this;

        $scope.$on('$viewContentLoaded', function () {
            App.initAjax();
        });


        vm.loading = false;
        var todayAsString = moment().format('YYYY-MM-DD hh:mm:ss');
        vm.dateRangeOptions = app.createDateRangePickerOptions();
        vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
        vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));

        vm.statuses = null;
        vm.customers = [];
        vm.locations = [];

        vm.filters = {
            tripNo: null,
            agreementNo: null,
            manualAgreementNo: null,
            agreementType: null,
            tripStatus: null,
            startDate: null,
            endDate: null,
            customerId: null,
            driverId: null,
            vehicleId: null,
            plateNo: '',
            locationId: '',
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

        vm.permissions = {
            view: abp.auth.hasPermission('Pages.Tenant.Transportation.Trips'),
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

        vm.getTransTripStatus = function (status) {
            if (!status) return '';
            if (status == 1) return 'New';
            else if (status == 4) return 'Finish';

        }

        vm.isExtraTrip = function (trip) {

            if (trip == false) return 'No';
            else
                return 'Yes';

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
                    width: 90,
                    cellTemplate:
                        '<div class=\"ui-grid-cell-contents\">' +
                        '  <div class="btn-group dropdown " uib-dropdown="" dropdown-append-to-body>' +
                        '    <a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewTransTrip(row.entity)" class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-eye"></i> ' + app.localize('View') + '</a>' +
                        '    <ul uib-dropdown-menu>' +
                        //'      <li><a ng-if="grid.appScope.permissions.view" ng-click="grid.appScope.viewTransTrip(row.entity)">' + app.localize('View') + '</a></li>' +
                        '    </ul>' +
                        '  </div>' +
                        '</div>'
                },
                 {
                     name: app.localize('TripNo'),
                     width: 50,
                     type: 'number',
                     field: 'tripNo',

                 },
                 {
                     name: app.localize('AgreementNo'),
                     width: 50,
                     type: 'number',
                     field: 'agreement.agreementNo',
                     
                 },
                   {
                       name: app.localize('PickupDateTime'),
                       field: 'pickupDateTime',
                       width: 130,
                       cellTemplate:
                          '<div class=\"ui-grid-cell\">' +
                          
                          '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.pickupDateTime)}}</div>' +
                          '</div>'

                   },
                      {
                           name: app.localize('PickupLocation'),
                           width: 200,
                           field: 'pickupLocation.title',

                      },
                     {
                         name: app.localize('DropOffLocation'),
                         width: 230,
                         field: 'dropOffLocation.title',

                     },

                         {
                             name: app.localize('Vehicle'),
                             field: 'vehicle.plateNo',
                             width: 100,
                             cellTemplate:
                               '<div class=\"ui-grid-cell\">' +
                               '<div class=\"ui-grid-cell-contents\">{{row.entity.vehicle.plateNo}}</div>' +
                               '</div>'
                         },
                 {
                     name: app.localize('Driver'),
                     field: 'driver.name',
                     width: 100,
                     cellTemplate:
                       '<div class=\"ui-grid-cell\">' +
                       '<div class=\"ui-grid-cell-contents\">{{row.entity.driver.name}}</div>' +
                       '</div>'
                 },


                //{
                //    name: app.localize('Status'),
                //    width: 70,
                //    cellTemplate: '<div style="text-align:left;margin-left:5px"">{{grid.appScope.getTransTripStatus(row.entity.tripStatus)}}</div>',

                //},
                  {
                      name: app.localize('isExtraTrip'),
                      width: 70,
                      cellTemplate:
                       '<div class=\"ui-grid-cell\">' +
                       ' <span  ng-show="row.entity.isExtraTrip" class="label label-danger">' + app.localize('Yes') + '</span>' +
                       ' <span  ng-show="!row.entity.isExtraTrip" class="label label-success">' + app.localize('No') + '</span>' +
                       //'<div class=\"ui-grid-cell-contents\" >{{grid.appScope.isExtraTrip(row.entity.isExtraTrip)}}</div>' +
                       '</div>'
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

                    vm.getTransTrips();
                });
                gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                    vm.filters.skipCount = (pageNumber - 1) * pageSize;
                    vm.filters.maxResultCount = pageSize;

                    vm.getTransTrips();
                });
            },
            data: []
        };

        vm.report = function () {
            $uibModal.open({
                templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                controller: 'common.views.common.reportViewer as vmMain',
                backdrop: 'static',
                size: 'full',
                resolve: {
                    templateUrl: function () {
                        return '~/App/tenant/views/crs/transportation/trips/report.cshtml';
                    },
                    filters: function () {
                        return vm.filters;
                    }
                }
            });
        };

        vm.exportToExcel = function () {
            vm.loading = true;

            //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
            //if null then get as following
            //fromDate: get local date with time 00:00:00 and then convert to utc
            //toDate: get local date of max time of night and then convert to utc
            vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
            vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

            transTripService.exportToExcel(vm.filters)
                .success(function (result) {
                    app.downloadTempFile(result);
                }).finally(function () {
                    vm.loading = false;
                });
        };

        function getStatuses() {

            vm.statuses = [{ id: 1, name: app.localize("New") }, { id: 4, name: app.localize("Finish") }];
        };


        function openViewTransTripModal(transTripId) {
            var modalInstance = $uibModal.open({
                templateUrl: '~/App/tenant/views/crs/transportation/tripSheet/viewModal.cshtml',
                controller: 'tenant.views.crs.transportation.tripSheet.viewModal as vm',
                backdrop: 'static',
                size: 'lg',
                resolve: {
                    options: function () {
                        return {
                            transTripId: transTripId,
                        };
                    }

                }
            });
        }

        vm.viewTransTrip = function (trip) {
            openViewTransTripModal(trip.id);
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

        vm.searchDrivers = function ($select) {
            //whereas contactCategory: 1 (person). get all persons which includes staff as well
            return directoryService.search({ keyword: $select.search, contactCategory: 1 }).then(function (response) {
                vm.drivers = response.data.items;
            });
        };

        vm.searchDriverPopoup = function () {
            var modalInstance = openSearchContactModel(1, null);

            modalInstance.result.then(function (result) {
                if (result != null)
                    vm.transAgreement.driver = result;
                vm.transAgreement.driverId = vm.transAgreement.driver.id;
            });
        };

        vm.getTransTrips = function () {

            vm.loading = true;

            //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
            //if null then get as following
            //fromDate: get local date with time 00:00:00 and then convert to utc
            //toDate: get local date of max time of night and then convert to utc
            vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
            vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

            transTripService.getTrips(vm.filters).success(function (data) {
                vm.gridOptions.totalItems = data.totalCount;
                vm.gridOptions.data = data.items;

                if (vm.dateRangeModel.startDate == null && vm.dateRangeModel.endDate == null)
                    initDate();
            }).finally(function () {
                vm.loading = false;
            });
        };


        vm.clearCustomer = function () {
            vm.filters.customer = null;
            vm.filters.customerId = null;
        };
        vm.clearDriver = function () {
            vm.filters.driver = null;
            vm.filters.driverId = null;
        };

     
        function initializeFilters() {

            initDate();
            getStatuses();
            vm.getTransTrips();
           
        }

        initializeFilters();
    }
    ]);
