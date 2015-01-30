var app = angular.module('alubar-app');

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
				$scope.saveAll();
				$scope.selected.edit = false;
			}
		}
		else{
			$scope.selected.tmpName = $scope.selected.name;
			$scope.selected.edit = true;
		}
		
	}
	
	$scope.saveAll = function(){
		if($scope.selected!=null){ 
			$scope.selected.edit = false;
			$scope.selected.selected = false;
		}
		localStorageService.set('scenarios', angular.copy($scope.scenarios));
		if($scope.selected!=null){ 
			$scope.selected.selected = true;
		}
	}
	
	
	$scope.load = function(){
		libraryService.loadScenario($scope.selected);
	}
	
	$scope.$on('save', function(){
		var found = false;
		var s = libraryService.scenario;
		s.edit = false;
		if($scope.selected != null && $scope.selected.name === libraryService.scenario.name){
			s.selected = true;
			$scope.selected = s;
		}
		else
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
	
});