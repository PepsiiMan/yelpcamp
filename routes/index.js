const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

router.get("/",(req,res)=>{
    res.render("landing");
});

router.get("/register", (req,res)=>{
    res.render("register");
});

router.post("/register", async(req,res)=>{
    try{
        const newUser = await new User({username: req.body.username});
        await User.register(newUser,req.body.password);
        passport.authenticate("local");
        req.flash("success","Welcome " + req.body.username +"!");
        res.redirect("/campgrounds");
    }
    catch(err){
        console.log(err);
        req.flash("error", err.message);
        res.render("register");
    }
});

router.get("/login", (req,res)=>{
    res.render("login");
});
router.post("/login",passport.authenticate("local",
{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}));

router.get("/logout", (req,res)=>{
    req.logOut();
    req.flash("success", "Logged you out");
    res.redirect("/campgrounds");
});

module.exports = router;