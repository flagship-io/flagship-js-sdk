var express = require('express');
var router = express.Router();
var flagship = require('../services/flagship');

const createUUID = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

const createVisitor = function (req, nbVisitorLeftToCreate, finishCallback) {
    const visitorId = createUUID(); // mock visitorId (normally should be taken from DB, ...)
    const visitorContext = {
        buyerFrequency: Math.floor(Math.random() * 5)
    };
    const fsVisitor = flagship.newVisitor(visitorId, visitorContext);

    fsVisitor.on('ready', () => {
        var visitorList = req.app.get('visitorList');
        visitorList.push(fsVisitor);
        req.app.set('visitorList', visitorList);

        console.log('fsVisitor (id=' + visitorId + ') is ready');

        if (nbVisitorLeftToCreate === 0) {
            finishCallback(visitorList);
        } else {
            createVisitor(req, nbVisitorLeftToCreate - 1, finishCallback);
        }
    });
};

router.post('/create', function (req, res, next) {
    console.log('Got body:', req.body);
    if (req.body && req.body.nbVisitor) {
        createVisitor(req, req.body.nbVisitor, function (visitors) {
            res.status(200).send({
                totalVisitor: visitors.length,
                visitorIdList: visitors.map((v) => v.id)
            });
        });
    } else {
        res.sendStatus(422);
    }
});

router.get('/get', function (req, res, next) {
    const visitorId = req.query.id;
    if (visitorId) {
        var visitorList = req.app.get('visitorList');
        var visitor = visitorList.filter((v) => v.id === visitorId);
        if (visitor.length === 0) {
            res.sendStatus(404);
        } else {
            res.status(200).send(visitor[0]);
        }
    } else {
        res.sendStatus(422);
    }
});

module.exports = router;
