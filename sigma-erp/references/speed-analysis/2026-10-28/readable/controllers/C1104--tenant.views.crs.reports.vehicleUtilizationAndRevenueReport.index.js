// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:291852-292079
appModule.controller('tenant.views.crs.reports.vehicleUtilizationAndRevenueReport.index', [
        '$scope', 'abp.services.app.vehicleUtilizationAndRevenueReport', 'utilities', 'abp.services.app.make', 'abp.services.app.vehicleModel',
        function ($scope, vehicleUtilizationAndRevenueReport, utilities, makeService, vehicleModelService) {

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
                monthYear: new Date(),
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                startDate: null,
                endDate: null,
            };
            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc(),
            };
            vm.rentalAgreementOwnerships = [
                { key: 'Own', value: 1 },
                { key: 'External', value: 2 }
            ];
            vm.getOwnerships = function (value)
            {
                if (value == 1)
                    return "Own";
                if (value == 2)
                    return "External";
                if (value == 3)
                    return "Buy Back";
                if (value == 4)
                    return "TempExternal";
                if (value == 5)
                    return "Accessory";
                if (value == 6)
                    return "Attachment";
            }
               
            vm.calcTotalVehical = function (value) {
                var total = 0;
                total = value.daily + value.idle + value.monthly + value.nrm + value.weekly + value.workShop;
                return total;
            }

            vm.getRoundFigure = function (val) {
                if (val != null) {
                    return utilities.round(val, 2)
                }
                else {
                    return 0;
                }
            }

            //for Make selection
            vm.searchMake = function ($select) {
                makeService.searchPreUsedMakes({ name: $select.search }).then(function (response) {
                    vm.makes = response.data.items;
                });
            };

            //for Model selection
            vm.searchModel = function ($select) {
                return vehicleModelService.searchPreUsedVehicleModels({ name: $select.search }).then(function (response) {
                    vm.models = response.data.items;
                });
            };

            //vm.exportToExcelMethod = function (tableID) {

            //    var tab_text = "<table border='1px'><tr>";
            //    var textRange; var j = 0;
            //    tab = document.getElementById(tableID); // id of table

            //    for (j = 0 ; j < tab.rows.length ; j++) {

            //        tab_text = tab_text;

            //        tab_text = tab_text + tab.rows[j].innerHTML.toUpperCase() + "</tr>";
            //        //tab_text=tab_text+"</tr>";
            //    }

            //    tab_text = tab_text + "</table>";

            //    var ua = window.navigator.userAgent;
            //    var msie = ua.indexOf("MSIE ");

            //    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer

            //    {
            //        txtArea1.document.open("txt/html", "replace");
            //        txtArea1.document.write('sep=,\r\n' + tab_text);
            //        txtArea1.document.close();
            //        txtArea1.focus();
            //        sa = txtArea1.document.execCommand("SaveAs", true, "depreciationReportFY.xls");
            //    }

            //    else {
            //        sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));
            //    }

            //    return (sa);
            //};

            vm.clearMake = function () {
                vm.filters.make = null;
                vm.filters.makeId = null;
            };

            vm.clearModel = function () {
                vm.filters.model = null;
                vm.filters.modelId = null;
            };

            vm.exportToExcelMethod = function (tableID) {
                var tab_text = "<table border='1px'><tr>";
                var textRange;
                var j = 0;
                var tab1 = document.getElementById(tableID); // id of table
                for (j = 0; j < tab1.rows.length; j++) {

                    tab_text = tab_text;
                    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";


                var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
                var blobUrl = URL.createObjectURL(blob);


                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'VehicleUtilization.xls';
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

            vm.getVehicleUtilizationReport = function () {
                vm.loading = true;
                vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                if (vm.filters.make) {
                    vm.filters.makeId = vm.filters.make.id;
                }
                if (vm.filters.model) {
                    vm.filters.modelId = vm.filters.model.id;
                }
                vehicleUtilizationAndRevenueReport.getVehicleUtilizationAndRevenueReport(vm.filters).success(function (data) {
                    vm.reports = data;

                    vm.totalDays = 0.0;
                    vm.totalNrms = 0.0;
                    vm.totalGarage = 0.0;
                    vm.totalIdle = 0.0;

                    vm.totalDaysPer = 0.0;
                    vm.totalNrmsPer = 0.0;
                    vm.totalGaragePer = 0.0;
                    vm.totalIdlePer = 0.0;

                    angular.forEach(vm.reports.listData, function (value, key) {
                        vm.totalDays += parseFloat(utilities.round(value.agreementDays, 2));
                        vm.totalNrms += parseFloat(utilities.round(value.nrmDays, 2));
                        vm.totalGarage += parseFloat(utilities.round(value.workshopDays, 2));
                        vm.totalIdle += parseFloat(utilities.round(value.idleDays, 2));


                        vm.totalDaysPer += parseFloat(utilities.round(value.agreementPercentage, 2));
                        vm.totalNrmsPer += parseFloat(utilities.round(value.nrmPercentage, 2));
                        vm.totalGaragePer += parseFloat(utilities.round(value.workshopPercentage, 2));
                        vm.totalIdlePer += parseFloat(utilities.round(value.idlePercentage, 2));
                    });

                    vm.totalDaysPer = utilities.round(vm.totalDaysPer / vm.reports.listData.length);
                    vm.totalNrmsPer = utilities.round(vm.totalNrmsPer / vm.reports.listData.length);
                    vm.totalGaragePer = utilities.round(vm.totalGaragePer / vm.reports.listData.length);
                    vm.totalIdlePer = utilities.round(vm.totalIdlePer / vm.reports.listData.length);

                }).finally(function () {
                    vm.loading = false;
                })
            };

            //vm.getFleetUtilizationReport(vm.filters);
        }
    ]);
