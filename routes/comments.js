const express = require("express");
const Comment = require("../models/comments");
const Campground = require("../models/campgrounds");
const router = express.Router({
    mergeParams: true
});
const middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, async (req, res) => {
    try {
        const campground = await Campground.findById(req.params.id);
        res.render("comments/new", {
            campground: campground
        });
    } catch (err) {
        console.log(err);
    }
});

router.post("/", middleware.isLoggedIn, async (req, res) => {
    try {
        const campground = await Campground.findById(req.params.id);
        const commentObj = {
            text: req.body.text,
            author: {
                id: req.user._id,
                username: req.user.username
            }
        };
        campground.comments.push(await Comment.create(commentObj));
        campground.save();
        req.flash("success","Comment added successfully")
        res.redirect("/campgrounds/" + campground._id);
    } catch (err) {
        console.log(err);
    }
});

router.get("/:comment_id/edit", middleware.isAllowedComment, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.comment_id);
        res.render("comments/edit", {
            campground_id: req.params.id,
            comment: comment
        });
    } catch (err) {
        console.log(err);
        res.redirect("back");
    }
});

router.put("/:comment_id", middleware.isAllowedComment, async (req, res) => {
    try {
        await Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment);
        res.redirect("/campgrounds/" + req.params.id);
    } catch (err) {
        console.log(err);
        res.redirect("back");
    }
});

router.delete("/:comment_id", middleware.isAllowedComment, async (req, res) => {
    try {
        await Comment.findByIdAndDelete(req.params.comment_id);
        req.flash("success","Comment deleted");
        res.redirect("/campgrounds/" + req.params.id);
    } catch (err) {
        console.log(err);
        res.redirect("back");
    }
});

module.exports = router;