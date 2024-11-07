module.exports=(req,res,next)=>{                                            // Used For Checking Login Details.

    if(!req.isAuthenticated()){                                            // To check For The Login Of User.

        req.flash("error","Please login !!!.");
        res.redirect("/login");
    }else{
        next();
    }
}