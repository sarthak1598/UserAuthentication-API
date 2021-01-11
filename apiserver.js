
const con = require("./dbconfig") ; 
const express = require("express");
const bodyparser = require("body-parser") ;
const jwt = require("jsonwebtoken") ;

const priv_key = "secretjwtauth" ; 
process.env.AUTH_KEY = "jwtauthtokenpassword"; 
const app  = express() ;
let router = express.Router() ; 
app.use(bodyparser.urlencoded({extended:true})) ; 
app.use(bodyparser.json()) ; 

// api route handling methods -->> entry route
app.get('/' , (req , res) => { 
    res.send("Welcome to the Tokenised Authentication Api") ; 
});

// registration route  
app.post('/register', (req , res) => { 
    // json input query  
    var users = { 
       "name" : req.body.user,
       "email" : req.body.email, 
       "password": req.body.password
    }

    con.query('INSERT INTO users SET VALUES ?', users , (error , results , fields) => {
        if(error){ 
            // insert query   
            res.send("Error proccesing the query");
           
        }
        else{ 
            
             res.json({status:true , info: results , ack : " Registration success"});
        }
    });

}); 

// Login/auth check route  
 app.post("/login" , (req , res) => { 
     console.log("route working");
    let email = req.body.email ; 
    let pass = req.body.pass ; 

    // query ;
    con.query('select * from users where email = ?' , [email] , (error , results , fields) => {  
         if(!error){

             if(results.length == 0 ){ 
                  res.status(404).send("User not found") ; 
             }

             if(results.length > 0 ){ 
                 // return res.status
               if(pass == results[0].password){    
                      // jwt token generated after success login 
                  var token = jwt.sign(results[0].password , priv_key);
                  console.log(token) ; 
               // send response as token value 
               res.json({status:"user found" , User_token : token });
        
               } 
               else{ 
                    return res.status(400).json({status : "Incorrect password" , info:"Login failed!!"});
               } 

             }
         }

         else{ 
             res.send("Query ecxecution failed") ;    
         }
    });
}); 


// new route for jwt authentication to be hitted with token passed as json using express middlewares
app.use('/tokenauth' , router);
   router.use((req , res) => { 
       let token = req.body.token ; 
       if(token){
        jwt.verify(token , priv_key ,function(err){
            if(err){
                res.status(500).send('Token Invalid !');
            }

	      else{
                return res.json({status:"Auth Token verified" , message:"user authenticated successsfully"}) ; 
            }

        });
    }

    else{
        res.send('Please send a token')
    }

});

// ser
const port = process.env.PORT || 8000 ; 
app.listen(port , () => { 
    console.log("Server started on port "+port) ; 
});