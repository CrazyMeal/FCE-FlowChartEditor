var app = angular.module('alubar-app');
app.controller('AdminCtrl', function($scope) {
    $scope.addUserCollapse = true;

    this.possibleRoles = [
        "admin",
        "creator",
        "traductor"
    ];
    this.tmpUser = {
        id: 0,
        username: "",
        roles: [],
        newRole: "Add a role"
    };
    this.tmpUserOrigin = {
        id: 0,
        username: "",
        roles: [],
        newRole: "Add a role"
    };

    this.users = [
        {
            id: 1,
            username: "Alice",
            roles: ["admin", "creator"],
            newRole: "Add a role"
        },
        {
            id: 2,
            username: "Bob",
            roles: ["admin", "traductor"],
            newRole: "Add a role"
        }
    ];

    this.getLastId = function(){
        var highestId = 0;
        angular.forEach(this.users, function(user, index){
            if(user.id > highestId)
                highestId = user.id;
        });
        
        return highestId;
    };
    this.selectRole = function(user, role){
        user.newRole = role;
    };

    this.addNewRole = function(user){
        if($.inArray(user.newRole, user.roles) == -1 && $.inArray(user.newRole, this.possibleRoles) != -1)
            user.roles.push(user.newRole);
    };
    this.addNewUser = function(){
        this.tmpUser.id = this.getLastId() + 1;
        this.tmpUser.newRole = "Ajouter un role";
        this.users.push(angular.copy(this.tmpUser));
        this.tmpUser = angular.copy(this.tmpUserOrigin);
    };

    this.hasRole = function(user, role) {
        var hasRole = false;
        console.log('Htest');
        if($.inArray(role, user.roles) != -1)
            hasRole = true;
        return hasRole;
    };
});
