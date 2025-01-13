// Middleware to protect routes; redirects to admin login if the user is not authenticated.
const procted = (req, res, next) => {
    if (req.session.admin) {
        next();
    } else {
        return res.redirect("/admin/login");
    }
};


// Middleware to restrict access to public routes for logged-in admins; redirects to the dashboard.
const auth = (req,res,next)=>{
    if(req.session.admin){
        return res.redirect("/admin/dashboard");
    }else{
        next();
    }
}


module.exports = {procted,auth}