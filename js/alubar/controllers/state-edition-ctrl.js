var app = angular.module('alubar-app');

app.controller('StateEditionCtrl', function($scope) {
  $scope.stateContent = [];
  $scope.uuid = 0;

  assignClass = function(droppedElement, newComponent){
    if(droppedElement.hasClass("pdf-component")){
      newComponent.addClass("pdf-component");
      return "pdf";
    }
    if(droppedElement.hasClass("video-component")){
      newComponent.addClass("video-component");
      return "video";
    }
    if(droppedElement.hasClass("tchat-component")){
      newComponent.addClass("tchat-component");
      return "tchat";
    }
  };

  $scope.dropped = function(dragEl, dropEl, posX, posY) {
 	  var dragEl = document.getElementById(dragEl);
  	var dropEl = document.getElementById(dropEl);
  	var drag = angular.element(dragEl);
    var drop = angular.element(dropEl);

    if(drag.hasClass("component")){
      console.log("The element " + drag.attr('id') + " has been dropped on " + drop.attr("id") + "!");
      console.log("X: "+ posX + " Y: " + posY);
      
      var component = $('<div>').addClass('dropped-component');
      component.css({
        'top': posY - $('#working-zone').offset().top - 25,
        'left': posX - $('#working-zone').offset().left - 25
      });
      jsPlumb.draggable(component, {
        containment: $('#working-zone')
      });
      var componentKind = assignClass(drag, component);
      
      $scope.stateContent.push({
        id: $scope.uuid,
        kind: componentKind
      });

      $scope.uuid++;
      console.log($scope.stateContent);
      drop.append(component);
    }
  };
});