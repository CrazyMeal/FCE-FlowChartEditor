var app = angular.module('alubar-app');

app.controller('StateEditionCtrl', function($scope, StateFactory) {
  
  $scope.init = function(){
    jsPlumb.setContainer($('#working-zone'));

    Mousetrap.bind('del', function(){
      $scope.removeSelectedContent();
    });
    
    $scope.stateContent = StateFactory.getStateContent();
    $scope.uuid = 0;
    $scope.interactionZone = false;
    $scope.interactions = StateFactory.getInteractions();

    if($scope.stateContent.length != 0 || $scope.interactions.length != 0)
      $scope.initView($scope.stateContent, $scope.interactions);

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

  $scope.initView = function(stateContent, interactions){
    
    angular.forEach(stateContent, function(content, index){
      $scope.addContent(content.left, content.top, content.kind, true);
    });

    angular.forEach(interactions, function(interaction, index){
      $scope.addInteraction(true);
    });
  };

  $scope.console = function(){
    console.log(StateFactory.getInteractions());
  };

  $scope.removeContent = function(uuid){
    if(StateFactory.removeContent(uuid)){
      $("div").find("[uuid='" + uuid + "']").remove();
      console.log("Removed content with id: " + uuid);
    }
  };
  
  $scope.removeSelectedContent = function(){
    angular.forEach($('.selected'), function(divElement, index){
      $scope.removeContent($(divElement).attr('uuid'));
    });
  };

  $scope.removeInteraction = function(uuid){
    if(StateFactory.removeInteraction(uuid))
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
        $scope.addContent(posX, posY, getdroppedClass(drag), false);
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
      $scope.addInteraction(false);
      $scope.$apply();
    }
  };

  $scope.addInteraction = function(initiate){
    var newInterraction = {
        uuid: $scope.uuid,
        kind: ['interaction', 'tchat-component-white'] 
      };
      $scope.uuid++;
      //$scope.interactions.push(newInterraction);
      if(!initiate)
        StateFactory.insertInteraction(newInterraction);
  };

  $scope.addContent = function(posX, posY, classToAssign, initiate){
    var component = $('<div>').addClass('dropped-component');
        component.attr('uuid', $scope.uuid);
        component.css({
          'top': posY - $('#working-zone').offset().top - 25,
          'left': posX - $('#working-zone').offset().left - 25
        });
        
        assignClass(classToAssign, component);
        if(!initiate){
          $scope.stateContent.push({
            uuid: $scope.uuid,
            kind: classToAssign,
            top: posY,
            left: posX
          });
        }
        $scope.uuid++;
        //console.log($scope.stateContent);

        jsPlumb.draggable(component, {
          containment: $('#working-zone'),
          start: function(){
            if(component.hasClass('selected'))
              component.removeClass('selected');
            else
              component.addClass('selected');
          },
          stop: function(event) {
            var newLeft = event.el.offsetLeft;
            var newTop = event.el.offsetTop;
            var uuid = $(event.el).attr('uuid');
            
            updatePosition(uuid, newTop, newLeft);
          }
        });

        component.click(function(e){
          console.log(component.attr('uuid'));
          if(component.hasClass('selected'))
            component.removeClass('selected');
          else
            component.addClass('selected');
        });

        $('#working-zone').append(component);
  };

  getdroppedClass = function(droppedElement){
    if(droppedElement.hasClass("pdf-component")){
      return "pdf";
    }
    if(droppedElement.hasClass("video-component")){
      return "video";
    }
    if(droppedElement.hasClass("tchat-component")){
      return "tchat";
    }
  };

  assignClass = function(droppedClass, newComponent){
    if(droppedClass == "pdf"){
      newComponent.addClass("pdf-component");
      return true;
    }
    if(droppedClass == "video"){
      newComponent.addClass("video-component");
      return true;
    }
    if(droppedClass == "tchat"){
      newComponent.addClass("tchat-component");
      return true;
    }
    return false;
  };

  updatePosition = function(uuid, newTop, newLeft){
    angular.forEach($scope.stateContent, function(component){
      if(component.uuid == uuid){
        component.top = newTop;
        component.left = newLeft;
      }
    });
  };
});