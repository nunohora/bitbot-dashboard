var app = angular.module('app', ['dashboardControllers', 'dashboardServices']);

app.config(['$interpolateProvider', function ($interpolateProvider) {
    $interpolateProvider.startSymbol('{%').endSymbol('%}');
}]);