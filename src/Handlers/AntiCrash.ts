import chalk from "chalk";
import { EmbedBuilder, WebhookClient } from "discord.js";
import config from "../config.js";
import type { ExtendedClient } from "../types.js";

export default (client: ExtendedClient): boolean => {
  const webhook = config.errorWebhook
    ? new WebhookClient({ url: config.errorWebhook })
    : null;

  const sendError = async (title: string, error: unknown, origin: string | null = null) => {
    try {
      const description =
        typeof error === "string"
          ? error
          : error && (error as Error).stack
            ? (error as Error).stack!
            : String(error);

      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle(`🚨 ${title}`)
        .setDescription(`\`\`\`js\n${description.slice(0, 1900)}\n\`\`\``)
        .addFields(
          { name: "Origin", value: origin ? `\`${origin}\`` : "N/A", inline: true },
          { name: "Time", value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true }
        )
        .setFooter({ text: `AntiCrash • ${config.botName}` });

      if (webhook) {
        await webhook.send({ embeds: [embed] }).catch(() => {});
      }
    } catch (err) {
      console.error(chalk.red("[AntiCrash] Failed to send error to Discord"), err);
    }
  };

  process.on("unhandledRejection", (reason) => {
    console.error(chalk.red("[AntiCrash] Unhandled Rejection"), reason);
    sendError("Unhandled Rejection", reason);
  });

  process.on("uncaughtException", (err, origin) => {
    console.error(chalk.red("[AntiCrash] Uncaught Exception"), err);
    sendError("Uncaught Exception", err, origin);
  });

  process.on("uncaughtExceptionMonitor", (err, origin) => {
    console.error(chalk.red("[AntiCrash] Uncaught Exception Monitor"), err);
    sendError("Uncaught Exception Monitor", err, origin);
  });

  process.on("warning", (warn) => {
    console.warn(chalk.yellow("[AntiCrash] Warning"), warn);
    sendError("Process Warning", warn);
  });

  return true;
};
