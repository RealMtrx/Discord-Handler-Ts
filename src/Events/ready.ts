import { sendBotReadyEvent } from "../Core/readyWebhook.js";
import type { ExtendedClient, EventFile } from "../types.js";

export default {
  name: "ready",
  once: true,
  execute(client: ExtendedClient) {
    client.user!.setPresence({
      activities: [{ name: client.config.botName, type: 0 }],
      status: "online",
    });

    sendBotReadyEvent(client);
  },
} satisfies EventFile;
