// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:445577-445871
appModule.controller('tenant.views.mcc.dashboard.index', [
        '$scope', 'abp.services.app.tenantDashboard', '$uibModal', 'abp.services.app.movement', 'abp.services.app.approval','abp.services.app.vehicle', 'abp.services.app.inspection', 'abp.services.app.limoTripSearch',
        function ($scope, tenantDashboardService, $uibModal, movementService, approvalAppService, vehicleService, inspectionService, limoTripSearchService) {
            var vm = this;
            vm.vehiclesSummary = null;
            vm.vehicleInspections = [];
            vm.totalInspections = 0;
            vm.scsandMCCEnabled = false;
            vm.limousineSummary = null;
            //vm.rentalEnabled = abp.features.isEnabled("CRS.Rental");
            //vm.leaseEnabled = abp.features.isEnabled("CRS.Lease");
            vm.limoTripEnabled = abp.features.isEnabled("CRS.LimoTrip");
            vm.isAssetDisposalApprovalEnabled = abp.features.isEnabled("CRS.Vouchers.Approval.AssetDisposal");
            vm.isMultiLevelPurchaseRequestApprovalEnabled = abp.features.isEnabled("CRS_Approval_PurchaseRequests");
            vm.companiesEnabled = abp.features.isEnabled("Core.Companies");
            vm.rentalQuotationEnabled = abp.features.isEnabled("CRS.Rental.Quotations");
            vm.leaseQuotationEnabled = abp.features.isEnabled("CRS.Lease.Quotations");
            vm.rentalMasterAgreementEnabled = abp.features.isEnabled("CRS.Rental.Agreements.MasterAgreement");
            vm.leaseMasterAgreementEnabled = abp.features.isEnabled("CRS.Lease.Agreements");
            vm.purchaseOrderEnabled = abp.features.isEnabled("CRS.Vouchers.Approval.PurchaseOrders");
            vm.purchaseRequestEnabled = abp.features.isEnabled("CRS.Vouchers.Approval.PurchaseRequests");
            vm.jvsEnabled = abp.features.isEnabled("CRS.Vouchers.Approval.JVs");
            vm.billsEnabled = abp.features.isEnabled("CRS.Vouchers.Approval.Bills");
            vm.invoiceEnabled = abp.features.isEnabled("CRS.Vouchers.Approval.Invoices");
            vm.creitNoteEnabled = abp.features.isEnabled("CRS.Vouchers.Approval.CreditNotes");
            vm.debitNoteEnabled = abp.features.isEnabled("CRS.Vouchers.Approval.DebitNotes");
            vm.reciptEnabled = abp.features.isEnabled("CRS.Vouchers.Approval.Receipts");
            vm.paymentsEnabled = abp.features.isEnabled("CRS.Vouchers.Approval.Payments");
            vm.jobEstimationEnabled = abp.features.isEnabled("WORKSHOP.JobEstimations");
            vm.assetDisposalEnabled = abp.features.isEnabled("CRS.Vouchers.Approval.AssetDisposal");
            if (abp.features.isEnabled('SCS') && abp.auth.hasPermission('Pages.Tenant.Inspections')) {
                vm.scsandMCCEnabled = true;
            }
            else {
                vm.scsandMCCEnabled = false;
            }
            vm.masterFilters = {
                ownership: null,
                vehicleType: null
            };

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });
            vm.permissions = {
                vehicles: abp.auth.hasPermission('Pages.Tenant.Vehicles'),
                agreements: abp.auth.hasPermission('Pages.Tenant.Movements'),
                limousineTrip: abp.auth.hasPermission('Pages.Tenant.Limousine.Trips'),
                view: true,
            };

            vm.vehiclePieChart = {};
            vm.vehiclePieChart.type = "PieChart";
            vm.vehiclePieChart.cssStyle = "float:right !important; background: black !important;";
            vm.vehiclePieChart.data = {
                "cols": [
                    { id: "t", label: "Topping", type: "string" },
                    { id: "s", label: "Slices", type: "number" }
                ],
                "rows": []
            };

            vm.vehiclePieChart.options = {
                'legend': { position: 'none' },
                width: 120,
                height: 120,
                chartArea: { left: 10, top: 10, bottom: 10, right: 10, height: "100%" },
                //colors: ['#36c6d3', '#F1C40F', '#ED6B75', '#1733ed', '#777777', '#8e44ad', 'red', '#FF91F0', '#26C281', '#a5da38']
                //colors: ['#36c6d3', '#F1C40F', '#ED6B75', '#FF91F0']
                colors: ['#36c6d3', '#F1C40F', '#ED6B75', '#FF91F0']
            };

            vm.selectVehilceHandler = function (status, statusId, subStatus, fleetType, locationId) {
                var subStatuses = null;
                openListVehicleModal(status, statusId, subStatus, fleetType, subStatuses, locationId);
            };

            function openListVehicleModal(status, statusId, subStatus, fleetType, subStatuses, locationId, movementSubType) {
                vm.loading = true;
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: '~/App/tenant/views/crs/vehicles/listModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.listModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        options: function () {
                            return {
                                status: status,
                                statusId: statusId,
                                subStatus: subStatus,
                                ownerShip: vm.masterFilters.ownership,
                                fleetType: fleetType,
                                subStatuses: subStatus == null && fleetType == null ? [1, 2, 3, 4, 5, 6, 7, 8, 9] : [],
                                locationId: locationId,
                                movementSubType: movementSubType,
                                DashboardName: "crs",
                            };
                        },
                    }
                });
            }


            function openSearchVehicleModal() {

                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/vehicles/searchVehicleModal.cshtml',
                    controller: 'tenant.views.crs.vehicles.searchVehicleModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                fromDateTime: (moment().startOf('day')).utc(),
                                toDateTime: (moment().endOf('day')).utc(),
                                tariffGroup: null,
                                statusId: null,
                                subStatus: 1,
                                selectable: false
                            };
                        }
                    }

                });
            }

            vm.getVehiclesSummary = function () {
                vehicleService.getVehiclesSummaryForMCC(vm.masterFilters).success(function (result) {
                    vm.vehiclesSummary = result;

                    //fill pie chart
                    vm.vehiclePieChart.data.rows.length = 0;
                    vm.vehiclePieChart.data.rows.push({ c: [{ v: app.localize('Hired') }, { v: vm.vehiclesSummary.hired }] });
                    vm.vehiclePieChart.data.rows.push({ c: [{ v: app.localize('OnNRM') }, { v: vm.vehiclesSummary.onNrm }] });
                    vm.vehiclePieChart.data.rows.push({ c: [{ v: app.localize('WorkShop') }, { v: vm.vehiclesSummary.workShop }] });
                    vm.vehiclePieChart.data.rows.push({ c: [{ v: app.localize('Idle') }, { v: vm.vehiclesSummary.idle }] });
                    //vm.vehiclePieChart.data.rows.push({ c: [{ v: app.localize('InWorkShop') }, { v: vm.vehiclesSummary.workShop }] });
                    //vm.vehiclePieChart.data.rows.push({ c: [{ v: app.localize('ForSale') }, { v: vm.vehiclesSummary.forSale }] });
                    //vm.vehiclePieChart.data.rows.push({ c: [{ v: app.localize('TotalLoss') }, { v: vm.vehiclesSummary.totalLoss }] });

                    //vm.vehiclePieChart.data.rows.push({ c: [{ v: app.localize('PendingCustomerDelivery') }, { v: vm.vehiclesSummary.pendingCustomerDelivery }] });
                    //vm.vehiclePieChart.data.rows.push({ c: [{ v: app.localize('PendingWorkshopDelivery') }, { v: vm.vehiclesSummary.pendingWorkshopDelivery }] });
                    //vm.vehiclePieChart.data.rows.push({ c: [{ v: app.localize('NotReady') }, { v: vm.vehiclesSummary.notReady }] });
                    //vm.vehiclePieChart.data.rows.push({ c: [{ v: app.localize('Available') }, { v: vm.vehiclesSummary.ready }] });
                    //vm.vehiclePieChart.data.rows.push({ c: [{ v: app.localize('ReadyToGo') }, { v: vm.vehiclesSummary.readyToGo }] });
                });
            };

            vm.getAgreementsSummary = function () {
                movementService.getMovementsSummaryForMCC(
                    {
                        todayFromTime: moment().startOf('day'),
                        todayToTime: moment().endOf('day'),
                        ownership: vm.masterFilters.ownership,
                        vehicleType: vm.masterFilters.vehicleType,
                    }).success(function (result) {
                        vm.agreementsSummary = result;
                    });
            };
            vm.selectLimousineHandler = function (LimousineStatus, LimousineType, locationId) {
                openListLimousineModal(LimousineStatus, LimousineType, locationId);
            };
            function openListLimousineModal(LimousineStatus, LimousineType, locationId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/limousine/trips/listModal.cshtml',
                    controller: 'tenant.views.crs.limousine.trips.listModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        options: function () {
                            return {
                                LimousineStatus: LimousineStatus,
                                vehicleOwnership: vm.masterFilters.ownership,
                                vehicleType: vm.masterFilters.vehicleType,
                                LimousineType: LimousineType,
                                locationId: locationId,
                            }
                        }
                    }
                });
            };
            vm.getLimousineSummary = function () {
                // limoTripSearchService.getTripsSummary(
                limoTripSearchService.getTripsSummaryOnDashBoard(
                    {
                        todayFromTime: moment().startOf('day'),
                        todayToTime: moment().endOf('day'),
                        ownership: vm.masterFilters.ownership,
                        vehicleType: vm.masterFilters.vehicleType
                    }).success(function (result) {
                        vm.limousineSummary = result;
                    });
            };

            vm.getApprovalLinesCount = function (record) {
                if (record)
                    return record.length;
                else return 0;
            }


            function multiLevelApprovalCalculation(result) {
                var Disposals1 = result.assetsDisposals;
                var Disposals2 = result.assetsDisposals2;
                if (Disposals2) {
                    Disposals2.forEach(function (item) {
                        Disposals1.push(item);
                    });
                }
                vm.approvalsSummary.assetsDisposals = Disposals1;

                var purchaseRequests = result.purchaseRequests;
                var multiLevelPurchaseRequests = result.multiLevelPurchaseRequests;
                if (multiLevelPurchaseRequests) {
                    multiLevelPurchaseRequests.forEach(function (item) {
                        purchaseRequests.push(item);
                    });
                }
                vm.approvalsSummary.purchaseRequests = purchaseRequests;
            }

            vm.selectApprovalsHandlerSummary = function (status, statusId, list) {
                openListApprovalModal(status, statusId, list);
            };
            function openListApprovalModal(status, statusId, list) {
                vm.loading = true;
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: '~/App/tenant/views/crs/dashboard/approvalListModal.cshtml',
                    controller: 'tenant.views.crs.dashboard.approvalListModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        options: function () {
                            return {
                                status: status,
                                list: list,
                                statusId: statusId,
                                ownerShip: vm.masterFilters.ownership,
                                locationId: vm.masterFilters.locationId,
                            };
                        },
                    }
                });
                modalInstance.result.then(function (result) {
                    vm.getApprovalsSummaryForNotifications();
                    vm.loading2 = false;
                });
            }

            vm.getApprovalsSummaryForNotifications = function () {
                vm.loading2 = true;
                approvalAppService.getDueApprovalsSummary(
                    {
                        //locationId: vm.masterFilters.locationId
                    }).success(function (result) {
                        vm.approvalsSummary = result;
                        if (vm.isMultiLevelPurchaseRequestApprovalEnabled || vm.isAssetDisposalApprovalEnabled) {
                            multiLevelApprovalCalculation(result);
                        }
                    }).finally(function () {
                        vm.loading2 = false;
                    });
            };

            function init() {

                if (vm.scsandMCCEnabled) {
                    inspectionService.getInspectionCountForDashBoard().success(function (result) {

                        vm.vehicleInspections = result;
                        vm.totalInspections = 0;
                        vm.vehicleInspections.forEach(function (data) {
                            vm.totalInspections = vm.totalInspections + data.count;
                        });
                    });
                }
                if (vm.permissions.limousineTrip) {
                    vm.getLimousineSummary();
                }
                if (vm.permissions.vehicles) {
                    vm.getVehiclesSummary();
                    //getHiredVehiclesSummary();
                    //vm.getVehiclesSummaryByType();
                }
                if (vm.permissions.agreements)
                    vm.getAgreementsSummary();

                vm.getApprovalsSummaryForNotifications();

            };
            init();
        }
    ]);
