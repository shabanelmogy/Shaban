// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:266865-267136
appModule.controller('tenant.views.crs.reports.dailyReport.dailyRevenueReport', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.dailyReport', 'utilities',
        function ($scope, $uibModal, uiGridConstants, dailyReportService, utilities) {

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
            vm.filters = {
                fromDate: null,
                toDate: null,
            };


            vm.dateRangeModel = {
                startDate: null,
                endDate: null
            };

            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };


            vm.totalAmount = null;

            vm.exportToExcel = function () {
                vm.loading = true;

                dailyReportService.exportToExcel(vm.filters)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.localize = function (input) {
                return app.localize(input);
            };

            vm.getlocalDateTime = function (date, format) {

                vm.format = null;
                if (format)
                    vm.format = format;
                if (!vm.format)
                    vm.format = vm.dateFormat;
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.exportToExcel = function () {
                JSONToCSVConvertor();

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

            vm.getDailyRevenueReport = function () {
                vm.loading = true;
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();

                vm.dailyRevenueReport = [];

                dailyReportService.getAgreementIds(vm.filters).success(function (data) {
                    var agreementIds = data;
                    var count = 0;
                    vm.loadingReport = true;
                    agreementIds.forEach((agreementId, currIndex) => {
                        vm.filters.agreementId = agreementId;
                        dailyReportService.getDailyRevenueReportByAgreementId(vm.filters)
                            .success(function (data) {
                                var agreements = data;
                                agreements.forEach(agr => vm.dailyRevenueReport.push(agr));
                                count++;
                                if (count == agreementIds.length) {
                                    vm.loadingReport = false;
                                    localStorage.setItem("dailyReportList", JSON.stringify(vm.dailyRevenueReport));
                                }
                            });


                    });

                }).finally(function () {
                    vm.loading = false;
                });

                //dailyReportService.getDailyRevenueReport(vm.filters).success(function (data) {
                //    vm.totalItems = data.totalCount;
                //    vm.dailyRevenueReport = data;

                //    vm.sumRevenue = 0.0;

                //    angular.forEach(vm.dailyRevenueReport, function (row, key) {
                //        vm.sumRevenue += row.revenue;
                //        row.revenue = utilities.round(row.revenue, 2);
                //    });

                //    vm.sumRevenue = utilities.round(vm.sumRevenue, 2);

                //}).finally(function () {
                //    vm.loading = false;
                //});

            };

            function JSONToCSVConvertor() {

                //vm.dailyRevenueReport.forEach(e => {
                //    e.CompanyID = null;
                //    e.FranchiseID = null;
                //    e.BranchID = null;
                //    e.LocationID = null;
                //    e.DivisionID = null;
                //    e.SpeedCustomerID = null;
                //    e.EDPCustomerID = null;
                //    e.InternalCustomerFlag = null;
                //    e.SpeedSalesmanID = null;
                //    e.Salesmanname = null;
                //    e.Salesmanname = null;
                //    e.Channel = null;
                //    e.FunctionalCurrency = 'AED';
                //});

                var JSONData = vm.dailyRevenueReport;

                var arrayToExport = [];

                vm.dailyRevenueReport.forEach(e => {
                    arrayToExport.push({
                        CompanyID: e.companyID,
                        FranchiseID: e.franchiseID,
                        BranchID: e.branchID,
                        LocationID: e.locationID,
                        DivisionID: e.divisionID,
                        SpeedCustomerID: e.speedCustomerID,
                        EDPCustomerID: e.edpCustomerID,
                        CustomerName: e.customerName,
                        InternalCustomerFlag: e.internalCustomerFlag,
                        SpeedSalesmanID: e.speedSalesmanID,
                        Salesmanname: e.salesmanname,
                        Channel: e.channel,
                        SalesDate: vm.getlocalDateTime(e.salesDate),
                        DocumentType: e.documentType,
                        AgreementNo: e.agreementNo,
                        AgreementType: e.agreementType,
                        StartDate: vm.getlocalDateTime(e.startDate),
                        EndDate: vm.getlocalDateTime(e.endDate),
                        FunctionalCurrency: e.functionalCurrency,
                        AccruedSales_FunctionalCurrency: e.accruedSales_FunctionalCurrency,
                        AccruedSales_AED: e.accruedSales_AED,
                        VehicleNo: e.vehicleNo,
                        CREATION_DATE: vm.getlocalDateTime(e.creatioN_DATE),
                        LAST_UPDATE_DATE: vm.getlocalDateTime(e.salesDate),

                    });
                }
                );

                JSONData = arrayToExport;
                var ReportTitle = "Daily Revenue Report";
                var ShowLabel = true;
                //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
                var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

                var CSV = 'sep=,' + '\r\n\n';

                //This condition will generate the Label/Header
                if (ShowLabel) {
                    var row = "";

                    //This loop will extract the label from 1st index of on array
                    for (var index in arrData[0]) {

                        //Now convert each value to string and comma-seprated
                        row += index + ',';
                    }

                    row = row.slice(0, -1);

                    //append Label row with line break
                    CSV += row + '\r\n';
                }

                //1st loop is to extract each row
                for (var i = 0; i < arrData.length; i++) {
                    var row = "";

                    //2nd loop will extract each column and convert it in string comma-seprated
                    for (var index in arrData[i]) {
                        row += '"' + arrData[i][index] + '",';
                    }

                    row.slice(0, row.length - 1);

                    //add a line break after each row
                    CSV += row + '\r\n';
                }

                if (CSV == '') {
                    alert("Invalid data");
                    return;
                }

                //Generate a file name
                var fileName = "MyReport_";
                //this will remove the blank-spaces from the title and replace it with an underscore
                fileName += ReportTitle.replace(/ /g, "_");

                //Initialize file format you want csv or xls
                var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

                // Now the little tricky part.
                // you can use either>> window.open(uri);
                // but this will not work in some browsers
                // or you will not get the correct file extension    

                //this trick will generate a temp <a /> tag
                var link = document.createElement("a");
                link.href = uri;

                //set the visibility hidden so it will not effect on your web-layout
                link.style = "visibility:hidden";
                link.download = fileName + ".csv";

                //this part will append the anchor tag and remove it after automatic click
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }

            // vm.getDailyRevenueReport();
        }
    ]);
