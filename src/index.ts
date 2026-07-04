import {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} from "discord.js";
import config from "./config.js";
import loadCommands from "./Handlers/Commands.js";
import loadEvents from "./Handlers/Events.js";
import loadPrefix from "./Handlers/Prefix.js";
import loadModels from "./Handlers/Models.js";
import { startupReport } from "./Handlers/logger.js";
import AntiCrash from "./Handlers/AntiCrash.js";
import connectMongo from "./Database/mongo.js";
import chalk from "chalk";
import type { ExtendedClient, SlashCommand, PrefixCommand } from "./types.js";

async function main() {
  console.log(chalk.cyan("╔══════════════════════════════════╗"));
  console.log(chalk.cyan("║     Starting Discord Handler     ║"));
  console.log(chalk.cyan("╚══════════════════════════════════╝\n"));

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Channel],
  }) as ExtendedClient;

  client.commands = new Collection<string, SlashCommand>();
  client.prefixCommands = new Collection<string, PrefixCommand>();
  client.config = config;

  console.log(chalk.blue("[System] Initializing AntiCrash..."));
  const anticrashActive = AntiCrash(client);
  console.log(
    anticrashActive
      ? chalk.green("[System] AntiCrash active")
      : chalk.red("[System] AntiCrash failed")
  );

  console.log(chalk.blue("[System] Connecting to MongoDB..."));
  const mongoConnected = await connectMongo();
  console.log(
    mongoConnected
      ? chalk.green("[System] MongoDB connected")
      : chalk.red("[System] MongoDB connection failed")
  );

  console.log(chalk.blue("[System] Loading slash commands..."));
  const slashCount = await loadCommands(client);
  console.log(chalk.green(`[System] ${slashCount} slash commands loaded`));

  console.log(chalk.blue("[System] Loading prefix commands..."));
  const prefixCount = await loadPrefix(client);
  console.log(chalk.green(`[System] ${prefixCount} prefix commands loaded`));

  console.log(chalk.blue("[System] Loading events..."));
  const eventsCount = await loadEvents(client);
  console.log(chalk.green(`[System] ${eventsCount} events loaded`));

  console.log(chalk.blue("[System] Loading models..."));
  const modelsCount = await loadModels();
  console.log(chalk.green(`[System] ${modelsCount} models loaded`));

  startupReport({
    name: config.botName,
    prefix: prefixCount,
    slash: slashCount,
    events: eventsCount,
    models: modelsCount,
    anticrash: anticrashActive,
    mongo: mongoConnected,
  });

  await client.login(config.token);
}

main().catch(console.error);
