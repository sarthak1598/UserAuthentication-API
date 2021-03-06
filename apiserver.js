
const express = require('express') ; 
const app = express() ;
const helmet = require('helmet') ; 

const sanitize = require('express-validator') ; 
const bodyparser = require("body-parser") ;
const jwt = require("jsonwebtoken") ;
//const user_routes
const morgan = require("morgan") ; // request logging middleware  
const router = require('./routes/user_route');

process.env.AUTH_KEY = "jwtauthtokenpassword"; 

// middlewares registration including security 

app.use(helmet()) ; 
app.use(bodyparser.urlencoded({extended:true})) ; 
app.use(bodyparser.json()) ; 
//app.use(sanitize) ; 
// logging
app.use(morgan('dev'));


const port = process.env.PORT || 8000 ; 

app.listen(port , () => {
    console.log("Server started on port "+port) ; 

});

app.use('/api' , router) ; 