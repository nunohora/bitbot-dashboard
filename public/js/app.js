var app = angular.module('app', ['dashboardControllers', 'dashboardServices', 'highcharts-ng']);

app.config(['$interpolateProvider', function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{%').endSymbol('%}');
}]);