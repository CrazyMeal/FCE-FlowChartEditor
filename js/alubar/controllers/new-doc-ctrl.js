var app = angular.module('alubar-app');

app.directive('ngConfirmClick', [
    function(){
        return {
            link: function (scope, element, attr) {
                var msg = attr.ngConfirmClick || "Are you sure?";
                var clickAction = attr.confirmedClick;
                element.bind('click',function (event) {
                    if ( window.confirm(msg) ) {
                        scope.$eval(clickAction)
                    }
                });
            }
        };
}]);

app.controller('NewDocCtrl', function($scope,$compile){
    $scope.ids = 0;
    $scope.stateEditionMode = true;
    $scope.documentName = "Nouveau Document";
    $scope.documentSaved = true;
    $scope.states = [];
    $scope.documentSaveState = "btn-success";

    setStateCss = function(state, e){
        state.container.css({
            'top': e.pageY- $('#plumbing-zone').offset().top,
            'left': e.pageX - $('#plumbing-zone').offset().left
        });
    };

    $scope.saveDocument = function(){
        if(!$scope.documentSaved){
            $scope.documentSaved = true;
            $scope.documentName = $scope.documentName.substring(0, $scope.documentName.length - 1);
            $scope.documentSaveState = "btn-success";
        }
    };


    $scope.validateNameEdition = function(){
        $scope.nameInEdition = {};
        stateEditionMode = true;
    };
    $scope.editState = function(stateDiv){
        var stateId = stateDiv.attr('id');
        angular.forEach($scope.states, function(state, index){
            if(state.id == stateId){
                $scope.nameInEdition = state;
                $scope.stateEditionMode = false;
                $scope.$apply();
                //state.name ="Super nom d'etape de la mort qui tue";
                console.log($scope.stateEditionMode);
            }
        });
    };

    $scope.createNewState = function(){
        //var mainContainer = $('<div name-state>').attr('id', $scope.ids).addClass('state');
        var newIndex = $scope.ids;
        var mainContainer = $($compile('<etape test="states['+newIndex+'].name" id="'+$scope.ids+'">')($scope));
        var connectInDiv = $('<div>').addClass('connectIn').attr('id', 'connectIn-' + $scope.ids);
        var connectOutDiv = $('<div>').addClass('connectOut').attr('id', 'connectOut-' + $scope.ids);
        mainContainer.append(connectInDiv);
        mainContainer.append(connectOutDiv);
        
        var state = {
            container: mainContainer,
            input: connectInDiv,
            output: connectOutDiv,
            id: $scope.ids,
            name : 'Default'
        };

        //mainContainer.append($compile("name-state")($scope));
        $scope.ids++;
        $scope.states.push(state);
        return state;
    };
    $scope.makeTarget = function(input){
        jsPlumb.makeTarget(input, {
            anchor: ['Continuous',{ faces:[ "left","top","bottom" ] }],           
            isSource:true,
            connector:[ "Flowchart", { stub:[20, 30], cornerRadius:5, alwaysRespectStubs:true } ],                                              
            dragOptions:{}
        });
    };

    $scope.makeSource = function(output){
        jsPlumb.makeSource(output, {
            anchor: ['Continuous',{ faces:[ "right" ] }],                
            maxConnections:-1,
            connector:[ "Flowchart", { stub:[20, 30], midpoint: 0.7, cornerRadius:5, alwaysRespectStubs:true } ],
            connectorStyle:{ strokeStyle:"#5c96bc", lineWidth:2, outlineColor:"transparent", outlineWidth:4 },
            dropOptions:{ hoverClass:"hover", activeClass:"active" },
            isTarget:true
        });
    };
    
    $scope.deleteAll = function(){
        angular.forEach($scope.states, function(state, index){
            jsPlumb.detachAllConnections(state.container);

            angular.forEach(state.container.children(), function(child){
                jsPlumb.detachAllConnections(child);
                child.remove();
            });

            state.container.remove();
            delete $scope.states[index];
        });
    };

    $scope.init = function() {
        jsPlumb.ready(function() {
            jsPlumb.setContainer($('#plumbing-zone'));
            jsPlumb.bind('beforeDrop', function(info) {
                console.log(info.targetId);
                console.log($('#'+info.targetId));
                if($('#'+info.targetId).hasClass('connectIn'))
                    return true;
                else
                    return false;
            });
            jsPlumb.importDefaults({
                Endpoint : ["Dot", {radius:2}],
                HoverPaintStyle : {strokeStyle:"#1e8151", lineWidth:2 },
                ConnectionOverlays : [
                    [ "Arrow", {
                        location:1,
                        id:"arrow",
                        length:14,
                        foldback:0.8
                    } ]
                ]
            });
            
            $('#plumbing-zone').dblclick(function(e) {
                jsPlumb.setSuspendDrawing(true);

                if($scope.documentSaved){
                    $scope.documentSaved = false;
                    $scope.documentName = $scope.documentName + "*";
                    $scope.documentSaveState = "btn-warning";
                    console.log($scope.documentName);
                }
                var newState = $scope.createNewState();
                
                jsPlumb.draggable(newState.container, {
                    containment: $('#plumbing-zone'),
                });
                
                setStateCss(newState, e);

                newState.container.dblclick(function(e) {
                    /*
                    jsPlumb.detachAllConnections($(this));

                    angular.forEach($(this).children(), function(child){
                        jsPlumb.detachAllConnections(child);
                        child.remove();
                    });

                    $(this).remove();
                    */
                    $scope.editState($(this));
                    e.stopPropagation();
                });
                
                $('#plumbing-zone').scroll(
                    function(){
                        jsPlumb.repaintEverything();
                    }
                );
                $scope.makeTarget(newState.input);
                $scope.makeSource(newState.output);

                $('#plumbing-zone').append(newState.container);
                jsPlumb.setSuspendDrawing(false, true);
                $scope.$apply();
            });  
        });
    };
});
app.directive('etape', function($compile){
    return {
        restrict: 'E',
        replace: true,
        scope: {
            test: '='
        },
        template: '<div class="state"><span class="noselect">{{test}}</span></div>',
        link: function(scope, element, attrs){
            jsPlumb.draggable(element, {
                containment: $('#plumbing-zone'),
            });
            console.log("replace");
        }
    };
});