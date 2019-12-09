var express = require('express');
var router = express.Router();
var mock = require('./../mock/items')
var flagship = require('./../services/flagship')

/* GET users listing. */
router.get('/', function(req, res, next) {
  const items = mock;
  if(req.query.discount === 'blackfriday') {
    console.log('Black friday discount detected')
    const visitorId= '134546'; // mock visitorId (normally should be taken from DB, ...)
    const visitorContext= {
      buyerFrequency: Math.floor(Math.random() * (5) ),
    };
    const activateAllModifications = true;
    const fsVisitor = flagship.newVisitor(visitorId, visitorContext)

    fsVisitor.on('ready', () => {
      console.log('fsVisitor.context',fsVisitor.context)
      fsVisitor.getModifications([
        {
          key: 'globalDiscount',
          defaultValue: 0,
        }
      ], activateAllModifications)
      .then(({globalDiscount}) => {
        items.forEach(item => {
          item.discountPercentage = globalDiscount;
        });
        res.send(items);
      });
    })
  } else {
    res.send(items);
  }
});

module.exports = router;
