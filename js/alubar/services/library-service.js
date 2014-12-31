var app = angular.module('alubar-app');

app.factory('libraryService', function($rootScope){
	return {
		scenario: {},
		saveScenario: function(name, state, transition){
			this.scenario = {name: name,
				state: state,
				transition: transition};
			$rootScope.$broadcast('save');
		},
		loadScenario: function(scenario){
			this.scenario = scenario;
			$rootScope.$broadcast('load');
		}
	};
});