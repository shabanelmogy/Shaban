// Inert extracted route declaration. Parent conditions are recorded in data/routes.json.
// raw/application.js:6327
$stateProvider.state('tenant.TFMS_finesDataSharingMapping', {
                    url: '/tfms/finesDataSharingMapping',
                    templateUrl: '~/App/tenant/views/tms/dataSharingMapping/index.cshtml',
                    params: {
                        dataType: 2
                    },
                    menu: 'TFMS.Fines.DataSharingMapping.Tenant'
                });
