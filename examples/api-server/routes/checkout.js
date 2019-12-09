var express = require('express');
var router = express.Router();
var flagship = require('./../services/flagship');

router.post('/', function(req, res, next) {
  console.log('Got body:', req.body);
  if (req.body && req.body.transactionId) {
    const visitorId = '134546'; // mock visitorId (normally should be taken from DB, ...)
    const visitorContext = {
      buyerFrequency: Math.floor(Math.random() * 5)
    };
    const fsVisitor = flagship.newVisitor(visitorId, visitorContext);

    fsVisitor.on('ready', () => {
      console.log('fsVisitor.context', fsVisitor.context);
      fsVisitor.sendHits([
        {
          type: 'Transaction',
          data: {
            transactionId: req.body.transactionId,
            affiliation: 'transaction'
            // totalRevenue: req.body.totalRevenue,
            // shippingCost: req.body.shippingCost,
            // shippingMethod: req.body.shippingMethod,
            // currency: req.body.currency,
            // taxes: req.body.taxes,
            // paymentMethod:req.body.paymentMethod,
            // itemCount: req.body.itemCount,
            // couponCode: req.body.couponCode,
            // documentLocation: req.body.documentLocation,
            // pageTitle: req.body.pageTitle
          }
        }
      ]);
      res.sendStatus(200);
    });
  } else {
    res.sendStatus(422);
  }
});

module.exports = router;
