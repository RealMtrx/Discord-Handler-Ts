import mongoose from "mongoose";
import config from "../config.js";
import chalk from "chalk";

export default async (): Promise<boolean> => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    return true;
  } catch (error) {
    console.error(chalk.red(`[MongoDB] Connection failed: ${(error as Error).message}`));
    return false;
  }
};
