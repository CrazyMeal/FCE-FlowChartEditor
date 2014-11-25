var app = angular.module('alubar-app');
app.controller('NewDocCtrl', function($scope){
    $scope.documentName = "Nouveau Document";
    $scope.states = [];

    $scope.init = function() {
        jsPlumb.ready(function() {
            jsPlumb.setContainer($('#plumbing-zone'));

            var i = 0;
            /*
            jsPlumb.bind('connection', function(info) {
              alert('New connection!\nFrom: ' + info.sourceId + '\nTo: ' + info.targetId);
            });
            */
            $('#plumbing-zone').dblclick(function(e) {
                var newState = $('<div>').attr('id', 'state' + i).addClass('state');
            
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
                    e.stopPropagation();
                });

                jsPlumb.makeTarget(connect, {
                    parent: connect,
                    anchor: 'Continuous'
                });
                
                jsPlumb.makeSource(connect, {
                    parent: connect,
                    anchor: 'Continuous'
                });
                $('#plumbing-zone').append(newState);
                $scope.states.push(newState);
                console.log($scope.states);
                i++;    
            });  
        });
    };
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