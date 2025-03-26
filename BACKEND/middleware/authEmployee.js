

const authEmployee =async (req,res,next) => {

    try {
        const {etoken} = req.headers
        if (!etoken) {
            return res.json({success:false,message:'Not Authorized Login Again'})

        }
        const token_decode = Jwt.verify(etoken,process.env.JWT_SECRET)
        req.body.empId = token_decode.id
        next()
    }catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}



export default authEmployee