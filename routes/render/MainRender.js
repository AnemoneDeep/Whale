/**
 * Route url
 * Define routes and don't change
 * @param app
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
module.exports = function (app) {
	
	app.get('/', function (req, res) {
		res.render('index', {
			title: 'home'
		   //	user: req.session.user  // from memory get  session？
		});
		
	});
};



