// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:80628-80794
appModule.controller('host.views.reports.tenantActivity.index', [
        '$scope', 'abp.services.app.tenantActivity', 'abp.services.app.commonLookup',
        function ($scope, tenantActivityService, commonLookupService) {
            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.report = [];
            vm.filters = {
                name: "",
                tenancyName: null,
                editionId: null,
                tenantType: 3,
                CreationTime: null,
                isActive: 1,
                restrictedTenants: abp.auth.hasPermission('Pages.Tenants.CanLoginRestrictedTenants')
            };

            vm.tenantTypes = [

                { type: "Trial", id: 1 },
                { type: "Test", id: 2 },
                { type: "Production", id: 3 },
                { type: "Crn", id: 4 },
                { type: "Support", id: 5 }

            ];

            vm.tenantIsActive = [
                { type: "No", id: 0 },
                { type: "Yes", id: 1 }
            ];

            vm.tenantSignupSources = [
                { type: "Unknown", id: 0 },
                { type: "Web App", id: 1 },
                { type: "Mobile App", id: 2 },
                { type: "Manual", id: 3 }
            ];

            vm.getEditionValue = function (item) {
                return parseInt(item.value);
            };

            vm.getTentantType = function (tenantType) {

                var type = "";
                if (tenantType == 1) {
                    type = "Trial";

                }
                else if (tenantType == 2) {
                    type = "Test";

                }
                else if (tenantType == 3) {
                    type = "Production";

                }
                else if (tenantType == 4) {
                    type = "Crn";
                }
                else if (tenantType == 5) {
                    type = "Support";
                }

                return app.localize(type);
            };

            vm.getSignupSource = function (signupSource) {
                if (signupSource === 0)
                    return "Unknown";
                else if (signupSource === 1)
                    return "WebApp";
                else if (signupSource === 2)
                    return "MobileApp";
                else if (signupSource === 3)
                    return "Manual";
            };

            vm.getEditionsForCombobox = function () {
                commonLookupService.getEditionsForCombobox({}).success(function (result) {
                    vm.editions = result.items;
                    vm.editions.unshift({ value: "0", displayText: app.localize('NotAssigned') });
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.getlocalDateTime = function (date) {

                if (date) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('YYYY-MM-DD');
                }
                else {
                    return "";
                }
            };

            vm.exportTenantActivityReport = function () {
                var tab_text = "<table border='1px'><tr>";
                var textRange;
                var j = 0;
                var tab1 = document.getElementById("tblSubsReport"); // id of table
                for (j = 0; j < tab1.rows.length; j++) {

                    tab_text = tab_text;
                    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";


                var blob = b64toBlob(btoa(unescape(encodeURIComponent(tab_text))), "application/vnd.ms-excel");
                var blobUrl = URL.createObjectURL(blob);


                var a = document.createElement('a');
                a.href = blobUrl;
                a.download = 'TenantActivityReport.xls';
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

            vm.getTenantActivityReport = function () {
                vm.loading = true;
                tenantActivityService.getTenantActivityReport(vm.filters)
                    .success(function (result) {
                        vm.report = result;
                    }).finally(function () {
                        vm.loading = false;
                    });
            }

            vm.getEditionsForCombobox();
            vm.getTenantActivityReport();
        }
    ]);
