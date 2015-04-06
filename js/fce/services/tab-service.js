var app = angular.module('fce-app');

app.factory('tabService', function($rootScope){
	var requestedTab;
	var actualTab;
	var accepted;
	
	return {
		newRequest: function(req, act){
			actualTab = act;
			requestedTab = req;
			accepted = undefined;
			$rootScope.$broadcast('tabChangeRequested');
		},
		
		accept: function(){
			accepted = true;
			$rootScope.$broadcast('tabChangeAccepted');
		},
	
		isAccepted: function(){
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