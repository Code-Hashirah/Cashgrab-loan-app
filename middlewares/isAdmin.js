module.exports=(req,res,next)=>{
    if(req.session.user.role!="Admin"){
        res.redirect('/')
    }
}