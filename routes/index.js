/** Restfull
 *  Route drive the interface
 *  1. Route url
 *  2. Restfull API
 *
 *  Route url
 */
let MainRender = require('./render/MainRender');

module.exports = function (app) {
	MainRender(app);
};