const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
dotenv.config();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("DB connection error:", err));
const userSchema = new mongoose.Schema({
  name: {
    type:String,
    required:true,
    minlength:4, },
  email: {
    type:String,
    required:true,
    unique:true,
    match:[/.+\@.+\..+/, "Please enter a valid email"],
  },
});
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
   Date: {
    type: Date,
    required: true,},
  location: {
    type: String,
    required: true,},
  organizerID: {},
});
const User = mongoose.model("User", userSchema);
const Event = mongoose.model("Event", eventSchema);
app.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: "user done", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/event", async (req, res) => {
  const { title, date, location, organizerID } = req.body;
  try {
    const user = await User.findById(organizerID);
    if (!user) return res.status(404).json({ error: "organizerID user not found" });
    const event = new Event({ title,date,location,organizerID });
    await event.save();
    res.status(201).json({ message: "event done", task });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
