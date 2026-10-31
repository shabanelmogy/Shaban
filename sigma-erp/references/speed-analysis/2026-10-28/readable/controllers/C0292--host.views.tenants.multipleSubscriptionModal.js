// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:83517-83713
appModule.controller('host.views.tenants.multipleSubscriptionModal', [
        '$scope', 'utilities', '$uibModalInstance', '$uibModal', 'abp.services.app.subscription', 'abp.services.app.packages', 'abp.services.app.hostProduct', 'abp.services.app.productVariant', 'abp.services.app.currency', 'tenant', 'abp.services.app.businessDivision',
        function ($scope, utilities, $uibModalInstance, $uibModal, subscriptionService, packagesAppService, productService, productVariantService, currencyService, tenant, businessDivisionService) {
            var vm = this;
            vm.tenant = tenant;
            vm.addSubscription = function (tenant,subscriptionId) {
                var modalInstance= $uibModal.open({
                    templateUrl: '~/App/host/views/tenants/subscriptionModal.cshtml',
                    controller: 'host.views.tenants.subscriptionModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        tenant: function () {
                            return tenant;
                        },
                        subscriptionId: subscriptionId
                    }
                });
                modalInstance.result.then(function (result) {
                    init();
                });
            };

            vm.permissions = {
                canUpdateSubscription: abp.auth.hasPermission('Pages.Tenants.Subscription.Update'),
                canViewSubscription: abp.auth.hasPermission('Pages.Tenants.Subscription.View'),
                canDeleteSubscription: abp.auth.hasPermission('Pages.Tenants.Subscription.Delete'),
                canCreateSubscription: abp.auth.hasPermission('Pages.Tenants.Subscription.Create')
            };

            vm.getSubscriptionTypeName = function (type) {
                if (type == 1) {
                    return "Yearly";
                }
                else if (type == 2) {
                    return "Monthly";
                }
                else if (type == 3) {
                    return "Quarterly";
                }
                else if (type == 4) {
                    return "6 Monthly";
                }
            }

            vm.getBillingStatus = function (id) {
                if (id == 1) {
                    return "On";
                }
                else if (id == 2) {
                    return "Off";
                }
                else if (id == 3) {
                    return "Paused";
                }
                else if (id == 4) {
                    return "Canceled";
                }
            }


            vm.getBusinessCurrency = function (id) {
                if (id == 1) {
                    return "AED";
                }
                else if (id == 2) {
                    return "USD";
                }
                else if (id == 3) {
                    return "AED";
                }
                else if (id == 4) {
                    return "GBP";
                }
            }

            vm.deleteSubscription = function (id) {
                abp.message.confirm(
                    app.localize('YesDelete'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            subscriptionService.deleteSubscription({
                                id: id
                            }).success(function () {
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                                init();
                            });
                        }
                    }
                );
            };
            //vm.getBusinessName = function (id) {
            //    if (id == 1) {
            //        return "Karzan Soft (UAE)";
            //    }
            //    else if (id == 3) {
            //        return "D1 (UAE)";
            //    }
            //    else if (id == 2) {
            //        return "D3 (USA)";
            //    }
            //    else if (id == 4) {
            //        return "D2 (UK)";
            //    }
            //}
            vm.getBusinessName = function (id) {
                return vm.businessDivisions.find(x => x.id === id).code;
            }
            vm.getbusinessDivisions = function () {
                vm.loading = true;
                businessDivisionService.getBusinessDivisions().success(function (data) {
                    vm.businessDivisions = data.items
                }).finally(function () {
                    vm.loading = false;
                });
            }
            vm.viewSubscriptions = function (tenant,subscriptionId) {
                $uibModal.open({
                    templateUrl: '~/App/host/views/tenants/subscriptionViewModal.cshtml',
                    controller: 'host.views.tenants.subscriptionModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        tenant: function () {
                            return tenant;
                        },
                        subscriptionId: subscriptionId
                    }
                });
            };

            vm.subscriptionLog = function (row) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/tenants/subscriptionLog.cshtml',
                    controller: 'host.views.tenants.subscriptionLog as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        subscription: function () {
                            return row;
                        }

                    }
                });
               
            };

            vm.updateBillingStatus = function (row) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/tenants/updateSubscriptionBillingStatusModal.cshtml',
                    controller: 'host.views.tenants.updateSubscriptionBillingStatusModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        subscription: function () {
                            return row;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    init();
                });
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
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
            function init() {
                
                vm.loading = true;
                subscriptionService.getMultipleSubscriptions({ id: vm.tenant.id })
                    .success(function (result) {
                        
                        if (result != null) {
                            
                            vm.multipleSubscription = result;
                            
                        }
                    }).finally(function () {
                        vm.loading = false;
                    });
            }
            vm.getbusinessDivisions();
            init();
        }
    ]);
