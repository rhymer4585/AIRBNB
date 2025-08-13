const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const Chat = require("./models/chat.js");

const app = express();
const PORT = 9000;

// View Engine Setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method")); // To support PUT method via form

// Connect to MongoDB
async function connectToDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp");
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
}
connectToDB();

// ROUTES

// Home Route
app.get("/", (req, res) => {
  res.send("Hello from the server 🚀");
});

// Show all chats
app.get("/chats", async (req, res) => {
  try {
    const chats = await Chat.find();
    res.render("index", { chats });
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

// New chat form
app.get("/chats/new", (req, res) => {
  res.render("new");
});

// Handle chat creation
app.post("/chats", async (req, res) => {
  const { from, to, message } = req.body;

  if (!from || !to || !message) return res.send("⚠️ All fields are required.");

  try {
    await Chat.create({ from, to, message, created_at: new Date() });
    res.redirect("/chats");
  } catch (err) {
    res.status(500).send("❌ Failed to save chat");
  }
});

// Edit chat form
app.get("/chats/:id/edit", async (req, res) => {
  const { id } = req.params;
  const chat = await Chat.findById(id);
  res.render("edit", { chat });
});

// Update chat
app.put("/chats/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { msg } = req.body;  // <-- read 'msg' from form

    const updatedChat = await Chat.findByIdAndUpdate(
      id,
      { message: msg },  // <-- update 'message' field in DB
      {
        runValidators: true,
        new: true,
      }
    );

    console.log("Updated chat:", updatedChat);
    res.redirect("/chats");
  } catch (err) {
    console.error("Error updating chat:", err);
    res.status(500).send("Something went wrong while updating chat.");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
