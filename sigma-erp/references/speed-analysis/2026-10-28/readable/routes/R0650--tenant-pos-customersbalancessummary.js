// Inert extracted route declaration. Parent conditions are recorded in data/routes.json.
// raw/application.js:6421
$stateProvider.state('tenant.POS_customersBalancesSummary', {
                url: '/pos/customersBalancesSummary',
                templateUrl: '~/App/tenant/views/crs/reports/outStandingReport/index.cshtml',
                params: {
                    contactType: 2
                },
                menu: 'POS.OutstandingReport.Tenant'
            });
