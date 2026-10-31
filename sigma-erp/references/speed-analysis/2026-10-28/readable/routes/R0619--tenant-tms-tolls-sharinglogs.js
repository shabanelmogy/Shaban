// Inert extracted route declaration. Parent conditions are recorded in data/routes.json.
// raw/application.js:6197
$stateProvider.state('tenant.TMS_Tolls_SharingLogs', {
                    url: '/tms/TollsSharingLogs',
                    templateUrl: '~/App/tenant/views/tms/dataSharingLogs/index.cshtml',
                    params: {
                        dataToShare: 1
                    },
                    menu: 'TMS.Tolls.SharingLogs.Tenant'
                });
