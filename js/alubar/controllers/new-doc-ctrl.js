var app = angular.module('alubar-app');

app.controller('NewDocCtrl', function($scope,$compile,$timeout, localStorageService, libraryService){
    $scope.ids = 0;
    $scope.stateEditionMode = true;
    $scope.documentName = "New Document";
    $scope.documentSaved = true;
    $scope.states = [];
    $scope.connections = [];
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
            var lightStates = [];
            angular.forEach(jsPlumb.getSelector(".state"), function(stateDiv){
                var tmpState = {};
                tmpState.id = $(stateDiv).attr('id');
                tmpState.top = $(stateDiv).position().top;
                tmpState.left = $(stateDiv).position().left;
                tmpState.name = $(stateDiv).text();
                lightStates.push(tmpState);
            });
            libraryService.saveScenario($scope.documentName, angular.copy(lightStates), angular.copy($scope.connections));
            console.log('Saved states:');
            console.log(lightStates);
            console.log('Saved connections:');
            console.log($scope.connections);
        }
    };
    
    $scope.$on('load', function(){
		var scenario = libraryService.scenario;
		$timeout(function(){$scope.loadDocument(scenario.name, scenario.state, scenario.transition)}, 1);
    });

    $scope.loadDocument = function(name, states, connections){
        jsPlumb.setSuspendDrawing(true);
        $scope.deleteAll();

        $scope.documentName = name;
        // On importe tous les state
        angular.forEach(states, function(state, index){
            var newIndex = $scope.states.length;
            var mainContainer = $($compile('<etape test="states['+newIndex+'].name" id="'+state.id+'">')($scope));
            var connectInDiv = $('<div>').addClass('connectIn').attr('id', 'connectIn-' + state.id);
            var connectOutDiv = $('<div>').addClass('connectOut').attr('id', 'connectOut-' + state.id);
            mainContainer.append(connectInDiv);
            mainContainer.append(connectOutDiv);
            mainContainer.css({
                'top': state.top,
                'left': state.left
            });
            $scope.makeTarget(connectInDiv);
            $scope.makeSource(connectOutDiv);
            mainContainer.dblclick(function(e) {
                $scope.editState($(this));
                e.stopPropagation();
            });
            var newstate = {
                container: mainContainer,
                input: connectInDiv,
                output: connectOutDiv,
                id: state.id,
                name : state.name
            };
            $scope.states.push(newstate);
            $('#plumbing-zone').append(mainContainer);
        });
    
        // On relis tous les states entre eux selon les connections
        angular.forEach(connections, function(connection, index){
            jsPlumb.connect({source:connection.from, target:connection.to});
        });

        jsPlumb.setSuspendDrawing(false, true);
    };
    $scope.saveDocumentToLocalStorage = function(){
        if(!$scope.documentSaved){
            $scope.documentSaved = true;
            $scope.documentName = $scope.documentName.substring(0, $scope.documentName.length - 1);
            $scope.documentSaveState = "btn-success";

            localStorageService.clearAll();
            var lightStates = [];
            angular.forEach(jsPlumb.getSelector(".state"), function(stateDiv){
                var tmpState = {};
                tmpState.id = $(stateDiv).attr('id');
                tmpState.top = $(stateDiv).position().top;
                tmpState.left = $(stateDiv).position().left;
                tmpState.name = $(stateDiv).text();

                lightStates.push(tmpState);
            });
            localStorageService.set('savedStates', angular.copy(lightStates));
            localStorageService.set('savedConnections', angular.copy($scope.connections));

            console.log('Saved states:');
            console.log(lightStates);
            console.log('Saved connections:');
            console.log($scope.connections);
        }
    };

    $scope.importLastDocumentFromLocalStorage = function(){
        jsPlumb.setSuspendDrawing(true);
        $scope.deleteAll();
        var states = localStorageService.get('savedStates');
        var connections = localStorageService.get('savedConnections');
        
        // On importe tous les state
        angular.forEach(states, function(state, index){
            var newIndex = $scope.states.length;
            
            var mainContainer = $($compile('<etape test="states['+newIndex+'].name" id="'+state.id+'">')($scope));
            var connectInDiv = $('<div>').addClass('connectIn').attr('id', 'connectIn-' + state.id);
            var connectOutDiv = $('<div>').addClass('connectOut').attr('id', 'connectOut-' + state.id);

            mainContainer.append(connectInDiv);
            mainContainer.append(connectOutDiv);

            mainContainer.css({
                'top': state.top,
                'left': state.left
            });
            $scope.makeTarget(connectInDiv);
            $scope.makeSource(connectOutDiv);
            mainContainer.dblclick(function(e) {
                $scope.editState($(this));
                e.stopPropagation();
            });

            var newstate = {
                container: mainContainer,
                input: connectInDiv,
                output: connectOutDiv,
                id: state.id,
                name : state.name
            };
            $scope.states.push(newstate);
            $('#plumbing-zone').append(mainContainer);
        });

        // On relis tous les states entre eux selon les connections
        angular.forEach(connections, function(connection, index){
            jsPlumb.connect({source:connection.from, target:connection.to});
        });
        jsPlumb.setSuspendDrawing(false, true);
    };

    $scope.validateNameEdition = function(){
        $scope.nameInEdition = {};
        stateEditionMode = true;
        jsPlumb.recalculateOffsets(".connectOut");
        jsPlumb.repaintEverything();
    };
    $scope.editState = function(stateDiv){
        if($scope.documentSaved){
            $scope.documentSaved = false;
            $scope.documentName = $scope.documentName + "*";
            $scope.documentSaveState = "btn-warning";
        }

        var stateId = stateDiv.attr('id');
        console.log($scope.states);
        
        angular.forEach($scope.states, function(state, index){
            if(state != undefined){
                if(state.id == stateId){
                    $scope.nameInEdition = state;
                    $scope.stateEditionMode = false;
                    $scope.$apply();
                    console.log($scope.stateEditionMode);
                }
            }
        });

    };

    $scope.createNewState = function(){
        var newIndex = $scope.states.length;
        
        var mainContainer = $($compile('<etape test="states['+newIndex+'].name" id="'+$scope.states.length+'">')($scope));
        var connectInDiv = $('<div>').addClass('connectIn').attr('id', 'connectIn-' + $scope.states.length);
        var connectOutDiv = $('<div>').addClass('connectOut').attr('id', 'connectOut-' + $scope.states.length);
        mainContainer.append(connectInDiv);
        mainContainer.append(connectOutDiv);

        var state = {
            container: mainContainer,
            input: connectInDiv,
            output: connectOutDiv,
            id: $scope.states.length,
            name : 'Default'
        };
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
        jsPlumb.deleteEveryEndpoint();
        jsPlumb.detachEveryConnection();
        jsPlumb.repaintEverything();
        $scope.states = [];
        $scope.connections = [];
        $scope.ids = 0;
    };

    $scope.init = function() {
        jsPlumb.ready(function() {
            jsPlumb.setContainer($('#plumbing-zone'));
            
            jsPlumb.bind('beforeDrop', function(info) {
                //console.log(info.targetId);
                //console.log($('#'+info.targetId));
                if($('#'+info.targetId).hasClass('connectIn')){
                    if($scope.documentSaved){
                    $scope.documentSaved = false;
                    $scope.documentName = $scope.documentName + "*";
                    $scope.documentSaveState = "btn-warning";
                    $scope.$apply();
                }
                    return true;
                }
                else
                    return false;
            });

            jsPlumb.bind('connection', function(info) {
                info.connection.addOverlay([ "Label", { label:"Co-Label", id:"label", cssClass:"aLabel" }]);
                $scope.connections.push({ 
                    from: info.sourceId, 
                    to: info.targetId,
                    label: "Co-Label" 
                });
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
                }
                var newState = $scope.createNewState();
                
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
                $scope.makeTarget(newState.input);
                $scope.makeSource(newState.output);

                $('#plumbing-zone').append(newState.container);
                jsPlumb.setSuspendDrawing(false, true);
                $scope.$apply();
            });  
        });
    };
});