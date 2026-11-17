// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:286438-286612
appModule.controller('tenant.views.reports.tripsWithOvertime.index', [
        '$scope', 'utilities', 'appSession', '$stateParams', '$uibModal', 'abp.services.app.directory', 'abp.services.app.tripsWithOvertime',
        function ($scope, utilities, appSession, $stateParams, $uibModal, directoryService, tripsWithOvertimeService) {
            var vm = this;

            vm.flightDetailEnabled = utilities.parseBoolean(abp.setting.get("App.General.FlightDetailEnabled"));
            vm.customField1Enabled = utilities.parseBoolean(abp.setting.get("App.General.Trip_EnableCustomField1"));
            vm.customField2Enabled = utilities.parseBoolean(abp.setting.get("App.General.Trip_EnableCustomField2"));
            vm.permissions = {
                canViewCharges: abp.auth.hasPermission('Pages.Tenant.Limousine.Trips.CanViewCharges'),
                customerWebApp: abp.auth.hasPermission('Pages.Tenant.Limousine.CustomerWebApp'),
            }
            vm.manualTripNoEnabled = utilities.parseBoolean(abp.setting.get("App.General.ManualTripNoEnabled"));

            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.exportToExcel = function () {
                var tab_text = "<table border='1px'><tr>";
                var textRange;
                var j = 0;
                var tab1 = document.getElementById('tblTripsOvertime'); // id of table
                for (j = 0; j < tab1.rows.length; j++) {

                    tab_text = tab_text;
                    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";

                //var ua = window.navigator.userAgent;
                //var msie = ua.indexOf("MSIE ");

                //if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer

                //{
                //    txtArea1.document.open("txt/html", "replace");
                //    txtArea1.document.write('sep=,\r\n' + tab_text);
                //    txtArea1.document.close();
                //    txtArea1.focus();
                //    sa = txtArea1.document.execCommand("SaveAs", true, "trialBalance.xls");
                //}

                //else {
                //    sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));
                //}
                var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
                var blobUrl = URL.createObjectURL(blob);
                //document.querySelector('a').setAttribute('href', blobUrl);
                //window.open(blobUrl, "_blank");
                // window.location = blobUrl;
                //sa = window.open('data:application/vnd.ms-excel,' + blobUrl);
                //return (sa);

                // New Code 

                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'TripsWithOvertime.xls';
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

            vm.getTripStatus = function (status) {
                if (status == 1)
                    return app.localize("New");
                if (status == 2)
                    return app.localize("Dispatched");
                if (status == 3)
                    return app.localize("Started");
                if (status == 4)
                    return app.localize("Finished");
                if (status == 5)
                    return app.localize("Canceled");
                if (status == 6)
                    return app.localize("NoShow");
                if (status == 7)
                    return app.localize("DriverAccepted");
                if (status == 8)
                    return app.localize("DriverRejected");
                else
                    return '';
            };

            vm.CurrencyFormate = function (amount) {
                if (amount == null) return null;
                return amount.toLocaleString('en');
            };

            // search from dropdown
            vm.searchCustomers = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get staffs
                return directoryService.searchStaff({ keyword: $select.search }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            // extended search using search customer popup
            vm.searchCustomerPopoup = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactStaffModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactStaffModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return null;
                        },
                        type: function () {
                            return $stateParams.contactType;
                        }
                    }
                }).result.then(function (customer) {
                    if (customer != null) {
                        vm.employee = customer;
                    }
                });
            };

            vm.getlocalTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('HH:mm');
                }
                else {
                    return "";
                }
            };

            vm.getOvertimeReport = function () {
                vm.loading = true;
                //console.log(vm.filters.monthYear);
                vm.filters.startDate = moment(vm.filters.monthYear).startOf('month');
                vm.filters.endDate = moment(vm.filters.monthYear).endOf('month').endOf('day');
                vm.filters.employeeId = vm.employee && vm.employee.id? vm.employee.id: null ;
                tripsWithOvertimeService.getTripsWithOvertimeReport(vm.filters).success(function (data) {
                    vm.tripsWithOvertime = data;
                }).finally(function () {
                    vm.loading = false;
                });
            };
        }
    ]);
