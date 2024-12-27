import mongoose from "mongoose";
import config from "./config";
export function mongooseConnect() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.asPromise();
  } else {
    const uri = config.mongodbURI;
    return mongoose.connect(uri);
  }
}
