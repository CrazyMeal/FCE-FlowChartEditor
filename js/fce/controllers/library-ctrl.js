var app = angular.module('fce-app');

app.controller('LibraryController', function($scope,$compile, libraryService, localStorageService){
	$scope.flowcharts = localStorageService.get('flowcharts');
	if($scope.flowcharts == null)
		$scope.flowcharts = [];
	
	$scope.selected = null;
	
	$scope.select = function(flowchart){
		if($scope.selected != null){
			if($scope.selected.edit == true)
				return;
			$scope.selected.selected = false;
		}
		$scope.selected = flowchart;
		flowchart.selected = true;
	};
	
	$scope.delete = function(){
		for(var i = $scope.flowcharts.length - 1; i >= 0; i--) {
			if($scope.flowcharts[i].name === $scope.selected.name) {
				$scope.flowcharts.splice(i, 1);
			}
		}
		$scope.selected = null;
		$scope.saveAll();
	}
	
	$scope.newflowchart = function(){
		if($scope.selected != null && $scope.selected.edit == true)
			return;
		
		var s = {state:[], transition:[], edit:false};
		$scope.flowcharts.push(s);
		$scope.select(s);
		$scope.editName();
	}
	
	$scope.editName = function(){
		if($scope.selected.edit == true){
			var found = 0;
			for(var i = $scope.flowcharts.length - 1; i >= 0; i--) {
				if($scope.flowcharts[i].name === $scope.selected.tmpName && $scope.selected.tmpName != $scope.selected.name) {
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
		localStorageService.set('flowcharts', angular.copy($scope.flowcharts));
		if($scope.selected!=null){ 
			$scope.selected.selected = true;
		}
	}
	
	
	$scope.load = function(){
		libraryService.loadflowchart($scope.selected);
	}
	
	$scope.$on('save', function(){
		var found = false;
		var s = libraryService.flowchart;
		s.edit = false;
		if($scope.selected != null && $scope.selected.name === libraryService.flowchart.name){
			s.selected = true;
			$scope.selected = s;
		}
		else
			s.selected = false;
		
		for(var i = $scope.flowcharts.length - 1; i >= 0; i--) {
			if($scope.flowcharts[i].name === libraryService.flowchart.name) {
				$scope.flowcharts[i] = s;
				found = true;
			}
		}
		if(!found)
			$scope.flowcharts.push(s);
		
		$scope.saveAll();
	})
	
});