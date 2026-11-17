// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:467764-467968
appModule.controller('tenant.views.stock.report.detailedStockReport.index', ['$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.item', 'utilities', 'appSession', 'abp.services.app.stockReport', 'abp.services.app.itemType', 'abp.services.app.commonLookup', 'abp.services.app.user',
        function ($scope, $uibModal, uiGridConstants, itemAppService, utilities, appSession, stockReportService, itemTypeAppService, commonLookupService, userService) {

            var vm = this;
            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.utilities = utilities;

            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc(),
            };

            vm.isMultiBranchEnabled = abp.features.isEnabled("Stock_MultiBranch");            
            vm.filters = {

            };

            vm.dateRangeModelChanged = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };
            

            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };


            vm.searchItems = function ($select) {
                var name = $select.search;
                if (name === '')
                    name = "~";  //to avoid default suggestions 

                return itemAppService.searchItems({ name: name }).then(function (response) {
                    vm.items = response.data.items;
                });
            };

            vm.clearItem = function () {
                vm.filters.item = null;
                vm.filters.itemId = null;
            };

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.getDetailedStockReport = function () {
                vm.loading = true;
                vm.totalBeginningQuantity = 0;
                vm.totalInQuantity = 0;
                vm.totalOutQuantity = 0;
                vm.totalNetQuantity = 0;
                vm.totalEndingQuantity = 0;

                vm.filters.fromDate = vm.dateRangeModel.startDate ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                //vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format(vm.dateFormat)).utc();
                //vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format(vm.dateFormat)).add(1, 'days').add(-1, 'milliseconds').utc();
                stockReportService.getDetailedStockReport(vm.filters).success(function (data) {
                    vm.reportData = data.items;
                    
                    vm.reportData.forEach(e => {
                        e.unitCost = 0;
                        if (e.endingQuantity != 0)
                            e.unitCost = vm.rounding(e.endingStockValue / e.endingQuantity)
                    });

                    vm.totalBeginningQuantity = vm.reportData.reduce((accumulator, item) => accumulator + item.beginningQuantity, 0);
                    vm.totalInQuantity = vm.reportData.reduce((accumulator, item) => accumulator + item.inQuantity, 0);
                    vm.totalOutQuantity = vm.reportData.reduce((accumulator, item) => accumulator + item.outQuantity, 0);
                    vm.totalNetQuantity = vm.reportData.reduce((accumulator, item) => accumulator + item.netQuantity, 0);
                    vm.totalEndingQuantity = vm.reportData.reduce((accumulator, item) => accumulator + item.endingQuantity, 0);
                    vm.totalUnitCostValue = vm.reportData.reduce((accumulator, item) => accumulator + item.unitCost, 0);
                    vm.totalEndingStockValue = vm.reportData.reduce((accumulator, item) => accumulator + item.endingStockValue, 0);


                }).finally(function () {
                    vm.loading = false;
                });
            };


            vm.getItemTypes = function () {
                vm.loading = true;
                itemTypeAppService.getItemTypes()
                    .success(function (result) {
                        vm.itemTypes = result.items;
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.filterItemType = function (itemTypeId) {
                var keepGoing = true;
                angular.forEach(vm.itemTypes, function (itemType) {
                    if (itemTypeId === itemType.id) {
                        vm.itemType = itemType;
                        keepGoing = false;
                    }
                    vm.itemType = keepGoing ? null : vm.itemType;
                });
            };

            vm.exportToExcel = function () {
                var tab_text = "<table border='1px'><tr>";
                var textRange;
                var j = 0;
                var tab1 = document.getElementById('purchaseDetailTable'); // id of table
                for (j = 0; j < tab1.rows.length; j++) {

                    tab_text = tab_text;
                    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";

                var blob = b64toBlob(btoa(unescape(encodeURIComponent("\uFEFF" + tab_text))), "application/vnd.ms-excel;charset=utf-8");
                var blobUrl = URL.createObjectURL(blob);

                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'PurchaseDetailBillReport.xls';
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


            vm.rounding = function (value) {
                if (value) {
                    return utilities.round(value, 2);
                }
                return 0;
            }
            function getSelectiveBranches() {
                userService.getSelectedBranchIdsByUserId(appSession.user.id).success(function (result) {
                    let selectedBranchIds = result;
                    let selectedBranchs = vm.locations.filter(x => selectedBranchIds.indexOf(x.id) > -1);
                    vm.locations = selectedBranchs;
                    vm.filters.locationId = vm.locations.find(location => location.id === appSession.user.locationId).id;
                });
            }

            function getAllLocations() {

                commonLookupService.getLocationsActiveAndInActive({}).success(function (data) {

                    vm.locations = data.items;

                    if (appSession.user.branchAccess == 2)
                        getSelectiveBranches();
                    else if (appSession.user.branchAccess == 1) {
                        vm.filters.locationId = appSession.user.locationId;
                        vm.locations = vm.locations.filter(e => e.id == vm.filters.locationId);
                    }
                });
            }


            function init() {
                if (vm.isMultiBranchEnabled) {
                    getAllLocations();

                }
                
                vm.getItemTypes();
                vm.getDetailedStockReport();
            }
            init();
        }]);
