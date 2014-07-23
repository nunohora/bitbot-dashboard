var dashboardControllers = angular.module('dashboardControllers', []);

dashboardControllers.controller('exBalancesCtrl', ['$scope', 'Balance',
    function ($scope, Balance) {
        $scope.exchangeBalances = [];

        $scope.currencies = [];

        $scope.totalBalances = [];

        Balance.getAll().success(function (response) {
            $scope.exchangeBalances = response;
        });

        $scope.$watch('exchangeBalances', function (newVal) {
            var currencies = [],
                exchanges = [],
                total = {};

            angular.forEach(newVal, function (exchange) {
                angular.forEach(exchange.balances, function (balance) {
                    if (currencies.indexOf(balance.currency) === -1 ) {
                        currencies.push(balance.currency);
                    }
                }, this);
            }, currencies);

            $scope.currencies = currencies;
        });
}]);

dashboardControllers.controller('tradesCtrl', ['$scope', function ($scope) {

}]);