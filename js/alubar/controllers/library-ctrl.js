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

app.controller('LibraryController', function($scope,$compile, libraryService, localStorageService){
	$scope.scenarios = localStorageService.get('scenarios');
	if($scope.scenarios == null)
		$scope.scenarios = [];
	
	$scope.selected = null;
	
	$scope.select = function(scenario){
		if($scope.selected != null){
			if($scope.selected.edit == true)
				return;
			$scope.selected.selected = false;
		}
		$scope.selected = scenario;
		scenario.selected = true;
	};
	
	$scope.delete = function(){
		for(var i = $scope.scenarios.length - 1; i >= 0; i--) {
			if($scope.scenarios[i].name === $scope.selected.name) {
				$scope.scenarios.splice(i, 1);
			}
		}
		$scope.selected = null;
		$scope.saveAll();
	}
	
	$scope.newScenario = function(){
		if($scope.selected != null && $scope.selected.edit == true)
			return;
		
		var s = {state:[], transition:[], edit:false};
		$scope.scenarios.push(s);
		$scope.select(s);
		$scope.editName();
	}
	
	$scope.editName = function(){
		if($scope.selected.edit == true){
			var found = 0;
			for(var i = $scope.scenarios.length - 1; i >= 0; i--) {
				if($scope.scenarios[i].name === $scope.selected.tmpName && $scope.selected.tmpName != $scope.selected.name) {
					found++;
				}
			}
			if(found>0 || $scope.selected.tmpName==null)
				return;
			else{
				$scope.selected.name = $scope.selected.tmpName;
			}
		}
		else{
			$scope.selected.tmpName = $scope.selected.name;
		}
		
		$scope.selected.edit = !$scope.selected.edit;
	}
	
	$scope.saveAll = function(){
		if($scope.selected!=null) $scope.selected.selected = false;
		localStorageService.set('scenarios', angular.copy($scope.scenarios));
		if($scope.selected!=null) $scope.selected.selected = true;
	}
	
	
	$scope.load = function(){
		libraryService.loadScenario($scope.selected);
	}
	
	$scope.$on('save', function(){
		var found = false;
		var s = libraryService.scenario;
		s.edit = false;
		s.selected = false;
		
		for(var i = $scope.scenarios.length - 1; i >= 0; i--) {
			if($scope.scenarios[i].name === libraryService.scenario.name) {
				$scope.scenarios[i] = s;
				found = true;
			}
		}
		if(!found)
			$scope.scenarios.push(s);
		
		$scope.saveAll();
	})
	
})

.directive('file', function() {
	  return {
	    templateUrl: 'js/alubar/templates/file.html'
	  };
});