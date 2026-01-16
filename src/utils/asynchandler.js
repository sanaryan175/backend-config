
// const asyncHandler=(requestHandler)=>{
//     (req,res,next)=>{
//         Promise.resolve(requestHandler(req,res,next))
//         .catch(err=>next(err))
//     }
// }

const asynchandler=(fn)=>async(req,res,next)=>{
    try{
        await fn(req,res,next)
    }
    catch(error){
        res.status(error.statusCode || 500).json({
            success:false,
            message:error.message,
            errors: error.errors
        })
    }
}
export {asynchandler}