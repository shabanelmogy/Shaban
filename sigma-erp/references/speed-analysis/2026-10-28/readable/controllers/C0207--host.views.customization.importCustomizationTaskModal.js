// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:69268-69369
appModule.controller('host.views.customization.importCustomizationTaskModal', [
        '$scope', '$uibModalInstance',
        function ($scope, $uibModalInstance) {
            var vm = this;

            vm.loading = false;
            vm.saving = false;
            vm.selectedFile = null;

            $scope.loadFile = function (files) {  
                vm.saving = false;
                if (files.length > 0) {
                    $scope.$apply(function () {
                        vm.selectedFile = files[0];
                        readFileData();
                    });
                }
            };

            function readFileData() {

                vm.fileDataList = [];
                var file = vm.selectedFile;

                if (file && ['xlsx', 'xls'].indexOf(file.name.split('.').pop().toLowerCase()) > -1) {

                    var reader = new FileReader();
                    vm.loading = true;

                    reader.onload = function (e) {

                        var data = e.target.result;
                        var workbook = XLSX.read(data, { type: 'binary', cellDates: true, cellNF: false, cellText: false });
                        var first_sheet_name = workbook.SheetNames[0];

                        var dataObjects = XLSX.utils.sheet_to_json(workbook.Sheets[first_sheet_name], { raw: true, dateNF: 'MM-DD-YYYY HH:mm:ss' });

                        if (dataObjects.length > 0) {

                            for (var i = 0; i < dataObjects.length; i++) {

                                var value = dataObjects[i];

                                var description = value['Description'];
                                if (!description) {
                                    abp.message.error("Description is missing at record " + (i + 1) + ".", "Error");
                                    vm.fileDataList = [];
                                    break;
                                }

                                var module = value['Module'];
                                var scope = value['Scope'];
                                var estimatedhours = value['Estimated Hours'];

                                var finalDescription = module ? module + " : " + description : description;

                                var item = {
                                    error: '',
                                    description: finalDescription,
                                    scope: scope,
                                    estimatedHours: estimatedhours,
                                };

                                vm.fileDataList.push(item);
                            }

                        } else {
                            abp.message.error("Something Wrong Or File is empty !", "Error");
                        }

                        vm.loading = false;
                        $scope.$apply();
                    };

                    reader.onerror = function (ex) {
                        vm.loading = false;
                        abp.message.warn(
                            app.localize(ex),
                            'Unknown File'
                        );
                    };

                    reader.readAsBinaryString(file);

                } else {
                    abp.message.error("Please select Valid file to upload !", "Unknown File");
                    vm.loading = false;
                }

            }

            vm.save = function () {
                vm.saving = true;
                $uibModalInstance.close(vm.fileDataList);
            };

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

        }
    ]);
