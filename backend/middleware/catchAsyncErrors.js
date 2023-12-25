module.exports = asyErr => (req,res,next)=>{

    Promise.resolve(asyErr(req,res,next)).catch(next);
};