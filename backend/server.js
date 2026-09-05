require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/User");
const Post = require("./models/Post");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err.message));

// Signup
app.post("/api/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email,
      password: hashedPassword
    });

    res.json({ message: "Account created" });
  } catch (error) {
    res.status(500).json({ message: "Signup failed" });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.json({
      message: "Login successful",
      token,
      username: user.username
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});

// Create Post
app.post("/api/posts", authenticate, async (req, res) => {
  try {
    const { text, image } = req.body;
    const username = req.user.username;

    if (!text && !image) {
      return res.status(400).json({
        message: "Post cannot be empty"
      });
    }

    const post = await Post.create({
      username,
      text,
      image,
      likes: [],
      comments: []
    });

    res.json(post);
  } catch (error) {
    res.status(500).json({
      message: "Post creation failed"
    });
  }
});

// Get Posts
app.get("/api/posts", async (req, res) => {
  try {
    const posts = await Post.find().sort({ _id: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch posts"
    });
  }
});

// Like
app.put("/api/posts/:id/like", authenticate, async (req, res) => {
  try {
    const username = req.user.username;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    if (post.likes.includes(username)) {
      post.likes = post.likes.filter(
        (user) => user !== username
      );
    } else {
      post.likes.push(username);
    }

    await post.save();

    res.json({
      _id: post._id,
      likes: post.likes
    });
  } catch (error) {
    console.log("Like error:", error.message);

    res.status(500).json({
      message: "Like failed"
    });
  }
});

// Comment
app.put("/api/posts/:id/comment", authenticate, async (req, res) => {
  try {
    const { text } = req.body;
    const username = req.user.username;

    if (!text) {
      return res.status(400).json({
        message: "Comment cannot be empty"
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    post.comments.push({
      username,
      text
    });

    await post.save();

    res.json({
      _id: post._id,
      comments: post.comments
    });
  } catch (error) {
    res.status(500).json({
      message: "Comment failed"
    });
  }
});

// Delete
app.delete("/api/posts/:id", authenticate, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    if (post.username !== req.user.username) {
      return res.status(403).json({
        message: "You can delete only your own posts"
      });
    }

    await post.deleteOne();

    res.json({
      message: "Post deleted"
    });
  } catch (error) {
    res.status(500).json({
      message: "Delete failed"
    });
  }
});

// Root API
app.get("/", (req, res) => {
  res.json({
    message: "API is running"
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});