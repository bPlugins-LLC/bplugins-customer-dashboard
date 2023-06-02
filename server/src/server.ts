import mongoose from "mongoose";
import "dotenv/config";

import app from "./app";

const port: number | string = process.env.PORT || 5000;

async function main() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/bplugins-customers");

    console.log("Database connected");
    app.listen(port, () => {
      console.log("server running on port", port);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
