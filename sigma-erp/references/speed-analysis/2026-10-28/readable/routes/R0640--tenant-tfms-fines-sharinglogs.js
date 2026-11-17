// Inert extracted route declaration. Parent conditions are recorded in data/routes.json.
// raw/application.js:6337
$stateProvider.state('tenant.TFMS_Fines_SharingLogs', {
                    url: '/tfms/FinesSharingLogs',
                    templateUrl: '~/App/tenant/views/tms/dataSharingLogs/index.cshtml',
                    params: {
                        dataToShare: 2
                    },
                    menu: 'TFMS.Fines.SharingLogs.Tenant'
                });
