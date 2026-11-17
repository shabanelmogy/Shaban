// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:483370-483469
appModule.controller('tenant.views.tms.tollReport.summaryReport', [
        '$scope', '$uibModalInstance',  'abp.services.app.toll', 'salikAccount','filters',
        function ($scope, $uibModalInstance, tollsService, salikAccount, filters) {
            var vm = this;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = ' DD-MMM';
            vm.totalAmount = 0;
            vm.totalCount = 0;
            vm.salikAccount = salikAccount;

            vm.filters = filters;


            vm.getlocalDateTime = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.getlocalDate = function (date) {
                if (date != null) {
                    return moment(date).utc().format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
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
                a.download = 'DailyReport.xls';
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
                tollsService.getTollSummaryReport(vm.filters)
                    .success(function (result) {
                        vm.tolls = result; 
                        angular.forEach(vm.tolls, function (value) {
                            vm.totalAmount += value.amount;
                            vm.totalCount += value.count;
                        })
                    }).finally(function () {
                        vm.loading = false;
                    });
            };
          

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };
            init();
        }
    ]);
