import { sendGuildLeaveEvent } from "../Core/leaveGuildWebhook.js";
import type { ExtendedClient, EventFile } from "../types.js";

export default {
  name: "guildDelete",
  execute(guild: any, client: ExtendedClient) {
    sendGuildLeaveEvent(guild, client);
  },
} satisfies EventFile;
