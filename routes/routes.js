var $  = require('jquery'),
    db = require('../db');

exports.index = function (req, res) {
  res.render('index');
};

exports.balances = function (req, res) {
    var param = req.params.param;

    $.when(db.getExchangeBalances(param)).done(function (response) {
        res.send(response);
    });
};

exports.totalBalances = function (req, res) {
    $.when(db.getTotalBalances().done(function (response) {
        res.send(response);
    }));
}

exports.latestTrades = function (req, res) {
    var param = req.params.param;

    $.when(db.getLatestTrades(param)).done(function (response) {
        res.send(response);
    });
}

exports.totalWinnings = function (req, res) {
    $.when(db.getTotalWinnings()).done(function (response) {
        res.send(response);
    });
}