var app = angular.module('alubar-app');
app.controller('NewDocCtrl', function($scope){
    $scope.documentName = "Nouveau Document";
    $scope.states = [];

    setStateCss = function(state, e){
        state.container.css({
            'top': e.pageY- $('#plumbing-zone').offset().top,
            'left': e.pageX - $('#plumbing-zone').offset().left
        });
    };

    $scope.createNewState = function(){
        var mainContainer = $('<div>').attr('id', 'state' + $scope.states.length).addClass('state');
            
        var titleDiv = $('<div>').addClass('title').text('State ' + $scope.states.length);
        var connectInDiv = $('<div>').addClass('connectIn');
        var connectOutDiv = $('<div>').addClass('connectOut');
        mainContainer.append(titleDiv);
        mainContainer.append(connectInDiv);
        mainContainer.append(connectOutDiv);

        var state = {
            container: mainContainer,
            title: titleDiv,
            input: connectInDiv,
            outPut: connectOutDiv
        };

        $scope.states.push(state);
        return state;
    };

    $scope.init = function() {
        jsPlumb.ready(function() {
            jsPlumb.setContainer($('#plumbing-zone'));
            /*
            jsPlumb.bind('connection', function(info) {
              alert('New connection!\nFrom: ' + info.sourceId + '\nTo: ' + info.targetId);
            });
            */
            jsPlumb.importDefaults({
                Endpoints : [ [ "Dot", { radius:1 } ], [ "Dot", { radius:1 } ] ],
            });

            $('#plumbing-zone').dblclick(function(e) {
                var newState = $scope.createNewState();
                
                jsPlumb.draggable(newState.container, {
                    containment: $('#plumbing-zone')
                });
                
                setStateCss(newState, e);

                newState.container.dblclick(function(e) {
                    jsPlumb.detachAllConnections($(this));

                    angular.forEach($(this).children(), function(child){
                        jsPlumb.detachAllConnections(child);
                        child.remove();
                    });

                    $(this).remove();
                    e.stopPropagation();
                });

                jsPlumb.makeTarget(newState.input, {
                    //parent: newState.container,
                    connector:[ "Flowchart" ,{ stub:[40, 60], cornerRadius:5, alwaysRespectStubs:true }],
                    anchor: ['Continuous',{ faces:[ "left" ] }]
                });
                
                jsPlumb.makeSource(newState.outPut, {
                    //parent: newState.container,
                    connector:[ "Flowchart" ,{ stub:[40, 60], cornerRadius:5, alwaysRespectStubs:true }],
                    anchor: ['Continuous',{ faces:["right"] }],
                    connectorOverlays:[ 
                        [ "Arrow", { width:20, length:30, location:1, id:"arrow" } ]
                    ]
                });
                $('#plumbing-zone').append(newState.container);  
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