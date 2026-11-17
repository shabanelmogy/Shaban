// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:269012-269235
appModule.controller('tenant.views.crs.reports.discountUsageReportOnRA.index', [
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
                enableDateRange: true,
                lastModifierUserId:'',
                createdBy: '',
                createdById: '',
                userId: '',
                usedBy: '',
                agreementNo: null,
                startDate: null,
                endDate: null
            };

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.viewDiscountCode = function (discountCode) {

                openViewDiscountCodeModal(discountCode.id);
            };


            vm.currencyDecimals = function (value) {
                var currencyDecimals = parseInt(abp.setting.get("App.General.CurrencyDecimals"));
                if (typeof value === 'number' && !isNaN(value)) {
                    return value.toFixed(currencyDecimals);
                } else {
                    return '';
                }
            };

            vm.roundingforView = function (value) {
                var roundedValue = utilities.roundforView(value, 2);
                return roundedValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
            vm.rounding = function (value) {
                return utilities.round(value, 2);
            };

            vm.searchUsers = function ($select) {

                return userService.searchUsers({ keyword: $select.search }).then(function (response) {
                    vm.users = response.data.items;

                });
            };

            vm.dateRangeModel = {
                startDate: moment().startOf('day'),
                endDate: moment().endOf('day')
            };

            vm.dateRangeModelChanged = function () {
                vm.filters.startDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.endDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
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
                    currentTHEAD.setAttribute('width', 200);
                }
                tab_text = tab_text + tab1.rows[0].innerHTML.toUpperCase() + "</tr>";

                var j = 0;
                tab_text = tab_text + "</thead><tbody>";
                for (j = 0; j < tab1.tBodies.length; j++) {
                    var currentTBODY = tab1.tBodies[j];
                    var firstRow = currentTBODY.rows[0];
                    for (var k = 0; k < firstRow.cells.length; k++) {
                        var currentColumn = firstRow.cells[k];
                        currentColumn.setAttribute('width', 200);
                        currentColumn.style.textAlign = "center";
                    }

                    tab_text = tab_text;
                    tab_text = tab_text + currentTBODY.innerHTML.toUpperCase() + "</tbody>";
                }
                tab_text = tab_text + "</table>";

                var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
                var blobUrl = URL.createObjectURL(blob);

                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'DiscountUsageReportOnRA.xls';
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
                    vm.filters.userId = vm.filters.usedBy.id;
                }

                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                } else {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }

                discountCodeService.getDiscountCodesReportOnAgreementClosing(vm.filters).success(function (data) {
                    vm.discountCodeUsesReport = data.items;
                    vm.totalDiscountAmount = 0;

                    angular.forEach(vm.discountCodeUsesReport, function (item) {
                        vm.totalDiscountAmount += item.discount; 
                    });
                }).finally(function () {

                    vm.loading = false;
                });
            };

            vm.getDiscountCode();

        }
    ]);
