// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:398956-399074
appModule.controller('tenant.views.crs.workshopMovements.importWorkShopMovementModel', [
        '$scope', '$uibModal', '$uibModalInstance', 'fileName', '$filter', 'abp.services.app.workshopMovement',
    function ($scope, $uibModal, $uibModalInstance, fileName, $filter, workshopMovementService) {

        var vm = this;
        vm.saving = false;
        
        vm.cancel = function () {
            if (vm.importedOpeningBalances)
                $uibModalInstance.close();
            else
                $uibModalInstance.dismiss();
        };
       
        // extended search using search customer popup
        vm.getlocalDateTime = function (date) {
            if (date != null) {
                var localTime = moment.utc(date).toDate();
                return moment(localTime).format('YYYY-MM-DD HH:mm:ss');
            }
            else {
                return "";
            }
        };

        function init() {
            vm.loading = true;
            workshopMovementService.importFromExcel(fileName)
            .success(function (result) {
                vm.data = result;
            })
            .error(function (response) {
                abp.message.error(response.error);
            })
            .finally(function () {
                vm.importing = false;
                vm.loading = false;
            });
        }

        var pageNo = 1;
        var pageSize = 10;

        vm.importedOpeningBalances = false;
        vm.totalOpeningBalance = 0;
        vm.duplicateOpeningBalance = 0;
        vm.errorOpeningBalance = 0;
        vm.totalGeneratedOpeningBalance = 0;
        
        init();
        
        vm.generateImportedOpeningBalances = function () {
            var balancesToImport = [];
            var startIndex = 1 + ((pageNo - 1) * pageSize);
            var endIndex = pageNo * pageSize;

            if (endIndex > vm.data.length) {
                endIndex = vm.data.length;
            }
            
            var i = 1;
            for (i = startIndex; i <= endIndex; i++) {
                balancesToImport.push(vm.data[i-1]);
            }

        
            if (balancesToImport.length == 0) {
                vm.saving = false;
                vm.importedOpeningBalances = true;
                return;
            }
            
            vm.saving = true;
            workshopMovementService.generateImportedOpeningBalances({ openingBalances: balancesToImport })
                .success(function(data) {
                    vm.generatedOpeningBalance = data;
                    vm.totalOpeningBalance += data.length;
                    vm.errorOpeningBalance += (data.length - $filter('filter')(data, {
                        error: null
                    }, true).length);

                    vm.totalGeneratedOpeningBalance += ($filter('filter')(data, {
                        error: null,
                        notesDuplicate: null,
                    }, true).length);

                    //vm.duplicateOpeningBalance = vm.totalOpeningBalance - vm.errorOpeningBalance - vm.totalGeneratedOpeningBalance;
                    angular.forEach(vm.generatedOpeningBalance, function(generatedTrip) {

                        var foundLines = $filter('filter')(vm.data, {
                            serailNo: generatedTrip.srNo,
                        }, true);
                        if (foundLines.length) {
                            foundLines[0].error = generatedTrip.error;
                            foundLines[0].notesDuplicate = generatedTrip.notesDuplicate;
                            foundLines[0].isGenerated = generatedTrip.isGenerated;

                        }
                    });

                    pageNo += 1;

                    if (vm.generatedOpeningBalance.length > 0)
                        vm.generateImportedOpeningBalances();
                    else {
                        vm.saving = false;
                        vm.importedOpeningBalances = true;
                    }
                    
                }).error(function (response) {
                    abp.message.error(response.error);
                    vm.saving = false;

                }).finally(function () {
                    //vm.saving = false;
                });
        };
    }
    ]);
