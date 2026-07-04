import { WebhookClient, Guild, Client } from "discord.js";
import config from "../config.js";
import type { ExtendedClient } from "../types.js";

let webhookClient: WebhookClient | null = null;

if (config.leaveGuildWebhook) {
  try {
    webhookClient = new WebhookClient({ url: config.leaveGuildWebhook });
  } catch {
    // silent
  }
}

export async function sendGuildLeaveEvent(guild: Guild, client: Client): Promise<void> {
  if (!webhookClient) return;

  try {
    const embed: Record<string, any> = {
      color: 0xff0000,
      title: "👋 Bot Left Server",
      description: `**Server:** ${guild.name}\n**ID:** ${guild.id}`,
      fields: [
        { name: "👑 Owner", value: `<@${guild.ownerId}>`, inline: true },
        { name: "👥 Members", value: `${guild.memberCount.toLocaleString()} members`, inline: true },
        { name: "📅 Left At", value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true },
        { name: "🌍 Region", value: guild.preferredLocale || "Unknown", inline: true },
        { name: "🔒 Verification", value: guild.verificationLevel.toString(), inline: true },
        { name: "📊 Remaining Servers", value: `${(client as ExtendedClient).guilds.cache.size} servers`, inline: true },
      ],
      thumbnail: {
        url: guild.iconURL({ size: 256 }) || "https:cdn.discordapp.com/embed/avatars/0.png",
      },
      footer: { text: `${config.botName} • Guild Leave Logger` },
      timestamp: new Date().toISOString(),
    };

    await webhookClient.send({ embeds: [embed] });
  } catch {
    // silent
  }
}
