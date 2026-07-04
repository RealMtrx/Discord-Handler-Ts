import { WebhookClient } from "discord.js";
import config from "../config.js";
import type { WebhookContext } from "../types.js";

let webhookClient: WebhookClient | null = null;

if (config.errorWebhook) {
  try {
    webhookClient = new WebhookClient({ url: config.errorWebhook });
  } catch {
    // silent
  }
}

export async function sendErrorToWebhook(error: Error, context: WebhookContext = {}): Promise<void> {
  if (!webhookClient) return;

  try {
    const embed: Record<string, any> = {
      color: 0xff0000,
      title: "❌ Bot Error Report",
      description: `**Error Type:** ${error.name || "Unknown"}\n**Message:** ${error.message}`,
      fields: [
        {
          name: "📅 Timestamp",
          value: new Date().toISOString(),
          inline: true,
        },
        {
          name: "🔧 Context",
          value: context.eventName || context.commandName || "Unknown",
          inline: true,
        },
      ],
      footer: {
        text: `${config.botName} • Error Logger`,
      },
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

    if (context.user) {
      embed.fields.push({
        name: "👤 User",
        value: `${context.user.tag} (${context.user.id})`,
        inline: true,
      });
    }

    if (context.guild) {
      embed.fields.push({
        name: "🏠 Guild",
        value: `${context.guild.name} (${context.guild.id})`,
        inline: true,
      });
    }

    await webhookClient.send({ embeds: [embed] });
  } catch {
    // silent
  }
}
