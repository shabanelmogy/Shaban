// Inert extracted route declaration. Parent conditions are recorded in data/routes.json.
// raw/application.js:4646
$stateProvider.state('tenant.crs_customersBalancesSummary', {
                url: '/crs/customersBalancesSummary',
                templateUrl: '~/App/tenant/views/crs/reports/outStandingReport/index.cshtml',
                params: {
                    contactType: 2
                },
                menu: 'CRS.OutstandingReport.Tenant'
            });
