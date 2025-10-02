const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Profile = require("./models/Profile");

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB Connected");

    const profile = new Profile({
      user: new mongoose.Types.ObjectId(), // fake user
      name: "John Doe",
      bio: "Seeding test profile 🚀",
      preferences: { theme: "dark", notifications: true }
    });

    await profile.save();
    console.log("✅ Profile created:", profile);
    mongoose.disconnect();
  })
  .catch(err => console.error(err));
