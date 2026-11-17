// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:198789-199859
appModule.controller('tenant.views.crs.dashboard.index', [
        '$scope', 'abp.services.app.rentalAgreementSearch', 'abp.services.app.bookingSearch', 'abp.services.app.vehicle', 'abp.services.app.jobEstimation', '$uibModal',
        'abp.services.app.customerRequest', 'abp.services.app.leaseAgreementSearch', 'abp.services.app.saleOrder', 'utilities', 'abp.services.app.documentsEmail', 'abp.services.app.job', 'abp.services.app.approval', 'abp.services.app.limoTripSearch',
        function ($scope, rentalAgreementSearchService, bookingSearchService, vehicleService, jobEstimationAppService, $uibModal, customerRequestService, leaseAgreementSearchService, saleOrderService, utilities, documentsEmailAppservice, jobAppService, approvalAppService, limoTripSearchService,
        ) {
            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            //vm.agreements = [];
            vm.workShopEnaled = abp.features.isEnabled("WORKSHOP");
            vm.limoEnaled = abp.features.isEnabled("CRS.Limo");
            vm.crsEnabled = abp.features.isEnabled("CRS.Rental") || abp.features.isEnabled("FMS") || abp.features.isEnabled("CRS.Lease");
            vm.rental = abp.features.isEnabled("CRS.Rental");
            vm.lease = abp.features.isEnabled("CRS.Lease");
            vm.limoTripEnabled = abp.features.isEnabled("CRS.LimoTrip");
            vm.rentalOrLeaseDailyRevenue = abp.features.isEnabled("CRS.Reports.RentalOrLeaseDailyRevenue");
            vm.preCloseAgreement = abp.features.isEnabled("CRS.CustomFeatures.PreCloseAgreement");
            vm.preCloseLeaseAgreement = abp.features.isEnabled("CRS.CustomFeatures.PreCloseLeaseAgreement");
            vm.showBookedVehiclesInDashboard = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowBookedVehiclesInDashboard"));
            vm.showLimoVehiclesInDashboard = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowLimoVehiclesInDashboard"));
            vm.showReplacementTodayVehiclesInDashboard = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ShowReplacementTodayVehiclesInDashboard"));
            vm.rentalGracePeriod = parseInt(abp.setting.get("App.General.RentalGracePeriodInMinutes"));
            var gracePeriodInHour = parseInt(abp.setting.get("App.General.GracePeriodInHoursForIndividual")) || 0;

            vm.customerExpiryDocumentsEnabled = abp.features.isEnabled("CRS.Dashboard.DocumentExpiryModel");
            vm.isPermissionCompanyCustomer = abp.auth.hasPermission('Pages.Tenant.Companies.CustomerApproval'),
                vm.vehiclesSummary = null;
            //comment new setting 
            //vm.applyPermissionOnDashboardSections = utilities.parseBoolean(abp.setting.get("App.Speed.Common.ApplyPermissionOnDashboardSections"));
            //vm.isPermissionVehicle = abp.auth.hasPermission('Pages.Tenant.Dashboard.VehicleSection');
            //vm.isPermissionBooking = abp.auth.hasPermission('Pages.Tenant.Dashboard.BookingSection');
            //vm.isPermissionRentalAgreement = abp.auth.hasPermission('Pages.Tenant.Dashboard.RentalAgreementSection');
            //vm.isPermissionWorkshop = abp.auth.hasPermission('Pages.Tenant.Dashboard.WorkshopSection');
            //vm.isPermissionNrm = abp.auth.hasPermission('Pages.Tenant.Dashboard.NrmSection');
            //vm.isPermissionLeaseAgreement = abp.auth.hasPermission('Pages.Tenant.Dashboard.LeaseAgreementSection');
            //vm.isPermissionLimousine = abp.auth.hasPermission('Pages.Tenant.Dashboard.LimousineSection');
            //vm.isPermissionIdleVehicles = abp.auth.hasPermission('Pages.Tenant.Dashboard.IdleVehiclesSection');
            //vm.isPermissionOpenAgreements = abp.auth.hasPermission('Pages.Tenant.Dashboard.OpenAgreementsSection');
            //vm.isPermissionFleetType = abp.auth.hasPermission('Pages.Tenant.Dashboard.FleetTypeSection');
            //vm.isPermissionCustomerRequests = abp.auth.hasPermission('Pages.Tenant.Dashboard.CustomerRequestsSection');
            //vm.isPermissionJobsWorkInProgress = abp.auth.hasPermission('Pages.Tenant.Dashboard.JobsWorkInProgressSection');
            //vm.isPermissionJobEstimations = abp.auth.hasPermission('Pages.Tenant.Dashboard.JobEstimationsSection');
            //vm.isPermissionDueApprovals = abp.auth.hasPermission('Pages.Tenant.Dashboard.DueApprovalsSection');
            //vm.isPermissionVehicleReplacements = abp.auth.hasPermission('Pages.Tenant.Dashboard.VehicleReplacementsSection');
            //vm.isPermissionHiredVehiclesSummaryByFleetType = abp.auth.hasPermission('Pages.Tenant.Dashboard.HiredVehiclesSummaryByFleetTypeSection');
            //vm.isPermissionAgreementsSaleOrdersAndExpiringDocs = abp.auth.hasPermission('Pages.Tenant.Dashboard.AgreementsSaleOrdersAndExpiringDocsSection');
            vm.bookingsSummary = null;
            vm.agreementsSummary = null;
            vm.limousineSummary = null;
            vm.JobSummary = null;
            vm.permissions = {
                vehicles: abp.auth.hasPermission('Pages.Tenant.Vehicles'),
                forSale: abp.auth.hasPermission('Pages.Tenant.Vehicles.ForSale'),
                bookings: abp.auth.hasPermission('Pages.Tenant.Bookings'),
                agreements: abp.auth.hasPermission('Pages.Tenant.Agreements'),
                limousineTrip: abp.auth.hasPermission('Pages.Tenant.Limousine.Trips'),
                leaseAgreement: abp.auth.hasPermission('Pages.Tenant.Lease.Agreements'),
                rentalLeaseChauffer: abp.auth.hasPermission('Pages.Tenant.Agreements') || abp.auth.hasPermission('Pages.Tenant.Lease.Agreements') || abp.auth.hasPermission('Pages.Tenant.Chauffeur'),
                customerRequests: abp.features.isEnabled("CRS.CustomFeatures.CustomerRequests"), //feature
                saleOrders: abp.auth.hasPermission("Pages.Tenant.Vouchers.SaleOrders"), //feature
                customersByExpiredDocuments: abp.auth.hasPermission("Pages.Tenant.Dashboard.DocumentExpiryModel"),
                dailyRentalRevenueReport: abp.auth.hasPermission("Pages.Tenant.Reports.DailyRentalRevenueReport"),
                dailyLeaseRevenueReport: abp.auth.hasPermission("Pages.Tenant.Reports.DailyLeaseRevenueReport"),
                //abp.auth.hasPermission("Pages.Tenant.Vouchers.SaleOrders")
                //documentExpiryDocuments: abp.auth.hasPermission("Pages.Tenant.Dashboard.DocumentExpiryModel") 
            };
            vm.isAssetDisposalApprovalEnabled = abp.features.isEnabled("CRS.Vouchers.Approval.AssetDisposal");
            vm.isMultiLevelPurchaseRequestApprovalEnabled = abp.features.isEnabled("CRS_Approval_PurchaseRequests");

            vm.masterFilters = {
                ownership: null,
                vehicleType: null
            };
            var allowedChargeTypes = {
                1: true,
                2: true,
                19: true,
                23: true,
                26: true,
                27: true,
                52: true,
                53: true,
                54: true,
                55: true
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


            //vm.vehiclePieChart1 = {};
            //vm.vehiclePieChart1.type = "Timeline";
            //vm.vehiclePieChart1.data = {
            //    "cols": [
            //        { id: "t", label: "Topping", type: "string" },
            //        { id: "s", label: "Slices", type: "number" },
            //    { id: "d", label: "Dices", type: "number" }
            //    ],
            //    "rows": []
            //};



            vm.vehiclePieChart.options = {
                'legend': { position: 'none' },
                width: 120,
                height: 120,
                chartArea: { left: 10, top: 10, bottom: 10, right: 10, height: "100%" },
                //colors: ['#36c6d3', '#F1C40F', '#ED6B75', '#1733ed', '#777777', '#8e44ad', 'red', '#FF91F0', '#26C281', '#a5da38']
                colors: ['#36c6d3', '#f1c40f', '#ed6b75', '#1733ed', '#777', '#33cc33', '#FF91F0']
            };

            //vm.vehicleBySubStatusPieChart.options = {
            //    'legend': { position: 'none' },
            //    width: 120,
            //    height: 120,
            //    chartArea: { left: 10, top: 10, bottom: 10, right: 10, height: "100%" },
            //    colors: ['#36c6d3', '#f1c40f', '#ED6B75', '#ed6b75', '#FF91F0', '#26C281',

            //        '#1733ed', , '#777', '#FF91F0', '#26C281']
            //};

            vm.getlocalDate = function (date) {
                if (date == null)
                    return "";

                var localTime = moment.utc(date).toDate();
                return moment(localTime).format('YYYY-MM-DD');
            };

            vm.getVehiclesSummary = function () {
                vehicleService.getVehiclesSummary(vm.masterFilters).success(function (result) {
                    vm.vehiclesSummary = result;



                    //fill pie chart
                    vm.vehiclePieChart.data.rows.length = 0;
                    vm.vehiclePieChart.data.rows.push({ c: [{ v: app.localize('Hired') }, { v: vm.vehiclesSummary.hired }] });
                    vm.vehiclePieChart.data.rows.push({ c: [{ v: app.localize('OnNRM') }, { v: vm.vehiclesSummary.onNrm }] });
                    vm.vehiclePieChart.data.rows.push({ c: [{ v: app.localize('InWorkShop') }, { v: vm.vehiclesSummary.workShop }] });
                    if (vm.permissions.forSale) {
                        vm.vehiclePieChart.data.rows.push({ c: [{ v: app.localize('ForSale') }, { v: vm.vehiclesSummary.forSale }] });
                    }
                    vm.vehiclePieChart.data.rows.push({ c: [{ v: app.localize('TotalLoss') }, { v: vm.vehiclesSummary.totalLoss }] });
                    vm.vehiclePieChart.data.rows.push({ c: [{ v: app.localize('Booked') }, { v: vm.vehiclesSummary.booked }] });
                    vm.vehiclePieChart.data.rows.push({ c: [{ v: app.localize('Idle') }, { v: vm.vehiclesSummary.idle }] });
                    //vm.vehiclePieChart.data.rows.push({ c: [{ v: app.localize('PendingCustomerDelivery') }, { v: vm.vehiclesSummary.pendingCustomerDelivery }] });
                    //vm.vehiclePieChart.data.rows.push({ c: [{ v: app.localize('PendingWorkshopDelivery') }, { v: vm.vehiclesSummary.pendingWorkshopDelivery }] });
                    vm.vehiclePieChart.data.rows.push({ c: [{ v: app.localize('NotReady') }, { v: vm.vehiclesSummary.notReady }] });
                    //vm.vehiclePieChart.data.rows.push({ c: [{ v: app.localize('Available') }, { v: vm.vehiclesSummary.ready }] });
                    //vm.vehiclePieChart.data.rows.push({ c: [{ v: app.localize('ReadyToGo') }, { v: vm.vehiclesSummary.readyToGo }] });
                });
            };

            vm.getVehiclesSummaryIdle = function () {
                vehicleService.getVehiclesSummaryIdle(vm.masterFilters).success(function (result) {
                    vm.vehiclesSummaryIdle = result;

                });
            };

            vm.getVehiclesSummaryIdleBranchWise = function () {
                vm.idleVehiclesSummaryLoading = true;
                vehicleService.getVehiclesSummaryIdleBranchWise(vm.masterFilters).success(function (result) {
                    vm.vehiclesSummaryIdleBranchWise = result.items;

                }).finally(function () {
                    vm.idleVehiclesSummaryLoading = false;
                });
            };

            //vm.getVehiclesSummaryBySubStatus = function () {
            //    vehicleService.getVehiclesSummaryBySubStatus().success(function (result) {
            //        vm.vehiclesSummaryBySubStatus = result;
            //        //fill pie chart
            //        vm.vehicleBySubStatusPieChart.data.rows.length = 0;
            //        vm.vehicleBySubStatusPieChart.data.rows.push({ c: [{ v: app.localize('Hired') }, { v: vm.vehiclesSummaryBySubStatus.hired }] });
            //        vm.vehicleBySubStatusPieChart.data.rows.push({ c: [{ v: app.localize('ForSale') }, { v: vm.vehiclesSummaryBySubStatus.forSale }] });
            //        vm.vehicleBySubStatusPieChart.data.rows.push({ c: [{ v: app.localize('TotalLoss') }, { v: vm.vehiclesSummaryBySubStatus.totalLoss }] });
            //        vm.vehicleBySubStatusPieChart.data.rows.push({ c: [{ v: app.localize('Accidented') }, { v: vm.vehiclesSummaryBySubStatus.accidented }] });
            //        vm.vehicleBySubStatusPieChart.data.rows.push({ c: [{ v: app.localize('NotReady') }, { v: vm.vehiclesSummaryBySubStatus.notReady }] });
            //        vm.vehicleBySubStatusPieChart.data.rows.push({ c: [{ v: app.localize('Ready') }, { v: vm.vehiclesSummaryBySubStatus.ready }] });
            //    });
            //};

            vm.getBookingsSummary = function () {
                bookingSearchService.getBookingsSummary(
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
                    rentalAgreementSearchService.getAgreementsSummary(
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
            vm.getDailyLeaseRevenueReport = function () {
                vm.loading = true
                vm.getLeaseVehicles();
                leaseAgreementSearchService.getOpenLeaseAgreementsSummary(
                    {
                        todayFromTime: moment().startOf('day'),
                        todayToTime: moment().endOf('day'),
                    }).success(function (result) {
                        vm.openLeaseAgreementsSummary = result.items;
                        vm.calculateLeaseSummary();
                    }).finally(function () {
                        vm.loading = false;
                    });
            };
            vm.getLeaseVehicles = function () {
                vm.loading = true;
                vehicleService.getLeaseVehiclesCount()
                    .success(function (result) {
                        vm.leaseVehiclesCount = result;
                    }).finally(function () {
                        vm.loading = false;
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

            vm.getDailyRentalRevenueReport = function () {
                vm.loading = true;
                vm.getRentalVehicles();
                rentalAgreementSearchService.getOpenRentalAgreementsSummary(
                        {
                            todayFromTime: moment().startOf('day'),
                            todayToTime: moment().endOf('day'),
                         
                    }).success(function (result) {
                        vm.openRentalAgreementsSummary = result.items;
                        vm.calculateRentalSummary();
                    }).finally(function () {
                        vm.loading = false;
                    });

            };
            vm.getRentalVehicles = function () {
                vm.loading = true;
                vehicleService.getRentalVehiclesCount()
                    .success(function (result) {
                        vm.rentalVehiclesCount = result;
                    }).finally(function () {
                        vm.loading = false;
                    });

            };
            vm.calculateRentalSummary = function () {

                vm.dailyCount = 0;
                vm.weeklyCount = 0;
                vm.monthlyCount = 0;

                vm.monthlyTotalRent = 0;
                vm.monthlyTotalRentPerDay = 0;

                vm.weeklyTotalRent = 0;
                vm.weeklyTotalRentPerDay = 0;

                vm.dailyTotalRent = 0;
                vm.dailyTotalRentPerDay = 0;

                vm.dailyOtherCharges = 0;
                vm.weeklyOtherCharges = 0;
                vm.monthlyOtherCharges = 0;
                vm.sumOtherChargesPerDay = 0;

                vm.openRentalAgreementsSummary.forEach(function (agreement) {

                    if (!agreement.charges) return;

                    let hasDaily = false;
                    let hasWeekly = false;
                    let hasMonthly = false;

                    let divisor = 1;
                    if (agreement.agreementType === 3) {
                        divisor = 30;
                    } else {
                        // Daily / Weekly → actual days

                        // Normalize grace period
                        let gracePeriod = Number(vm.rentalGracePeriod) || 0;

                        let start = agreement.startDate
                            ? moment.utc(agreement.startDate)
                            : moment.utc();

                        let end = agreement.endDate
                            ? moment.utc(agreement.endDate)
                            : moment.utc();

                        let totalMinutes = end.diff(start, 'minutes');
                        if (totalMinutes <= 0) {
                            divisor = 1;
                        } else {
                            let fullDays = Math.floor(totalMinutes / (24 * 60));
                            let remainingMinutes = totalMinutes % (24 * 60);
                            let extraDay = 0;
                            if (gracePeriodInHour > 0) {
                                const dateForGracePeriod = new Date(end);
                                const endDateMinutesGP = dateForGracePeriod.getHours() * 60 + dateForGracePeriod.getMinutes();
                                const graceMinutesGP = gracePeriodInHour * 60;
                                var dayDiff = dateIn.startOf('day').diff(dateOut.startOf('day'), 'days');
                                if (dayDiff > 0 && endDateMinutesGP > graceMinutesGP)
                                    extraDay = 1;

                            } else {
                                 extraDay = remainingMinutes >= gracePeriod ? 1 : 0;
                            }
                            divisor = fullDays + extraDay;
                            if (divisor <= 0) divisor = 1;
                        }
                    }

                    agreement.charges.forEach(function (charge) {

                        if (!allowedChargeTypes[charge.chargesTypeId]) return; //Filter charges
                        let amount = 0;

                        // Monthly → rent/rate field, Daily/Weekly → charges field
                        if (agreement.agreementType === 3) {
                            amount = charge.rate || 0;
                        } else {
                            amount = charge.charges || 0;
                        }

                        let perDayAmount = amount / divisor;

                        if (charge.chargesTypeId === 1) {
                            // Rent
                            if (agreement.agreementType === 1) {
                                vm.dailyTotalRent += amount;
                                vm.dailyTotalRentPerDay += perDayAmount;
                                hasDaily = true;
                            }

                            if (agreement.agreementType === 2) {
                                vm.weeklyTotalRent += amount;
                                vm.weeklyTotalRentPerDay += perDayAmount;
                                hasWeekly = true;
                            }

                            if (agreement.agreementType === 3) {
                                vm.monthlyTotalRent += amount;
                                vm.monthlyTotalRentPerDay += perDayAmount;
                                hasMonthly = true;
                            }
                        } else {
                            // Other charges
                            if (agreement.agreementType === 1) vm.dailyOtherCharges += amount;
                            if (agreement.agreementType === 2) vm.weeklyOtherCharges += amount;
                            if (agreement.agreementType === 3) vm.monthlyOtherCharges += amount;
                        }
                    });

                    if (hasDaily) vm.dailyCount++;
                    if (hasWeekly) vm.weeklyCount++;
                    if (hasMonthly) vm.monthlyCount++;
                });

                vm.sumOtherChargesPerDay = vm.getOtherChargesSum(
                    vm.dailyOtherCharges,
                    vm.weeklyOtherCharges,
                    vm.monthlyOtherCharges
                );
            };
            vm.getOtherChargesSum = function (daily, weekly, monthly) {
                daily = isNaN(daily) || daily == null ? 0 : daily;
                weekly = isNaN(weekly) || weekly == null ? 0 : weekly;
                monthly = isNaN(monthly) || monthly == null ? 0 : monthly;

                // All values are already per-day, just sum them
                var totalPerDay = daily + weekly + monthly;

                return utilities.round(totalPerDay, 2);
            };

            vm.calculateLeaseSummary = function () {

                vm.monthlyCountForLease = 0;
                vm.monthlyTotalRentForLease = 0;

                vm.monthlyOtherChargesForLease = 0;
                vm.sumOtherChargesPerDayForLease = 0;

                vm.openLeaseAgreementsSummary.forEach(function (agreement, index) {

                    let hasMonthlyForLease = false;

                    if (!agreement.charges) {
                        return;
                    }

                    agreement.charges.forEach(function (charge, cIndex) {

                        if (!allowedChargeTypes[charge.chargesTypeId]) return; //Filter charges

                        let amount = charge.rate || 0;

                        if (charge.chargesTypeId === 1) {

                            if (agreement.agreementType === 4 || agreement.agreementType === 5) {
                                hasMonthlyForLease = true;
                                vm.monthlyTotalRentForLease += amount;
                            }
                        }

                        if (charge.chargesTypeId !== 1) {

                            if (agreement.agreementType === 4 || agreement.agreementType === 5) {
                                vm.monthlyOtherChargesForLease += amount;
                            }
                        }

                    });
                   
                    if (hasMonthlyForLease) {
                        vm.monthlyCountForLease++;
                    }
                });
                vm.sumOtherChargesPerDayForLease = vm.monthlyOtherChargesForLease / 30;
            };
            
            vm.getTotalRevenuePerDay = function () {
                var monthly = vm.monthlyTotalRentPerDay || 0;
                var weekly = vm.weeklyTotalRentPerDay || 0;
                var daily = vm.dailyTotalRentPerDay || 0;
                var sum = vm.sumOtherChargesPerDay || 0;

                return monthly + weekly + daily + sum;
            };

            vm.getRevenuePerDayPerCar = function () {
                var totalFleet = vm.rentalVehiclesCount;
                if (!totalFleet) return 0;

                return utilities.round(vm.getTotalRevenuePerDay() / totalFleet, 2);
            };
            vm.getRevenuePerDayPerCarForLease = function () {
                if (!vm.leaseVehiclesCount) return 0;

                return vm.roundingforView(
                    ((vm.monthlyTotalRentForLease / 30) + vm.sumOtherChargesPerDayForLease)
                    / vm.leaseVehiclesCount
                );
            };

            vm.roundingforView = function (value) {
                return utilities.round(value, 2);
            };

            vm.getVehiclesSummaryByType = function () {
                vehicleService.getVehiclesSummaryByType(vm.masterFilters)
                    .success(function (result) {
                        vm.vehicleSummarybyType = result;
                    });
            };
            vm.getOpenTripVehiclesSummaryByType = function () {
                vehicleService.getOpenTripVehiclesDashboardCount(vm.masterFilters)
                    .success(function (result) {
                        vm.openTripVehicleSummarybyType = result;
                    });
            };
            vm.getHiredVehicleSummaryByType = function () {
                vehicleService.getHiredVehicleSummaryByType(vm.masterFilters)
                    .success(function (result) {
                        vm.enhancedVehiclesSummaryByType = result;
                    });
            };


            vm.getVehicleSummaryNrm = function () {
                vehicleService.getVehicleSummaryNrm(vm.masterFilters)
                    .success(function (result) {
                        vm.vehicleSummaryNrm = result;
                    });
            };

            vm.getVehicleSummaryWorkShop = function () {
                vehicleService.getVehicleSummaryWorkShop(vm.masterFilters)
                    .success(function (result) {
                        vm.vehicleSummaryWorkShop = result;
                    });
            };

            function getHiredVehiclesSummary() {
                vm.hiredVehiclesSummaryLoading = true;

                vehicleService.getHiredVehiclesSummary(vm.masterFilters)
                    .success(function (result) {
                        vm.hiredVehiclesSummary = result.items;
                    }).finally(function () {
                        vm.hiredVehiclesSummaryLoading = false;
                    });
            };

            function getCustomerRequestsSummary() {
                customerRequestService.getCustomerRequestsSummary(
                    {
                        todayFromTime: moment().startOf('day'),
                        todayToTime: moment().endOf('day'),
                    }).success(function (result) {
                        vm.customerRequestsSummary = result;
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
                                isModalFromIdleVehicles: isModalFromIdleVehicles,
                                DashboardName: "crs",
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
                    templateUrl: '~/App/tenant/views/crs/bookings/listModal.cshtml',
                    controller: 'tenant.views.crs.bookings.listModal as vm',
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
                    templateUrl: '~/App/tenant/views/crs/dashboard/totalHiredVehiclestModal.cshtml',
                    controller: 'tenant.views.crs.dashboard.totalHiredVehiclestModal as vm',
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

            var getAgreementsExpiringSaleOrderCount = function () {
                saleOrderService.getAgreementsExpiringSaleOrderCount().success(function (result) {
                    vm.getAgreementsExpiringSaleOrderCount = result;
                });
            }

            var getCustomersByExpiredDocumentsCount = function () {
                documentsEmailAppservice.getCustomersByExpiredDocumentsCount().success(function (result) {
                    vm.getCustomersByExpiredDocumentsCount = result;
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
                    if (vm.permissions.rentalLeaseChauffer)
                        getHiredVehiclesSummary();
                    vm.getVehiclesSummaryByType();
                    vm.getOpenTripVehiclesSummaryByType();
                }

                if (vm.permissions.bookings)
                    vm.getBookingsSummary();

                if (vm.permissions.agreements)
                    vm.getAgreementsSummary();
                if (vm.permissions.leaseAgreement) {
                    vm.getLeaseAgreementsSummary();
                }
                if (vm.permissions.limousineTrip) {
                    vm.getLimousineSummary();
                }
                if (vm.permissions.customerRequests)
                    getCustomerRequestsSummary();
                vm.getVehicleSummaryNrm();
                vm.getVehicleSummaryWorkShop();
                vm.getVehiclesSummaryIdle();
                if (vm.permissions.rentalLeaseChauffer)
                    vm.getVehiclesSummaryIdleBranchWise();
                vm.getHiredVehicleSummaryByType();
                if (vm.permissions.saleOrders) {
                    getAgreementsExpiringSaleOrderCount();
                }
                if (vm.permissions.dailyRentalRevenueReport) {
                    vm.getDailyRentalRevenueReport();
                }
                if (vm.permissions.dailyLeaseRevenueReport) {
                    vm.getDailyLeaseRevenueReport();
                }
                getCustomersByExpiredDocumentsCount();

                vm.getJobSummary();
                vm.getEstimationSummary();

                vm.getApprovalsSummaryForNotifications();
            };

            init();
        }
    ]);
