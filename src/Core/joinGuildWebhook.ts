import { WebhookClient, Guild, Client } from "discord.js";
import config from "../config.js";
import type { ExtendedClient } from "../types.js";

let webhookClient: WebhookClient | null = null;

if (config.joinGuildWebhook) {
  try {
    webhookClient = new WebhookClient({ url: config.joinGuildWebhook });
  } catch (e) {
    console.error("[Webhook] Failed to create join guild webhook client:", e);
  }
}

export async function sendGuildJoinEvent(guild: Guild, client: Client): Promise<void> {
  if (!webhookClient) return;

  try {
    const embed: Record<string, any> = {
      color: 0x57f287,
      title: "🎉 Bot Joined New Server!",
      description: `**Server:** ${guild.name}\n**ID:** ${guild.id}`,
      fields: [
        { name: "👑 Owner", value: `<@${guild.ownerId}>`, inline: true },
        { name: "👥 Members", value: `${guild.memberCount.toLocaleString()} members`, inline: true },
        { name: "📅 Joined At", value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true },
        { name: "🌍 Region", value: guild.preferredLocale || "Unknown", inline: true },
        { name: "🔒 Verification", value: guild.verificationLevel.toString(), inline: true },
        { name: "📊 Total Servers", value: `${(client as ExtendedClient).guilds.cache.size} servers`, inline: true },
      ],
      thumbnail: {
        url: guild.iconURL({ size: 256 }) || "https://cdn.discordapp.com/embed/avatars/0.png",
      },
      footer: { text: `${config.botName} • Guild Join Logger` },
      timestamp: new Date().toISOString(),
    };

    await webhookClient.send({ embeds: [embed] });
  } catch (e) {
    console.error("[Webhook] Failed to send guild join webhook:", e);
  }
}
