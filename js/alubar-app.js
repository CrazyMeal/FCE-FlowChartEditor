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

app.controller('AdminCtrl', function ($scope) {
    this.users = [
        {
            id: 1,
            username: "Alice",
            role: "admin"
        },
        {
            id: 2,
            username: "Bob",
            role: "createur"
        }
    ];
});
