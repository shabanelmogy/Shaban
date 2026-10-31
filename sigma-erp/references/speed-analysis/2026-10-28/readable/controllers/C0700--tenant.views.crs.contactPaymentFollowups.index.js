// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:181986-182127
appModule.controller('tenant.views.crs.contactPaymentFollowups.index', [
        '$scope', 'appSession', 'abp.services.app.contactPaymentFollowup', 'abp.services.app.directory', 'abp.services.app.commonLookup',
        function ($scope, appSession, contactPaymentFollowupService, directoryService, commonLookupService) {
            var vm = this;

            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));

            vm.filters = {
                enableDateRange: false
            };
            vm.dateRangeModel = { };

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.dateRangeModelChanged = function () {
                //vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                //vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');

                vm.filters.startDate = vm.dateRangeModel.startDate;
                vm.filters.endDate = vm.dateRangeModel.endDate;
            };

            vm.dateRangeCheck = function () {
                if (vm.filters.enableDateRange) {
                    vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                if (!vm.filters.enableDateRange) {
                    vm.filters.startDate = null;
                    vm.filters.endDate = null;
                }
            };
            vm.searchUsers = function ($select) {
                if ($select.search == "")
                    return null;
                commonLookupService.searchUsers({ keyword: $select.search }).then(function (response) {
                    vm.users = response.data.items;
                });
            };

            vm.getFollowup = () => {
                vm.isLoading = true;
                contactPaymentFollowupService.getFollowup(vm.filters)
                    .success((data) => {
                        vm.data = data;
                    })
                    .finally(() => {
                        vm.isLoading = false;
                    });
            }

            vm.searchContacts = ($select) => {
                return directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true }).then(function (response) {
                    vm.contacts = response.data.items;
                });
            };

            vm.clearContact = () => {
                vm.filters.contact = null;
                vm.filters.contactId = null;
            };

            vm.clearUser = () => {
                vm.filters.userId = null;
                vm.filters.createdBy = null;
            }

            vm.changeContact = () => {
                vm.filters.contactId = vm.filters.contact.id;
            }

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

            vm.exportToExcelOnSreen = function () {
                let table1 = exportTable('usersInfoTable');
                let table2 = exportTable('followupTable');

                let blob = b64toBlob(btoa(unescape(encodeURIComponent(table1 + table2))), "application/vnd.ms-excel");
                let blobUrl = URL.createObjectURL(blob);

                let a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'contactPaymentFollowup.xls';
                a.click();

            };

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

            function init() {
                vm.dateRangeModelChanged();
            }

            init();
        }
    ]);
