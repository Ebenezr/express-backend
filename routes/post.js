const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Post = require("../models/Post");
const privateKey = process.env.JWT_PRIVATE_KEY;

router.use(function (req, res, next) {
	if (req.header("Authorization")) {
		try {
			req.payload = jwt.verify(req.header("Authorization"), privateKey, {
				algorithms: ["RS256"],
			});
		} catch (error) {
			return res.status(401).json({ error: error.message });
		}
	} else {
		return res.status(401).json({ error: "Unauthorized" });
	}
	next();
});

// POST
router.post("/", async function (req, res) {
	const post = new Post({
		title: req.body.title,
		content: req.body.content,
		author: req.payload.id,
	});
	await post
		.save()
		.then((savedPost) => {
			return res.status(201).json({
				id: savedPost._id,
				title: savedPost.title,
				content: savedPost.content,
				author: savedPost.author,
			});
		})
		.catch((error) => {
			return res.status(500).json({ error: error.message });
		});
});
// UPDATE
router.get("/post/:id/update", async function (req, res) {
	let postID = req.body.postID;
	let upDateData = {
		title: req.body.title,
		content: req.body.content,
		author: req.payload.id,
	};
	await Post.findByIdAndUpdate(postID, { $set: upDateData })
		.then((savedPost) => {
			return res.status(201).json({
				id: savedPost._id,
				title: savedPost.title,
				content: savedPost.content,
				author: savedPost.author,
			});
		})
		.catch((error) => {
			return res.status(500).json({ error: error.message });
		});
});
// DELETE
router.get("/post/:id/delete", async function (req, res) {
	let postID = req.body.postID;
	await Post.findByIdAndRemove(postID)
		.then(() => {
			return res.status(201).json({
				message: "post deleted success",
			});
		})
		.catch((error) => {
			return res.status(500).json({ error: error.message });
		});
});

// GET
router.get("/", async function (req, res, next) {
	const posts = await Post.find().where("author").equals(req.payload.id).exec();
	return res.status(200).json({ posts: posts });
});


module.exports = router;