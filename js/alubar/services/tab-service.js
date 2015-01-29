var app = angular.module('alubar-app');

app.factory('tabService', function($rootScope){
	var requestedTab;
	var actualTab;
	var accepted;
	
	return {
		newRequest: function(req, act){
			console.log('new request');
			actualTab = act;
			requestedTab = req;
			accepted = undefined;
			$rootScope.$broadcast('tabChangeRequested');
		},
		
		accept: function(){
			console.log('accepted');
			accepted = true;
			$rootScope.$broadcast('tabChangeAccepted');
		},
	
		isAccepted: function(){
			console.log('accepted checked');
			return accepted;
		},
		
		getActualTab : function(){
			return actualTab;
		},
		getRequestedTab : function(){
			return requestedTab;
		}
	}
});