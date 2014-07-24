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
                        total[balance.currency] = total[balance.currency] + balance.amount;
                    }
                }, this);
            }, currencies);

            $scope.currencies = currencies;
            $scope.totalBalances = total;
        });

        $scope.getExChart = function (exchange) {
            $rootScope.$broadcast('createChart', exchange);
        };
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
            yAxis: [{
                    id: 'axis-btc',
                    title: {
                        text: 'btc'
                    },
                    min: 0
                },
                {
                    id: 'axis-ltc',
                    title: {
                        text: 'ltc'
                    },
                    min: 0,
                    opposite: true
                },
                {
                    id: 'axis-usd',
                    title: {
                        text: 'usd'
                    },
                    min: 0
                }],
            title: {
                text: ''
            },
            xAxis: {currentMin: 0, currentMax: 30, minRange: 1},
            loading: true
        };

        $scope.$on('createChart', function (event, exchangeName) {
            var counter = 0;

            $scope.exChartConfig.title.text = exchangeName;

            Balance.getExchangeBalances(exchangeName).success(function (response) {
                var series = [],
                    yAxis = [];

                angular.forEach(response, function (data, idx) {
                    series.push({
                        name: idx,
                        data: data,
                        id: 'series-' + idx,
                        yAxis: 'axis-' + idx
                    });
                }, this);

                $scope.exChartConfig.series = series;
            });
        });
}]);

dashboardControllers.controller('tradesCtrl', ['$scope', function ($scope) {

}]);