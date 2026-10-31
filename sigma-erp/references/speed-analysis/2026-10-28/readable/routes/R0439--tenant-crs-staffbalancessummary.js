// Inert extracted route declaration. Parent conditions are recorded in data/routes.json.
// raw/application.js:4762
$stateProvider.state('tenant.crs_staffBalancesSummary', {
                url: '/crs/staffBalancesSummary',
                templateUrl: '~/App/tenant/views/crs/reports/outStandingReport/index.cshtml',
                params: {
                    contactType: 1
                },
                menu: 'CRS.OutstandingReport.Tenant'
            });
