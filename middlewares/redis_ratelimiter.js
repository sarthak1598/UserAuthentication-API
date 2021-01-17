const redis = require('ioredis')
 const client = redis.createClient({
   port: process.env.REDIS_PORT || 6379,
       host: process.env.REDIS_HOST || 'localhost', 

 })

 client.on('connect', function () {
   console.log('connected to the redis server');
 });

 // error handle
 client.on('error' , (err)=>{
     console.log("erro connecting to reddis")
     return 
 })



// reddis
const reddis = async function checkstatus(req , res ,  next){
    // let res
   let counter
    let ip = req.ip // exported the ip address of current request 
    try {
        counter = await client.incr(ip)
    } catch (err) {
        console.error('isOverLimit: could not increment key')
        throw err
    }

    console.log(`${ip} has value: ${counter}`)
    client.expire(ip, 5) 
    if (counter > 10) {
        return res.status(429).send('Server overloaded with so many requests , Server alert!!')
    }

    else{ 
        next()
    } 
}
module.exports = reddis