var $  = require('jquery'),
    db = require('../db');

exports.index = function(req, res){
  res.render('index');
};

exports.balances = function(req, res){
    var param = req.params.param;

    $.when(db.getExchangeBalances(param)).done(function (response) {
        res.send(response);
    });
};