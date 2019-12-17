const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const engine = require('ejs-locals');
//const path = require('path');
port = process.env.PORT || 3000;

app.listen(port);

console.log('API server started on: ' + port);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.engine('ejs', engine);
// set the view engine to ejs
app.set('view engine', 'ejs');

//app.set('views', path.join(__dirname + 'app/views/'));            // using path 
app.set('views', __dirname + '/app/views/');


app.use(express.static(__dirname + '/public'));

var routes = require('./app/routes/approutes'); //importing route
routes(app); //register the route

