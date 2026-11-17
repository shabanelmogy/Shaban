// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:129349-129729
appModule.controller('tenant.views.crs.accounting.openingBalances.importAssetLoansModal', [
    '$scope', '$uibModalInstance', 'fileName', 'isVehicle', 'abp.services.app.bill', 'FileUploader', '$timeout',
    function ($scope, $uibModalInstance, fileName, isVehicle, billService, fileUploader, $timeout) {

        var vm = this;
        vm.saving = false;
        vm.loading = true;
        vm.isVehicle = isVehicle;
        vm.data = [];
        vm.installmentData = [];
        vm.installmentsByDeal = {};

        // Enhanced statistics
        vm.importedAssetLoans = false;
        vm.totalAssetLoans = 0;
        vm.duplicateAssetLoans = 0;
        vm.errorAssetLoans = 0;
        vm.totalGeneratedAssetLoans = 0;
        vm.currentBatch = 0;
        vm.totalBatches = 0;
        vm.progressPercentage = 0;
        vm.processingStatus = 'idle'; // idle, processing, completed, error
        vm.batchResults = [];

        // Optimal batch size (balance between memory usage and API calls)
        var OPTIMAL_BATCH_SIZE = 5;
        var MAX_CONCURRENT_BATCHES = 1;

        vm.cancel = function () {
            if (vm.importedAssetLoans)
                $uibModalInstance.close();
            else
                $uibModalInstance.dismiss();
        };

        vm.getLocalDate = function (date) {
            if (!date) return "";
            var localTime = moment.utc(date).toDate();
            return moment(localTime).format('YYYY-MM-DD');
        };

        vm.groupInstallmentsByDeal = function () {
            vm.installmentsByDeal = {};

            vm.installmentData.forEach(function (installment) {
                var key = installment.dealNo;
                if (installment.chassisNo && installment.chassisNo.trim() !== "") {
                    key += "_" + installment.chassisNo.trim();
                }

                if (!vm.installmentsByDeal[key]) {
                    vm.installmentsByDeal[key] = [];
                }
                vm.installmentsByDeal[key].push(installment);
            });

            // Sort installments by installmentNo
            Object.keys(vm.installmentsByDeal).forEach(function (key) {
                vm.installmentsByDeal[key].sort(function (a, b) {
                    return a.installmentNo - b.installmentNo;
                });
            });
        };


        // Link installments to asset loans
        vm.linkInstallmentsToAssetLoans = function () {
            vm.data.forEach(function (assetLoan) {
                var key = assetLoan.dealNo;
                var key1 = assetLoan.dealNo;
                if (assetLoan.chassisNo && assetLoan.chassisNo.trim() !== "") {
                    key += "_" + assetLoan.chassisNo.trim();
                }

                if (vm.installmentsByDeal[key]) {
                    assetLoan.hasInstallments = true;
                    assetLoan.installmentCount = vm.installmentsByDeal[key].length;
                    assetLoan.installments = vm.installmentsByDeal[key];
                }
                else if (vm.installmentsByDeal[key1]) {
                    assetLoan.hasInstallments = true;
                    assetLoan.installmentCount = vm.installmentsByDeal[key1].length;
                    assetLoan.installments = vm.installmentsByDeal[key1];
                } else {
                    assetLoan.hasInstallments = false;
                    assetLoan.installmentCount = 0;
                    assetLoan.installments = [];
                }
            });
        };


        function init() {
            vm.loading = true;
            billService.importAssetLoansAndInstallmentsFromExcel(fileName, isVehicle)
                .then(function (response) {
                    var result = response.data;
                    var assetLoans = result.assetLoans || result || [];
                    var installments = result.installments || [];

                    if (assetLoans && assetLoans.length > 0) {
                        assetLoans.forEach(function (x) {
                            x.dateLocal = vm.getLocalDate(x.date);
                            x.hasInstallments = false;
                            x.showInstallments = false;
                            x.status = 'pending'; // pending, processing, success, error, duplicate
                        });
                        vm.data = assetLoans;
                        $scope.$applyAsync();
                    } else {
                        vm.data = [];
                    }

                    if (installments && installments.length > 0) {
                        installments.forEach(function (x) {
                            x.dateLocal = vm.getLocalDate(x.date);
                        });
                        vm.installmentData = installments;
                        vm.groupInstallmentsByDeal();
                        vm.linkInstallmentsToAssetLoans();
                    } else {
                        vm.installmentData = [];
                    }

                })
                .catch(function (response) {
                    abp.message.error(response.data.message || 'Failed to load data');
                    vm.data = [];
                    vm.installmentData = [];
                })
                .finally(function () {
                    vm.loading = false;
                });
        }

        vm.createBatches = function () {
            var batches = [];
            for (var i = 0; i < vm.data.length; i += OPTIMAL_BATCH_SIZE) {
                var batch = vm.data.slice(i, i + OPTIMAL_BATCH_SIZE);

                // Attach installments to each loan in batch
                batch.forEach(function (loan) {
                    var key = loan.dealNo;
                    var key1 = loan.dealNo;
                    if (loan.chassisNo && loan.chassisNo.trim() !== "") {
                        key += "_" + loan.chassisNo.trim();
                    }

                    if (loan.hasInstallments && vm.installmentsByDeal[key]) {
                        loan.installments = vm.installmentsByDeal[key];
                    }
                    else if (loan.hasInstallments && vm.installmentsByDeal[key1]) {
                        loan.installments = vm.installmentsByDeal[key1];
                    }
                    else {
                        loan.installments = [];
                    }
                });

                batches.push(batch);
            }
            return batches;
        };


        // Process single batch with status updates
        vm.processBatch = function (batch, batchIndex) {
            return billService.generateImportedAssetBills(batch)
                .then(function (response) {
                    var data = response.data;
                    vm.updateBatchResults(data, batchIndex);
                    vm.updateOriginalData(data);
                    vm.updateProgress();
                    return data;
                })
                .catch(function (error) {
                    console.error('Batch ' + batchIndex + ' failed:', error);
                    // Mark all items in batch as error
                    batch.forEach(function (item) {
                        item.status = 'error';
                        item.error = error.message || 'Batch processing failed';
                    });
                    vm.updateProgress();
                    throw error;
                });
        };

        // Process batches with controlled concurrency
        vm.processBatchesConcurrently = function (batches) {
            var activeBatches = 0;
            var completedBatches = 0;
            var batchQueue = batches.slice(); // Copy array
            var promises = [];

            function processNextBatch() {
                if (batchQueue.length === 0 || activeBatches >= MAX_CONCURRENT_BATCHES) {
                    return Promise.resolve();
                }

                var batchIndex = batches.length - batchQueue.length;
                var batch = batchQueue.shift();
                activeBatches++;

                // Update UI to show batch is processing
                batch.forEach(function (item) {
                    item.status = 'processing';
                });
                $scope.$applyAsync();

                var promise = vm.processBatch(batch, batchIndex)
                    .finally(function () {
                        activeBatches--;
                        completedBatches++;
                        // Process next batch in queue
                        return processNextBatch();
                    });

                promises.push(promise);

                // Start next batch immediately if under concurrency limit
                return processNextBatch();
            }

            // Start initial batches
            processNextBatch();

            // Return promise that resolves when all batches complete
            return Promise.all(promises);
        };

        // Main generation function - optimized
        vm.generateImportedAssetLoans = function () {
            if (vm.data.length === 0) {
                abp.message.info('No asset loans to process');
                return;
            }

            vm.saving = true;
            vm.processingStatus = 'processing';
            vm.currentBatch = 0;
            vm.progressPercentage = 0;

            // Reset statistics
            vm.totalAssetLoans = vm.data.length;
            vm.duplicateAssetLoans = 0;
            vm.errorAssetLoans = 0;
            vm.totalGeneratedAssetLoans = 0;

            var batches = vm.createBatches();
            vm.totalBatches = batches.length;

            console.log('Processing ' + vm.totalAssetLoans + ' loans in ' + vm.totalBatches + ' batches');

            vm.processBatchesConcurrently(batches)
                .then(function () {
                    vm.processingStatus = 'completed';
                    vm.importedAssetLoans = true;
                    vm.progressPercentage = 100;


                })
                .catch(function (error) {
                    vm.processingStatus = 'error';
                    console.error('Batch processing failed:', error);
                    abp.message.error('Processing failed: ' + (error.message || 'Unknown error'));
                })
                .finally(function () {
                    vm.saving = false;
                    $scope.$applyAsync();
                });
        };

        // Update batch results and statistics
        vm.updateBatchResults = function (data, batchIndex) {
            vm.batchResults[batchIndex] = data;
            vm.currentBatch = batchIndex + 1;

            // Update statistics
            data.forEach(function (item) {
                if (item.error && !item.notesDuplicate) {
                    vm.errorAssetLoans++;
                } else if (item.notesDuplicate) {
                    vm.duplicateAssetLoans++;
                } else if (item.isGenerated) {
                    vm.totalGeneratedAssetLoans++;
                }
            });
        };

        // Update original data with results
        vm.updateOriginalData = function (generatedData) {
            generatedData.forEach(function (generatedLoan) {
                var originalLoan = vm.data.find(function (item) {
                    return item.srNo === generatedLoan.srNo;
                });

                if (originalLoan) {
                    originalLoan.error = generatedLoan.error;
                    originalLoan.notesDuplicate = generatedLoan.notesDuplicate;
                    originalLoan.isGenerated = generatedLoan.isGenerated;
                    originalLoan.generatedId = generatedLoan.generatedId;

                    // Update status
                    if (generatedLoan.error && !generatedLoan.notesDuplicate) {
                        originalLoan.status = 'error';
                    } else if (generatedLoan.notesDuplicate) {
                        originalLoan.status = 'duplicate';
                    } else if (generatedLoan.isGenerated) {
                        originalLoan.status = 'success';
                    }
                }
            });
            $scope.$applyAsync();
        };

        // Update progress
        vm.updateProgress = function () {
            vm.progressPercentage = Math.round((vm.currentBatch / vm.totalBatches) * 100);
            $scope.$applyAsync();
        };

        // Toggle installments dropdown
        vm.toggleInstallments = function (assetLoan) {
            assetLoan.showInstallments = !assetLoan.showInstallments;
        };

        // Helper functions for status display
        vm.getErrorMessage = function (item) {
            if (!item.error) return '';
            return item.error.message || item.error;
        };

        vm.hasError = function (item) {
            return item.status === 'error';
        };

        vm.isDuplicate = function (item) {
            return item.status === 'duplicate';
        };

        vm.isGenerated = function (item) {
            return item.status === 'success';
        };

        vm.isProcessing = function (item) {
            return item.status === 'processing';
        };

        vm.getStatusClass = function (item) {
            switch (item.status) {
                case 'error': return 'text-danger';
                case 'duplicate': return 'text-warning';
                case 'success': return 'text-success';
                case 'processing': return 'text-info';
                default: return 'text-muted';
            }
        };

        vm.getStatusText = function (item) {
            switch (item.status) {
                case 'error': return 'Error';
                case 'duplicate': return 'Duplicate';
                case 'success': return 'Generated';
                case 'processing': return 'Processing...';
                default: return 'Pending';
            }
        };

        vm.getOverallProgress = function () {
            return {
                total: vm.totalAssetLoans,
                processed: vm.totalGeneratedAssetLoans + vm.duplicateAssetLoans + vm.errorAssetLoans,
                percentage: vm.progressPercentage,
                status: vm.processingStatus
            };
        };

        // Initialize
        init();
    }
]);
