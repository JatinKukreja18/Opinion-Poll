// server.js

    // set up ========================
    var express  = require('express');
    var app      = express();                               // create our app w/ express
    var mongoose = require('mongoose');                     // mongoose for mongodb
    var morgan = require('morgan');             // log requests to the console (express4)
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

    // configuration =================

	mongoose.connect('mongodb://localhost:27017/database');     // connect to mongoDB database on modulus.io

	

    app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());

	
	// define model =================
    var Opinion = mongoose.model('Opinion', {
		user :	String,
		questionaire : String,
		col:[]
		
    });
	var Login = mongoose.model('Login', {
		ID: String,
		password: String,
		isAdmin: false
    });
	
	var Answer = mongoose.model('Answer', {
		QuesNo: Number,
		response: Number
    });
	// create todo and send back all opinions after creation
    app.post('/api/answers', function(req, res) {
			
        // create an entry information comes from AJAX request from Angular
        Opinion.create({ 
			QuesNo: req.body.quesNo,
			Response : req.body.response
			
        }, function(err, answers) {
            if (err)
                res.send(err);
			   // get and return all the todos after you create another
            Opinion.find(function(err,answers) {
                if (err)
                    res.send(err)
                res.json(answers);
            });

         });

    });
	app.post('/api/opinions', function(req, res) {
			
        // create an entry information comes from AJAX request from Angular
        Opinion.create({ 
			user:req.body.user,
			questionaire : req.body.questionaire,
			col:req.body.collection
        }, function(err, opinions) {
            if (err)
                res.send(err);
			   // get and return all the todos after you create another
            Opinion.find(function(err, opinions) {
                if (err)
                    res.send(err)
                res.json(opinions);
            });

         });

    }); 
	app.post('/api/logins', function(req, res) {
			console.log(req.body.ID);
        // create an entry information comes from AJAX request from Angular
        Login.create({ 
		
            ID: req.body.ID,
			password : req.body.pass,
			isAdmin : req.body.isAdmin
			
        }, function(err, logins) {
            if (err)
                res.send(err);
			   // get and return all the todos after you create another
            Login.find(function(err, logins) {
                if (err)
                    res.send(err)
                res.json(logins);
            });

         });

    });
		
	 // get all opinions
    app.get('/api/opinions', function(req, res) {

        // use mongoose to get all opinions in the database
        Opinion.find(function(err, opinions) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(opinions); // return all opinions in JSON format
        });
    });
	app.get('/api/logins', function(req, res) {

        // use mongoose to get all opinions in the database
        Login.find(function(err, logins) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(logins); // return all opinions in JSON format
        });
    });
	
	 // application -------------------------------------------------------------
    app.get('*', function(req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
    // listen (start app with node server.js) ======================================
    app.listen(8080);
    console.log("App listening on port 8080");
