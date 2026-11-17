// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:65988-66156
appModule.controller('host.views.crm.products.productFeatures',
        [
            '$scope', '$uibModalInstance', '$uibModal', 'productModule', 'abp.services.app.productModuleFeature','$sce',
            function ($scope, $uibModalInstance, $uibModal, productModule, productModuleFeatureService, $sce) {
                var vm = this;
                vm.productModule = productModule;

                // Initialize showdown converter if available
                var showdownConverter = (typeof showdown !== 'undefined' && typeof showdown.Converter === 'function') ?
                    new showdown.Converter() : {
                        makeHtml: function (markdown) {
                            // Basic Markdown to HTML conversion fallback
                            if (!markdown) return '';

                            return markdown
                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
                                .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
                                .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
                                .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
                                .replace(/^- (.*?)$/gm, '<ul><li>$1</li></ul>')
                                .replace(/^(\d+)\. (.*?)$/gm, '<ol><li>$2</li></ol>')
                                .replace(/\n\n/g, '</p><p>')
                                .replace(/\n/g, '<br>');
                        }
                    };

                // Count words in a text
                vm.countWords = function (text) {
                    if (!text) return 0;
                    return text.trim().split(/\s+/).length;
                };

                // Check if text needs to be truncated
                vm.isTextTruncated = function (text) {
                    return vm.countWords(text) > 50;
                };

                // Truncate text to specified word limit
                vm.truncateText = function (text, wordLimit) {
                    if (!text || vm.countWords(text) <= wordLimit) return text;

                    var words = text.trim().split(/\s+/);
                    return words.slice(0, wordLimit).join(' ') + '...';
                };

                // Format detail text for display - handle markdown and truncation
                vm.getFormattedDetailText = function (text) {
                    if (!text) return $sce.trustAsHtml('');

                    // First truncate if needed
                    var processedText = vm.truncateText(text, 50);

                    // Then convert markdown to HTML
                    var htmlContent = showdownConverter.makeHtml(processedText);

                    // Return trusted HTML for Angular binding
                    return $sce.trustAsHtml(htmlContent);
                };
                // Function to update module order after drag and drop
                // Fix for the sortable function in productFeatures controller
                function setupSortable() {
                    $("#featureTableBody").sortable({
                        handle: ".drag-handle",
                        axis: "y",
                        cursor: "move",
                        opacity: 0.7,
                        update: function (event, ui) {
                            var newOrder = [];

                            // FIXED: Changed from moduleTableBody to featureTableBody
                            $("#featureTableBody tr").each(function (index) {
                                var id = $(this).data("id");
                                newOrder.push({
                                    id: id,
                                    order: index + 1
                                });

                                // Update in-memory model
                                angular.forEach(vm.productModuleFeatures, function (feature) {
                                    if (feature.id === id) {
                                        feature.order = index + 1;
                                    }
                                });
                            });

                            // Only proceed if we have valid items to update
                            if (newOrder.length > 0) {
                                // Apply scope changes since we're outside Angular context
                                $scope.$apply();

                                // Save to server
                                productModuleFeatureService.updateModuleFeatureOrder({
                                    moduleFeatureOrders: newOrder
                                }).success(function () {
                                    abp.notify.success(app.localize('OrderUpdatedSuccessfully') || 'Order updated successfully');
                                });
                            }
                        }
                    });
                }

                vm.openCreateOrEditFeatureModal = function (row) {
                        if (!row) {
                            row = {
                                productModuleId: productModule.id,
                                order: vm.productModuleFeatures ? vm.productModuleFeatures.length + 1 : 1 // Set initial order for new modules
                            };
                        } else {
                            // Get the full module details for editing
                            productModuleFeatureService.getProductModuleFeatureForEdit({ id: row.id }).success(function (result) {
                                openModal(result);
                            });
                            return;
                        }
                        openModal(row);
                    };

                    function openModal(moduleData) {
                        var modalInstance = $uibModal.open({
                            templateUrl: '~/App/host/views/crm/products/createOrEditProductFeatureModal.cshtml',
                            controller: 'host.views.crm.products.createOrEditProductFeatureModal as vm',
                            backdrop: 'static',
                            resolve: {
                                productModuleFeature: function () {
                                    return moduleData;
                                }
                            }
                        });
                        modalInstance.result.then(function () {
                            init();
                        });
                    }


                    vm.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };

                vm.deleteFeature = function (row) {
                    abp.message.confirm(
                        app.localize('DeleteWarningMessage'),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                productModuleFeatureService.deleteProductModuleFeature({ id: row.id }).success(function () {
                                    // Make sure the init function is refreshing the list correctly
                                    init();
                                    abp.notify.success(app.localize('SuccessfullyDeleted'));
                                });
                            }
                        }
                    );
                };

                    function init() {
                        vm.loading = true;
                        productModuleFeatureService.getProductModuleFeatures({ id: productModule.id }).success(function (result) {
                            vm.productModuleFeatures = result;
                            // Setup sortable after data is loaded
                            setTimeout(setupSortable, 100);
                        }).finally(function () {
                            vm.loading = false;
                        });
                    }
                    init();

            }
        ]);
