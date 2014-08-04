var dashboardServices = angular.module('dashboardServices', []);

dashboardServices.factory('Balance', ['$http',
    function ($http) {
        return {
            getAll: function () {
                return $http.get('balances/all');
            },
            getExchangeBalances: function (param) {
                return $http.get('balances/' + param);
            },
            getTotalBalances: function () {
                return $http.get('totalbalances');
            },
            getLatestTrades: function (param) {
                return $http.get('latesttrades/' + param);
            },
            getTotalWinnings: function () {
                return $http.get('totalwinnings');
            }
        };
    }]);