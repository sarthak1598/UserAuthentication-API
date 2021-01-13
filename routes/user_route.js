const express = require("express") ; 
const router = express.Router() ; 
const con = require("../database/dbconfig") ; 

const jwt = require("jsonwebtoken") ;
const morgan = require("morgan") ; // request logging middleware  
// data validation middleware joi 
const Joi = require('joi');

const priv_key = "jwtauthtokenpassword" ; 
// main home route 
router.get('/' , (req , res) => { 
    res.send("Welcome to the Tokenised Authentication Api") ; 
});

// registration route  
router.post('/register', (req , res) => { 
    // as a dynamic query string passed in url 
    const {error} = joivalidation(req.body);

    if(error)
    {
        return res.status(403).send(error.details[0].message)
    } 

       let name = req.query.user ; 
       let email = req.query.email ; 
       let password = req.query.pass ; 

       let query ="INSERT INTO users (name, email , password) VALUES (?,?,?)"; 
    con.query(query , [name , email , password] ,(error , results , fields) => {
        if(error){ 
            // insert query   
            res.send("Error proccesing the query");
           
        }
        else{ 
            
             res.status(201).json({status:true , info: results , response : " Registration success"});
        }
    });

}); 

// Login/auth check route  
 router.post("/login" , (req , res) => { 
     console.log("route working");
     const {error} = joivalidation(req.body);

if(error)
{
    return res.status(403).send(error.details[0])
}
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
router.post('/tokenauth' , (req , res) => { 
       let token = req.body.token ; 
            checktoken(res , token) ; 
});

// jwt authentication fucntion ; 
function checktoken(res ,info){
    if(info){
        jwt.verify(info , priv_key , (err) => {
             if(err){
                 return res.status(500).send("Token is not valid !! auth failed") ;
             }     
             else{
                return res.json({status:"Auth Token verified" , message:"user authenticated successsfully"}) ; 
            }
        })
    }

    else{ 
        res.send("Please provide the auth token !");
    }
}

function joivalidation(info){ 
    let Schema = Joi.object().keys({ 

       // 'name': Joi.string().min(4).max(50).required(),
            'email': Joi.string().email() ,
                'Password': Joi.string().min(8).max(20)
    })
    return Schema.validate(info) ;
} 

module.exports = router ; 
