const favicon = require('serve-favicon');
const express = require('express'),
	path = require('path');
const debug = require('debug')('NodePress:server');
const moment = require('moment');

const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// import Whale Config
const WhaleConfig = require('./config');


let routes = require('./routes/index');
const MongoClient = require('mongodb').MongoClient;

// add logs
let winston = require('winston');
let expressWinston = require('express-winston');

// run Whale
let Whale = {
	init: function (cb) {
		if (WhaleConfig.DB.MongoDB) {  // connect Mongo
			MongoClient.connect("mongodb://" + WhaleConfig.DBhost + "/" + WhaleConfig.DBdb, function (err, dbMongo) {
				if (err) throw err;
				global.DBMongo = dbMongo;
				cb()
			});
			return ''
		}
		cb()
	}
}

Whale.init(() => {
	let app = express();
	Configuration(app);
	if (WhaleConfig.extendFn) WhaleConfig.extendFn.fn()
	
	app.use(expressWinston.logger({
		transports: [
			new (winston.transports.Console)({
				json: true,
				colorize: true
			}),
			new winston.transports.File({
				filename: 'logs/success.' + moment().format('YYYY-MM-DD') + '.log'
			})
		]
	}));
	// request logs todo add limit
	routes(app);
	/*
	 * err request logs must after routes(app)
	 * */
	app.use(expressWinston.errorLogger({
		transports: [
			new winston.transports.Console({
				json: true,
				colorize: true
			}),
			new winston.transports.File({
				filename: 'logs/error.' + moment().format('YYYY-MM-DD') + '.log'
			})
		]
	}));
	
	ExpressRun(app);
})

function Configuration(app) {

// view engine setup
	app.set('port', process.env.PORT || 3000);
	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
	app.use(favicon(__dirname + '/public/favicon.ico'));
	app.use(logger('dev'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: false}));
	app.use(cookieParser());
	app.use(express.static(path.join(__dirname, 'public')));

// middle
	let session = require('express-session');
	let MongoStore = require('connect-mongo')(session);
	
	
	/**
	 connect-mongo
	 mongodb: 'mongodb://localhost:27017/myblog'
	 */
	/*	app.use(session({
	 secret: WhaleConfig.DBcookieSecret,
	 key: WhaleConfig.DBdb,//cookie name
	 cookie: {maxAge: 1000 * 60 * 60 * 24 * 30}, //30 days
	 store: new MongoStore({
	 url: "mongodb://" + WhaleConfig.DBhost + "/" + WhaleConfig.DBdb
	 /!*            db: WhaleConfig.DBdb,
	 host: WhaleConfig.DBhost,
	 port: WhaleConfig.DBport*!/
	 })
	 }));*/
	
	// catch
	process.on('exit', function () {
		console.log('process is exit bey ~ ~')
	});
	// err
	process.on('uncaughtException', function (err) {
		console.error('An uncaught error occurred!');
		console.error(err.stack);
	});
}

/**
 * start-up express app
 * @param app
 * @constructor
 * config set open socket.io
 */
function ExpressRun(app) {
	
	if (WhaleConfig.socket) {
		let _http = require('http').Server(app);
		let io = require('socket.io')(_http);
		handIo(io);
		
		_http.listen(app.get('port'), function () {
			console.log('Express server listening on port' + app.get('port'), 'express run');
		});
		
	} else {
		app.listen(app.get('port'), function () {
			console.log('Express server listening on port' + app.get('port'), 'express run');
		})
	}
// express run service
// wait a moment run
}

function development(app) {
	// debug
}

function production(app) {
	// undebug
}

function handIo(io) {
	console.log('hand socket io');
	io.on('connection', function (socket) {
		socket.emit('news', {hello: 'world'});
		
		socket.on('my other event', function (data) {
			console.log(data);
		});
		
		socket.on('disconnect', function () {
			console.log('user disconnected');
		});
		
		
		socket.on('chat message', function (msg) {
			console.log('message: ' + msg);
			io.emit('chat message', msg);
		});
	});
}

// open other mongo
function ExtendWildRun() {
	let extendWild = WhaleConfig.extendWild;
	MongoClient.connect("mongodb://" + extendWild.host + "/" + extendWild.db, function (err, database) {
		if (err) throw err;
		global[extendWild.dbName] = database;
	});
}

