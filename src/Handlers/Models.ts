import fs from "fs";
import path from "path";
import chalk from "chalk";

export default async (): Promise<number> => {
  const modelsPath = path.join(process.cwd(), "src", "Models");
  if (!fs.existsSync(modelsPath)) {
    console.log(chalk.yellow("[Models] No models found"));
    return 0;
  }

  const modelFiles = fs
    .readdirSync(modelsPath)
    .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

  for (const file of modelFiles) {
    await import(`../Models/${file}`);
  }

  console.log(chalk.green(`[Models] ${modelFiles.length} models loaded`));
  return modelFiles.length;
};
