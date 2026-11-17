// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:120311-120481
appModule.controller('tenant.views.crs.views.accidents.report', ['$scope', 'abp.services.app.accident', '$stateParams', 'abp.services.app.commonLookup',
        function ($scope, accidentService, $stateParams, commonLookupService) {

            var vm = this;


            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.filters = null;

            if ($scope.$parent != null) {
                if ($scope.$parent.vmMain != null)
                    vm.filters = $scope.$parent.vmMain.filters;
            }


            //if (vm.filters.enableDateRange) {
            //    vm.filters.fromDate = vm.dateRangeModel.startDate !== null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
            //    vm.filters.toDate = vm.dateRangeModel.endDate !== null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
            //}


            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.getFilterMovementType = function () {
                if (vm.filters.movementType == 1)
                    return app.localize("Agreement");
                else if (vm.filters.movementType == 2)
                    return app.localize("NRM");
                else
                    return "";
            };

            vm.getFilterInvoiceOptions = function () {
                if (vm.filters.excessChargesInvoiceStatus == 0)
                    return app.localize("NA");
                else if (vm.filters.excessChargesInvoiceStatus == 1)
                    return app.localize("Invoiced");
                else if (vm.filters.excessChargesInvoiceStatus == 2)
                    return app.localize("DueToInvoice");
                else
                    return "";
            };

            vm.getFaultValue = function (value) {
                if (value === 1)
                    return "Driver At Fault";
                else if (value === 2)
                    return "Driver Not At Fault";
                else if (value === 3)
                    return "Unknown";
                else
                    return null;
            };

            vm.getMovementType = function (mov) {

                if (!mov)
                    return '';
                else if (mov.movementTypeId == 1 && mov.inDetail.operationType == 2)
                    return 'Agreement Replacement';
                else if (mov.movementTypeId == 1 && mov.inDetail.operationType == 4)
                    return 'Agreement Custody';
                if (mov.movementTypeId == 1)
                    return app.localize("Agreement");
                else if (mov.movementTypeId == 2)
                    return app.localize("NRM");
                else if (mov.movementTypeId == 3)
                    return app.localize("Garage");
                else if (mov.movementTypeId == 4)
                    return app.localize("Delivery");
                else if (mov.movementTypeId == 5)
                    return app.localize("Collection");
                else
                    return app.localize("N/A");
            };
            vm.getChargingType = function (row) {
                if (row && row.chargingType) {
                    if (row.chargingType == 1)
                        return 'No Charging';
                    else if (row.chargingType == 2)
                        return 'Excess Charging';
                    else if (row.chargingType == 3)
                        return 'Damage Charging';
                }
                return '';
            };

            vm.getInvoiceStatus = (accident) => {
                if (accident.invoiceId)
                    return 'Invoiced';
                else if (!accident.invoiceId && accident.excessAmount)
                    return 'Due';
                else if (!accident.excessAmount)
                    return 'N/A';
                else
                    return "";
            };


            vm.exportToExcel = function () {
                var tab_text = "<table border='1px'><tr>";
                var textRange;
                var j = 0;
                var tab1 = document.getElementById('ReportTable'); // id of table
                for (j = 0; j < tab1.rows.length; j++) {

                    tab_text = tab_text;
                    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";

                var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
                var blobUrl = URL.createObjectURL(blob);

                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'Accident Report.xls';
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

            function init() {

            vm.loading = true;

            if (vm.filters.locationId)
                getLocations();

                accidentService.getReport(vm.filters).success(function (data) {
                   // alert(JSON.stringify(data));
                vm.reportData = data;

            }).finally(function () {
                vm.loading = false;
            });
        };
            init();
        }]);
