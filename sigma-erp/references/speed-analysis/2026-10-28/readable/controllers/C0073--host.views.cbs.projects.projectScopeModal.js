// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:38248-38646
appModule.controller('host.views.cbs.projects.projectScopeModal',
        [
            '$uibModalInstance', '$scope', 'utilities', '$sce', '$uibModal', 'project', 'abp.services.app.productModule', 'abp.services.app.workScope',
            function ($uibModalInstance, $scope, utilities, $sce, $uibModal, project, productModuleService, workScopeService) {
                var vm = this;
                vm.loading = false;
                vm.saving = false;
            
                vm.project = project;
                vm.workScope = {};
                vm.customModules = [];
                vm.documents = [];
                vm.gapPoints = [];
                vm.totalEstimatedHours = null;
    
                vm.moduleCount = 1;
                vm.selectedProductVariants = [];
                vm.groupedVariants = {};
                vm.multilineStringToHTMLWordBreak = (s) => utilities.multilineStringToHTMLWordBreak(s);


                vm.cancel = function () {
                    $uibModalInstance.close();
                };

                // Document of Scope

                vm.uploadDocument = function () {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/host/views/cbs/projects/uploadDocumentsModal.cshtml',
                        controller: 'host.views.cbs.projects.uploadDocumentsModal as vm',
                        backdrop: 'static',
                        resolve: {
                            tenantId: function () {
                                return 0;
                            }
                        }

                    });
                    modalInstance.result.then(function (result) {
                        vm.documents.push(result);
                    });
                };

                vm.getOriginalName = function (doc) {
                    return doc.name.replace("_" + doc.guid, "");
                };

                vm.removeDocument = function (document) {
                    var index = vm.documents.indexOf(document);
                    if (index > -1) {
                        vm.documents.splice(index, 1);
                    }
                };

                // Product And Variants

                vm.openAddProductModal = function () {
                    var modalInstance = $uibModal.open({
                        templateUrl: '/App/host/views/cbs/projects/addProductModal.cshtml',
                        controller: 'host.views.cbs.projects.addProductModal as vm',
                        backdrop: 'static',
                    });

                    modalInstance.result.then(function (item) {
                        if (item) {
                            vm.onVariantSelectedFromPopup(item.product, item.variant);
                        }
                    });
                };

                vm.onVariantSelectedFromPopup = function (product, variant) {
                    if (!product) return;

                    productModuleService.getModulesForProduct({
                        ProductId: product.id,
                        VariantId: variant ? variant.id : null
                    }).then(function (response) {
                        const modules = response.data.map(function (module) {
                            module.checked = module.category === 1;
                            return module;
                        });

                        const item = {
                            productId: product.id,
                            productName: product.name,
                            productCode: product.code,
                            variantId: variant ? variant.id : null,
                            variantName: variant ? variant.name : '',
                            modules: modules,
                            showModules: false
                        };

                        var exists = vm.selectedProductVariants.some(function (p) {
                            return p.productId === product.id && p.variantId === (variant ? variant.id : null);
                        });

                        if (exists) {
                            abp.message.warn("This product-variant is already added.");
                            return;
                        }

                        vm.selectedProductVariants.push(item);

                        if (!vm.groupedVariants[product.code]) {
                            vm.groupedVariants[product.code] = {
                                productName: product.name,
                                variants: [],
                                showVariants: true
                            };
                        }

                        vm.groupedVariants[product.code].variants.push(item);
                    });
                };

                vm.getModuleCategory = function (category) {
                    return category === 2 ? 'Add On' : '';
                };

                vm.removeProductVariant = function (item) {
                    var index = vm.selectedProductVariants.indexOf(item);
                    if (index > -1) {
                        vm.selectedProductVariants.splice(index, 1);
                    }
                };

                // custom modules

                vm.addCustomModuleRow = function () {
                    var modalInstance = $uibModal.open({
                        templateUrl: '/App/host/views/cbs/projects/addCustomModuleModal.cshtml',
                        controller: 'host.views.cbs.projects.addCustomModuleModal as vm',
                        backdrop: 'static',
                        resolve: {
                            isFromCustomModule: true,
                            esistingGapPoint: function () {
                                return null;
                            },
                            existingModule: function () {
                                return null;
                            },
                            isEdit: false,
                        }
                    });

                    modalInstance.result.then(function (result) {
                        if (result) {
                            vm.customModules.push({
                                moduleId: vm.moduleCount++,
                                name: result.name,
                                detail: result.detail
                            });
                        }
                    });
                };

                vm.editCustomModuleRow = function (module) {
                    var modalInstance = $uibModal.open({
                        templateUrl: '/App/host/views/cbs/projects/addCustomModuleModal.cshtml',
                        controller: 'host.views.cbs.projects.addCustomModuleModal as vm',
                        backdrop: 'static',
                        resolve: {
                            isFromCustomModule: true,
                            esistingGapPoint: function () {
                                return null;
                            },
                            existingModule: function () {
                                return angular.copy(module);
                            },
                            isEdit: true,
                        }
                    });

                    modalInstance.result.then(function (result) {
                        if (result) {
                            for (var i = 0; i < vm.customModules.length; i++) {
                                if (vm.customModules[i].moduleId === result.moduleId) {
                                    vm.customModules[i] = result;
                                    break;
                                }
                            }
                        }
                    });
                };

                vm.removeCustomModuleRow = function (moduleId) {
                    abp.message.confirm(
                        app.localize('DeleteWarningMessage'),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                $scope.$applyAsync(function () {
                                    vm.customModules = vm.customModules.filter(function (module) {
                                        return module.moduleId !== moduleId;
                                    });
                                    abp.notify.success(app.localize('SuccessfullyDeleted'));
                                });
                            }
                        }
                    );
                };

                // GAP POINT

                //vm.subTaskCounter = 1;

                vm.addGapPointModal = function () {
                    var modalInstance = $uibModal.open({
                        templateUrl: '/App/host/views/cbs/projects/addCustomModuleModal.cshtml',
                        controller: 'host.views.cbs.projects.addCustomModuleModal as vm',
                        backdrop: 'static',
                        resolve: {
                            isFromCustomModule: false,
                            esistingGapPoint: function () {
                                return null;
                            },
                            existingModule: function () {
                                return null;
                            },
                            isEdit: false
                        }
                    });

                    modalInstance.result.then(function (result) {
                        if (result) {
                            vm.gapPoints.push({
                                taskId: 0,
                                description: result.description || '',
                                scope: result.scope || '',
                                estimatedHours: parseFloat(result.estimatedHours || 0),
                                isTempId: true,
                                isDeleted: false
                            });
                            vm.calculateHours();
                        }
                    });
                };

                vm.editTask = function (row) {
                    var modalInstance = $uibModal.open({
                        templateUrl: '/App/host/views/cbs/projects/addCustomModuleModal.cshtml',
                        controller: 'host.views.cbs.projects.addCustomModuleModal as vm',
                        backdrop: 'static',
                        resolve: {
                            isFromCustomModule: false,
                            esistingGapPoint: function () {
                                return angular.copy(row);
                            },
                            existingModule: function () {
                                return null;
                            },
                            isEdit: true
                        }
                    });
                    modalInstance.result.then(function (result) {
                        if (result) {
                            angular.extend(row, result);
                            vm.calculateHours();
                        }
                    });
                };

                vm.removeTask = function (row) {
                    abp.message.confirm(
                        app.localize('DeleteWarningMessage'),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                $scope.$applyAsync(function () {
                                    if (row.taskId && row.taskId > 0) {
                                        row.isDeleted = true;
                                    } else {
                                        var index = vm.gapPoints.indexOf(row);
                                        if (index > -1) {
                                            vm.gapPoints.splice(index, 1);
                                        }
                                    }
                                    vm.calculateHours();
                                    abp.notify.success(app.localize('SuccessfullyDeleted'));
                                });
                            }
                        }
                    );
                };

                vm.importData = function () {
                    var modalInstance = $uibModal.open({
                        templateUrl: '/App/host/views/customization/importCustomizationTaskModal.cshtml',
                        controller: 'host.views.customization.importCustomizationTaskModal as vm',
                        backdrop: 'static',
                        resolve: {}
                    });

                    modalInstance.result.then(function (excelData) {
                        if (excelData && excelData.length > 0) {
                            excelData.forEach(function (item) {
                                vm.gapPoints.push({
                                    taskId: 0,
                                    description: item.description || '',
                                    scope: item.scope || '',
                                    estimatedHours: parseFloat(item.estimatedHours || 0),
                                    isTempId: true,
                                    isDeleted: false
                                });
                            });
                            vm.calculateHours();
                        }
                    });
                };

                vm.calculateHours = function () {
                    vm.totalHours = 0.0;
                    vm.gapPoints.forEach(function (item) {
                        if (item.estimatedHours !== undefined && !item.isDeleted) {
                            vm.totalHours += item.estimatedHours;
                        }
                    });
                    vm.gapPoints.totalEstimatedHours = vm.totalHours;
                };


                // WorkScope saving
                vm.save = function () {
                    vm.saving = true;

                    const requestData = {
                        id: vm.workScope ? vm.workScope.id : 0,
                        documents: vm.documents,
                        scope: JSON.stringify({
                            selectedProductVariants: vm.selectedProductVariants,
                            customModules: vm.customModules,
                        }),
                        totalEstimatedHours: vm.gapPoints.totalEstimatedHours,
                        gapPoints: vm.gapPoints,
                        projectId: vm.project.id
                    };

                    workScopeService.createOrUpdateWorkscope(requestData)
                        .success(function () {
                            abp.notify.info(app.localize('SavedSuccessfully'));
                            $uibModalInstance.close();
                        })
                        .finally(function () {
                            vm.saving = false;
                        });
                };

                getProjectWorkScope = function () {
                    vm.loading = true;
                    workScopeService.getProjectWorkScope({
                        id: vm.project.id
                    }).success(function (result) {
                        if (result) {
                            vm.workScope = result;
                            vm.documents = result.documents || [];
                            vm.gapPoints = result.gapPoints || []; 

                            const parsedScope = JSON.parse(result.scope || '{}');

                            vm.selectedProductVariants = parsedScope.selectedProductVariants || [];
                            vm.customModules = parsedScope.customModules || [];
                          //  vm.gapPoints = parsedScope.gapPoints || [];

                            const maxModuleId = vm.customModules.reduce((max, mod) => {
                                return mod.moduleId > max ? mod.moduleId : max;
                            }, 0);
                            vm.moduleCount = maxModuleId + 1;

                           /* const maxSubTaskId = vm.gapPoints.reduce((max, task) => {
                                return task.taskId > max ? task.taskId : max;
                            }, 0);
                            vm.subTaskCounter = maxSubTaskId + 1;*/

                            vm.groupedVariants = {};
                            vm.selectedProductVariants.forEach(function (item) {
                                if (!vm.groupedVariants[item.productCode]) {
                                    vm.groupedVariants[item.productCode] = {
                                        productName: item.productName,
                                        variants: [],
                                        showVariants: true
                                    };
                                }
                                vm.groupedVariants[item.productCode].variants.push(item);
                            });

                            vm.calculateHours();
                        }
                        vm.loading = false;

                    });
                };

                function init() {
                    getProjectWorkScope();
                }

                init();

            }
        ]);
