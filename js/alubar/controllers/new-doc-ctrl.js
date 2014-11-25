var app = angular.module('alubar-app');
app.controller('NewDocCtrl', function($scope){
    $scope.init = function() {
        /*
        jsPlumb.bind("ready", function() {
            console.log("Set up jsPlumb listeners (should be only done once)");
            
            jsPlumb.bind("connection", function (info) {
                $scope.$apply(function () {
                    console.log("Possibility to push connection into array");
                });
            });  
            
        });
        */
    };
});
jsPlumb.ready(function() {

  jsPlumb.setContainer($('#plumbing-zone'));
  var i = 0;

  $('#plumbing-zone').dblclick(function(e) {
    var newState = $('<div>').attr('id', 'state' + i).addClass('item');
    
    var title = $('<div>').addClass('title').text('State ' + i);
    var connect = $('<div>').addClass('connect');
    
    newState.css({
      'top': e.pageY- $('#plumbing-zone').offset().top,
      'left': e.pageX - $('#plumbing-zone').offset().left
    });
    
    newState.append(title);
    newState.append(connect);
    
     jsPlumb.draggable(newState, {
      containment: 'parent'
    });
    newState.dblclick(function(e) {
      jsPlumb.detachAllConnections($(this));
      jsPlumb.detachAllConnections($(this).children()[1]);
      

      $(this).remove();
      console.log($(this).children()[1]);
      e.stopPropagation();
    });
    $('#plumbing-zone').append(newState);

    jsPlumb.makeTarget(connect, {
        parent: connect,
        anchor: 'Continuous'
    });
    
    jsPlumb.makeSource(connect, {
      parent: connect,
      anchor: 'Continuous'
    });
    
    i++;    
  });  
});
/*
jsPlumb.ready(function() {
            jsPlumb.setContainer($('#plumbing-zone'));

            var i = 0;
            $('#plumbing-zone').dblclick(function(e) {
                var newState = $('<div>').attr('id', 'state' + i).addClass('sampleElement');
            
                var title = $('<div>').addClass('title').text('State ' + i);
                var connect = $('<div>').addClass('connect');
            
                newState.css({
                    'top': e.pageY,
                    'left': e.pageX - $('#plumbing-zone').offset().left
                });
                newState.append(title);
                newState.append(connect);
                
                jsPlumb.draggable(newState, {
                    containment: 'parent'
                });
                 
                newState.dblclick(function(e) {
                    jsPlumb.detachAllConnections($(this));
                    $(this).remove();
                    e.stopPropagation();
                });
                
                $('#plumbing-zone').append(newState);
 
                jsPlumb.makeTarget(newState, {
                    anchor: 'Continuous'
                });
                
                jsPlumb.makeSource(connect, {
                    parent: newState,
                    anchor: 'Continuous'
                });
                
                i++; 
            });
        });
    };
*/