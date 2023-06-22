module.exports=(req,res,next)=>{
    if(req.session.user.role!="Admin"){
    return    res.redirect('/sign-in')
    }
}