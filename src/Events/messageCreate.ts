import {
  checkCooldown,
  formatError,
} from "../Core/commandUtils.js";
import {
  sendPrefixCommandUsage,
  sendPrefixCommandError,
} from "../Core/prefixCommandWebhook.js";
import { sendErrorToWebhook } from "../Core/errorWebhook.js";
import type { ExtendedClient, EventFile } from "../types.js";

export default {
  name: "messageCreate",
  async execute(message: any, client: ExtendedClient) {
    if (message.author.bot || !message.guild) return;
    if (!message.content.startsWith(client.config.prefix)) return;

    const args = message.content
      .slice(client.config.prefix.length)
      .trim()
      .split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.prefixCommands.get(commandName);

    if (!command) return;

    const cooldownResult = checkCooldown(
      message.author.id,
      commandName,
      command.cooldown || 3000
    );
    if (cooldownResult.onCooldown) {
      return message.reply(
        `⏰ Please wait ${cooldownResult.timeLeft} seconds before using this command again.`
      );
    }

    sendPrefixCommandUsage(message.author, commandName, message.guild.name);

    try {
      await command.run(client, message, args);
    } catch (error) {
      const err = error as Error;

      sendPrefixCommandError(err, {
        commandName: commandName,
        user: message.author,
        guild: message.guild,
      });

      sendErrorToWebhook(err, {
        commandName: commandName,
        user: message.author,
        guild: message.guild,
      });

      if (!message.replied) {
        try {
          await message.reply(
            "❌ Error executing command! Please try again later."
          );
        } catch {
          // silent
        }
      }
    }
  },
} satisfies EventFile;
