// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:301050-301289
appModule.controller('tenant.views.transportation.tripSheet.index', [
        '$scope', '$state', '$uibModal', '$window', 'uiGridConstants', 'abp.services.app.agreement','abp.services.app.directory', 'utilities', 'appSession', 'abp.services.app.commonLookup', 'abp.services.app.transAgreement', 'abp.services.app.transTrip', '$filter',
    function ($scope, $state, $uibModal, $window, uiGridConstants, agreementService, directoryService, utilities, appSession, commonLookupService, transAgreementService, tripAppService, $filter) {

        var vm = this;

        $scope.$on('$viewContentLoaded', function () {
            App.initAjax();
        });


        vm.loading = false;

        vm.statuses = null;

        vm.filters = {
            monthYear: null,
            agreement: null
        };

        vm.filterChanged = function () {
            if (vm.filters.monthYear && vm.filters.agreement)
                vm.getTripSheet();
        };

        vm.searchAgreements = function ($select) {
            if ($select.search == '') return;
            transAgreementService.searchTransAgreement({ keyword: $select.search }).then(function (response) {
                vm.agreements = response.data.items;
            });
        };

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
            create: abp.auth.hasPermission('Pages.Tenant.Transportation.Trips.AddExtraTrip'),
            edit: abp.auth.hasPermission('Pages.Tenant.Transportation.Trips.EditExtraTrip'),
            'delete': abp.auth.hasPermission('Pages.Tenant.Transportation.Trips.DeleteExtraTrip'),
            editScheduledTrip: abp.auth.hasPermission('Pages.Tenant.Transportation.Trips.EditScheduledTrip')
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


        vm.getlocalDate = function (date) {
            if (date != null) {
                var localTime = moment.utc(date).toDate();
                return moment(localTime).format('YYYY-MM-DD');
            }
            else {
                return "";
            }
        };

        vm.getTransTripStatus = function (status) {
            if (!status) return '';
            if (status == 1) return 'New';
            else if (status == 4) return 'Finished';
        }

        vm.getlocalizedString = function (agreementStatus) {
            return app.localize(agreementStatus);
        };

        vm.scheduledTripFilter = function (row) {
            if (!row.isExtraTrip) {
                return true;
            }
            return false;
        };

        vm.extraTripFilter = function (row) {
            if (row.isExtraTrip) {
                return true;
            }
            return false;
        };
        // Finish And UnfinishTrip
        vm.finishUnFinishTrip = function (row) {
            if (row.generate) {
                vm.loading = true;
                tripAppService.finishTrip({ id: row.id }).success(function () {
                    row.tripStatus = 4;
                }).finally(function () {
                    vm.loading = false;
                })
            }
            else {
                vm.loading = true;
                tripAppService.unFinishTrip({ id: row.id }).success(function () {
                    row.tripStatus = 1;
                }).finally(function () {
                    vm.loading = false;
                })
            }

        };

        vm.finishUnFinishTripAll = function (row) {
            var listOfIds = [];

            var foundLines = $filter('filter')(vm.transTripsData, {
                isExtraTrip: false
            }, true);

            foundLines.forEach(function (value, key) {
                listOfIds.push({
                    id: value.id
                });
            });
            if (vm.allTransTrip) {
                vm.loading = true;
                tripAppService.finishTripAll(listOfIds).success(function () {
                    foundLines.forEach(function (value, key) {
                        value.tripStatus = 4;
                        value.generate = true;
                    })
                }).finally(function () {
                    vm.loading = false;
                });
            }
            else {
                vm.loading = true;
                tripAppService.unFinishTripAll(listOfIds).success(function () {
                    foundLines.forEach(function (value, key) {
                        value.tripStatus = 1;
                        value.generate = false;
                    })
                }).finally(function () {
                    vm.loading = false;
                });
            }

        };

        vm.getTripSheet = function () {
            vm.loading = true;
            vm.filters.startOfMonth = moment(vm.filters.monthYear).startOf('month').startOf('day');
            vm.filters.endOfMonth = moment(vm.filters.monthYear).endOf('month').startOf('day');
            tripAppService.getTripSheet(vm.filters).success(function (data) {
                vm.transTripsData = data.items;
                vm.transTripsData.forEach(function (value, key) {
                    if (value.tripStatus == 4)
                        value.generate = true;
                    else
                        value.generate = false;
                });
            }).finally(function () {
                vm.loading = false;
            });
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
                            agreement: vm.filters.agreement
                        };
                    }

                }
            });
        }

        vm.viewTransTrip = function (row) {
            openViewTransTripModal(row.id);
        };

        function openCreateOrEditTransTripModal(transTripId) {
            var modalInstance = $uibModal.open({
                templateUrl: '~/App/tenant/views/crs/transportation/tripSheet/createOrEditModal.cshtml',
                controller: 'tenant.views.crs.transportation.tripSheet.createOrEditModal as vm',
                backdrop: 'static',
                size: 'lg',
                resolve: {
                    options: function () {
                        return {
                            transTripId: transTripId,
                            agreement: vm.filters.agreement
                        };
                    }

                }
            });
            modalInstance.result.then(function (result) {
                vm.getTripSheet();
            });
        }

        vm.createTransTrip = function () {
            openCreateOrEditTransTripModal(null);
        };

        vm.editTransTrip = function (transTrip) {
            openCreateOrEditTransTripModal(transTrip.id);
        };

        vm.deleteTransTrip = function (transTrip) {
            abp.message.confirm(
            app.localize('TripDeleteWarningMessage', transTrip.tripNo),
            function (isConfirmed) {
                if (isConfirmed) {
                    tripAppService.deleteTransTrip({
                        id: transTrip.id
                    }).success(function () {
                        vm.getTripSheet();
                        abp.notify.success(app.localize('SuccessfullyDeleted'));
                    });
                }
            }
        );
        }
    }
    ]);
