/**
 * Route url
 * todo not done yet
 */
let redirectChange = function (req, res, destination) {
	switch (destination) {
		case 'admin':
			if (req.session.user) {
				res.redirect('/admin')
			} else {
				res.redirect('/login')
			}
			break
	}
};

function errHanld(app){
	app.use((err, req, res, next) => {
		console.log(err.status, '---------------------')
		res.status(err.status || 500);
		res.render("error", {
			message: err.message,
			error: {}
		});
	});
	
}

module.exports = function (app) {
	
	app.get('/', function (req, res) {
		res.render('index', {
			title: 'home'
		   //	user: req.session.user  // from memory get  session？
		});
		
	});
	errHanld(app)
};



