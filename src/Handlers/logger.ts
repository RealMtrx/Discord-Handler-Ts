import chalk from "chalk";
import boxen from "boxen";
import type { StartupData } from "../types.js";

export const startupReport = (data: StartupData): void => {
  const lines = [
    `Slash Commands: ${data.slash}`,
    `Prefix Commands: ${data.prefix}`,
    `Events Loaded: ${data.events}`,
    `Models Loaded: ${data.models}`,
    `AntiCrash: ${data.anticrash ? "Active" : "Inactive"}`,
    `MongoDB: ${data.mongo ? "Connected" : "Disconnected"}`,
  ];

  const report = lines
    .map((l) => {
      if (l.includes("Disconnected") || l.includes("Inactive")) {
        return `  ❌ ${chalk.red(l)}`;
      }
      return `  ✅ ${chalk.green(l)}`;
    })
    .join("\n");

  const boxed = boxen(report, {
    title: chalk.blue.bold(data.name || "DISCORD HANDLER"),
    titleAlignment: "center",
    padding: 1,
    margin: 1,
    borderStyle: "round",
    borderColor: "cyan",
  });

  console.log(boxed);
  console.log(
    chalk.magentaBright(
      `[ ${new Date().toLocaleString("en-GB", { timeZone: "Asia/Riyadh" })} ]`
    ),
    chalk.green("Bot is now online and fully operational.")
  );
};
