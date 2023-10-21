const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');

const homeRouter = require('./routes/home');
const requirementsRouter = require('./routes/requirements');
const historicalRouter = require('./routes/historical');
const newRequirementRouter = require('./routes/newRequirement');
const createProjectRouter = require('./routes/createProject');
const assignStateRouter = require('./routes/assignState');
const projectsRouter = require('./routes/projects');
const grantRoleRouter = require('./routes/grantRole');
const setUserRouter = require('./routes/setUser');
const hashQueryRouter = require('./routes/hashQuery');
const registerRequestRouter = require('./routes/registerRequest');
const approveRegisterRequestRouter = require('./routes/approveRegisterRequest');
const approveRequirementRouter = require('./routes/approveRequirement');
const madeRequirementRouter = require('./routes/madeRequirement');
const reviewedRequirementRouter = require('./routes/reviewedRequirement');



const directoryPartials = path.join(__dirname, 'partials');

const app = express();
const hbs = require('hbs');
// Require handlebars and just-handlebars-helpers
const H = require('just-handlebars-helpers');

// Register just-handlebars-helpers with handlebars
H.registerHelpers(hbs);

// view engine setup
hbs.registerPartials(directoryPartials);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Session
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    },
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('./resources', express.static(__dirname + '/public'));

app.use('/public/stylesheets', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/fa', express.static(path.join(__dirname, '/node_modules/font-awesome/css')));
app.use('/fonts', express.static(path.join(__dirname, '/node_modules/font-awesome/fonts')));

// Middlewares
app.use((req, res, next) => {
    if (req.session.id) {
        res.locals.session = true;
        res.locals.user = req.session.id;
        res.locals.roll = req.session.roll;
        res.locals.userProjects = req.session.userProjects;
    }
    next();
});

//Routes
app.use('/', homeRouter);
app.use('/projects', projectsRouter);
app.use('/requirements', requirementsRouter);
app.use('/historical', historicalRouter);
app.use('/newRequirement', newRequirementRouter);
app.use('/createProject', createProjectRouter);
app.use('/assignState', assignStateRouter);
app.use('/grantRole', grantRoleRouter);
app.use('/setUser', setUserRouter);
app.use('/hashQuery', hashQueryRouter);
app.use('/registerRequest', registerRequestRouter);
app.use('/approveRegisterRequest', approveRegisterRequestRouter);
app.use('/approveRequirement', approveRequirementRouter);
app.use('/madeRequirement', madeRequirementRouter);
app.use('/reviewedRequirement', reviewedRequirementRouter);

//Auth Routes
app.use(require('./routes/authRoutes'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;