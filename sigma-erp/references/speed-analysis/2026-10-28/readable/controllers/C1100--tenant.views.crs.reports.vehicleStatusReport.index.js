// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:290938-291156
appModule.controller('tenant.views.crs.reports.vehicleStatusReport.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.fleetUtilizationReport', 'utilities',
        //'$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.vehicleStatusReport', 'utilities',
        function ($scope, $uibModal, uiGridConstants, fleetUtilizationReportService, utilities) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");

            //Features
            vm.isExcessKMsInvoiceEnabled = abp.features.isEnabled("Core.ExcessKMsCharging");
            vm.isERSLeaseEnabled = abp.features.isEnabled("ERS.Lease");
            vm.isERSRentalInvoiceEnabled = abp.features.isEnabled("ERS.Rental");
            vm.isRentalEnabled = abp.features.isEnabled("CRS.Rental");
            vm.isEquipmentRentalEnabled = abp.features.isEnabled("ERS");
            vm.isEquipmentLeaseEnabled = abp.features.isEnabled("ERS.Lease");
            vm.isFmsEnable = abp.features.isEnabled("FMS");
            vm.isLimoEnabled = abp.features.isEnabled("CRS.Limo");
            vm.isLeaseEnabled = abp.features.isEnabled("CRS.Lease");
            vm.isAssetEnabled = abp.features.isEnabled("CRS.Accounts.Assets");
            vm.isStockFeatureEnabled = abp.features.isEnabled("STOCK");
            vm.isTransportationEnabled = abp.features.isEnabled("CRS.Transportation");
            vm.stockSaleInvoice = abp.features.isEnabled("CRS.CustomFeatures.StockSaleInvoice");
            vm.isChauffeurEnabled = abp.features.isEnabled("CRS.Chauffeur");
            vm.isAssetsModuleEnabled = abp.features.isEnabled("CRS.Accounts.Assets");
            vm.isAccessoriesEnabled = abp.features.isEnabled("CRS.AccessoriesRental");
            vm.isTollsEnabled = abp.features.isEnabled("CRS.Tolls");
            vm.isAgreementAdditionalChargesEnabled = abp.features.isEnabled("CRS.Rental.AgreementAdditionalCharges");
            vm.isPOSEnabled = abp.features.isEnabled("POS");
            vm.isWORKSHOPEnabled = abp.features.isEnabled("WORKSHOP");
            vm.isDarbModuleEnabled = abp.features.isEnabled("CRS.Tolls.AbuDhabi");
            vm.isFineModeEnabled = (abp.features.isEnabled("CRS.Fines.DubaiPolice") || abp.features.isEnabled("CRS.Fines.AbuDhabiPolice") || abp.features.isEnabled("CRS.Fines.Qatar") || abp.features.isEnabled("CRS.Fines")); //abp.setting.get("App.General.TrafficFineInvoice") == 2

            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.filters = {
                monthYear: new Date(),
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                startDay: null,
                endDay:null,
            };

            vm.totalAmount = null;


            vm.getAgreementType = function (type) {
                if (!type) return '';
                if (type == 1) return 'Daily';
                else if (type == 2) return 'Weekly';
                else if (type == 3) return 'Monthly';
            };
            vm.localize = function (input) {
                return app.localize(input);
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

            vm.dateRangeModel = {
                startDay: null,
                endDay: null,
            };


            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
            
            vm.calcTotalVehical = function (value) {
                var total = 0;
                total = value.daily + value.idle + value.monthly + value.nrm + value.weekly + value.workShop;
                return total;
            }

            vm.getFleetUtilizationReport = function () {
                vm.loading = true;
                vm.filters.startDay = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.endDay = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                fleetUtilizationReportService.getFleetUtilizationReport(vm.filters).success(function (data) {
                    vm.fleetUtilizationData = data;
                }).finally(function () {
                    vm.loading = false;
                })
            };

            vm.getFleetUtilizationReport(vm.filters);

            vm.exportToExcel = function () {
                var tab_text = "<h2>Vehicle Status Summary</h2></br>";
                var j = 0;
                var tab1 = document.getElementById('statusSummaryTable'); // id of table
                var tab2 = document.getElementById('statusReportTable');
                var tab3 = document.getElementById('efficiencyReportTable');
                var tab4 = document.getElementById('agreementsOpenedTable');
                var tab5 = document.getElementById('agreementsClosedTable');
                var tab6 = document.getElementById('collectionSummaryTable');
                var tab7 = document.getElementById('movementsTable');
                var tab8 = document.getElementById('invoicesTable');

                tab_text = tab_text + "<table border='1px'><tr>";
                for (j = 0; j < tab1.rows.length; j++) {

                    tab_text = tab_text;

                    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                    //tab_text=tab_text+"</tr>";
                }
                tab_text = tab_text + "</table>";
                tab_text = tab_text + "<br/>";
                tab_text = tab_text +  "<h2>Vehicle Status Report</h2></br>";
                tab_text = tab_text + "<table border='1px'><tr>";

                for (j = 0; j < tab2.rows.length; j++) {
                    tab_text = tab_text;
                    tab_text = tab_text + tab2.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";
                tab_text = tab_text + "<br/>";
                tab_text = tab_text +  "<h2>Vehicle Efficiency Report</h2></br>";
                tab_text = tab_text + "<table border='1px'><tr>";

                for (j = 0; j < tab3.rows.length; j++) {
                    tab_text = tab_text;
                    tab_text = tab_text + tab3.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";
                tab_text = tab_text + "</br>";
                tab_text = tab_text +  "<h2>Agreements Opened</h2></br>";
                tab_text = tab_text + "<table border='1px'><tr>";

                for (j = 0; j < tab4.rows.length; j++) {
                    tab_text = tab_text;
                    tab_text = tab_text + tab4.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";
                tab_text = tab_text + "</br>";
                tab_text = tab_text +  "<h2>Agreements Closed</h2></br>";
                tab_text = tab_text + "<table border='1px'><tr>";

                for (j = 0; j < tab5.rows.length; j++) {
                    tab_text = tab_text;
                    tab_text = tab_text + tab5.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";
                tab_text = tab_text + "</br>";
                tab_text = tab_text +  "<h2>Collection Summary</h2></br>";
                tab_text = tab_text + "<table border='1px'><tr>";

                for (j = 0; j < tab6.rows.length; j++) {
                    tab_text = tab_text;
                    tab_text = tab_text + tab6.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";
                tab_text = tab_text + "</br>";
                tab_text = tab_text +  "<h2>Movements</h2></br>";
                tab_text = tab_text + "<table border='1px'><tr>";

                for (j = 0; j < tab7.rows.length; j++) {
                    tab_text = tab_text;
                    tab_text = tab_text + tab7.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";
                tab_text = tab_text + "</br>";
                tab_text = tab_text +  "<h2>Invoices</h2></br>";
                tab_text = tab_text + "<table border='1px'><tr>";

                for (j = 0; j < tab8.rows.length; j++) {
                    tab_text = tab_text;
                    tab_text = tab_text + tab8.rows[j].innerHTML.toUpperCase() + "</tr>";
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
                    sa = txtArea1.document.execCommand("SaveAs", true, "vehicleStatusReport.xls");
                }

                else {
                    sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));
                }

                return (sa);
            }

        }
    ]);
