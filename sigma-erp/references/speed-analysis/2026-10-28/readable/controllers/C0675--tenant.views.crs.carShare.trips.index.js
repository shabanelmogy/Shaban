// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:174911-175132
appModule.controller('tenant.views.crs.carShare.trips.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.directory', 'abp.services.app.vehicle', 'abp.services.app.limoTrip', 'appSession',
        function ($scope, $uibModal, uiGridConstants, directoryService, vehicleService, limoTripsService, appSession) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.customers = null;
           
            vm.contact = null;
            vm.isCustomerLogin = false;

            vm.filters = {
                tripNo: null,
                vehicleId: null,
                customerId: null,
                driverId: null,
                fromDate: null,
                toDate: null,
                tripsWithWaitingTime: false,
                waitingMinutesThreshold: 60,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };
            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc(),
            };


            vm.trips = [
            {
                tripNo: 1,
                driver: 'Abdulhameed Al Sayegh',
                bookingTime: moment(),
                startDate: moment(),
                endDate: moment().add(2, 'days'),
                vehicle: 'les-2009',
                tripStatus: 'Booked',
                pickUplocation: 'Jumeirah Beach Hotel, Jumeirah St - Dubai - United Arab Emirates',
                dropOffLocation: 'Mall of the Emirates, Dubai - United Arab Emirates',
                amount: 9000,
                tariffGroup: 'Economy'
            },
            {
                tripNo: 2,
                driver: 'Mohammed Al Shahrani',
                bookingTime: moment().add(2, 'days'),
                startDate: moment().add(2, 'days'),
                endDate: moment().add(4, 'days'),
                vehicle: 'les-2018',
                tripStatus: 'Started',
                pickUplocation: 'Jumeirah Beach',
                dropOffLocation: 'Burj Khalifa, 1 Sheikh Mohammed bin Rashid Blvd - Dubai - United Arab Emirates',
                amount: 10000,
                tariffGroup: 'Luxury'
            },
              {
                  tripNo: 3,
                  driver: 'Agnus Maria H',
                  bookingTime: moment().add(2, 'days'),
                  startDate: moment().add(2, 'days'),
                  endDate: moment().add(4, 'days'),
                  vehicle: 'les-2018',
                  tripStatus: 'Started',
                  pickUplocation: 'The Palm Jumeirah, Dubai - United Arab Emirates',
                  dropOffLocation: 'Burj Khalifa, 1 Sheikh Mohammed bin Rashid Blvd - Dubai - United Arab Emirates',
                  amount: 12000,
                  tariffGroup: 'Luxury'
              },
            {
                tripNo: 4,
                driver: 'Mr. Mohamed Abdiaziz Ismail',
                bookingTime: moment().add(3, 'days'),
                startDate: moment().add(3, 'days'),
                endDate: moment().add(4, 'days'),
                vehicle: 'les-2025',
                tripStatus: 'Finished',
                pickUplocation: 'Dubai International Airport, Dubai - United Arab Emirates',
                dropOffLocation: 'Burj Khalifa, 1 Sheikh Mohammed bin Rashid Blvd - Dubai - United Arab Emirates',
                amount: 11000,
                tariffGroup: 'Extra Luxury'
            }]

            vm.getlocalDateTime = function (date) {

                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('YYYY-MM-DD HH:mm');
                }
                else {
                    return "";
                }
            };

            vm.getTrips = function () {
                vm.gridOptions.data = vm.trips;
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
                        enableSorting: false,
                        width: 120,
                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a ng-click="grid.appScope.viewTrip(row.entity)">' + app.localize('View') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                        '</div>'
                    },

                    {
                        name: app.localize('TripNo'),
                        width: 70,
                        type: 'number',
                        field: 'tripNo'
                    },
                    {
                        name: app.localize('Driver'),
                        width: 200,
                        field: 'driver'
                    },
                     {
                         name: app.localize('BookingTime'),
                         field: 'startDate',
                         cellTemplate:
                             '<div class=\"ui-grid-cell\">' +
                             '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.bookingTime)}}</div>' +
                         '</div>'
                     },
                      {
                          name: app.localize('StartDate'),
                          field: 'startDate',
                          cellTemplate:
                              '<div class=\"ui-grid-cell\">' +
                              '<div class=\"ui-grid-cell-contents\">{{grid.appScope.getlocalDateTime(row.entity.startDate)}}</div>' +
                          '</div>'
                      },
                      {
                          name: app.localize('Vehicle'),
                          field: 'vehicle'
                      },
                     {

                         name: app.localize('Status'),
                         field: 'tripStatus'
                     },
                    {
                        name: app.localize('Amount'),
                        field: 'amount'
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

                        vm.getTrips();
                    });

                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.filters.skipCount = (pageNumber - 1) * pageSize;
                        vm.filters.maxResultCount = pageSize;

                        vm.getTrips();
                    });
                },
                data: []
            };



            function openViewTripModal(trip) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/carShare/trips/viewTripModal.cshtml',
                    controller: 'tenant.views.crs.carShare.trips.viewTripModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        trip: function () {
                            return trip;
                        }
                    }
                });

            }
            vm.viewTrip = function (trip) {
                openViewTripModal(trip);
            };

            function init() {
                vm.getTrips();

            }

            init();
        }
    ]);
