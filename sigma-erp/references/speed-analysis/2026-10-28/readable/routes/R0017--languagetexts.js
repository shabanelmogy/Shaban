// Inert extracted route declaration. Parent conditions are recorded in data/routes.json.
// raw/application.js:1515
$stateProvider.state('languageTexts', {
                    url: '/languages/texts/:languageName?sourceName&baseLanguageName&targetValueFilter&filterText',
                    templateUrl: '~/App/common/views/languages/texts.cshtml',
                    menu: 'Administration.Languages'
                });
