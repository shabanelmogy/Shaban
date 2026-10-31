// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:364672-364754
appModule.controller('tenant.views.crs.vouchers.invoices.searchandAddMultipleTripsModal',
        ['$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.directory', 'abp.services.app.tariffGroup', 'uiGridConstants', '$filter', 'options', 'abp.services.app.limoTrip', 'abp.services.app.limoTripSearch', 'abp.services.app.commonLookup',
            function ($scope, $uibModal, $uibModalInstance, directoryService, tariffGroupService, uiGridConstants, $filter, options, limoTripService, limoTripSearchService, commonLookupService) {
                var vm = this;
                vm.data = [];

                vm.filters = {
                    customerId: options.contactId,
                    fromDate: options.fromDate,
                    toDate: options.toDate,
                    limoCustomField: options.limoCustomField,
                    limoCustomField1: options.limoCustomField1,
                    manualTripNo: options.manualTripNo,
                };
                vm.dateFormat = abp.setting.get("App.General.DateFormat");
                vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
                vm.cancel = function () {
                    $uibModalInstance.dismiss();
                };
                vm.getlocalDateTime = function (date, format) {
                    if (date != null) {
                        if (format == null) format = vm.dateTimeFormat;

                        var localTime = moment.utc(date).toDate();
                        return moment(localTime).format(format);
                    } else {
                        return "";
                    }
                };
                vm.permissions = {
                    create: abp.auth.hasPermission('Pages.Tenant.Contacts.Addnew'),
                    edit: abp.auth.hasPermission('Pages.Tenant.Contacts.Edit'),
                    'delete': abp.auth.hasPermission('Pages.Tenant.Contacts.Delete')
                };

                vm.applyChange = function () {
                    vm.data.forEach(function (value) {
                        value.selected = vm.all;
                    });
                };

                vm.save = function () {

                    if (vm.data.length == 0) return;
                    var foundLines = $filter('filter')(vm.data, {
                        selected: true
                    }, true);
                    $uibModalInstance.close(foundLines);
                };
                function getTariffGroups() {
                    vm.loading = true;
                    commonLookupService.getTariffGroups({}).success(function (data) {
                        vm.tariffGroups = data.items;
                    }).finally(function () {
                        vm.loading = false;
                    });
                };
                function getTripTypes() {
                    commonLookupService.getTripTypes().success(function (data) {
                        vm.tripTypes = data.items;
                    });
                }
                vm.getTrips = function () {
                    var fromDate = angular.copy(moment(vm.filters.fromDate).startOf('day').utc());
                    var toDate = angular.copy(moment(vm.filters.toDate).endOf('day').utc());
                    vm.loading = true;
                    limoTripSearchService.searchTripsToInvoice({
                        customerId: options.contactId,
                        fromDate: fromDate,
                        toDate: toDate,
                        limoCustomField: vm.filters.limoCustomField,
                        limoCustomField1: vm.filters.limoCustomField1,
                        manualTripNo: vm.filters.manualTripNo,
                    }).success(function (result) {
                        vm.data = result.items;
                    }).finally(function () {
                        vm.loading = false;
                    });
                };
                vm.getTrips();
                getTariffGroups();
                getTripTypes();
            }]);
