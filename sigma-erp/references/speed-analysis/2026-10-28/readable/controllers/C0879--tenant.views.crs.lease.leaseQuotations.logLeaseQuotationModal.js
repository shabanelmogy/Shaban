// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:240566-240633
appModule.controller('tenant.views.crs.lease.leaseQuotations.logLeaseQuotationModal', ['$scope', '$uibModal', '$uibModalInstance', 'uiGridConstants', 'leaseQuotation',
    function ($scope, $uibModal, $uibModalInstance, uiGridConstants, leaseQuotation) {

        var vm = this;
        vm.loading = false;
        vm.dateRangeOptions = app.createDateRangePickerOptions();
        vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
        vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
        vm.leaseQuotation = leaseQuotation;
        vm.leaseQuotation.status = "Open";
        vm.vehicles = [];
        vm.customers = [];
        vm.statuses = [];
        vm.quotationHistory = [
            {
                date: moment(),
                updatedBy: "Abdulhameed Al Sayegh",
                detail: "Quotation Revised",
                status:"Open",
            },
            {
                date: moment().add(1,'days'),
                updatedBy: "Celia Maria Esteves",
                detail: "Status Changed To internally Approved",
                status: "Internally Approved",
            },
            {
                date: moment().add(2, 'days'),
                updatedBy: "Mohammed Al Shahrani",
                detail: "Status Changed To Approved",
                status: "Approved",
            },
            {
                date: moment().add(3, 'days'),
                updatedBy: "Mr. Mohamed Abdiaziz Ismail",
                detail: "Status Changed To Closed",
                status: "Closed",
            }
        ];

        vm.permissions = {
            create: abp.auth.hasPermission('Pages.Tenant.ExpensePayments.Addnew'),
            edit: abp.auth.hasPermission('Pages.Tenant.ExpensePayments.Edit'),
            'delete': abp.auth.hasPermission('Pages.Tenant.ExpensePayments.Delete'),
        };
        vm.cancel = function () {
            $uibModalInstance.dismiss();
        };

        function getStatuses() {
            vm.statuses = [{ id: 1, name: "Open" }, { id: 2, name: "Internally Approved" }, { id: 3, name: "Approved" }, { id: 4, name: "Closed" }];
        };

        vm.getlocalDateTime = function (date) {
            if (date != null) {
                var localTime = moment.utc(date).toDate();
                return moment(localTime).format('YYYY-MM-DD HH:mm');
            }
            else {
                return "";
            }
        };
        function init() {

            getStatuses();
        }
        init();
    }]);
