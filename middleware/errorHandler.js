const errorHandler = (err,req,res,next)=>{
    console.log('error found ' + err)
    res.status(500).send({msg:"something wrong happened try again !!", error: err})
}

module.exports = errorHandler