// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:202566-202749
appModule.controller('tenant.views.crs.emailOutStanding.index', [
        '$scope', 'abp.services.app.statementOfAccounts', 'abp.services.app.statementOfAccountEmail', 'utilities', 'abp.services.app.directory', 'appSession', '$stateParams', '$uibModal',
        function ($scope, statementOfAccountsService, statementOfAccountEmailService, utilities, directoryService, appSession, $stateParams, $uibModal) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.loading = false;

            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeOptions.max = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));
            vm.dateRangeOptions.maxDate = moment().add(3, 'year').format(abp.setting.get("App.General.DateFormat"));

            var sendEmailPerBatch = 3;
            var sendEmailList = null;
            var isCurrentBranchCustomersOnlyEnabled = utilities.parseBoolean(abp.setting.get("App.General.GetSOAofOnlyCurrentBranchCustomers"));
            vm.emailQueuedCount = 0;
            vm.emailNotQueuedCount = 0;
            vm.contactCategories = [{ id: 1, name: app.localize('Individuals') }, { id: 2, name: app.localize('Companies') }];

            vm.filters = {
                agreementNo: null,
                contactCategory: null,
                fromDate: null,
                toDate: null,


            };

            vm.dateRangeModel = {
                startDate: null,
                endDate: null,
            };

            vm.emailAllChange = function () {
                vm.data.filter(e => e.email).forEach(function (row) {
                    row.emailChecked = vm.emailAll;
                });
            };


            vm.dateRangeModelChanged = function () {
                vm.filters.startDate = vm.dateRangeModel.startDate;
                vm.filters.endDate = vm.dateRangeModel.endDate;
            };

            vm.searchCustomers = function ($select) {
                var filterLocationId = isCurrentBranchCustomersOnlyEnabled ? appSession.user.locationId : null;
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: $stateParams.contactType, locationId: filterLocationId }).then(function (response) {
                    vm.customers = response.data.items;
                });
            };

            vm.searchCustomerPopoup = function () {
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/contacts/searchContactModal.cshtml',
                    controller: 'tenant.views.crs.contacts.searchContactModal as vm',
                    backdrop: 'static',
                    resolve: {
                        category: function () {
                            return null;
                        },
                        type: function () {
                            return $stateParams.contactType;
                        }
                    }
                }).result.then(function (customer) {
                    if (customer != null) {
                        vm.filters.customer = customer;
                    }
                });
            };

            vm.sendEmail = function () {
                var emailToSend = [];
                var i = 1;

                angular.forEach(vm.data, function (emailDue) {
                    if (emailDue.emailChecked && emailDue.email && emailDue.message == null && i <= sendEmailPerBatch) {
                        emailToSend.push(emailDue);
                        i += 1;
                    }
                });

                if (emailToSend.length == 0) {
                    vm.saving = false;
                    return;
                }

                vm.saving = true;

                statementOfAccountEmailService.emailStatementOfAccounts({
                    emailData: emailToSend,
                    fromDate: vm.filters.fromDate,
                    toDate: vm.filters.toDate,
                    agreementNo: vm.filters.agreementNo
                }).success(function (result) {
                    sendEmailList = result.emailData;
                    vm.data.forEach(function (dataRow) {
                        var updateRow = sendEmailList.filter(e => e.contactId == dataRow.contactId)[0];
                        if (updateRow) {
                            dataRow.message = updateRow.message;
                            dataRow.emailQueued = updateRow.emailQueued;
                            updateRow.emailQueued ? vm.emailQueuedCount++ : vm.emailNotQueuedCount++;
                        }
                    });

                    if (sendEmailList.length > 0)
                        vm.sendEmail();
                    else
                        vm.saving = false;

                }).error(function (response) {
                    abp.message.error(response.error);
                    vm.saving = false;

                }).finally(function () {

                })

            };

            //vm.sendEmail = function () {
            //    vm.loading = true;
            //    if (!(vm.data.filter(row => row.email && row.emailChecked).length > 0)) {
            //        vm.loading = false;
            //        return;
            //    }
            //    var emailData = vm.data.filter(row => row.email && row.emailChecked);
            //    statementOfAccountEmailService.emailStatementOfAccounts({
            //        //emailData: vm.data.filter(row => row.email && row.emailChecked),
            //        emailData: emailData,
            //        fromDate: vm.filters.fromDate,
            //        toDate: vm.filters.toDate,
            //        agreementNo:vm.filters.agreementNo
            //    }).success(function (result) {
            //        vm.data.forEach(function (dataRow) {
            //            var updateRow = result.emailData.filter(e => e.contactId == dataRow.contactId)[0];
            //            if (updateRow)
            //                dataRow.message = updateRow.message;
            //        });
            //        //vm.data = result.emailData;

            //        vm.loading = false;
            //    }).finally(function () {
            //        vm.loading = false;
            //    })
            //};



            vm.getEmailOutStandingsData = function () {

                vm.loading = true;
                vm.emailQueuedCount = 0;
                vm.emailNotQueuedCount = 0;
                vm.filters.fromDate = vm.dateRangeModel.startDate != null ? vm.dateRangeModel.startDate : moment(moment().format('YYYY-MM-DD')).utc();
                vm.filters.toDate = vm.dateRangeModel.endDate != null ? vm.dateRangeModel.endDate : moment(moment().format('YYYY-MM-DD')).add(1, 'days').add(-1, 'milliseconds').utc();
                if (vm.filters.customer) {
                    vm.filters.customerId = vm.filters.customer.id;
                }
                statementOfAccountsService.getEmailOutStandingsData(vm.filters).success(function (result) {
                    vm.data = result;
                    vm.emailAll = false;
                }).finally(function () {
                    vm.loading = false;
                });


            };

            vm.getSelectedEmailCount = function () {
                if (vm.data)
                    return vm.data.filter(e => e.email && e.emailChecked).length;
                else
                    return 0;

            };

        }
    ]);
