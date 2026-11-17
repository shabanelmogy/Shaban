// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:134666-134766
appModule.controller('tenant.views.crs.agreements.agreementDiscountsPeriodWiseModal', ['$scope', '$filter', 'options',
        '$uibModal', '$uibModalInstance', 'abp.services.app.commonAgreement',
        function ($scope, $filter, options, $uibModal, $uibModalInstance, commonAgreementService) {

            var vm = this;

            vm.loading = false;
            vm.agreementNo = options.agreementNo;
            vm.agreementId = options.agreementId;
            vm.settings = null;
            vm.gender = '';
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm A';
            vm.getlocalDateTime = function (date) {
                if (date !== null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };
            if (options.agreementStatus === 2) 
                vm.viewMode = true;
            

            vm.agreementDocuments = [];

            vm.permissions = {
                add: abp.auth.hasPermission('Pages.Tenant.Agreements.AgreementDiscountsPeriodWise.Add'),
                edit: abp.auth.hasPermission('Pages.Tenant.Agreements.AgreementDiscountsPeriodWise.Edit'),
                delete: abp.auth.hasPermission('Pages.Tenant.Agreements.AgreementDiscountsPeriodWise.Delete')
            };

            vm.cancel = function () {
                $uibModalInstance.close();
            };

            function discountObject() {
                var obj = new Object();
                obj.fromDate = null;
                obj.toDate = null;
                obj.discountPercent = null;

                return obj;
            }

            //Add row
            vm.addRow = function () {
                vm.agreementDiscounts.push(discountObject());
            };

            //Remove row
            vm.removeRow = function (obj) {
                var index = vm.agreementDiscounts.indexOf(obj);
                vm.agreementDiscounts.splice(index, 1);

            };

            function init() {
                vm.loading = true;

                commonAgreementService.getPeriodWiseDiscountsByAgreementId({
                    id: options.agreementId
                }).success(function (result) {
                    vm.agreementDiscounts = result;
                    if (vm.agreementDiscounts) {
                        vm.agreementDiscounts.forEach(e => {
                            if (!vm.permissions.edit) {
                                e.disabled = true;
                            }
                        });
                    }

                }).finally(function () {
                    vm.loading = false;
                });

            }
            init();

            vm.save = function () {

                vm.saving = true;
                vm.agreementDiscounts.forEach(e => {
                    e.fromDate = e.fromDate.startOf('day');
                    e.toDate = e.toDate.endOf('day');
                });

                commonAgreementService.createOrUpdateAgreementDiscounts({
                    agreementId: vm.agreementId,
                    agreementDiscounts: vm.agreementDiscounts
                }).success(function () {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close();
                }).finally(function () {
                    vm.saving = false;
                });
            };
        }
    ]);
