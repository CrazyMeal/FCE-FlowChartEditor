var app = angular.module('alubar-app');

app.controller('StateEditionCtrl', function($scope, $timeout, $rootScope, StateFactory) {
  
  $scope.init = function(){
    $scope.plumbInstance = jsPlumb.getInstance();
    $scope.plumbInstance.setContainer($('#working-zone'));

    Mousetrap.bind(['del', 'backspace'], function(){
      $scope.removeSelectedContent();
    });
    
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
    
    if($scope.stateContent.length != 0)
      $timeout(function(){$scope.initView($scope.stateContent);}, 1);
  };

  $scope.initView = function(stateContent){
    angular.forEach(stateContent, function(content, index){
      $scope.addContent(content.left, content.top, content.kind, true);
    });
  };

  $scope.console = function(){
    console.log(StateFactory.getStateContent());
    //$scope.initView($scope.stateContent);
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
        if(!initiate){
          component.css({
            'top': posY - $('#working-zone').offset().top - 25,
            'left': posX - $('#working-zone').offset().left - 25
          });
        } else {
          component.css({
            'top': posY,
            'left': posX
          });
        }
        
        
        assignClass(classToAssign, component);
        if(!initiate){
          $scope.stateContent.push({
            uuid: $scope.uuid,
            kind: classToAssign,
            top: posY - $('#working-zone').offset().top - 25,
            left: posX - $('#working-zone').offset().left - 25
          });
        }
        $scope.uuid++;
        //console.log($scope.stateContent);

        
        $scope.plumbInstance.draggable(component, {
          containment: $('#working-zone'),
          start: function(){
            if(component.hasClass('selected'))
              component.removeClass('selected');
            else
              component.addClass('selected');
          },
          stop: function(event) {
            //console.log(event);
            var newLeft = event.el.offsetLeft;
            var newTop = event.el.offsetTop;
            var uuid = $(event.el).attr('uuid');
            
            updatePosition(uuid, newTop, newLeft);
          }
        });

        
        component.click(function(e){
          console.log(component.attr('uuid'));
            if(component.hasClass('selected')){
              component.removeClass('selected');
            }
            else {
              angular.forEach($('.selected'), function(divElement){
                $(divElement).removeClass('selected');
              });
              component.addClass('selected');
              //$scope.plumbInstance.toggleDraggable(component);
            }
            e.stopPropagation();
        });

        var resizing = false;
        component.dblclick(function(e){
          resizing = !resizing;
          if(resizing){
            $scope.plumbInstance.setDraggable(component, false);
            component.resizable({
              disabled: false,
              stop: function(event, ui) {
                jsPlumb.repaintEverything();
                console.log("stop resize");
              }
            });
          } else {
            $scope.plumbInstance.setDraggable(component, true);
            component.resizable({
              disabled: true
            });
          }
        });
        
        $('#working-zone').append(component);
  };

  $scope.$on('beginEdition', function(){
    $scope.init();
  });

  $scope.finishEdition = function(){
    $rootScope.$broadcast('finishEdition');
    
    angular.forEach($(".dropped-component"), function(divElement, index){
      divElement.remove();
    });

    //$scope.$parent.inStateEditionMode = !$scope.$parent.inStateEditionMode
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