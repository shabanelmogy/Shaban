// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:66159-66363
appModule.controller('host.views.crm.products.productModuleAndFeatures',
        [
            '$scope', '$uibModalInstance', '$uibModal', 'product', 'abp.services.app.productModule', 'abp.services.app.productVariant', '$sce',
            function ($scope, $uibModalInstance, $uibModal, product, productModuleService, productVariantService, $sce) {
                var vm = this;
                vm.product = product;
                vm.productVariants = []; 
                vm.variantsMap = {}; 

               
                function loadProductVariants() {
                    if (product && product.id) {
                        productVariantService.getProductVariants({ id: product.id })
                            .success(function (result) {
                                vm.productVariants = result;

                               
                                _.forEach(result, function (variant) {
                                    vm.variantsMap[variant.id] = variant.name;
                                });
                            });
                    }
                }
                vm.getVariantName = function (variantId) {
                    return vm.variantsMap[variantId] || '@L("Unknown")';
                };

                
                vm.getCategoryName = function (categoryId) {
                    var categories = {
                        1: 'Standard',
                        2: 'Add_On'
                    };
                    return categories[categoryId] || '';
                };
 

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
                function setupSortable() {
                    $("#moduleTableBody").sortable({
                        handle: ".drag-handle",
                        axis: "y",
                        cursor: "move",
                        opacity: 0.7,
                        update: function (event, ui) {
                            var newOrder = [];

                            $("#moduleTableBody tr").each(function (index) {
                                var id = $(this).data("id");
                                newOrder.push({
                                    id: id,
                                    order: index + 1
                                });

                                // Update in-memory model
                                angular.forEach(vm.productModules, function (module) {
                                    if (module.id === id) {
                                        module.order = index + 1;
                                    }
                                });
                            });

                            // Apply scope changes since we're outside Angular context
                            $scope.$apply();

                            // Save to server
                            productModuleService.updateModuleOrder({
                                moduleOrders: newOrder
                            }).success(function () {
                                abp.notify.success(app.localize('OrderUpdatedSuccessfully') || 'Order updated successfully');
                            });
                        }
                    });
                }

                vm.openProductFeatureModal = function (row) {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/host/views/crm/products/productFeatures.cshtml',
                        controller: 'host.views.crm.products.productFeatures as vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            productModule: function () {
                                return row;
                            }
                        }
                    });
                }

                vm.openCreateOrEditModuleModal = function (row) {
                    if (!row) {
                        row = {
                            productId: product.id,
                            order: vm.productModules ? vm.productModules.length + 1 : 1 // Set initial order for new modules
                        };
                    } else {
                        // Get the full module details for editing
                        productModuleService.getProductModuleForEdit({ id: row.id }).success(function (result) {
                            openModal(result);
                        });
                        return;
                    }
                    openModal(row);
                };

                function openModal(moduleData) {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/host/views/crm/products/createOrEditProductModuleModal.cshtml',
                        controller: 'host.views.crm.products.createOrEditProductModuleModal as vm',
                        backdrop: 'static',
                        resolve: {
                            productModule: function () {
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

                vm.deleteModule = function (row) {
                    abp.message.confirm(
                        app.localize('DeleteWarningMessage'),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                productModuleService.deleteProductModule({ id: row.id }).success(function () {
                                    init();
                                    abp.notify.success(app.localize('SuccessfullyDeleted'));
                                });
                            }
                        }
                    );
                };

                function init() {
                    vm.loading = true;
                    productModuleService.getProductModules({ id: product.id }).success(function (result) {
                        vm.productModules = result;
                        // Setup sortable after data is loaded
                        setTimeout(setupSortable, 100);
                    }).finally(function () {
                        vm.loading = false;
                    });
                }
                loadProductVariants();
                init();
            
            }
        ]);
