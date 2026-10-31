// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:50769-50928
appModule.controller('host.views.cbs.subscriptionInvoices.generateModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.subscriptionInvoices', 'abp.services.app.tenant', 'utilities', 'abp.services.app.businessDivision',
        function ($scope, $uibModal, $uibModalInstance, subscriptionInvoicesService, tenantAppService, utilities, businessDivisionService) {

            var vm = this;
            vm.all = false;
            vm.genBtn = true;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.asOfDate = moment().endOf('day');
            vm.filters = {
                asOfDate: ""
            }

            vm.getSubscriptionType = function (type) {
                if (type == 1) {
                    return "Yearly";
                }
                else if (type == 2) {
                    return "Monthly";
                }
                else if (type == 3) {
                    return "Quarterly";
                }
            };

            vm.exportToExcel = function () {
                vm.loading = true;
                subscriptionInvoicesService.exportToExcelDueInvoices(vm.filters).success(function (result) {
                    app.downloadTempFile(result);
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.getBusinessName = function (id) {
                return utilities.getDivisionName(id);
            }

            vm.generateBtnOnOff = function () {
                if (vm.invoicesDue == null) {
                    vm.genBtn = true;
                    return false;
                }
                var conditionMet = false;

                angular.forEach(vm.invoicesDue, function (invoiceDue) {
                    if (invoiceDue.generate && invoiceDue.invoiceNo == null) {
                        vm.genBtn = false;
                        conditionMet = true; // Set flag to true when condition is met
                        return; // Stop the iteration
                    }
                });

                if (!conditionMet) {
                    vm.genBtn = true;
                    $scope.$apply();
                }
            };

            //vm.businessName = [
            //    { id: 1, name: "Karzansoft (UAE)", currency: "AED", tax: 0 },
            //    { id: 3, name: "D1 (UAE)", currency: "AED", tax: 0 },
            //    { id: 4, name: "D2 (UK)", currency: "GBP", tax: 0 },
            //    { id: 2, name: "D3 (USA)", currency: "USD", tax: 0 }
            //];
            vm.businessName = utilities.divisionName();
            vm.allBoxTicked = function () {
                if (vm.invoicesDue == null) return;

                angular.forEach(vm.invoicesDue, function (invoiceDue) {
                    if (!invoiceDue.invoiceNo)
                        invoiceDue.generate = vm.all;
                });
                vm.generateBtnOnOff();
            };

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var dateObject = new Date(date);
                    return dateObject.toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
                }
                else {
                    return "";
                }
            };

            vm.searchTenants = function ($select) {
                if ($select.search == "")
                    return null;
                tenantAppService.searchTenants({ filter: $select.search }).then(function (response) {
                    vm.tenants = response.data.items;
                });
            };

            vm.getInvoicesDueToGenerate = function () {
                vm.loading = true;
                
                vm.filters.asOfDate = moment(vm.asOfDate).endOf('day');
                subscriptionInvoicesService.getInvoicesDueToGenerate(vm.filters)
                    .success(function (result) {

                        if (result != null) {

                            vm.invoicesDue = result;
                            vm.generateBtnOnOff();
                        }
                    }).finally(function () {
                        vm.loading = false;
                    });
            };

            vm.getbusinessDivisions = function () {
                vm.loading = true;
                businessDivisionService.getBusinessDivisions().success(function (data) {
                    vm.businessDivisions = data.items
                }).finally(function () {
                    vm.loading = false;
                });
            }

            
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.generate = function () {
                vm.saving = true;
                
                vm.invoicesGenerated = vm.invoicesDue.filter(function (invoice) {
                    return invoice.generate === true && invoice.invoiceNo == null;
                });
                subscriptionInvoicesService.generateInvoice(vm.invoicesGenerated)
                    .success(function (data) {
                        if(data.length>0)
                            abp.notify.info(app.localize('SavedSuccessfully'));
                        angular.forEach(data, function (invoiceDue) {
                            
                            for (var i = 0; i < vm.invoicesDue.length; i++) {
                                if (vm.invoicesDue[i].rowId === invoiceDue.rowId) {
                                    vm.invoicesDue[i].invoiceNo = invoiceDue.invoiceNo;
                                    vm.invoicesDue[i].paymentStatus = invoiceDue.paymentStatus;
                                    break;
                                }
                            }

                        });
                        setTimeout(function () {
                            vm.generateBtnOnOff();
                        }, 500);
                    }).finally(function () {
                        vm.saving = false;
                        
                    });
            };
            vm.getbusinessDivisions();
            //vm.getInvoicesDueToGenerate();
            
        }
    ]);
