// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:190786-190953
appModule.controller('tenant.views.crs.crm.marketing.campaignsOverview.index', [
        '$scope', '$uibModal', 'uiGridConstants', 'abp.services.app.cRMCampaign', 'appSession',
        function ($scope, $uibModal, uiGridConstants, crmCampaignService, appSession) {
            var vm = this;

            // Date format settings
            vm.dateFormat = abp.setting.get("App.General.DateFormat") || 'MM/DD/YYYY';
            vm.dateTimeFormat = vm.dateFormat + ' HH:mm';

            // Campaign lists
            vm.ongoingCampaigns = [];
            vm.upcomingCampaigns = [];
            vm.expiringCampaigns = [];
            vm.alerts = [];
            vm.loading = false;
            vm.statusDistribution = null;

            // Format date for display
            vm.getLocalDateTime = function (date) {
                if (date) {
                    var localTime = moment.utc(date).toDate();
                    return moment(localTime).format(vm.dateFormat);
                }
                return "";
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

            // View campaign details - open modal in view mode
            vm.viewCampaign = function (campaignId) {
                if (!campaignId) return;
                openCreateOrEditCampaignModal(campaignId, false, true);
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
                    // Reload campaigns after modal closes
                    loadCampaigns();
                });
            }

            // Load and categorize campaigns
            function loadCampaigns() {
                vm.loading = true;
                crmCampaignService.getCampaignsOverview().then(function (response) {
                    var data = response.data;
                    vm.ongoingCampaigns = data.ongoingCampaigns || [];
                    vm.upcomingCampaigns = data.upcomingCampaigns || [];
                    vm.expiringCampaigns = data.expiringCampaigns || [];
                    vm.alerts = data.alerts || [];
                    vm.statusDistribution = data.statusDistribution || null;

                    // Initialize chart after campaigns are loaded
                    initializeChart();
                }).catch(function (error) {
                    abp.notify.error('Failed to load campaigns overview');
                }).finally(function () {
                    vm.loading = false;
                });
            }

            // Initialize chart for campaign status distribution
            function initializeChart() {
                var ctx = document.getElementById('campaignStatusChart');
                if (!ctx) return;

                // If Chart.js is not loaded, safely exit without breaking the page
                if (typeof Chart === 'undefined') {
                    return;
                }

                // Destroy existing chart if any
                if (vm.statusChart) {
                    vm.statusChart.destroy();
                }

                var ongoingCount = vm.statusDistribution ? vm.statusDistribution.ongoing : vm.ongoingCampaigns.length;
                var upcomingCount = vm.statusDistribution ? vm.statusDistribution.upcoming : vm.upcomingCampaigns.length;
                var expiringCount = vm.statusDistribution ? vm.statusDistribution.expiring : vm.expiringCampaigns.length;
                var completedCount = vm.statusDistribution ? vm.statusDistribution.completed : 0;
                var cancelledCount = vm.statusDistribution ? vm.statusDistribution.cancelled : 0;

                vm.statusChart = new Chart(ctx.getContext('2d'), {
                    type: 'pie',
                    data: {
                        labels: ['Ongoing', 'Upcoming', 'Expiring Soon', 'Completed', 'Cancelled'],
                        datasets: [{
                            data: [
                                ongoingCount,
                                upcomingCount,
                                expiringCount,
                                completedCount,
                                cancelledCount
                            ],
                            backgroundColor: [
                                'rgba(75, 192, 192, 0.7)', // Ongoing - green
                                'rgba(255, 165, 0, 0.7)',   // Upcoming - orange
                                'rgba(244, 67, 54, 0.7)',    // Expiring - red
                                'rgba(128, 128, 128, 0.7)', // Completed - gray
                                'rgba(192, 192, 192, 0.7)'   // Cancelled - light gray
                            ],
                            borderColor: [
                                'rgba(75, 192, 192, 1)',
                                'rgba(255, 165, 0, 1)',
                                'rgba(244, 67, 54, 1)',
                                'rgba(128, 128, 128, 1)',
                                'rgba(192, 192, 192, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'bottom'
                            },
                            tooltip: {
                                callbacks: {
                                    label: function (context) {
                                        var label = context.label || '';
                                        var value = context.parsed || 0;
                                        return label + ': ' + value + ' campaigns';
                                    }
                                }
                            }
                        }
                    }
                });
            }

            // Initialize
            function init() {
                loadCampaigns();
            }

            init();
        }
    ]);
