import mongoose from "mongoose";
import dns from "dns";
import config from "../config.js";
import chalk from "chalk";

dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

export default async (): Promise<boolean> => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    return true;
  } catch (error) {
    console.error(chalk.red(`[MongoDB] Connection failed: ${(error as Error).message}`));
    return false;
  }
};
