// Middleware to restrict access to public routes for logged-in users; redirects to the home page.
const auth = (req,res,next)=>{
    if(req.session.user){
        return res.redirect("/user/home");
    }else{
        next();
    }
}

// Middleware to protect user-only routes; redirects to the login page if the user is not authenticated.
const procted = (req,res,next)=>{
    if(req.session.user){
        next();
    }else{
        return res.redirect("/user/login")
    }
}



module.exports = {auth,procted}