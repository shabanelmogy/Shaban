// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:287631-288124
appModule.controller('tenant.views.crs.reports.vehicleRentalDetailsReport.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.profitAndLoss', 'abp.services.app.vehicle', 'abp.services.app.vehicleModel', 'utilities',
        function ($scope, $uibModal, uiGridConstants, vehiclesProfitAndLoss, vehicleService, vehicleModelService, utilities) {
            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            //vm.filters =
            //{
            //    enableDateRange: true
            //}
            vm.filters = {
                monthYear: new Date(),
            };
            vm.loading = false;
            vm.models = null;

            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.showBookedVehiclesInDashboard = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowBookedVehiclesInDashboard"));

            vm.selectedVehicle = null;

            vm.profitLoss = {
                vehicleId: null,
                ownership: 1,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };
            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc(),
            };
            vm.localizeArabicUsingKey = function (input) {
                if (input == null)
                    return "";

                return app.localize(input + 'Lang');
            };
            vm.localize = function (input) {
                if (input == null)
                    return "";

                return app.localize(input);
            };

            vm.searchVehicles = function ($select) {
                if ($select.search == "") { vm.vehicles = null; return null; }
                return vehicleService.searchVehicles({ includeDefleeted: true, plateNo: $select.search }).then(function (response) {
                    vm.vehicles = response.data.items;
                });
            };
            vm.clearVehicle = function () {
                vm.profitLoss.vehicle = null;
                vm.profitLoss.vehicleId = null;
                vm.makeAndModel = null;

                vm.getVehicleRentalDetailsReport();
            };
            vm.searchModel = function ($select) {
                vm.profitLoss.name = $select.search;
                if (vm.profitLoss.name == '')
                    vm.profitLoss.name = "~";  //to avoid default suggestions

                return vehicleModelService.searchPreUsedVehicleModels(vm.profitLoss).then(function (response) {
                    vm.models = response.data.items;
                });
            };
            //Make/Model
            vm.clearModel = function () {
                vm.profitLoss.model = null;
                vm.filters.modelId = null;
            };
            vm.agreementCategories = [
                { type: "Rental", id: 1 }
            ];

            if (abp.features.isEnabled("CRS.Lease")) {
                vm.agreementCategories.push({ type: "Lease", id: 2 });
            }

            vm.getAgreementsByCategory = function (id) {
                if (id === 1)
                    return "Rental";
                else if (id === 2)
                    return "Lease";
            };
            vm.rounding = function (value) {
                return utilities.round(value, 2);
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

            vm.getMakeAndModel = function () {
                vm.getVehicleRentalDetailsReport();

                debugger;
                if (vm.profitLoss.vehicle)
                    vm.makeAndModel = vm.profitLoss.vehicle.make + " " + vm.profitLoss.vehicle.model;
            };
            vm.vehicleOwnerships = [
                { name: "Own", id: 1 },
                { name: "External", id: 2 },
                // { name: "BuyBack", id: 3 },
                { name: "TempExternal", id: 4 }
            ];

            vm.searchVehiclePopup = function () {
                openSearchVehicleModal();
            };


            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            vm.permissions = {
                detail: abp.auth.hasPermission('Pages.Tenant.Reports.VehicleRentalDetailsReport.Detail'),
            };

            vm.reportModal = function () {
                //if (vm.filters.fiscalYear) {
                //    vm.filters.fromDate = vm.filters.fiscalYear.startDate;
                //    vm.filters.toDate = vm.filters.fiscalYear.endDate;
                //}
                //else {

                //    vm.filters.fromDate = moment().startOf('year');
                //    vm.filters.toDate = moment().endOf('year');
                //}

                //if (vm.filters.salesPerson != null) {
                //    vm.filters.salesPersonId = vm.filters.salesPerson.id;
                //}
                //vm.filters.invoiceTypeArray = [];
                //if (vm.filters.invoiceType.length > 0) {
                //    angular.forEach(vm.filters.invoiceType, function (value) {
                //        vm.filters.invoiceTypeArray.push(value.id);
                //    });
                //}

                $uibModal.open({
                    templateUrl: '~/App/common/views/common/reportViewer.cshtml',
                    controller: 'common.views.common.reportViewer as vmMain',
                    backdrop: 'static',
                    size: 'full',
                    resolve: {
                        templateUrl: function () {
                            return '~/App/tenant/views/crs/reports/vehicleRentalDetailsReport/report.cshtml';
                        },
                        filters: function () {
                            return vm.filters;
                        }
                    }
                });
            };

            vm.getVehicleRentalDetailsReport = function () {
                vm.loading = true;
                vm.vehiclesSummary = {};
                vm.dataList = [];

                vehicleService.getVehiclesSummary({
                    vehicleType: vm.filters.vehicleType
                        })
                    .success((result) => {
                        vm.vehiclesSummary = result;
                        console.log(vm.vehiclesSummary);
                    })
                    .finally(() => {
                        vm.filters.startDate = moment(vm.filters.monthYear).startOf('month').utc();
                        vm.filters.endDate = moment(vm.filters.monthYear).endOf('month').endOf('day').utc();
                        vehiclesProfitAndLoss.getVehicleRentalDetailsReport(vm.filters).success(function (data) {

                            vm.dataList = data;
                            let totalDays = 0;
                            let totalVehicles = vm.dataList.length;
                            vm.totalRate = 0;

                            angular.forEach(vm.dataList, function (value, key) {
                                if (totalDays === 0) {
                                    totalDays = value.rentalDetails.length;
                                }

                                let totalDaysRate = 0;
                                angular.forEach(value.rentalDetails, function (item, key) {
                                    if (item.rate > 0) {
                                        totalDaysRate += item.rate;
                                    }
                                });
                                value.totalDaysRate = totalDaysRate;
                                vm.totalRate += totalDaysRate;
                            });

                            vm.vehiclesRentPerDay = [];
                            for (let i = 0; i < totalDays; i++) {
                                let vehicleRentPerDay = 0;
                                for (let j = 0; j < totalVehicles; j++) {
                                    vehicleRentPerDay += vm.dataList[j].rentalDetails[i].rate;
                                }
                                vm.vehiclesRentPerDay.push(vehicleRentPerDay);
                            }
                        }).finally(function () {
                            vm.loading = false;

                            // calculate vehicles summary total
                            let totalVehicles = 0;
                            let totalVehiclesPercentage = 0;
                            let vehiclesSummaryTableRows = document.querySelectorAll('#vehiclesSummaryTable tr');
                            for (let i = 0; i < vehiclesSummaryTableRows.length; i++) {
                                let e = vehiclesSummaryTableRows[i];
                                if (i > 0 && i < vehiclesSummaryTableRows.length - 1) {
                                    totalVehicles += Number.parseFloat(e.children[1].textContent);
                                    totalVehiclesPercentage += Number.parseFloat(e.children[2].textContent);
                                }
                                if (i === vehiclesSummaryTableRows.length - 1) {
                                    e.children[1].textContent = totalVehicles;
                                    e.children[2].textContent = `${vm.rounding(totalVehicles / vm.vehiclesSummary.total * 100)} %`;
                                    //e.children[2].textContent = `${vm.rounding(totalVehiclesPercentage)} %`;
                                }
                            }
                        });
                    });
            };

            vm.exportToExcelOnSreen = function () {
                //var tab_text = "<table border='1px'><tr>";

                //var j = 0;
                //var tab1 = document.getElementById('salesTable'); // id of table
                //for (j = 0; j < tab1.rows.length; j++) {

                //    tab_text = tab_text;
                //    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                //}
                //tab_text = tab_text + "</table>";

                let file = getExportFile();

                let a = document.createElement('a');
                a.href = file.blobUrl;
                a.download = 'vehicleRentalDetails.xls';
                a.click();
            };

            function getExportFile() {
                let html = getHtmlForExport();
                let blob = b64toBlob(btoa(html), "application/vnd.ms-excel");
                let blobUrl = URL.createObjectURL(blob);
                return { blob, blobUrl };
            }

            function getHtmlForExport() {
                let table1 = exportTable('vehiclesSummaryTable');
                let table2 = exportTable('salesTable');
                return unescape(encodeURIComponent(table1 + table2));
            }

            function exportTable(id) {
                let tab_text = "<table border='1px'><tr>";
                let j = 0;
                let tab1 = document.getElementById(id); // id of table
                for (j = 0; j < tab1.rows.length; j++) {

                    tab_text = tab_text;
                    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";
                return tab_text;
            }

            vm.gridOptions = {
                enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
                paginationPageSizes: app.consts.grid.defaultPageSizes,
                paginationPageSize: app.consts.grid.defaultPageSize,
                appScopeProvider: vm,
                //useExternalPagination: true,
                enableSorting: false,
                columnDefs: [
                    {
                        name: app.localize('Actions'),
                        width: 120,

                        cellTemplate:
                            '<div class=\"ui-grid-cell-contents\">' +
                            '  <div class="btn-group dropdown" uib-dropdown="" dropdown-append-to-body>' +
                            '    <button class="btn btn-xs btn-primary blue" uib-dropdown-toggle="" aria-haspopup="true" aria-expanded="false"><i class="fa fa-cog"></i> ' + app.localize('Actions') + ' <span class="caret"></span></button>' +
                            '    <ul uib-dropdown-menu>' +
                            '      <li><a  ng-click="grid.appScope.viewDetail(row.entity)">' + app.localize('Details') + '</a></li>' +
                            '    </ul>' +
                            '  </div>' +
                            '</div>'
                    },
                    {
                        name: app.localize('ChargesType'),
                        field: app.localize('chargesType.name'),
                        cellTemplate: '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + app.localize('{{row.entity.chargesType.name}}') + '&nbsp' + '</span>'

                    },
                    {
                        name: app.localize('PlateNo'),
                        field: 'vehicle.plateNo',
                        cellTemplate: '<div class=\"ui-grid-cell-contents\">' +
                            ' <span >' + '{{row.entity.vehicle.plateNo}}' + '&nbsp' + '</span>' +
                            ' <span  ng-show="row.entity.vehicle.statusId == \'DFL\' " class="label label-danger">' + app.localize('Defleeted') + '</span>' +
                            '</div>'
                    },
                    {
                        name: app.localize('MakeAndModel'),
                        width: 200,
                        field: 'getMakeAndModel()'
                    },
                    {
                        name: app.localize('Revenue'),
                        cellTemplate: '<div style="text-align:right;margin-right:5px">{{grid.appScope.roundingforView(row.entity.credit)}}</div>',

                    },
                    {
                        name: app.localize('Expense'),
                        cellTemplate: '<div style="text-align:right;margin-right:5px">{{grid.appScope.roundingforView(row.entity.debit)}}</div>',

                    },
                    {
                        name: app.localize('ProfitAndLoss'),
                        cellTemplate: '<div style="text-align:right;margin-right:5px">{{grid.appScope.roundingforView(row.entity.getProfitLoss())}}</div>',
                    }
                ],
                onRegisterApi: function (gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
                        if (!sortColumns.length || !sortColumns[0].field) {
                            vm.profitLoss.sorting = null;
                        } else {
                            vm.profitLoss.sorting = sortColumns[0].field + ' ' + sortColumns[0].sort.direction;
                        }

                        vm.getVehicleRentalDetailsReport();
                    });
                    gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                        vm.profitLoss.skipCount = (pageNumber - 1) * pageSize;
                        vm.profitLoss.maxResultCount = pageSize;

                        vm.getVehicleRentalDetailsReport();
                    });
                },
                data: []
            };
            vm.rounding = function (value) {
                return utilities.round(value, 2);
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
                } 0

                var blob = new Blob(byteArrays, { type: contentType });
                return blob;
            }

            vm.vehicleRentalDetailsReportExportToExcel = function () {
                vm.loading = true;

                //set filter dates to date range picker date only if selected dates are not null. by default range picker selects today but does not give values in filters
                //if null then get as following
                //fromDate: get local date with time 00:00:00 and then convert to utc
                //toDate: get local date of max time of night and then convert to utc
                if (vm.filters.enableDateRange) {
                    vm.profitLoss.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.profitLoss.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.profitLoss.fromDate = null;
                    vm.profitLoss.toDate = null;
                }

                if (vm.profitLoss.model)

                    vm.profitLoss.modelId = vm.profitLoss.model.id;

                if (vm.profitLoss.vehicle)
                    vm.profitLoss.vehicleId = vm.profitLoss.vehicle.id;


                vehiclesProfitAndLoss.vehicleRentalDetailsReportExportToExcel(vm.profitLoss)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };



            vm.exportToExcelWithSellingDetail = function () {
                vm.loading = true;

                vm.profitLoss.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.profitLoss.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                debugger;
                vehiclesProfitAndLoss.exportToExcelWithSellingDetail(vm.profitLoss)
                    .success(function (result) {
                        app.downloadTempFile(result);
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.sendReportByEmail = () => {
                let html = getHtmlForExport();
                debugger;
                let modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/reports/VehicleRentalDetailsReport/sendReportByEmail.cshtml',
                    controller: 'tenant.views.crs.reports.vehicleRentalDetailsReport.sendReportByEmail as vm',
                    backdrop: 'static',
                    size: 'sm',
                    resolve: {
                        html: () => {
                            return html;
                        }
                    }
                });

                modalInstance.result.then((result) => {
                    
                });
            }


            vm.viewDetail = function (profitLoss) {
                openProfitLossDetailModal(profitLoss.vehicle);
            }
            openProfitLossDetailModal = function (vehicle) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/reports/vehiclesProfitAndLoss/profitLossDetail.cshtml',
                    controller: 'tenant.views.crs.reports.vehiclesProfitAndLoss.profitLossDetail as vm',
                    backdrop: 'static',

                    size: 'lg',
                    resolve: {
                        vehicle: function () {
                            return vehicle;
                        },
                        fromDate: function () {
                            return vm.profitLoss.fromDate;
                        },
                        toDate: function () {
                            return vm.profitLoss.toDate;
                        },

                    }
                });

            }
            vm.getVehicleRentalDetailsReport();
        }
    ]);
