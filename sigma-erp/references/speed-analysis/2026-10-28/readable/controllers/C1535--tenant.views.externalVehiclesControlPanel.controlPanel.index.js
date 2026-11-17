// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:417683-418357
appModule.controller('tenant.views.externalVehiclesControlPanel.controlPanel.index', [
        '$scope', 'abp.services.app.externalRentalAgreementSearch', 'abp.services.app.externalBookingSearch', 'abp.services.app.externalVehicle', 'abp.services.app.jobEstimation', '$uibModal',
        'abp.services.app.customerRequest', 'abp.services.app.leaseAgreementSearch', 'abp.services.app.saleOrder', 'utilities', 'abp.services.app.documentsEmail', 'abp.services.app.job', 'abp.services.app.approval', 'abp.services.app.limoTripSearch',
        function ($scope, externalRentalAgreementSearchService, externalBookingSearchService, externalVehicleService, jobEstimationAppService, $uibModal, customerRequestService, leaseAgreementSearchService, saleOrderService, utilities, documentsEmailAppservice, jobAppService, approvalAppService, limoTripSearchService,
        ) {
            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.workShopEnaled = abp.features.isEnabled("WORKSHOP");
            vm.limoEnaled = abp.features.isEnabled("CRS.Limo");
            vm.crsEnabled = abp.features.isEnabled("CRS.Rental") || abp.features.isEnabled("FMS") || abp.features.isEnabled("CRS.Lease");
            vm.rental = abp.features.isEnabled("CRS.Rental");
            vm.lease = abp.features.isEnabled("CRS.Lease");
            vm.limoTripEnabled = abp.features.isEnabled("CRS.LimoTrip");
            vm.showBookedVehiclesInDashboard = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowBookedVehiclesInDashboard"));
            vm.showLimoVehiclesInDashboard = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowLimoVehiclesInDashboard"));
            vm.showReplacementTodayVehiclesInDashboard = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowReplacementTodayVehiclesInDashboard"));
            vm.customerExpiryDocumentsEnabled = abp.features.isEnabled("CRS.Dashboard.DocumentExpiryModel");

            //vm.agreements = [];
            vm.vehiclesSummary = null;
            //comment new setting 
            vm.bookingsSummary = null;
            vm.agreementsSummary = null;
            vm.limousineSummary = null;
            vm.JobSummary = null;
            vm.permissions = {
                vehicles: abp.auth.hasPermission('Pages.ExternalVehiclesControlPanel.Vehicles'),
                bookings: abp.auth.hasPermission('Pages.ExternalVehiclesControlPanel.Bookings'),
                agreements: abp.auth.hasPermission('Pages.ExternalVehiclesControlPanel.Agreements'),
           
            };

            vm.masterFilters = {
                ownership: null,
                vehicleType: null
            };

            vm.ownershipFilterChanged = function () {
                init();
            };

            vm.vehiclePieChart = {};
            vm.vehiclePieChart.type = "PieChart";
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
                colors: [] // ← will be filled dynamically
            };


            vm.getlocalDate = function (date) {
                if (date == null)
                    return "";

                var localTime = moment.utc(date).toDate();
                return moment(localTime).format('YYYY-MM-DD');
            };

            vm.getVehiclesSummary = function () {
                externalVehicleService.getVehiclesSummary(vm.masterFilters).success(function (result) {
                    vm.vehiclesSummary = result;

                    // reset pie chart
                    vm.vehiclePieChart.data.rows.length = 0;
                    vm.vehiclePieChart.options.colors = [];

                    //fill pie chart
                    addPieRow('Hired', vm.vehiclesSummary.hired, '#36c6d3');
                    addPieRow('OnNRM', vm.vehiclesSummary.onNrm, '#f1c40f');
                    addPieRow('InWorkShop', vm.vehiclesSummary.workShop, '#ed6b75');

                    if (vm.permissions.forSale) {
                        addPieRow('ForSale', vm.vehiclesSummary.forSale, '#1733ed');
                    }

                    addPieRow('TotalLoss', vm.vehiclesSummary.totalLoss, '#777777');
                    addPieRow('Booked', vm.vehiclesSummary.booked, '#33cc33');
                    addPieRow('Idle', vm.vehiclesSummary.idle, '#FF91F0');

                    //vm.vehiclePieChart.data.rows.push({ c: [{ v: app.localize('PendingCustomerDelivery') }, { v: vm.vehiclesSummary.pendingCustomerDelivery }] });
                    //vm.vehiclePieChart.data.rows.push({ c: [{ v: app.localize('PendingWorkshopDelivery') }, { v: vm.vehiclesSummary.pendingWorkshopDelivery }] });

                    addPieRow('NotReady', vm.vehiclesSummary.notReady, '#82acad');

                    //vm.vehiclePieChart.data.rows.push({ c: [{ v: app.localize('Available') }, { v: vm.vehiclesSummary.ready }] });
                    //vm.vehiclePieChart.data.rows.push({ c: [{ v: app.localize('ReadyToGo') }, { v: vm.vehiclesSummary.readyToGo }] });

                });
            };

            function addPieRow(label, value, color) {
                if (value > 0) {
                    vm.vehiclePieChart.data.rows.push({
                        c: [
                            { v: app.localize(label) },
                            { v: value }
                        ]
                    });
                    vm.vehiclePieChart.options.colors.push(color);
                }
            }

            vm.getVehiclesSummaryIdle = function () {
                externalVehicleService.getVehiclesSummaryIdle(vm.masterFilters).success(function (result) {
                    vm.vehiclesSummaryIdle = result;

                });
            };

            vm.getVehiclesSummaryIdleBranchWise = function () {
                vm.idleVehiclesSummaryLoading = true;
                externalVehicleService.getVehiclesSummaryIdleBranchWise(vm.masterFilters).success(function (result) {
                    vm.vehiclesSummaryIdleBranchWise = result.items;

                }).finally(function () {
                    vm.idleVehiclesSummaryLoading = false;
                });
            };

           
            vm.getBookingsSummary = function () {
                externalBookingSearchService.getBookingsSummary(
                    {
                        todayFromTime: moment().startOf('day'),
                        todayToTime: moment().endOf('day'),
                        ownership: vm.masterFilters.ownership,
                        vehicleType: vm.masterFilters.vehicleType
                    }).success(function (result) {
                        vm.bookingsSummary = result;
                    });
            };

            vm.getAgreementsSummary = function () {
                if (vm.rental) {
                    externalRentalAgreementSearchService.getAgreementsSummary(
                        {
                            todayFromTime: moment().startOf('day'),
                            todayToTime: moment().endOf('day'),
                            ownership: vm.masterFilters.ownership,
                            vehicleType: vm.masterFilters.vehicleType,
                        }).success(function (result) {
                            vm.agreementsSummary = result;
                        });
                }

            };


            vm.getLeaseAgreementsSummary = function () {
                leaseAgreementSearchService.getAgreementsSummary(
                    {
                        todayFromTime: moment().startOf('day'),
                        todayToTime: moment().endOf('day'),
                        ownership: vm.masterFilters.ownership,
                        vehicleType: vm.masterFilters.vehicleType
                    }).success(function (result) {
                        vm.leaseSummary = result;
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

            vm.getJobSummary = function () {

                jobAppService.getJobsSummary().success(function (result) {
                    vm.jobSummary = result;
                });
            };
            vm.getEstimationSummary = function () {

                jobEstimationAppService.getJobEstimationsUnApproved().success(function (result) {
                    vm.estimationSummary = result;
                });
            };




            //vm.getAlertsSummary = function () {
            //    vehicleAlertsService.getAlertsSummary().success(function (result) {
            //        vm.alertsSummary = result;
            //    });
            //};

            //vm.getVehiclesSummaryByOwnership = function () {
            //    vehicleService.getVehiclesSummaryByOwnership()
            //        .success(function (result) {
            //            vm.vehicleSummaryOwnerShip = result;
            //        });
            //};
          
            vm.getVehicleSummaryNrm = function () {
                externalVehicleService.getVehicleSummaryNrm(vm.masterFilters)
                    .success(function (result) {
                        vm.vehicleSummaryNrm = result;
                    });
            };

           
            vm.selectVehilceHandler = function (status, statusId, subStatus, fleetType, locationId, isModalFromIdleVehicles = false) {
                var subStatuses = null;
                openListVehicleModal(status, statusId, subStatus, fleetType, subStatuses, locationId, undefined, isModalFromIdleVehicles);
            };
            vm.selectVehilceHandlerTrip = function (status, statusId, subStatus, fleetType, locationId, isOpenTrip) {
                var subStatuses = null;
                openListVehicleModalTrip(status, statusId, subStatus, fleetType, subStatuses, locationId, isOpenTrip);
            };
            vm.selectVehilceHandlerReplacementToday = function (status, statusId, subStatus, fleetType, locationId, isReplacementToday) {
                var subStatuses = null;
                openListVehicleModalReplacementToday(status, statusId, subStatus, fleetType, subStatuses, locationId, isReplacementToday);
            };

            vm.selectBookingHandler = function (bookingStatus) {

                openListBookingModal(bookingStatus);
            };

            vm.selectAgreementHandler = function (agreementStatus, agreementType, locationId) {
                openListAgreementModal(agreementStatus, agreementType, locationId);
            };
            vm.selectHiredTotalAgreementHandler = function (agreementStatus, agreementType, locationId) {
                openListToralHiredAgreementModal(agreementStatus, agreementType, locationId);
            };
            vm.selectOpenListToOpenJobsFirst = function (days0To2, days3To5, days6To8, days9To10, daysMoreThen10, total) {
                debugger;
                openListToOpenJobsFirst(days0To2, days3To5, days6To8, days9To10, daysMoreThen10, total);
            };
            vm.selectJobEstimationHandler = function (days0To2, days3To5, days6To8, days9To10, daysMoreThen10, total) {
                debugger;
                openListToOpenEstimationFirst(days0To2, days3To5, days6To8, days9To10, daysMoreThen10, total);
            };



            vm.selectMovementHandler = function (status, statusId, subStatus, fleetType, locationId, movementSubType) {
                var subStatuses = null;
                openListVehicleModal(status, statusId, subStatus, fleetType, subStatuses, locationId, movementSubType);
            };

            vm.selectLeaseHandler = function (LeaseStatus, agreementType, locationId) {
                openListLeaseModal(LeaseStatus, agreementType, locationId);
            };

            vm.selectLimousineHandler = function (LimousineStatus, LimousineType, locationId) {
                openListLimousineModal(LimousineStatus, LimousineType, locationId);
            };

            function openListVehicleModal(status, statusId, subStatus, fleetType, subStatuses, locationId, movementSubType, isModalFromIdleVehicles = false) {
                vm.loading = true;
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: '~/App/tenant/views/externalVehiclesControlPanel/fleet/vehicles/listModal.cshtml',
                    controller: 'tenant.views.externalVehiclesControlPanel.fleet.vehicles.listModal as vm',
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
                                isModalFromIdleVehicles: isModalFromIdleVehicles,
                                DashboardName: "externalVehiclesControlPanel",
                            };
                        },
                    }
                });
            }
            function openListVehicleModalTrip(status, statusId, subStatus, fleetType, subStatuses, locationId, isOpenTrip, movementSubType) {
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
                                isOpenTrip: isOpenTrip,
                                movementSubType: movementSubType,
                                DashboardName: "crs",
                            };
                        },
                    }
                });
            }
            function openListVehicleModalReplacementToday(status, statusId, subStatus, fleetType, subStatuses, locationId, isReplacementToday, movementSubType) {
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
                                isReplacementToday: isReplacementToday,
                                movementSubType: movementSubType,
                                DashboardName: "crs",
                            };
                        },
                    }
                });
            }

            function openListBookingModal(vehicleStatus) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/externalVehiclesControlPanel/rental/bookings/listModal.cshtml',
                    controller: 'tenant.views.externalVehiclesControlPanel.rental.bookings.listModal as vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        vehicleStatus: function () {
                            return vehicleStatus;
                        },
                        vehicleOwnership: function () {
                            return vm.masterFilters.ownership;
                        },
                        vehicleType: function () {
                            return vm.masterFilters.vehicleType;
                        }

                    }
                });
                //modalInstance.result.then(function (result) {
                //    vm.getAgreements();
                //});
            }

            function openListAgreementModal(agreementStatus, agreementType, locationId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/externalVehiclesControlPanel/rental/agreements/listModal.cshtml',
                    controller: 'tenant.views.externalVehiclesControlPanel.rental.agreements.listModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        options: function () {
                            return {
                                agreementStatus: agreementStatus,
                                vehicleOwnership: vm.masterFilters.ownership,
                                vehicleType: vm.masterFilters.vehicleType,
                                agreementType: agreementType,
                                locationId: locationId,

                            };
                        }
                    }
                });
            };


            function openListToralHiredAgreementModal(agreementStatus, agreementType, locationId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/agreements/listModal.cshtml',
                    controller: 'tenant.views.crs.agreements.listModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        options: function () {
                            return {
                                agreementStatus: agreementStatus,
                                vehicleOwnership: vm.masterFilters.ownership,
                                vehicleType: vm.masterFilters.vehicleType,
                                agreementType: agreementType,
                                locationId: locationId,
                                openAgreementDashboardTotal: true
                            };
                        }
                    }
                });
            };

            function openListToOpenEstimationFirst(days0To2, days3To5, days6To8, days9To10, daysMoreThen10, total) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/workshop/jobEstimations/listModal.cshtml',
                    controller: 'tenant.views.workshop.jobEstimations.listModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        options: function () {
                            return {
                                days0To2: days0To2,
                                days3To5: days3To5,
                                days6To8: days6To8,
                                days9To10: days9To10,
                                daysMoreThen10: daysMoreThen10,
                                total: total,

                            };
                        }
                    }
                });
            };
            function openListToOpenJobsFirst(days0To2, days3To5, days6To8, days9To10, daysMoreThen10, total) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/workshop/jobs/listModal.cshtml',
                    controller: 'tenant.views.workshop.jobs.listModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        options: function () {
                            return {
                                days0To2: days0To2,
                                days3To5: days3To5,
                                days6To8: days6To8,
                                days9To10: days9To10,
                                daysMoreThen10: daysMoreThen10,
                                total: total,

                            };
                        }
                    }
                });
            };

            vm.openTotalHiredVehiclesModal = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/externalVehiclesControlPanel/controlPanel/totalHiredVehiclestModal.cshtml',
                    controller: 'tenant.views.externalVehiclesControlPanel.controlPanel.totalHiredVehiclestModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        options: function () {
                            return {
                                vehicleOwnership: vm.masterFilters.ownership,
                                vehicleType: vm.masterFilters.vehicleType,
                            };
                        }
                    }
                });
            };


            function openListLeaseModal(leaseStatus, agreementType, locationId) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/lease/agreements/listModal.cshtml',
                    controller: 'tenant.views.crs.lease.agreements.listModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        options: function () {
                            return {
                                leaseStatus: leaseStatus,
                                vehicleOwnership: vm.masterFilters.ownership,
                                vehicleType: vm.masterFilters.vehicleType,
                                agreementType: agreementType,
                                locationId: locationId,
                            }
                        }
                    }
                });
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
            vm.checkVehicleAvailibity = function () {
                openSearchVehicleModal();
            };

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
                                source: 'dashboard',
                                selectable: false
                            };
                        }
                    }

                });
            }
            vm.agreementExpiryUser = function () {
                openAgreementExpiryUser();
            };

            function openAgreementExpiryUser() {
                debugger
                $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/dashboard/documentExpiryModel.cshtml',
                    controller: 'tenant.views.crs.dashboard.documentExpiryModel as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        options: function () {
                            return {

                                name: null,
                                company: null,
                                type: null,
                                DocumentType: null,
                                documentNo: 0,
                                issueBy: null,
                                issueDate: (moment().startOf('day')).utc(),
                                expiryDate: (moment().endOf('day')).utc(),
                            };
                        }
                    }

                });
            }
           
            vm.getApprovalLinesCount = function (record) {
                if (record)
                    return record.length;
                else return 0;
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

            /*function disposalApprovalCalculation(Disposals1, Disposals2) {
                if (Disposals2) {
                    Disposals2.forEach(function (item) {
                        Disposals1.push(item);
                    });
                }
                vm.approvalsSummary.assetsDisposals = Disposals1;
            }*/
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


            /*var approvalNotifications = function () {
                vm.getApprovalsSummaryForNotifications();
            }

            $interval(approvalNotifications, 60000);*/

            function init() {

                if (vm.permissions.vehicles) {
                    vm.getVehiclesSummary();
                }

                if (vm.permissions.bookings)
                    vm.getBookingsSummary();
                if (vm.permissions.agreements)
                    vm.getAgreementsSummary();
               /* vm.getVehicleSummaryNrm();           */  
            };

            init();
        }
    ]);
