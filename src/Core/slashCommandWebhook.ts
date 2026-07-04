import { WebhookClient, User } from "discord.js";
import config from "../config.js";
import emojis from "../Core/emojis.js";
import type { WebhookContext } from "../types.js";

let webhookClient: WebhookClient | null = null;

if (config.slashCommandWebhook) {
  try {
    webhookClient = new WebhookClient({ url: config.slashCommandWebhook });
  } catch {
    // silent
  }
}

export async function sendSlashCommandUsage(
  user: User,
  commandName: string,
  guildName: string
): Promise<void> {
  if (!webhookClient) return;

  try {
    const embed: Record<string, any> = {
      color: 0x5865f2,
      title: `${emojis.slash} Slash Command Used`,
      description: `**Command:** \`/${commandName}\``,
      fields: [
        { name: `${emojis.user} User Info`, value: `**UserName:** ${user.tag}\n**ID:** ${user.id}`, inline: true },
        { name: `${emojis.server} Server`, value: guildName || "Direct Message", inline: true },
        { name: `${emojis.loading} Time`, value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true },
      ],
      thumbnail: { url: user.displayAvatarURL({ size: 256 }) },
      footer: { text: `${config.botName} • Slash Command Logger` },
      timestamp: new Date().toISOString(),
    };

    await webhookClient.send({ embeds: [embed] });
  } catch {
    // silent
  }
}

export async function sendSlashCommandError(
  error: Error,
  context: WebhookContext = {}
): Promise<void> {
  if (!webhookClient) return;

  try {
    const embed: Record<string, any> = {
      color: 0xff0000,
      title: `${emojis.slash} SlashCommand Error`,
      description: `**Command:** \`/${context.commandName}\`\n**Error:** ${error.message}`,
      fields: [
        { name: `${emojis.user} User Info`, value: context.user ? `${context.user.tag} (${context.user.id})` : "Unknown", inline: true },
        { name: `${emojis.server} Server`, value: context.guild ? `${context.guild.name} (${context.guild.id})` : "DM", inline: true },
        { name: `${emojis.loading} Time`, value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true },
      ],
      footer: { text: `${config.botName} • Error Logger` },
      timestamp: new Date().toISOString(),
    };

    if (error.stack) {
      const stackTrace =
        error.stack.length > 1000
          ? error.stack.substring(0, 1000) + "..."
          : error.stack;
      embed.fields.push({
        name: "📋 Stack Trace",
        value: `\`\`\`js\n${stackTrace}\`\`\``,
        inline: false,
      });
    }

    await webhookClient.send({ embeds: [embed] });
  } catch {
    // silent
  }
}
