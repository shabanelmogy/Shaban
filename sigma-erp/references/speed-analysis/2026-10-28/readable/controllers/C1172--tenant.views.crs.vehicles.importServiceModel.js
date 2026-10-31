// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:309751-309910
appModule.controller('tenant.views.crs.vehicles.importServiceModel', [
        '$scope', '$uibModal', '$uibModalInstance', 'fileName', '$filter', 'abp.services.app.vehicleService', 'abp.services.app.vehicleServiceLog',
    function ($scope, $uibModal, $uibModalInstance, fileName, $filter, vehicleService, vehicleServiceLogService) {
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
            
            vehicleService.importServicesFromExcel(fileName)
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
        var pageSize = 50;

        vm.importedOpeningBalances = false;
        vm.totalServices = 0;
        vm.duplicateOpeningBalance = 0;
        vm.errorServices = 0;
        vm.totalGeneratedServices = 0;
        
        init();
        
        vm.generateImportedServiceLogs = function () {
            
            var servicesToImport = [];
            var startIndex = 1 + ((pageNo - 1) * pageSize);
            var endIndex = pageNo * pageSize;

            if (endIndex > vm.data.length) {
                endIndex = vm.data.length;
            }
            
            var i = 1;
            for (i = startIndex; i <= endIndex; i++) {
                servicesToImport.push(vm.data[i-1]);
            }

        
            if (servicesToImport.length == 0) {
                vm.saving = false;
                vm.importedOpeningBalances = true;
                return;
            }
            
            vm.saving = true;
            vehicleServiceLogService.generateImportedServiceLogs({ workShopMovements: servicesToImport })
                .success(function(data) {
                    vm.generatedService = data;
                    vm.totalServices += data.length;
                    vm.errorServices += (data.length - $filter('filter')(data, {
                        error: null
                    }, true).length);

                    vm.totalGeneratedServices += ($filter('filter')(data, {
                        error: null,
                        notesDuplicate: null,
                    }, true).length);

                    //vm.duplicateOpeningBalance = vm.totalServices - vm.errorServices - vm.totalGeneratedServices;
                    angular.forEach(vm.generatedService, function(generatedTrip) {

                        var foundLines = $filter('filter')(vm.data, {
                            serialNo: generatedTrip.srNo,
                        }, true);
                        if (foundLines.length) {
                            foundLines[0].error = generatedTrip.error;
                            foundLines[0].notesDuplicate = generatedTrip.notesDuplicate;
                            foundLines[0].isGenerated = generatedTrip.isGenerated;

                        }
                    });

                    pageNo += 1;

                    if (vm.generatedService.length > 0)
                        vm.generateImportedServiceLogs();
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

        vm.exportToExcel = function () {
            var tab_text = "<table border='1px'><tr>";
            var textRange; var j = 0;
            var tab1 = document.getElementById('importServiceTable'); // id of table
            for (j = 0 ; j < tab1.rows.length ; j++) {

                tab_text = tab_text;
                tab_text = tab_text + tab1.rows[j].innerHTML.toUpperCase() + "</tr>";
            }
            tab_text = tab_text + "</table>";

            var blob = b64toBlob(btoa(tab_text), "application/vnd.ms-excel");
            var blobUrl = URL.createObjectURL(blob);
            window.open(blobUrl, "_blank");
        }

        function b64toBlob(b64Data, contentType, sliceSize) {
            contentType = contentType || '';
            sliceSize = sliceSize || 512;

            var byteCharacters = atob(b64Data);
            var byteArrays = [];

            for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                var slice = byteCharacters.slice(offset, offset + sliceSize);

                var byteNumbers = new Array(slice.length);
                for (var i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }

                var byteArray = new Uint8Array(byteNumbers);

                byteArrays.push(byteArray);
            }

            var blob = new Blob(byteArrays, { type: contentType });
            return blob;
        }
    }
    ]);
