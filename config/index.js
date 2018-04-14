/**
 * whale
 *       merge config
 *
 *
 * @type {{}}
 */

let MongoDBOption = {
	cookieSecret: 'Whale',
	db: 'Whale',
	host: 'localhost',
	port: 27017
};

let WhaleConfig = {
	DB: {
		MongoDB: false
	},
	socket: false, //
	debug: {
		logs: true // close
	},
	extendFn: false // add other fn
}

if (WhaleConfig.DB.MongoDB) {
	WhaleConfig.DB.MongoDB = MongoDBOption
}

module.exports = WhaleConfig