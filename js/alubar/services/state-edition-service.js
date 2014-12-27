var app = angular.module('alubar-app');

app.factory('StateFactory', function(){
	var stateContent = [];
	return {
		getStateContent : function(){
			return stateContent
		},
		setStateContent : function(newStateContent){
			stateContent = newStateContent;
		},
		clearStateContent : function(){
			stateContent = [];
		}
	};
});