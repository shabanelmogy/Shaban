// Inert extracted route declaration. Parent conditions are recorded in data/routes.json.
// raw/application.js:6371
$stateProvider.state('tenant.PTMS_DataSharingMapping', {
                    url: '/ptms/parkInDataSharingMapping',
                    templateUrl: '~/App/tenant/views/ptms/dataSharingMapping/index.cshtml',
                    params: {
                        dataType: 2
                    },
                    menu: 'PTMS.DataSharingMapping.Tenant'
                });
