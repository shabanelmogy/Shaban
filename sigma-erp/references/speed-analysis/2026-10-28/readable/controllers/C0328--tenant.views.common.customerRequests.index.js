// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:87320-87500
appModule.controller('tenant.views.common.customerRequests.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.customerRequest', 'appSession', 'abp.services.app.directory',
        function ($scope, $uibModal, uiGridConstants, customerRequestService, appSession, directoryService) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            
            vm.filters = {
                code: '',
                name: '',
                customerId: null,
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };
            vm.filters = {
                status: 1,
                customerId: null,
                startDate: null,
                endDate: null,
                enableDateRange: false,
                code: '',
                name: '',
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
            };
            vm.dateRangeModel = {
                startDate: moment(moment().format('YYYY-MM-DD')).utc(),
                endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc(),
            };
            ////not being used as of now
            //vm.permissions = {
            //    view: abp.auth.hasPermission('Pages.Tenant.CustomerRequests'),
            //    create: abp.auth.hasPermission('Pages.Tenant.CustomerRequests.Addnew'),
            //    edit: abp.auth.hasPermission('Pages.Tenant.CustomerRequests.Edit'),
            //    'delete': abp.auth.hasPermission('Pages.Tenant.CustomerRequests.Delete'),
            //    allActionsOnOtherBranch: abp.auth.hasPermission('Pages.Tenant.Customers.AllActionsOnOtherBranchCustomers'),
            //};

            vm.getStatus = function (id) {
                if (id == 1)
                    return app.localize("Open");
                else if (id == 2)
                    return app.localize("Closed");
                else return '';
            };

            vm.searchCustomers = function ($select) {

                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2 }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };
            vm.getPriority = function (priority) {
                if (priority == 3)
                    return app.localize("High");
                else
                    return "";
            };
            
            vm.clearCustomer = function () {
                vm.filters.customer = null;
                vm.filters.customerId = null;
            };
            // loading Customers

            vm.searchCustomers = function ($select) {

                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, activeOnly: true }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };
            function getStatuses() {
                vm.statuses = [{ id: 1, name: app.localize("Open") }, { id: 2, name: app.localize("Closed") }];
            };
            vm.statusChanged = function () {
                if (vm.filters.status == 1)
                    vm.filters.enableDateRange = false;
                else
                    vm.filters.enableDateRange = true;
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

            vm.getCustomerRequests = function () {
                
                vm.loading = true;
                vm.filters.startDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.endDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                if (vm.filters.customer)
                    vm.filters.customerId = vm.filters.customer.id;
                customerRequestService.getCustomerRequests(vm.filters).success(function (data) {
                    
                    vm.customerRequests = data.items;
                }).finally(function () {
                    vm.loading = false;
                });
                
                //customerRequestService.getRecentClosedCustomerRequests(vm.filters).success(function (data) {
                //    vm.closedCustomerRequests = data.items;
                //}).finally(function () {
                //    vm.loading = false;
                //});
            };
            vm.customerRequestClose = function (request) {
                abp.message.confirm(
                    app.localize('CloseRequestMessage', request.requestNo),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            customerRequestService.closeRequest({
                                id: request.id
                            }).success(function () {
                                vm.getCustomerRequests();
                                abp.notify.success(app.localize('SuccessfullySaved'));
                            });
                        }
                    }
                );
            };
            vm.customerRequestDelete = function (request) {
                abp.message.confirm(
                    app.localize('DeleteRequestMessage', request.requestNo),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            customerRequestService.deleteCustomerRequest({
                                id: request.id
                            }).success(function () {
                                vm.getCustomerRequests();
                                abp.notify.success(app.localize('SuccessfullySaved'));
                            });
                        }
                    }
                );
            };
            function openCreateOrEditCustomerRequestModal(id) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/common/customerRequests/createOrEditModal.cshtml',
                    controller: 'tenant.views.common.customerRequests.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        customerRequestId: function () {
                            return id;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    vm.getCustomerRequests();
                });
            }


            vm.createCustomerRequest = function () {
                openCreateOrEditCustomerRequestModal(null);
            };

            vm.editCustomerRequest = function (CustomerRequest) {
                   
                openCreateOrEditCustomerRequestModal(CustomerRequest.id);
            };

            vm.getCustomerRequests();
            getStatuses();
        }
    ]);
