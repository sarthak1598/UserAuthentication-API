const express = require("express") ; 
const router = express.Router() ; 

const con = require("../database/dbconfig") ; 

const {check , validationResult} = require('express-validator'); 

const jwt = require("jsonwebtoken") ;
const morgan = require("morgan") ; // request logging middleware  

const middleware = require('../middlewares/jwtauth') ; 

// registration route/ validations logic updated   
router.post('/register', [
    check('user').isLength({ min: 3 }),
      check('email').isEmail(),
        check('pass').isLength({ min : 3})
  ] , 
       (req , res) => { 
        let err = validationResult(req) ; 
          if(!err.isEmpty()){
             return res.status(500).json({erros : err.array()})
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

// Login/auth check route  / validated
 router.post("/login" , [
    check('email').isEmail() ,
    check('pass').isLength({ min: 3 }).isAlphanumeric()

  ] , (req , res) => { 
     console.log("route working") ; 

     let err = validationResult(req) ; 
     if(!err.isEmpty()){
        return res.status(500).json({erros : err.array()})
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
                  var token = jwt.sign(results[0].password , "authenticatemytoken");
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

// after logged in 
router.use(middleware)

router.get('/', (req , res ) => { 
     // let token = req.body.token ; 
  //   console.log(key)
     console.log("Authentication done , Authenticated to access the page")
       res.send("Authorised to access the page, Welcome")
});
module.exports = router ; 
