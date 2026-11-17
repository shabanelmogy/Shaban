// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:182236-182377
appModule.controller('tenant.views.crs.contact.alert', [
        '$scope', 'abp.services.app.person',
        function ($scope, personService) {

            var vm = this;

            vm.dateFormat = abp.setting.get("App.General.DateFormat");

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
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
            vm.getIdentificationDocumentType = function (id) {

                if (id == 1)
                    return app.localize('TradeLicense');
                else if (id == 2)
                    return app.localize('Passport');
                else if (id == 3)
                    return app.localize('NationalId');
                else if (id == 4)
                    return app.localize('DrivingLicense');
                else if (id == 5)
                    return app.localize('OtherDocument');
                else if (id == 6)
                    return app.localize('PersonDocument1');
                else if (id == 7)
                    return app.localize('HealthCard');
                else if (id == 8)
                    return app.localize('Visa');
                else if (id == 99)
                    return app.localize('CreditCard');
                else
                    return "";
            };
            vm.getContactCategory = function (row) {
                if (row.contactType == 6) { // corporate driver
                    return app.localize('CorporateDriver');
                }
                if (row.contactCategory == 1)
                    return app.localize('Individual');
                else if (row.contactCategory == 2)
                    return app.localize('Company');
                else
                    return "";
            };
            vm.exportToExcel = function () {
                var tab_text = "<table border='1px'><tr>";
                var textRange;
                var j = 0;
                var tab1 = document.getElementById('alertsTable'); // id of table
                for (j = 0; j < tab1.rows.length; j++) {

                    tab_text = tab_text;
                    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";

                var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
                var blobUrl = URL.createObjectURL(blob);

                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'Alerts.xls';
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
            vm.getcustomerswithexpireddocuments = function () {
                vm.loading = true;
                personService.getCustomersByExpiredDocuments().success(function (result) {
                    vm.contacts = result.items;
                    angular.forEach(vm.contacts, function (contact, key) {
                        angular.forEach(contact.creditCards, function (card, key) {

                            var line = new Object();
                            line.documentNo = '****' + card.cardNoLastFourDigits;
                            line.expiryDate = card.expiry;
                            line.identityDocumentType = 99;

                            if (contact.identityDocuments)
                                contact.identityDocuments.push(line);
                            else
                            {
                                contact.identityDocuments = [];
                                contact.identityDocuments.push(line);
                            }

                        });
                        
                    });



                }).finally(function () {
                    vm.loading = false;
                });
            };

            function init() {
                vm.getcustomerswithexpireddocuments();
            }

            init();
        }
    ]);
