var app = angular.module('alubar-app');

app.controller('StateEditionCtrl', function($scope) {
	$scope.dropped = function(dragEl, dropEl, posX, posY) {
 		var dragEl = document.getElementById(dragEl);
  		var dropEl = document.getElementById(dropEl);
  		var drag = angular.element(dragEl);
      	var drop = angular.element(dropEl);


    	console.log("The element " + drag.attr('id') + " has been dropped on " + drop.attr("id") + "!");
    	console.log("X: "+ posX + " Y: " + posY);

    	var component = $('<div>').addClass('dropped-component');
    	component.css({
            'top': posY - $('#working-zone').offset().top - 25,
            'left': posX - $('#working-zone').offset().left - 25
        });

        drop.append(component);
    };
});