var dashboardControllers = angular.module('dashboardControllers', []);

dashboardControllers.controller('exBalancesCtrl', ['$scope', 'Balance',
    function ($scope, Balance) {
        $scope.req = [];

        $scope.exchangeBalances = [];

        $scope.currencies = [];

        Balance.getAll().success(function (response) {
            $scope.req = response;
        });

        $scope.$watch('req', function (newVal) {
            var currencies = [];

            angular.forEach(newVal, function (exchange) {
                angular.forEach(exchange.balances, function (balance) {
                    if (currencies.indexOf(balance.currency) === -1 ) {
                        currencies.push(balance.currency);
                    }
                }, this);
            }, currencies);

            $scope.currencies = currencies;

            $scope.exchangeBalances = $scope.req;
        });
}]);

dashboardControllers.controller('tradesCtrl', ['$scope', function ($scope) {

}]);