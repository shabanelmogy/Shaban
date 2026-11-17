// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:200249-200329
appModule.controller('tenant.views.crs.debtCollection.followupModal', [
        '$scope', '$uibModal', '$uibModalInstance', 'uiGridConstants', 'followupContact', 'abp.services.app.debtCollection',
        function ($scope, $uibModal, $uibModalInstance, uiGridConstants, followupContact, debtCollectionService) {

            var vm = this;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.followupContact = followupContact;
            vm.skipCount = 0;
            var batchSize = 10;
            vm.maxResultCount = batchSize;
            vm.isLoadMoreFollowupsEnabled = true;
            function getfollowups() {
                vm.loading = true;
                if (vm.skipCount == 0)
                    vm.data = [];
                debtCollectionService.getContactPaymentFollowup({ contactId: vm.followupContact.id, skipCount: vm.skipCount, maxResultCount: vm.maxResultCount }).success(function (result) {
                    vm.totalDataCount = result.totalCount;
                    vm.isLoadMoreFollowupsEnabled = batchSize < vm.totalDataCount ? true : false;
                    result.followupsList.forEach(function (record) {
                        vm.data.push(record);
                    });
                }).finally(function () {
                    vm.loading = false;
                });
            }
            vm.loadMoreFollowups = function () {
                vm.skipCount += batchSize;
                if (vm.skipCount < vm.totalDataCount)
                    getfollowups();
                else {
                    vm.isLoadMoreFollowupsEnabled = false;
                    vm.skipCount = 0;
                }
            }
            vm.getlocalDate = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateTimeFormat);
                }
                else {
                    return "";
                }
            };

            vm.addfollowup = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/debtCollection/createFollowupModal.cshtml',
                    controller: 'tenant.views.crs.debtCollection.createFollowupModal as vm',
                    backdrop: 'static',
                    resolve: {
                        followupContact: function () {
                            return vm.followupContact.id;
                        }
                    }
                });
                modalInstance.result.then(function () {
                    getfollowups();
                });
            };

            vm.cancel = function () {
                $uibModalInstance.close();
            };

            function init() {
                getfollowups();
            }
            init();
        }
    ]);
