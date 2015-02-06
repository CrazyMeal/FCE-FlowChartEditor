var app = angular.module('alubar-app');

app.factory('StateFactory', function(){
	var stateContent = [];
	
	var interactions = [];

    var stateId = -1;

    var templates = [{
    	id: "tpl-0",
    	name: "Instructions et video",
    	content: [{
    		kind: "pdf",
    		left: 86,
    		top: 140,
    		uuid: 0,
    		size: {height: 200, width: 150}
    	},
    	{
    		kind: "video",
    		left: 250,
    		top: 140,
    		uuid: 1,
    		size: {height: 200, width: 300}
    	}]
    },
    {
    	id: "tpl-1",
    	name: "Video et interactions",
    	content: [{
    		kind: "video",
    		left: 200,
    		top: 140,
    		uuid: 0,
    		size: {height: 200, width: 500}
    	}],
    	interactions: [
    	{
    		kind: ["interaction", "tchat-component-white"],
    		uuid: 1
    	},
    	{
    		kind: ["interaction", "tchat-component-white"],
    		uuid: 2
    	}
    	]
    }
    ];

	return {
		reset : function(){
			stateId = -1;
			stateContent = [];
			interactions = [];
		},

		softReset : function(){
			stateContent = [];
			interactions = [];
		},


		getStateContent : function(){
			return stateContent
		},
		setStateContent : function(newStateContent){
			stateContent = newStateContent;
		},
		clearStateContent : function(){
			stateContent = [];
		},
		insertContent : function(content){
			stateContent.push(content);
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
		insertInteraction : function(interaction){
			interactions.push(interaction);
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
		},

		getWorkingStateId : function(){
			return stateId;
		},
		setWorkingStateId : function(id){
			stateId = id;
		},



		getTemplates : function(){
			return templates;
		},
		
		getTemplateById : function(id){
			var templateToReturn;
			angular.forEach(templates, function(template){
				if(template.id == id)
					templateToReturn = angular.copy(template);
			});
			return templateToReturn;
		}
	};
});