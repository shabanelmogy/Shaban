// Inert extracted route declaration. Parent conditions are recorded in data/routes.json.
// raw/application.js:4959
$stateProvider.state('tenant.bankReconciliation', {
            url: '/bankReconciliationReport/{filters:json}',
            templateUrl: '~/App/tenant/views/crs/banking/bankReconciliation/report.cshtml',
        });
