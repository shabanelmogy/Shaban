// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:426853-427004
appModule.controller('tenant.views.externalVehiclesControlPanel.rental.agreements.report',
        ['$scope', '$stateParams', 'abp.services.app.externalRentalAgreementSearch',
        '$stateParams', 'abp.services.app.commonLookup', 'utilities',
        function ($scope, $stateParams, externalRentalAgreementSearchService, $stateParams, commonLookupService, utilities) {

            var vm = this;
            
            vm.filters = null;

            if ($scope.$parent !== null) {
                if ($scope.$parent.vmMain !== null)
                    vm.filters = $scope.$parent.vmMain.filters;
            }

            if (vm.filters === null)
                vm.filters = $stateParams.filters;


            //if (vm.filters.agreementNo) {
            //    vm.filters.manualAgreementNo = null;
            //    vm.filters.plateNo = null;
            //    vm.filters.startDate = null;
            //    vm.filters.endDate = null;
            //    vm.filters.locationId = null;
            //    vm.filters.agreementType = null;
            //    vm.filters.status = null;
            //    vm.filters.customer = null;
            //}
            //else if (vm.filters.manualAgreementNo) {
            //    vm.filters.plateNo = null;
            //    vm.filters.startDate = null;
            //    vm.filters.endDate = null;
            //    vm.filters.locationId = null;
            //    vm.filters.agreementType = null;
            //    vm.filters.status = null;
            //    vm.filters.customer = null;
            //}
            //else if (vm.filters.plateNo) {
            //    vm.filters.startDate = null;
            //    vm.filters.endDate = null;
            //    vm.filters.locationId = null;
            //    vm.filters.agreementType = null;
            //    vm.filters.status = null;
            //    vm.filters.customer = null;
            //}
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
            function getAgreementTypes() {
                if (!vm.filters.agreementType) return '';
                if (vm.filters.agreementType == 1) vm.agreementType = 'Daily';
                if (vm.filters.agreementType == 2) vm.agreementType = 'Weekly';
                if (vm.filters.agreementType == 3) vm.agreementType = 'Monthly';
                if (vm.filters.agreementType == 6) vm.agreementType = 'Hourly';
            };
            vm.getStatuses = function () {
                if (!vm.filters.status) return '';
                if (vm.filters.status == 1)
                    return app.localize("Open");
                else if (vm.filters.status == 2)
                    return app.localize("Closed");
                else if (vm.filters.status == 9)
                    return app.localize("PreClosed");
            };

            vm.getStatusString = function (status) {
                if (!status) return '';
                if (status == 1)
                    return app.localize("Open");
                else if (status == 2)
                    return app.localize("Closed");
                else if (status == 8)
                    return app.localize("Voided");
                else if (status == 9)
                    return app.localize("PreClosed");
            };

            vm.getlocalizedString = function (agreementStatus) {
                return app.localize(agreementStatus);
            };
            vm.rounding = function (number) {
                return utilities.round(number, 2);
            }

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

                vm.totals = vm.totals || {
                    totalTaxableAmount: 0,
                    totalVAT: 0,
                    totalAmount: 0
                };

                if (vm.filters.agreementType)
                    getAgreementTypes();
                externalRentalAgreementSearchService.getAgreementsReportView(vm.filters).success(function (data) {
                    vm.agreementReportData = data;
                    vm.isLeaseAgreement = vm.agreementReportData[0].agreementCategory == 2;

                    const totals = vm.agreementReportData.reduce((acc, value) => {
                        const totalCharges = Number(value.totalCharges) || 0;
                        const tax = Number(value.tax) || 0;

                        acc.totalTaxableAmount += totalCharges - tax;
                        acc.totalVAT += tax;
                        acc.totalAmount += totalCharges;

                        return acc;
                    }, {
                        totalTaxableAmount: 0,
                        totalVAT: 0,
                        totalAmount: 0
                    });
                    vm.totals = totals;

                }).finally(function () {
                    vm.loading = false;
                });
            }
            init();
        }]);
