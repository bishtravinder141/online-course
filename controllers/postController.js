const Post = require("../models/postModel");
const User = require("../models/userModel");
const catchAsyncErrors = require("../middleware/catchAsyncError");


const createPost = catchAsyncErrors(async (req, res, next) => {
    const newPost = {
        caption: req.body.caption,
        image: {
            public_id: "myCloud.public_id",
            url: "myCloud.secure_url",
        },
        owner: req.user._id,
    }
    const post = await Post.create(newPost);

    const user = await User.findById(req.user._id);

    user.posts.unshift(post._id);
    await user.save();
    res.status(201).json({
        success: true,
        message: "Post created",
    });
})

const postLikeAndUnlike = catchAsyncErrors(async (req, res, next) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
        return res.status(404).json({
            success: false,
            message: "Post not found",
        });
    }

    if (post.likes.includes(req.user._id)) {
        const index = post.likes.indexOf(req.user._id);

        post.likes.splice(index, 1);

        await post.save();

        return res.status(200).json({
            success: true,
            message: "Post Unliked",
        });
    } else {
        post.likes.push(req.user._id);

        await post.save();

        return res.status(200).json({
            success: true,
            message: "Post Liked",
        });
    }
})

const deletePost = catchAsyncErrors(async (req, res, next) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        return res.status(404).json({
            success: false,
            message: "Post not found",
        });
    }

    if (post.owner.toString() !== req.user._id.toString()) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }

    // await cloudinary.v2.uploader.destroy(post.image.public_id);

    await post.deleteOne();

    const user = await User.findById(req.user._id);

    const index = user.posts.indexOf(req.params.id);
    user.posts.splice(index, 1);

    await user.save();

    res.status(200).json({
        success: true,
        message: "Post deleted",
    });
})


const getPostOfFollowing =catchAsyncErrors(async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
  
      const posts = await Post.find({
        owner: {
          $in: user.following,
        },
      })
  
      res.status(200).json({
        success: true,
        posts: posts.reverse(),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });

  const updateCaption = catchAsyncErrors(async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
  
      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Post not found",
        });
      }
  
      if (post.owner.toString() !== req.user._id.toString()) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }
  
      post.caption = req.body.caption;
      await post.save();
      res.status(200).json({
        success: true,
        message: "Post updated",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });

module.exports = {
    createPost,
    postLikeAndUnlike,
    deletePost,
    getPostOfFollowing,
    updateCaption
}
