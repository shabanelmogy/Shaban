// Inert extracted route declaration. Parent conditions are recorded in data/routes.json.
// raw/application.js:6186
$stateProvider.state('tenant.TMS_tollsDataSharingMapping', {
                    url: '/tms/tollsDataSharingMapping',
                    templateUrl: '~/App/tenant/views/tms/dataSharingMapping/index.cshtml',
                    params: {
                        dataType: 1
                    },
                    menu: 'TMS.Tolls.DataSharingMapping.Tenant'
                });
