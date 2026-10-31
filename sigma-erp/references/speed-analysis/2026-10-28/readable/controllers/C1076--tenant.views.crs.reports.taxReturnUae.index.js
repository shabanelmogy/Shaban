// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:285361-285596
appModule.controller('tenant.views.crs.reports.taxReturnUae.index', [
        '$scope', 'uiGridConstants', 'abp.services.app.collectionAndDepositReport', 'utilities', 'abp.services.app.billingMethod', 'abp.services.app.commonLookup', 'abp.services.app.taxReturnUae', '$uibModal',
        function ($scope, uiGridConstants, collectionReportAppService, utilities, billingMethodService, commonLookupService, taxReturnUaeService, $uibModal) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.permissions = {
                viewOtherBranch: abp.auth.hasPermission('Pages.Tenant.Vouchers.Receipts.ViewOtherBranchReceipts'),
            };
            vm.locations = [];
            vm.filters = {
                fromDate: moment().startOf('month'),
                toDate: moment().endOf('month'),
                locationId: ''
            };

            vm.dateRangeModel = {
                startDate: null,
                endDate: null,
            };

            vm.formatNumber = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
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
            vm.getLocationName = function (locationId) {
                var locationName = null;
                for (var i = 0; i < vm.locations.length; i++) {
                    if (vm.locations[i].id == locationId) {
                        locationName = vm.locations[i].name;
                        break;
                    }
                }
                return locationName;

            };


            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.getAgreementLocationName = function (locationId) {
                var locationAgreementName = null;
                for (var i = 0; i < vm.LocationsForAgreement.length; i++) {
                    if (vm.LocationsForAgreement[i].id == locationId) {
                        locationAgreementName = vm.LocationsForAgreement[i].name;
                        break;
                    }
                }
                return locationAgreementName;

            };
            //Location related code Start ------------
            vm.locationPermission = function (row) {
                if (row.locationId) {
                    if (!vm.permissions.allActionsOnOtherBranch && row.locationId != appSession.user.locationId)
                        return false;
                }
                return true;
            };
            vm.getVoucherType = function (type, subType) {
                return utilities.getVoucherType(type, subType);
            };
            vm.getDepositType = function (string) {
                return app.localize(string);
            };
            function getLocations() {
                commonLookupService.getLocationsActiveAndInActive({}).success(function (data) {
                    vm.locations = data.items;
                    //vm.LocationsForAgreement = data.items;
                });
            };

            //vm.showDetailLines = function () {

            //};

            vm.showDetailLines = function (detailLines, showSupplierBillNo) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/reports/taxReturnUae/detailLinesModal.cshtml',
                    controller: 'tenant.views.crs.reports.taxReturnUae.detailLinesModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        options: function () {
                            return {
                                detailLines: detailLines,
                                showSupplierBillNo: showSupplierBillNo
                            }
                        }
                    }
                });

            };

            ////Location related code END ---------------

            //vm.getCollectionReport = function () {
            //    
            //    vm.loading = true;
            //    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
            //    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
            //    collectionReportAppService.getCollectionReport(vm.filters).success(function (result) {
            //        vm.reportData = result;

            //    }).finally(function () {

            //        vm.loading = false;
            //    });
            //};

            vm.getTaxReturn = function () {
                vm.loading = true;

                vm.filters.fromDate = vm.filters.fromDate.startOf('day');
                vm.filters.toDate = vm.filters.toDate.startOf('day');

                taxReturnUaeService.getTaxReturnViewOne(vm.filters).success(function (data) {
                    vm.data = data;
                    vm.sales = data.sales;
                    vm.salesTotal = data.salesTotal;
                    vm.expenses = data.expenses;
                    vm.expensesTotal = data.expensesTotal;
                    vm.netTaxPayable = data.netTaxPayable;

                }).finally(function () {
                    vm.loading = false;
                });

            };


            vm.exportToExcelDetailed = function () {
                vm.loading = true;

                vm.filters.fromDate = vm.filters.fromDate.startOf('day');
                vm.filters.toDate = vm.filters.toDate.startOf('day');

                taxReturnUaeService.exportToExcelDetailedView(vm.filters).success(function (result) {
                    app.downloadTempFile(result);
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function init() {
                vm.getTaxReturn();
                getLocations();
            }

            init();

            vm.exportToExcel = function () {
                var tab_text = "<table border='1px'><tr>";
                var textRange; var j = 0;
                var tab1 = document.getElementById('salesTable'); // id of table
                var tab2 = document.getElementById('expenseTable');
                var tab3 = document.getElementById('netDueTable');

                for (j = 0; j < tab1.rows.length; j++) {

                    tab_text = tab_text;

                    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                    //tab_text=tab_text+"</tr>";
                }
                tab_text = tab_text + "</table>";
                tab_text = tab_text + "<br/>";
                tab_text = tab_text + "<table border='1px'><tr>";

                for (j = 0; j < tab2.rows.length; j++) {
                    tab_text = tab_text;
                    tab_text = tab_text + tab2.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";
                tab_text = tab_text + "<br/>";
                tab_text = tab_text + "<table border='1px'><tr>";

                for (j = 0; j < tab3.rows.length; j++) {
                    tab_text = tab_text;
                    tab_text = tab_text + tab3.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";
                tab_text = tab_text + "</br>";
                //tab_text = tab_text.replace(/<A[^>]*>|<\/A>/g, ""); //remove if u want links in your table
                // tab_text = tab_text.replace(/<img[^>]*>/gi, ""); //remove if u want images in your table
                // tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); //remove input params

                var ua = window.navigator.userAgent;
                var msie = ua.indexOf("MSIE ");

                if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer

                {
                    txtArea1.document.open("txt/html", "replace");
                    txtArea1.document.write('sep=,\r\n' + tab_text);
                    txtArea1.document.close();
                    txtArea1.focus();
                    sa = txtArea1.document.execCommand("SaveAs", true, "trialBalance.xls");
                }

                else {
                    sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));
                }

                return (sa);
            }
        }
    ]);
