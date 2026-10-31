// Inert extracted route declaration. Parent conditions are recorded in data/routes.json.
// raw/application.js:4751
$stateProvider.state('tenant.crs_suppliersBalancesSummary', {
                url: '/crs/suppliersBalancesSummary',
                templateUrl: '~/App/tenant/views/crs/reports/outStandingReport/index.cshtml',
                params: {
                    contactType: 3
                },
                menu: 'CRS.OutstandingReport.Tenant'
            });
