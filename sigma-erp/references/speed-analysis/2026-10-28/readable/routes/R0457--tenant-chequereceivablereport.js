// Inert extracted route declaration. Parent conditions are recorded in data/routes.json.
// raw/application.js:4912
$stateProvider.state('tenant.chequeReceivableReport', {
            url: '/chequeReceivables/{filters:json}',
            templateUrl: '~/App/tenant/views/crs/banking/chequesReceivables/report.cshtml',
        });
