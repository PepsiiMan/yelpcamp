const express = require("express");
const router = express.Router();
const Campground = require("../models/campgrounds");
const middleware = require("../middleware");

router.get("/", (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if (err) {
            console.log("error");
        } else {
            res.render("campgrounds/index", {
                campgrounds: campgrounds
            });
        }
    });
});

router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

router.post("/", middleware.isLoggedIn, async (req, res) => {
    try {
        const camp = await {
            name: req.body.name,
            image: req.body.image,
            description: req.body.description,
            author: {
                id: req.user._id,
                username: req.user.username
            }
        }
        Campground.create(camp);
        res.redirect("/campgrounds");
    } catch (err) {
        req.flash("error", "Something went wrong");
        console.log(err);
    }
});

router.get("/:id", async (req, res) => {
    try {
        const camp = await Campground.findById(req.params.id).populate("comments").exec();
        res.render("campgrounds/show", {
            campground: camp
        });
    } catch (err) {
        console.log(err);
    }
});

router.get("/:id/edit", middleware.isAllowed, async (req, res) => {
    try {
        const camp = await Campground.findById(req.params.id);
        res.render("campgrounds/edit", {
            campground: camp
        });
    } catch (err) {
        console.log(err);
    }
});

router.put("/:id", middleware.isAllowed, async (req, res) => {
    try {
        await Campground.findByIdAndUpdate(req.params.id, req.body.campground);
        res.redirect("/campgrounds/" + req.params.id);

    } catch (err) {
        console.log(err);
        res.redirect("/campgrounds");
    }
});

router.delete("/:id", middleware.isAllowed, async (req, res) => {
    try {
        await Campground.findByIdAndDelete(req.params.id);
        res.redirect("/campgrounds");
    } catch (err) {
        console.log(err);
        req.flash("success", "Campground deleted");
        res.redirect("/campgrounds");
    }
});

module.exports = router;