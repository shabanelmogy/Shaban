// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:78029-78177
appModule.controller('host.views.reports.rRReports.index', [
        '$scope', 'abp.services.app.subscription', 'abp.services.app.commonLookup',
        function ($scope, subscriptionService, commonLookupService) {
            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm.report = [];
            vm.filters = {
                tenantType: 3,
                isActive: 1,
                restrictedTenants: abp.auth.hasPermission('Pages.Tenants.CanLoginRestrictedTenants'),
                asOfDate: moment().endOf('Day')
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

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.exportSubscriptionReport = function () {
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
                a.download = 'SubscriptionReport.xls';
                a.click();

            };

            vm.getSubscriptionTypeName = function (type) {
                if (type == 1) {
                    return "Yearly";
                }
                else if (type == 2) {
                    return "Monthly";
                }
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

            vm.getRRReport = function () {
                vm.loading = true;
                subscriptionService.getRRReport(vm.filters)
                    .success(function (result) {
                        vm.report = result;
                        vm.totalAmount = 0.0;
                        angular.forEach(vm.report, function (row, ind) {
                            if (row.amount > 0) {
                                row.amount = row.subscriptionType == 1 ? row.amount / 12 : row.amount;
                                vm.totalAmount += row.amount;
                            }
                        });
                    }).finally(function () {
                        vm.loading = false;
                    });
            }
            vm.getRRReport();
        }
    ]);
