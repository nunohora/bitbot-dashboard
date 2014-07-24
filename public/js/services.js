var dashboardServices = angular.module('dashboardServices', []);

dashboardServices.factory('Balance', ['$http',
    function ($http) {
        return {
            getAll: function () {
                return $http.get('balances/all');
            },
            getExchangeBalances: function (param) {
                return $http.get('balances/' + param);
            }
        };
    }]);