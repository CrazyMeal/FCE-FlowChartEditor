var app = angular.module('fce-app');

app.factory('libraryService', function($rootScope){
	return {
		scenario: {},
		saveScenario: function(name, state, transition){
			this.scenario = {name: name,
				state: state,
				transition: transition};
			console.log(this.scenario);
			$rootScope.$broadcast('save');
		},
		loadScenario: function(scenario){
			this.scenario = scenario;
			$rootScope.$broadcast('load');
		}
	};
});