// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:190393-190782
appModule.controller('tenant.views.crs.crm.marketing.campaignDashboard.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.cRMCampaign', 'utilities', 'abp.services.app.directory', 'appSession', 'abp.services.app.commonLookup', 'abp.services.app.user',
        function ($scope, $uibModal, uiGridConstants, campaignService, utilities, directoryService, appSession, commonLookupService, userService) {

            var vm = this;
            vm.dateFormat = abp.setting.get("App.General.DateFormat");
            vm.dateTimeFormat = vm.dateFormat + ' ' + 'HH:mm';
            vm.loading = false;
            vm.campaigns = [];
            vm.campaign = null;
            vm.projects = [];
            
            // Dashboard data
            vm.statistics = {
                totalLeads: 0,
                conversions: 0,
                conversionRate: 0,
                costPerLead: 0,
                totalLeadsChange: 0,
                conversionsChange: 0,
                conversionRateChange: 0,
                costPerLeadChange: 0
            };
            vm.performance = null;
            vm.recentLeads = [];
            vm.dailyLeadGeneration = [];
            vm.dailyConversions = [];

            // Chart instances
            vm.leadGenerationChart = null;
            vm.conversionsChart = null;

            // Search campaigns for dropdown
            vm.searchProjects = function ($select) {
                if (!$select || !$select.search) {
                    return;
                }
                var keyword = $select.search;
                if (keyword.length < 1) {
                    vm.projects = [];
                    return;
                }
                campaignService.searchCRMCampaigns({ keyword: keyword }).then(function (response) {
                    vm.projects = response.data || [];
                });
            };

            // Get cities type (placeholder - adjust based on your needs)
            vm.getCitiesType = function (campaign) {
                return campaign.customerType || '';
            };

            // On campaign select
            vm.onProjectSelect = function () {
                if (vm.campaign && vm.campaign.id) {
                    loadDashboardData(vm.campaign.id);
                }
            };

            // Edit campaign
            vm.editProject = function () {
                if (vm.campaign && vm.campaign.id) {
                    openCreateOrEditCampaignModal(vm.campaign.id, true, false);
                }
            };

            function openCreateOrEditCampaignModal(campaignId, editFlag, viewFlag) {
                var modalInstance = $uibModal.open({
                    templateUrl: '~/App/tenant/views/crs/crm/marketing/campaign/createOrEditModal.cshtml',
                    controller: 'tenant.views.crs.crm.marketing.campaign.createOrEditModal as vm',
                    backdrop: 'static',
                    size: 'xl',
                    resolve: {
                        campaignId: function () {
                            return campaignId;
                        },
                        editFlag: function () {
                            return editFlag;
                        },
                        viewFlag: function () {
                            return viewFlag;
                        }
                    }
                });

                modalInstance.result.then(function (result) {
                    if (vm.campaign && vm.campaign.id) {
                        loadDashboardData(vm.campaign.id);
                    }
                });
            }

            // Load dashboard data
            function loadDashboardData(campaignId) {
                if (!campaignId) return;

                vm.loading = true;
                var input = { campaignId: campaignId };

                // Load statistics
                campaignService.getCampaignDashboardStatistics(input).then(function (response) {
                    vm.statistics = response.data;
                    updateStatisticsDisplay();
                }).catch(function (error) {
                    abp.notify.error('Failed to load statistics');
                });

                // Load performance
                campaignService.getCampaignPerformance(input).then(function (response) {
                    vm.performance = response.data;
                    updatePerformanceDisplay();
                }).catch(function (error) {
                    abp.notify.error('Failed to load performance data');
                });

                // Load recent leads
                campaignService.getRecentLeadsFromCampaign(input).then(function (response) {
                    vm.recentLeads = response.data || [];
                }).catch(function (error) {
                    abp.notify.error('Failed to load recent leads');
                });

                // Load daily lead generation
                campaignService.getDailyLeadGeneration(input).then(function (response) {
                    vm.dailyLeadGeneration = response.data || [];
                    updateLeadGenerationChart();
                }).catch(function (error) {
                    abp.notify.error('Failed to load daily lead generation');
                });

                // Load daily conversions
                campaignService.getDailyConversions(input).then(function (response) {
                    vm.dailyConversions = response.data || [];
                    updateConversionsChart();
                }).catch(function (error) {
                    abp.notify.error('Failed to load daily conversions');
                }).finally(function () {
                    vm.loading = false;
                });
            }

            // Update statistics display
            function updateStatisticsDisplay() {
                // Statistics are bound to vm.statistics, so they update automatically
            }

            // Update performance display
            function updatePerformanceDisplay() {
                // Performance is bound to vm.performance, so it updates automatically
            }

            // Update lead generation chart
            function updateLeadGenerationChart() {
                if (!vm.dailyLeadGeneration || vm.dailyLeadGeneration.length === 0) {
                    return;
                }

                // Check if Chart.js is loaded
                if (typeof Chart === 'undefined') {
                    console.warn('Chart.js is not loaded');
                    return;
                }

                var dates = vm.dailyLeadGeneration.map(function (item) {
                    return moment(item.date).format('MMM DD');
                });
                var data = vm.dailyLeadGeneration.map(function (item) {
                    return item.leadCount;
                });

                if (vm.leadGenerationChart) {
                    vm.leadGenerationChart.destroy();
                }

                var leadCtx = document.getElementById('leadGenerationChart');
                if (leadCtx) {
                    vm.leadGenerationChart = new Chart(leadCtx.getContext('2d'), {
                        type: 'line',
                        data: {
                            labels: dates,
                            datasets: [{
                                label: 'Leads',
                                data: data,
                                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                                borderColor: 'rgba(54, 162, 235, 1)',
                                borderWidth: 2,
                                pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                                pointRadius: 4,
                                tension: 0.1
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            layout: {
                                padding: {
                                    top: 20,
                                    bottom: 20,
                                    left: 15,
                                    right: 15
                                }
                            },
                            plugins: {
                                legend: {
                                    display: false
                                },
                                tooltip: {
                                    callbacks: {
                                        label: function (context) {
                                            return context.parsed.y + ' leads';
                                        }
                                    }
                                }
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                        stepSize: 1
                                    }
                                }
                            }
                        }
                    });
                }
            }

            // Update conversions chart
            function updateConversionsChart() {
                if (!vm.dailyConversions || vm.dailyConversions.length === 0) {
                    return;
                }

                // Check if Chart.js is loaded
                if (typeof Chart === 'undefined') {
                    console.warn('Chart.js is not loaded');
                    return;
                }

                var dates = vm.dailyConversions.map(function (item) {
                    return moment(item.date).format('MMM DD');
                });
                var data = vm.dailyConversions.map(function (item) {
                    return item.conversionCount;
                });

                if (vm.conversionsChart) {
                    vm.conversionsChart.destroy();
                }

                var convCtx = document.getElementById('conversionsChart');
                if (convCtx) {
                    vm.conversionsChart = new Chart(convCtx.getContext('2d'), {
                        type: 'bar',
                        data: {
                            labels: dates,
                            datasets: [{
                                label: 'Conversions',
                                data: data,
                                backgroundColor: 'rgba(75, 192, 192, 0.7)',
                                borderColor: 'rgba(75, 192, 192, 1)',
                                borderWidth: 1
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            layout: {
                                padding: {
                                    top: 20,
                                    bottom: 20,
                                    left: 15,
                                    right: 15
                                }
                            },
                            plugins: {
                                legend: {
                                    display: false
                                },
                                tooltip: {
                                    callbacks: {
                                        label: function (context) {
                                            return context.parsed.y + ' conversions';
                                        }
                                    }
                                }
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                        stepSize: 1
                                    }
                                }
                            }
                        }
                    });
                }
            }

            vm.getlocalDateTime = function (date) {
                if (date != null) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                else {
                    return "";
                }
            };

            // Format date for display
            vm.formatDate = function (date) {
                if (date) {
                    return moment(date).format('MMM DD, YYYY');
                }
                return '';
            };

            // Get status display
            vm.getStatusDisplay = function (status) {
                var statusMap = {
                    1: 'Planned',
                    2: 'Active',
                    3: 'Paused',
                    4: 'Completed',
                    5: 'Cancelled'
                };
                return statusMap[status] || status;
            };

            // Get status class
            vm.getStatusClass = function (status) {
                if (status === 2) return 'status-active';
                if (status === 1) return 'status-upcoming';
                if (status === 3) return 'status-expiring';
                return '';
            };

            function init() {
                // Initialize empty charts only if Chart.js is loaded
                if (typeof Chart !== 'undefined') {
                    setTimeout(function () {
                        var leadCtx = document.getElementById('leadGenerationChart');
                        var convCtx = document.getElementById('conversionsChart');
                        
                        if (leadCtx && !vm.leadGenerationChart) {
                            vm.leadGenerationChart = new Chart(leadCtx.getContext('2d'), {
                                type: 'line',
                                data: { labels: [], datasets: [] },
                                options: { 
                                    responsive: true, 
                                    maintainAspectRatio: false,
                                    layout: {
                                        padding: {
                                            top: 20,
                                            bottom: 20,
                                            left: 15,
                                            right: 15
                                        }
                                    }
                                }
                            });
                        }
                        
                        if (convCtx && !vm.conversionsChart) {
                            vm.conversionsChart = new Chart(convCtx.getContext('2d'), {
                                type: 'bar',
                                data: { labels: [], datasets: [] },
                                options: { 
                                    responsive: true, 
                                    maintainAspectRatio: false,
                                    layout: {
                                        padding: {
                                            top: 20,
                                            bottom: 20,
                                            left: 15,
                                            right: 15
                                        }
                                    }
                                }
                            });
                        }
                    }, 100);
                }
            }

            init();

        }
    ]);
