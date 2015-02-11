var app = angular.module('alubar-app');

app.controller('StateEditionCtrl', function($scope, $timeout, $rootScope,$compile, StateFactory) {
  
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
    $scope.templates = StateFactory.getTemplates();
    $scope.newtemplate ={};
    $scope.newtemplate.templatename = "";

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
      if(content.size == undefined)
        $scope.addContent(content.left, content.top, content.kind, true, undefined, index);
      else
        $scope.addContent(content.left, content.top, content.kind, true, content.size, index);
    });
  };

  $scope.console = function(){
    console.log($scope.interactions);
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
        var droppedClass = getdroppedClass(drag);
        var newComponent = $scope.addContent(posX, posY, droppedClass, false, undefined);
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
  $scope.addTextContent = function(){

  };
  $scope.addContent = function(posX, posY, classToAssign, initiate, componentSize, initIndex){
    if(!initiate){
      $scope.stateContent.push({
        uuid: $scope.uuid,
        kind: classToAssign,
        contenttext: "Default <br /> text",
        top: posY - $('#working-zone').offset().top - 25,
        left: posX - $('#working-zone').offset().left - 25
      });
    }

    var component = $('<div>').addClass('dropped-component');
    component.attr('uuid', $scope.uuid);
    
    if(classToAssign == "text-zone"){
      console.log("this is text");
      var uuid = $scope.uuid;
      var indexInStateContent = $scope.stateContent.length - 1;
      
      console.log($scope.stateContent[indexInStateContent]);
      
      if(initIndex != undefined)
        indexInStateContent = initIndex;

      component = $($compile('<textcomponent text="stateContent['+indexInStateContent+'].contenttext" uuid="'+uuid+'">')($scope));
    }
    
    
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
      if(componentSize != undefined){
        component.css({
          'height': componentSize.height,
          'width': componentSize.width
      });
      }
    }

    assignClass(classToAssign, component);
    
    
        
    $scope.plumbInstance.draggable(component, {
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
        if(component.hasClass('selected')){
          component.removeClass('selected');
        }
        else {
          angular.forEach($('.selected'), function(divElement){
            $(divElement).removeClass('selected');
          });
          component.addClass('selected');
        }
        e.stopPropagation();
    });
    
    component.resizable({
      disabled: false,
      stop: function(event, ui) {
        $scope.plumbInstance.repaintEverything();

        updateSize($(component).attr('uuid'), ui.size.height, ui.size.width);
        console.log("Updated size of " + $(component).attr('uuid') + " new height>" + ui.size.height + " new with>" + ui.size.width);
      }
    });
    
    $('#working-zone').append(component);
    $scope.uuid++;
    $scope.$apply();
    return component;
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

  $scope.loadTemplate = function(id){
    StateFactory.softReset();
    angular.forEach($(".dropped-component"), function(divElement, index){
      divElement.remove();
    });

    console.log("Loading template> " + id);
    
    var templateChosen = StateFactory.getTemplateById(id);
    console.log(templateChosen);
    $scope.initView(templateChosen.content);
    
    if(templateChosen.content != undefined){
      StateFactory.setStateContent(templateChosen.content);
      $scope.stateContent = templateChosen.content;
    }
    if(templateChosen.interactions != undefined){
      StateFactory.setInteractions(templateChosen.interactions);
      $scope.interactions = templateChosen.interactions;
    }
    console.log($scope.stateContent);
  };

  $scope.saveAsTemplate = function(){
    console.log("Saving as template " + $scope.newtemplate.templatename);
    StateFactory.insertTemplate($scope.newtemplate.templatename, $scope.stateContent, $scope.interactions);
    $scope.newtemplate.templatename = "";
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
    if(droppedElement.hasClass("text-zone-component")){
      return "text-zone";
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
    if(droppedClass == "text-zone"){
      //newComponent.addClass("text-zone-component");
      return true;
    }
    return false;
  };

  updateSize = function(uuid, newHeight, newWidth){
    angular.forEach($scope.stateContent, function(component){
      if(component.uuid == uuid){
        var size = {
          height: newHeight,
          width: newWidth
        };
        component.size = size;
      }
    });
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