import { REST, Routes } from "discord.js";
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import config from "../config.js";
import chalk from "chalk";
import type { ExtendedClient, SlashCommand } from "../types.js";

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else if (file.endsWith(".ts") || file.endsWith(".js")) {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

export default async (client: ExtendedClient): Promise<number> => {
  const slashCommands: any[] = [];
  const commandsPath = path.join(process.cwd(), "src", "Commands", "Slash");

  if (!fs.existsSync(commandsPath)) {
    console.log(chalk.yellow("[Slash] No commands found"));
    return 0;
  }

  const commandFiles = getAllFiles(commandsPath);

  for (const file of commandFiles) {
    const fileURL = pathToFileURL(file).href;
    const command: SlashCommand = (await import(fileURL)).default;
    if (command?.data) {
      client.commands.set(command.data.name, command);
      slashCommands.push(command.data.toJSON());
    }
  }

  console.log(chalk.green(`[Slash] ${slashCommands.length} commands loaded`));

  try {
    const rest = new REST({ version: "10" }).setToken(config.token);
    if (slashCommands.length) {
      await rest.put(Routes.applicationCommands(config.clientId), {
        body: slashCommands,
      });
      console.log(chalk.green("[Slash] Registered with Discord API"));
    }
  } catch (e) {
    console.error(chalk.red("[Slash] Failed to register:"), (e as Error).message);
  }

  return slashCommands.length;
};
