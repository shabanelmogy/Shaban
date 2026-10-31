// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:24821-24945
appModule.controller('common.views.auditTrail.index', [
        '$scope', 'abp.services.app.auditTrail',
        function ($scope, auditTrailService) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.filters = {
                fromDate: moment().utc().startOf('day'),
                toDate: moment().utc(),
                recordNo: null,
                recordType: null,
                user: null,
                userId: null
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

            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.searchUsers = function ($select) {
                return auditTrailService.searchUsers({ keyword: $select.search }).then(function (response) {
                    vm.users = response.data.items;
                });
            };

            vm.clearUser = function () {
                vm.filters.user = null;
                vm.filters.userId = null;
            };

            vm.getAuditTrail = function () {
                if (vm.filters.user) {
                    vm.filters.userId = vm.filters.user.id;
                }
                var startDate = new Date(vm.filters.fromDate);
                var endDate = new Date(vm.filters.toDate);

                startDate.setHours(0);
                startDate.setMinutes(0);
                startDate.setSeconds(0);

                endDate.setHours(23);
                endDate.setMinutes(59);
                endDate.setSeconds(59);

                vm.filters.startDate = startDate;
                vm.filters.endDate = endDate;

                vm.loading = true;
                auditTrailService.getAuditTrailRecords(vm.filters).success(function (data) {
                    vm.auditTrailRecords = data;
                }).finally(function () {
                    vm.loading = false;
                });
            }
            vm.exportToExcel = function (tblEstimatedRevenueByBranch) {
                var tab_text = "<style>#tblEstimatedRevenueByBranch tr td:first-child {width: 200px;}</style>";
                tab_text += "<table border='1px'><tr>";
                var textRange;
                var j = 0;
                var tab1 = document.getElementById(tblEstimatedRevenueByBranch); // id of table
                for (j = 0; j < tab1.rows.length; j++) {

                    tab_text = tab_text;
                    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";

                var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
                var blobUrl = URL.createObjectURL(blob);

                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'AuditTrail.xls';
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
        }
    ]);
