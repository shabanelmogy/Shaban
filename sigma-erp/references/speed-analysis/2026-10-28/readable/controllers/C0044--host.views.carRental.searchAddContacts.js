// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:30639-30713
appModule.controller('host.views.carRental.searchAddContacts',
        ['$scope', '$uibModal', '$uibModalInstance', 'abp.services.app.directory', 'abp.services.app.tariffGroup', 'uiGridConstants', '$filter', 'abp.services.app.carRental',
            function ($scope, $uibModal, $uibModalInstance, directoryService, tariffGroupService, uiGridConstants, $filter, carRentalService) {
                var vm = this;
                vm.data = [];
                var foundLines = "";
                vm.contactCategory = 'Company';
                vm.filters = {
                    keyword: '',
                    skipCount: 0,
                    maxResultCount: app.consts.grid.defaultPageSize,
                    contactCategory: "Company"
                };
                vm.contactCategories = [
                    { id: 2, name: 'Company' },
                    { id: 1, name: 'Person' },

                ];
                vm.filters.contactCategory = "Company"
                vm.searchContacts = function () {
                    if (!vm.filters.keyword) return;
                    vm.loading = true;
                    return directoryService.searchContactsForMerging(vm.filters)
                        .then(function (response) {
                            vm.data = response.data.items.filter(function (item) {
                                return item.carRentalId === null;
                            });
                        })
                        .finally(function () {
                            vm.loading = false;
                        });
                };
                vm.cancel = function () {
                    $uibModalInstance.dismiss();
                };
                vm.save = function () {
                    if (vm.data.length === 0) return;
                    foundLines = $filter('filter')(vm.data, {selected: true, }, true);
                    var companyDataArray = [];
                    for (var i = 0; i < foundLines.length; i++) {
                        var companyData = {
                            speedId: foundLines[i].id,
                            name: foundLines[i].companyName,
                            tagline: "",
                            phone: foundLines[i].contactNo,
                            email: foundLines[i].email,
                            address: foundLines[i].address,
                            isFeatured: false
                        };
                        companyDataArray.push(companyData);
                    }
                    carRentalService.addMultipleCompanies(companyDataArray)
                        .then(function (result) {
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            console.log(result.data.length)
                            console.log(result.data[0].speedId)
                            try {
                                for (var i = 0; i < result.data.length; i++) {
                                    directoryService.updatePublishedEntity(result.data[i].speedId, result.data[i]._id)
                                }
                            }
                            catch (err) {
                                abp.notify.error(app.localize('ErrorWhileSaving' + err));
                            }
                            $uibModalInstance.close();
                        })
                        .catch(function (error) {
                            console.error('Error:', error);
                            abp.notify.error(app.localize('ErrorWhileSaving'));
                        })
                        .finally(function () {
                            vm.saving = false;
                        });
                };
            }]);
