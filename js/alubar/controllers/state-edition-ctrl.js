var app = angular.module('alubar-app');

app.controller('StateEditionCtrl', function($scope, StateFactory) {
  
  $scope.init = function(){
    $scope.stateContent = StateFactory.getStateContent();
    $scope.uuid = 0;
    $scope.interactionZone = false;
    $scope.interactions = StateFactory.getInteractions();

    // Watching content to link to factory
    $scope.$watch($scope.stateContent, function (newValue) {
        if (newValue) StateFactory.setStateContent(newValue);
    });

    $scope.$watch(function () { return StateFactory.getStateContent(); }, function (newValue) {
        if (newValue) $scope.stateContent = newValue;
    });

    // Watching interactions to link to factory
    $scope.$watch($scope.interactions, function (newValue) {
        if (newValue) StateFactory.setInteractions(newValue);
    });

    $scope.$watch(function () { return StateFactory.getInteractions(); }, function (newValue) {
        if (newValue) $scope.interactions = newValue;
    });
  };

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

  updatePosition = function(uuid, newTop, newLeft){
    angular.forEach($scope.stateContent, function(component){
      if(component.uuid == uuid){
        component.top = newTop;
        component.left = newLeft;
      }
    });
  };

  $scope.console = function(){
    console.log(StateFactory.getStateContent());
    console.log($scope.stateContent);
    $scope.removeContent(0);
  };

  $scope.removeContent = function(uuid){
    StateFactory.removeContent(uuid);
    $("div").find("[uuid='" + uuid + "']").remove();
    console.log("Removed content with id: " + uuid);
  };
  
  $scope.removeInteraction = function(uuid){
    StateFactory.removeInteraction(uuid);
    console.log("Removed interaction with id: " + uuid);
  };

  $scope.dropped = function(dragEl, dropEl, posX, posY) {
 	  var dragEl = document.getElementById(dragEl);
  	var dropEl = document.getElementById(dropEl);
  	var drag = angular.element(dragEl);
    var drop = angular.element(dropEl);

    if(drag.hasClass("component")){
      if(!drag.hasClass('tchat-component')){
        console.log("The element " + drag.attr('id') + " has been dropped on " + drop.attr("id") + "!");
        console.log("X: "+ posX + " Y: " + posY);
        
        var component = $('<div>').addClass('dropped-component');
        component.attr('uuid', $scope.uuid);
        component.css({
          'top': posY - $('#working-zone').offset().top - 25,
          'left': posX - $('#working-zone').offset().left - 25
        });

        var componentKind = assignClass(drag, component);
        
        $scope.stateContent.push({
          uuid: $scope.uuid,
          kind: componentKind,
          top: posY,
          left: posX
        });

        $scope.uuid++;
        //console.log($scope.stateContent);

        jsPlumb.draggable(component, {
          containment: $('#working-zone'),
          stop: function(event) {
            var newLeft = event.el.offsetLeft;
            var newTop = event.el.offsetTop;
            var uuid = $(event.el).attr('uuid');

            updatePosition(uuid, newTop, newLeft);    
          }
        });
        drop.append(component);
      }
    }
  };
  $scope.droppedInteraction = function(dragEl, dropEl, posX, posY) {
    var dragEl = document.getElementById(dragEl);
    var dropEl = document.getElementById(dropEl);
    var drag = angular.element(dragEl);
    var drop = angular.element(dropEl);

    console.log("Dropped in interaction zone");
    if(drag.hasClass("tchat-component")){
      var newInterraction = {
        uuid: $scope.uuid,
        kind: ['interaction', 'tchat-component-white'] 
      };
      $scope.uuid++;
      $scope.interactions.push(newInterraction);
      $scope.$apply();
    }
  };
});