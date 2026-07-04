import {
  Client,
  Collection,
  ChatInputCommandInteraction,
  Message,
  Guild,
  User,
} from "discord.js";

export interface Config {
  token: string;
  clientId: string;
  botName: string;
  prefix: string;
  ownerIds: string[];
  MONGODB_URI: string;
  errorWebhook?: string;
  slashCommandWebhook?: string;
  prefixCommandWebhook?: string;
  joinGuildWebhook?: string;
  leaveGuildWebhook?: string;
  readyWebhook?: string;
}

export interface SlashCommand {
  dir?: string;
  data: any;
  run: (client: ExtendedClient, interaction: ChatInputCommandInteraction) => Promise<void>;
  cooldown?: number;
}

export interface PrefixCommand {
  dir?: string;
  name: string;
  description?: string;
  aliases?: string[];
  run: (client: ExtendedClient, message: Message, args: string[]) => Promise<void>;
  cooldown?: number;
}

export interface EventFile {
  name: string;
  once?: boolean;
  execute: (...args: any[]) => void;
}

export interface ExtendedClient extends Client {
  commands: Collection<string, SlashCommand>;
  prefixCommands: Collection<string, PrefixCommand>;
  config: Config;
}

export interface StartupData {
  name: string;
  prefix: number;
  slash: number;
  events: number;
  models: number;
  anticrash: boolean;
  mongo: boolean;
}

export interface WebhookContext {
  eventName?: string;
  commandName?: string;
  user?: User;
  guild?: Guild | null;
}
