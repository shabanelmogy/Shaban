// Inert extracted route declaration. Parent conditions are recorded in data/routes.json.
// raw/application.js:4821
$stateProvider.state('tenant.saleReport', {
            url: '/saleReport/{filters:json}',
            templateUrl: '~/App/tenant/views/crs/reports/saleReport/report.cshtml'
        });
