jQuery.event.props.push('dataTransfer');

var app = angular.module('alubar-app', ['ui.bootstrap','LocalStorageModule', 'lvl.directives.dragdrop']);

app.controller('MainCtrl', function ($scope, tabService) {
	$scope.tab = 1;

	this.selectTab = function(setTab) {
		if($scope.tab === 1)
			tabService.newRequest(setTab, $scope.tab);
		else
			$scope.tab = setTab;
	};

	$scope.$on('tabChangeAccepted',function(){
		if(tabService.isAccepted()){
			$scope.tab = tabService.getRequestedTab();
		}
	});

	this.isSelected = function(checkTab) {
		return $scope.tab === checkTab;
	};
});


