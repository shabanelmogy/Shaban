// Inert extracted route declaration. Parent conditions are recorded in data/routes.json.
// raw/application.js:6099
$stateProvider.state('tenant.TMS_darb_Tolls_SharingLogs', {
                url: '/tms/e-darb/TollsSharingLogs',
                templateUrl: '~/App/tenant/views/tms/dataSharingLogs/index.cshtml',
                params: {
                    dataToShare: 3
                },
                menu: 'TMS.Tolls.SharingLogs.Tenant'
            });
