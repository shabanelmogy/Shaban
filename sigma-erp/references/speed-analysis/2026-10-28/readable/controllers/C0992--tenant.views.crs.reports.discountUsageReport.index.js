// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:268780-269009
appModule.controller('tenant.views.crs.reports.discountUsageReport.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.discountAuthCode', 'abp.services.app.commonLookup', 'utilities', 'abp.services.app.directory', 'abp.services.app.user',
        function ($scope, $uibModal, uiGridConstants, discountCodeService, commonLookupService, utilities, directoryService, userService) {

            var vm = this;
            var todayAsString = moment().format('YYYY-MM-DD hh:mm:ss');
            vm.invoiceOnAgreedRent = utilities.parseBoolean(abp.setting.get("App.General.InvoiceBasedOnAgreedRent"));
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.filters = {
                code: '',
                enableDateRange: true,
                createdBy: '',
                createdById: '',
                usedById: '',
                usedBy: '',
                clearUsedBy: null,
                startDate: null,
                endDate: null
            };

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.viewDiscountCode = function (discountCode) {

                openViewDiscountCodeModal(discountCode.id);
            };

            function openViewDiscountCodeModal(discountCodeId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/discountCodes/viewDiscountCodeModal.cshtml',
                    controller: 'tenant.views.crs.discountCodes.viewDiscountCodeModal as vm',
                    backdrop: 'static',

                    resolve: {
                        discountCodeId: function () {
                            return discountCodeId;
                        }
                    }
                });
            }

            vm.searchUsers = function ($select) {

                return userService.searchUsers({ keyword: $select.search }).then(function (response) {
                    vm.users = response.data.items;

                });
            };
            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
            vm.dateRangeModel = {
                startDate: moment().startOf('day'),
                endDate: moment().endOf('day')
            };

            vm.dateRangeModelChanged = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
            };

            vm.getlocalDateTime = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.getlocalDate = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.getlocalTime = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(' HH:mm:ss');
                }
                else {
                    return "";
                }
            };


            vm.dateRangeCheck = function () {
                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }
            };

            vm.exportToExcel = function () {
                var tab_text = "<table border='1px'><thead><tr>";
                var textRange;
                var tab1 = document.getElementById('ReportTable'); // id of table
                for (var i = 0; i < tab1.rows[0].cells.length; i++) {
                    var currentTHEAD = tab1.rows[0].cells[i];
                    currentTHEAD.setAttribute('width', 100);
                }
                tab_text = tab_text + tab1.rows[0].innerHTML.toUpperCase() + "</tr>";

                var j = 0;
                tab_text = tab_text + "</thead><tbody>";
                for (j = 0; j < tab1.tBodies.length; j++) {
                    var currentTBODY = tab1.tBodies[j];
                    var firstRow = currentTBODY.rows[0];
                    for (var k = 0; k < firstRow.cells.length; k++) {
                        var currentColumn = firstRow.cells[k];
                        currentColumn.setAttribute('width', 100);
                        currentColumn.style.textAlign = "center";
                    }
                    var secondRow = currentTBODY.rows[1];
                    var allSubCells = secondRow.getElementsByTagName('td');
                    for (var l = 0; l < allSubCells; l++) {
                        allSubCells[l].style.textAlign = "center";
                    }
                    debugger;
                    var rowWithAgreementDetail = secondRow.getElementsByTagName('tr');  //Getting by tr so we can have total;
                    var totalSubCell = rowWithAgreementDetail[rowWithAgreementDetail.length - 1];
                    totalSubCell.style.fontWeight = 'bold';


                    tab_text = tab_text;
                    tab_text = tab_text + currentTBODY.innerHTML.toUpperCase() + "</tbody>";
                }
                tab_text = tab_text + "</table>";

                var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
                var blobUrl = URL.createObjectURL(blob);

                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'DiscountUsageReport.xls';
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

            vm.getDiscountCode = function () {
                vm.loading = true;

                if (vm.filters.createdBy !== null) {
                    vm.filters.createdById = vm.filters.createdBy.id;
                }

                if (vm.filters.usedBy !== null) {
                    vm.filters.usedById = vm.filters.usedBy.id;
                }

                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                } else {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }

                discountCodeService.getDiscountCodesReport(vm.filters).success(function (data) {
                    vm.discountCodeUsesReport = data;
                    vm.totalDiscountAmount = 0;

                    vm.discountCodeUsesReport.forEach(function (entry) {
                        entry.uses.forEach(function (use) {
                            if (vm.invoiceOnAgreedRent) {
                                var originalAmount = (use.charges / (1 - (use.discountPercent / 100)));
                                use.discountAmount = utilities.round((originalAmount * (use.discountPercent / 100)));
                                vm.totalDiscountAmount += use.discountAmount;
                            }
                            else {
                                use.discountAmount = utilities.round((use.charges) * (use.discountPercent / 100));
                                vm.totalDiscountAmount += use.discountAmount;
                            }

                        });
                    });

                }).finally(function () {

                    vm.loading = false;
                });
            };

            vm.getDiscountCode();

        }
    ]);
