// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:75800-75998
appModule.controller('common.views.mergeContacts.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.mergeContact', '$filter', 'FileUploader', 'appSession', 'abp.services.app.directory',
        function ($scope, $uibModal, uiGridConstants, mergeContactService, $filter, fileUploader, appSession, directoryService) {
            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.mergeContactData = [];
            vm.loading = false;
            //vm.contactCategory = null;

           // vm.importPermission = appSession.tenant.tenancyName.toLowerCase() == 'carleaserentacar';
           // vm.importPermission = true;

            vm.permissions = {
               // merge: abp.auth.hasPermission('Pages.Administration.MergeContacts'),
                merge: true,
            };
            vm.contactCategories = [
                { id: 2, name: 'Company' },
                { id: 1, name: 'Person' },

            ];
            //vm.contactCategory = vm.contactCategory == null ? 2 : vm.contactCategory

            vm.removeRow = function (row) {
                var index = vm.mergeContactData.indexOf(row);
                vm.mergeContactData.splice(index, 1);
            };
            vm.filters = {
                keyword: '',
                skipCount: 0,
                maxResultCount: app.consts.grid.defaultPageSize,
                contactCategory: 2
            };

            vm.clearTable = function () {
                vm.mergeContactData = []
            }
            vm.getSelectedContactCategoryName = function () {
                var selectedCategory = vm.contactCategories.find(cat => cat.id === vm.filters.contactCategory);
                return selectedCategory ? selectedCategory.name : '';
            };

            function openCreateOrEditExpenseTypeModal() {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/mergeContacts/searchAddContacts.cshtml',
                    controller: 'common.views.mergeContacts.searchAddContacts as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        contactCategory: function () {
                            return vm.filters.contactCategory;
                        },
                        selectedId: function () {
                        return vm.lead ? vm.lead.company.id : "";
                    },

                    }
                });

                modalInstance.result.then(function (result) {
                    if (result.length > 0) {
                        result.forEach(function (value) {
                            var foundLines = $filter('filter')(vm.mergeContactData, {
                                id: value.id,
                            }, true);
                            if (foundLines.length == 0) {
                                vm.mergeContactData.push(value);
                            }
                        });
                    }
                    //vm.getExpenseTypes();
                });
            }

            vm.searchAddContacts = function () {
                if (vm.mergeContactData.length > 0) {
                    vm.contactCategory = vm.mergeContactData[0].contactCategory;
                }
                openCreateOrEditExpenseTypeModal();
            };

            vm.mergeContacts = function () {
                
                vm.saving = true;
                var listofIds = [];
                listofIds.push({ id: vm.lead.company.id });
                vm.mergeContactData.forEach(function (value) {
                    listofIds.push({ id: value.id });
                });
                mergeContactService.mergeContactsHost({ contacts: listofIds }).success(function () {
                    vm.mergeContactData = [];
                    //vm.contactCategory = null;
                    abp.notify.info(app.localize('SavedSuccessfully'));
                }).finally(function () {
                    vm.saving = false;
                });

            };

            // Import openingBalance Code
            vm.uploader = new fileUploader({
                url: abp.appPath + 'Document/UploadTempFile',
                queueLimit: 1,
                autoUpload: true,
                removeAfterUpload: true,
                filters: [{
                    name: 'filter',
                    fn: function (item, options) {
                        //File type check
                        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                        if ('|vnd.openxmlformats-officedocument.spreadsheetml.sheet|'.indexOf(type) === -1) {
                            abp.message.warn(app.localize('UploadFile_Warn_FileType'));
                            return false;
                        }

                        ////File size check
                        //if (item.size > 5242880 * 5) //5MB
                        //{
                        //    abp.message.warn(app.localize('Document_Warn_SizeLimit'));
                        //    return false;
                        //}

                        return true;
                    }
                }]
            });

            vm.uploader.onSuccessItem = function (fileItem, response, status, headers) {
                vm.importing = true;
                if (response) {
                    var fileName = response.result.fileName;
                    vm.importing = false;
                    openImportMergeContactsModal(fileName);
                }
                else {
                    abp.message.error(response.error.message);
                }
            };
            vm.uploader.onErrorItem = function (response, error, errorMessage) {
                vm.loading = true;
                if (response.isError) {
                    abp.message.error("Error in File Uploading");
                }
            };
            //For Car Rental Changes
            vm.searchContacts = function () {
                if (!vm.filters.keyword) return;
                vm.loading = true;
                return directoryService.searchContactsForMerging(vm.filters)
                    .then(function (response) {
                        vm.data = response.data.items;
                        var result = $filter('filter')(vm.data, true);

                        vm.data.forEach(function (value) {
                            var foundLines = $filter('filter')(vm.mergeContactData, {
                                id: value.id,
                            }, true);
                            if (foundLines.length == 0) {
                                vm.mergeContactData.push(value);
                            }
                        });

                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            };
            vm.searchCompanies = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactCategory: vm.filters.contactCategory}).then(function (response) {
                    vm.companies = response.data.items;
                });
            };

            function openImportMergeContactsModal(fileName) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/mergeContacts/importMergeContactsModal.cshtml',
                    controller: 'common.views.mergeContacts.importMergeContactsModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        fileName: function () {
                            return fileName;
                        },

                    }
                });
                modalInstance.result.then(function () {
                    if (appSession.tenant.tenancyName.toLowerCase() != 'carleaserentacar')
                        initCustomerOpeningBalance();
                    vm.importing = false;
                });
            };

        }
    ]);
