// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:50355-50616
appModule.controller('host.views.cbs.subscriptionInvoices.changeRequestMilestonesModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.subscriptionInvoices', 'abp.services.app.tenant', 'utilities', 'abp.services.app.businessDivision',
        function ($scope, $uibModal, $uibModalInstance, subscriptionInvoicesService, tenantAppService, utilities, businessDivisionService) {

            var vm = this;
            vm.all = false;
            vm.genBtn = true;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            

            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));

            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc(),
            };

            vm.filters = {
                tenantId: null,
                fromDate: null,
                toDate: null,
                reqNo: null
                
            };
            vm.updateStatus = function (row) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/customization/milestoneStatusModal.cshtml',
                    controller: 'host.views.customization.milestoneStatusModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        milestone: function () {
                            return row;
                        },
                        workspaceId: null
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getChangeRequestsMilestones();
                });
            }
            vm.permissions = {
                status: abp.auth.hasPermission('Pages.CBS.ChangeRequests.Milestones.Status'),
                invoiceStatus: abp.auth.hasPermission('Pages.CBS.ChangeRequests.Milestones.InvoiceStatus'),
                paymentStatus: abp.auth.hasPermission('Pages.CBS.ChangeRequests.Milestones.PaymentStatus')
            };
            vm.updateInvoiceStatus = function (row) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/customization/milestoneInvoiceStatusModal.cshtml',
                    controller: 'host.views.customization.milestoneInvoiceStatusModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        milestone: function () {
                            return row;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getChangeRequestsMilestones();

                });
            }
            vm.updatePaymentStatus = function (row) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/customization/milestonePaymentStatusModal.cshtml',
                    controller: 'host.views.customization.milestonePaymentStatusModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        milestone: function () {
                            return row;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getChangeRequestsMilestones();

                });
            }
            vm.dateRangeCheck = function () {

                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format(abp.setting.get("App.General.DateFormat"))).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format(abp.setting.get("App.General.DateFormat"))).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                else {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }
            };

            vm.dateRangeModelChange = function () {
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment().add(-29, 'days').startOf('day');
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment().endOf('day');
            };

            
            vm.generateBtnOnOff = function () {
                if (vm.milestones == null) {
                    vm.genBtn = true;
                    return false;
                }
                var conditionMet = false;

                angular.forEach(vm.milestones, function (milestone) {
                    if (milestone.generate && milestone.invoiceNo == null) {
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

            vm.allBoxTicked = function () {
                if (vm.milestones == null) return;

                angular.forEach(vm.milestones, function (milestone) {
                    if (!milestone.invoiceNo)
                        milestone.generate = vm.all;
                });
                vm.generateBtnOnOff();
            };

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('DD-MMM-YY');
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

            vm.getChangeRequestsMilestones= function () {
                vm.loading = true;
                if (vm.filters.enableDateRange) {
                    vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                    vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                }
                else {
                    vm.filters.fromDate = null;
                    vm.filters.toDate = null;
                }

                subscriptionInvoicesService.getChangeRequestsMilestones(vm.filters)
                    .success(function (result) {

                        if (result != null) {

                            vm.milestones = result;
                            //vm.generateBtnOnOff();
                        }
                    }).finally(function () {
                        vm.loading = false;
                    });
            };


            
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.generate = function () {
                vm.saving = true;

                vm.invoicesGenerated = vm.milestones.filter(function (milestone) {
                    return milestone.generate === true && milestone.invoiceNo == null;
                });
                subscriptionInvoicesService.invoiceGenerateChangeRequestMilestones(vm.invoicesGenerated)
                    .success(function (data) {
                        if(data.length>0)
                            abp.notify.info(app.localize('SavedSuccessfully'));
                        angular.forEach(data, function (milestone) {
                            
                            for (var i = 0; i < vm.milestones.length; i++) {
                                if (vm.milestones[i].id === milestone.id) {
                                    vm.milestones[i].invoiceNo = milestone.invoiceNo;
                                    vm.milestones[i].invoiceStatus = 2;
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

            vm.getMilestoneStatus = function (id) {
                if (id == 1) {
                    return "Open";
                }
                else if (id == 2) {
                    return "Complete";
                }
                else if (id == 3) {
                    return "Delivered";
                }

            }
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('DD-MMM-YY');
                }
                else {
                    return "";
                }
            };

            vm.getPaymentMilestoneStatus = function (id) {
                if (id == 1) {
                    return "Pending";
                }
                else if (id == 2) {
                    return "Received";
                }

            }

            vm.getInvoiceStatus = function (id) {
                if (id == 1) {
                    return "Not-Invoiced";
                }
                else if (id == 2) {
                    return "Invoiced";
                }

            }
            //vm.getbusinessDivisions();
            //vm.getInvoicesDueToGenerate();
            //vm.getChangeRequestsMilestones();
        }
    ]);
