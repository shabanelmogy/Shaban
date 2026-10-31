// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:279669-279859
appModule.controller('tenant.views.crs.reports.salePersonReports.salesPersonAgreementOutstandingReport.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.vehicle', 'abp.services.app.salesPersonReport', 'abp.services.app.directory', 'utilities',
        function ($scope, $uibModal, uiGridConstants, vehicleService, salesPersonReport, directoryService, utilities) {

            var vm = this;

            vm.loading = false;
            vm.vehicleTypes = [];
            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.dateRangeModel = {
                startDate: null,
                endDate: null,
            };

            vm.filters = {
                fromDate: null,
                ToDate: null,

            };

            vm.dateRangeCheck = function () {

                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format(dateFormat)).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format(dateFormat)).add(1, 'days').add(-1, 'milliseconds').utc();

            };
            vm.dateRangeModelChange = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };

            vm.searchUsers = function ($select) {

                return directoryService.search({ keyword: $select.search, contactType: 1 }).then(function (response) {

                    vm.users = response.data.items;
                });
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.agreementStatus = function (id) {
                if (id == 1)
                    return app.localize("Open");
                else if (id == 2)
                    return app.localize("Closed");
            }

            vm.changeAgreementCategory = function () {




            };
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };
            //vm.searchVehicles = function ($select) {
            //    if ($select.search == "") {
            //        vm.vehicles = null; return null;
            //    }
            //    return vehicleService.searchVehicles({ plateNo: $select.search }).then(function (response) {
            //        vm.vehicles = response.data.items;
            //    });
            //};
            //vm.clearVehicle = function () {
            //    vm.filters.vehicle = null;
            //    vm.filters.vehicleId = null;
            //};
            vm.exportToExcel = function () {
                var tab_text = "<table border='1px'><tr>";
                var textRange;
                var j = 0;
                var tab1 = document.getElementById('salesTable'); // id of table
                for (j = 0; j < tab1.rows.length; j++) {

                    tab_text = tab_text;
                    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text;

                var j = 0;
                var tab2 = document.getElementById('salesTable1'); // id of table
                for (j = 0; j < tab2.rows.length; j++) {

                    tab_text = tab_text;
                    tab_text = tab_text + tab2.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";


                var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
                var blobUrl = URL.createObjectURL(blob);

                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'SalesPersonAgreementOutstandingReport.xls';
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


            vm.printCall = function () {
                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/reports/salePersonReports/salesPersonAgreementOutstandingReport/report.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };
            vm.getTotal = function () {
                vm.totalCharges = utilities.round(vm.report.map(m => m.agreement.totalCharges).reduce((total, totalCharges) => total + totalCharges, 0), 2);
                vm.outstanding = utilities.round(vm.report.map(m => m.outstandingAmount).reduce((total, outstandingAmount) => total + outstandingAmount, 0), 2);
                vm.outstandingPercentage = utilities.round((vm.outstanding / vm.totalCharges) * 100, 2);
            }

            vm.getSalesPersonAgreementOutstandingReport = function () {
                vm.loading = true;
                vm.report = null;

                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();


                if (vm.filters.salesPerson != null) {
                    vm.filters.salesPersonId = vm.filters.salesPerson.id;
                }


                salesPersonReport.getSalesPersonAgreementOutstandingReport(vm.filters).success(function (result) {
                    vm.report = result.reportDetail;//.filter(x => x.outstandingAmount > 0);


                }).finally(function () {
                    vm.loading = false;
                    vm.getTotal();
                });;
            };
            //  vm.changeAgreementCategory();


        }
    ]);
