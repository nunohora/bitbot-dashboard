var $  = require('jquery'),
    _  = require('underscore'),
    db = require('../db'),
    sys = require('sys'),
    exec = require('child_process').exec;

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
    var firstLtc, firstBtc, currentLtc, currentBtc,
        resp = { current: 0, first: 0 },
        finalResp = { current: 0, profit: 0 };

    $.when(db.getTotalWinnings()).done(function (response) {
        var firstUsd = _.findWhere(response.oldest.balances, { currency: 'usd' }),
            currentUsd = _.findWhere(response.newest.balances, { currency: 'usd' });

        console.log(response);

        resp.first += +firstUsd.amount;
        resp.current += +currentUsd.amount;

        $.getJSON('https://btc-e.com/api/2/btc_usd/ticker', function (data) {
            firstBtc = _.findWhere(response.oldest.balances, { currency: 'btc' });
            currentBtc = _.findWhere(response.newest.balances, { currency: 'btc' });

            resp.first += +(firstBtc.amount * data.ticker.last).toFixed(8);
            resp.current += +(currentBtc.amount * data.ticker.last).toFixed(8);

            $.getJSON('https://btc-e.com/api/2/ltc_usd/ticker', function (data1) {
                firstLtc = _.findWhere(response.oldest.balances, { currency: 'ltc' });
                currentLtc = _.findWhere(response.newest.balances, { currency: 'ltc' });

                resp.first += +(firstLtc.amount * data1.ticker.last).toFixed(8);
                resp.current += +(currentLtc.amount * data1.ticker.last).toFixed(8);

                finalResp.current = resp.current;
                finalResp.profit = +(resp.current - resp.first).toFixed(8);

                res.send(finalResp);
            });
        });
    });
}

exports.isAlive = function (req, res) {
    function puts(error, stdout, stderr) {
        console.log('hereeeee');
        console.log(stdout);
        console.log(error);
        console.log(stderr);
        sys.puts(stdout);
    }

    exec("telnet localhost 3000", puts);
}