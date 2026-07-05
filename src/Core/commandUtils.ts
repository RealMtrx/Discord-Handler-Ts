import { Collection } from "discord.js";

const cooldowns = new Collection<string, Collection<string, number>>();

setInterval(() => {
  const now = Date.now();
  for (const [commandName, timestamps] of cooldowns) {
    for (const [userId, time] of timestamps) {
      if (now - time > 30000) {
        timestamps.delete(userId);
      }
    }
    if (timestamps.size === 0) {
      cooldowns.delete(commandName);
    }
  }
}, 300000);

export function checkCooldown(
  userId: string,
  commandName: string,
  cooldownTime: number = 3000
): { onCooldown: boolean; timeLeft?: number } {
  if (!cooldowns.has(commandName)) {
    cooldowns.set(commandName, new Collection<string, number>());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(commandName)!;
  const cooldownAmount = cooldownTime;

  if (timestamps.has(userId)) {
    const expirationTime = timestamps.get(userId)! + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return { onCooldown: true, timeLeft: Math.round(timeLeft) };
    }
  }

  timestamps.set(userId, now);

  return { onCooldown: false };
}

export function logCommandUsage(
  user: { tag: string; id: string },
  commandName: string,
  guildName: string
): void {
  // placeholder
}

export function formatError(
  error: Error,
  commandName: string
): { message: string; stack?: string; commandName: string; timestamp: string } {
  return {
    message: error.message,
    stack: error.stack,
    commandName,
    timestamp: new Date().toISOString(),
  };
}
