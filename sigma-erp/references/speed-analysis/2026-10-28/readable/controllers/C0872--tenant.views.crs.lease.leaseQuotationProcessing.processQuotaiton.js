// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:238023-238141
appModule.controller('tenant.views.crs.lease.leaseQuotationProcessing.processQuotaiton', ['$scope', '$uibModal',   'uiGridConstants', 'abp.services.app.expensePayment',
    function ($scope, $uibModal,  uiGridConstants, expensePaymentService) {

        var vm = this;
        vm.loading = false;
        vm.dateRangeOptions = app.createDateRangePickerOptions();
        vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
        vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
        
        vm.vehicles = [];
        vm.customers = [];
        vm.statuses = [];
        vm.filters = {
            status: 'Open',
            leaseQuotationNo:'Q-1401-00007',
            changedBy: 'Admin',
            detail:null,
            fromDate: null,
            toDate: null,
            inquiryReferenceNo: '2017-10-10 02:30 PM', 
            skipCount: 0,
            maxResultCount: app.consts.grid.defaultPageSize,
        }
        vm.dateRangeModel = {
            startDate: moment(moment().format('YYYY-MM-DD')).utc(),
            endDate: moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc(),
        };

        vm.permissions = {
            create: abp.auth.hasPermission('Pages.Tenant.ExpensePayments.Addnew'),
            edit: abp.auth.hasPermission('Pages.Tenant.ExpensePayments.Edit'),
            'delete': abp.auth.hasPermission('Pages.Tenant.ExpensePayments.Delete'),
        }

        function getStatuses() {
            vm.statuses = [{ id: 1, name: app.localize("Open") }, { id: 2, name: app.localize("Closed") }];
        };

  
 

        // extended search using search contact popup
        vm.searchContactPopoup = function () {
            $uibModal.open({
                templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                backdrop: 'static',
                resolve: {
                    category: function () {
                        return null;
                    },
                    type: function () {
                        return 2;
                    }
                }
            }).result.then(function (customer) {
                if (customer != null) {
                    vm.filters.customer = customer;
                }
            });
        };

        vm.searchVehiclePopup = function openSearchVehicleModal() {
            var modalInstance = $uibModal.open({
                templateUrl: '~/App/tenant/views/crs/vehicles/searchVehicleModal.cshtml',
                controller: 'tenant.views.crs.vehicles.searchVehicleModal as vm',
                backdrop: 'static',
                resolve: {
                    tariffGroup: function () {
                        return null;
                    }
                }
            });

            modalInstance.result.then(function (result) {
                if (result != null) {
                    vm.filters.vehicle = result;

                }
            });
        }

       

        vm.getlocalDateTime = function (date) {
            if (date != null) {
                var localTime = moment.utc(date).toDate();
                return moment(localTime).format('YYYY-MM-DD');
            }
            else {
                return "";
            }
        };

     
 

        vm.enterKeyPress = function (eventOnKeyPress) {
            if (eventOnKeyPress.which === 13) {
                vm.getExpensePayments();
                eventOnKeyPress.preventDefault();
            }
        }

        vm.clearCustomer = function () {
            vm.filters.customer = null;
            vm.filters.customerId = null;
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss();
        };

        function init() {
            
            getStatuses();
        }
        init();
    }]);
