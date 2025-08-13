const mongoose = require("mongoose");
const Chat = require("./models/chat.js");

const allChats = [
  {
    from: "ayush",
    to: "rhymer",
    message: "let start business",
    created_at: new Date(),
  },
  {
    from: "nitin",
    to: "arav",
    message: "let do job",
    created_at: new Date(),
  },
  {
    from: "ayush",
    to: "nitin",
    message: "let start trading",
    created_at: new Date(),
  },
];

async function seedDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp");
    console.log("✅ MongoDB connected");

    await Chat.deleteMany(); // Clears old data
    console.log("🗑️ Old chats deleted");

    await Chat.insertMany(allChats);
    console.log("✅ New chats inserted");

    mongoose.connection.close();
    console.log("🔌 DB connection closed");
  } catch (err) {
    console.error("❌ Error seeding DB:", err);
  }
}

seedDB();
