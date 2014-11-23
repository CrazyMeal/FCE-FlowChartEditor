var app = angular.module('alubar-app');
app.controller('NewDocCtrl', function($scope){
	var doc = null;
	
    $scope.init = function() {
        jsPlumb.bind("ready", function() {
        	doc = jsplumb.getInstance();
        	
        	doc.connect({
        		  source:"element1", 
        		  target:"element2", 
        		  scope:"someScope" 
        		});
        });
    };
    
    
});