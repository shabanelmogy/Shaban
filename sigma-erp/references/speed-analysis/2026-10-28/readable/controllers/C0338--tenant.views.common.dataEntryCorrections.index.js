// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:88586-88738
appModule.controller('tenant.views.common.dataEntryCorrections.index', [
        '$scope', '$uibModal', 'abp.services.app.dataEntryCorrection', 'abp.services.app.customerCareTenant',
        function ($scope, $uibModal, dataEntryCorrectionService, customerCareTenantService) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;

            vm.getStatus = function (id) {
                if (id == 1)
                    return app.localize("Open");
                else if (id == 2)
                    return app.localize("Closed");
                else return '';
            };


            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('DD-MMM-YY');
                }
                else {
                    return "";
                }
            };

            vm.getPriority = function (priority) {
                if (priority == 3)
                    return app.localize("High");
                else
                    return "";
            };
            
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

            vm.getDataEntryCorrections = function () {
                vm.loading = true;
                customerCareTenantService.getOpenDataEntryCorrections().success(function (data) {
                    vm.openDataEntryCorrections = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
                
                customerCareTenantService.getRecentClosedDataEntryCorrections(vm.filters).success(function (data) {
                    vm.closedDataEntryCorrections = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            function openCreateOrEditDataEntryCorrectionsModal(id) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/dataEntryCorrections/createOrEditModal.cshtml',
                    controller: 'tenant.views.common.dataEntryCorrections.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        entryId: function () {
                            return id;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getDataEntryCorrections();
                });
            }

            vm.openDataEntryCorrectionsLogModal = function (row) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/dataEntryCorrections/createOrShowDataEntryLogsModal.cshtml',
                    controller: 'tenant.views.dataEntryCorrections.createOrShowDataEntryLogsModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        dataEntry: function () {
                            return row;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getDataEntryCorrections();
                });
            }


            vm.exportToExcel = function () {
                var tab_text = "<h1>Open Data Entry Corrections</h1>"
                tab_text = tab_text + "<table border='1px'><tr>";
                var tab1 = document.getElementById('openDeC'); // id of table 
                var tab2 = document.getElementById('closeDeC'); // id of table 
                for (j = 0 ; j < tab1.rows.length ; j++) {
                    tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
                }

                tab_text = tab_text + "</table>";
                tab_text = tab_text + "<br/>";
                tab_text = tab_text + "<h1>Closed Data Entry Corrections</h1>";
                tab_text = tab_text + "<table border='1px'><tr>";
                for (j = 0 ; j < tab2.rows.length ; j++) {
                    tab_text = tab_text;
                    tab_text = tab_text + tab2.rows[j].innerHTML.toUpperCase() + "</tr>";
                }
                tab_text = tab_text + "</table>";
                tab_text = tab_text + "<br/>";
                var ua = window.navigator.userAgent;
                var msie = ua.indexOf("MSIE ");
                if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
                {
                    txtArea1.document.open("txt/html", "replace");
                    txtArea1.document.write('sep=,\r\n' + tab_text);
                    txtArea1.document.close();
                    txtArea1.focus();
                    sa = txtArea1.document.execCommand("SaveAs", true, "report.xls");
                }
                else {
                    sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));
                }
                return (sa);
            }



            vm.createSupportRequest = function () {
                openCreateOrEditDataEntryCorrectionsModal(null);
            };

            vm.editSupportRequest = function (supportRequest) {
                   
                openCreateOrEditDataEntryCorrectionsModal(supportRequest.id);
            };

            vm.getDataEntryCorrections();

        }
    ]);
