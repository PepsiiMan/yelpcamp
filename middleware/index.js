const Comment = require("../models/comments");
const Campground = require("../models/campgrounds");


const middlewareObj = {
    isAllowed: async (req, res, next) => {
        try {
            const camp = await Campground.findById(req.params.id);
            if (req.isAuthenticated()) {
                if (camp.author.id.equals(req.user._id)) {
                     return next();
                }
            }
            req.flash("error","You don't have permission to do that");
            res.redirect("back");
        } catch (err) {
            req.flash("error", "Campground not found");
            console.log(err);
            res.redirect("back");
        }
    },
    isAllowedComment: async (req, res, next) => {
        try {
            const comment = await Comment.findById(req.params.comment_id);
            if (req.isAuthenticated()) {
                if (comment.author.id.equals(req.user._id)) {
                    return next();
                }
            }
            req.flash("error", "You don't have permission to do that")
            res.redirect("back");
        } catch (err) {
            req.flash("error", "Comment not found")
            console.log(err);
            res.redirect("back");
        }
    },
    isLoggedIn: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/login");
    }
};

module.exports = middlewareObj;