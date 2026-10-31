// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:235200-235327
appModule.controller('tenant.views.crs.lease.agreements.report', ['$scope', '$stateParams', 'abp.services.app.leaseAgreementSearch', 
        '$stateParams', 'abp.services.app.commonLookup', 'utilities',
        function ($scope, $stateParams, leaseAgreementSearchService, $stateParams, commonLookupService, utilities) {

            var vm = this;
            vm.enableManualAgreementNo = utilities.parseBoolean(abp.setting.get("App.General.EnableManualAgreementNo"));
            vm.isLeaseToOwnEnabled = abp.features.isEnabled("CRS.Lease.LeaseToOwn");
            vm.showExtendedDate = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowExtendedDateInLeaseAgreement"));

            vm.filters = null;

            if ($scope.$parent !== null) {
                if ($scope.$parent.vmMain !== null)
                    vm.filters = $scope.$parent.vmMain.filters;
            }

            if (vm.filters === null )
                vm.filters = $stateParams.filters;
            
            if (vm.filters.agreementNo) {
                vm.filters.manualAgreementNo = null;
                vm.filters.plateNo = null;
                vm.filters.startDate = null;
                vm.filters.endDate = null;
                vm.filters.locationId = null;
                vm.filters.agreementType = null;
                vm.filters.status = null;
                vm.filters.customer = null;
            }
            else if (vm.filters.manualAgreementNo) {
                vm.filters.plateNo = null;
                vm.filters.startDate = null;
                vm.filters.endDate = null;
                vm.filters.locationId = null;
                vm.filters.agreementType = null;
                vm.filters.status = null;
                vm.filters.customer = null;
            }
            else if (vm.filters.plateNo) {
                vm.filters.startDate = null;
                vm.filters.endDate = null;
                vm.filters.locationId = null;
                vm.filters.agreementType = null;
                vm.filters.status = null;
                vm.filters.customer = null;
            }
            vm.agreementType = '';
            vm.locationName = '';


            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';


            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };
            vm.getAgreementTypes = function(type) {
                if (!type)
                    return '';
                if (type == 4)
                    return app.localize("Lease");
                if (type == 5)
                    return app.localize("LeaseToOwn");
            };
            vm.getStatuses = function () {
                if (!vm.filters.status) return '';
                if (vm.filters.status == 1)
                    return app.localize("Open");
                else if (vm.filters.status == 2)
                    return app.localize("Closed");
                else if (vm.filters.status == 8)
                    return app.localize("Voided");
       
            };

            vm.getStatusString = function (status) {
                if (!status) return '';
                if (status == 1)
                    return app.localize("Open");
                else if (status == 2)
                    return app.localize("Closed");
                else if (status == 8)
                    return app.localize("Voided");
              
            };

            vm.getlocalizedString = function (agreementStatus) {
                return app.localize(agreementStatus);
            };


            function getLocationName() {
                if (!vm.locations || !vm.filters.locationId)
                    return null;
                angular.forEach(vm.locations, function (value, key) {
                    if (value.id == vm.filters.locationId) {
                        vm.locationName = value.name;
                        return;
                    }
                });
            };
            function getLocations() {
                commonLookupService.getLocations({}).success(function (data) {
                    vm.locations = data.items;
                    getLocationName();
                });
            }
            function init() {
                getLocations();
                vm.loading = true;
                leaseAgreementSearchService.getLeaseAgreementsReport(vm.filters).success(function (data) {
                    vm.agreementReportData = data;
                    angular.forEach(vm.agreementReportData, function (value, key) {
                        vm.totalAmount += value.amount;
                    });
                }).finally(function () {
                    vm.loading = false;
                });
            }
            init();
        }]);
