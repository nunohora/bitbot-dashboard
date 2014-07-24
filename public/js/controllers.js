var dashboardControllers = angular.module('dashboardControllers', []);

dashboardControllers.controller('exBalancesCtrl', ['$scope', '$rootScope', 'Balance',
    function ($scope, $rootScope, Balance) {
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

                    if (!total[balance.currency]) {
                        total[balance.currency] = balance.amount;
                    }
                    else {
                        total[balance.currency] = +(total[balance.currency] + balance.amount).toFixed(8);
                    }
                }, this);
            }, currencies);

            $scope.currencies = currencies;
            $scope.totalBalances = total;
        });

        $scope.getExChart = function (exchange) {
            $rootScope.$broadcast('createChart', exchange);
        };

        $scope.getTotalChart = function () {
            $rootScope.$broadcast('createTotalChart');
        }
}]);

dashboardControllers.controller('exchangeChartCtrl', ['$scope', 'Balance',
    function ($scope, Balance) {

        $scope.exChartConfig = {
            options: {
                chart: {
                    type: 'line',
                    zoomType: 'x'
                }
            },
            series: [],
            yAxis: [
                { id: 'axis-btc', title: { text: 'btc' }, min: 0 },
                { id: 'axis-ltc', title: { text: 'ltc' }, min: 0, opposite: true }
            ],
            title: { text: '' },
            tooltip: { shared: true },
            xAxis: {currentMin: 0, minRange: 1, allowDecimals: false},
            loading: true
        };

        function populateChartData (data) {
            var series = [];

            angular.forEach(data, function (dataItem, idx) {
                series.push({
                    name: idx,
                    data: dataItem,
                    id: 'series-' + idx,
                    yAxis: 'axis-' + idx
                });
            }, this);

            $scope.exChartConfig.series = series;
        }

        $scope.$on('createChart', function (event, exchangeName) {
            $scope.exChartConfig.title.text = exchangeName;

            Balance.getExchangeBalances(exchangeName).success(populateChartData);
        });

        $scope.$on('createTotalChart', function () {
            $scope.exChartConfig.title.text = 'Total Balances';

            Balance.getTotalBalances().success(function (response) {
                var series = [];

                angular.forEach(response, function (data, idx) {

                })
            });
        });
}]);

dashboardControllers.controller('tradesCtrl', ['$scope', function ($scope) {

}]);