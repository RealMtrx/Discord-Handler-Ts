import { sendGuildJoinEvent } from "../Core/joinGuildWebhook.js";
import type { ExtendedClient, EventFile } from "../types.js";

export default {
  name: "guildCreate",
  execute(guild: any, client: ExtendedClient) {
    sendGuildJoinEvent(guild, client);
  },
} satisfies EventFile;
