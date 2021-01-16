// must impot all modules before exporting into the projecy entry file 

const jwt = require("jsonwebtoken") 
const priv_key = "jwtauthtokenpasswihihhlkhnlkhlkd" ; 
exports.priv_key = priv_key ;

const middleware = function checktoken(req , res ,next){
    // let info = req.body.token  ; 
   if(req.body.token){
       jwt.verify(req.body.token , "authenticatemytoken",  (err) => {
            if(err){
                return res.status(500).send("Token is not valid !! auth failed") ;
            }     
            else{
              //   return res.json({status:"Auth Token verified" , message:"user authenticated successsfully"}) ; 
              next() ;
           }
       })
   }

   else{ 
       res.send("Please provide the auth token !");
   }
}

module.exports = middleware ; 