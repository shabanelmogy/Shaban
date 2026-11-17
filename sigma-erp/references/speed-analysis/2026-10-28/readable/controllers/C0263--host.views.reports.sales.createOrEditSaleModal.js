// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:78215-78835
appModule.controller('host.views.reports.sales.createOrEditSaleModal', [
        '$scope', 'utilities', '$uibModal', '$uibModalInstance', 'saleId', 'abp.services.app.businessDivision', 'abp.services.app.hostProduct', 'abp.services.app.productVariant', 'abp.services.app.productModule', 'abp.services.app.packages', 'abp.services.app.user', 'abp.services.app.directory', 'abp.services.app.salesHost',
        function ($scope, utilities, $uibModal, $uibModalInstance, saleId, businessDivisionService, productService, productVariantService, productModuleService, packagesAppService, userService, directoryService, salesService) {

            var vm = this;
            vm.loading = false;
            vm.saving = false;

            vm.saleId = saleId;

            // Subscription variables

            vm.subscription = {
                type: 2,
                subscriptionPackages: [],
               
            };

            vm.products = [];
            vm.subscriptionsTypes = [
                { id: 2, name: "Monthly" },
                { id: 1, name: "Yearly" },
                { id: 3, name: "Quarterly" },
                //{ id: 4, name: "6 Monthly" }
            ];

            // Scope variable 

            vm.documents = [];
            vm.selectedProductVariants = [];
            vm.groupedVariants = {};
            vm.customModules = [];
            vm.gapPoints = [];
            vm.totalEstimatedHours = null;
            vm.multilineStringToHTMLWordBreak = (s) => utilities.multilineStringToHTMLWordBreak(s);

            // Milestone

            vm.milestones = [];


            vm.searchUsers = function ($select) {
                if ($select.search == "")
                    return null;
                userService.searchUsers({ keyword: $select.search }).then(function (response) {
                    vm.users = response.data.items;
                });
            };

            vm.searchCompanies = function ($select) {
                //whereas contactType: 1 (staff) and contactType: 2 (customer). get customers
                return directoryService.search({ keyword: $select.search, contactType: 2, contactCategory: 2 }).then(function (response) {
                    vm.companies = response.data.items;
                });
            };

            vm.clearCompany = function () {
                vm.filters.companyId = null;
                vm.filters.company = null;
            };

            // Product variant for subscription 

            vm.getProducts = function () {
                productService.getProductsForVariants({}).then(function (response) {
                    vm.products = [];
                    vm.products = response.data;
                }).finally(function () {
                });
            };

            vm.filterRowProductId = function (productId, row) {
                row.seletedProductId = productId;
                vm.loading = true;
                productVariantService.getProductVariants({ id: productId }).success(function (result) {
                    row.productVariants = [];
                    row.productVariants = result;
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.filterRowVariantId = function (variantId, row) {
                row.packages = [];
                row.seletedVariantId = variantId;
                vm.loading = true;
                packagesAppService.getPackages({ ProductId: row.seletedProductId, ProductVariantId: row.seletedVariantId, sorting: "title asc" }).success(function (result) {
                    row.packages = result.items.filter(obj => obj.currencyId === vm.currencyId);
                }).finally(function () {
                    vm.loading = false;
                });
            };

            vm.addRow = function () {
                vm.subscription.subscriptionPackages.push(
                    {
                        oneTimeCharges: 0,
                        subscriptionCharges: 0,
                        packageId: null,
                        package: { productId: 0, variantId: 0 }
                    });
                vm.getCharges();
            };

            vm.removeSubscriptionPackageRow = function (row) {
                var index = vm.subscription.subscriptionPackages.indexOf(row);
                vm.subscription.subscriptionPackages.splice(index, 1);
                vm.getCharges();
            };

            vm.getCharges = function () {
                vm.totalOTC = 0;
                vm.totalSubscriptionCharges = 0;
                vm.subscription.subscriptionPackages.forEach(x => {
                    vm.totalOTC += x.oneTimeCharges;
                    vm.totalSubscriptionCharges += x.subscriptionCharges;
                });
                vm.subscription.amount = vm.totalSubscriptionCharges;
                vm.subscription.SetupCharges = vm.totalOTC;
            };

            vm.adjustCharges = function (row) {
                if (row) {
                    var package = row.packages.filter(obj => obj.id === row.packageId)[0];
                    if (!package) return;

                    row.oneTimeCharges = package.oneTimeCharges;

                    if (vm.subscription.type == 1) {
                        row.subscriptionCharges = package.rate * 12;
                    }
                    else if (vm.subscription.type == 2) {
                        row.subscriptionCharges = package.rate;
                    }
                    else if (vm.subscription.type == 3) {
                        row.subscriptionCharges = package.rate * 3;
                    }
                    /*else if (vm.sale.type == 4) {
                        row.saleCharges = package.rate * 6;
                    }*/
                }
                else {
                    angular.forEach(vm.subscription.subscriptionPackages, function (r) {
                        vm.adjustCharges(r);
                    });
                }

                vm.getCharges();
                vm.calculateAmountVat();
            };


            vm.calculateAmountVat = function () {
                //debugger
                if (vm.subscription.amount !== "" && vm.subscription.vatPercent !== "" && vm.subscription.amount !== undefined && vm.subscription.vatPercent !== undefined) {
                    var amount = parseFloat(vm.subscription.amount);
                    var vatPercent = parseFloat(vm.subscription.vatPercent);
                    vm.subscription.amountVat = amount + (amount * vatPercent / 100);
                } else {
                    vm.subscription.amountVat = 0;
                }
            };

            // Product variant for subscription end



            // Scope start

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
                    result.isNew = true;
                    result.isDeleted = false;
                    vm.documents.push(result);
                });
            };

            vm.getOriginalName = function (doc) {
                return doc.name.replace("_" + doc.guid, "");
            };

            vm.removeDocument = function (document) {
                if (document.id) {
                    document.isDeleted = true;
                }
                else {
                    var index = vm.documents.indexOf(document);
                    if (index > -1) {
                        vm.documents.splice(index, 1);
                    }
                }
            };

            // Standard Module

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
                        isEdit: false
                    }
                });

                modalInstance.result.then(function (result) {
                    if (result) {
                        vm.customModules.push({
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
                        isEdit: true
                    }
                });

                modalInstance.result.then(function (result) {
                    if (result) {
                        angular.extend(module, result);
                    }
                });
            };

            vm.removeCustomModuleRow = function (row) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            var idx = vm.customModules.indexOf(row);
                            if (idx !== -1) {
                                vm.customModules.splice(idx, 1);
                            }
                            $scope.$applyAsync();
                        }
                    }
                );
            };

            // GAP POINT


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
                            description: result.description || '',
                            scope: result.scope || '',
                            estimatedHours: parseFloat(result.estimatedHours || 0),
                        });
                        vm.calculateHours();
                    }
                });
            };

            vm.editGapPoint = function (row) {
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

            vm.removeGapPoint = function (row) {
                abp.message.confirm(
                    app.localize('DeleteWarningMessage'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            $scope.$applyAsync(function () {
                                var index = vm.gapPoints.indexOf(row);
                                if (index > -1) {
                                    vm.gapPoints.splice(index, 1);
                                }
                                vm.calculateHours();
                            });
                        }
                    }
                );
            };

            vm.importGapPointData = function () {
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
                                description: item.description || '',
                                scope: item.scope || '',
                                estimatedHours: parseFloat(item.estimatedHours || 0),
                            });
                        });
                        vm.calculateHours();
                    }
                });
            };

            vm.calculateHours = function () {
                vm.totalHours = 0.0;
                vm.gapPoints.forEach(function (item) {
                    if (item.estimatedHours !== undefined) {
                        vm.totalHours += item.estimatedHours;
                    }
                });
                vm.gapPoints.totalEstimatedHours = vm.totalHours;
            };

            // Scope End




            // Milestone

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('DD-MMM-YY');
                }
                else {
                    return "";
                }
            };

            vm.createMilestone = function () {
                openCreateOrEditMilestoneModal(null, false);
            };

            vm.editMilestone = function (row) {
                openCreateOrEditMilestoneModal(row, true);
            };


            function openCreateOrEditMilestoneModal(existingMilestone, isEdit) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/reports/sales/createOrEditMilestoneModal.cshtml',
                    controller: 'host.views.reports.sales.createOrEditMilestoneModal as vm',
                    backdrop: 'static',
                    resolve: {
                        milestone: function () {
                            return angular.copy(existingMilestone || {});
                        },
                        isEdit: function () {
                            return isEdit;
                        }
                    }
                });

                modalInstance.result.then(function (milestoneData) {
                    if (isEdit) {
                        var idx = vm.milestones.indexOf(existingMilestone);
                        if (idx !== -1) {
                            vm.milestones[idx] = milestoneData;
                        }
                    } else {
                        vm.milestones.push(milestoneData);
                    }
                });
            }
           
            vm.deleteMilestone = function (row) {
                abp.message.confirm(
                    app.localize('YesDelete'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            var idx = vm.milestones.indexOf(row);
                            if (idx !== -1) {
                                vm.milestones.splice(idx, 1);
                            }
                            $scope.$applyAsync();
                        }
                    }
                );
            };

            // Get functions 

            vm.getbusinessDivisions = function () {
                businessDivisionService.getBusinessDivisionsWithCurrency().success(function (data) {
                    vm.businessDivisions = data.items;
                    if (vm.sale && vm.sale.businessDivisionId) {
                        setBusinessDivision();
                    }
                });
            };
            function setBusinessDivision() {
                var selected = vm.businessDivisions.find(function (b) {
                    return b.id === vm.sale.businessDivisionId;
                });
                if (selected) {
                    vm.sale.businessDivision = selected;
                    vm.currencyId = vm.sale.businessDivision.currencyId;
                }
            }

            vm.getSaleById = function () {
                vm.loading = true;


                salesService.getSaleById({ id: saleId }).success(function (result) {
                    vm.sale = result.sale;

                    vm.scope = result.scope ? JSON.parse(result.scope) : {};
                    vm.documents = (result.documents || []).map(function (doc) {
                        doc.isNew = false;
                        doc.isDeleted = false;
                        return doc;
                    });
                    vm.detail = result.detail ? JSON.parse(result.detail) : {};

                    vm.selectedProductVariants = vm.scope.selectedProductVariants || [];
                    vm.customModules = vm.scope.customModules || [];
                    vm.gapPoints = vm.scope.gapPoints || [];

                    vm.milestones = vm.detail.milestones || [];
                    vm.subscription = vm.detail.subscription || {};

                    if (vm.businessDivisions && vm.businessDivisions.length > 0) {
                        setBusinessDivision();
                    }

                }).finally(function () {
                    vm.getCharges();
                    vm.calculateHours();
                    vm.loading = false;
                });
            };
            

            vm.save = function () {
                vm.saving = true;

                const requestData = {
                    id: vm.sale ? vm.sale.id : 0,
                    documents: vm.documents,
                    scope: JSON.stringify({
                        selectedProductVariants: vm.selectedProductVariants,
                        customModules: vm.customModules,
                        gapPoints: vm.gapPoints,
                    }),
                    salesPersons: vm.sale.salesPersons,
                    businessDivisionId: vm.sale.businessDivisionId,
                    detail: JSON.stringify({
                        milestones: vm.milestones,
                        subscription: vm.subscription,
                    }),
                    companyId: vm.sale.companyId,
                    notes: vm.sale.notes,
                    saleDate: vm.sale.saleDate,
                };

                salesService.createOrUpdateSale(requestData)
                    .success(function () {
                        abp.notify.info(app.localize('SavedSuccessfully'));
                        $uibModalInstance.close();
                    })
                    .finally(function () {
                        vm.saving = false;
                    });
            }


            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            function init() {
                vm.getProducts();
                if (saleId != null) {
                    vm.getSaleById();
                }
                vm.getbusinessDivisions();
            }

            init();
        }
    ]);
