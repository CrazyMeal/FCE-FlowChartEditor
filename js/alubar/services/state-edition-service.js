var app = angular.module('alubar-app');

app.factory('StateFactory', function(){
	var stateContent = [];
	var interactions = [];

	return {
		getStateContent : function(){
			return stateContent
		},
		setStateContent : function(newStateContent){
			stateContent = newStateContent;
		},
		clearStateContent : function(){
			stateContent = [];
		},
		removeContent : function(uuid){
			var del = false;
			angular.forEach(stateContent, function(content, index){
				if(content.uuid == uuid){
					stateContent.splice(index, 1);
					del = true;
				}
			});
			return del;
		},


		getInteractions : function(){
			return interactions;
		},
		setInteractions : function(newInteractions){
			interactions = newInteractions;
		},
		clearInteractions : function(){
			interactions = [];
		},
		removeInteraction : function(uuid){
			var del = false;
			angular.forEach(interactions, function(interaction, index){
				if(interaction.uuid == uuid){
					interactions.splice(index, 1);
					del = true;
				}
			});
			return del;
		}

		
	};
});