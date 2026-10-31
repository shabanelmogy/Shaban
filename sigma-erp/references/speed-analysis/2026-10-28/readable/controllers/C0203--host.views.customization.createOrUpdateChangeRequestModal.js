// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:68494-69121
appModule.controller('host.views.customization.createOrUpdateChangeRequestModal', [
        '$scope', '$uibModalInstance', 'abp.services.app.customizationHost', 'changeRequestId','tasksToMove', 'utilities', '$filter', '$uibModal', 'abp.services.app.tenant', 'abp.services.app.user', 'utilities', 'abp.services.app.taskDetail', 'abp.services.app.milestone', 'abp.services.app.currency', 'abp.services.app.businessDivision', 'project', 'isCRFromProjectDashboard','isCRFromNewPoints',
        function ($scope, $uibModalInstance, customizationService, changeRequestId, tasksToMove, utilities, $filter, $uibModal, tenantAppService, userService, utilities, taskDetailService, milestoneService, currencyService, businessDivisionService, project, isCRFromProjectDashboard, isCRFromNewPoints) {
            var vm = this;
            vm.saving = false;
            vm.totalSubTasks = 0;
            vm.EditMode = false;
            vm.totalPercent = 0.0;
            vm.sumAmount = 0.0;
            vm.count = 0;
            vm.tasksToMove = tasksToMove;
            vm.isCRFromProjectDashboard = isCRFromProjectDashboard;
            vm.isCRFromNewPoints = isCRFromNewPoints;
            vm.project= project;
            vm.milestoneTotalPercent = 0;
            vm.displayedTotalCost = 0;
            vm.currencies = [];
            vm.changeRequest = {
                changeRequestId: changeRequestId
            }
            vm.businessName = utilities.divisionName();

            vm.permissions = {
                status: abp.auth.hasPermission('Pages.CBS.ChangeRequests.Milestones.Status'),
                invoiceStatus: abp.auth.hasPermission('Pages.CBS.ChangeRequests.Milestones.InvoiceStatus'),
                paymentStatus: abp.auth.hasPermission('Pages.CBS.ChangeRequests.Milestones.PaymentStatus')
            };

            vm.mileStones = [
                { id: 1, name: "Advance" },
                { id: 2, name: "On Delivery" }

            ];

            vm.chargingTypes = [
                { id: 4, name: "Project GAP" },
                { id: 2, name: "Project Buffer" },
                { id: 1, name: "Paid" },
                { id: 3, name: "Complementary" }

            ];

            vm.getbusinessDivisions = function () {
                vm.loading = true;
                businessDivisionService.getBusinessDivisions().success(function (data) {
                    vm.businessDivisions = data.items
                }).finally(function () {
                    vm.loading = false;
                });
            }
            vm.multilineStringToHTMLWordBreak = (s) => utilities.multilineStringToHTMLWordBreak(s);

            vm.changeRequestDataForCreateOrUpdate =
            {
                id: 0,
                tenantId: null,
                tenant: null,
                projectId: null,
                project: null,
                assignedToUserId: null,
                assignedToUser: null,
                title: null,
                subTasks: [],
                milestones: [],
                tasksToBeMove:vm.tasksToMove,
                totalEstimatedHours: 0.0,
                documents: [],
                ccEmails: null,
                isComplimentary: false,
                isLumpSum: false,
                chargingType: null,
                paymentTerms: null,
                discount: 0.0,
                totalCost: 0.0,
                TotalCostAfterDiscount: 0.0,
                currencyId: 1,
                customCurrencyId: 0,
                businessName: null,
                vatPercent: 0,
                vatCharges: 0,
                isCRFromProjectDashboard: vm.isCRFromProjectDashboard,
                isCRFromNewPoints: vm.isCRFromNewPoints,
            };
            debugger
            if (vm.project) {
                vm.changeRequestDataForCreateOrUpdate.tenantId = vm.project.tenantId;
                vm.changeRequestDataForCreateOrUpdate.tenant = {
                    tenancyName: vm.project.tenancyName
                },
                    vm.changeRequestDataForCreateOrUpdate.businessDivisionId = vm.project.businessDivisionId;
                vm.changeRequestDataForCreateOrUpdate.projectId = vm.project.id;
                vm.changeRequestDataForCreateOrUpdate.project= {
                    title: vm.project.title,
                    company: { companyName: vm.project.company }
                }
            }
            // TENANT DROPDOWN DATA
            vm.searchTenants = function ($select) {
                if ($select.search == "")
                    vm.tenants = [];
                tenantAppService.searchTenants({ filter: $select.search }).then(function (response) {
                    vm.tenants = response.data.items;
                });
            };

            // PROJECT DROPDOWN DATA
            vm.searchProjects = function ($select) {
                if ($select.search == "")
                    vm.projects = [];
                taskDetailService.searchProjectsForCustomization({ keyword: $select.search, tenantId: vm.changeRequestDataForCreateOrUpdate.tenantId }).then(function (response) {
                    vm.projects = response.data.items;
                });
            };
            vm.getNameWithCompany = function (project) {
                return project.title + " (" + project.company.companyName + ")";
            };
            // ASSIGN TO DROPDOWN DATA
            vm.searchUsers = function ($select) {
                if ($select.search == "")
                    vm.users = [];
                userService.searchAssignedToUsers({ keyword: $select.search }).then(function (response) {
                    vm.users = response.data.items;
                });
            };

            vm.calculateHours = function () {
                vm.totalHours = 0.0;
                vm.changeRequestDataForCreateOrUpdate.subTasks.forEach(function (item, index) {
                    if (item.estimatedHours != undefined && item.isDeleted == false) {
                        vm.totalHours += parseFloat(item.estimatedHours) || 0;
                    }
                });
                vm.changeRequestDataForCreateOrUpdate.totalEstimatedHours = vm.totalHours;
                vm.costByHours = parseFloat(vm.totalHours) * 35;
                if (!vm.changeRequestDataForCreateOrUpdate.isLumpSum) {
                    vm.changeRequestDataForCreateOrUpdate.totalCost = vm.costByHours;
                    vm.displayedTotalCost = Number(vm.total());
                }

                vm.isDiscount();
            };

            vm.isDiscount = function () {
           
                /*var totalCost = parseFloat(vm.changeRequestDataForCreateOrUpdate.totalCost) || 0;
                vm.changeRequestDataForCreateOrUpdate.totalCost = totalCost;*/

                if (vm.changeRequestDataForCreateOrUpdate.chargingType == 3) {
                    vm.changeRequestDataForCreateOrUpdate.discount = vm.displayedTotalCost;
                    if (!Array.isArray(vm.changeRequestDataForCreateOrUpdate.milestones)) {
                        console.log("Milestones is not an array, initializing it.");
                        vm.changeRequestDataForCreateOrUpdate.milestones = [];
                    }
                    vm.changeRequestDataForCreateOrUpdate.milestones.length = 0;
                }

                vm.amountCalculate = vm.displayedTotalCost;

                if (vm.changeRequestDataForCreateOrUpdate.discount != null && vm.changeRequestDataForCreateOrUpdate.discount >= 0) {
                    vm.changeRequestDataForCreateOrUpdate.TotalCostAfterDiscount =
                        vm.amountCalculate - parseFloat(vm.changeRequestDataForCreateOrUpdate.discount);
                }
                vm.calculateVatCharges();
            };
            vm.total = function () {

                return vm.convertCurrency(vm.changeRequestDataForCreateOrUpdate.totalCost).toFixed(2);
            };

            vm.convertCurrency = function convertCurrency(amount) {
                if (!amount || amount === 0) return 0;
                var currencyObj = vm.currencies.find(obj => obj.id === vm.changeRequestDataForCreateOrUpdate.customCurrencyId);
                return parseFloat(amount) * (currencyObj ? currencyObj.currencyToBaseRate : 1);
            };

            vm.reverseCurrency = function reverseCurrency(convertedAmount) {
                if (!convertedAmount || convertedAmount === 0) return 0;
                var currencyObj = vm.currencies.find(obj => obj.id === vm.changeRequestDataForCreateOrUpdate.customCurrencyId);
                return convertedAmount / (currencyObj ? currencyObj.currencyToBaseRate : 1);
            };

            // NEW: Add this for input change handling
            vm.onTotalCostChange = function () {
                // Ensure the value is always a number
                if (vm.displayedTotalCost) {
                    vm.changeRequestDataForCreateOrUpdate.totalCost = vm.reverseCurrency(vm.displayedTotalCost).toFixed(2);
                }

                // Only trigger discount calculation when user changes the total cost
                if (vm.changeRequestDataForCreateOrUpdate.isLumpSum) {
                    vm.isDiscount();
                }
            };



            vm.getBusinessName = function (id) {
                if (id == 1) {
                    return "Karzan Soft";
                }
                else if (id == 2) {
                    return "Speed Auto Systems (UAE)";
                }
                else if (id == 3) {
                    return "Speed Auto System";
                }
                else if (id == 4) {
                    return "Speed Auto Systems (UK)";
                }
            }
            vm.addMileStones = function () {

                vm.changeRequestDataForCreateOrUpdate.mileStones.push(
                    {
                        id: 0,
                        milestone: null,
                        percentage: 0.0,
                        amount: 0.0,
                        isDeleted: false
                    }
                );
            };
            // SUBTASKS (POINTS)
            vm.addSubTasks = function () {
                vm.totalSubTasks = vm.changeRequestDataForCreateOrUpdate.subTasks.length;
                vm.changeRequestDataForCreateOrUpdate.subTasks.push(
                    {
                        taskId: vm.totalSubTasks,
                        description: "",
                        scope: "",
                        estimatedHours: 0.0,
                        isTempId: true,
                        isDeleted: false
                    }
                );
            };
            vm.removeSubTasks = function (Id) {
                vm.changeRequestDataForCreateOrUpdate.subTasks.forEach(function (item, index) {
                    if (item.taskId === Id) {
                        if (!vm.EditMode) {
                            vm.changeRequestDataForCreateOrUpdate.subTasks.splice(index, 1);
                        }
                        else {
                            item.isDeleted = true;
                        }

                    }
                });
                vm.calculateHours();
            };
            vm.removeMilestones = function (row) {
                var index = vm.changeRequestDataForCreateOrUpdate.milestones.indexOf(row);
                vm.changeRequestDataForCreateOrUpdate.milestones.splice(index, 1);
                milestoneTotalPercent();
                //vm.calculateHours();
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
                        excelData.forEach(function (item, index) {
                            vm.changeRequestDataForCreateOrUpdate.subTasks.push({
                                taskId: vm.changeRequestDataForCreateOrUpdate.subTasks.length,
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

            vm.changeBusinessDropdown = function () {
                vm.searchProjects({ "search": "" });
                var a = vm.businessDivisions.find(x => x.id === vm.changeRequestDataForCreateOrUpdate.businessDivisionId);
                if (a)
                    vm.changeRequestDataForCreateOrUpdate.customCurrencyId = a.currencyId;
                vm.calculateHours();
                if (a)
                    vm.changeRequestDataForCreateOrUpdate.vatPercent = a.vatPercentage;
            };
            //  DOCUMENTS MODAL 
            vm.uploadDocument = function () {
                if (vm.changeRequestDataForCreateOrUpdate.tenantId != null) {
                    var modalInstance = $uibModal.open({
                        templateUrl: '~/App/host/views/customization/uploadDocumentsModal.cshtml',
                        controller: 'host.views.customization.uploadDocumentsModal as vm',
                        backdrop: 'static',
                        resolve: {
                            tenantId: function () {
                                return vm.changeRequestDataForCreateOrUpdate.tenantId;
                            }
                        }
                    });
                    modalInstance.result.then(function (result) {
                        vm.changeRequestDataForCreateOrUpdate.documents.push(result);
                    });
                }
            };
            vm.removeDocument = function (urlWithToken) {
                vm.changeRequestDataForCreateOrUpdate.documents.forEach(function (item, index) {
                    if (item.urlWithToken === urlWithToken) {
                        vm.changeRequestDataForCreateOrUpdate.documents.splice(index, 1);
                    }
                });
            };
            vm.getOriginalName = function (doc) {
                var originalName = doc.name.replace("_" + doc.guid, "");
                return originalName;
            };

            // CLOSE MODAL
            vm.cancel = function () {
                $uibModalInstance.dismiss();
            };

            vm.calculateVatCharges = function () {
                  vm.changeRequestDataForCreateOrUpdate.vatCharges = (vm.changeRequestDataForCreateOrUpdate.TotalCostAfterDiscount * vm.changeRequestDataForCreateOrUpdate.vatPercent / 100) + vm.changeRequestDataForCreateOrUpdate.TotalCostAfterDiscount;
            };



            // SAVE THE NEW OR EXISTING RECORD
            vm.save = function ()
            {
                vm.saving = true;

                vm.changeRequestDataForCreateOrUpdate.subTasks.forEach(function (value)
                {

                    if (value.isTempId) {
                        value.taskId = 0;
                    }
                });

                customizationService.createOrUpdateChangeRequest(vm.changeRequestDataForCreateOrUpdate).success(function (result)
                {
                    abp.notify.info(app.localize('SavedSuccessfully'));
                    $uibModalInstance.close(result);
                }).finally(function ()
                {
                    vm.saving = false;
                });
            };
            vm.createMilestone = function () {
                vm.count++;
                openCreateOrEditMilestoneModal(null);
            };
            vm.editMilestone = function (row) {
                openCreateOrEditMilestoneModal(row);
            };
            function openCreateOrEditMilestoneModal(row) {
                var costTotal = vm.changeRequestDataForCreateOrUpdate.TotalCostAfterDiscount;

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/milestones/createOrEditChangeRequestMilestoneModal.cshtml',
                    controller: 'host.views.cbs.milestones.createOrEditChangeRequestMilestoneModal as vm',
                    backdrop: 'static',
                    resolve: {
                        listMilestone: function () {
                            return vm.changeRequestDataForCreateOrUpdate.milestones;
                        },
                        row: function () {
                            return row;
                        },
                        totalCost: costTotal
                    }
                });

                modalInstance.result.then(function (result) {

                    if (result.id > 0 || result.tempId > 0) {
                        if (result.id > 0) {
                            vm.changeRequestDataForCreateOrUpdate.milestones = vm.changeRequestDataForCreateOrUpdate.milestones.map(function (item) {
                                return item.id === result.id ? result : item;
                            });
                        }
                        else {
                            vm.changeRequestDataForCreateOrUpdate.milestones = vm.changeRequestDataForCreateOrUpdate.milestones.map(function (item) {
                                return item.tempId === result.tempId ? result : item;
                            });
                        }

                    }
                    else {

                        result.tempId = vm.count;
                        vm.changeRequestDataForCreateOrUpdate.milestones.push(result);
                    }
                    milestoneTotalPercent();
                });
            }
            function milestoneTotalPercent() {
                vm.milestoneTotalPercent = 0;
                vm.changeRequestDataForCreateOrUpdate.milestones.forEach(m => {
                    vm.milestoneTotalPercent += m.percentage;
                });
            }
            function getChangeRequestMilestone() {

                milestoneService.getMilestonesByProjectId(vm.changeRequest).then(function (response) {
                    vm.changeRequestDataForCreateOrUpdate.milestones = response.data;
                    milestoneTotalPercent();
                });

            };
            //vm.completeMark = function (id) {
            //    openCompleteMarkModal(id);
            //};
            vm.openViewMilestoneModal = function (id) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/cbs/milestones/viewMilestoneModal.cshtml',
                    controller: 'host.views.cbs.milestones.createOrEditMilestoneModal as vm',
                    backdrop: 'static',
                    resolve: {
                        projectId: function () {
                            return null;
                        },
                        changeRequestId: changeRequestId,
                        id: id,
                        workspaceId:null
                    }
                });

                modalInstance.result.then(function () {
                    getChangeRequestMilestone();
                });
            }

            vm.deleteMilestone = function (id) {
                abp.message.confirm(
                    app.localize('YesDelete'),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            milestoneService.deleteMilestone({
                                id: id
                            }).success(function () {
                                abp.notify.success(app.localize('SuccessfullyDeleted'));
                                getChangeRequestMilestone();
                            });
                        }
                    }
                );
            };

            //function openCompleteMarkModal(id) {

            //    var modalInstance = $uibModal.open({
            //        templateUrl: '~/App/host/views/cbs/projectsDashboard/compleleMarkModal.cshtml',
            //        controller: 'host.views.cbs.projectsDashboard.compleleMarkModal as vm',
            //        backdrop: 'static',
            //        size: 'md',
            //        resolve: {
            //            milestoneId: function () {
            //                return id;
            //            }
            //        }
            //    });

            //    modalInstance.result.then(function (result) {
            //        getChangeRequestMilestone();
            //    });
            //}

            vm.updateStatus = function (row) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/customization/milestoneStatusModal.cshtml',
                    controller: 'host.views.customization.milestoneStatusModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        milestone: function () {
                            return row;
                        },
                        workspaceId: null
                    }
                });

                modalInstance.result.then(function (result) {
                    getChangeRequestMilestone();
                });
            }
            vm.updateInvoiceStatus = function (row) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/customization/milestoneInvoiceStatusModal.cshtml',
                    controller: 'host.views.customization.milestoneInvoiceStatusModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        milestone: function () {
                            return row;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    getChangeRequestMilestone();
                });
            }
            vm.updatePaymentStatus = function (row) {

                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/host/views/customization/milestonePaymentStatusModal.cshtml',
                    controller: 'host.views.customization.milestonePaymentStatusModal as vm',
                    backdrop: 'static',
                    size: 'md',
                    resolve: {
                        milestone: function () {
                            return row;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    getChangeRequestMilestone();
                });
            }
            vm.getMilestoneStatus = function (id) {
                if (id == 1) {
                    return "Open";
                }
                else if (id == 2) {
                    return "Complete";
                }
                else if (id == 3) {
                    return "Delivered";
                }

            }
            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format('DD-MMM-YY');
                }
                else {
                    return "";
                }
            };

            vm.getPaymentMilestoneStatus = function (id) {
                if (id == 1) {
                    return "Pending";
                }
                else if (id == 2) {
                    return "Received";
                }

            }

            vm.getInvoiceStatus = function (id) {
                if (id == 1) {
                    return "Not-Invoiced";
                }
                else if (id == 2) {
                    return "Invoiced";
                }

            }
            // INIT 
            function init()
            {

                if (changeRequestId > 0) {



                    customizationService.getChangeRequestsById({ Id: changeRequestId }).then(function (response)
                    {

                        vm.changeRequestDataForCreateOrUpdate = response.data;
                        vm.selectedBusiness = vm.businessName.find(obj => obj.name === vm.changeRequestDataForCreateOrUpdate.businessName);
                        vm.EditMode = true;
                        vm.displayedTotalCost =Number(vm.total());
                        getChangeRequestMilestone();
                        vm.isDiscount();
                        /*vm.businessCurrency = vm.businessName.find(obj => obj.name === vm.changeRequestDataForCreateOrUpdate.businessName).currency;*/
                    });
                }

            };

            vm.generateInvoice = function (row) {

                abp.message.confirm(
                    app.localize('Do you want to Generate Invoice?',),
                    function (isConfirmed) {
                        if (isConfirmed) {
                            vm.loading = true;
                            milestoneService.invoiceGenerate(row).success(function (result) {
                                abp.notify.info(app.localize('Generated Successfully!'));
                                getChangeRequestMilestone();
                                vm.loading = false;
                            });
                        }
                    }
                );
            }

            vm.getCurrencies = function () {
                vm.loading = true;
                currencyService.getCurrencies().success(function (data) {
                    vm.currencies = data.items;
                    if (!changeRequestId) {
                        vm.changeRequestDataForCreateOrUpdate.customCurrencyId = vm.currencies.find(obj => obj.code === 'USD').id;
                    }
                }).finally(function () {
                    vm.loading = false;
                });
            }
            vm.getbusinessDivisions();
            init();
            vm.getCurrencies();
        }
    ]);
