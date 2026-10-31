// Inert extracted route declaration. Parent conditions are recorded in data/routes.json.
// raw/application.js:1488
$stateProvider.state('users', {
                url: '/users?filterText',
                templateUrl: '~/App/common/views/users/index.cshtml',
                menu: 'Administration.Users'
            });
