var app = angular.module('alubar-app', []);

app.controller('MainCtrl', function ($scope) {
    this.tab = 3;

    this.selectTab = function(setTab) {
        this.tab = setTab;
    };

    this.isSelected = function(checkTab) {
        return this.tab === checkTab;
    };
});

app.controller('AdminCtrl', function($scope) {
    this.possibleRoles = [
        "admin",
        "createur",
        "traducteur"
    ];

    this.users = [
        {
            id: 1,
            username: "Alice",
            roles: ["admin", "createur"]
        },
        {
            id: 2,
            username: "Bob",
            roles: ["admin", "traducteur"]
        }
    ];
console.log('Htest');
    this.hasRole = function(user, role) {
        var hasRole = false;
        console.log('Htest');
        //console.log(element.attributes['hasRole'].value);
        if($.inArray(role, user.roles) != -1)
            hasRole = true;
        return hasRole;
    };
});
