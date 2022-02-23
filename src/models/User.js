import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  avatarUrl: String,
  socialOnly: { type: Boolean, default: false },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  name: { type: String, required: true },
  location: String,
});

//password 암호화
userSchema.pre("save", async function () {
  console.log("Users password: ", this.password);
  this.password = await bcrypt.hash(this.password, 5);
  console.log("Hashed password: ", this.password);
});

const User = mongoose.model("User", userSchema);
export default User;
