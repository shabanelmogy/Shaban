// Inert extracted route declaration. Parent conditions are recorded in data/routes.json.
// raw/application.js:6114
$stateProvider.state('tenant.TMS_darb_dataSharingMapping', {
                url: '/tms/e-darb/dataSharingMapping',
                templateUrl: '~/App/tenant/views/tms/dataSharingMapping/index.cshtml',
                menu: 'TMS.Tolls.TollsReport.Tenant',
                params: {
                    dataType: 3
                }
            });
