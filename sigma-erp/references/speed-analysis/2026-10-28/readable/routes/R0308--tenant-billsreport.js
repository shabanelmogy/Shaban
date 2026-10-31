// Inert extracted route declaration. Parent conditions are recorded in data/routes.json.
// raw/application.js:3745
$stateProvider.state('tenant.billsReport', {
            url: '/billsReport/{filters:json}',
            templateUrl: '~/App/tenant/views/crs/vouchers/bills/report.cshtml',
        });
