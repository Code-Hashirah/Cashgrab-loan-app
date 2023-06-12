exports.error404=(req,res)=>{
    res.render('Errors/400.ejs',{
        title:"Error Page not found"
    })
}

exports.error500=(req,res,next)=>{
    res.status(500).render('Errors/500.ejs',{
        title:"Internal Server Error"
    })
}