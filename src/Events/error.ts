import { sendErrorToWebhook } from "../Core/errorWebhook.js";
import type { ExtendedClient, EventFile } from "../types.js";

export default {
  name: "error",
  execute(error: Error, client: ExtendedClient) {
    sendErrorToWebhook(error, {
      eventName: "error",
      guild: client.guilds?.cache?.first(),
      user: client.user ?? undefined,
    });
  },
} satisfies EventFile;
