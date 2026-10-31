// Extracted registration; inert review copy, not a standalone runnable module.
// Source: raw/application.js:209917-210317
appModule.controller('tenant.views.crs.equipmentSales.dashboard.index', [
        '$scope', '$timeout', 'abp.services.app.salesAgreementDashboard',
        function ($scope, $timeout, salesAgreementDashboardService) {

            var vm = this;

            $scope.$on('$viewContentLoaded', function () {
                App.initAjax();
            });

            vm.loading = false;
            vm._profitChart = null;

            // ── Default data ──────────────────────────────────────────────────
            vm.data = {
                carFinance: { revenue: 0, expense: 0, net: 0, maxRevenue: 1000, sparklineValues: [] },
                carSalesProfit: { revenue: 0, expense: 0, net: 0 },
                rentalSummary: { revenue: 0, expense: 0, net: 0 },
                otherRevenueProfit: { revenue: 0, expense: 0, netProfit: 0, lines: [] },
                capitalAccount: { lines: [], grandTotal: 0 },
                paymentPlanProfit: { profit: 0, avgFinanceChargesPercentage: 0 },
                paymentPlan: { openAgreementsCount: 0, paidAmount: 0, unpaidAmount: 0, totalAmount: 0 },
                profitPerformance: {
                    ytdNetProfit: 0, avgProfitPerMonth: 0, lossMonths: 0,
                    monthlyData: []
                },
                buySellManagement: { totalTransactions: 0, vehicles: [] }
            };

            vm.buySellTotals = { buyPrice: 0, sellPrice: 0, expenses: 0, grossProfit: 0, netProfit: 0 };
            vm.sparklinePoints = '0,30 20,22 40,26 60,14 80,18 100,8 120,15';

            // ── Year selector ─────────────────────────────────────────────────
            var currentYear = new Date().getFullYear();
            vm.availableYears = [];
            for (var y = currentYear + 1; y >= currentYear - 6; y--) {
                vm.availableYears.push(y);
            }
            vm.selectedYear = currentYear;

            vm.onYearChanged = function () {
                vm.dateRangeModel = {
                    startDate: moment({ year: vm.selectedYear }).startOf('year'),
                    endDate: moment({ year: vm.selectedYear }).endOf('year')
                };
                vm.loadDashboard();
            };

            // ── Date picker ───────────────────────────────────────────────────
            vm.dateRangeOptions = app.createDateRangePickerOptions();
            vm.dateRangeModel = {
                startDate: moment().startOf('year'),
                endDate: moment().endOf('year')
            };

            vm.onDateRangeChanged = function () {
                if (vm.dateRangeModel && vm.dateRangeModel.startDate) {
                    vm.selectedYear = moment(vm.dateRangeModel.startDate).year();
                }
            };

            // ── Compact number formatter ──────────────────────────────────────
            vm.formatCompact = function (val) {
                if (val == null) return '0';
                var abs = Math.abs(val);
                var sign = val < 0 ? '-' : '';
                if (abs >= 1e6) return sign + (abs / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
                if (abs >= 1e3) return sign + Math.round(abs / 1e3) + 'k';
                return sign + Math.round(abs).toString();
            };

            // ── Load dashboard ────────────────────────────────────────────────
            vm.loadDashboard = function () {
                vm.loading = true;

                var input = {
                    startDate: vm.dateRangeModel.startDate || moment().startOf('year'),
                    endDate: vm.dateRangeModel.endDate || moment().endOf('year'),
                    year: vm.selectedYear
                };

                salesAgreementDashboardService.getDashboardData(input)
                    .success(function (result) {
                        vm.data = result;

                        if (result.profitPerformance && result.profitPerformance.year) {
                            vm.selectedYear = result.profitPerformance.year;
                        }

                        vm.computeBuySellTotals();

                        // Build sparkline points
                        vm.buildSparkline((result.carFinance || {}).sparklineValues || []);

                        // Canvas-based widgets: gauge + pie — after digest
                        $scope.$evalAsync(function () {
                            vm.drawGauge(
                                (result.carFinance || {}).revenue || 0,
                                (result.carFinance || {}).maxRevenue || 1000
                            );
                            var sales = result.carSalesProfit || {};
                            vm.drawPie(sales.revenue || 0, sales.expense || 0);
                        });

                        // $timeout gives Angular time to remove busy-if overlay
                        // and browser time to paint the canvas into the DOM
                        $timeout(function () {
                            vm.drawProfitChart(result.profitPerformance);
                        }, 350);
                    })
                    .finally(function () {
                        vm.loading = false;
                    });
            };

            // ── Buy/Sell footer totals ────────────────────────────────────────
            vm.computeBuySellTotals = function () {
                var vehicles = (vm.data.buySellManagement || {}).vehicles || [];
                vm.buySellTotals = vehicles.reduce(function (acc, v) {
                    acc.buyPrice += v.buyPrice || 0;
                    acc.sellPrice += v.sellPrice || 0;
                    acc.expenses += v.expenses || 0;
                    acc.grossProfit += v.grossProfit || 0;
                    acc.netProfit += v.netProfit || 0;
                    return acc;
                }, { buyPrice: 0, sellPrice: 0, expenses: 0, grossProfit: 0, netProfit: 0 });
            };

            // ── Sparkline ─────────────────────────────────────────────────────
            vm.buildSparkline = function (values) {
                if (!values || values.length < 2) return;
                var max = Math.max.apply(null, values);
                var min = Math.min.apply(null, values);
                var range = (max - min) || 1;
                var step = 120 / (values.length - 1);
                vm.sparklinePoints = values.map(function (v, i) {
                    return (i * step).toFixed(1) + ',' + (32 - ((v - min) / range) * 28).toFixed(1);
                }).join(' ');
            };

            // ── Gauge (Card 1) ────────────────────────────────────────────────
            vm.drawGauge = function (value, max) {
                var canvas = document.getElementById('gaugeCanvas');
                if (!canvas) return;
                var ctx = canvas.getContext('2d');
                var cx = 100, cy = 108, r = 78;
                var ratio = max > 0 ? Math.min(value / max, 1) : 0;
                var fillAngle = Math.PI + (ratio * Math.PI);

                ctx.clearRect(0, 0, canvas.width, canvas.height);

                ctx.beginPath();
                ctx.arc(cx, cy, r, Math.PI, 2 * Math.PI);
                ctx.strokeStyle = '#c2ddf5';
                ctx.lineWidth = 14;
                ctx.lineCap = 'round';
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(cx, cy, r, Math.PI, fillAngle);
                ctx.strokeStyle = '#2196F3';
                ctx.lineWidth = 14;
                ctx.lineCap = 'round';
                ctx.stroke();
            };

            // ── Pie (Card 2) ──────────────────────────────────────────────────
            vm.drawPie = function (revenue, expense) {
                var canvas = document.getElementById('pieCanvas');
                if (!canvas) return;
                var ctx = canvas.getContext('2d');
                var total = revenue + expense;

                ctx.clearRect(0, 0, canvas.width, canvas.height);

                var cx = 50, cy = 50, r = 44;

                if (total === 0) {
                    ctx.beginPath();
                    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
                    ctx.fillStyle = '#dbeeff';
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(cx, cy, 22, 0, 2 * Math.PI);
                    ctx.fillStyle = '#fff';
                    ctx.fill();
                    return;
                }
                // ── Capital Account row color cycling ──────────────────────────────
                var capitalColors = ['green', 'blue', 'orange', 'purple', 'teal', 'pink', 'indigo'];
                vm.capitalColorClass = function (index) {
                    return capitalColors[index % capitalColors.length];
                };
                var colors = ['#2196F3', '#e74c3c'];
                var values = [revenue, expense];
                var angle = -Math.PI / 2;

                values.forEach(function (v, i) {
                    if (v <= 0) return;
                    var slice = (v / total) * 2 * Math.PI;
                    ctx.beginPath();
                    ctx.moveTo(cx, cy);
                    ctx.arc(cx, cy, r, angle, angle + slice);
                    ctx.closePath();
                    ctx.fillStyle = colors[i];
                    ctx.fill();
                    angle += slice;
                });

                // Donut hole
                ctx.beginPath();
                ctx.arc(cx, cy, 22, 0, 2 * Math.PI);
                ctx.fillStyle = '#fff';
                ctx.fill();
            };

            // ── Profit & Performance bar chart ────────────────────────────────
            // Stores pending data if Chart.js isn't ready yet
            vm._pendingPP = null;

            vm.drawProfitChart = function (pp) {
                // If Chart.js not yet available, store data and retry after 300ms
                if (typeof Chart === 'undefined') {
                    console.warn('[Dashboard] Chart.js not ready, retrying in 600ms...');
                    vm._pendingPP = pp;
                    $timeout(function () {
                        if (typeof Chart !== 'undefined' && vm._pendingPP) {
                            vm.drawProfitChart(vm._pendingPP);
                            vm._pendingPP = null;
                        } else {
                            console.error('[Dashboard] Chart.js still not loaded.');
                        }
                    }, 600);
                    return;
                }

                if (!pp || !pp.monthlyData || !pp.monthlyData.length) {
                    console.warn('[Dashboard] No monthlyData to chart.');
                    return;
                }

                var canvas = document.getElementById('profitChart');
                if (!canvas) {
                    console.warn('[Dashboard] #profitChart canvas not in DOM yet, retrying...');
                    $timeout(function () { vm.drawProfitChart(pp); }, 150);
                    return;
                }

                // Destroy existing chart to avoid "canvas already in use"
                if (vm._profitChart) {
                    vm._profitChart.destroy();
                    vm._profitChart = null;
                }

                // ABP camelCases JSON: monthName, netProfit, isLoss, isFuture
                var months = pp.monthlyData;
                var labels = months.map(function (m) { return m.monthName || ''; });
                var values = months.map(function (m) { return m.netProfit || 0; });

                var bgColors = months.map(function (m) {
                    if (m.isFuture) return 'rgba(203,213,224,0.55)';
                    return m.isLoss
                        ? 'rgba(231,76,60,0.85)'
                        : 'rgba(33,150,243,0.85)';
                });
                var hoverBg = months.map(function (m) {
                    if (m.isFuture) return 'rgba(203,213,224,0.9)';
                    return m.isLoss
                        ? 'rgba(231,76,60,1)'
                        : 'rgba(33,150,243,1)';
                });

                var ctx = canvas.getContext('2d');
                var fmt = vm.formatCompact;

                // Auto-detect Chart.js version: v2 has Chart.defaults.global
                var isV2 = !!(Chart.defaults && Chart.defaults.global);

                if (isV2) {
                    // ── v2 config ─────────────────────────────────────────────
                    vm._profitChart = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: labels,
                            datasets: [{
                                data: values,
                                backgroundColor: bgColors,
                                hoverBackgroundColor: hoverBg,
                                borderWidth: 0
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            legend: { display: false },
                            tooltips: {
                                backgroundColor: '#1a2a3a',
                                cornerRadius: 6,
                                callbacks: {
                                    label: function (item) { return ' ' + fmt(item.yLabel); }
                                }
                            },
                            scales: {
                                xAxes: [{
                                    gridLines: { display: false },
                                    ticks: { fontColor: '#7a90aa', fontSize: 11 }
                                }],
                                yAxes: [{
                                    gridLines: { color: 'rgba(194,221,245,0.5)', zeroLineColor: '#90caf9' },
                                    ticks: {
                                        fontColor: '#7a90aa', fontSize: 11,
                                        callback: function (v) { return fmt(v); }
                                    }
                                }]
                            }
                        }
                    });

                } else {
                    // ── v3/v4 config ──────────────────────────────────────────
                    vm._profitChart = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: labels,
                            datasets: [{
                                data: values,
                                backgroundColor: bgColors,
                                hoverBackgroundColor: hoverBg,
                                borderRadius: 5,
                                borderSkipped: false
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            animation: { duration: 600 },
                            plugins: {
                                legend: { display: false },
                                tooltip: {
                                    backgroundColor: '#1a2a3a',
                                    cornerRadius: 6,
                                    padding: 8,
                                    callbacks: {
                                        label: function (c) { return ' ' + fmt(c.parsed.y); }
                                    }
                                }
                            },
                            scales: {
                                x: {
                                    grid: { display: false },
                                    ticks: { color: '#7a90aa', font: { size: 11 } }
                                },
                                y: {
                                    grid: { color: 'rgba(194,221,245,0.5)', borderDash: [3, 3] },
                                    ticks: {
                                        color: '#7a90aa', font: { size: 11 },
                                        callback: function (v) { return fmt(v); }
                                    }
                                }
                            }
                        }
                    });
                }

                console.log('[Dashboard] Profit chart rendered (' +
                    (isV2 ? 'v2' : 'v3+') + '), ' + months.length + ' months.');
            };

            // ── Payment % helper ──────────────────────────────────────────────
            vm.paymentPercent = function (amount) {
                var grand = (vm.data.capitalAccount || {}).grandTotal || 0;
                if (!grand || !amount) return 0;
                return Math.round((amount / grand) * 1000) / 10;
            };

            // ── Other expense % helper (bar width inside Other Expense card) ──
            vm.otherExpensePercent = function (amount) {
                var total = (vm.data.otherExpense || {}).totalExpense || 0;
                if (!total || !amount) return 0;
                return Math.round((amount / total) * 100);
            };

            // ── Other revenue % helper (bar width inside Other Revenue card) ──
            vm.otherRevenuePercent = function (amount) {
                var total = (vm.data.otherRevenueProfit || {}).revenue || 0;
                if (!total || !amount) return 0;
                return Math.round((amount / total) * 100);
            };

            // ── Payment Plan — paid % of total (for progress bar) ─────────────
            vm.paymentPlanPaidPercent = function () {
                var pp = vm.data.paymentPlan || {};
                var total = pp.totalAmount || 0;
                if (!total) return 0;
                return Math.round(((pp.paidAmount || 0) / total) * 100);
            };

            // ── Initial load ──────────────────────────────────────────────────
            vm.loadDashboard();
        }
    ]);
