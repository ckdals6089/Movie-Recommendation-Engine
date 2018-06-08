
const express = require('express'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    flash = require('connect-flash'),
    morgan = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    http = require('http'),
    neo4j = require('neo4j-driver').v1,
    path = require('path'),
    _ = require('lodash'),

DBconfig = require('./config/database.js'),
port = 3000,
hostname = 'localhost';

//DB configuration
mongoose.connect(DBconfig.url); //connect to the mongoDB
require('./config/passport.js')(passport);  //passport configuration



const showRouter = require('./routes/movieRouter');
const searchRouter = require('./routes/movieSearch');
const descriptionRouter = require('./routes/movieDescription');
const descriptionPersonRouter = require('./routes/personSearch');
const getGraph = require('./routes/movieGraph');


var router = express.Router();

var app = express();


//view, set Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Required elements for passport module
app.use(session({secret: 'ilovescotchscotchy'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


//Express application setup
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ exteneded : false}));
app.use(express.static(path.join(__dirname, 'public')));

//require passport
require('./routes/routes.js')(app, passport);

//Show Movies Router
app.use(showRouter)

//Search Movies Router
app.use(searchRouter)

//Description Movie Router
app.use(descriptionRouter)


//Description Movie Router
app.use(descriptionPersonRouter)

//get Gragph
app.use(getGraph)



app.listen(3000);
app.use('/', router);
module.exports = app;
