var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var itemsRouter = require('./routes/items');
var checkoutRouter = require('./routes/checkout');
var fsVisitorRouter = require('./routes/fsVisitor');

if (process.pid) {
    console.log('This process is your pid ' + process.pid);
}

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/items', itemsRouter);
app.use('/checkout', checkoutRouter);
app.use('/fsVisitor', fsVisitorRouter);

app.set('visitorList', []);

module.exports = app;
