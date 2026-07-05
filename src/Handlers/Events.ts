import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import chalk from "chalk";
import type { ExtendedClient, EventFile } from "../types.js";

export default async (client: ExtendedClient): Promise<number> => {
  const eventsPath = path.join(process.cwd(), "src", "Events");
  if (!fs.existsSync(eventsPath)) {
    console.log(chalk.yellow("[Events] No events found"));
    return 0;
  }

  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

  for (const file of eventFiles) {
    const fileURL = pathToFileURL(path.join(eventsPath, file)).href;
    const event: EventFile = (await import(fileURL)).default;
    if (event.once) {
      client.once(event.name, (...args: any[]) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args: any[]) => event.execute(...args, client));
    }
  }

  console.log(chalk.green(`[Events] ${eventFiles.length} events loaded`));
  return eventFiles.length;
};
