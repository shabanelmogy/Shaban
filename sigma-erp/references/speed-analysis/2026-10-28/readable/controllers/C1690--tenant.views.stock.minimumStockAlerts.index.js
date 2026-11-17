// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:466366-466483
appModule.controller('tenant.views.stock.minimumStockAlerts.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'appSession', 'abp.services.app.commonLookup', 'utilities', 'abp.services.app.item',
        function ($scope, $uibModal, uiGridConstants, appSession, lookupService, utilities, itemAppService) {

            var vm = this;
            vm.loading = false;
            vm.itemTypes = [];
            vm.models = null;
            vm.filters = {
                filter: '',
                sorting: ''
            };
            var vm = this;
            vm.exportToExcel = function () {
                var tab_text = "<table border='1px'><tr>";
                var textRange;
                var j = 0;
                var tab1 = document.getElementById('alertsTable'); // id of table
                for (j = 0; j < tab1.rows.length; j++) {

                    tab_text = tab_text;
                    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";

                var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
                var blobUrl = URL.createObjectURL(blob);

                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'MinimumStockAlerts.xls';
                a.click();

            };
            function b64toBlob(b64Data, contentType, sliceSize) {
                contentType = contentType || '';
                sliceSize = sliceSize || 512;

                var byteCharacters = atob(b64Data);
                var byteArrays = [];

                for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                    var slice = byteCharacters.slice(offset, offset + sliceSize);

                    var byteNumbers = new Array(slice.length);
                    for (var i = 0; i < slice.length; i++) {
                        byteNumbers[i] = slice.charCodeAt(i);
                    }

                    var byteArray = new Uint8Array(byteNumbers);

                    byteArrays.push(byteArray);
                }

                var blob = new Blob(byteArrays, { type: contentType });
                return blob;
            }
            vm.clearModel = function () {
                vm.filters.model = null;
                vm.filters.modelId = null;
            };
            function getSelectiveBranches() {
                userService.getSelectedBranchIdsByUserId(appSession.user.id).success(function (result) {
                    let selectedBranchIds = result;
                    let selectedBranchs = vm.locations.filter(x => selectedBranchIds.indexOf(x.id) > -1);
                    vm.locations = selectedBranchs;
                    vm.filters.locationId = vm.locations.find(location => location.id === appSession.user.locationId).id;
                });
            }

            function getAllLocations() {

                lookupService.getLocationsActiveAndInActive({}).success(function (data) {

                    vm.locations = data.items;

                    if (appSession.user.branchAccess == 2)
                        getSelectiveBranches();
                    else if (appSession.user.branchAccess == 1) {
                        vm.filters.locationId = appSession.user.locationId;
                        vm.locations = vm.locations.filter(e => e.id == vm.filters.locationId);
                    }
                });
            }
            vm.rounding = function (value) {
                if (value) {
                    return utilities.round(value, 2);
                }
                return 0;
            }
            vm.getStockAlerts = function () {
                vm.loading = true;
                vm.totalAvailability = 0;
                vm.totalMinimumStock = 0;
                return itemAppService.getMinimumStockAlerts(vm.filters)
                    .then(function (response) {
                        vm.minimumStockAlerts = response.data;
                        vm.totalAvailability = 0;
                        vm.totalMinimumStock = 0;
                        angular.forEach(vm.minimumStockAlerts, function (value) {
                            vm.totalAvailability += value.availabilityQuantity;
                            vm.totalMinimumStock += value.minimumStockValue;
                        });
                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            };
                


            function init() {
                vm.getStockAlerts();
                getAllLocations();
            }

                init();
            }]);
