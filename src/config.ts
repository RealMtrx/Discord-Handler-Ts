import "dotenv/config";
import type { Config } from "./types.js";

export default {
  token: "#",
  clientId: "#",
  botName: "Discord Handler",
  prefix: "$",
  ownerIds: ["#", "#"],
  MONGODB_URI: "#",
  errorWebhook: "#",
  slashCommandWebhook: "#",
  prefixCommandWebhook: "#",
  joinGuildWebhook: "#",
  leaveGuildWebhook: "#",
  readyWebhook: "#",
} satisfies Config;
