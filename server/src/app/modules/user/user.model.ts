import { Schema, model } from "mongoose";

import IUser from "./user.interface";

const UserSchema = new Schema<IUser>(
  {
    name: {
      firstName: { type: String, required: true },
      lastName: { type: String },
    },
    email: { type: String, required: true, unique: true },
    roles: {
      type: [String],
      required: true,
      default: ["customer"],
    },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

// Create the User model
const User = model<IUser>("User", UserSchema);

export default User;
