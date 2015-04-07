var app = angular.module('fce-app');

app.factory('libraryService', function($rootScope){
	return {
		flowchart: {},
		saveflowchart: function(name, state, transition){
			this.flowchart = {name: name,
				state: state,
				transition: transition};
			console.log(this.flowchart);
			$rootScope.$broadcast('save');
		},
		loadflowchart: function(flowchart){
			this.flowchart = flowchart;
			$rootScope.$broadcast('load');
		}
	};
});