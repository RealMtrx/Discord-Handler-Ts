import {
  checkCooldown,
  formatError,
} from "../Core/commandUtils.js";
import {
  sendSlashCommandUsage,
  sendSlashCommandError,
} from "../Core/slashCommandWebhook.js";
import { sendErrorToWebhook } from "../Core/errorWebhook.js";
import { MessageFlags } from "discord.js";
import type { ExtendedClient, EventFile } from "../types.js";

export default {
  name: "interactionCreate",
  async execute(interaction: any, client: ExtendedClient) {
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    const cooldownResult = checkCooldown(
      interaction.user.id,
      interaction.commandName,
      command.cooldown || 3000
    );
    if (cooldownResult.onCooldown) {
      return interaction.reply({
        content: `⏰ Please wait ${cooldownResult.timeLeft} seconds before using this command again.`,
        flags: 64,
      });
    }

    sendSlashCommandUsage(
      interaction.user,
      interaction.commandName,
      interaction.guild?.name || "DM"
    );

    try {
      await command.run(client, interaction);
    } catch (error) {
      const err = error as Error;

      sendSlashCommandError(err, {
        commandName: interaction.commandName,
        user: interaction.user,
        guild: interaction.guild,
      });

      sendErrorToWebhook(err, {
        commandName: interaction.commandName,
        user: interaction.user,
        guild: interaction.guild,
      });

      if (!interaction.replied && !interaction.deferred) {
        try {
          await interaction.reply({
            content: "❌ Error executing command! Please try again later.",
        flags: MessageFlags.Ephemeral,
          });
        } catch {
          // silent
        }
      }
    }
  },
} satisfies EventFile;
