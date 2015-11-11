// We require these here, rather than in the files
// that references them directly because these files are client only
// and can't be included in code that also runs on the server

require('babel-polyfill');
require('./vendor/owl.carousel.js');
require('./vendor/jquery.accordion.js');
require('./vendor/jquery.waypoints.js');
