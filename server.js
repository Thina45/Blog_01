import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import POST from "./Models/post.js";
import dotenv from "dotenv";
// Import POST model
dotenv.config();
// MongoDB connection URL
const mongooseUrl =
  "mongodb+srv://Thinasharma45:Thina9677@blog.pkvb0ss.mongodb.net/blogdb";

// Establish MongoDB connection
const dbConnection = async () => {
  try {
    await mongoose.connect(mongooseUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB Connection Successful");
  } catch (error) {
    console.log("DB Connection Error: ", error);
  }
};

dbConnection();

const app = express();
const port = 3000; // Front-end and API server

// Middleware
app.use(express.static("public")); // Serve static files (CSS, images, etc.)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// FRONT-END ROUTES

// Route to render the main page
app.get("/", async (req, res) => {
  try {
    const posts = await POST.find(); // Fetch all posts from MongoDB
    res.render("index.ejs", { posts });
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
});

// Route to render the "New Post" page
app.get("/new", (req, res) => {
  res.render("modify.ejs", { heading: "New Post", submit: "Create Post" });
});

// Route to render the "Edit Post" page
app.get("/edit/:id", async (req, res) => {
  try {
    const post = await POST.findById(req.params.id); // Fetch post by ID
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.render("modify.ejs", {
      heading: "Edit Post",
      submit: "Update Post",
      post,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching post" });
  }
});

// API ROUTES

// Create a new post
app.post("/api/posts", async (req, res) => {
  try {
    const newPost = new POST({
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
      date: new Date(),
    });
    await newPost.save(); // Save the new post to MongoDB
    res.redirect("/"); // Redirect to home page after creating post
  } catch (error) {
    res.status(500).json({ message: "Error creating post" });
  }
});

// Update an existing post
app.post("/api/posts/:id", async (req, res) => {
  try {
    const updatedPost = await POST.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        date: new Date(),
      },
      { new: true } // Return the updated document
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.redirect("/"); // Redirect to home page after updating post
  } catch (error) {
    res.status(500).json({ message: "Error updating post" });
  }
});

// Delete a post
app.get("/api/posts/delete/:id", async (req, res) => {
  try {
    const deletedPost = await POST.findByIdAndDelete(req.params.id); // Delete post by ID
    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.redirect("/"); // Redirect to home page after deleting post
  } catch (error) {
    res.status(500).json({ message: "Error deleting post" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
